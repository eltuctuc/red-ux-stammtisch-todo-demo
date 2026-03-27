# BUG-FEAT1-UX-009: Komplexitäts-Selector hat keine Keyboard-Navigation per Pfeiltasten

- **Feature:** FEAT-1 – Todo-Verwaltung
- **Severity:** Medium
- **Bereich:** A11y
- **Gefunden von:** UX Reviewer
- **Status:** Fixed — 2026-03-27

## Problem
Der KomplexitaetSelector verwendet `role="radiogroup"` und `role="radio"` mit `aria-checked` – das ist die korrekte semantische Grundlage. Allerdings fehlt die für Radiogroups erwartete Keyboard-Navigation: Bei einer `role="radiogroup"` erwartet der Nutzer (und Screen-Reader), dass die Pfeiltasten (Links/Rechts oder Hoch/Runter) zwischen den Optionen navigieren – nicht Tab. Aktuell kann man zwischen den 5 Buttons per Tab navigieren, was 5 Tab-Stops erzeugt statt einem einzigen (Radiogroup mit internem Pfeil-Navigation).

Das widerspricht dem ARIA Authoring Practices Guide (APG) für das Radio Group Pattern.

## Steps to Reproduce
1. NewTodoSheet öffnen, per Keyboard zum Komplexitäts-Selector navigieren
2. Pfeiltasten drücken
3. Expected: Pfeiltaste Rechts/Links navigiert zwischen XS–XL-Optionen; nur ein Tab-Stop für die gesamte Gruppe
4. Actual: Pfeiltasten haben keine Funktion; jede Option ist ein eigener Tab-Stop (5 Tab-Stops statt 1)

## Empfehlung
- `tabindex="-1"` auf alle Optionen setzen, außer der aktuell ausgewählten (`tabindex="0"`)
- `@keydown`-Handler auf der Radiogroup: Pfeiltaste Rechts/Links wählt nächste/vorherige Option aus und verschiebt den Fokus
- Die aktuell aktive Option erhält `tabindex="0"`, alle anderen `tabindex="-1"` (Roving Tabindex Pattern)

## Priority
Fix before release
