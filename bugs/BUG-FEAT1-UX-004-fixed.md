# BUG-FEAT1-UX-004: Papierkorb-Karte ist klickbar aber tut nichts

- **Feature:** FEAT-1 – Todo-Verwaltung
- **Severity:** High
- **Bereich:** UX | Flow
- **Gefunden von:** UX Reviewer
- **Status:** Fixed — 2026-03-27

## Problem
In der Papierkorb-Ansicht wird die TodoCard mit einem leeren Click-Handler gerendert:

```html
<TodoCard :todo="todo" @click="() => {}" />
```

Die TodoCard ist ein `<button>` Element – sie ist also interaktiv, reagiert auf Tap mit dem Orange-Focus-Ring (`:active`-State), aber führt keine Aktion aus. Für den Nutzer sieht die Karte aus wie eine klickbare Karte (weil sie in der aktiven Ansicht eine Karte öffnet), aber in der Papierkorb-Ansicht passiert nichts.

Das ist ein klassisches Frustrations-Muster: Der Nutzer tippt die Karte an, erwartet etwas (z.B. eine Detail-Ansicht oder zumindest einen Hinweis), und bekommt keine Reaktion.

## Steps to Reproduce
1. Todo löschen
2. Filter-Toggle → "Papierkorb" wechseln
3. TodoCard antippen
4. Expected: Entweder eine Aktion (z.B. Detail-Sheet öffnet sich im Read-only-Modus) oder die Karte ist nicht als Button gestylt/fokussierbar
5. Actual: Karte reagiert visuell (Active-State), aber keine Aktion folgt – stille Interaktion

## Empfehlung
Zwei Optionen:
- **Option A:** Die TodoCard in der Papierkorb-Ansicht als `<div>` rendern (nicht klickbar) und nur den "Wiederherstellen"-Button als Interaktionspunkt anbieten. Die Karte sollte dann kein `cursor: pointer` und keinen Active-State haben.
- **Option B:** Tap auf Papierkorb-Karte öffnet ein Read-only-Sheet mit dem vollständigen Todo-Inhalt (Titel, Unteraufgaben, Deadline) und einem prominenten "Wiederherstellen"-CTA.

Option A ist der einfachere Fix und entfernt die falsche Affordance.

## Priority
Fix before release
