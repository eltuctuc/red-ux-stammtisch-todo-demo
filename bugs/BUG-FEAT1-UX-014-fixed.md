# BUG-FEAT1-UX-014: Subtask-Zähler zeigt immer 0/N (Platzhalter)

- **Feature:** FEAT-1 – Todo-Verwaltung
- **Severity:** Low
- **Bereich:** UX | Konsistenz
- **Gefunden von:** UX Reviewer
- **Status:** Fixed — 2026-03-27

## Problem
Die TodoCard zeigt bei Todos mit Unteraufgaben einen Zähler im Format "0/3". Der `completedSubtasks`-Wert ist hardcoded auf `0`:

```ts
const completedSubtasks = computed(() => 0) // Placeholder – status tracking in FEAT-3
```

Das ist aus UX-Perspektive problematisch: Der Nutzer sieht "0/3" und denkt, er hat 0 von 3 Aufgaben erledigt – obwohl das Feature zum Abhaken von Unteraufgaben noch gar nicht existiert. Das erzeugt eine falsche Erwartung und ein trügerisches Feedback.

## Steps to Reproduce
1. Todo mit 2 Unteraufgaben anlegen
2. Todo in der Liste betrachten
3. Expected: Entweder kein Zähler anzeigen (bis FEAT-3 implementiert ist), oder Zähler mit korrektem Wert
4. Actual: "0/2" wird angezeigt, obwohl Unteraufgaben nicht abhakbar sind – wirkt wie ein Bug in der App

## Empfehlung
Bis FEAT-3 implementiert ist: Den Subtask-Zähler nur als Gesamtzahl anzeigen ("2 Unteraufgaben") oder den Zähler ganz ausblenden. Der "0/N"-Placeholder signalisiert Nutzerschaft eine fehlende Funktionalität, die verwirrt.

Einfachste Lösung: `{{ todo.subtasks.length }} UA` (oder ein passenderes Label) statt `{{ completedSubtasks }}/{{ todo.subtasks.length }}`.

## Priority
Fix before release
