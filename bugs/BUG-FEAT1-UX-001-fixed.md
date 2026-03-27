# BUG-FEAT1-UX-001: Delete-Button verwendet Emoji statt SVG-Icon

- **Feature:** FEAT-1 – Todo-Verwaltung
- **Severity:** Medium
- **Bereich:** UX | Konsistenz
- **Gefunden von:** UX Reviewer
- **Status:** Fixed — 2026-03-27

## Problem
Der Delete-Button im EditTodoSheet verwendet ein Trash-Emoji (`🗑`) als Icon. Emojis sind plattformabhängig, font-abhängig und rendern auf verschiedenen Geräten und Betriebssystemen unterschiedlich (Farbe, Größe, Stil). Das Ergebnis ist visuell inkonsistent und wirkt unprofessionell. Auf manchen Android-Geräten wirkt das Emoji bunt und fremd im Kontext eines monochromatischen UI.

Die Spec definiert explizit: "Delete-Button: `aria-label="Todo löschen"`, visuell rot + Trash-Icon (nicht nur Farbe)" – damit ist ein SVG-Icon gemeint, kein Emoji.

## Steps to Reproduce
1. Todo antippen → EditTodoSheet öffnet sich
2. Delete-Button oben rechts betrachten
3. Expected: Einheitliches SVG-Trash-Icon, farblich rot, im Stil der restlichen UI
4. Actual: Plattformabhängiges Trash-Emoji `🗑` – auf iOS schwarz, auf Android ggf. farbig; keine Kontrolle über Darstellung

## Empfehlung
SVG-Trash-Icon aus einer konsistenten Bibliothek (z.B. Heroicons `trash`) einsetzen. Das Icon sollte `color: #dc2626` erhalten und `aria-hidden="true"` tragen. Der `aria-label="Todo löschen"` am Button bleibt.

## Priority
Fix before release
