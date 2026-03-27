# BUG-FEAT1-UX-015: Header ohne Safe-Area-Padding oben (Notch / Dynamic Island)

- **Feature:** FEAT-1 – Todo-Verwaltung
- **Severity:** Medium
- **Bereich:** Mobile UX | A11y
- **Gefunden von:** UX Reviewer
- **Status:** Open

## Problem
Der StickyHeader ist `position: sticky; top: 0` und hat kein `padding-top: env(safe-area-inset-top)`. Auf iPhones mit Notch oder Dynamic Island überlagert der Systemstatus-Bereich den Header-Inhalt ("PrioTodo"-Titel und Toggle-Buttons) oder der Content beginnt direkt unter der Statusleiste ohne ausreichenden Abstand.

Der FAB berücksichtigt `env(safe-area-inset-bottom)` korrekt – aber der Header tut es nicht für `inset-top`.

Das Bottom Sheet Panel hat `padding: 0 0 env(safe-area-inset-bottom, 16px)` – also Bottom korrekt, aber beim Full-Sheet (EditTodoSheet) könnte auch oben Safe-Area-Berücksichtigung nötig sein wenn das Sheet bis unter die Statusleiste reicht.

## Steps to Reproduce
1. App auf iPhone mit Notch oder Dynamic Island öffnen
2. Header-Bereich betrachten
3. Expected: Header beginnt unterhalb der Statusleiste, Inhalt nicht überlagert
4. Actual: Kein `safe-area-inset-top`-Padding – auf Geräten mit Notch potenziell überlagerter Header-Inhalt

## Empfehlung
Im StickyHeader das Padding um `safe-area-inset-top` ergänzen:
```css
.header {
  padding-top: max(12px, env(safe-area-inset-top, 12px));
}
```
Alternativ global in `app.vue` oder einem Wrapper für die Seite sicherstellen, dass der Content-Bereich unterhalb des Safe-Area-Bereichs beginnt.

## Priority
Fix before release
