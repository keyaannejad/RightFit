import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { COUNSELORS } from '../data/counselors';

function Confetti() {
  const pieces = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.6,
    duration: 1.6 + Math.random() * 1.4,
    color: ['#7c3aed','#a855f7','#ec4899','#f59e0b','#10b981','#3b82f6','#f97316'][Math.floor(Math.random() * 7)],
    size: 5 + Math.random() * 9,
    shape: Math.random() > 0.5 ? 'rounded-full' : 'rounded-sm',
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {pieces.map(p => (
        <motion.div
          key={p.id}
          className={`absolute top-0 ${p.shape}`}
          style={{ left: `${p.x}%`, width: p.size, height: p.size, background: p.color }}
          initial={{ y: -20, opacity: 1, rotate: 0, scale: 1 }}
          animate={{ y: '110vh', opacity: 0, rotate: 720, scale: 0.5 }}
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
  const [step, setStep] = useState('celebrate'); // 'celebrate' | 'message'

  if (!counselor) return null;

  function dismiss() {
    dispatch({ type: 'CLEAR_ACTIVE_MATCH' });
  }

  function goToChat() {
    dispatch({ type: 'CLEAR_ACTIVE_MATCH' });
    navigate('/matches', { state: { openChatId: counselorId } });
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/75 backdrop-blur-sm px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Confetti />

      <AnimatePresence mode="wait">
        {step === 'celebrate' ? (
          <motion.div
            key="celebrate"
            className="bg-white rounded-3xl w-full max-w-sm overflow-hidden relative"
            initial={{ scale: 0.6, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24, delay: 0.1 }}
          >
            {/* Gradient header */}
            <div className="h-36 bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-600 flex flex-col items-center justify-center relative overflow-hidden">
              {/* Blobs */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2" />

              {/* Overlapping avatars */}
              <div className="flex items-center relative z-10">
                <div className="w-16 h-16 rounded-2xl border-3 border-white shadow-xl bg-violet-100 flex items-center justify-center text-3xl z-10">
                  {state.user?.avatar || '🧑'}
                </div>
                <motion.div
                  className="w-6 h-6 bg-white rounded-full flex items-center justify-center -mx-1 z-20 shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring', stiffness: 400 }}
                >
                  <span className="text-xs">💜</span>
                </motion.div>
                <div className="w-16 h-16 rounded-2xl border-3 border-white shadow-xl overflow-hidden">
                  <img src={counselor.photo} alt={counselor.name} className="w-full h-full object-cover object-top" />
                </div>
              </div>
            </div>

            <div className="px-6 pt-5 pb-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-center mb-4">
                  <div className="inline-block bg-violet-100 text-violet-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                    🎉 It's a Match!
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 leading-snug">
                    You and {counselor.name} connected!
                  </h2>
                  <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                    {counselor.name.split(' ')[0]} is ready to support your recovery journey.
                    Send a message to get started — it only takes a moment.
                  </p>
                </div>

                {/* Counselor quick info */}
                <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={counselor.photo} alt="" className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm">{counselor.name}</p>
                    <p className="text-violet-600 text-xs truncate">{counselor.title}</p>
                    <p className="text-gray-400 text-xs">Available {counselor.availability}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-green-600 font-bold text-sm">{counselor.successRate}%</div>
                    <div className="text-gray-400 text-xs">success</div>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <button
                    onClick={() => setStep('message')}
                    className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2 text-base"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
                  >
                    <MessageCircle size={19} />
                    Send a Message
                  </button>
                  <button
                    onClick={dismiss}
                    className="w-full py-3.5 rounded-2xl font-semibold text-gray-500 bg-gray-100 text-sm"
                  >
                    Keep Browsing
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="message"
            className="bg-white rounded-3xl w-full max-w-sm overflow-hidden relative"
            initial={{ scale: 0.95, opacity: 0, x: 40 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          >
            <div className="px-5 pt-5 pb-3 flex items-center gap-3 border-b border-gray-100">
              <button onClick={() => setStep('celebrate')} className="text-gray-400 hover:text-gray-600">
                ←
              </button>
              <div className="w-9 h-9 rounded-xl overflow-hidden">
                <img src={counselor.photo} alt="" className="w-full h-full object-cover object-top" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">{counselor.name}</p>
                <p className="text-green-500 text-xs font-medium">● Online now</p>
              </div>
            </div>

            <div className="px-5 py-4">
              <p className="text-gray-500 text-sm mb-4 text-center">
                Say hi! Here are some conversation starters:
              </p>
              <div className="space-y-2">
                {[
                  `Hi ${counselor.name.split(' ')[0]}! I'd love to learn more about your approach.`,
                  "What does a first session look like with you?",
                  "Do you have availability for a virtual intro call?",
                  "I saw your profile and think we'd be a great fit.",
                ].map(msg => (
                  <button
                    key={msg}
                    onClick={() => {
                      dispatch({
                        type: 'SEND_MESSAGE',
                        payload: { counselorId, message: { from: 'user', text: msg, ts: Date.now(), read: true } },
                      });
                      goToChat();
                    }}
                    className="w-full text-left px-4 py-3 rounded-xl border border-violet-200 bg-violet-50 text-violet-700 text-sm font-medium hover:bg-violet-100 transition-colors flex items-center justify-between gap-2"
                  >
                    <span>{msg}</span>
                    <ArrowRight size={14} className="flex-shrink-0 text-violet-400" />
                  </button>
                ))}
              </div>

              <button
                onClick={goToChat}
                className="w-full mt-4 py-3.5 rounded-2xl font-semibold text-gray-500 bg-gray-100 text-sm"
              >
                Write my own message →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* X to close */}
      <motion.button
        onClick={dismiss}
        className="mt-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
      >
        <X size={18} />
      </motion.button>
    </motion.div>
  );
}
