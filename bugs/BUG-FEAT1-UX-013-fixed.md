# BUG-FEAT1-UX-013: NewTodoSheet schließt sich nach Speichern ohne Toast-Feedback

- **Feature:** FEAT-1 – Todo-Verwaltung
- **Severity:** Medium
- **Bereich:** UX | Flow
- **Gefunden von:** UX Reviewer
- **Status:** Fixed — 2026-03-27

## Problem
Die Spec definiert für den Erstellen-Flow: "Sheet schließt + Toast 'Todo erstellt'". In der Implementierung emittiert `handleSave()` im NewTodoSheet nach `store.createTodo()` sofort `update:modelValue: false` und schließt das Sheet. Ob danach ein Toast "Todo erstellt" erscheint, liegt vollständig im Pinia Store – die Komponente selbst gibt kein Feedback.

Das ist ein Vertragsproblem: Die Spec definiert den Toast als Teil des Flows, aber die Komponente delegiert das vollständig. Falls der Store keinen Toast auslöst (z.B. weil `vue-sonner` nicht konfiguriert ist oder der Toast-Call fehlt), verschwindet das Sheet ohne jede Rückmeldung.

Hinzu kommt: Das neue Todo sollte in der Liste mit einem Fade-in erscheinen ("automatisch eingereiht nach Score"). Die `TransitionGroup` in `index.vue` ist korrekt implementiert, aber der Nutzer sieht nur das Sheet schließen und muss selbst suchen, wo das neue Todo auftaucht.

## Steps to Reproduce
1. NewTodoSheet öffnen, Titel eingeben
2. "Speichern" tippen
3. Expected: Sheet schließt sich + Toast "Todo erstellt" erscheint unten + neues Todo taucht mit Animation in der Liste auf
4. Actual: Sheet schließt sich; ob Toast und Fade-in-Animation erscheinen, ist aus dem Code allein nicht verifizierbar (Store-abhängig)

## Empfehlung
Den Toast-Aufruf explizit in `handleSave()` der Komponente hinzufügen (statt ausschließlich im Store), damit das Feedback garantiert ist:
```ts
await store.createTodo({...})
toast.success('Todo erstellt')
emit('update:modelValue', false)
```
Alternativ: Store-Implementierung prüfen und sicherstellen, dass der Toast-Call nach erfolgreichem `createTodo` immer ausgeführt wird.

## Priority
Fix before release
