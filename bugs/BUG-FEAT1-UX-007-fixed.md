# BUG-FEAT1-UX-007: Kein Fokus-Management nach Sheet-Schließen

- **Feature:** FEAT-1 – Todo-Verwaltung
- **Severity:** Medium
- **Bereich:** A11y | Flow
- **Gefunden von:** UX Reviewer
- **Status:** Fixed — 2026-03-27

## Problem
Wenn ein Bottom Sheet (NewTodoSheet oder EditTodoSheet) geschlossen wird, kehrt der Fokus nicht zum auslösenden Element zurück. Bei Keyboard-Nutzern bedeutet das: Der Fokus "verliert sich" – er landet irgendwo im DOM, nicht auf der TodoCard die das Sheet ausgelöst hat, und nicht auf dem FAB.

Das ist eine WCAG 2.1 Anforderung (Erfolgskriterium 2.4.3 – Fokus-Reihenfolge) und Standard-Erwartung bei modalen Dialogen.

Konkret betroffen:
- Nach Speichern im NewTodoSheet: Fokus sollte auf das neue TodoCard-Element oder auf den FAB zurückkehren
- Nach Speichern/Schließen im EditTodoSheet: Fokus sollte auf die bearbeitete TodoCard zurückkehren
- Nach UnsavedChangesDialog "Verwerfen": Fokus sollte auf die Liste zurückkehren

## Steps to Reproduce
1. Per Keyboard (Tab + Enter) den FAB fokussieren und aktivieren
2. NewTodoSheet öffnet sich, Fokus liegt korrekt auf dem Titel-Input
3. Sheet schließen (z.B. Escape-Taste oder Speichern)
4. Expected: Fokus kehrt auf den FAB zurück
5. Actual: Fokus ist im DOM verloren – Screen-Reader-Nutzer haben keine Orientierung

## Empfehlung
- Im BottomSheet, wenn `modelValue` von `true` zu `false` wechselt: einen `ref` auf das auslösende Element übergeben und nach der Schließ-Animation `.focus()` aufrufen
- Alternativ: Nach Sheet-Schließen `document.querySelector('.fab')?.focus()` als pragmatischer Fix für den FAB-Fall; für EditSheet das zuletzt geklickte TodoCard-Element fokussieren

## Priority
Fix before release
