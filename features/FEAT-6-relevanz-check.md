# FEAT-6: Relevanz-Check

## Status
Aktueller Schritt: IA/UX

## Abhängigkeiten
- Benötigt: FEAT-1 (Todo-Verwaltung) – Todos ohne Deadline, FEAT-3 (Status-Management) – nur aktive Todos

---

## 1. Feature Spec
*Ausgefüllt von: /requirements — 2026-03-27*

### Beschreibung
Todos ohne Deadline, die seit 14 Tagen nicht verändert wurden, lösen beim App-Öffnen einen Relevanz-Check aus. Der Nutzer wird gefragt: "Noch relevant? Erledigt?" Bei "Noch relevant" kann optional eine Deadline gesetzt werden. Bei "Erledigt" wird das Todo direkt abgeschlossen. Der Check-Timer setzt sich nach jeder Antwort zurück.

### Definitionen
- **Inaktives Todo:** Ein Todo ohne Deadline mit Status Offen oder In Arbeit, das seit mindestens 14 Tagen nicht bearbeitet (weder Status-Änderung noch Inhalt-Änderung) wurde.
- **Relevanz-Check:** In-App-Prompt beim App-Öffnen, der für inaktive Todos fragt: "Noch relevant?" oder "Erledigt?".
- **Inaktivitäts-Timer:** Wird bei jeder Änderung eines Todos (Titel, Status, Deadline, Komplexität, Unteraufgaben) zurückgesetzt. Läuft 14 Tage.
- **Check-Reset:** Nach Beantworten des Relevanz-Checks (unabhängig von der Antwort) startet der Inaktivitäts-Timer neu.

### User Stories
- Als Nutzer möchte ich nach 14 Tagen Inaktivität eines Todos ohne Deadline gefragt werden, ob es noch relevant ist, damit keine vergessenen Aufgaben im System schlummern.
- Als Nutzer möchte ich beim Relevanz-Check direkt ein Todo als erledigt markieren können, ohne extra in die Liste gehen zu müssen.
- Als Nutzer möchte ich beim Bestätigen der Relevanz optional eine Deadline setzen können, um das Todo wieder in den aktiven Fokus zu bringen.

### Acceptance Criteria
- [ ] Ein Todo ohne Deadline mit Status Offen oder In Arbeit, das seit ≥ 14 Tagen nicht geändert wurde, löst beim App-Öffnen einen Relevanz-Check aus.
- [ ] Der Relevanz-Check zeigt den Todo-Titel und zwei Optionen: "Noch relevant" und "Erledigt".
- [ ] Wählt der Nutzer "Erledigt", wird das Todo sofort auf Status Erledigt gesetzt.
- [ ] Wählt der Nutzer "Noch relevant", erscheint ein optionales Deadline-Feld; Nutzer kann speichern ohne Deadline.
- [ ] Nach jeder Beantwortung (egal welche Option) setzt sich der 14-Tage-Timer zurück.
- [ ] Jede Änderung am Todo (Inhalt oder Status) setzt den 14-Tage-Timer zurück.
- [ ] Todos mit Status Wartet oder Erledigt erhalten keinen Relevanz-Check.
- [ ] Todos mit Deadline erhalten keinen Relevanz-Check (→ FEAT-5 Reminder).
- [ ] Mehrere inaktive Todos werden als Liste im Check angezeigt, nicht einzeln nacheinander.

### Edge Cases
- **Nutzer schließt den Check ohne Antwort (wegtippen):** Timer läuft weiter, Check erscheint beim nächsten App-Öffnen erneut.
- **Todo erhält während des Checks eine Deadline gesetzt:** Nach Speichern ist das Todo kein Kandidat mehr für zukünftige Relevanz-Checks.
- **Mehrere Todos gleichzeitig im Check:** Liste aller betroffenen Todos, jedes individuell beantwortbar.
- **Todo war im Papierkorb und wird wiederhergestellt:** Timer beginnt neu ab dem Wiederherstellungszeitpunkt.
- **Check erscheint direkt nach Erstellen eines Todos:** Nicht möglich – neues Todo hat Timer 0, Schwelle erst nach 14 Tagen.

### Nicht im Scope
- Wöchentlicher Check unabhängig von Inaktivität
- Konfigurierbare Inaktivitäts-Schwelle durch den Nutzer
- Relevanz-Check für Todos mit Deadline (→ FEAT-5)
- Automatisches Löschen ohne Nutzer-Bestätigung

---

## 2. IA/UX Entscheidungen
*Ausgefüllt von: /ia-ux — 2026-03-27*

### Einbettung im Produkt
Aktions-Banner in der Banner-Area auf `/`, direkt unter Reminder-Banners (FEAT-5). Erscheinen beim App-Öffnen wenn Inaktivitäts-Bedingungen erfüllt. Haben im Gegensatz zu Reminder-Banners interaktive Aktions-Buttons.

### Einstiegspunkte
Kein aktiver Einstieg – Banners erscheinen automatisch beim App-Öffnen wenn Todos ≥14 Tage inaktiv.

### User Flow
```
App öffnen (/)
    → Relevanz-Check: Welche Todos ohne Deadline sind ≥14 Tage inaktiv?
    → Für jeden Treffer: Relevanz-Check-Banner erscheint

Banner sichtbar:
┌──────────────────────────────────────────────────┐
│ ❓ Noch relevant?  "Alte Projektidee"             │
│              [Erledigt]  [Noch relevant]          │
└──────────────────────────────────────────────────┘

Tap [Erledigt]:
    → Todo wird sofort auf "Erledigt" gesetzt
    → Banner verschwindet
    → Kurze Erfolgs-Animation auf Banner (grünes Flash, 200ms)

Tap [Noch relevant]:
    → Banner erweitert sich vertikal (expand, 200ms)
    → Zeigt optionales Deadline-Feld:
      "Deadline setzen (optional): [Datum wählen]"
    → Tap [Speichern ohne Datum] oder Datum wählen → Speichern
    → Banner verschwindet, Timer resettet

Tap ✕ ohne Antwort:
    → Banner verschwindet für diese Session
    → Timer läuft weiter (nächste Öffnung: Banner erscheint wieder)
```

### Interaktionsmuster
- **Primärmuster:** Aktions-Banner mit inline Entscheidung (kein Modal-Interrupt)
- **Erledigt:** Destruktive Schnell-Aktion (grüne Akzentfarbe, da positiv: Aufgabe erledigt)
- **Noch relevant:** Expandierendes Banner mit optionalem Deadline-Picker
- **Mehrere Checks:** Gestapelt wie Reminder-Banners, jeder individuell beantwortbar
- **Leerer Zustand:** Kein Banner = Banner-Area collapsed
- **Fehler-Handling:** Nicht nötig – beide Antworten sind immer valid

### Konzeptionelle Komponentenstruktur
```
BannerArea
└── RelevanzCheckBanner (wiederholt)
    ├── QuestionIcon (Lucide HelpCircle, 16px)
    ├── CheckText ("Noch relevant? [Titel]")
    ├── DismissButton [✕]
    ├── ActionRow
    │   ├── DoneButton [Erledigt]
    │   └── RelevantButton [Noch relevant]
    └── DeadlineExpansion (conditional, nach Tap "Noch relevant")
        ├── DeadlinePicker (optional)
        └── SaveButton [Speichern]
```

### Barrierefreiheit (A11y)
- Banner: `role="region"`, `aria-label="Relevanz-Check: [Todo-Titel]"`
- Aktions-Buttons: klare Labels, nicht nur "Ja" / "Nein"
- Expandierender Bereich: `aria-expanded` auf dem Banner-Container
- Deadline-Picker (conditional): nach Expand automatisch fokussiert

### Mobile-Verhalten
- Zwei Aktions-Buttons nebeneinander, ≥44pt, full-width des Banners
- Expansion bei "Noch relevant": smooth height animation (200ms ease-out)
- Deadline-Picker: System-nativer Date-Picker (kein Custom-Calendar)
