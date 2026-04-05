import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { COUNSELORS } from '../data/counselors';

function Confetti() {
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.8,
    duration: 1.8 + Math.random() * 1.2,
    color: ['#7c3aed', '#a855f7', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'][Math.floor(Math.random() * 6)],
    size: 6 + Math.random() * 8,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {pieces.map(p => (
        <motion.div
          key={p.id}
          className="absolute top-0 rounded-sm"
          style={{ left: `${p.x}%`, width: p.size, height: p.size, background: p.color }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{ y: '110vh', opacity: 0, rotate: 720 }}
          transition={{ delay: p.delay, duration: p.duration, ease: 'linear' }}
        />
      ))}
    </div>
  );
}

export default function MatchModal({ counselorId }) {
  const { dispatch, state } = useApp();
  const navigate = useNavigate();
  const counselor = COUNSELORS.find(c => c.id === counselorId);

  if (!counselor) return null;

  function dismiss() {
    dispatch({ type: 'CLEAR_ACTIVE_MATCH' });
  }

  function sendMessage() {
    dispatch({ type: 'CLEAR_ACTIVE_MATCH' });
    navigate('/matches');
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Confetti />

      <motion.div
        className="bg-white rounded-3xl w-full max-w-sm p-8 text-center relative overflow-hidden"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.1 }}
      >
        {/* Close */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 active:scale-90 transition-transform"
        >
          <X size={16} />
        </button>

        {/* Avatars overlap */}
        <div className="flex items-center justify-center gap-0 mb-6">
          <div className="w-20 h-20 rounded-full border-4 border-white shadow-xl bg-violet-100 flex items-center justify-center text-4xl z-10">
            {state.user?.avatar || '🧑'}
          </div>
          <div className="w-20 h-20 rounded-full border-4 border-white shadow-xl overflow-hidden -ml-5">
            <img src={counselor.image} alt={counselor.name} className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="text-violet-600 text-sm font-bold uppercase tracking-widest mb-1">It's a Match!</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {counselor.name} wants to connect
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          You and {counselor.name.split(' ')[0]} are a great fit based on your goals and her expertise.
        </p>

        <div className="space-y-3">
          <button
            onClick={sendMessage}
            className="w-full py-3.5 rounded-2xl font-bold text-white flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
          >
            <MessageCircle size={18} />
            Send a Message
          </button>
          <button
            onClick={dismiss}
            className="w-full py-3.5 rounded-2xl font-semibold text-gray-600 bg-gray-100 active:bg-gray-200 transition-colors"
          >
            Keep Browsing
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
