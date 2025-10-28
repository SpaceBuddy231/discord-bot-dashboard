import { Link } from 'react-router-dom';
import { Bot, Shield, BarChart3, Zap, Github } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1e1f22] to-[#2b2d31]">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-[#1e1f22]/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-8 h-8 text-[#5865f2]" />
            <span className="text-xl font-bold text-white">Discord Bot Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="px-4 py-2 text-white hover:text-[#5865f2] transition-colors"
            >
              Login
            </Link>
            <Link
              to="/dashboard"
              className="px-6 py-2 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-md transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Demo Warning Banner */}
      <div className="bg-yellow-500/10 border-y border-yellow-500/20 py-3">
        <div className="container mx-auto px-4 text-center">
          <p className="text-yellow-500 font-semibold">
            ⚠️ DEMO-VERSION - Dies ist eine Vorschau-Seite ohne echte Funktionen
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#5865f2]/10 border border-[#5865f2]/20 rounded-full mb-6">
            <Zap className="w-4 h-4 text-[#5865f2]" />
            <span className="text-sm text-[#5865f2]">Jetzt komplett ohne externe Datenbanken!</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Professionelles
            <span className="text-[#5865f2]"> Discord Bot</span>
            <br />
            Management Dashboard
          </h1>

          <div className="inline-block bg-yellow-500/20 border border-yellow-500/50 rounded-lg px-6 py-3 mb-6">
            <p className="text-yellow-300 font-bold text-lg">
              🎨 UI/UX Demo - Keine echten Bot-Funktionen implementiert
            </p>
          </div>

          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Verwalte mehrere Discord-Server mit erweiterten Analytics, Auto-Moderation
            und einem modernen Web-Interface. GDPR-konform für den deutschen Markt.
          </p>

          <div className="flex items-center justify-center gap-4 mb-12">
            <Link
              to="/login"
              className="px-8 py-4 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
            >
              <Bot className="w-5 h-5" />
              Jetzt starten
            </Link>
            <a
              href="https://github.com/yourusername/discord-bot-dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
            >
              <Github className="w-5 h-5" />
              GitHub
            </a>
          </div>

          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-500">Bot läuft im In-Memory Modus</span>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-[#2b2d31] border border-gray-800 rounded-lg p-6 hover:border-[#5865f2]/50 transition-colors">
            <div className="w-12 h-12 bg-[#5865f2]/10 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-[#5865f2]" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Auto-Moderation</h3>
            <p className="text-gray-400">
              Intelligente Spam-Erkennung, Profanity Filter und automatische
              Moderations-Aktionen zum Schutz deiner Community.
            </p>
          </div>

          <div className="bg-[#2b2d31] border border-gray-800 rounded-lg p-6 hover:border-[#5865f2]/50 transition-colors">
            <div className="w-12 h-12 bg-[#5865f2]/10 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-[#5865f2]" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Analytics & Insights</h3>
            <p className="text-gray-400">
              Detaillierte Statistiken über Member-Aktivität, Wachstum und
              Engagement mit interaktiven Charts.
            </p>
          </div>

          <div className="bg-[#2b2d31] border border-gray-800 rounded-lg p-6 hover:border-[#5865f2]/50 transition-colors">
            <div className="w-12 h-12 bg-[#5865f2]/10 rounded-lg flex items-center justify-center mb-4">
              <Bot className="w-6 h-6 text-[#5865f2]" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Custom Commands</h3>
            <p className="text-gray-400">
              Erstelle eigene Commands mit Variablen, Bedingungen und
              Rich-Responses im visuellen Editor.
            </p>
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Moderner Tech-Stack</h2>
          <p className="text-gray-400">Gebaut mit den neuesten Technologien</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {[
            'Node.js 20',
            'TypeScript 5',
            'React 18',
            'discord.js v14',
            'MongoDB / In-Memory',
            'Redis / In-Memory',
            'TailwindCSS',
            'Docker',
          ].map((tech) => (
            <div
              key={tech}
              className="bg-[#2b2d31] border border-gray-800 rounded-lg px-4 py-3 text-center text-white hover:border-[#5865f2]/50 transition-colors"
            >
              {tech}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>
            © 2025 Discord Bot Dashboard. Made with ❤️ for the German Discord community.
          </p>
          <p className="text-sm mt-2">
            💡 Läuft ohne MongoDB/Redis? Siehe{' '}
            <a href="/docs/fallback" className="text-[#5865f2] hover:underline">
              FALLBACK.md
            </a>{' '}
            für Details.
          </p>
        </div>
      </footer>
    </div>
  );
}
