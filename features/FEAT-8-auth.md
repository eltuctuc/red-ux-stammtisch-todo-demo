# FEAT-8: Authentifizierung

## Status
Aktueller Schritt: IA/UX

## Abhängigkeiten
- Benötigt: Keine
- Wird benötigt von: Alle anderen Features – Auth schützt den Zugriff auf alle Daten

---

## 1. Feature Spec
*Ausgefüllt von: /requirements — 2026-03-27*

### Beschreibung
Die App ist passwortgeschützt und ausschließlich für einen einzigen Nutzer (Enrico) zugänglich. Es gibt keine Registrierung, kein Passwort-Reset über E-Mail, keine Nutzerverwaltung. Der Nutzer loggt sich mit einem festen Passwort ein und bleibt eingeloggt bis zum expliziten Logout oder Session-Ablauf.

### Definitionen
- **Single-User-Auth:** Authentifizierungsmodell mit genau einem vordefinierten Nutzer. Keine öffentliche Registrierung möglich.
- **Session:** Authentifizierter Zustand nach erfolgreichem Login. Bleibt bestehen bis zum Logout oder technischem Session-Timeout.

### User Stories
- Als Nutzer möchte ich mich mit einem Passwort einloggen können, um meine Todos zu schützen.
- Als Nutzer möchte ich eingeloggt bleiben (persistent Session), damit ich die App nicht bei jedem Aufruf neu authentifizieren muss.
- Als Nutzer möchte ich mich ausloggen können.

### Acceptance Criteria
- [ ] Alle App-Routen sind ohne Login nicht zugänglich; unauthentifizierte Anfragen werden auf die Login-Seite weitergeleitet.
- [ ] Der Login erfolgt mit einem Passwort (kein Username nötig, da Single-User).
- [ ] Bei falschem Passwort erscheint eine Fehlermeldung; kein Hinweis ob Passwort oder User falsch ist.
- [ ] Nach erfolgreichem Login bleibt die Session persistent (über Browser-Neustarts hinweg).
- [ ] Der Nutzer kann sich explizit ausloggen; danach ist die Session ungültig.
- [ ] Es gibt keine Registrierungsfunktion und keinen öffentlich zugänglichen Signup-Bereich.

### Edge Cases
- **Mehrere Browser-Tabs gleichzeitig:** Alle teilen dieselbe Session; Logout in einem Tab invalidiert alle.
- **Session abgelaufen:** Nutzer wird auf Login-Seite weitergeleitet, aktuelle Aktion geht verloren.
- **Passwort vergessen:** Kein Self-Service – Passwort wird direkt in der Infrastruktur (Umgebungsvariable) zurückgesetzt.

### Nicht im Scope
- Passwort-Reset per E-Mail
- Mehrere Nutzer oder Rollen
- OAuth / Social Login
- Zwei-Faktor-Authentifizierung

---

## 2. IA/UX Entscheidungen
*Ausgefüllt von: /ia-ux — 2026-03-27*

### Einbettung im Produkt
Eigener Screen `/login`. Wird automatisch angezeigt wenn keine valide Session vorhanden. Kein Navigations-Tab, kein Einstiegspunkt von innen der App (nur Logout in den Settings oder als separate Aktion).

### Einstiegspunkte
- Automatisch bei direktem URL-Aufruf ohne Session
- Redirect nach Session-Ablauf (von beliebiger Route)
- Logout: Erreichbar über Einstellungs-Icon im App-Header (kleines Zahnrad oder Menü-Icon)

### User Flow
```
URL aufrufen ohne Session
    → Automatischer Redirect zu /login

Login-Screen:
┌──────────────────────────────┐
│         PrioTodo             │
│                              │
│  Passwort                    │
│  [●●●●●●●●●●]  [👁 Anzeigen] │
│                              │
│  [Einloggen]                 │
└──────────────────────────────┘

Tap [Einloggen]:
    → Button zeigt Ladezustand (Spinner, 150ms)
    → Erfolg: Redirect zu / (keine Animation nötig)
    → Fehler: Fehlermeldung unter Passwort-Feld
      "Falsches Passwort. Bitte erneut versuchen."

Logout (aus der App heraus):
    → Tap Logout-Button (Header-Menü oder Settings)
    → Session wird invalidiert
    → Redirect zu /login
```

### Interaktionsmuster
- **Primärmuster:** Minimales Single-Field-Formular
- **Passwort-Toggle:** Show/Hide-Button (Lucide Eye / EyeOff)
- **Fehler-Handling:** Inline unter dem Passwort-Feld, generisch (kein Hinweis ob User/Passwort falsch)
- **Leerer Zustand:** Nicht relevant (Formular ist immer vorhanden)
- **Ladeverhalten:** Einloggen-Button disabled + Spinner während API-Call
- **Kein Username-Feld:** Single-User-App – nur Passwort genügt

### Konzeptionelle Komponentenstruktur
```
LoginScreen (/login)
├── AppLogo / AppName ("PrioTodo")
├── LoginForm
│   ├── PasswordInput
│   │   └── PasswordToggle (Eye / EyeOff Icon)
│   ├── ErrorMessage (conditional, aria-live)
│   └── SubmitButton [Einloggen] (disabled während Loading)
└── (kein Footer, kein "Passwort vergessen"-Link)
```

### Barrierefreiheit (A11y)
- Password-Input: `type="password"`, `autocomplete="current-password"`
- Toggle-Button: `aria-label="Passwort anzeigen"` / `"Passwort verbergen"`, `aria-pressed`
- Fehlermeldung: `role="alert"` oder `aria-live="assertive"` (sofortige Rückmeldung bei Login-Fehler)
- Submit-Button: `aria-busy="true"` während Loading

### Mobile-Verhalten
- Passwort-Input löst numerische oder alphanumerische Tastatur aus (je nach Passwort-Format)
- `autocomplete="current-password"` aktiviert Passwort-Manager / Keychain auf iOS/Android
- Login-Button full-width auf Mobile (primary CTA #F97316)
- Kein horizontales Scrollen, zentrierter Content
