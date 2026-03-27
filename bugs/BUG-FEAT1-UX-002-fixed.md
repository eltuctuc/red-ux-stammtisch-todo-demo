# BUG-FEAT1-UX-002: Kalender-Icon im TodoCard verwendet Emoji

- **Feature:** FEAT-1 – Todo-Verwaltung
- **Severity:** Medium
- **Bereich:** UX | Konsistenz
- **Gefunden von:** UX Reviewer
- **Status:** Fixed — 2026-03-27

## Problem
Der Deadline-Chip in der TodoCard verwendet `📅` als Icon vor dem formatierten Datum. Dasselbe Problem wie beim Delete-Button: Emojis rendern plattformabhängig, können nicht per CSS gestylt werden (Farbe, Größe) und wirken im Overdue-Zustand deplatziert – dort wechselt der Chip auf roten Hintergrund mit rotem Text, aber das bunte Kalender-Emoji bleibt unverändert.

Das schafft eine visuelle Inkonsistenz: Der Chip signalisiert Dringlichkeit über Farbe, aber das Icon arbeitet dagegen.

## Steps to Reproduce
1. Todo mit Deadline anlegen
2. Deadline in die Vergangenheit setzen → TodoCard zeigt roten Overdue-Chip
3. Expected: Einheitliches SVG-Kalender-Icon, das im Overdue-Zustand ebenfalls rot erscheint
4. Actual: Buntes `📅`-Emoji, das sich nicht dem Farbkontext anpasst

## Empfehlung
SVG-Kalender-Icon verwenden (z.B. Heroicons `calendar-days`), `aria-hidden="true"` setzen. Im Overdue-Zustand erbt das Icon automatisch `color: #dc2626` über die `.chip-overdue`-Klasse.

## Priority
Fix before release
