# FEAT-2: Automatische Priorisierung

## Status
Aktueller Schritt: IA/UX

## Abhängigkeiten
- Benötigt: FEAT-1 (Todo-Verwaltung) – Score basiert auf Todo-Daten (Deadline, Komplexität)
- Wird benötigt von: FEAT-3 (Status-Management), FEAT-4 (Manuelle Priorisierung)

---

## 1. Feature Spec
*Ausgefüllt von: /requirements — 2026-03-27*

### Beschreibung
Jedes aktive Todo erhält automatisch einen Prioritäts-Score, der aus Dringlichkeit und Komplexität berechnet wird. Die Todo-Liste wird nach diesem Score absteigend sortiert. Der Score ist für den Nutzer sichtbar. Todos ohne Deadline erhalten eine fixe Dringlichkeit von 1.

### Definitionen
- **Prioritäts-Score:** Numerischer Wert = Dringlichkeit × Komplexität. Bereich: 1 (niedrigste) bis 25 (höchste Priorität).
- **Dringlichkeit:** Wert von 1–5, der automatisch aus der Restlaufzeit bis zur Deadline berechnet wird. Steigt linear: je näher die Deadline, desto höher. Todos ohne Deadline erhalten dauerhaft Dringlichkeit 1.
- **Komplexität:** Wert 1–5 gemäß T-Shirt-Größe (XS=1, S=2, M=3, L=4, XL=5), gesetzt in FEAT-1.
- **Restlaufzeit:** Differenz in Tagen zwischen heute und der Deadline eines Todos. Negative Werte (überfällig) ergeben maximale Dringlichkeit 5.

### Dringlichkeits-Formel
- Kein Deadline → Dringlichkeit = 1 (fix)
- Deadline überfällig (≤ 0 Tage) → Dringlichkeit = 5
- Deadline in 1–30 Tagen → lineare Interpolation: Dringlichkeit = 5 − ((Tage / 30) × 4), gerundet auf ganze Zahl, min 1
- Deadline > 30 Tage → Dringlichkeit = 1

### User Stories
- Als Nutzer möchte ich meine Todos automatisch nach Priorität sortiert sehen, damit ich sofort erkenne, was als nächstes dran ist.
- Als Nutzer möchte ich den Prioritäts-Score eines Todos sehen, um die Einordnung nachvollziehen zu können.
- Als Nutzer möchte ich, dass der Score automatisch aktualisiert wird, je näher eine Deadline rückt.
- Als Nutzer möchte ich, dass Todos ohne Deadline in der Liste erscheinen, aber klar als weniger dringend eingestuft werden.

### Acceptance Criteria
- [ ] Jedes aktive Todo hat einen sichtbaren Prioritäts-Score (Zahl).
- [ ] Die Todo-Liste ist standardmäßig absteigend nach Score sortiert (höchster Score oben).
- [ ] Todos ohne Deadline erhalten Dringlichkeit 1 und erscheinen daher weiter unten.
- [ ] Überfällige Todos (Deadline vergangen) erhalten Dringlichkeit 5.
- [ ] Der Score aktualisiert sich täglich ohne manuellen Eingriff (beim nächsten App-Öffnen / Seitenaufruf).
- [ ] Todos mit Status "Wartet auf etwas" erhalten Score 0 und erscheinen immer am Ende der Liste (unabhängig vom berechneten Score).
- [ ] Erledigte und gelöschte Todos erscheinen nicht in der priorisierten Liste.
- [ ] Bei Gleichstand im Score ist die Reihenfolge deterministisch (z.B. nach Erstellungsdatum).

### Edge Cases
- **Zwei Todos haben identischen Score:** Deterministisches Tie-Breaking nach Erstellungsdatum (älteres Todo zuerst).
- **Deadline war gestern (überfällig):** Dringlichkeit 5, Score = 5 × Komplexität. Todo erscheint ganz oben.
- **Komplexität nicht gesetzt (Default M = 3):** Score = Dringlichkeit × 3.
- **Manuelle Priorisierung aktiv:** Score-Berechnung läuft weiter im Hintergrund, wird aber nicht zur Sortierung genutzt (→ FEAT-4).
- **Todo-Status wechselt zu "Wartet":** Score wird auf 0 gesetzt und Todo ans Ende verschoben (→ FEAT-3).
- **Deadline liegt exakt heute:** Restlaufzeit = 0 → Dringlichkeit 5.

### Nicht im Scope
- Manuelle Score-Überschreibung (→ FEAT-4)
- Status-Logik inkl. "Wartet"-Behandlung im Detail (→ FEAT-3)
- Anzeige von Erledigten / Statistiken (→ FEAT-7)
- Konfigurierbare Formel oder Gewichtung durch den Nutzer

---

## 2. IA/UX Entscheidungen
*Ausgefüllt von: /ia-ux — 2026-03-27*

### Einbettung im Produkt
Kein eigener Screen – die Priorisierung ist passiv sichtbar auf jeder Todo-Karte in der Hauptliste `/`. Der Score ist das erste Element auf der Karte (oben links), die Sortierung ist die Standard-Reihenfolge der Liste.

### Einstiegspunkte
Kein aktiver Einstieg – die Sortierung ist immer aktiv und automatisch. Der Nutzer sieht das Ergebnis ohne Aktion.

### User Flow
```
Hauptliste öffnen (/)
    → Todos erscheinen automatisch nach Score absteigend sortiert
    → Score-Badge pro Karte sichtbar (z.B. "15")
    → Überfälliges Todo: Score-Badge + Deadline-Text rot markiert
    → Wartet-Todos: gedämpfte Darstellung, ganz unten

Bei Änderung eines Todos (Deadline, Komplexität):
    → Edit Sheet schließt
    → Score wird neu berechnet
    → Karte bewegt sich in neue Position (animate 300ms, nur transform)
```

### Interaktionsmuster
- **Primärmuster:** Passiv / Dashboard – keine Nutzerinteraktion mit dem Score selbst
- **Score-Anzeige:** Badge oben links auf der Karte, Zahl 1–25, Farbe indikiert Dringlichkeit:
  - Score 20–25: #EF4444 (rot) – sehr dringend
  - Score 12–19: #F97316 (orange) – mittel
  - Score 1–11: #2563EB (blau) – niedrig
- **Leerer Zustand:** Nicht relevant (Todos haben immer einen Score)
- **Ladeverhalten:** Score wird beim Laden der Liste berechnet – kein separater Lade-Indikator für Score

### Konzeptionelle Komponentenstruktur
```
TodoCard
└── ScoreBadge
    ├── Zahlenwert (1–25)
    └── Farbkodierung (rot / orange / blau je nach Höhe)

TodoList
└── Sortierung: absteigend nach Score (clientseitig nach API-Response)
```

### Barrierefreiheit (A11y)
- Score-Badge: `aria-label="Priorität: [Wert]"` – Farbe allein reicht nicht
- Überfälliges Datum: Zusätzlich Icon (Lucide `AlertCircle`) neben dem Datum, nicht nur rote Farbe

### Mobile-Verhalten
- Score-Badge bleibt bei kleinen Screens kompakt (max. 2–3 Zeichen)
- Re-Sortierung der Liste nach Score-Änderung animiert sanft (keine abrupten Sprünge)
