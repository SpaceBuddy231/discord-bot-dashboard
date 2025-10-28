# Discord Bot Dashboard

**Professional Discord Bot Management System**

A production-ready Discord bot with web dashboard, analytics, auto-moderation, and multi-server support. Built with modern technologies and best practices.

## Quick Links

- 🌐 **Live Demo**: [View Demo](https://dist-grwjpu0y3-spacebuddy231-7370s-projects.vercel.app)
- 📖 **Documentation**: [Read Docs](./README.md)

## Key Features

- ✅ Multi-server Discord bot with slash commands
- ✅ Modern React web dashboard with real-time updates
- ✅ Advanced analytics and statistics tracking
- ✅ Auto-moderation system (spam, profanity, raids)
- ✅ Custom command builder
- ✅ Works without external databases (in-memory fallback)
- ✅ Production-ready Docker deployment
- ✅ GDPR compliant

## Tech Stack

**Backend**: Node.js, TypeScript, Discord.js 14, Express, Socket.io  
**Frontend**: React 18, Vite, Tailwind CSS, shadcn/ui  
**Database**: MongoDB, Redis (optional, has in-memory fallback)  
**DevOps**: Docker, Vercel, Railway

## Quick Start

```bash
# Clone repository
git clone https://github.com/yourusername/discord-bot-dashboard.git

# Install dependencies
npm install && npm install --workspaces

# Configure environment
cp .env.example .env
# Add your Discord bot token

# Start development (no external databases needed!)
npm run dev:bot
npm run dev:api
npm run dev:frontend
```

## Documentation

- [Full README](./README.md) - Complete project documentation
- [Quick Start Guide](./QUICKSTART.md) - Get started in 5 minutes
- [Deployment Guide](./DEPLOYMENT.md) - Deploy to production
- [Fallback Mode](./FALLBACK.md) - Run without databases
- [Contributing](./CONTRIBUTING.md) - Contribution guidelines
- [Changelog](./CHANGELOG.md) - Version history

## Screenshots

### Dashboard Overview
Modern, Discord-styled interface with real-time statistics

### Server Management
Manage multiple servers from one central dashboard

### Analytics
Comprehensive analytics with interactive charts

## Support

- 📧 Email: support@yourdomain.com
- 💬 Discord: [Join Server](https://discord.gg/your-invite)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/discord-bot-dashboard/issues)

## License

MIT License - see [LICENSE](./LICENSE) for details

---

**Built with ❤️ for the Discord community**
