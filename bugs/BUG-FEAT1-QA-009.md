# BUG-FEAT1-QA-009: Undo-Toast Race Condition – onDismiss kann nach onClick feuern

- **Feature:** FEAT-1 – Todo-Verwaltung
- **Severity:** Medium
- **Bereich:** Functional
- **Gefunden von:** QA Engineer
- **Status:** Open

## Beschreibung

In `app/stores/todos.ts` wird der Delete-Flow über `vue-sonner` mit einer `undone`-Flag abgesichert:

```typescript
let undone = false
toast('Todo gelöscht', {
  duration: 3000,
  action: {
    label: 'Rückgängig',
    onClick: () => {
      undone = true
      // UI-Rollback
    },
  },
  onDismiss: async () => {
    if (undone) return
    // API-Call DELETE
  },
})
```

Das Verhalten von `vue-sonner@2.x` ist hier kritisch: `onDismiss` wird sowohl beim automatischen Ablauf (nach 3 Sekunden) als auch beim manuellen Schließen des Toasts gefeuert. Wenn der Nutzer "Rückgängig" klickt:

1. `onClick` setzt `undone = true` und rollt die UI zurück
2. Das Klicken schließt den Toast
3. `onDismiss` feuert

Die `undone`-Flag schützt korrekt vor dem API-Call – das ist richtig implementiert. **Aber:** Wenn `onDismiss` durch eine Race-Condition vor dem `onClick`-Handler ausgeführt wird (möglich bei sehr schnellen Klicks oder in spezifischen Event-Loop-Zuständen), würde der API-Call trotz "Rückgängig" ausgeführt.

Zusätzlich: Die Spec beschreibt "Sheet schließt sofort + Toast (3 Sek.)". Wenn die DB nicht erreichbar ist und der API-Call im `onDismiss` fehlschlägt, erscheint ein weiterer Error-Toast, aber die Rollback-Logik versucht, das Todo aus `trashTodos` zu entfernen und zurück in `todos` zu schieben – zu einem Zeitpunkt wo der Nutzer möglicherweise zur Papierkorb-Ansicht gewechselt hat. Das kann zu einem inkonsistenten State führen.

## Betroffene Dateien

- `/Users/enricoreinsdorf/Projekte/ux-stammtisch/red-ux-stammtisch-todo-demo/app/stores/todos.ts` (Zeilen 143–165)

## Steps to Reproduce – Inkonsistenter State bei Fehler

1. Todo löschen → Toast erscheint
2. Zur Papierkorb-Ansicht wechseln (isTrashView = true)
3. Toast-Zeit läuft ab → API-Call schlägt fehl (Netzwerkfehler)
4. Rollback-Code: `todos.value.unshift(todo)` + `trashTodos.value = trashTodos.value.filter(...)`
5. Expected: Todo erscheint in der aktiven Liste, Papierkorb aktualisiert sich korrekt
6. Actual: State inkonsistent – `selectedTodo` in EditSheet könnte auf ein nicht mehr existierendes Todo zeigen

## Priority

Fix before release
