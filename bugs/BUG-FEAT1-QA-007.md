# BUG-FEAT1-QA-007: Timing-Attack auf Session-Token-Vergleich in Auth-Middleware

- **Feature:** FEAT-1 – Todo-Verwaltung
- **Severity:** Low
- **Bereich:** Security
- **Gefunden von:** QA Engineer
- **Status:** Open

## Beschreibung

In `server/middleware/auth.ts` wird der Session-Token mit einem normalen String-Vergleich geprüft:

```typescript
if (sessionCookie !== expectedToken) { ... }
```

JavaScript-Stringvergleiche brechen ab sobald sie ein unterschiedliches Zeichen gefunden haben (short-circuit). Das ermöglicht theoretisch einen Timing-Attack, bei dem ein Angreifer durch Messung der Response-Zeit schrittweise den korrekten Token erraten kann.

**Einschränkung:** Der Angriff setzt voraus, dass:
- der Angreifer viele Requests senden kann (Rate-Limiting wäre eine Gegenmaßnahme)
- die Zeitmessung ausreichend präzise ist (in einem Serverless-Umfeld wie Vercel mit variablen Latenzzeiten ist das sehr schwierig)

Für eine Single-User-MVP-App ist das Risiko gering, aber sicherheitstechnisch ist es eine bekannte Schwachstelle.

## Betroffene Dateien

- `/Users/enricoreinsdorf/Projekte/ux-stammtisch/red-ux-stammtisch-todo-demo/server/middleware/auth.ts` (Zeile 22)

## Steps to Reproduce

1. Viele Requests mit variierenden `auth-session`-Cookie-Werten senden
2. Response-Zeiten messen und korrelieren
3. Expected: Konstante Response-Zeit unabhängig vom Cookie-Inhalt (constant-time comparison)
4. Actual: Response-Zeit variiert minimal je nach Übereinstimmungsgrad des Token-Präfixes

## Fix-Hinweis

`crypto.timingSafeEqual(Buffer.from(sessionCookie), Buffer.from(expectedToken))` aus dem Node.js `crypto`-Modul verwenden.

## Priority

Nice-to-have
