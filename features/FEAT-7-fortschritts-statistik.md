# FEAT-7: Fortschritts-Statistik

## Status
Aktueller Schritt: IA/UX

## Abhängigkeiten
- Benötigt: FEAT-1 (Todo-Verwaltung), FEAT-3 (Status-Management) – erledigte Todos als Datenbasis

---

## 1. Feature Spec
*Ausgefüllt von: /requirements — 2026-03-27*

### Beschreibung
Die App zeigt eine Fortschritts-Statistik mit der Anzahl erledigter Todos für drei Zeiträume: heute, diese Woche und diesen Monat. Die Statistik gibt dem Nutzer ein Erfolgsgefühl und einen Überblick über seine Produktivität. Kein Detail-Drill-down – nur Zahlen pro Zeitraum.

### Definitionen
- **Erledigtes Todo:** Ein Todo, das auf Status Erledigt gesetzt wurde. Der Erledigungszeitpunkt (Timestamp) wird gespeichert.
- **Heute:** Erledigungen am aktuellen Kalendertag (Mitternacht bis Mitternacht, lokale Zeitzone).
- **Diese Woche:** Erledigungen seit Montag der aktuellen Kalenderwoche.
- **Dieser Monat:** Erledigungen seit dem 1. des aktuellen Kalendermonats.

### User Stories
- Als Nutzer möchte ich sehen, wie viele Todos ich heute erledigt habe, um meine tägliche Leistung einschätzen zu können.
- Als Nutzer möchte ich eine Wochenübersicht der erledigten Todos sehen, um meinen Fortschritt über Zeit zu bewerten.
- Als Nutzer möchte ich eine Monatsübersicht haben, um langfristige Produktivitätsmuster zu erkennen.

### Acceptance Criteria
- [ ] Die Statistik zeigt drei Werte: Anzahl erledigter Todos heute, diese Woche, diesen Monat.
- [ ] Die Werte aktualisieren sich in Echtzeit, wenn ein Todo erledigt wird.
- [ ] Ein Todo, das reaktiviert wird (von Erledigt zurück zu Offen), wird nicht mehr in der Statistik gezählt.
- [ ] Der Erledigungszeitpunkt eines Todos wird beim Setzen auf "Erledigt" gespeichert.
- [ ] Wenn heute = 0 erledigte Todos, wird "0" angezeigt (kein leerer State ohne Zahl).
- [ ] Die Statistik ist dauerhaft zugänglich (eigener Bereich oder fester Abschnitt in der App).

### Edge Cases
- **Todo wird mehrfach erledigt und reaktiviert:** Nur der letzte Erledigungszeitpunkt zählt.
- **Todo wird gelöscht (Papierkorb) nach Erledigung:** Zählt weiterhin in der Statistik – Löschung hebt die Erledigungshistorie nicht auf.
- **Wochenwechsel während der App-Session:** Statistik aktualisiert sich beim nächsten Laden / Wechsel zur Statistik-Ansicht.
- **Monatserster:** Dieser Monat beginnt bei 0; letzter Monat wird nicht angezeigt.
- **Unteraufgaben als erledigt markiert:** Zählen als eigene erledigte Todos in der Statistik (jede Unteraufgabe = 1).

### Nicht im Scope
- Liste der erledigten Todos (nur Anzahl)
- Komplexitäts-Punkte oder Score-basierte Auswertung
- Historische Statistiken (vergangene Wochen/Monate)
- Streak-Mechanik (z.B. "5 Tage in Folge")
- Export oder Teilen der Statistik
- Grafische Charts oder Verlaufskurven

---

## 2. IA/UX Entscheidungen
*Ausgefüllt von: /ia-ux — 2026-03-27*

### Einbettung im Produkt
Eigener Screen, Route `/stats`. Erreichbar über zweiten Tab der Bottom Navigation Bar ("Statistik").

### Einstiegspunkte
- Bottom Navigation Bar → Tab "Statistik"

### User Flow
```
Tap "Statistik" in Bottom Nav
    → Screen wechselt zu /stats (slide-transition)
    → 3 Statistik-Kacheln erscheinen (Heute | Woche | Monat)
    → Zahlen laden sofort (kein async – aus lokalem State oder schneller API)

Wenn heute = 0:
    → Kachel "Heute" zeigt "0" mit motivierendem Subtext
    → Empty-State-Nachricht unter den Kacheln

Zurück zur Liste:
    → Tap "Todo-Liste" in Bottom Nav
```

### Interaktionsmuster
- **Primärmuster:** Dashboard / Übersicht – reine Informationsanzeige, keine Interaktion
- **Fehler-Handling:** Wenn Statistik nicht laden kann → Kacheln zeigen "–" statt Zahl, kein Crash
- **Leerer Zustand:** Alle Werte = 0 → Motivationsnachricht: "Noch nichts erledigt. Los geht's!" mit Link/Button zurück zur Liste
- **Ladeverhalten:** Skeleton-Loader für die 3 Kacheln wenn Daten noch laden (max. 300ms)

### Konzeptionelle Komponentenstruktur
```
StatsScreen (/stats)
├── StickyHeader ("Fortschritt")
├── StatsGrid
│   ├── StatCard "Heute"
│   │   ├── Zahl (große Typografie, 600 weight)
│   │   └── Label "Heute"
│   ├── StatCard "Diese Woche"
│   │   ├── Zahl
│   │   └── Label "Diese Woche"
│   └── StatCard "Dieser Monat"
│       ├── Zahl
│       └── Label "Dieser Monat"
└── EmptyState (conditional, wenn alle = 0)
    ├── IllustrationOrIcon
    ├── Text "Noch nichts erledigt heute."
    └── CTALink "Zurück zur Liste"
```

### Barrierefreiheit (A11y)
- Jede Kachel: `aria-label="[Zahl] Todos [heute/diese Woche/diesen Monat] erledigt"`
- Zahlen: `font-variant-numeric: tabular-nums` für konsistente Breite
- EmptyState-Link: als echter `<a>` oder `<button>` mit klarem Label

### Mobile-Verhalten
- 3 Kacheln nebeneinander in einer Reihe (flex, gleiche Breite)
- Auf sehr kleinen Screens (< 320px): 2+1 Stacking
- Keine horizontale Scroll – alles in den Viewport
- Zahlen skalieren mit Dynamic Type / System-Schriftgröße
