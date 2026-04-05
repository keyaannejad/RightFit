import { useState } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Bell, Shield, HelpCircle, ChevronRight, Heart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { COUNSELORS } from '../data/counselors';
import BottomNav from '../components/BottomNav';

const MENU_ITEMS = [
  { icon: Bell, label: 'Notifications', sublabel: 'Manage alerts & reminders' },
  { icon: Shield, label: 'Privacy & Safety', sublabel: 'Control your data & visibility' },
  { icon: HelpCircle, label: 'Help & Support', sublabel: 'FAQs, crisis resources & more' },
];

export default function Profile() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [showResources, setShowResources] = useState(false);

  const user = state.user;
  const matchCount = state.matches.length;
  const likedCount = state.liked.length;

  function handleLogout() {
    dispatch({ type: 'RESET' });
    navigate('/');
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-violet-50 to-white pb-28">
      {/* Header */}
      <div className="px-5 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
      </div>

      {/* User card */}
      <div className="px-5 mb-6">
        <motion.div
          className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center text-4xl flex-shrink-0">
              {user?.avatar || '🧑'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user?.name || 'Guest'}</h2>
              <p className="text-violet-600 text-sm font-medium">Recovery Journey Member</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex mt-4 pt-4 border-t border-gray-100 divide-x divide-gray-100">
            <Stat label="Connected" value={likedCount} />
            <Stat label="Matched" value={matchCount} />
            <Stat label="Days active" value={1} />
          </div>
        </motion.div>
      </div>

      {/* Goals */}
      {user?.goals?.length > 0 && (
        <div className="px-5 mb-6">
          <h3 className="font-bold text-gray-700 text-sm mb-3 uppercase tracking-wide">Your Goals</h3>
          <div className="flex flex-wrap gap-2">
            {user.goals.map(g => (
              <span key={g} className="px-3 py-1.5 rounded-full text-sm font-medium bg-violet-100 text-violet-700">
                {g}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Liked counselors */}
      {state.liked.length > 0 && (
        <div className="px-5 mb-6">
          <h3 className="font-bold text-gray-700 text-sm mb-3 uppercase tracking-wide flex items-center gap-1.5">
            <Heart size={14} className="text-violet-500" /> Counselors You Liked
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {COUNSELORS.filter(c => state.liked.includes(c.id)).map(c => (
              <div key={c.id} className="flex-shrink-0 text-center">
                <div
                  className={`w-14 h-14 rounded-2xl overflow-hidden ring-2 ${state.matches.includes(c.id) ? 'ring-violet-400' : 'ring-gray-200'}`}
                >
                  <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                </div>
                <p className="text-xs text-gray-500 mt-1 w-14 truncate">{c.name.split(' ')[0]}</p>
                {state.matches.includes(c.id) && (
                  <p className="text-xs text-violet-500 font-medium">Match ✓</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Crisis resources */}
      <div className="px-5 mb-6">
        <motion.div
          className="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-2xl p-4"
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowResources(v => !v)}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-rose-700 text-sm">🆘 Crisis Resources</p>
              <p className="text-rose-500 text-xs mt-0.5">Immediate help is always available</p>
            </div>
            <ChevronRight
              size={16}
              className="text-rose-400 transition-transform"
              style={{ transform: showResources ? 'rotate(90deg)' : 'rotate(0deg)' }}
            />
          </div>

          {showResources && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 pt-3 border-t border-rose-200 space-y-2"
            >
              {[
                { name: 'SAMHSA Helpline', number: '1-800-662-4357', note: 'Free, 24/7' },
                { name: 'Crisis Text Line', number: 'Text HOME to 741741', note: 'Confidential' },
                { name: 'National Suicide Prevention', number: '988', note: 'Call or text' },
              ].map(r => (
                <div key={r.name} className="bg-white/70 rounded-xl p-3">
                  <p className="font-semibold text-gray-800 text-sm">{r.name}</p>
                  <p className="text-rose-600 font-bold text-sm">{r.number}</p>
                  <p className="text-gray-500 text-xs">{r.note}</p>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Menu */}
      <div className="px-5 mb-6">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 divide-y divide-gray-100">
          {MENU_ITEMS.map(({ icon: Icon, label, sublabel }) => (
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
                <p className="text-gray-400 text-xs">{sublabel}</p>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div className="px-5">
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
