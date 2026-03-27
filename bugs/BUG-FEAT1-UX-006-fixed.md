# BUG-FEAT1-UX-006: Unteraufgabe-Entfernen-Button unter Touch-Target-Minimum

- **Feature:** FEAT-1 – Todo-Verwaltung
- **Severity:** Medium
- **Bereich:** A11y | Mobile UX
- **Gefunden von:** UX Reviewer
- **Status:** Fixed — 2026-03-27

## Problem
Der "Unteraufgabe entfernen"-Button in der SubtaskList hat `width: 32px` und `height: 32px`. Das liegt 12px unter dem geforderten Minimum von 44×44pt. Der Button erscheint direkt neben dem Subtask-Inputfeld – beim einhandigen Tippen auf Mobile ist er schwer treffsicher zu treffen. Fehltaps auf das Inputfeld oder ins Leere sind wahrscheinlich.

Außerdem fehlen Fokus-Styles auf diesem Button.

## Steps to Reproduce
1. NewTodoSheet oder EditTodoSheet öffnen
2. Unteraufgabe hinzufügen
3. "✕"-Button zum Entfernen antippen
4. Expected: Button hat mindestens 44×44pt Touch-Area, ist treffsicher
5. Actual: Button ist nur 32×32px – zu klein für zuverlässiges Touch-Targeting

## Empfehlung
- `width` und `height` des `.subtask-remove`-Buttons auf mindestens `44px` setzen
- Alternativ: hit area per negativem `margin` und passendem `padding` vergrößern, ohne die visuelle Größe zu ändern (falls die kompakte Darstellung gewünscht ist)
- `:focus-visible`-Stil hinzufügen

## Priority
Fix before release
