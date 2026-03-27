# FEAT-3: Status-Management

## Status
Aktueller Schritt: IA/UX

## Abhängigkeiten
- Benötigt: FEAT-1 (Todo-Verwaltung), FEAT-2 (Automatische Priorisierung) – Status beeinflusst Score-Sortierung

---

## 1. Feature Spec
*Ausgefüllt von: /requirements — 2026-03-27*

### Beschreibung
Jedes Todo hat einen Status, der seinen Bearbeitungsfortschritt widerspiegelt. Der Status kann jederzeit frei geändert werden. Der "Wartet"-Status hat eine Sonderrolle: er senkt den Prioritäts-Score auf 0 und ermöglicht optional einen Freitext ("Wartet auf..."). Erledigte Todos verschwinden aus der aktiven Liste, bleiben aber im System gespeichert.

### Definitionen
- **Status:** Eigenschaft eines Todos mit vier möglichen Werten: Offen, In Arbeit, Wartet auf etwas, Erledigt.
- **Aktive Todos:** Todos mit Status Offen, In Arbeit oder Wartet – erscheinen in der priorisierten Liste.
- **Erledigte Todos:** Todos mit Status Erledigt – werden aus der aktiven Liste ausgeblendet, bleiben aber im System für Statistiken (FEAT-7) und können reaktiviert werden.
- **Wartet-Notiz:** Optionaler Freitext, der beschreibt, worauf bei einem Todo gewartet wird (z.B. "Wartet auf Feedback von Anna").

### User Stories
- Als Nutzer möchte ich den Status eines Todos ändern, um meinen Fortschritt festzuhalten.
- Als Nutzer möchte ich ein Todo als "In Arbeit" markieren, um sichtbar zu machen, woran ich gerade arbeite.
- Als Nutzer möchte ich ein Todo auf "Wartet auf etwas" setzen und optional notieren, worauf ich warte, damit es aus meinem aktiven Fokus verschwindet.
- Als Nutzer möchte ich ein Todo als "Erledigt" markieren, um es aus meiner aktiven Liste zu entfernen.
- Als Nutzer möchte ich ein erledigtes Todo reaktivieren können, falls doch noch Arbeit anfällt.

### Acceptance Criteria
- [ ] Jedes Todo hat einen Status: Offen (Standard bei Erstellung), In Arbeit, Wartet auf etwas, oder Erledigt.
- [ ] Der Status kann jederzeit frei geändert werden, inkl. von Erledigt zurück zu Offen.
- [ ] Ein Todo mit Status "Wartet auf etwas" erhält Score 0 und erscheint am Ende der aktiven Liste.
- [ ] Beim Setzen von "Wartet auf etwas" kann optional ein Freitext ("Wartet auf...") angegeben werden.
- [ ] Die Wartet-Notiz ist nach dem Setzen sichtbar und editierbar.
- [ ] Erledigte Todos werden aus der aktiven Liste ausgeblendet (nicht gelöscht).
- [ ] Erledigte Todos bleiben im System gespeichert und für FEAT-7 (Statistik) abrufbar.
- [ ] Der Statuswechsel ist ohne Bestätigungsdialog möglich (direktes Tippen / Swipe).

### Edge Cases
- **Status-Reihenfolge erzwingen:** Keine – alle Übergänge sind erlaubt (z.B. direkt von Offen zu Erledigt).
- **Wartet-Notiz beim Wechsel weg von "Wartet":** Notiz bleibt im System gespeichert, wird aber nicht mehr angezeigt. Bei erneutem Setzen auf "Wartet" erscheint das leere Feld (alte Notiz wird nicht wiederhergestellt).
- **Todo mit Unteraufgaben auf Erledigt setzen:** Nur das Parent-Todo wird erledigt. Unteraufgaben behalten ihren Status.
- **Mehrere Todos mit Status "In Arbeit":** Erlaubt – keine Einschränkung auf ein aktives Todo.
- **Score-Neuberechnung nach Status-Wechsel:** Erfolgt sofort (selbe Session) beim Wechsel von/zu "Wartet".

### Nicht im Scope
- Automatisches Erledigen von Parent-Todos wenn alle Unteraufgaben erledigt sind
- Status-History / Audit-Log
- Kommentare oder Zeitstempel pro Status-Wechsel
- Filter-Ansichten nach Status (separate UI-Entscheidung in /ia-ux)

---

## 2. IA/UX Entscheidungen
*Ausgefüllt von: /ia-ux — 2026-03-27*

### Einbettung im Produkt
- **Status ändern:** Im Edit Bottom Sheet (Full-Sheet) als horizontale Chip-Reihe
- **Status anzeigen:** Als Chip auf der Todo-Karte in der Hauptliste (visuell kompakt)
- **Schnell-Aktion:** Long-Press auf Karte → Kontextmenü mit Status-Optionen (ohne Sheet zu öffnen)

### Einstiegspunkte
1. Tap auf Todo-Karte → Edit Sheet → Status-Chips
2. Long Press auf Karte → Kontextmenü → Status-Option direkt wählbar

### User Flow
```
Methode A (Edit Sheet):
Tap auf Karte → Edit Sheet öffnet
    → Status-Chips sichtbar (Offen | In Arbeit | Wartet | Erledigt)
    → Tap auf Chip → Chip wechselt zu "active" (filled)
    → Bei "Wartet": Textfeld "Wartet auf..." erscheint (conditional)
    → Tap Speichern → Sheet schließt, Karte aktualisiert

Methode B (Long-Press Schnell-Aktion):
Long Press auf Karte → Kontextmenü erscheint
    → Status-Option wählen → direkt gespeichert, kein Sheet
    → Bei "Erledigt": Karte faded out (150ms) und verschwindet aus aktiver Liste

Todo auf "Erledigt" gesetzt:
    → Karte verlässt die Liste (fade-out + slide-up 200ms)
    → Toast: "Erledigt! Rückgängig?" (3 Sek.)
```

### Interaktionsmuster
- **Status-Chips im Sheet:** Horizontal, alle 4 sichtbar, aktiver = filled (Primary #2563EB), inaktiv = outlined
- **Status auf Karte:** Kleiner Chip mit Label und Farbe:
  - Offen: #94A3B8 (grau)
  - In Arbeit: #2563EB (blau)
  - Wartet: #F97316 (orange)
  - Erledigt: #22C55E (grün – nur im Papierkorb/Statistik sichtbar)
- **Wartet-Notiz:** Textfeld erscheint conditional per Einblend-Animation (150ms) wenn "Wartet" aktiv
- **Leerer Zustand:** Nicht relevant (jedes Todo hat immer einen Status)
- **Fehler-Handling:** Status-Wechsel ist immer valide – kein Fehlerfall möglich

### Konzeptionelle Komponentenstruktur
```
EditTodoSheet
└── StatusChipRow
    ├── StatusChip "Offen" (toggle)
    ├── StatusChip "In Arbeit" (toggle)
    ├── StatusChip "Wartet" (toggle)
    │   └── WartetNotizInput (conditional, eingeblendet)
    └── StatusChip "Erledigt" (toggle)

TodoCard
└── StatusChip (display-only, Farbe + Label)
```

### Barrierefreiheit (A11y)
- Status-Chips: `role="radiogroup"`, jeder Chip `role="radio"` + `aria-checked`
- Statusfarben: Immer zusätzlich Label-Text auf der Karte (nicht nur Farbe)
- Wartet-Notiz: Conditional sichtbar, aber immer im DOM (via `aria-hidden` gesteuert)

### Mobile-Verhalten
- Alle 4 Status-Chips nebeneinander auf einem Smartphone-Screen (max ~360px)
- Kompakte Chip-Größe, aber ≥44pt Touch-Target durch Padding
- Long-Press-Kontextmenü: Native-feel, erscheint nahe am Finger-Berührpunkt
