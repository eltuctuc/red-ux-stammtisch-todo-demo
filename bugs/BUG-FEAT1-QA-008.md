# BUG-FEAT1-QA-008: Trash-AC nicht erfüllt – Löschen eines Todos mit Unteraufgaben nicht explizit getestet/abgesichert

- **Feature:** FEAT-1 – Todo-Verwaltung
- **Severity:** Medium
- **Bereich:** Functional
- **Gefunden von:** QA Engineer
- **Status:** Open

## Beschreibung

Die Spec definiert als Edge Case: "Löschen eines Todos mit Unteraufgaben: Gesamtes Todo inkl. aller Unteraufgaben wird gemeinsam in den Papierkorb verschoben; Wiederherstellung stellt Parent + Unteraufgaben gemeinsam wieder her."

Das Schema-Design mit `onDelete: 'cascade'` auf dem FK `subtasks.todo_id → todos.id` ist für HARD DELETE korrekt. Beim Soft Delete (nur `deletedAt` setzen) bleiben die Subtasks jedoch aktiv in der DB – das ist gewollt und korrekt für die Wiederherstellung.

Das Problem: `GET /api/todos` (ohne `bin=true`) filtert Todos nach `deletedAt IS NULL`, aber lädt alle Subtasks global. Das bedeutet, die Subtasks eines gelöschten Todos könnten in der aktiven Ansicht einem anderen Todo falsch zugeordnet werden – wenn auch nur bei einem UUID-Kollisions-Szenario (statistisch ausgeschlossen, aber architektonisch unsicher).

Schwerwiegender: Es gibt keinen serverseitigen Test oder Guard, der sicherstellt, dass beim Soft-Delete eines Parent-Todos mit Unteraufgaben auch alle Subtasks korrekt mitgeführt werden. Die aktuelle Implementierung verlässt sich auf den FK-Cascade, der nur bei Hard-Delete greift.

**Konkretes Problem:** `GET /api/todos` (aktive Ansicht) lädt Subtasks ohne WHERE-Filter. Subtasks von Papierkorb-Todos erscheinen im API-Response der aktiven Todos, werden aber in JavaScript herausgefiltert (`subtaskRows.filter((s) => s.todoId === todo.id)`). Da die aktiven Todo-IDs keine gelöschten Todos enthalten, werden diese Subtasks in der Praxis nicht zugeordnet. Die Daten sind aber unnötig im Memory und im Response-Payload.

## Betroffene Dateien

- `/Users/enricoreinsdorf/Projekte/ux-stammtisch/red-ux-stammtisch-todo-demo/server/api/todos/index.get.ts`

## Steps to Reproduce

1. Todo mit 3 Unteraufgaben erstellen
2. Todo löschen (Soft Delete – nur deletedAt gesetzt)
3. `GET /api/todos` (ohne bin=true) aufrufen
4. Expected: Keine Subtasks des gelöschten Todos im Response
5. Actual: Alle Subtasks landen im `subtaskRows`-Array, werden im Map-Filter herausgefiltert, aber der unnötige DB-Transfer findet statt

## Priority

Fix before release
