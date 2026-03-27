# FEAT-1: Todo-Verwaltung

## Status
Aktueller Schritt: Tech

## Abhängigkeiten
- Benötigt: Keine
- Wird benötigt von: FEAT-2 (Automatische Priorisierung), FEAT-3 (Status-Management), FEAT-4 (Manuelle Priorisierung), FEAT-5 (Reminder), FEAT-6 (Relevanz-Check)

---

## 1. Feature Spec
*Ausgefüllt von: /requirements — 2026-03-27*

### Beschreibung
Der Nutzer kann Todos erstellen, bearbeiten, löschen und wiederherstellen. Jedes Todo enthält einen Titel, eine optionale Deadline, eine optionale Komplexitätsschätzung sowie optionale Unteraufgaben (eine Ebene). Gelöschte Todos werden 7 Tage im Papierkorb aufbewahrt und können innerhalb dieses Zeitraums wiederhergestellt werden.

### Definitionen
- **Todo:** Eine einzelne Aufgabe mit Pflichtfeld Titel, optionaler Deadline, optionaler Komplexität und optionalen Unteraufgaben einer Ebene.
- **Unteraufgabe:** Ein Todo ohne eigene Deadline oder Komplexität, das genau einem Parent-Todo zugeordnet ist. Unteraufgaben können keine eigenen Unteraufgaben haben.
- **Komplexität:** Einschätzung des Aufwands eines Todos auf einer T-Shirt-Skala: XS / S / M / L / XL. Entspricht intern den Werten 1 / 2 / 3 / 4 / 5.
- **Soft Delete:** Das Todo wird nicht dauerhaft gelöscht, sondern als gelöscht markiert und für 7 Tage im Papierkorb aufbewahrt.
- **Papierkorb:** Bereich, in dem gelöschte Todos einsehbar und wiederherstellbar sind. Nach 7 Tagen werden Todos dauerhaft gelöscht.
- **Überfälliges Todo:** Ein Todo, dessen Deadline in der Vergangenheit liegt.

### User Stories
- Als Nutzer möchte ich ein neues Todo mit Titel erfassen können, um eine Aufgabe schnell festzuhalten.
- Als Nutzer möchte ich optional eine Deadline setzen können, um die Dringlichkeit des Todos zu steuern.
- Als Nutzer möchte ich optional eine Komplexitätsschätzung (XS–XL) setzen können, um den Aufwand einzuschätzen.
- Als Nutzer möchte ich einem Todo Unteraufgaben hinzufügen können, um komplexe Aufgaben zu strukturieren.
- Als Nutzer möchte ich ein Todo bearbeiten können, um Titel, Deadline, Komplexität oder Unteraufgaben zu ändern.
- Als Nutzer möchte ich ein Todo löschen können, wobei es 7 Tage lang wiederherstellbar bleiben soll.
- Als Nutzer möchte ich gelöschte Todos im Papierkorb einsehen und wiederherstellen können, falls ich etwas versehentlich gelöscht habe.

### Acceptance Criteria
- [ ] Ein neues Todo kann mit nur einem Titel erstellt werden (Deadline und Komplexität optional).
- [ ] Wird keine Komplexität gesetzt, wird automatisch M als Standardwert verwendet.
- [ ] Ein Todo ohne Titel kann nicht gespeichert werden; ein Hinweis erscheint.
- [ ] Ein Todo kann Unteraufgaben haben (nur eine Ebene tief); jede Unteraufgabe hat mindestens einen Titel.
- [ ] Wird eine Deadline in der Vergangenheit gesetzt, erscheint ein deutlicher Hinweis ("Deadline liegt in der Vergangenheit") – das Speichern bleibt möglich.
- [ ] Ein Todo kann jederzeit bearbeitet werden, unabhängig vom Status (inkl. "Erledigt").
- [ ] Beim Löschen eines Todos wird es in den Papierkorb verschoben, nicht dauerhaft gelöscht.
- [ ] Todos im Papierkorb sind einsehbar und können innerhalb von 7 Tagen wiederhergestellt werden.
- [ ] Nach 7 Tagen im Papierkorb wird ein Todo dauerhaft und unwiderruflich gelöscht.
- [ ] Die gesamte Erfassungsstrecke (Titel + optionale Felder + Speichern) ist auf dem Smartphone mit dem Daumen bedienbar.

### Edge Cases
- **Todo ohne Titel speichern:** Formular zeigt Fehlermeldung, Speichern blockiert.
- **Deadline gestern oder früher:** Erlaubt, aber visuell als "überf"ällig" markiert; beim Speichern erscheint einmalig ein Hinweis.
- **Löschen eines Todos mit Unteraufgaben:** Gesamtes Todo inkl. aller Unteraufgaben wird gemeinsam in den Papierkorb verschoben; Wiederherstellung stellt Parent + Unteraufgaben gemeinsam wieder her.
- **Wiederherstellen eines Todos, dessen Papierkorb-Frist abgelaufen ist:** Nicht möglich; Todo ist dauerhaft gelöscht. Kein Fehler-State nötig (UI zeigt es nicht mehr an).
- **Unteraufgabe zu einem bereits gelöschten Parent hinzufügen:** Nicht möglich; der Parent ist nicht mehr aktiv vorhanden.
- **Komplexität leer lassen:** Wird beim Speichern automatisch auf M gesetzt; kein sichtbarer Pflichtfeld-Fehler.

### Nicht im Scope
- Priorisierungs-Score und Sortierung (→ FEAT-2)
- Status-Änderungen: Offen / In Arbeit / Wartet / Erledigt (→ FEAT-3)
- Manuelle Priorisierung / Score-Override (→ FEAT-4)
- Reminder und Benachrichtigungen (→ FEAT-5)
- Periodische Relevanz-Checks für Todos ohne Deadline (→ FEAT-6)
- Fortschritts-Statistiken (→ FEAT-7)
- Suche und Filter-Funktionen
- Kategorien, Tags oder Labels

---

## 2. IA/UX Entscheidungen
*Ausgefüllt von: /ia-ux — 2026-03-27*

### Einbettung im Produkt
- **Erstellen:** FAB auf `/` → öffnet "Neues Todo" Bottom Sheet (Half-Sheet, expandiert bei Unteraufgaben)
- **Bearbeiten:** Tap auf Todo-Karte → öffnet "Todo Detail/Edit" Bottom Sheet (Full-Sheet)
- **Papierkorb:** Filter-Toggle im Header von `/` (kein eigener Screen)

### Einstiegspunkte
- Neu: FAB (orange, unten rechts auf der Todo-Liste)
- Bearbeiten: Tap auf beliebige Todo-Karte
- Löschen: Aus dem Edit-Sheet heraus (Löschen-Icon oben rechts, destruktiv/rot)
- Wiederherstellen: Aus Papierkorb-Ansicht (Filter-Toggle auf "Papierkorb")

### User Flow – Neues Todo erstellen
```
Hauptliste (/)
    ↓ Tap FAB
Bottom Sheet öffnet (slide-up 250ms)
    ↓ Titel eintippen (Autofocus)
    ↓ Optional: Deadline / Komplexität / Unteraufgaben ergänzen
    ↓ Tap "Speichern" (disabled solange kein Titel)
Sheet schließt + Toast "Todo erstellt"
    → Neues Todo erscheint in Liste (fade-in, automatisch eingereiht nach Score)

Fehlerfall: Speichern ohne Titel
    → Button bleibt disabled, Titelfeld erhält rote Outline + Hinweistext
```

### User Flow – Todo bearbeiten / löschen
```
Hauptliste (/)
    ↓ Tap auf Todo-Karte
Edit Bottom Sheet öffnet (Full-Sheet)
    ↓ Felder editieren
    ↓ Tap "Speichern"
Sheet schließt + Liste aktualisiert sich

Löschen:
    ↓ Tap Löschen-Icon (oben rechts, rot)
Sheet schließt sofort + Toast "Gelöscht. Rückgängig?" (3 Sek.)
    → Bei Tap "Rückgängig": Todo kehrt zurück
    → Nach 3 Sek.: Todo landet im Papierkorb

Wiederherstellen:
    ↓ Filter-Toggle → "Papierkorb"
    ↓ Tap "Wiederherstellen" auf gelöschter Karte
Todo kehrt in aktive Liste zurück
```

### Interaktionsmuster
- **Primärmuster (Neu):** Formular im Bottom Sheet, minimale Pflichtfelder, progressive Disclosure für optionale Felder
- **Primärmuster (Bearbeiten):** Formular im Full-Sheet, alle Felder direkt sichtbar
- **Fehler-Handling:** Inline unter dem Feld (kein Alert-Dialog), Speichern-Button bleibt disabled
- **Leerer Zustand:** "Noch keine Todos. Tap + um loszulegen." mit Pfeil-Icon Richtung FAB
- **Ladeverhalten:** Optimistic UI – Todo erscheint sofort in der Liste, API-Fehler zeigt Toast mit Retry
- **Unsaved Changes:** Swipe-down auf Sheet mit Änderungen → Bestätigungsdialog "Änderungen verwerfen?"

### Konzeptionelle Komponentenstruktur
```
TodoList (Hauptscreen)
├── StickyHeader
│   ├── AppTitle ("PrioTodo")
│   └── FilterToggle (Aktiv | Papierkorb)
├── BannerArea (FEAT-5, FEAT-6)
├── TodoListContent
│   ├── TodoCard (wiederholt)
│   │   ├── ScoreBadge
│   │   ├── PinIndicator (wenn gepinnt)
│   │   ├── TodoTitle
│   │   └── MetaRow (Deadline • Komplexität • Status-Chip)
│   └── EmptyState
└── FAB ("+" Button, CTA-Farbe)

NewTodoSheet (Bottom Sheet)
├── SheetHandle
├── Titel-Input (Autofocus)
├── DeadlinePicker
├── KomplexitätSelector (Segment-Control: XS S M L XL)
├── SubtaskList (expandierbar)
│   └── SubtaskInput (wiederholt)
└── SaveButton (primär, disabled bis Titel vorhanden)

EditTodoSheet (Full-Sheet)
├── SheetHandle
├── DeleteButton (oben rechts, destruktiv)
├── Titel-Input
├── StatusChipRow (Offen | In Arbeit | Wartet | Erledigt)
├── WartetNotizInput (conditional: nur wenn Status=Wartet)
├── DeadlinePicker
├── KomplexitätSelector
├── SubtaskList
└── SaveButton
```

### Barrierefreiheit (A11y)
- FAB: `aria-label="Neues Todo erstellen"`
- Bottom Sheets: `role="dialog"`, `aria-modal="true"`, Focus-Trap, Schließen per Escape (Desktop)
- Komplexitäts-Segment: `role="radiogroup"` mit `aria-checked` pro Option
- Titel-Fehlerhinweis: `aria-live="polite"`, `aria-describedby` auf das Inputfeld
- Delete-Button: `aria-label="Todo löschen"`, visuell rot + Trash-Icon (nicht nur Farbe)

### Mobile-Verhalten
- Alle Touch-Targets ≥ 44×44pt
- Bottom Sheet schließbar via Swipe-down
- Komplexitäts-Selector als Segment-Control (kompakt, fünf Optionen nebeneinander)
- Deadline: System-nativer Date-Picker (kein Custom-Calendar)
- Keyboard erscheint automatisch (Autofocus Titel-Input), Sheet scrollt mit hoch

---

## 3. Technisches Design
*Ausgefüllt von: /solution-architect — 2026-03-27*

### Component-Struktur

```
TodoList (Hauptscreen – app/page.tsx)
├── StickyHeader
│   ├── AppTitle
│   └── FilterToggle (Aktiv | Papierkorb)
├── TodoListContent
│   ├── TodoCard (wiederholt)
│   │   ├── TodoTitle
│   │   └── MetaRow (Deadline • Komplexität)
│   └── EmptyState
└── FAB

NewTodoSheet (Bottom Sheet)
├── SheetHandle
├── TitelInput (Autofocus)
├── DeadlinePicker
├── KomplexitätSelector (Segment-Control XS–XL)
├── SubtaskList (expandierbar)
│   └── SubtaskInput (wiederholt)
└── SaveButton

EditTodoSheet (Full-Sheet)
├── SheetHandle
├── DeleteButton (oben rechts, destruktiv)
├── TitelInput
├── DeadlinePicker
├── KomplexitätSelector
├── SubtaskList
└── SaveButton

UnsavedChangesDialog (Modal)
└── "Änderungen verwerfen?" mit Confirm / Abbrechen
```

Keine bestehenden Komponenten zum Wiederverwenden (Greenfield).

### Daten-Model

**Tabelle: todos**
- `id` – eindeutiger Bezeichner (UUID)
- `user_id` – Verweis auf den authentifizierten User
- `title` – Pflichtfeld, nicht leer
- `complexity` – Enum: XS / S / M / L / XL; Default: M
- `deadline` – optionales Datum (ohne Uhrzeit)
- `deleted_at` – Timestamp, NULL wenn aktiv; gesetzt beim Soft Delete
- `created_at` – Erstellungszeitpunkt
- `updated_at` – letzter Änderungszeitpunkt

**Tabelle: subtasks**
- `id` – eindeutiger Bezeichner (UUID)
- `todo_id` – Fremdschlüssel auf `todos`
- `title` – Pflichtfeld
- `created_at`

Gespeichert in: PostgreSQL-Datenbank (Neon)

**Cleanup:** Ein Cron-Job (Vercel Cron) löscht täglich alle Einträge, bei denen `deleted_at` älter als 7 Tage ist – inklusive zugehöriger Subtasks.

### API / Daten-Fluss

- `GET  /api/todos`              → Alle aktiven Todos des Users (deleted_at IS NULL)
- `GET  /api/todos?bin=true`     → Todos im Papierkorb (deleted_at IS NOT NULL, ≤ 7 Tage)
- `POST /api/todos`              → Neues Todo erstellen (inkl. optionaler Subtasks)
- `PATCH /api/todos/[id]`        → Todo-Felder aktualisieren oder Subtasks synchronisieren
- `DELETE /api/todos/[id]`       → Soft Delete (setzt deleted_at)
- `POST /api/todos/[id]/restore` → Wiederherstellen (setzt deleted_at auf NULL)

Optimistic UI: Lokaler State wird sofort aktualisiert; bei API-Fehler wird rollback durchgeführt und ein Toast mit Retry-Option gezeigt.

### Tech-Entscheidungen

- **Zustandsverwaltung:** Zustand (lightweight Zustand-Library für React) statt Redux oder Context – passend für diesen Scope, kein Boilerplate
- **Bottom Sheets:** Vaul (von Emil Kowalski) – nativer Swipe-Support auf iOS/Android-Browsern, einfache Integration mit Next.js / Radix
- **Komplexitäts-Segment:** Custom-Komponente mit `role="radiogroup"`, kein externer Picker nötig
- **Deadline-Input:** Native HTML `<input type="date">` – kein Custom-Calendar, spart Abhängigkeit und ist system-nativ auf Mobile
- **Toast / Undo:** Sonner (von Emil Kowalski) – Kompatibel mit Vaul, unterstützt Action-Buttons ("Rückgängig")
- **Soft Delete Cleanup:** Vercel Cron (täglich 02:00 UTC) ruft `/api/cron/cleanup-trash` auf

### Security-Anforderungen

- **Authentifizierung:** Jede API-Route prüft die Session via Neon Auth. Unauthentifizierte Requests → 401.
- **Autorisierung:** Jede Datenbankabfrage filtert explizit nach `user_id = session.userId`. Ein User kann nie auf Todos eines anderen Users zugreifen – auch nicht durch direkte ID-Manipulation.
- **Input-Validierung:** Server-seitig mit Zod auf allen POST/PATCH-Routen (Titel nicht leer, Deadline valides Datum, Complexity valider Enum-Wert). Client-seitig zusätzlich als UX-Feedback (Button disabled, rote Outline).
- **OWASP-relevante Punkte:**
  - XSS: React escapet Output automatisch; kein `dangerouslySetInnerHTML`
  - SQL-Injection: Parametrisierte Queries via Neon-SDK / Drizzle ORM – kein Raw-SQL mit User-Input
  - CSRF: Next.js API Routes sind via Same-Origin-Policy geschützt; zusätzlich prüft Neon Auth die Session-Cookie-Herkunft

### Dependencies

- `vaul` – Bottom Sheet mit Swipe-to-close für Mobile
- `sonner` – Toast-Notifications mit Action-Buttons (Undo)
- `zustand` – Client-seitiger State für Todo-Liste und Optimistic Updates
- `zod` – Schema-Validierung für API-Input
- `drizzle-orm` – Type-safe Query Builder für Neon PostgreSQL

### Test-Setup

- **Unit Tests:** KomplexitätSelector (Segment-Control-Logik), Soft-Delete-Logik (7-Tage-Berechnung), Zod-Schemas für API-Input-Validierung
- **Integration Tests:** API-Routen (POST, PATCH, DELETE, restore) gegen eine Test-Datenbank; Cron-Cleanup-Route mit simulierten abgelaufenen Einträgen
- **E2E Tests (Playwright):**
  - Todo erstellen (Titel + Speichern → erscheint in Liste)
  - Todo ohne Titel → Button bleibt disabled
  - Deadline in Vergangenheit → Hinweis erscheint
  - Todo löschen → Papierkorb-Ansicht zeigt es; Wiederherstellen → zurück in aktiver Liste
  - Unsaved Changes Dialog beim Swipe-down mit Änderungen
