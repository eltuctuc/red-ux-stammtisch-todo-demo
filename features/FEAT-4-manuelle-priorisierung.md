# FEAT-4: Manuelle Priorisierung

## Status
Aktueller Schritt: IA/UX

## Abhängigkeiten
- Benötigt: FEAT-2 (Automatische Priorisierung) – Override ergänzt den automatischen Score

---

## 1. Feature Spec
*Ausgefüllt von: /requirements — 2026-03-27*

### Beschreibung
Der Nutzer kann ein Todo manuell an den Anfang ("Gepinnt oben") oder das Ende ("Gepinnt unten") der aktiven Liste setzen, unabhängig vom berechneten Prioritäts-Score. Gepinnte Todos sind visuell gekennzeichnet. Das Pinning kann jederzeit aufgehoben werden.

### Definitionen
- **Gepinntes Todo:** Ein Todo, das durch manuelle Entscheidung des Nutzers dauerhaft an einer fixen Position (oben oder unten) der aktiven Liste erscheint, solange das Pinning aktiv ist.
- **Pin oben:** Das Todo erscheint immer ganz oben in der aktiven Liste, vor allen automatisch sortierten Todos.
- **Pin unten:** Das Todo erscheint immer ganz unten in der aktiven Liste, nach allen automatisch sortierten Todos (aber noch vor "Wartet"-Todos mit Score 0).
- **Override-Badge:** Visuelles Symbol am Todo, das anzeigt, dass die Position manuell gesetzt wurde.

### User Stories
- Als Nutzer möchte ich ein Todo manuell nach oben pinnen, um es als "jetzt als nächstes erledigen" zu markieren.
- Als Nutzer möchte ich ein Todo nach unten pinnen, um es vorübergehend zu deprioritisieren ohne es auf "Wartet" zu setzen.
- Als Nutzer möchte ich erkennen, welche Todos manuell priorisiert wurden, um den Überblick zu behalten.
- Als Nutzer möchte ich ein Pinning jederzeit aufheben können, damit das Todo wieder automatisch eingereiht wird.

### Acceptance Criteria
- [ ] Ein Todo kann mit einer Aktion (z.B. Long-Press oder Menü) als "oben gepinnt" oder "unten gepinnt" markiert werden.
- [ ] Gepinnte-oben Todos erscheinen immer vor allen automatisch sortierten Todos.
- [ ] Gepinnte-unten Todos erscheinen immer nach allen automatisch sortierten, aber vor "Wartet"-Todos.
- [ ] Gepinnte Todos zeigen ein visuelles Badge/Icon, das den manuellen Override kennzeichnet.
- [ ] Das Pinning kann jederzeit aufgehoben werden; danach wird das Todo wieder automatisch nach Score eingereiht.
- [ ] Mehrere Todos können gleichzeitig gepinnt sein; ihre Reihenfolge untereinander ist nach Score (bei gleich gepinntem Bereich).
- [ ] Der automatische Score wird weiterhin berechnet und aktualisiert – er wird nur bei der Sortierung ignoriert solange das Pinning aktiv ist.

### Edge Cases
- **Mehrere oben gepinnte Todos:** Reihenfolge unter den gepinnten Todos wird nach ihrem automatischen Score bestimmt.
- **Gepinntes Todo wird erledigt:** Pinning wird automatisch aufgehoben; das Todo verschwindet aus der aktiven Liste.
- **Gepinntes Todo erhält Status "Wartet":** Pinning wird aufgehoben; "Wartet"-Logik übernimmt (Score 0, ans Ende).
- **Gepinntes Todo wird gelöscht:** Pinning-Information wird mit dem Todo in den Papierkorb verschoben. Bei Wiederherstellung bleibt Pinning aktiv.
- **Pin oben und Pin unten gleichzeitig:** Technisch nicht möglich – ein Todo kann nur einen Pin-Status haben.

### Nicht im Scope
- Drag & Drop Sortierung
- Manueller numerischer Score-Override
- Pinning von Unteraufgaben (nur Parent-Todos)
- Pinning-Ablauf nach Zeit (kein automatisches Aufheben nach X Tagen)

---

## 2. IA/UX Entscheidungen
*Ausgefüllt von: /ia-ux — 2026-03-27*

### Einbettung im Produkt
- **Pin setzen/entfernen:** Im Edit Bottom Sheet (Full-Sheet), Abschnitt "Priorität"
- **Pin-Anzeige:** Override-Badge (📍-Icon) auf der Todo-Karte in der Hauptliste
- **Schnell-Pin:** Long-Press Kontextmenü → "Oben pinnen" / "Unten pinnen"

### Einstiegspunkte
1. Tap auf Karte → Edit Sheet → Priorität-Sektion
2. Long Press auf Karte → Kontextmenü → Pin-Optionen

### User Flow
```
Tap auf Karte → Edit Sheet
    → Abschnitt "Priorität" zeigt zwei Buttons:
      [📌 Oben pinnen]  [📌 Unten pinnen]
    → Tap auf Button → Button wechselt zu "aktiv" (filled), andere deaktiviert
    → Tap Speichern → Sheet schließt
    → Todo springt an Listenanfang/-ende (animate 300ms)
    → Pin-Badge erscheint auf Karte

Pin aufheben:
    → Gleicher Flow, aktiver Pin-Button nochmals tippen → deaktiviert
    → Nach Speichern: Todo reintegriert sich in automatische Sortierung
```

### Interaktionsmuster
- **Pin-Buttons im Sheet:** Zwei Outline-Buttons nebeneinander; aktiver Button = filled + Farbe #2563EB
- **Mutual exclusive:** Nur einer kann aktiv sein; Tap auf anderen deaktiviert ersten
- **Override-Badge auf Karte:** Kleines 📍-Icon neben dem Score-Badge (Lucide `Pin`, 14px)
- **Tooltip/Label:** Pin-Badge trägt `aria-label="Manuell oben gepinnt"` / `"Manuell unten gepinnt"`
- **Leerer Zustand:** Kein Pin aktiv = kein Badge sichtbar
- **Fehler-Handling:** Kein Fehlerfall möglich (Pin ist ein Toggle)

### Konzeptionelle Komponentenstruktur
```
EditTodoSheet
└── PrioritySection
    ├── Label "Priorität"
    ├── PinButton "Oben pinnen" (toggle, mutual exclusive)
    └── PinButton "Unten pinnen" (toggle, mutual exclusive)

TodoCard
├── ScoreBadge (FEAT-2)
└── PinBadge (conditional, nur wenn gepinnt)
    └── Icon (Lucide Pin) + aria-label
```

### Barrierefreiheit (A11y)
- Pin-Buttons: `role="radio"` in einem `role="radiogroup"`, `aria-checked` pro State
- Pin-Badge auf Karte: `aria-label` trägt den Pin-Zustand als Text
- Kein rein visueller Unterschied – Icon + Label zusammen

### Mobile-Verhalten
- Zwei Pin-Buttons nebeneinander, ≥44pt Touch-Target
- Badge ist klein (14px Icon), aber nur Display – keine Interaktion auf der Karte selbst
- Resorting der Liste nach Pin-Änderung: animiert mit transform (300ms ease-in-out)
