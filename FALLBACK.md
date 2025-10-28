# 🔄 Lokaler Fallback-Modus

## Übersicht

Dieses Projekt kann **komplett ohne externe Dienste** laufen! Alle Services haben intelligente Fallbacks:

## 🎯 Fallback-Features

### 1. ✅ In-Memory Datenbank (MongoDB-Ersatz)

**Wann aktiv:**
- MongoDB nicht konfiguriert (leere `MONGODB_URI`)
- MongoDB nicht erreichbar
- Verbindungsfehler

**Was passiert:**
- Alle Daten werden im RAM gespeichert
- Volle Funktionalität (Guilds, Users, Analytics, Moderation Logs, Custom Commands)
- ⚠️ **Achtung**: Daten gehen bei Neustart verloren

**Aktivierung:**
```env
# In .env einfach leer lassen oder auskommentieren
MONGODB_URI=
# oder
# MONGODB_URI=mongodb://localhost:27017/discord-bot-dashboard
```

**Features:**
- ✅ Guild-Einstellungen speichern
- ✅ Benutzer-Daten verwalten
- ✅ Analytics tracken (letzte 10.000 Events pro Server)
- ✅ Moderation Logs mit Case-IDs
- ✅ Custom Commands
- ✅ Export/Import Funktion (optional)

### 2. ✅ In-Memory Cache (Redis-Ersatz)

**Wann aktiv:**
- Redis nicht konfiguriert (leere `REDIS_URL`)
- Redis nicht erreichbar
- Verbindungsfehler

**Was passiert:**
- Sessions werden im RAM gecacht
- Rate-Limiting funktioniert weiterhin
- TTL (Time-To-Live) wird respektiert
- ⚠️ **Achtung**: Sessions gehen bei Neustart verloren

**Aktivierung:**
```env
# In .env einfach leer lassen oder auskommentieren
REDIS_URL=
# oder
# REDIS_URL=redis://localhost:6379
```

**Features:**
- ✅ Session-Management
- ✅ Caching mit Expiry
- ✅ Rate-Limiting
- ✅ Command Cooldowns

## 🚀 Quick Start OHNE externe Services

### Minimale Konfiguration

```env
# .env - Nur Discord-Credentials erforderlich!
DISCORD_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_client_id_here
DISCORD_CLIENT_SECRET=your_client_secret_here

# Alle anderen DB-Felder leer lassen:
MONGODB_URI=
REDIS_URL=

# API Configuration
JWT_SECRET=generate_random_string_here
SESSION_SECRET=another_random_string_here
```

### Starten

```bash
# Bot starten (funktioniert ohne MongoDB/Redis)
npm run dev --workspace=bot

# API starten (funktioniert ohne MongoDB/Redis)
npm run dev --workspace=api

# Alles mit Docker (funktioniert auch ohne externe DBs)
docker-compose up
```

## 📊 Verwendung mit Adaptern

### Automatische Erkennung

Der Code erkennt automatisch, ob MongoDB verfügbar ist:

```typescript
import { GuildAdapter } from './models/adapters/Guild.adapter';

// Funktioniert mit MongoDB ODER In-Memory DB!
const guild = await GuildAdapter.findByGuildId('123456789');
await GuildAdapter.update('123456789', { name: 'New Name' });
```

### Cache-Funktionen

```typescript
import { setCache, getCache, deleteCache } from './database/connection';

// Funktioniert mit Redis ODER In-Memory Cache!
await setCache('key', 'value', 3600); // 1 hour TTL
const value = await getCache('key');
await deleteCache('key');
```

## 🔍 Status prüfen

### Im Bot

```typescript
import { isUsingInMemoryDB } from './database/connection';
import { inMemoryDB } from './database/fallback';

if (isUsingInMemoryDB()) {
  console.log('⚠️  Running with IN-MEMORY database');
  console.log(inMemoryDB.getStats());
}
```

### Logs beachten

Bei Start siehst du:

```
⚠️  MongoDB URI not configured or using default
🔄 Switching to IN-MEMORY database (no persistence)
⚠️  Using IN-MEMORY database (data will be lost on restart)
💡 To persist data, configure MongoDB connection
```

Oder wenn Redis fehlt:

```
⚠️  Redis URL not configured or using default
💡 Using IN-MEMORY cache (no session persistence)
```

## 💾 Daten Persistieren (Optional)

### Export/Import Feature

```typescript
import { inMemoryDB } from './database/fallback';
import fs from 'fs';

// Export vor dem Shutdown
const data = inMemoryDB.export();
fs.writeFileSync('backup.json', JSON.stringify(data, null, 2));

// Import nach dem Start
const data = JSON.parse(fs.readFileSync('backup.json', 'utf8'));
inMemoryDB.import(data);
```

### Automatischer Export beim Shutdown

Der Bot exportiert automatisch Daten beim Beenden:

```
💾 In-memory data exported: { guilds: 5, users: 42 }
```

## 📈 Performance-Vergleich

| Feature | MongoDB | In-Memory | Unterschied |
|---------|---------|-----------|-------------|
| Schreibgeschwindigkeit | ~50ms | <1ms | 50x schneller |
| Lesegeschwindigkeit | ~10ms | <0.1ms | 100x schneller |
| Speicher | Disk | RAM | Limitiert durch RAM |
| Persistenz | ✅ Permanent | ❌ Temporär | Neustart = Datenverlust |
| Setup | Extern | ✅ Automatisch | Keine Config nötig |

## ⚖️ Wann welche Lösung?

### ✅ In-Memory (Fallback) nutzen wenn:
- **Entwicklung/Testing**: Schnell starten ohne Setup
- **Kleine Bots**: <10 Server, kein Produktivbetrieb
- **Temporäre Instanzen**: Einmalige Tests
- **Keine Daten-Persistenz nötig**: Statische Commands, kein User-Tracking

### ✅ MongoDB/Redis nutzen wenn:
- **Production**: Echter Betrieb mit Usern
- **Größe**: >10 Server oder viele User
- **Persistenz wichtig**: Einstellungen, Analytics, Moderation Logs
- **Multi-Instance**: Mehrere Bot-Instanzen
- **Backups**: Datenwiederherstellung wichtig

## 🔧 Migration von In-Memory zu MongoDB

### 1. Daten exportieren

```bash
# Im Bot-Container
npm run export-data
```

### 2. MongoDB starten

```bash
docker-compose up -d mongodb
```

### 3. .env anpassen

```env
MONGODB_URI=mongodb://localhost:27017/discord-bot-dashboard
```

### 4. Bot neustarten

```bash
npm run dev --workspace=bot
```

### 5. Daten importieren (optional)

```bash
npm run import-data backup.json
```

## 🆘 Troubleshooting

### "Data will be lost on restart"

**Normal!** Das ist der Fallback-Modus. Konfiguriere MongoDB für Persistenz:

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
```

### Bot vergisst Einstellungen

**Erwartetes Verhalten** im In-Memory Modus. Jeder Neustart = frische Datenbank.

**Lösung**: MongoDB konfigurieren oder Export/Import nutzen.

### Performance-Probleme

In-Memory ist **schneller** als MongoDB. Wenn Probleme auftreten, liegt es woanders:
- Zu viele Events? → Event-Filtering einbauen
- Zu viele Commands? → Rate-Limiting prüfen
- Memory voll? → Analytics-Limit reduzieren

## 📚 Weitere Infos

### Code-Beispiele

Siehe:
- `bot/src/database/fallback.ts` - In-Memory Implementation
- `bot/src/models/adapters/` - Unified Interface
- `bot/src/database/connection.ts` - Fallback-Logik

### Best Practices

1. **Entwicklung**: Immer In-Memory nutzen (schneller, einfacher)
2. **Staging**: MongoDB lokal mit Docker
3. **Production**: MongoDB Atlas + Redis Cloud (kostenlos!)

---

**💡 Tipp**: Du kannst jederzeit zwischen Modi wechseln - keine Code-Änderungen nötig!
