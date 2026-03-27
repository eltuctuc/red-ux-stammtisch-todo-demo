# FEAT-1: Todo-Verwaltung

## Status
Aktueller Schritt: Done

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
*Ausgefüllt von: /solution-architect — 2026-03-27 (korrigiert: falscher React/Next.js-Stack ersetzt durch Nuxt.js/Vue 3)*

### Component-Struktur

```
app/pages/index.vue  (Hauptscreen – Todo-Liste)
├── StickyHeader.vue
│   ├── AppTitle
│   └── FilterToggle (Aktiv | Papierkorb)
├── TodoListContent.vue
│   ├── TodoCard.vue (wiederholt)
│   │   ├── TodoTitle
│   │   └── MetaRow (Deadline • Komplexität)
│   └── EmptyState.vue
└── FAB.vue

NewTodoSheet.vue (Bottom Sheet – custom via <Teleport> + <Transition>)
├── SheetHandle
├── TitelInput (Autofocus)
├── DeadlinePicker
├── KomplexitätSelector.vue (Segment-Control XS–XL)
├── SubtaskList.vue (expandierbar)
│   └── SubtaskInput (wiederholt)
└── SaveButton

EditTodoSheet.vue (Full-Sheet – gleiche Basis wie NewTodoSheet)
├── SheetHandle
├── DeleteButton (oben rechts, destruktiv)
├── TitelInput
├── DeadlinePicker
├── KomplexitätSelector.vue (wiederverwendet)
├── SubtaskList.vue (wiederverwendet)
└── SaveButton

UnsavedChangesDialog.vue (Modal)
└── "Änderungen verwerfen?" mit Confirm / Abbrechen
```

Keine bestehenden Komponenten zum Wiederverwenden (Greenfield).

### Daten-Model

**Tabelle: todos**
- `id` – eindeutiger Bezeichner (UUID)
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

Gespeichert in: PostgreSQL-Datenbank (Neon) via Drizzle ORM.

Kein `user_id` nötig – Single-User-App, kein Multi-Tenant-Konzept.

**Cleanup:** Ein Vercel Cron Job (täglich 02:00 UTC) ruft die Nuxt Server Route `POST /api/cron/cleanup-trash` auf und löscht alle `todos`-Einträge, bei denen `deleted_at` älter als 7 Tage ist – inklusive zugehöriger Subtasks.

### API / Daten-Fluss

Nuxt Server Routes (`server/api/`) als h3 Event Handler:

- `GET  /api/todos`              → Alle aktiven Todos (deleted_at IS NULL)
- `GET  /api/todos?bin=true`     → Todos im Papierkorb (deleted_at IS NOT NULL, ≤ 7 Tage)
- `POST /api/todos`              → Neues Todo erstellen (inkl. optionaler Subtasks)
- `PATCH /api/todos/[id]`        → Todo-Felder aktualisieren oder Subtasks synchronisieren
- `DELETE /api/todos/[id]`       → Soft Delete (setzt deleted_at)
- `POST /api/todos/[id]/restore` → Wiederherstellen (setzt deleted_at auf NULL)
- `POST /api/cron/cleanup-trash` → Dauerhaftes Löschen abgelaufener Papierkorb-Einträge (nur Vercel Cron)

Optimistic UI via Pinia Store: Lokaler State wird sofort aktualisiert; bei API-Fehler wird Rollback durchgeführt und ein Toast mit Retry-Option angezeigt.

Client-seitige API-Aufrufe laufen über Nuxts `$fetch` (auto-importiert).

### Tech-Entscheidungen

- **Zustandsverwaltung:** Pinia (`@pinia/nuxt`) – Vue-nativer Store, in Nuxt auto-integriert, kein Boilerplate
- **Bottom Sheets:** Custom-Komponente mit Vue `<Teleport>` (rendert ins `<body>`) + `<Transition>` für Slide-up-Animation – kein externer Package nötig, idiomatic Vue, voller Swipe-Control über Vue-Events
- **Komplexitäts-Segment:** Custom `KomplexitätSelector.vue` mit `role="radiogroup"` – keine externe Abhängigkeit
- **Deadline-Input:** Native HTML `<input type="date">` – system-nativ auf Mobile, kein Custom-Calendar
- **Toast / Undo:** `vue-sonner` (Vue-Port von Sonner) – unterstützt Action-Buttons ("Rückgängig"), minimal, tree-shakeable
- **Validierung:** `zod` – framework-agnostisch, funktioniert server- und clientseitig
- **Soft Delete Cleanup:** Vercel Cron (täglich 02:00 UTC) → `POST /api/cron/cleanup-trash`

### Security-Anforderungen

- **Authentifizierung:** Nuxt Server Middleware (`server/middleware/auth.ts`) prüft bei jedem API-Request ein Session-Cookie gegen den PIN (Env-Variable `NUXT_AUTH_PIN`, 6-stellig). Kein Auth-Framework. Unauthentifizierte Requests → 401.
- **Autorisierung:** Entfällt – Single-User-App, kein `user_id`-Konzept. Wer den PIN kennt, hat vollen Zugriff.
- **Input-Validierung:** Server-seitig mit Zod auf allen POST/PATCH-Routen (Titel nicht leer, Deadline valides Datum, Complexity valider Enum-Wert). Client-seitig zusätzlich als UX-Feedback (Button disabled, rote Outline).
- **OWASP-relevante Punkte:**
  - XSS: Vue escapet Template-Output automatisch; kein `v-html` mit User-Daten
  - SQL-Injection: Parametrisierte Queries via Drizzle ORM – kein Raw-SQL mit User-Input
  - CSRF: Nuxt Server Routes sind via Same-Origin-Policy geschützt; Session-Cookie mit `HttpOnly` + `SameSite=Strict`
  - Cron-Route: Zusätzlich per `CRON_SECRET`-Header gesichert (Vercel-Standard)

### Dependencies

Neu zu installieren:
- `@pinia/nuxt` – Pinia-Modul für Nuxt (State Management)
- `vue-sonner` – Toast-Notifications mit Action-Buttons (Undo)
- `zod` – Schema-Validierung für API-Input

Bereits vorhanden:
- `@neondatabase/serverless` – Neon PostgreSQL Client
- `drizzle-orm` – Type-safe Query Builder

### Test-Setup

- **Unit Tests:** `KomplexitätSelector.vue` (Segment-Control-Logik), Soft-Delete-Berechnung (7-Tage-Grenze), Zod-Schemas für API-Input-Validierung
- **Integration Tests:** Nuxt Server Routes (POST, PATCH, DELETE, restore) gegen eine Test-Datenbank; Cron-Cleanup-Route mit simulierten abgelaufenen Einträgen
- **E2E Tests (Playwright):**
  - Todo erstellen (Titel eingeben + Speichern → erscheint in Liste)
  - Todo ohne Titel → Speichern-Button bleibt disabled
  - Deadline in Vergangenheit → Hinweis erscheint
  - Todo löschen → Papierkorb-Ansicht zeigt es; Wiederherstellen → zurück in aktiver Liste
  - Unsaved Changes Dialog beim Swipe-down mit ungespeicherten Änderungen

---

## 4. Implementierung
*Ausgefüllt von: /developer — 2026-03-27*

### Implementierte Dateien

**Konfiguration:**
- `red-ux-stammtisch-todo-demo/nuxt.config.ts` – Pinia-Modul + Server-RuntimeConfig
- `red-ux-stammtisch-todo-demo/drizzle.config.ts` – Drizzle-Kit Konfiguration für Migrationen

**Datenbank:**
- `red-ux-stammtisch-todo-demo/server/db/schema.ts` – Drizzle Schema: todos + subtasks + complexityEnum
- `red-ux-stammtisch-todo-demo/server/db/index.ts` – Neon/Drizzle Datenbankverbindung

**Auth (Infrastruktur):**
- `red-ux-stammtisch-todo-demo/server/middleware/auth.ts` – PIN-Validierung via HMAC-Cookie
- `red-ux-stammtisch-todo-demo/server/api/auth/login.post.ts` – Login-Endpoint (setzt HttpOnly-Cookie)
- `red-ux-stammtisch-todo-demo/server/api/auth/logout.post.ts` – Logout-Endpoint

**API Routes:**
- `red-ux-stammtisch-todo-demo/server/api/todos/index.get.ts` – Todos laden (aktiv + Papierkorb)
- `red-ux-stammtisch-todo-demo/server/api/todos/index.post.ts` – Todo erstellen
- `red-ux-stammtisch-todo-demo/server/api/todos/[id].patch.ts` – Todo aktualisieren (inkl. Subtask-Sync)
- `red-ux-stammtisch-todo-demo/server/api/todos/[id].delete.ts` – Soft Delete
- `red-ux-stammtisch-todo-demo/server/api/todos/[id]/restore.post.ts` – Wiederherstellen aus Papierkorb
- `red-ux-stammtisch-todo-demo/server/api/cron/cleanup-trash.post.ts` – Papierkorb nach 7 Tagen leeren

**State:**
- `red-ux-stammtisch-todo-demo/app/stores/todos.ts` – Pinia Store mit Optimistic UI + Toast-Feedback

**Komponenten:**
- `red-ux-stammtisch-todo-demo/app/components/BottomSheet.vue` – Base Sheet (Teleport + Transition, Swipe-to-close)
- `red-ux-stammtisch-todo-demo/app/components/KomplexitaetSelector.vue` – Segment-Control XS–XL
- `red-ux-stammtisch-todo-demo/app/components/SubtaskList.vue` – Subtask-Eingabe mit Add/Remove
- `red-ux-stammtisch-todo-demo/app/components/TodoCard.vue` – Todo-Karte mit Overdue-Indikator
- `red-ux-stammtisch-todo-demo/app/components/EmptyState.vue` – Leer-Zustand (aktiv + Papierkorb)
- `red-ux-stammtisch-todo-demo/app/components/FAB.vue` – Floating Action Button
- `red-ux-stammtisch-todo-demo/app/components/StickyHeader.vue` – Header + Filter-Toggle
- `red-ux-stammtisch-todo-demo/app/components/NewTodoSheet.vue` – Half-Sheet: Todo erstellen
- `red-ux-stammtisch-todo-demo/app/components/EditTodoSheet.vue` – Full-Sheet: Todo bearbeiten/löschen
- `red-ux-stammtisch-todo-demo/app/components/UnsavedChangesDialog.vue` – Bestätigungsdialog bei Abbruch

**Pages:**
- `red-ux-stammtisch-todo-demo/app/pages/index.vue` – Hauptscreen: Todo-Liste
- `red-ux-stammtisch-todo-demo/app/app.vue` – Root: NuxtPage + Sonner Toaster + Global CSS

### Installierte Dependencies
- `@pinia/nuxt@^0.10.1` – Vue State Management
- `vue-sonner@^2.0.0` – Toast-Notifications
- `zod@^3.24.2` – Server-seitige Input-Validierung

### Offene Punkte / Tech-Debt
- DB-Migrations müssen manuell via `drizzle-kit push` eingespielt werden (keine Auto-Migration)
- Login-UI (PIN-Eingabe) ist noch nicht gebaut – das ist FEAT-8; bis dahin per API-Call testbar
- `NUXT_AUTH_PIN`, `NUXT_SESSION_SECRET`, `NUXT_DATABASE_URL`, `NUXT_CRON_SECRET` müssen als Env-Variablen gesetzt werden

---

## 5. QA Ergebnisse
*Ausgefüllt von: /qa-engineer — 2026-03-27*

### Acceptance Criteria Status
- [x] AC-1: Neues Todo mit Titel (Pflicht), optionaler Deadline, Komplexität (Default M), optionalen Unteraufgaben erstellen ✅
- [x] AC-2: Ohne Titel lässt sich kein Todo speichern – Fehlermeldung erscheint ✅
- [x] AC-3: Deadline in der Vergangenheit zeigt Hinweis, Speichern bleibt möglich ✅
- [x] AC-4: Todo bearbeiten (alle Felder, inkl. Unteraufgaben hinzufügen/entfernen) ✅
- [x] AC-5: Todo in Papierkorb verschieben (Soft Delete) ✅
- [x] AC-6: Papierkorb-Ansicht via Filter-Toggle einsehbar ✅
- [x] AC-7: Wiederherstellung aus Papierkorb innerhalb von 7 Tagen ✅
- [x] AC-8: Dauerhaftes Löschen nach 7 Tagen (Cron-Job) ✅
- [x] AC-9: Gesamte Erfassungsstrecke auf Smartphone mit Daumen bedienbar ✅

### Security-Check
- ✅ Alle API-Routen außer öffentliche Pfade durch Auth-Middleware geschützt
- ✅ Cron-Route durch separaten `x-cron-secret`-Header gesichert (nicht durch Session-Cookie)
- ✅ UUID-Validierung via Zod auf allen `[id]`-Routen verhindert Injection
- ✅ Soft-Delete-Schutz: gelöschte Todos können nicht weiter manipuliert werden
- ✅ Input-Validierung serverseitig (Zod) auf allen POST/PATCH-Routen
- ⚠️ BUG-FEAT1-QA-007 (Low, offen): Timing-Angriff auf Session-Token-Vergleich – Risiko bei Single-User-App sehr gering, kein Fix vor Release nötig

### A11y-Check
- ✅ ARIA Radiogroup mit Roving Tabindex in KomplexitaetSelector (ArrowLeft/Right/Home/End)
- ✅ Focus Trap in BottomSheet und UnsavedChangesDialog mit `previouslyFocused`-Rückgabe
- ✅ `role="dialog"` und `aria-modal="true"` auf BottomSheet
- ✅ `aria-live="polite"` auf Deadline-Warnung und Fehler-Meldungen
- ✅ Touch-Targets ≥ 44px auf allen interaktiven Elementen
- ✅ `aria-label` auf allen relevanten Buttons und Inputs
- ⚠️ BUG-FEAT1-UX-010 (Low, offen): Empty-State Chevron zeigt falsche Richtung – rein visuell, kein Barrierefreiheitsproblem

### Offene Bugs
- BUG-FEAT1-QA-007 – Timing Attack auf Session-Token-Vergleich (Low)
- BUG-FEAT1-UX-010 – Empty-State Chevron zeigt nach links statt unten (Low)

### Behobene Bugs (22 von 24)
- BUG-FEAT1-QA-001 – Cron-Route durch Auth-Middleware blockiert (Critical) ✅
- BUG-FEAT1-QA-002 – Sheet schließt bei API-Fehler, Daten verloren (High) ✅
- BUG-FEAT1-QA-003 – Gelöschte Todos manipulierbar (High) ✅
- BUG-FEAT1-QA-004 – Fehlende UUID-Validierung (High) ✅
- BUG-FEAT1-QA-005 – Ungefilterte Subtask-Query (Medium) ✅
- BUG-FEAT1-QA-006 – Restore ohne Ablaufprüfung (Medium) ✅
- BUG-FEAT1-QA-008 – Fehlende Zod-Validierung auf Subtask-Titeln (Medium) ✅
- BUG-FEAT1-QA-009 – Fehlende Zod-Validierung auf Todo-Update (Medium) ✅
- BUG-FEAT1-QA-010 – window.confirm() auf iOS PWA (Medium) ✅
- BUG-FEAT1-UX-001 – Trash-Emoji statt SVG-Icon (Medium) ✅
- BUG-FEAT1-UX-002 – Kalender-Emoji in Deadline-Chip (Medium) ✅
- BUG-FEAT1-UX-003 – Subtask-Input ohne Fokus nach Hinzufügen (Medium) ✅
- BUG-FEAT1-UX-004 – Papierkorb-Karten als klickbare Buttons (High) ✅
- BUG-FEAT1-UX-005 – Toggle-Buttons im Header unter 44px (Medium) ✅
- BUG-FEAT1-UX-006 – Subtask-Löschen-Button unter 44px (Medium) ✅
- BUG-FEAT1-UX-007 – Fehlender focus-visible Stil auf Toggle-Buttons (Medium) ✅
- BUG-FEAT1-UX-008 – Fehlende Focus Trap in Dialogen (High) ✅
- BUG-FEAT1-UX-009 – Fehlende Tastaturnavigation in KomplexitaetSelector (Medium) ✅
- BUG-FEAT1-UX-011 – Swipe-Close bei gescrolltem Panel (High) ✅
- BUG-FEAT1-UX-012 – Fehlende aria-live auf Deadline-Warnung (Medium) ✅
- BUG-FEAT1-UX-013 – Kein Hinweis auf Unteraufgaben-Löschung beim Todo-Löschen (Medium) ✅
- BUG-FEAT1-UX-014 – Irreführender Subtask-Counter 0/N (Medium) ✅
- BUG-FEAT1-UX-015 – Header überlappt mit Notch/Dynamic Island (Medium) ✅
- BUG-FEAT1-UX-016 – Lösch-Bestätigung via window.confirm() (Medium) ✅

### Summary
- ✅ 9 Acceptance Criteria passed
- ❌ 2 Bugs offen (0 Critical, 0 High, 0 Medium, 2 Low)
- ✅ 22 Bugs behoben

### Production-Ready
✅ Ready – Keine Critical oder High Bugs offen. 2 Low-Priority-Bugs (Timing-Attack-Risiko minimal bei Single-User, Empty-State-Optik) bewusst zurückgestellt.
