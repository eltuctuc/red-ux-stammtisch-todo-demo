# BUG-FEAT1-QA-005: Alle Subtasks werden ungefiltert geladen – N+1-ähnlicher Fehler und falsche Zuordnung möglich

- **Feature:** FEAT-1 – Todo-Verwaltung
- **Severity:** Medium
- **Bereich:** Performance / Functional
- **Gefunden von:** QA Engineer
- **Status:** Fixed — 2026-03-27

## Beschreibung

In `GET /api/todos` wird `db.select().from(subtasks)` ohne WHERE-Klausel ausgeführt – es werden also IMMER alle Subtasks aus der Datenbank geladen, unabhängig davon wie viele aktive Todos vorhanden sind.

```typescript
// index.get.ts, Zeile 27
const subtaskRows = await db.select().from(subtasks)
```

Zwei Probleme:

**Problem 1 – Performance:** Wenn die Datenbank tausende historische Subtasks enthält (auch von bereits permanent gelöschten Todos, falls Cascade-Delete ein Timing-Problem hatte), werden diese alle geladen und dann in JavaScript verworfen.

**Problem 2 – Bin-View-Konsistenz:** Im Bin-View werden nur gefilterte `todoRows` zurückgegeben (Todos mit deletedAt ≤ 7 Tage alt), aber alle Subtasks werden geladen. Subtasks von Todos, die älter als 7 Tage sind und vom Cron noch nicht gelöscht wurden, könnten theoretisch falsch zugeordnet werden – obwohl das bei UUID-basierter Zuordnung statistisch ausgeschlossen ist. Das eigentliche Problem ist Performance und Defense-in-Depth.

Die korrekte Lösung wäre ein JOIN oder eine WHERE-Klausel mit `inArray`.

## Betroffene Dateien

- `/Users/enricoreinsdorf/Projekte/ux-stammtisch/red-ux-stammtisch-todo-demo/server/api/todos/index.get.ts` (Zeile 27)

## Steps to Reproduce

1. Große Anzahl Todos erstellen und löschen (sodass viele Subtasks in der DB verbleiben)
2. `GET /api/todos` aufrufen
3. Expected: Nur Subtasks der zurückgegebenen Todos werden geladen (gefiltert per JOIN oder inArray)
4. Actual: Alle Subtasks werden geladen, in JavaScript gefiltert – Query-Kosten wachsen mit Gesamtdatenmenge

## Priority

Fix before release
