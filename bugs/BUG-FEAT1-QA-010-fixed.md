# BUG-FEAT1-QA-010: window.confirm beim Löschen mit Unteraufgaben – inkonsistent mit UnsavedChangesDialog und SSR-inkompatibel

- **Feature:** FEAT-1 – Todo-Verwaltung
- **Severity:** Medium
- **Bereich:** Functional / Regression
- **Gefunden von:** QA Engineer (Retest 2026-03-27)
- **Status:** Fixed — 2026-03-27

## Beschreibung

In `EditTodoSheet.vue` wird bei `handleDelete()` ein natives `window.confirm()` aufgerufen, wenn das Todo Unteraufgaben hat (Zeile 174–178). Die restliche App verwendet durchgängig den eigens implementierten `UnsavedChangesDialog.vue` für Bestätigungsdialoge – das native `window.confirm` ist eine Inkonsistenz.

Konkrete Probleme:

**Problem 1 – SSR-Inkompatibilität:** `window` ist im Nuxt-SSR-Kontext nicht verfügbar. Falls diese Komponente serverseitig gerendert wird, wirft der Aufruf einen ReferenceError. Nuxt schützt Client-Komponenten in der Regel vor SSR, aber `<script setup>` ohne explizites `onMounted` macht diesen Pfad gefährlich.

**Problem 2 – Mobile/PWA-Verhalten:** Auf iOS Safari im Standalone-Modus (als PWA) zeigt `window.confirm` keinen nativen Dialog an und gibt immer `true` zurück (bekanntes Browser-Verhalten seit iOS 16.4+). Das bedeutet: Der Nutzer bekommt keine Bestätigung, das Todo wird sofort gelöscht, egal wie viele Unteraufgaben existieren.

**Problem 3 – Inkonsistenz:** `UnsavedChangesDialog.vue` ist bereits im Projekt vorhanden und wird in `handleRequestClose()` derselben Komponente verwendet. Das Nebeneinander von nativem Dialog und Custom-Dialog für verschiedene Bestätigungsflows in derselben Datei ist eine Design-Inkonsistenz.

**Problem 4 – Kein Accessibility-Support:** Native `window.confirm`-Dialoge sind nicht mit `aria-modal`, Focus-Trap oder Keyboard-Navigation gemäß den im Tech-Design definierten A11y-Anforderungen ausgestattet.

## Betroffene Dateien

- `/Users/enricoreinsdorf/Projekte/ux-stammtisch/red-ux-stammtisch-todo-demo/app/components/EditTodoSheet.vue` (Zeilen 172–182)

## Steps to Reproduce – iOS PWA / window.confirm gibt immer true zurück

1. App als PWA auf iOS installieren (Standalone-Modus)
2. Todo mit mindestens einer Unteraufgabe öffnen (EditTodoSheet)
3. Löschen-Icon antippen
4. Expected: Bestätigungsdialog erscheint, Nutzer kann abbrechen
5. Actual: window.confirm gibt true zurück ohne sichtbaren Dialog, Todo wird sofort gelöscht

## Steps to Reproduce – Inkonsistenz

1. EditTodoSheet öffnen
2. Änderungen vornehmen, dann Swipe-down → UnsavedChangesDialog erscheint (custom, korrekt)
3. Ohne Änderungen, Todo mit Unteraufgabe löschen → nativer window.confirm erscheint (inkonsistent)

## Fix-Hinweis

`window.confirm` durch einen reaktiven Confirmation-State ersetzen, der denselben `UnsavedChangesDialog.vue` (oder eine äquivalente Custom-Komponente) auslöst. Der Delete-Flow sollte dann zweistufig sein: Button-Klick setzt `showDeleteConfirm = true`, Dialog-Confirm ruft `store.deleteTodo()` auf.

## Priority

Fix before release
