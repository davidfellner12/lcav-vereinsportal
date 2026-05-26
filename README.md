# LCAV Vereinsportal – Vollständiges Projekt

Dieses Paket enthält **Frontend** (React) und **Backend** (Node.js + Express + SQLite).

```
lcav-projekt/
├── lcav-backend/   ← REST API, Port 4000
└── lcav-app/       ← React App, Port 3000
```

## 🎥 Demo-Video

[![LCAV Vereinsportal Demo](https://cdn.loom.com/sessions/thumbnails/f76f5754dbbc4a7b8135c5c1d64b3803-with-play.gif)](https://www.loom.com/share/f76f5754dbbc4a7b8135c5c1d64b3803)

---

## Schnellstart (IntelliJ IDEA)

### 1. Backend starten

Öffne ein Terminal (`Alt+F12`):

```bash
cd lcav-backend
npm install
npm run seed       # Datenbank befüllen (einmalig)
npm run dev        # Entwicklungsserver mit Auto-Reload
```

→ API läuft auf **http://localhost:4000**

### 2. Frontend starten

Öffne ein zweites Terminal:

```bash
cd lcav-app
npm install
npm start
```

→ App öffnet sich auf **http://localhost:3000**

---

## IntelliJ Run Configurations

Du kannst beide als npm-Konfigurationen anlegen:

| Name | Verzeichnis | Script |
|---|---|---|
| LCAV Backend | `lcav-backend` | `dev` |
| LCAV Frontend | `lcav-app` | `start` |

`Run → Edit Configurations → + → npm`

---

## Demo-Zugänge (Passwort: `lcav2026`)

| E-Mail | Rolle |
|---|---|
| `walterr@lcav-jodl.at` | Vorstand (Vollzugriff) |
| `thomas.regl@lcav.at` | Trainer U16 |
| `maria.bruneder@lcav.at` | Trainer U12 |
| `lena.mayr@lcav.at` | Mitglied U16 |
| `felix.gruber@lcav.at` | Mitglied U12 |

---

## API-Endpunkte (Übersicht)

| Methode | Pfad | Beschreibung |
|---|---|---|
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Eigenes Profil |
| GET | `/api/users` | Alle Mitglieder (Vorstand) |
| GET | `/api/groups` | Alle Trainingsgruppen |
| GET | `/api/groups/:name/members` | Mitglieder einer Gruppe |
| GET | `/api/channels` | Sichtbare Kanäle |
| GET | `/api/channels/:id/messages` | Nachrichten |
| POST | `/api/channels/:id/messages` | Nachricht senden |
| GET | `/api/training` | Trainingspläne |
| GET | `/api/training/:id` | Plan mit Einheiten |
| POST | `/api/training/:id/units` | Einheit hinzufügen |
| GET | `/api/events` | Veranstaltungen |
| POST | `/api/events/:id/helpers` | Als Helfer anmelden |
| GET | `/api/tasks` | Aufgaben |
| GET | `/api/results` | Ergebnisse |
| GET | `/api/results/bestenliste` | Bestenliste |

Vollständige Dokumentation: alle Routen in `lcav-backend/src/routes/`

---

## Architektur

```
React Frontend
     │  fetch + JWT Bearer token
     ▼
Express REST API (Port 4000)
     │  sql.js (SQLite, lcav.db)
     ▼
SQLite Datenbank (lcav.db)
  ├── users
  ├── groups / group_members
  ├── channels / messages
  ├── training_plans / training_units
  ├── events / event_helpers
  ├── tasks
  ├── results
  └── registrations
```

## Produktion

```bash
# Frontend bauen
cd lcav-app && npm run build
# → build/ Ordner auf Webserver (nginx, Apache, etc.)

# Backend
cd lcav-backend
NODE_ENV=production JWT_SECRET=<langes-zufälliges-passwort> npm start
```

**Wichtig:** `JWT_SECRET` in `.env` vor dem Produktiveinsatz ändern!
