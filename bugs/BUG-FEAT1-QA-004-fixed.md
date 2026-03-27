# BUG-FEAT1-QA-004: URL-Parameter [id] wird nicht auf UUID-Format validiert

- **Feature:** FEAT-1 – Todo-Verwaltung
- **Severity:** High
- **Bereich:** Security
- **Gefunden von:** QA Engineer
- **Status:** Fixed — 2026-03-27

## Beschreibung

In allen dynamischen API-Routen (`[id].patch.ts`, `[id].delete.ts`, `[id]/restore.post.ts`) wird `getRouterParam(event, 'id')` direkt ohne Validierung in die Drizzle-Query eingesetzt. Es findet keine Prüfung statt, ob der Wert ein gültiges UUID-Format hat.

Drizzle ORM verwendet parametrisierte Queries, SQL-Injection ist daher nicht möglich. Aber:

1. **Fehlerverhalten:** Bei einem Wert wie `../../../../etc` oder `<script>` liefert PostgreSQL einen Fehler (kein valider UUID-Cast), der als unbehandelter 500-Fehler mit Datenbank-Detailinformationen zurückgegeben werden kann.
2. **Information Disclosure:** Je nach Fehler-Serialisierung in Nuxt/h3 kann der Stack-Trace oder die DB-Fehlermeldung im Response-Body landen.
3. **Defense-in-Depth:** Die ID kommt vom Client und sollte immer validiert werden, bevor sie an die DB weitergegeben wird.

## Betroffene Dateien

- `/Users/enricoreinsdorf/Projekte/ux-stammtisch/red-ux-stammtisch-todo-demo/server/api/todos/[id].patch.ts` (Zeile 21)
- `/Users/enricoreinsdorf/Projekte/ux-stammtisch/red-ux-stammtisch-todo-demo/server/api/todos/[id].delete.ts` (Zeile 6)
- `/Users/enricoreinsdorf/Projekte/ux-stammtisch/red-ux-stammtisch-todo-demo/server/api/todos/[id]/restore.post.ts` (Zeile 6)

## Steps to Reproduce

1. Authentifizierten Session-Cookie beschaffen (normaler Login)
2. `PATCH /api/todos/not-a-uuid` mit validem Body senden
3. Expected: 400 Bad Request mit klarer Fehlermeldung "Ungültige ID"
4. Actual: Datenbankfehler, potenziell 500 mit internen Details

## Fix-Hinweis

`z.string().uuid()` per `getRouterParam` vor der DB-Query validieren.

## Priority

Fix before release
