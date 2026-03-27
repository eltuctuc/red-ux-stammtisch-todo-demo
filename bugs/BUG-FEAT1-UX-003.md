# BUG-FEAT1-UX-003: Kein Bestätigungsdialog vor dem Löschen eines Todos

- **Feature:** FEAT-1 – Todo-Verwaltung
- **Severity:** High
- **Bereich:** UX | Flow
- **Gefunden von:** UX Reviewer
- **Status:** Open

## Problem
Der Delete-Button im EditTodoSheet schließt das Sheet sofort und führt den Soft Delete durch – ohne jeden Bestätigungsschritt. Zwar gibt es anschließend einen Undo-Toast (spezifiziert mit 3 Sekunden), aber dieser ist in der Frontend-Implementierung nicht direkt im EditTodoSheet sichtbar. Der Nutzer erhält keine explizite Warnung "Willst du das wirklich?" vor einer destruktiven Aktion.

Das ist besonders kritisch für Todos mit Unteraufgaben: Laut Spec werden alle Unteraufgaben mit gelöscht. Der Nutzer hat keine Möglichkeit, das vor der Ausführung zu erkennen.

Die Spec definiert für das Löschen explizit: "Sheet schließt sofort + Toast 'Gelöscht. Rückgängig?' (3 Sek.)" – ein Undo-Toast ist also der einzige Schutzmechanismus. Dieser muss zwingend implementiert und sichtbar sein. Falls der Toast nicht erscheint (API-Fehler, Infobar überdeckt ihn), hat der Nutzer keine Möglichkeit zur Korrektur.

Aktuell ruft `handleDelete()` direkt `store.deleteTodo()` auf ohne jede Nutzerbestätigung oder sichtbares Feedback in der UI-Schicht.

## Steps to Reproduce
1. Todo mit mehreren Unteraufgaben anlegen
2. Todo antippen → EditTodoSheet öffnen
3. Delete-Button tippen
4. Expected: Undo-Toast erscheint sofort und prominent ("Gelöscht. Rückgängig?") mit 3-Sekunden-Fenster
5. Actual: Sheet schließt, kein sichtbarer Bestätigungsmechanismus in der Komponente selbst – ob der Toast erscheint, hängt von der Pinia-Store-Implementierung ab, die hier nicht geprüft werden kann

## Empfehlung
Zwei Optionen:
- **Option A (Spec-konform):** Sicherstellen, dass der Pinia Store nach `deleteTodo()` immer einen Sonner-Toast mit "Rückgängig"-Action auslöst. Die Store-Implementierung muss geprüft und ggf. nachgebessert werden.
- **Option B (zusätzlicher Schutz bei Todos mit Unteraufgaben):** Bei Todos mit Unteraufgaben vor dem Löschen einen Bestätigungsdialog zeigen ("Dieses Todo hat X Unteraufgaben. Alle werden gelöscht.").

## Priority
Fix before release
