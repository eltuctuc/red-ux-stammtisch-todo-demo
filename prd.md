# Product Requirements Document
*Erstellt: 2026-03-27*

## Vision
Eine mobile-freundliche Web-App für eine einzelne Person, die Todos nach Deadline-Nähe und Komplexität automatisch priorisiert – mit eigener Infrastruktur (Neon + Vercel), ohne Abhängigkeit von Drittanbieter-Todo-Diensten.

## Zielgruppe
Primär: Eine einzelne Person (Enrico), die viele parallele Aufgaben hat, sich leicht verzettelt und aktiv an Priorisierung arbeiten will.

## Kernproblem
Zu viele offene Todos führen zu Orientierungsverlust: Was ist wirklich dringend? Was wird vergessen? Ohne klare Struktur verzettelt man sich in unwichtigem Kleinkram, während wichtige Dinge durch die Finger gleiten.

## Scope (In)
- Todo erstellen mit: Titel, optionale Unteraufgaben, optionale Deadline, Komplexitätsschätzung (T-Shirt-Größe: XS / S / M / L / XL)
- Automatische Priorisierung: Score = Dringlichkeit (1–5) × Komplexität (1–5) → sortierte Liste
- Dringlichkeit wird automatisch aus Deadline-Nähe berechnet (je näher, desto höher)
- Manuelle Priorisierung überschreibt die automatische jederzeit
- Status: Offen / In Arbeit / Wartet auf etwas / Erledigt
- "Wartet"-Status = automatisch niedrigste Priorität
- App-interne Reminder (Push-Notifications in der App), Häufigkeit vom User konfigurierbar
- Periodische Nachfrage bei Todos ohne Deadline ("Noch relevant? Erledigt?")
- Auth: Single-User (nur für Enrico)
- Deployment: Vercel (Frontend + API) + Neon (PostgreSQL)

## Out-of-Scope
- Teamfunktionen, Sharing, Kollaboration
- Kalender-Integration
- Zeiterfassung
- Offline-Modus / lokale Datenhaltung auf dem Gerät
- Native iOS/Android App (Web-App, mobil-optimiert)
- E-Mail oder Browser-Push-Notifications

## Erfolgskriterien
- App wird täglich geöffnet und zeigt sofort, was als nächstes dran ist
- Keine wichtige Aufgabe geht durch Vergessen verloren
- Priorisierung fühlt sich richtig an – ohne lange nachdenken zu müssen

## Offene Fragen
- Keine – alle Kernfragen geklärt
