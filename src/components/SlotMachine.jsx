import { useState, useRef, useCallback } from 'react';
import { motion, animate } from 'framer-motion';
import { COUNSELORS } from '../data/counselors';

const ITEM_H = 72;
const STRIP_LEN = 80;
const RESULT_IDX = 74; // item lands in center when this is the middle of the window
const FINAL_Y = -(RESULT_IDX - 1) * ITEM_H; // center that item in 3-item window

// Reel symbol sets for each reel column
const REEL_SYMS = [
  {
    provided: { emoji: '🏥', label: 'Covered' },
    private:  { emoji: '💼', label: 'Private' },
    noise:    ['🏥','💼','🏥','💼','💼','🏥','💼','🏥','💼','💼'],
  },
  {
    provided: { emoji: '💜', label: 'Matched' },
    private:  { emoji: '💰', label: 'Paid' },
    noise:    ['💜','💰','💰','💜','💰','💜','💰','💰','💜','💰'],
  },
  {
    provided: { emoji: '⭐', label: 'Free' },
    private:  { emoji: '💎', label: 'Premium' },
    noise:    ['⭐','💎','💎','⭐','💎','💎','⭐','💎','⭐','💎'],
  },
];

function makeStrip(noiseArr, resultEmoji) {
  const strip = Array.from({ length: STRIP_LEN }, (_, i) => noiseArr[i % noiseArr.length]);
  strip[RESULT_IDX] = resultEmoji;
  return strip;
}

function Reel({ strip, reelRef }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl flex-1"
      style={{
        height: ITEM_H * 3,
        background: 'linear-gradient(180deg, #0d0520 0%, #1a0533 100%)',
        border: '2px solid #5b21b6',
        boxShadow: 'inset 0 0 24px rgba(0,0,0,0.7), 0 0 8px rgba(124,58,237,0.3)',
      }}
    >
      {/* Top/bottom fade masks */}
      <div className="absolute inset-x-0 top-0 h-8 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, rgba(13,5,32,0.9) 0%, transparent 100%)' }} />
      <div className="absolute inset-x-0 bottom-0 h-8 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(0deg, rgba(13,5,32,0.9) 0%, transparent 100%)' }} />

      {/* Center row highlight */}
      <div className="absolute inset-x-0 z-10 pointer-events-none"
        style={{
          top: ITEM_H,
          height: ITEM_H,
          background: 'rgba(124,58,237,0.15)',
          borderTop: '2px solid rgba(168,85,247,0.8)',
          borderBottom: '2px solid rgba(168,85,247,0.8)',
        }}
      />

      {/* Scrolling strip */}
      <div ref={reelRef} style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
        {strip.map((emoji, i) => (
          <div key={i} className="flex items-center justify-center" style={{ height: ITEM_H }}>
            <span style={{ fontSize: 30, lineHeight: 1 }}>{emoji}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SlotMachine({ onResult }) {
  const [phase, setPhase] = useState('idle'); // idle | spinning | done
  const [strips, setStrips] = useState(() =>
    REEL_SYMS.map(r => makeStrip(r.noise, r.provided.emoji))
  );
  const [resultLabels, setResultLabels] = useState(null);
  const reelRefs = [useRef(null), useRef(null), useRef(null)];

  const spin = useCallback(async () => {
    if (phase === 'spinning') return;

    const outcome = Math.random() < 0.5 ? 'provided' : 'private';
    const counselor = COUNSELORS[Math.floor(Math.random() * COUNSELORS.length)];

    const newStrips = REEL_SYMS.map(r =>
      makeStrip(r.noise, outcome === 'provided' ? r.provided.emoji : r.private.emoji)
    );
    setStrips(newStrips);
    setResultLabels(null);
    setPhase('spinning');

    // Reset reels to top
    reelRefs.forEach(ref => {
      if (ref.current) ref.current.style.transform = 'translateY(0px)';
    });

    // Staggered stop: reel 0 stops first, reel 2 stops last (dramatic)
    const DURATIONS = [2.0, 2.5, 3.1];
    await Promise.all(
      reelRefs.map((ref, i) =>
        ref.current
          ? animate(ref.current, { y: FINAL_Y }, {
              duration: DURATIONS[i],
              ease: [0.12, 0, 0.08, 1],
            })
          : Promise.resolve()
      )
    );

    setResultLabels(REEL_SYMS.map(r => (outcome === 'provided' ? r.provided.label : r.private.label)));
    setPhase('done');

    setTimeout(() => {
      onResult(outcome, counselor);
    }, 700);
  }, [phase, onResult, reelRefs]);

  const isProvided = resultLabels && resultLabels[0] === 'Covered';

  return (
    <div className="flex flex-col items-center gap-5 w-full px-4">
      {/* Machine frame */}
      <div
        className="w-full rounded-3xl p-4"
        style={{
          background: 'linear-gradient(180deg, #2d1b69 0%, #0d0520 100%)',
          boxShadow: '0 8px 40px rgba(124,58,237,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
          border: '1px solid rgba(124,58,237,0.4)',
        }}
      >
        {/* Machine title */}
        <div className="text-center mb-4">
          <p className="text-violet-300 text-xs font-bold tracking-widest uppercase">RightFit Roulette</p>
        </div>

        {/* Reels row */}
        <div className="flex gap-2 mb-4">
          {strips.map((strip, i) => (
            <Reel key={i} strip={strip} reelRef={reelRefs[i]} />
          ))}
        </div>

        {/* Result labels row */}
        <div className="flex gap-2">
          {(resultLabels ?? REEL_SYMS.map(r => r.provided.label)).map((label, i) => (
            <div key={i} className="flex-1 text-center">
              <motion.span
                key={label + i + phase}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-bold"
                style={{ color: phase === 'done' ? (isProvided ? '#86efac' : '#fcd34d') : '#6d28d9' }}
              >
                {label}
              </motion.span>
            </div>
          ))}
        </div>
      </div>

      {/* Result banner */}
      {phase === 'done' && resultLabels && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full rounded-2xl px-5 py-3 text-center"
          style={{
            background: isProvided
              ? 'linear-gradient(135deg, #052e16, #14532d)'
              : 'linear-gradient(135deg, #431407, #7c2d12)',
          }}
        >
          <p className="font-bold text-base" style={{ color: isProvided ? '#86efac' : '#fed7aa' }}>
            {isProvided ? '🎉 Covered Counsellor!' : '💼 Private Therapist'}
          </p>
          <p className="text-xs mt-0.5" style={{ color: isProvided ? '#6ee7b7' : '#fdba74' }}>
            {isProvided ? 'Your session is covered — finding your match…' : 'Heads or tails decides your rate…'}
          </p>
        </motion.div>
      )}

      {/* Spin button */}
      <motion.button
        onClick={spin}
        disabled={phase === 'spinning'}
        whileTap={{ scale: 0.92 }}
        className="w-full py-4 rounded-2xl font-black text-xl text-white tracking-wide"
        style={{
          background: phase === 'spinning'
            ? '#374151'
            : 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
          boxShadow: phase !== 'spinning' ? '0 4px 20px rgba(220,38,38,0.5)' : 'none',
        }}
        animate={phase === 'spinning' ? {} : { scale: [1, 1.02, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        {phase === 'spinning' ? '🎰 Spinning…' : '🎰 SPIN'}
      </motion.button>
    </div>
  );
}
