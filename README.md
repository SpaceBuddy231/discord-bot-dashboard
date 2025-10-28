# 🤖 Discord Bot Management Dashboard

A comprehensive Discord Bot Management System with advanced analytics, auto-moderation, and a modern web dashboard. Built for multi-server support with production-ready features.

> 💡 **NEW**: Works **WITHOUT external databases**! Perfect for local development.  
> See [QUICKSTART.md](./QUICKSTART.md) for instant setup without MongoDB/Redis.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.3-blue.svg)
![React](https://img.shields.io/badge/react-18.2-blue.svg)
![Discord.js](https://img.shields.io/badge/discord.js-14.x-5865f2.svg)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Development](#-development)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### Discord Bot
- ✅ **Multi-Server Support** - Unbegrenzte Anzahl von Servern
- ✅ **Slash Commands** - Modernes Discord Command System
- ✅ **Event Handler** - Umfassendes Event-Management
- ✅ **Permission System** - Rollenbasierte Berechtigungen
- ✅ **Rate Limiting** - Spam-Schutz und API-Limits
- ✅ **Auto-Reconnect** - Automatische Verbindungswiederherstellung
- ✅ **Logging System** - Strukturierte Logs mit Winston

### Auto-Moderation
- 🛡️ **Spam Detection** - Intelligente Spam-Erkennung
- 🛡️ **Profanity Filter** - Konfigurierbarer Wortfilter
- 🛡️ **Link Filtering** - URL Whitelist/Blacklist
- 🛡️ **Raid Protection** - Schutz vor Mass-Joins
- 🛡️ **AI Moderation** - Optional mit OpenAI Integration
- 🛡️ **Auto-Actions** - Automatische Warns, Kicks, Bans
- 🛡️ **Appeal System** - User können Appeals einreichen

### Custom Commands
- 🎨 **Visual Command Builder** - Drag & Drop Editor
- 🎨 **Multiple Trigger Types** - Text, Regex, Slash Commands
- 🎨 **Rich Responses** - Text, Embeds, Reactions, DMs
- 🎨 **Variables System** - Dynamische Variablen
- 🎨 **Conditional Logic** - If-Then-Else Strukturen
- 🎨 **Cooldown System** - Pro User/Channel/Global
- 🎨 **Import/Export** - Commands als JSON

### Analytics & Reporting
- 📊 **Real-time Metrics** - Live Dashboard
- 📊 **Historical Data** - Langzeit-Statistiken
- 📊 **Growth Charts** - Member-Wachstum
- 📊 **Activity Heatmaps** - Zeit-basierte Analysen
- 📊 **User Engagement** - Engagement-Scores
- 📊 **Export Functions** - PDF/CSV Reports

### Web Dashboard
- 🖥️ **Discord OAuth2** - Sichere Authentifizierung
- 🖥️ **Server Management** - Multi-Server Support
- 🖥️ **Role Management** - Rollen-Hierarchie
- 🖥️ **Real-time Updates** - Live WebSocket Updates
- 🖥️ **Responsive Design** - Mobile, Tablet, Desktop
- 🖥️ **Dark/Light Mode** - Benutzer-präferenzen

## 🛠️ Technologie-Stack

### Backend
- **Node.js** 20.x - Runtime Environment
- **TypeScript** 5.x - Type Safety
- **discord.js** 14.x - Discord API Wrapper
- **Express.js** 4.x - Web Framework
- **Socket.io** 4.x - Real-time Communication
- **MongoDB** 7.x - Database
- **Redis** 7.x - Caching & Sessions
- **JWT** - Authentication
- **bcrypt** - Password Hashing

### Frontend
- **React** 18.x - UI Framework
- **Vite** - Build Tool
- **TypeScript** - Type Safety
- **Tailwind CSS** 3.x - Styling
- **Shadcn/ui** - UI Components
- **Zustand** - State Management
- **TanStack Query** - Data Fetching
- **Chart.js** 4.x - Data Visualization
- **React Router** v6 - Routing

### DevOps
- **Docker** & **Docker Compose** - Containerization
- **GitHub Actions** - CI/CD
- **ESLint** & **Prettier** - Code Quality
- **Jest** - Testing

## 📦 Voraussetzungen

- Node.js >= 20.0.0
- npm >= 10.0.0
- Discord Bot Token & Application

**Optional** (für Production mit Persistenz):
- MongoDB >= 7.0 (sonst wird In-Memory DB verwendet)
- Redis >= 7.0 (sonst wird In-Memory Cache verwendet)
- Docker & Docker Compose (optional, empfohlen)

> 💡 **Neu**: Du kannst den Bot komplett ohne MongoDB/Redis betreiben!  
> Siehe [FALLBACK.md](./FALLBACK.md) für Details zum In-Memory Modus.

## 🚀 Installation

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/discord-bot-dashboard.git
cd discord-bot-dashboard
```

### 2. Install Dependencies

```bash
# Root dependencies
npm install

# Install all workspace dependencies
npm install --workspaces
```

### 3. Setup Environment Variables

```bash
# Kopiere die Beispiel-Datei
cp .env.example .env

# Bearbeite .env und füge deine Discord-Credentials ein
```

**Minimal-Konfiguration** (Development ohne externe DBs):
```env
# Nur Discord Credentials erforderlich!
DISCORD_TOKEN=your_bot_token
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret

# Lasse MongoDB/Redis leer für In-Memory Modus
MONGODB_URI=
REDIS_URL=

# Secrets
JWT_SECRET=generate_random_string_here
SESSION_SECRET=another_random_string_here
```

**Vollständige Konfiguration** (Production mit Persistenz):
```env
# Discord Credentials
DISCORD_TOKEN=your_bot_token
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret

# Datenbanken (für Persistenz)
MONGODB_URI=mongodb://mongodb:27017/discord-bot-dashboard
REDIS_URL=redis://redis:6379
```

### 4. Discord Bot erstellen

1. Gehe zu https://discord.com/developers/applications
2. Erstelle eine neue Application
3. Gehe zu "Bot" und erstelle einen Bot
4. Kopiere den Token und füge ihn in `.env` ein
5. Aktiviere folgende Intents:
   - Presence Intent
   - Server Members Intent
   - Message Content Intent
6. Gehe zu "OAuth2" und kopiere Client ID & Secret

### 5. Bot einladen

Erstelle eine Einladungs-URL mit folgenden Permissions:
```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot%20applications.commands
```

## ⚙️ Konfiguration

### Umgebungsvariablen (.env)

```env
# Discord Configuration
DISCORD_TOKEN=your_bot_token
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret
DISCORD_REDIRECT_URI=http://localhost:3000/auth/callback

# Database
MONGODB_URI=mongodb://mongodb:27017/discord-bot-dashboard
REDIS_URL=redis://redis:6379

# API
API_PORT=5000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-super-secret-jwt-key
SESSION_SECRET=your-session-secret

# Optional: OpenAI für AI Moderation
OPENAI_API_KEY=your_openai_key

# Optional: SMTP für Email Reports
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

## 💻 Entwicklung

### 🚀 Ohne Docker (Lokaler Modus - OHNE externe Datenbanken!)

```bash
# Install dependencies
npm install
npm install --workspaces

# Minimal .env (nur Discord Credentials!)
# MONGODB_URI und REDIS_URL leer lassen oder auskommentieren

# Start development servers
npm run dev --workspace=bot       # Bot (nutzt In-Memory DB)
npm run dev --workspace=api       # API (nutzt In-Memory Cache)
npm run dev --workspace=frontend  # Frontend

# ✅ Bot läuft jetzt komplett ohne MongoDB/Redis!
```

> 💡 **Tipp**: Im In-Memory Modus sind alle Daten nach Neustart weg.  
> Für Persistenz siehe [FALLBACK.md](./FALLBACK.md)

Die Services werden verfügbar unter:
- **Bot**: Läuft im Hintergrund (In-Memory DB)
- **API**: http://localhost:5000 (In-Memory Cache)
- **Frontend**: http://localhost:5173

### 🐳 Mit Docker (Empfohlen für Production)

```bash
# Alle Services starten (inkl. MongoDB & Redis)
docker-compose up -d

# Logs anzeigen
docker-compose logs -f

# Services stoppen
docker-compose down
```

Die Services werden verfügbar unter:
- **Bot**: Läuft im Hintergrund
- **API**: http://localhost:5000
- **Frontend**: http://localhost:5173
- **MongoDB**: localhost:27017
- **Redis**: localhost:6379

# Terminal 3: Frontend starten
npm run dev:frontend
```

### Development Scripts

```bash
# Alle Services im Dev-Modus
npm run dev

# Einzelne Services
npm run dev:bot
npm run dev:api
npm run dev:frontend

# Build
npm run build

# Tests
npm run test

# Linting
npm run lint

# Formatting
npm run format
```

## 📝 Bot Commands

### Setup Commands
- `/setup` - Initiale Bot-Konfiguration
- `/help` - Hilfe und Befehlsübersicht

### Info Commands
- `/stats` - Server-Statistiken
- `/serverinfo` - Detaillierte Server-Informationen
- `/userinfo [@user]` - Benutzer-Informationen

### Moderation Commands
- `/moderate warn @user [reason]` - Benutzer verwarnen
- `/moderate kick @user [reason]` - Benutzer kicken
- `/moderate ban @user [reason]` - Benutzer bannen
- `/moderate timeout @user [duration] [reason]` - Timeout geben
- `/modlog @user` - Moderations-Historie anzeigen

### Custom Commands
- Verwalte Custom Commands über das Web-Dashboard

## 🌐 API Dokumentation

### Base URL
```
http://localhost:5000/api
```

### Authentifizierung

Alle geschützten Endpoints benötigen einen JWT Token:

```bash
Authorization: Bearer <your-jwt-token>
```

### Hauptendpoints

#### Authentication
```http
GET  /api/auth/discord          # Discord OAuth2 Login
GET  /api/auth/callback         # OAuth2 Callback
POST /api/auth/refresh          # Refresh Token
POST /api/auth/logout           # Logout
```

#### Guilds
```http
GET    /api/guilds              # Alle Server des Users
GET    /api/guilds/:guildId     # Spezifischer Server
PATCH  /api/guilds/:guildId     # Server-Einstellungen updaten
```

#### Analytics
```http
GET /api/analytics/:guildId/overview       # Übersicht
GET /api/analytics/:guildId/members        # Member-Statistiken
GET /api/analytics/:guildId/messages       # Message-Statistiken
GET /api/analytics/:guildId/export         # Daten exportieren
```

#### Moderation
```http
GET    /api/moderation/:guildId/logs       # Moderations-Logs
GET    /api/moderation/:guildId/warnings   # Aktive Warnings
POST   /api/moderation/:guildId/appeal     # Appeal einreichen
PATCH  /api/moderation/:guildId/case/:id   # Case aktualisieren
```

#### Custom Commands
```http
GET    /api/commands/:guildId              # Alle Commands
POST   /api/commands/:guildId              # Command erstellen
PATCH  /api/commands/:guildId/:commandId   # Command updaten
DELETE /api/commands/:guildId/:commandId   # Command löschen
```

### WebSocket Events

```javascript
// Client -> Server
socket.emit('join-guild', { guildId });
socket.emit('leave-guild', { guildId });

// Server -> Client
socket.on('member-count', data);
socket.on('message-created', data);
socket.on('member-joined', data);
socket.on('member-left', data);
```

## 📁 Projektstruktur

```
discord-bot-dashboard/
├── bot/                          # Discord Bot
│   ├── src/
│   │   ├── commands/            # Slash Commands
│   │   ├── events/              # Event Handlers
│   │   ├── services/            # Business Logic
│   │   ├── models/              # Database Models
│   │   ├── utils/               # Utilities
│   │   ├── config/              # Configuration
│   │   ├── bot.ts               # Bot Client
│   │   └── index.ts             # Entry Point
│   ├── Dockerfile
│   └── package.json
│
├── api/                          # REST API & WebSocket
│   ├── src/
│   │   ├── routes/              # API Routes
│   │   ├── controllers/         # Route Controllers
│   │   ├── middleware/          # Custom Middleware
│   │   ├── services/            # Business Logic
│   │   ├── models/              # Shared Models
│   │   ├── websocket/           # Socket.IO Logic
│   │   ├── utils/               # Utilities
│   │   ├── config/              # Configuration
│   │   ├── app.ts               # Express App
│   │   └── index.ts             # Entry Point
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                     # React Frontend
│   ├── src/
│   │   ├── pages/               # Page Components
│   │   ├── components/          # Reusable Components
│   │   ├── hooks/               # Custom Hooks
│   │   ├── services/            # API Services
│   │   ├── store/               # State Management
│   │   ├── utils/               # Utilities
│   │   ├── types/               # TypeScript Types
│   │   ├── App.tsx              # Main App
│   │   └── main.tsx             # Entry Point
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   └── package.json
│
├── nginx/                        # Nginx Configuration
│   └── nginx.conf
│
├── scripts/                      # Utility Scripts
│   └── mongo-init.js
│
├── .github/
│   └── workflows/               # GitHub Actions
│       ├── ci.yml
│       └── deploy.yml
│
├── docker-compose.yml
├── .env.example
├── .gitignore
├── .eslintrc.json
├── .prettierrc
├── package.json
└── README.md
```

## 🐳 Docker Deployment

### Development (Lokal)

```bash
docker-compose up -d
```

### Production

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production services
docker-compose -f docker-compose.prod.yml up -d
```

### Environment-spezifische Overrides

```bash
# Development
docker-compose up

# Production
docker-compose --profile production up
```

## ☁️ Cloud Deployment (Vercel + Railway/Render)

### Kostenlose Hosting-Lösung

**Frontend auf Vercel (Kostenlos)**
```powershell
# Quick Deploy
.\deploy-vercel.ps1

# Oder manuell
cd frontend
vercel
```

**Backend auf Railway/Render (Free Tier)**
- Siehe [DEPLOYMENT.md](./DEPLOYMENT.md) für detaillierte Anleitung
- Railway: $5 Free Credits/Monat
- Render: Komplett kostenlos (mit Cold Start)

**Datenbanken (Kostenlos)**
- MongoDB Atlas: 512MB Free
- Redis Cloud: 30MB Free

📖 **Vollständige Anleitung**: [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🔒 Sicherheit

### Implementierte Sicherheitsmaßnahmen

- ✅ **HTTPS/WSS Only** (TLS 1.3 in Production)
- ✅ **Helmet.js** - Security Headers
- ✅ **Rate Limiting** - API & Auth Endpoints
- ✅ **Input Sanitization** - MongoDB Sanitization
- ✅ **CSRF Protection** - Cookie-basiert
- ✅ **JWT Authentication** - Sichere Token-basierte Auth
- ✅ **Password Hashing** - bcrypt
- ✅ **Environment Variables** - Keine Hardcoded Secrets
- ✅ **CORS Configuration** - Whitelist-basiert

### GDPR Compliance

- ✅ **Daten-Minimierung** - Nur notwendige Daten
- ✅ **Right to Access** - User können Daten exportieren
- ✅ **Right to be Forgotten** - User können Daten löschen
- ✅ **Data Retention** - Auto-Delete nach 90 Tagen
- ✅ **Privacy Policy** - Enthalten
- ✅ **Cookie Consent** - Banner implementiert
- ✅ **Verschlüsselung** - Sensitive Daten encrypted

## 📊 Monitoring & Logging

### Logging

Logs werden in folgende Dateien geschrieben:
- `logs/combined-YYYY-MM-DD.log` - Alle Logs
- `logs/error-YYYY-MM-DD.log` - Nur Fehler

### Health Checks

```bash
# API Health Check
curl http://localhost:5000/health

# Bot Health Check (Docker)
docker exec discord-bot node healthcheck.js
```

## 🧪 Testing

```bash
# Alle Tests ausführen
npm run test

# Tests mit Coverage
npm run test:coverage

# Tests im Watch-Modus
npm run test:watch

# Spezifisches Modul testen
npm run test --workspace=bot
npm run test --workspace=api
npm run test --workspace=frontend
```

## 🚢 CI/CD

Das Projekt nutzt GitHub Actions für automatisierte Workflows:

### Workflows

1. **CI Pipeline** (`.github/workflows/ci.yml`)
   - Linting
   - Type Checking
   - Unit Tests
   - Build Verification

2. **Deploy Pipeline** (`.github/workflows/deploy.yml`)
   - Production Build
   - Docker Image Build
   - Deployment zu Server

## 📖 Weitere Dokumentation

- [API Documentation](./docs/API.md)
- [Bot Commands](./docs/COMMANDS.md)
- [Database Schema](./docs/DATABASE.md)
- [Contributing Guidelines](./CONTRIBUTING.md)
- [Changelog](./CHANGELOG.md)

## 🤝 Contributing

Contributions sind willkommen! Bitte lies [CONTRIBUTING.md](./CONTRIBUTING.md) für Details.

### Development Workflow

1. Fork das Repository
2. Erstelle einen Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit deine Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

## 📜 License

Dieses Projekt ist unter der MIT License lizenziert - siehe [LICENSE](./LICENSE) für Details.

## 👥 Support

- 📧 Email: support@yourdomain.com
- 💬 Discord: [Support Server](https://discord.gg/your-invite)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/discord-bot-dashboard/issues)

## 🙏 Danksagungen

- [discord.js](https://discord.js.org/) - Discord API Wrapper
- [Express.js](https://expressjs.com/) - Web Framework
- [React](https://reactjs.org/) - UI Library
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [shadcn/ui](https://ui.shadcn.com/) - UI Components

---

**Made with ❤️ for the Discord Community**
