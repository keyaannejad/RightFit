import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers, MessageCircle, User, BarChart2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

const TABS = [
  { path: '/discover', icon: Layers,        label: 'Discover' },
  { path: '/matches',  icon: MessageCircle, label: 'Matches'  },
  { path: '/team',     icon: BarChart2,     label: 'Team'     },
  { path: '/profile',  icon: User,          label: 'Profile'  },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useApp();

  const unreadMatches = state.matches.length;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-gray-100">
      <div className="flex max-w-md mx-auto">
        {TABS.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path;
          const badge = path === '/matches' && unreadMatches > 0 ? unreadMatches : null;

          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="flex-1 flex flex-col items-center py-3 gap-1 relative"
            >
              <div className="relative">
                <Icon
                  size={22}
                  strokeWidth={active ? 2.5 : 2}
                  style={{ color: active ? '#7c3aed' : '#9ca3af' }}
                />
                {badge && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1.5 w-4 h-4 bg-violet-600 rounded-full flex items-center justify-center"
                  >
                    <span className="text-white font-bold leading-none" style={{ fontSize: 9 }}>{badge}</span>
                  </motion.div>
                )}
              </div>
              <span className="text-xs font-medium" style={{ color: active ? '#7c3aed' : '#9ca3af' }}>
                {label}
              </span>
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-violet-600"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
