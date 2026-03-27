# BUG-FEAT1-UX-011: Swipe-to-close im Half-Sheet löst auch aus wenn im Formular gescrollt wird

- **Feature:** FEAT-1 – Todo-Verwaltung
- **Severity:** High
- **Bereich:** UX | Mobile UX
- **Gefunden von:** UX Reviewer
- **Status:** Fixed — 2026-03-27

## Problem
Der Swipe-to-close-Mechanismus im BottomSheet reagiert auf `touchstart`/`touchmove` auf dem gesamten `.sheet-panel`. Das bedeutet: Wenn der Nutzer im NewTodoSheet nach dem Hinzufügen mehrerer Unteraufgaben versucht, innerhalb des Sheets zu scrollen (weil das `half`-Sheet mit `max-height: 60dvh` bei vielen Subtasks überläuft), wird nach einem Downswipe >80px die `request-close`-Sequenz ausgelöst.

Das Sheet schließt sich ungewollt, obwohl der Nutzer eigentlich scrollen wollte. Falls ungespeicherte Änderungen vorhanden sind, erscheint der UnsavedChangesDialog – der Nutzer ist verwirrt, weil er nicht bewusst das Sheet schließen wollte.

## Steps to Reproduce
1. NewTodoSheet öffnen
2. Mehrere Unteraufgaben hinzufügen, bis der Inhalt die Sheet-Höhe übersteigt
3. Im Sheet nach unten scrollen (Downswipe)
4. Expected: Normales Scrollen innerhalb des Sheets; Sheet schließt sich nicht
5. Actual: Nach Downswipe > 80px erscheint der UnsavedChangesDialog oder Sheet schließt sich

## Empfehlung
Den Swipe-to-close nur auslösen, wenn der Touch auf dem Sheet-Handle-Bereich (`.sheet-handle-bar` + Bereich oben) beginnt. Implementierung:
- `touchstart` auf `.sheet-handle-bar` beschränken (separater Event-Handler)
- Oder: Prüfen ob `scrollTop` des Panels bei `touchstart` === 0 ist; nur dann Swipe-Close aktivieren
- `onTouchMove`: `e.preventDefault()` nur aufrufen wenn der Swipe-Close-Modus aktiv ist, nicht generell

## Priority
Fix before release
