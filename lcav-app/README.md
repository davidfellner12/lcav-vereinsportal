# LCAV Vereinsportal

Interne Managementplattform für den **Leichtathletik Club Attnang Vöcklabruck (LCAV Jodl Packaging)**.

## Features

| Modul | Beschreibung |
|---|---|
| 🏠 **Dashboard** | Übersicht: Statistiken, nächste Termine, Nachrichten, offene Aufgaben |
| 👥 **Trainingsgruppen** | U10–Masters: Mitgliederverwaltung, Gruppenauswahl, Disziplinzuordnung |
| 💬 **Kommunikation** | Gruppen- & Vereinskanäle (öffentlich, Trainer-privat, Vorstand) |
| 📋 **Trainingsplanung** | Wochenpläne pro Altersgruppe, alle Leichtathletik-Disziplinen, Intensitätsstufen |
| 📅 **Veranstaltungen** | Events, Wettkämpfe, Helferplanung & Anmeldung |
| 🔧 **Arbeitszuweisungen** | Aufgaben für Events, Status-Tracking, Prioritäten |
| 🏆 **Wettkampf** | Ergebnisse, Meldungen, Bestenliste |

## Rollen

- **Trainer** – Vollzugriff auf Trainingsplanung, Gruppenmanagement
- **Vorstand** – Alle Bereiche inkl. Verwaltung
- **Mitglied** – Lesezugriff, eigene Gruppe, Chat

## Setup in IntelliJ IDEA

### Voraussetzungen
- Node.js ≥ 18 installiert ([nodejs.org](https://nodejs.org))
- IntelliJ IDEA oder WebStorm

### Schritte

1. **Projekt öffnen**
   - `File → Open` → Ordner `lcav-app` auswählen

2. **Dependencies installieren**
   - Terminal öffnen (`Alt+F12`):
   ```bash
   npm install
   ```

3. **Entwicklungsserver starten**
   ```bash
   npm start
   ```
   → Öffnet automatisch `http://localhost:3000`

4. **Oder Run Configuration anlegen**
   - `Run → Edit Configurations → +`
   - Typ: **npm**
   - Script: `start`
   - Arbeitsverzeichnis: Projektordner

### Build für Produktion
```bash
npm run build
```

## Farbpalette (LCAV Vereinsfarben)

```css
--navy:        #0b1a2e   /* Dunkelblau Hintergrund */
--navy-mid:    #0f2540   /* Karten / Panels */
--blue:        #1a5aab   /* Primärfarbe */
--blue-bright: #2272d4   /* Akzente, Buttons */
--accent:      #f0a500   /* Gold (Logo-Akzent) */
```

## Technologie

- **React 18** (Create React App)
- **Lucide React** (Icons)
- **CSS Variables** (kein Framework)
- Keine externe Datenbank – State im Frontend (erweiterbar mit Backend)

## Weiterentwicklung

- [ ] Backend API (Node.js / Laravel / Django)
- [ ] Authentifizierung (Login / JWT)
- [ ] Datenbankanbindung (Mitgliederverwaltung)
- [ ] Push-Benachrichtigungen
- [ ] Mobile App (React Native)
