import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CoinFlip({ counselor, onClose }) {
  const [phase, setPhase] = useState('ready'); // ready | flipping | heads | tails
  const [rotations, setRotations] = useState(0);

  function flip() {
    if (phase === 'flipping') return;
    const isHeads = Math.random() < 0.5;
    // Heads = even multiples of 180 (0°, 360°…); Tails = odd (180°, 540°…)
    // Spin 6 full rotations + final face
    const extra = isHeads ? 0 : 180;
    const finalRot = rotations + 360 * 6 + extra;
    setRotations(finalRot);
    setPhase('flipping');
    setTimeout(() => setPhase(isHeads ? 'heads' : 'tails'), 2600);
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.85)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full mx-5 rounded-3xl overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #1a0533 0%, #0d0520 100%)', border: '1px solid rgba(124,58,237,0.4)' }}
      >
        {/* Header */}
        <div className="px-6 pt-7 pb-2 text-center">
          <p className="text-violet-300 text-xs font-bold tracking-widest uppercase mb-1">Double or Nothing</p>
          <h2 className="text-white font-black text-2xl">Coin Flip</h2>
          <p className="text-violet-300 text-sm mt-1">
            <span className="text-green-400 font-bold">Heads</span> = free first session &nbsp;·&nbsp;
            <span className="text-red-400 font-bold">Tails</span> = double rate, charged now
          </p>
        </div>

        {/* Coin */}
        <div className="flex justify-center py-8">
          <div style={{ perspective: 600 }}>
            <motion.div
              style={{
                width: 140,
                height: 140,
                transformStyle: 'preserve-3d',
                position: 'relative',
              }}
              animate={{ rotateY: rotations }}
              transition={{ duration: 2.4, ease: [0.2, 0, 0.1, 1] }}
            >
              {/* Heads face */}
              <div
                style={{
                  position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexDirection: 'column',
                  boxShadow: '0 0 30px rgba(251,191,36,0.5)',
                  border: '4px solid #fcd34d',
                }}
              >
                <span style={{ fontSize: 40 }}>🤝</span>
                <span style={{ color: '#7c2d12', fontWeight: 900, fontSize: 12, letterSpacing: 2 }}>HEADS</span>
              </div>

              {/* Tails face */}
              <div
                style={{
                  position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #9ca3af, #6b7280, #4b5563)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexDirection: 'column',
                  boxShadow: '0 0 30px rgba(107,114,128,0.4)',
                  border: '4px solid #9ca3af',
                }}
              >
                <span style={{ fontSize: 40 }}>💸</span>
                <span style={{ color: '#f1f5f9', fontWeight: 900, fontSize: 12, letterSpacing: 2 }}>TAILS</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Result */}
        <AnimatePresence mode="wait">
          {phase === 'heads' && (
            <motion.div
              key="heads"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-5 mb-5 rounded-2xl px-5 py-4 text-center"
              style={{ background: 'linear-gradient(135deg, #052e16, #14532d)' }}
            >
              <p className="text-green-300 font-black text-lg">🎉 Heads! You pay nothing.</p>
              <p className="text-green-400 text-sm mt-1">
                Your first session with {counselor?.name.split(' ')[0]} is completely free.
              </p>
              <button
                onClick={onClose}
                className="mt-4 w-full py-3 rounded-xl font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
              >
                Start My Free Session →
              </button>
            </motion.div>
          )}

          {phase === 'tails' && (
            <motion.div
              key="tails"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-5 mb-5 rounded-2xl px-5 py-4 text-center"
              style={{ background: 'linear-gradient(135deg, #450a0a, #7f1d1d)' }}
            >
              <p className="text-red-300 font-black text-lg">💸 Tails. Double rate.</p>
              <div
                className="mt-3 rounded-xl px-4 py-3"
                style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.4)' }}
              >
                <p className="text-red-200 font-bold text-base">$480.00 charged</p>
                <p className="text-red-300 text-xs mt-0.5">Card ending in 4242 · Processed</p>
                <p className="text-red-400 text-xs mt-2">
                  You are now committed to this session. Opting out is not available.
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-4 w-full py-3 rounded-xl font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}
              >
                Proceed to Session →
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Flip button */}
        {(phase === 'ready' || phase === 'flipping') && (
          <div className="px-5 pb-7">
            <motion.button
              onClick={flip}
              disabled={phase === 'flipping'}
              whileTap={{ scale: 0.92 }}
              className="w-full py-4 rounded-2xl font-black text-xl text-white"
              style={{
                background: phase === 'flipping'
                  ? '#374151'
                  : 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                color: phase === 'flipping' ? '#9ca3af' : '#1a0533',
              }}
            >
              {phase === 'flipping' ? 'Flipping…' : '🪙 Flip the Coin'}
            </motion.button>
            <p className="text-center text-violet-400 text-xs mt-3">
              Private therapist session · {counselor?.name}
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
