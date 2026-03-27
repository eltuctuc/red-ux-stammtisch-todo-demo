# FEAT-5: Reminder

## Status
Aktueller Schritt: IA/UX

## Abhängigkeiten
- Benötigt: FEAT-1 (Todo-Verwaltung) – Deadline-Daten, FEAT-3 (Status-Management) – nur aktive Todos erhalten Reminder

---

## 1. Feature Spec
*Ausgefüllt von: /requirements — 2026-03-27*

### Beschreibung
Die App zeigt In-App-Benachrichtigungen für Todos, deren Deadline sich nähert. Reminder werden an zwei festen Zeitpunkten ausgelöst: 7 Tage vor und 1 Tag vor der Deadline. Benachrichtigungen sind nur sichtbar, wenn die App geöffnet ist (kein Browser-Push, kein E-Mail).

### Definitionen
- **Reminder:** In-App-Benachrichtigung, die auf ein Todo mit nahender Deadline hinweist. Nur sichtbar wenn die App aktiv geöffnet ist.
- **Reminder-Zeitpunkte:** Feste Schwellwerte: 7 Tage vor Deadline und 1 Tag vor Deadline.
- **In-App-Benachrichtigung:** Banner oder Hinweis-Element innerhalb der App-Oberfläche – kein Browser-Push, kein E-Mail.
- **Aktives Todo:** Todo mit Status Offen oder In Arbeit (Wartet und Erledigt erhalten keine Reminder).

### User Stories
- Als Nutzer möchte ich beim Öffnen der App einen Hinweis sehen, wenn ein Todo in 7 Tagen fällig ist, um es rechtzeitig einzuplanen.
- Als Nutzer möchte ich beim Öffnen der App einen Hinweis sehen, wenn ein Todo morgen fällig ist, um es noch heute zu erledigen.
- Als Nutzer möchte ich Reminder wegklicken können, ohne dass das Todo verändert wird.

### Acceptance Criteria
- [ ] Todos mit Status Offen oder In Arbeit, deren Deadline in genau 7 Tagen liegt, lösen beim App-Öffnen einen Reminder aus.
- [ ] Todos mit Status Offen oder In Arbeit, deren Deadline in genau 1 Tag liegt, lösen beim App-Öffnen einen Reminder aus.
- [ ] Jeder Reminder zeigt Titel des Todos und Restzeit bis zur Deadline an.
- [ ] Reminder sind per Tap/Klick schließbar; das Todo wird nicht verändert.
- [ ] Todos mit Status Wartet oder Erledigt erhalten keine Reminder.
- [ ] Todos ohne Deadline erhalten keine Reminder.
- [ ] Bereits überfällige Todos (Deadline vergangen) erhalten keinen Reminder – sie sind bereits durch den hohen Score sichtbar.

### Edge Cases
- **Mehrere Todos mit Reminder gleichzeitig:** Alle werden angezeigt (z.B. als Liste oder gestapelt), nicht nur der erste.
- **Todo wird während des Reminder-Zeitfensters erledigt:** Kein Reminder mehr beim nächsten Öffnen.
- **Todo hat keine Deadline:** Kein Reminder – kein Fehler-State.
- **Reminder-Zeitpunkt trifft auf Wochenende oder Feiertag:** Wird ignoriert – keine Sonderbehandlung, nächster App-Aufruf gilt.
- **Nutzer öffnet App mehrmals am selben Tag:** Reminder wird nur einmal pro Tag pro Todo angezeigt (nicht bei jedem Öffnen wiederholt).

### Nicht im Scope
- Konfigurierbare Reminder-Zeitpunkte durch den Nutzer
- Browser-Push-Notifications
- E-Mail-Benachrichtigungen
- Reminder für Todos ohne Deadline (→ FEAT-6: Relevanz-Check)
- Snooze-Funktion für Reminder

---

## 2. IA/UX Entscheidungen
*Ausgefüllt von: /ia-ux — 2026-03-27*

### Einbettung im Produkt
Nicht-blockierende Banner in der Banner-Area direkt unter dem Sticky-Header auf `/`. Sichtbar sobald die App geöffnet wird, wenn Reminder-Bedingungen erfüllt sind.

### Einstiegspunkte
Kein aktiver Einstieg – Banner erscheinen automatisch beim App-Öffnen wenn Reminder fällig.

### User Flow
```
App öffnen (/)
    → Reminder-Check: Welche Todos haben Deadline in 7 oder 1 Tag?
    → Für jeden Treffer: Reminder-Banner erscheint in Banner-Area

Banner sichtbar:
┌────────────────────────────────────────┐
│ 🔔 Deadline morgen: "Design Review"  [✕] │
└────────────────────────────────────────┘
    ↓ Tap auf Banner-Inhalt
    → Edit Sheet des betreffenden Todos öffnet
    ↓ Tap [✕]
    → Banner verschwindet (slide-up + fade, 150ms)
    → Für heute nicht mehr angezeigt

Mehrere Reminder:
    → Banners gestapelt, max. 3 sichtbar
    → Jeder einzeln schließbar
```

### Interaktionsmuster
- **Primärmuster:** Passives Informations-Banner (non-blocking)
- **Tap auf Banner:** Öffnet Edit Sheet des betreffenden Todos (Shortcut)
- **Dismiss:** ✕-Button rechts, schließt Banner für diesen Tag
- **Mehrere Banners:** Vertikaler Stack, jeder mit eigenem ✕
- **Leerer Zustand:** Keine Banner = kein Bereich sichtbar (Banner-Area collapsed)
- **Ladeverhalten:** Banner erscheinen synchron mit der Liste (gleicher Load)

### Konzeptionelle Komponentenstruktur
```
BannerArea (collapsed wenn leer)
└── ReminderBanner (wiederholt, max. 3 sichtbar)
    ├── BellIcon (Lucide Bell, 16px)
    ├── ReminderText ("Deadline morgen: [Titel]")
    ├── DismissButton [✕]
    └── Tap-Handler → öffnet Edit Sheet
```

### Barrierefreiheit (A11y)
- Banner: `role="alert"`, `aria-live="polite"` (nicht "assertive" – nicht dringend genug)
- Dismiss-Button: `aria-label="Reminder für [Todo-Titel] schließen"`
- Icon: dekorativ, `aria-hidden="true"` (Text trägt die Information)

### Mobile-Verhalten
- Banner full-width unter dem Header
- Dismiss-Button ≥44pt Touch-Target
- Beim Stapeln (mehrere Banner): keine Überlappung, sequentiell untereinander
- Bei vielen Banners (>3): Scroll möglich innerhalb der Banner-Area
