import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import ClientApp from './views/ClientApp';
import TeamDashboard from './views/TeamDashboard';

export default function App() {
  const [view, setView] = useState('counselor'); // 'counselor' | 'team'

  return (
    <AppProvider>
      <div className="min-h-screen bg-[#f4f4f8] flex flex-col">
        {/* Purple top bar */}
        <div className="purple-bar" />

        {/* Top navigation */}
        <TopNav view={view} setView={setView} />

        {/* Main content */}
        <div className="flex-1">
          {view === 'counselor' ? (
            <ClientApp />
          ) : (
            <TeamDashboard onSwitchView={setView} />
          )}
        </div>
      </div>
    </AppProvider>
  );
}

function TopNav({ view, setView }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-white border-b border-gray-100 px-4 py-3 relative z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-12 h-12 flex items-center justify-center">
            <svg viewBox="0 0 48 48" className="w-11 h-11">
              <circle cx="24" cy="24" r="24" fill="#f0fdf4" />
              {/* Hands holding plant */}
              <text x="24" y="32" textAnchor="middle" fontSize="22">🌱</text>
            </svg>
          </div>
          <div className="hidden sm:block">
            <div className="font-bold text-gray-900 text-sm leading-tight">RightFit</div>
            <div className="text-gray-400 text-xs leading-tight uppercase tracking-wide">Recovery Addiction Counseling</div>
          </div>
        </div>

        {/* Center nav */}
        <div className="flex items-center gap-2">
          {/* Hamburger */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {menuOpen && (
              <div className="absolute top-12 left-0 bg-white rounded-2xl shadow-xl border border-gray-100 w-44 py-2 z-50">
                {['Intro', 'Questionnaire', 'Swiping'].map(item => (
                  <button
                    key={item}
                    onClick={() => setMenuOpen(false)}
                    className="w-full text-left px-5 py-3 text-gray-700 hover:bg-gray-50 text-sm font-medium"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setView('counselor')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all"
            style={{
              background: view === 'counselor' ? '#f97316' : '#f3f4f6',
              color: view === 'counselor' ? 'white' : '#374151',
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z" />
            </svg>
            Counselor View
          </button>

          <button
            onClick={() => setView('team')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all"
            style={{
              background: view === 'team' ? '#f97316' : '#f3f4f6',
              color: view === 'team' ? 'white' : '#374151',
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Team View
          </button>
        </div>

        <div className="w-24 hidden sm:block" />
      </div>

      {/* Overlay to close menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
      )}
    </div>
  );
}
