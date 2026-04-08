import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Bell, Shield, HelpCircle, ChevronRight, Heart, EyeOff, Eye, Phone, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { COUNSELORS } from '../data/counselors';
import BottomNav from '../components/BottomNav';

const CRISIS_LINES = [
  {
    name: 'Problem Gambling Helpline',
    contact: '1-800-522-4700',
    type: 'call',
    note: 'Free, confidential, 24/7',
    icon: '🎲',
  },
  {
    name: 'Crisis Text Line',
    contact: 'Text HOME to 741741',
    type: 'text',
    note: 'Anonymous & confidential',
    icon: '💬',
  },
  {
    name: 'National Crisis Line',
    contact: '988',
    type: 'call',
    note: 'Call or text, 24/7',
    icon: '🆘',
  },
  {
    name: 'Gamblers Anonymous',
    contact: 'ga.org',
    type: 'web',
    note: 'Find local meetings',
    icon: '🤝',
  },
];

export default function Profile() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [showCrisis, setShowCrisis] = useState(false);

  const user = state.user;
  const matchCount = state.matches.length;
  const likedCount = state.liked.length;
  const isAnonymous = state.anonymous;

  const displayName = isAnonymous ? 'Anonymous' : (user?.name || 'Friend');

  function toggleAnonymous() {
    dispatch({ type: 'SET_ANONYMOUS', payload: !isAnonymous });
  }

  function handleLogout() {
    dispatch({ type: 'RESET' });
    navigate('/');
  }

  return (
    <div className="min-h-dvh flex flex-col bg-gradient-to-b from-violet-50 to-white content-bottom">
      {/* Header */}
      <div className="px-5 pb-4 screen-top flex-shrink-0">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-400 text-xs mt-0.5">Manage your journey</p>
      </div>

      {/* User card */}
      <div className="px-5 mb-5">
        <motion.div
          className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center text-4xl flex-shrink-0">
                {isAnonymous ? '🕶️' : (user?.avatar || '🧑')}
              </div>
              {isAnonymous && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-violet-600 rounded-full flex items-center justify-center">
                  <EyeOff size={10} className="text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-gray-900 truncate">{displayName}</h2>
              <p className="text-violet-600 text-sm font-medium">
                {isAnonymous ? 'Anonymous mode on' : 'Recovery Journey Member'}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex mt-4 pt-4 border-t border-gray-100 divide-x divide-gray-100">
            <Stat label="Connected" value={likedCount} />
            <Stat label="Matched" value={matchCount} />
            <Stat label="Sessions" value={matchCount > 0 ? 1 : 0} />
          </div>
        </motion.div>
      </div>

      {/* Anonymous mode toggle — key UX differentiator */}
      <div className="px-5 mb-5">
        <motion.div
          className="rounded-2xl p-4 border"
          style={{
            background: isAnonymous ? 'linear-gradient(135deg, #f5f0ff, #ede9fe)' : 'white',
            borderColor: isAnonymous ? '#c4b5fd' : '#e5e7eb',
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: isAnonymous ? '#7c3aed' : '#f3f4f6' }}
              >
                {isAnonymous
                  ? <EyeOff size={18} className="text-white" />
                  : <Eye size={18} className="text-gray-500" />
                }
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Anonymous Mode</p>
                <p className="text-gray-400 text-xs">
                  {isAnonymous
                    ? 'Your name is hidden from counselors'
                    : 'Counselors see your first name only'}
                </p>
              </div>
            </div>
            <button
              onClick={toggleAnonymous}
              className="relative w-12 h-7 rounded-full transition-colors flex-shrink-0"
              style={{ background: isAnonymous ? '#7c3aed' : '#d1d5db' }}
            >
              <motion.div
                className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm"
                animate={{ left: isAnonymous ? 'calc(100% - 24px)' : '4px' }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Intake summary (editable feel) */}
      {user && (
        <div className="px-5 mb-5">
          <h3 className="font-bold text-gray-500 text-xs uppercase tracking-wider mb-3">Your Preferences</h3>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
            {[
              { label: 'Reason for joining', value: user.reason },
              { label: 'Session preference', value: user.sessionType },
              { label: 'Language', value: user.language },
              { label: 'Coverage', value: user.coverage },
            ].filter(r => r.value).map(row => (
              <div key={row.label} className="flex items-center justify-between px-4 py-3">
                <span className="text-xs text-gray-400">{row.label}</span>
                <span className="text-sm font-medium text-gray-700 text-right max-w-[60%] truncate">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Liked counselors */}
      {state.liked.length > 0 && (
        <div className="px-5 mb-5">
          <h3 className="font-bold text-gray-500 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Heart size={12} className="text-violet-500" /> Counselors You Liked
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {COUNSELORS.filter(c => state.liked.includes(c.id)).map(c => (
              <div key={c.id} className="flex-shrink-0 text-center">
                <div
                  className={`w-14 h-14 rounded-2xl overflow-hidden ring-2 ${state.matches.includes(c.id) ? 'ring-violet-400' : 'ring-gray-200'}`}
                >
                  <img src={c.photo} alt={c.name} className="w-full h-full object-cover object-top" />
                </div>
                <p className="text-xs text-gray-500 mt-1 w-14 truncate">{c.name.split(' ')[0]}</p>
                {state.matches.includes(c.id) && (
                  <p className="text-xs text-violet-500 font-bold">Match ✓</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Crisis resources — always visible */}
      <div className="px-5 mb-5">
        <motion.div
          className="rounded-2xl overflow-hidden border border-red-100"
          style={{ background: 'linear-gradient(135deg, #fff1f2, #fff5f5)' }}
        >
          <button
            onClick={() => setShowCrisis(v => !v)}
            className="w-full flex items-center justify-between px-4 py-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">🆘</div>
              <div className="text-left">
                <p className="font-bold text-red-700 text-sm">Gambling Crisis Resources</p>
                <p className="text-red-400 text-xs">Immediate help is always available</p>
              </div>
            </div>
            <motion.div animate={{ rotate: showCrisis ? 90 : 0 }}>
              <ChevronRight size={16} className="text-red-300" />
            </motion.div>
          </button>

          <AnimatePresence>
            {showCrisis && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 space-y-2 border-t border-red-100 pt-3">
                  {CRISIS_LINES.map(r => (
                    <div key={r.name} className="bg-white/80 rounded-xl p-3 flex items-center gap-3">
                      <span className="text-xl flex-shrink-0">{r.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 text-sm">{r.name}</p>
                        <p className="text-red-600 font-bold text-sm">{r.contact}</p>
                        <p className="text-gray-400 text-xs">{r.note}</p>
                      </div>
                      <div className="flex-shrink-0">
                        {r.type === 'call' && <Phone size={16} className="text-red-400" />}
                        {r.type === 'text' && <MessageSquare size={16} className="text-red-400" />}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Settings menu */}
      <div className="px-5 mb-5">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 divide-y divide-gray-100">
          {[
            { icon: Bell, label: 'Notifications', sub: 'Session reminders & match alerts' },
            { icon: Shield, label: 'Privacy & Safety', sub: 'Control your data & visibility' },
            { icon: HelpCircle, label: 'Help & Support', sub: 'FAQs and contact us' },
          ].map(({ icon: Icon, label, sub }) => (
            <motion.button
              key={label}
              whileTap={{ backgroundColor: '#f5f0ff' }}
              className="w-full flex items-center gap-4 px-5 py-4 text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
                <Icon size={17} className="text-violet-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">{label}</p>
                <p className="text-gray-400 text-xs">{sub}</p>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Sign out */}
      <div className="px-5 pb-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-red-500 font-semibold bg-red-50 border border-red-100 active:bg-red-100 transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>

      <BottomNav />
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="flex-1 text-center">
      <p className="text-2xl font-bold text-violet-600">{value}</p>
      <p className="text-xs text-gray-400 mt-0.5">{label}</p>
    </div>
  );
}
