# Vercel Deployment Guide

## 🚀 Deployment auf Vercel

Dieses Projekt nutzt eine **Hybrid-Deployment-Strategie**:
- **Frontend**: Vercel (kostenlos)
- **Backend (Bot + API)**: Railway/Render/Heroku (kostenloser Tier)
- **Datenbanken**: MongoDB Atlas + Redis Cloud (kostenlos)

## 📋 Voraussetzungen

1. **Vercel Account**: https://vercel.com/signup
2. **MongoDB Atlas Account**: https://www.mongodb.com/cloud/atlas/register
3. **Redis Cloud Account**: https://redis.com/try-free/
4. **Railway/Render Account** (für Backend): 
   - Railway: https://railway.app/
   - Render: https://render.com/

## 🔧 Setup

### 1. Datenbanken einrichten

#### MongoDB Atlas (Kostenlos)
```bash
1. Erstelle einen Account auf MongoDB Atlas
2. Erstelle einen neuen Cluster (M0 Free Tier)
3. Erstelle einen Database User
4. Whitelist IP: 0.0.0.0/0 (Allow from anywhere)
5. Kopiere die Connection String
   Format: mongodb+srv://username:password@cluster.mongodb.net/discord-bot-dashboard
```

#### Redis Cloud (Kostenlos)
```bash
1. Erstelle einen Account auf Redis Cloud
2. Erstelle eine neue Subscription (30MB Free)
3. Erstelle eine Database
4. Kopiere die Connection String
   Format: redis://default:password@endpoint:port
```

### 2. Frontend auf Vercel deployen

#### Option A: Mit Vercel CLI
```bash
# Vercel CLI installieren
npm install -g vercel

# Im Projektverzeichnis
cd frontend

# Login
vercel login

# Deploy
vercel

# Production Deploy
vercel --prod
```

#### Option B: Mit Git Integration (Empfohlen)
```bash
1. Push dein Projekt zu GitHub/GitLab/Bitbucket
2. Gehe zu https://vercel.com/new
3. Importiere dein Repository
4. Konfiguriere:
   - Framework Preset: Vite
   - Root Directory: frontend
   - Build Command: npm run build
   - Output Directory: dist
5. Füge Environment Variables hinzu (siehe unten)
6. Deploy!
```

#### Environment Variables für Vercel
```env
VITE_API_URL=https://your-backend.railway.app/api
VITE_WEBSOCKET_URL=wss://your-backend.railway.app
```

### 3. Backend auf Railway deployen

#### Railway Setup
```bash
1. Gehe zu https://railway.app/
2. Erstelle ein neues Projekt
3. Wähle "Deploy from GitHub repo"
4. Wähle dein Repository
5. Erstelle zwei Services:
   - Discord Bot (Root: bot/)
   - API Server (Root: api/)
```

#### Railway Environment Variables
```env
# Discord
DISCORD_TOKEN=your_bot_token
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret
DISCORD_REDIRECT_URI=https://your-vercel-app.vercel.app/auth/callback

# Database
MONGODB_URI=your_mongodb_atlas_connection_string
REDIS_URL=your_redis_cloud_connection_string

# API
API_PORT=5000
FRONTEND_URL=https://your-vercel-app.vercel.app
CORS_ORIGIN=https://your-vercel-app.vercel.app

# Security
JWT_SECRET=generate_random_32_char_string
SESSION_SECRET=generate_random_32_char_string
ENCRYPTION_KEY=generate_random_32_char_string

# Node
NODE_ENV=production
```

#### Railway Konfiguration (railway.json)
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 4. Alternative: Render (Kostenlos)

#### Render Setup
```bash
1. Gehe zu https://render.com/
2. Erstelle einen neuen Web Service
3. Verbinde dein GitHub Repository
4. Konfiguriere für Bot:
   - Name: discord-bot
   - Environment: Node
   - Build Command: cd bot && npm install && npm run build
   - Start Command: cd bot && npm start
   
5. Konfiguriere für API:
   - Name: discord-bot-api
   - Environment: Node
   - Build Command: cd api && npm install && npm run build
   - Start Command: cd api && npm start
```

## 📦 Build-Optimierungen für Vercel

### Frontend package.json anpassen
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "vercel-build": "npm run build"
  }
}
```

### Environment Variables Management
```typescript
// src/config/env.ts
export const env = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  wsUrl: import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:5000',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
};
```

## 🔄 CI/CD mit Vercel & Railway

### Automatische Deployments
```bash
# Vercel
- Push zu main -> Production Deploy
- Push zu develop -> Preview Deploy
- Pull Request -> Preview Deploy

# Railway
- Push zu main -> Production Deploy
- Automatic Rollbacks bei Fehler
```

## 🌍 Custom Domain

### Vercel Domain Setup
```bash
1. Gehe zu Project Settings > Domains
2. Füge deine Domain hinzu
3. Konfiguriere DNS:
   - A Record: 76.76.21.21
   - CNAME: cname.vercel-dns.com
```

### SSL Zertifikate
- Automatisch von Vercel bereitgestellt
- Kostenlos (Let's Encrypt)
- Auto-Renewal

## 📊 Monitoring & Logs

### Vercel
```bash
# Analytics Dashboard verfügbar
# Real-time Logs: vercel logs
# Performance Metrics
```

### Railway
```bash
# Dashboard mit CPU/Memory Metrics
# Live Logs
# Deployment History
```

## 💰 Kostenübersicht

### Free Tier Limits

**Vercel:**
- ✅ 100GB Bandwidth/Monat
- ✅ Unlimited Deployments
- ✅ Automatic HTTPS
- ✅ 6.000 Build Minutes

**Railway:**
- ✅ $5 Free Credit/Monat
- ✅ ~500 Stunden Runtime
- ⚠️ Nach Credit: $0.000231/GB-sec RAM

**MongoDB Atlas:**
- ✅ 512MB Storage
- ✅ Shared RAM
- ✅ Unlimited connections

**Redis Cloud:**
- ✅ 30MB Memory
- ✅ 30 Connections
- ✅ 10,000 Commands/sec

**Alternative: Render**
- ✅ 750 Stunden/Monat kostenlos
- ✅ Automatisches Suspend bei Inaktivität
- ⚠️ Cold Start (kann langsam sein)

## 🚨 Wichtige Hinweise

### Railway vs Render

**Railway (Empfohlen):**
- ✅ Kein Cold Start
- ✅ Bessere Performance
- ✅ Einfacheres Setup
- ⚠️ Begrenzte Free Credits

**Render:**
- ✅ Vollständig kostenlos
- ✅ Unbegrenzte Zeit
- ⚠️ Cold Start (15-30 Sekunden)
- ⚠️ Suspend nach Inaktivität

### Best Practices

1. **Secrets Security**
   - Nutze Environment Variables
   - Niemals Secrets in Code committen
   - Rotate Secrets regelmäßig

2. **Performance**
   - Aktiviere Redis Caching
   - Nutze MongoDB Indexes
   - Minimize API Calls

3. **Monitoring**
   - Setup Error Tracking (Sentry)
   - Monitor API Response Times
   - Check Database Performance

## 🔗 Nützliche Links

- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app/)
- [Render Docs](https://render.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Redis Cloud Docs](https://redis.com/redis-enterprise-cloud/overview/)

## 🆘 Troubleshooting

### Build Fails auf Vercel
```bash
# Stelle sicher dass tsconfig.json korrekt ist
# Prüfe ob alle dependencies in package.json sind
# Check Build Logs auf Vercel Dashboard
```

### Bot verbindet nicht
```bash
# Prüfe DISCORD_TOKEN
# Prüfe Intents in Discord Developer Portal
# Check Railway/Render Logs
```

### Database Connection Error
```bash
# Prüfe MongoDB Connection String
# Whitelist IP: 0.0.0.0/0
# Check Database User Permissions
```

### CORS Errors
```bash
# Stelle sicher CORS_ORIGIN in API gesetzt ist
# Format: https://your-app.vercel.app (ohne trailing slash)
# Prüfe alle Origins in API cors config
```

## 📈 Skalierung (Später)

Wenn dein Bot wächst:
- **Vercel Pro**: $20/Monat (mehr Bandwidth)
- **Railway Pro**: ab $5/Monat (mehr Credits)
- **MongoDB Atlas M10**: ab $9/Monat (Dedicated)
- **Redis Cloud**: ab $7/Monat (mehr Memory)

## ✅ Deployment Checklist

- [ ] MongoDB Atlas Cluster erstellt
- [ ] Redis Cloud Database erstellt
- [ ] Environment Variables konfiguriert
- [ ] Frontend auf Vercel deployed
- [ ] Backend auf Railway/Render deployed
- [ ] Bot läuft und ist online
- [ ] API Health Check erfolgreich
- [ ] Discord OAuth funktioniert
- [ ] WebSocket Verbindung funktioniert
- [ ] Custom Domain konfiguriert (optional)
- [ ] SSL Zertifikat aktiv
- [ ] Monitoring setup

---

**Viel Erfolg mit deinem Discord Bot Dashboard! 🎉**
