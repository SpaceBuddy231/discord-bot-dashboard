import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bot,
  LayoutDashboard,
  Shield,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  Users,
  Activity,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const mockGuilds = [
    { id: '1', name: 'Hauptserver', members: 1234, icon: '🎮' },
    { id: '2', name: 'Dev Community', members: 567, icon: '💻' },
  ];

  const mockStats = {
    totalMembers: 1801,
    activeToday: 342,
    messages24h: 1563,
    moderationActions: 12,
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#1e1f22] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#2b2d31] border-r border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Bot className="w-8 h-8 text-[#5865f2]" />
            <span className="font-bold text-white">Dashboard</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'overview'
                ? 'bg-[#5865f2] text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Übersicht
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'analytics'
                ? 'bg-[#5865f2] text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            Analytics
          </button>

          <button
            onClick={() => setActiveTab('moderation')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'moderation'
                ? 'bg-[#5865f2] text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <Shield className="w-5 h-5" />
            Moderation
          </button>

          <button
            onClick={() => setActiveTab('commands')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'commands'
                ? 'bg-[#5865f2] text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            Commands
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'settings'
                ? 'bg-[#5865f2] text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <Settings className="w-5 h-5" />
            Einstellungen
          </button>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Abmelden
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Demo Warning Banner */}
        <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-8 py-3">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl">⚠️</span>
            <p className="text-yellow-500 font-semibold">
              DEMO-ANSICHT - Alle Daten sind Mock-Daten ohne echte Bot-Verbindung
            </p>
          </div>
        </div>

        {/* Header */}
        <header className="bg-[#2b2d31] border-b border-gray-800 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {activeTab === 'overview' && 'Dashboard Übersicht'}
                {activeTab === 'analytics' && 'Analytics & Statistiken'}
                {activeTab === 'moderation' && 'Moderation'}
                {activeTab === 'commands' && 'Custom Commands'}
                {activeTab === 'settings' && 'Einstellungen'}
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Verwalte deine Discord-Server (Demo)
              </p>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-lg">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-orange-500">Demo-Modus (Mock-Daten)</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#2b2d31] border border-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Mitglieder</span>
                    <Users className="w-5 h-5 text-[#5865f2]" />
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {mockStats.totalMembers.toLocaleString('de-DE')}
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-500">+12% diese Woche</span>
                  </div>
                </div>

                <div className="bg-[#2b2d31] border border-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Aktiv heute</span>
                    <Activity className="w-5 h-5 text-[#5865f2]" />
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {mockStats.activeToday}
                  </div>
                  <div className="text-sm text-gray-400 mt-2">
                    {Math.round((mockStats.activeToday / mockStats.totalMembers) * 100)}%
                    Aktivität
                  </div>
                </div>

                <div className="bg-[#2b2d31] border border-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Nachrichten 24h</span>
                    <MessageSquare className="w-5 h-5 text-[#5865f2]" />
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {mockStats.messages24h.toLocaleString('de-DE')}
                  </div>
                  <div className="text-sm text-gray-400 mt-2">Durchschnitt: 65/h</div>
                </div>

                <div className="bg-[#2b2d31] border border-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Mod-Aktionen</span>
                    <Shield className="w-5 h-5 text-[#5865f2]" />
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {mockStats.moderationActions}
                  </div>
                  <div className="text-sm text-gray-400 mt-2">Letzte 7 Tage</div>
                </div>
              </div>

              {/* Server List */}
              <div className="bg-[#2b2d31] border border-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Deine Server</h2>
                <div className="space-y-3">
                  {mockGuilds.map((guild) => (
                    <div
                      key={guild.id}
                      className="flex items-center justify-between p-4 bg-[#1e1f22] rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{guild.icon}</div>
                        <div>
                          <div className="font-semibold text-white">{guild.name}</div>
                          <div className="text-sm text-gray-400">
                            {guild.members.toLocaleString('de-DE')} Mitglieder
                          </div>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-md transition-colors">
                        Verwalten
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-yellow-500 mb-1">
                    🎨 UI/UX Demo-Version
                  </div>
                  <div className="text-sm text-gray-400">
                    Dies ist eine <strong className="text-yellow-400">reine Frontend-Demonstration</strong> ohne
                    Backend-Anbindung. Alle angezeigten Server, Statistiken und Daten sind
                    Mock-Daten. Ein echter Bot muss noch konfiguriert werden - siehe{' '}
                    <a
                      href="/QUICKSTART.md"
                      className="text-yellow-500 hover:underline"
                    >
                      QUICKSTART.md
                    </a>{' '}
                    für die Einrichtung.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'overview' && (
            <div className="bg-[#2b2d31] border border-yellow-500/20 rounded-lg p-8 text-center">
              <div className="text-6xl mb-4">🚧</div>
              <div className="text-yellow-500 font-semibold mb-2 text-xl">
                Demo-Seite in Entwicklung
              </div>
              <div className="text-gray-400 mb-4">
                Diese Seite ist Teil der UI-Demonstration und noch nicht implementiert.
              </div>
              <p className="text-sm text-gray-500">
                Nutze das Sidebar-Menü, um zur Übersicht zurückzukehren.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
