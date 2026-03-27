# BUG-FEAT1-QA-006: Restore-Route prüft nicht ob Todo tatsächlich gelöscht ist und 7-Tage-Frist noch gilt

- **Feature:** FEAT-1 – Todo-Verwaltung
- **Severity:** Medium
- **Bereich:** Functional
- **Gefunden von:** QA Engineer
- **Status:** Fixed — 2026-03-27

## Beschreibung

`POST /api/todos/[id]/restore` setzt `deletedAt = null` auf jedem Todo, das die angegebene ID hat – unabhängig davon:

1. ob das Todo überhaupt gelöscht ist (deletedAt könnte NULL sein → aktives Todo wird "wiederhergestellt")
2. ob die 7-Tage-Frist noch nicht abgelaufen ist

**Konsequenz 1:** Ein aktives Todo kann über die Restore-Route in einen inkonsistenten Zustand gebracht werden (updatedAt wird geändert, obwohl deletedAt schon NULL war). Kein direkter Datenverlust, aber fehlerhafte Semantik.

**Konsequenz 2:** Wenn der Cron-Job (BUG-001) nicht läuft, bleiben expired Todos in der DB. Ein Nutzer könnte diese per direktem API-Aufruf wiederherstellen, obwohl die UI sie nicht mehr anzeigt (weil der GET-Endpoint clientseitig nach 7 Tagen filtert). Das verletzt die Spec: "Wiederherstellen eines Todos, dessen Papierkorb-Frist abgelaufen ist: Nicht möglich."

## Betroffene Dateien

- `/Users/enricoreinsdorf/Projekte/ux-stammtisch/red-ux-stammtisch-todo-demo/server/api/todos/[id]/restore.post.ts`

## Steps to Reproduce – Restore nach abgelaufener Frist

1. Todo löschen (deletedAt = T)
2. 8 Tage warten (oder deletedAt manuell auf 8 Tage in der Vergangenheit setzen)
3. `POST /api/todos/{id}/restore` direkt aufrufen
4. Expected: 404 oder 409 – Frist abgelaufen, Todo nicht mehr wiederherstellbar
5. Actual: 200 – Todo wird wiederhergestellt (deletedAt = null), erscheint wieder in aktiver Liste

## Priority

Fix before release
