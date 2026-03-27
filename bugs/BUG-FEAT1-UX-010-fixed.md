# BUG-FEAT1-UX-010: Empty State Pfeil zeigt nach unten, FAB ist unten rechts

- **Feature:** FEAT-1 – Todo-Verwaltung
- **Severity:** Low
- **Bereich:** UX | Copy
- **Gefunden von:** UX Reviewer
- **Status:** Open

## Problem
Der EmptyState zeigt den Hinweistext: "Tap + um loszulegen ↓"

Der Pfeil ↓ (nach unten) ist irreführend: Der FAB sitzt unten rechts in der Ecke – nicht unten mittig. Ein Pfeil nach unten suggeriert, dass das Element sich direkt unter dem Text befindet. Korrekt wäre ein Pfeil der nach rechts-unten zeigt, oder ein Text wie "Tap + unten rechts" ohne generischen Richtungspfeil.

Außerdem entspricht "Tap + um loszulegen ↓" nicht der Spec-Formulierung: "Noch keine Todos. Tap + um loszulegen." mit Pfeil-Icon Richtung FAB. Laut Spec sollte es ein grafisches Pfeil-Icon sein, das auf den FAB zeigt – nicht ein Text-Zeichen.

## Steps to Reproduce
1. App öffnen ohne Todos (oder alle Todos löschen)
2. EmptyState betrachten
3. Expected: Hinweis "Noch keine Todos" + Pfeil-Icon das visuell auf den FAB unten rechts zeigt
4. Actual: Text "Tap + um loszulegen ↓" mit Pfeil nach unten-Mitte, FAB sitzt rechts

## Empfehlung
- Text anpassen: "Noch keine Todos. Tippe auf + um loszulegen."
- Pfeil-Icon entweder weglassen oder als SVG-Icon realisieren, das nach rechts-unten zeigt (→↘)
- Optional: kleines animiertes Pfeil-Icon das den Blick zum FAB führt (subtile Aufmerksamkeitslenkung)

## Priority
Nice-to-have
