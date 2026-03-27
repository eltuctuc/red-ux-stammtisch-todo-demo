# BUG-FEAT1-UX-016: window.confirm() als Lösch-Bestätigung – nativer Dialog statt UI-konsistentem Dialog

- **Feature:** FEAT-1 – Todo-Verwaltung
- **Severity:** Medium
- **Bereich:** UX | Konsistenz
- **Gefunden von:** UX Reviewer (Retest)
- **Status:** Fixed — 2026-03-27

## Problem
Der Fix für BUG-FEAT1-UX-003 hat `window.confirm()` eingesetzt, um bei Todos mit Unteraufgaben eine Bestätigung vor dem Löschen zu zeigen. Das löst das ursprüngliche Problem (keine Warnung bei Unteraufgaben) teilweise – allerdings ist `window.confirm()` ein nativer Browser-Dialog, der:

1. Optisch komplett aus dem App-Design fällt (kein Branding, kein Orange, kein einheitlicher Button-Stil)
2. Auf iOS in PWA-Kontext / Vollbild-Modus blockiert werden kann (bekanntes iOS-Verhalten: `window.confirm()` gibt in manchen Standalone-Modi direkt `false` zurück oder wird unterdrückt)
3. Keinen Screenshot-fähigen Zustand für Tests produziert
4. Nicht dem übrigen Muster entspricht – der UnsavedChangesDialog ist bereits vorhanden und zeigt, wie Bestätigungen UI-konsistent aussehen sollen

Todos **ohne** Unteraufgaben erhalten nach wie vor keine Bestätigung vor dem Löschen. Das war laut ursprünglicher Bug-Beschreibung explizit benannt: Der Undo-Toast ist der einzige Schutzmechanismus. Das ist akzeptabel wenn der Toast zuverlässig erscheint (ist er, Store ist korrekt implementiert) – aber das Muster ist jetzt inkonsistent: Todos mit Unteraufgaben erhalten einen Confirm-Dialog, Todos ohne nicht.

## Steps to Reproduce
1. Todo mit Unteraufgaben anlegen
2. EditTodoSheet öffnen, Delete-Button tippen
3. Expected: UI-konsistenter Bestätigungsdialog (wie UnsavedChangesDialog) – gleicher visueller Stil, kein nativer Browser-Dialog
4. Actual: Nativer `window.confirm()` erscheint – bricht aus dem App-Design aus

## Empfehlung
Den `window.confirm()`-Aufruf in `handleDelete()` durch eine Nutzung des bereits vorhandenen `UnsavedChangesDialog`-Musters ersetzen – oder einen dedizierten `DeleteConfirmDialog` mit dem Hinweistext "X Unteraufgaben werden mitgelöscht" implementieren. Alternativ: Für alle Todos (mit und ohne Unteraufgaben) den Dialog zeigen und dort die Anzahl der Unteraufgaben conditional einblenden.

## Priority
Fix before release
