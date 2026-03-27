# BUG-FEAT1-UX-012: Deadline-Warnung nicht per aria-live kommuniziert

- **Feature:** FEAT-1 – Todo-Verwaltung
- **Severity:** Medium
- **Bereich:** A11y
- **Gefunden von:** UX Reviewer
- **Status:** Open

## Problem
Der Warnhinweis "Deadline liegt in der Vergangenheit" erscheint beim Setzen einer vergangenen Deadline – aber ohne `aria-live`-Attribut. Screen-Reader-Nutzer werden nicht über diese Warnung informiert, wenn sie dynamisch erscheint.

Das Titel-Fehlerfeld hat korrekt `aria-live="polite"`, aber der `.hint-warn`-Span für die Deadline-Warnung hat kein `aria-live`-Attribut – in beiden Formularen (NewTodoSheet und EditTodoSheet).

## Steps to Reproduce
1. NewTodoSheet oder EditTodoSheet öffnen
2. Screen Reader aktivieren (VoiceOver/TalkBack)
3. Datum in der Vergangenheit in den Deadline-Picker eingeben
4. Expected: Screen Reader liest "Deadline liegt in der Vergangenheit" vor, sobald der Hinweis erscheint
5. Actual: Hinweis erscheint visuell, wird vom Screen Reader aber nicht automatisch vorgelesen

## Empfehlung
`aria-live="polite"` auf den `.hint-warn`-Span setzen:
```html
<span v-if="isDeadlinePast" class="hint-warn" aria-live="polite">
  Deadline liegt in der Vergangenheit
</span>
```
In beiden Komponenten: NewTodoSheet.vue und EditTodoSheet.vue

## Priority
Fix before release
