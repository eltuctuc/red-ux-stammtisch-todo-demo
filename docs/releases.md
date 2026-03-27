# Release History

## 2026-03-27

### Neue Features
- **FEAT-1 – Todo-Verwaltung:** Todos erstellen, bearbeiten, löschen und wiederherstellen mit Deadline, Komplexität (XS–XL) und Unteraufgaben; 7-Tage-Papierkorb mit automatischem Cleanup via Vercel Cron.

### Bug Fixes
- **BUG-FEAT1-QA-001:** Cron-Route durch Auth-Middleware blockiert – `/api/cron/cleanup-trash` zu PUBLIC_PATHS hinzugefügt *(Severity: Critical)*
- **BUG-FEAT1-QA-002:** Sheet schloss bei API-Fehler und verwarf ungespeicherte Daten – Store gibt jetzt `boolean` zurück, Sheet schließt nur bei Erfolg *(Severity: High)*
- **BUG-FEAT1-QA-003:** Gelöschte Todos konnten weiter bearbeitet/gelöscht werden – `isNull(deletedAt)`-Guard auf alle mutierenden Routen *(Severity: High)*
- **BUG-FEAT1-QA-004:** Fehlende UUID-Validierung ermöglichte Injection auf `[id]`-Routen – Zod UUID-Check vor DB-Zugriff *(Severity: High)*
- **BUG-FEAT1-QA-005:** Ungefilterte Subtask-Query lud Subtasks aller Todos – `inArray(todoId, todoIds)`-Filter ergänzt *(Severity: Medium)*
- **BUG-FEAT1-QA-006:** Restore-Route prüfte Ablauf der 7-Tage-Frist nicht – `isNotNull(deletedAt)` + Datumsvergleich ergänzt *(Severity: Medium)*
- **BUG-FEAT1-QA-008:** Fehlende Zod-Validierung auf Subtask-Titeln bei POST – Schema erweitert *(Severity: Medium)*
- **BUG-FEAT1-QA-009:** Fehlende Zod-Validierung auf Todo-Update (PATCH) – vollständiges Zod-Schema ergänzt *(Severity: Medium)*
- **BUG-FEAT1-QA-010:** `window.confirm()` funktioniert auf iOS PWA nicht – durch reaktiven Dialog mit UnsavedChangesDialog ersetzt *(Severity: Medium)*
- **BUG-FEAT1-UX-001:** Trash-Emoji statt konsistentem SVG-Icon im Edit-Sheet – durch Inline-SVG ersetzt *(Severity: Medium)*
- **BUG-FEAT1-UX-002:** Kalender-Emoji im Deadline-Chip – entfernt, reines Text-Datum *(Severity: Medium)*
- **BUG-FEAT1-UX-003:** Neues Subtask-Input-Feld erhielt keinen automatischen Fokus – `nextTick` + `focus()` auf letztes Input *(Severity: Medium)*
- **BUG-FEAT1-UX-004:** Papierkorb-Karten waren als Buttons gerendert und suggerierten Interaktivität – `readonly`-Prop rendert Karte als `<div>` *(Severity: High)*
- **BUG-FEAT1-UX-005:** Toggle-Buttons im Header unter 44px Mindestgröße – `min-height: 44px` gesetzt *(Severity: Medium)*
- **BUG-FEAT1-UX-006:** Subtask-Löschen-Button unter 44px – `width/height: 44px` gesetzt *(Severity: Medium)*
- **BUG-FEAT1-UX-007:** Kein `:focus-visible`-Stil auf Toggle-Buttons – Outline-Stil ergänzt *(Severity: Medium)*
- **BUG-FEAT1-UX-008:** Fehlende Focus Trap in BottomSheet und UnsavedChangesDialog – vollständige Focus-Trap-Implementierung mit Tab-Cycle und Escape-Handling *(Severity: High)*
- **BUG-FEAT1-UX-009:** Fehlende Tastaturnavigation (Arrow Keys) in KomplexitaetSelector – Roving Tabindex mit ArrowLeft/Right/Home/End implementiert *(Severity: Medium)*
- **BUG-FEAT1-UX-011:** Swipe-to-close aktivierte sich auch bei gescrolltem Panel-Inhalt – Swipe-Start nur wenn `scrollTop === 0` *(Severity: High)*
- **BUG-FEAT1-UX-012:** Fehlende `aria-live`-Region auf Deadline-Warnung – `aria-live="polite"` ergänzt *(Severity: Medium)*
- **BUG-FEAT1-UX-013:** Kein Hinweis beim Löschen von Todos mit Unteraufgaben – konfigurierbarer Bestätigungsdialog mit dynamischem Body-Text *(Severity: Medium)*
- **BUG-FEAT1-UX-014:** Subtask-Counter zeigte `0/N` (Fortschritt ohne Basis) – zu `N Teilaufgabe(n)` vereinfacht *(Severity: Medium)*
- **BUG-FEAT1-UX-015:** Header überlappt Notch/Dynamic Island auf iOS – `padding-top: max(12px, env(safe-area-inset-top))` *(Severity: Medium)*
- **BUG-FEAT1-UX-016:** Lösch-Bestätigung via `window.confirm()` – durch reaktiven UnsavedChangesDialog mit konfigurierbarem Title/Body/ConfirmLabel ersetzt *(Severity: Medium)*
