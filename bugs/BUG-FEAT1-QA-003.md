# BUG-FEAT1-QA-003: PATCH-Route aktualisiert auch gelöschte Todos (kein Guard auf deletedAt)

- **Feature:** FEAT-1 – Todo-Verwaltung
- **Severity:** High
- **Bereich:** Security / Functional
- **Gefunden von:** QA Engineer
- **Status:** Open

## Beschreibung

`PATCH /api/todos/[id]` prüft nicht, ob das Ziel-Todo aktiv ist (deletedAt IS NULL). Ein Todo das sich im Papierkorb befindet kann vollständig verändert werden – Titel, Deadline, Komplexität, Subtasks.

Ebenso prüft `DELETE /api/todos/[id]` nicht, ob das Todo bereits gelöscht ist. Ein bereits gelöschtes Todo kann erneut "gelöscht" werden, was `deletedAt` auf den aktuellen Zeitpunkt zurücksetzt und damit die 7-Tage-Frist verlängert. Das ist ein De-facto-Weg, ein Todo im Papierkorb dauerhaft am Leben zu erhalten.

## Betroffene Dateien

- `/Users/enricoreinsdorf/Projekte/ux-stammtisch/red-ux-stammtisch-todo-demo/server/api/todos/[id].patch.ts`
- `/Users/enricoreinsdorf/Projekte/ux-stammtisch/red-ux-stammtisch-todo-demo/server/api/todos/[id].delete.ts`

## Steps to Reproduce – PATCH auf gelöschtes Todo

1. Todo erstellen (id = X)
2. `DELETE /api/todos/X` → Todo ist im Papierkorb
3. `PATCH /api/todos/X` mit neuem Titel senden
4. Expected: 404 oder 409 – Todo ist nicht mehr aktiv, Änderungen werden abgelehnt
5. Actual: 200 – Titel wird geändert, deletedAt bleibt gesetzt

## Steps to Reproduce – deletedAt Reset via doppeltes DELETE

1. Todo erstellen (id = X), auf Datum T löschen
2. 6 Tage später: `DELETE /api/todos/X` erneut senden
3. Expected: 404 oder 409 – Todo ist bereits gelöscht
4. Actual: 200 – `deletedAt` wird auf den neuen Zeitpunkt gesetzt, 7-Tage-Frist startet von vorne

## Priority

Fix before release
