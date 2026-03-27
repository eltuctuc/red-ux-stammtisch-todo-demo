# BUG-FEAT1-UX-005: Filter-Toggle hat Touch-Target unter 44pt

- **Feature:** FEAT-1 – Todo-Verwaltung
- **Severity:** Medium
- **Bereich:** A11y | Mobile UX
- **Gefunden von:** UX Reviewer
- **Status:** Fixed — 2026-03-27

## Problem
Die Toggle-Buttons im StickyHeader haben `min-height: 32px` – das liegt deutlich unter dem WCAG- und Apple-HIG-Standard von 44×44pt für Touch-Targets. Der Header-Bereich ist das primäre Navigationselement der App. Bei der Persona "Enrico im Reaktionsmodus" wird die App unter Zeitdruck und oft einhand bedient – ein zu kleines Touch-Target erzeugt Fehltaps und Frustration.

Außerdem haben die Toggle-Buttons keine sichtbaren Fokus-Styles (kein `:focus-visible`-Ring definiert). Für Keyboard-Nutzer ist der Fokus nicht erkennbar.

## Steps to Reproduce
1. App auf dem Smartphone öffnen
2. Toggle-Bereich ("Aktiv" / "Papierkorb") antippen – besonders mit dem Daumen beim einhandigen Halten
3. Expected: Touch-Target mindestens 44×44pt, treffsicher erreichbar
4. Actual: Toggle-Buttons sind 32px hoch (zu klein), kein sichtbarer Fokus-Ring

## Empfehlung
- `min-height` der `.toggle-btn` auf mindestens `44px` setzen
- Optional: zusätzliches `padding` vertical erhöhen, damit die visuelle Größe ebenfalls steigt
- `:focus-visible`-Stil hinzufügen: `outline: 2px solid var(--color-primary); outline-offset: 2px`

## Priority
Fix before release
