# BUG-FEAT1-UX-008: Kein Focus-Trap im Bottom Sheet und Dialog

- **Feature:** FEAT-1 – Todo-Verwaltung
- **Severity:** High
- **Bereich:** A11y
- **Gefunden von:** UX Reviewer
- **Status:** Fixed — 2026-03-27

## Problem
Die Spec definiert explizit: "Bottom Sheets: `role='dialog'`, `aria-modal='true'`, Focus-Trap, Schließen per Escape (Desktop)".

Die Implementierung hat weder `role="dialog"` noch `aria-modal="true"` auf dem Sheet-Panel, noch einen Focus-Trap. Das bedeutet:

1. Keyboard-Nutzer können per Tab aus dem offenen Sheet heraus in den Hintergrund-Content tabben (die Todo-Liste im Hintergrund ist weiterhin erreichbar)
2. Screen-Reader erkennen das Sheet nicht als modalen Dialog – der gesamte Seiten-Inhalt ist weiterhin zugänglich
3. Escape-Taste schließt das Sheet nicht

Der UnsavedChangesDialog hat `role="dialog"` und `aria-modal="true"` korrekt implementiert, aber ebenfalls keinen Focus-Trap und keine Escape-Behandlung.

## Steps to Reproduce
1. NewTodoSheet per Keyboard öffnen (FAB fokussieren, Enter drücken)
2. Im offenen Sheet Tab-Taste mehrfach drücken
3. Expected: Fokus bleibt innerhalb des Sheets (Focus-Trap), Escape schließt das Sheet
4. Actual: Tab verlässt das Sheet und erreicht Elemente im Hintergrund; Escape hat keine Funktion

## Empfehlung
- `role="dialog"` und `aria-modal="true"` auf `.sheet-panel` setzen
- Focus-Trap implementieren: beim Öffnen alle fokussierbaren Elemente innerhalb des Panels sammeln; Tab am letzten Element springt zum ersten, Shift+Tab am ersten zum letzten
- Keydown-Event auf `Escape` im BottomSheet abfangen → `emit('request-close')`
- Für den UnsavedChangesDialog dieselbe Logik anwenden

## Priority
Fix before release
