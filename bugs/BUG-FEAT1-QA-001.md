# BUG-FEAT1-QA-001: Cron-Route scheitert immer mit 401 – Auth-Middleware blockiert Vercel Cron

- **Feature:** FEAT-1 – Todo-Verwaltung
- **Severity:** Critical
- **Bereich:** Functional / Security
- **Gefunden von:** QA Engineer
- **Status:** Open

## Beschreibung

Die Auth-Middleware in `server/middleware/auth.ts` schützt alle `/api/`-Routes, einschließlich `/api/cron/cleanup-trash`. Die Route prüft zusätzlich den `x-cron-secret`-Header. Beide Checks müssen bestehen.

Das Problem: Vercel Cron sendet keinen `auth-session`-Cookie. Die Middleware prüft zuerst das Session-Cookie und wirft bei fehlendem Cookie sofort einen 401-Fehler – bevor die Route überhaupt ihren eigenen `x-cron-secret`-Check erreicht.

**Konsequenz:** Der Cron-Job wird niemals erfolgreich ausgeführt. Papierkorb-Einträge werden nie dauerhaft gelöscht. Das ist ein direkter Verstoß gegen AC "Nach 7 Tagen im Papierkorb wird ein Todo dauerhaft und unwiderruflich gelöscht."

## Betroffene Dateien

- `/Users/enricoreinsdorf/Projekte/ux-stammtisch/red-ux-stammtisch-todo-demo/server/middleware/auth.ts` (Zeile 9)
- `/Users/enricoreinsdorf/Projekte/ux-stammtisch/red-ux-stammtisch-todo-demo/server/api/cron/cleanup-trash.post.ts`

## Steps to Reproduce

1. Vercel Cron ruft `POST /api/cron/cleanup-trash` mit Header `x-cron-secret: <secret>` auf (ohne Session-Cookie)
2. Auth-Middleware prüft: `path.startsWith('/api/')` → true
3. Middleware prüft: `PUBLIC_PATHS.includes(path)` → false (Cron-Route ist nicht in PUBLIC_PATHS)
4. Middleware prüft Cookie → kein Cookie → wirft `{ statusCode: 401 }`
5. Expected: Route wird ausgeführt, abgelaufene Todos werden gelöscht
6. Actual: 401 Unauthorized, Cleanup findet nie statt

## Fix-Hinweis

`/api/cron/cleanup-trash` muss entweder in `PUBLIC_PATHS` aufgenommen werden (und vertraut vollständig dem eigenen Secret-Check), oder die Middleware muss Cron-Routes explizit herausfiltern.

## Priority

Fix now
