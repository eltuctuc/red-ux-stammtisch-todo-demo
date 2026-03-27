# BUG-FEAT1-QA-002: Sheet schließt auch bei API-Fehler – Optimistic-UI-Fehler nicht sichtbar

- **Feature:** FEAT-1 – Todo-Verwaltung
- **Severity:** High
- **Bereich:** Functional
- **Gefunden von:** QA Engineer
- **Status:** Open

## Beschreibung

In `NewTodoSheet.vue` ruft `handleSave()` zuerst `store.createTodo(payload)` auf und danach – unabhängig vom Ergebnis – sofort `emit('update:modelValue', false)`. Das Sheet schließt sich also immer, auch wenn der API-Call scheitert.

Dasselbe Problem existiert in `EditTodoSheet.vue` bei `handleSave()`.

**Konsequenz:** Wenn der Server-Request fehlschlägt, sieht der Nutzer:
1. Sheet schließt sich
2. Optimistic-UI rollt zurück (Todo verschwindet aus der Liste oder wird auf den Originalzustand zurückgesetzt)
3. Toast "Fehler beim Erstellen / Speichern" erscheint

Der Nutzer hat keine Chance, die eingegebenen Daten zu korrigieren oder zu retten – alles was er eingetippt hat, ist weg. Der Spec-Eintrag "API-Fehler zeigt Toast mit Retry" ist unvollständig implementiert: der Retry führt das identische Payload erneut aus (was bei Netzwerkfehlern korrekt ist), aber der Nutzer kann die Daten nicht editieren.

## Betroffene Dateien

- `/Users/enricoreinsdorf/Projekte/ux-stammtisch/red-ux-stammtisch-todo-demo/app/components/NewTodoSheet.vue` (Zeile 146-147)
- `/Users/enricoreinsdorf/Projekte/ux-stammtisch/red-ux-stammtisch-todo-demo/app/components/EditTodoSheet.vue` (Zeile 168-169)

## Steps to Reproduce

1. Netzwerkverbindung trennen oder API absichtlich mit Fehler antworten lassen
2. Neues Todo-Sheet öffnen, Titel eingeben
3. "Speichern" tippen
4. Expected: Sheet bleibt offen, Fehlermeldung erscheint, Nutzerdaten bleiben erhalten
5. Actual: Sheet schließt sich, Fehlermeldung erscheint, eingetippte Daten sind verloren

## Priority

Fix before release
