# Lokaler Start-Guide (OHNE externe Services!)

## 🎯 Ziel: Bot starten OHNE MongoDB, Redis, Docker

Dieser Guide zeigt dir, wie du den Bot **komplett ohne externe Dienste** starten kannst.

## 📝 Schritt-für-Schritt

### 1. Dependencies installieren

```powershell
# Im Projektroot
npm install
npm install --workspaces
```

### 2. Minimal .env erstellen

Erstelle eine `.env` Datei im Root mit **nur** diesen Einträgen:

```env
# Discord Credentials (erforderlich)
DISCORD_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_client_id_here
DISCORD_CLIENT_SECRET=your_client_secret_here
DISCORD_REDIRECT_URI=http://localhost:5173/auth/callback

# Secrets (generiere random strings)
JWT_SECRET=mein_super_geheimer_jwt_key_12345
SESSION_SECRET=mein_session_secret_67890
ENCRYPTION_KEY=my32charencryptionkeyforAES256

# Wichtig: Lasse diese LEER oder kommentiere sie aus!
MONGODB_URI=
REDIS_URL=

# API Config
API_PORT=5000
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
LOG_LEVEL=info
```

### 3. Bot starten

```powershell
# Im Projektroot
npm run dev --workspace=bot
```

**Erwartete Ausgabe:**
```
⚠️  MongoDB URI not configured or using default
🔄 Switching to IN-MEMORY database (no persistence)
⚠️  Using IN-MEMORY database (data will be lost on restart)
💡 To persist data, configure MongoDB connection
⚠️  Redis URL not configured or using default
💡 Using IN-MEMORY cache (no session persistence)
✅ Bot logged in as YourBot#1234
```

### 4. API starten (optional)

```powershell
# In einem neuen Terminal
npm run dev --workspace=api
```

### 5. Frontend starten (optional)

```powershell
# In einem neuen Terminal
npm run dev --workspace=frontend
```

## ✅ Fertig!

Dein Bot läuft jetzt **komplett im RAM** ohne externe Services!

## 📊 Was funktioniert?

✅ **Alle Bot-Commands**
- `/setup` - Server konfigurieren
- `/stats` - Statistiken anzeigen
- `/moderate` - Moderations-Aktionen

✅ **Daten-Speicherung**
- Guild-Einstellungen
- User-Daten
- Analytics (letzte 10.000 Events)
- Moderation Logs
- Custom Commands

✅ **Caching**
- Command Cooldowns
- Rate Limiting
- Sessions (bis zu Neustart)

## ⚠️ Einschränkungen

❌ **Keine Persistenz**
- Alle Daten gehen bei Bot-Neustart verloren
- Keine Backups möglich (außer manuell via Export)

❌ **Nicht für Production**
- Nutze MongoDB + Redis für echten Betrieb
- Kostenlose Optionen: MongoDB Atlas + Redis Cloud

❌ **Multi-Instance**
- Nur eine Bot-Instanz möglich
- Keine Daten-Synchronisation

## 🔄 Wann auf MongoDB/Redis wechseln?

**Wechsel zu externen DBs wenn:**
- Bot läuft auf >10 Servern
- Daten-Persistenz wichtig ist
- Production-Einsatz geplant
- Backups benötigt werden

**Setup mit kostenlosen Services:**

1. **MongoDB Atlas** (512MB free)
   - https://www.mongodb.com/cloud/atlas/register
   - Connection String kopieren
   - In `.env` eintragen: `MONGODB_URI=mongodb+srv://...`

2. **Redis Cloud** (30MB free)
   - https://redis.com/try-free/
   - Connection String kopieren
   - In `.env` eintragen: `REDIS_URL=redis://...`

3. **Bot neu starten**
   ```powershell
   npm run dev --workspace=bot
   ```

Bot erkennt automatisch die DBs und nutzt sie!

## 🆘 Troubleshooting

### "Cannot find module 'discord.js'"

```powershell
npm install --workspace=bot
```

### "DISCORD_TOKEN is required"

Füge deinen Bot Token in `.env` ein:
```env
DISCORD_TOKEN=dein_token_hier
```

Token findest du hier: https://discord.com/developers/applications

### Bot startet nicht

Stelle sicher dass:
1. `.env` existiert im Root
2. `DISCORD_TOKEN` gesetzt ist
3. Dependencies installiert: `npm install --workspaces`

### "Data will be lost on restart" Warning

**Normal!** Das ist der In-Memory Modus. Konfiguriere MongoDB für Persistenz.

## 💡 Tipps

### Daten Export vor Shutdown

Der Bot exportiert automatisch Daten beim Beenden:
```
💾 In-memory data exported: { guilds: 5, users: 42 }
```

### Schneller Neustart

```powershell
# Bot stoppen: Ctrl+C
# Neu starten:
npm run dev --workspace=bot
```

### Logs anschauen

Logs werden gespeichert in:
- `bot/logs/combined-YYYY-MM-DD.log`
- `bot/logs/error-YYYY-MM-DD.log`

## 📚 Weitere Infos

- [FALLBACK.md](./FALLBACK.md) - Technische Details zum In-Memory Modus
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Production Deployment mit externen DBs
- [README.md](./README.md) - Vollständige Dokumentation

---

**Viel Spaß mit deinem Discord Bot! 🎉**
