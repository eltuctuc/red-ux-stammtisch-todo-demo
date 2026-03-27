# Globale Informationsarchitektur
*Erstellt: 2026-03-27*

---

## Design System

| Token | Wert |
|---|---|
| Style | Flat Design – 2D, minimalistisch, typografie-fokussiert |
| Primary | #2563EB (Blau) |
| CTA / Akzent | #F97316 (Orange) |
| Background | #F8FAFC |
| Text | #1E293B |
| Font | Plus Jakarta Sans (400 / 600 / 700 / 800) |
| Transitions | 150–200ms ease |
| Icons | Lucide (SVG, konsistente Stroke-Width 1.5) |

---

## Screen-Inventar & Routing

| Screen | Route | Features |
|---|---|---|
| Login | `/login` | FEAT-8 |
| Todo-Liste (Hauptscreen) | `/` | FEAT-1, 2, 3, 4, 5, 6 |
| Statistik | `/stats` | FEAT-7 |

Kein `/todos/[id]`-Screen – Detail/Edit läuft über Bottom Sheet.

---

## Navigation

**Typ:** Bottom Navigation Bar (2 Items – unter dem Maximum von 5)

```
┌─────────────────────────────────┐
│  ○  Todo-Liste    ○  Statistik  │
└─────────────────────────────────┘
```

- Icon + Label (beide immer sichtbar, keine Icon-only-Navigation)
- Aktiver Tab: Primary #2563EB, inaktiv: #94A3B8
- Safe-Area-aware: Abstand zu Home-Gesture-Bar einhalten
- Max 2 Items → kein Overflow-Menü nötig

---

## Hauptscreen: Todo-Liste (`/`)

### Aufbau von oben nach unten

```
┌─────────────────────────────────┐
│  [Header: "PrioTodo"]  [Filter] │  ← Sticky Header
├─────────────────────────────────┤
│  [Banner: Reminder / Check]     │  ← Dismissable, nur wenn aktiv
├─────────────────────────────────┤
│  [Todo-Karte]   Score: 15 🔵   │
│  Titel                          │
│  📅 Morgen  •  M  •  In Arbeit │
├─────────────────────────────────┤
│  [Todo-Karte]   Score: 12      │
│  ...                            │
├─────────────────────────────────┤
│  [Empty State wenn leer]        │
│                                 │
│            ╔════╗               │
│            ║ +  ║  ← FAB       │
│            ╚════╝               │
└─────────────────────────────────┘
│    ○ Todo-Liste  ○ Statistik    │  ← Bottom Nav
```

### Filter-Toggle (Header rechts)
- Zwei Zustände: **Aktiv** | **Papierkorb**
- Als Chip/Toggle-Button, nicht als eigener Screen
- Papierkorb zeigt gelöschte Todos mit Restlaufzeit und Wiederherstellungs-Action

### FAB (Floating Action Button)
- Position: unten rechts, über der Bottom Nav, Safe-Area-aware
- Icon: `+` (Lucide `Plus`)
- Farbe: CTA #F97316
- Tap → öffnet "Neues Todo" Bottom Sheet
- Nur auf der Todo-Liste sichtbar (nicht auf Statistik)

---

## Bottom Sheets

### 1. Neues Todo (FAB → Sheet)

```
Neues Todo                    [✕]
─────────────────────────────────
[Titel ...] ← Autofocus, Pflicht

Deadline       [Kein Datum  ▼]
Komplexität    [M  ▾]  XS S M L XL

[+ Unteraufgabe hinzufügen]
  └─ [Unteraufgabe 1 ...]
  └─ [Unteraufgabe 2 ...]

              [Speichern]  ← CTA
─────────────────────────────────
```

- Half-Sheet bei leerem Formular, expandiert wenn Unteraufgaben hinzugefügt
- Swipe-down oder ✕ = Verwerfen (nur wenn Felder leer; sonst Bestätigungsdialog)
- Speichern disabled solange kein Titel
- Komplexität: Segment-Control (5 Optionen, kompakt)
- Deadline: Native Date-Picker (system-native, kein Custom-Calendar)
- Nach Speichern: Sheet schließt, neues Todo erscheint in Liste, kurze Toast-Bestätigung

### 2. Todo bearbeiten / Detail (Tap auf Karte → Sheet)

```
[Todo-Titel]               [🗑 Löschen]
─────────────────────────────────
Status:  [Offen ▾] [In Arbeit] [Wartet] [Erledigt]

Titel      [editierbar]
Deadline   [Datum ▾]
Komplexität [M ▾]

Wartet auf: [                    ]  ← nur wenn Status=Wartet

Unteraufgaben:
  ☐ Unteraufgabe 1
  ☐ Unteraufgabe 2
  [+ Hinzufügen]

Priorität:  [📌 Oben pinnen]  [📌 Unten pinnen]
Score:  12  (manuell gepinnt 📍)

              [Speichern]  ← CTA
─────────────────────────────────
```

- Full-Sheet (komplexer Inhalt)
- Status: horizontale Chip-Row, aktiver Chip = Primary filled
- Löschen: Destruktive Aktion, rechts oben, rot, mit kurzem "Rückgängig"-Toast (3s)
- Pin-Aktionen: zwei Buttons, aktiver Pin wird highlighted + deaktivierbar
- Swipe-down mit ungespeicherten Änderungen → Bestätigungsdialog

---

## Statistik-Screen (`/stats`)

```
┌─────────────────────────────────┐
│  Fortschritt                    │  ← Sticky Header
├─────────────────────────────────┤
│  ┌───────┐ ┌───────┐ ┌───────┐ │
│  │ Heute │ │ Woche │ │ Monat │ │
│  │   3   │ │  17   │ │  42   │ │
│  └───────┘ └───────┘ └───────┘ │
│                                 │
│  [Leerer State wenn alle = 0]   │
└─────────────────────────────────┘
│    ○ Todo-Liste  ○ Statistik    │
```

- 3 Kacheln nebeneinander, gleiche Größe
- Zahlen prominent (große Typografie)
- Kein Drill-down, kein Chart – nur Zahlen
- Empty State wenn heute = 0: "Heute noch nichts erledigt. Los geht's!"

---

## Login-Screen (`/login`)

```
┌─────────────────────────────────┐
│                                 │
│         PrioTodo                │
│                                 │
│  [Passwort ................]    │
│  [Einloggen]                    │
│                                 │
│  Fehler: "Falsches Passwort"    │
│                                 │
└─────────────────────────────────┘
```

- Kein Username-Feld (Single-User)
- Nach Login → Redirect zu `/`
- Fehler: Inline unter dem Feld, generische Formulierung

---

## Globale Interaktionsmuster

### Todo-Karte (Listenelement)

```
┌─────────────────────────────────┐
│ Score: 15  📍(wenn gepinnt)    │
│ Titel des Todos                 │
│ 📅 2026-04-03  •  M  •  🔵 Offen │
└─────────────────────────────────┘
```

- Tap → Edit Bottom Sheet
- Long Press → Kontextmenü: Status ändern, Pinnen, Löschen
- Überfälliges Deadline: rot (#EF4444)
- Wartet-Karten: gedämpfter (opacity 0.6), ans Ende der Liste
- Erledigte Karten: nicht in der aktiven Liste sichtbar

### Banners (Reminder & Relevanz-Check)

```
┌─────────────────────────────────┐
│ 🔔 Deadline morgen: "Design Review"   [✕] │
└─────────────────────────────────┘
```

```
┌─────────────────────────────────┐
│ ❓ Noch relevant? "Alte Aufgabe"              │
│                    [Erledigt]  [Ja, noch relevant] │
└─────────────────────────────────┘
```

- Non-blocking, über der Liste (sticky unter Header)
- Mehrere Banners: gestapelt (max 3 sichtbar), scrollbar wenn mehr
- Dismissbar mit ✕
- Reminder-Banner: nur Info + ✕
- Relevanz-Check-Banner: Info + zwei Aktions-Buttons

---

## Barrierefreiheit (Global)

- Keyboard-Navigation: Tab-Reihenfolge = visuell top-to-bottom
- ARIA-Landmarks: `main`, `nav`, `banner` korrekt gesetzt
- Bottom Sheets: `role="dialog"`, `aria-modal="true"`, Focus-Trap aktiv
- FAB: `aria-label="Neues Todo erstellen"`
- Score-Badge: `aria-label="Priorität: 15"`
- Alle Icon-only-Elemente haben aria-label
- Minimaler Farbkontrast: 4.5:1 (WCAG AA) für alle Texte

---

## Responsive Verhalten

| Breakpoint | Verhalten |
|---|---|
| < 768px (Mobile) | Single-Column, Bottom Nav, Full-width Sheets |
| 768–1024px (Tablet) | Sheets als zentrierte Modals, Liste max-width 640px |
| > 1024px (Desktop) | Liste max-width 720px, zentriert, Bottom Nav → Top Nav |

---

## Animations & Transitions

- Bottom Sheet ein: slide-up 250ms ease-out
- Bottom Sheet aus: slide-down 200ms ease-in (schneller als Enter)
- FAB: scale 0.95 → 1.0 on press, 150ms
- Karten: fade-in bei Hinzufügen (200ms), fade-out bei Entfernen (150ms)
- Liste: re-sort animiert (position transition 300ms, nur transform)
- Alle Animationen: `prefers-reduced-motion` beachten → instant wenn aktiviert
