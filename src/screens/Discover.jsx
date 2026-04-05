import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Info, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { COUNSELORS } from '../data/counselors';
import SwipeCard from '../components/SwipeCard';
import MatchModal from '../components/MatchModal';
import BottomNav from '../components/BottomNav';

export default function Discover() {
  const { state, dispatch } = useApp();
  const [showDetail, setShowDetail] = useState(null);

  const remaining = COUNSELORS.filter(
    c => !state.liked.includes(c.id) && !state.passed.includes(c.id)
  );

  const handleLike = useCallback((id) => {
    dispatch({ type: 'LIKE_COUNSELOR', payload: id });
  }, [dispatch]);

  const handlePass = useCallback((id) => {
    dispatch({ type: 'PASS_COUNSELOR', payload: id });
  }, [dispatch]);

  function handleReset() {
    dispatch({ type: 'RESET' });
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-violet-50 to-white">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            RightFit <span className="text-2xl">💜</span>
          </h1>
          {state.user && (
            <p className="text-gray-400 text-sm">Hello, {state.user.name} ✨</p>
          )}
        </div>
        <button
          onClick={() => setShowDetail(remaining[0])}
          disabled={!remaining[0]}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-500 disabled:opacity-30 active:scale-90 transition-transform"
        >
          <Info size={18} />
        </button>
      </div>

      {/* Card stack */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 pb-4 relative">
        {remaining.length === 0 ? (
          <EmptyState onReset={handleReset} passed={state.passed.length} liked={state.liked.length} />
        ) : (
          <div className="relative w-full max-w-sm h-[520px]">
            {/* Render bottom 2 cards as decorative stack */}
            {remaining.slice(1, 3).map((c, i) => (
              <div
                key={c.id}
                className="absolute inset-0 pointer-events-none"
                style={{
                  transform: `scale(${0.96 - i * 0.03}) translateY(${(i + 1) * 10}px)`,
                  zIndex: 2 - i,
                  opacity: 1 - i * 0.2,
                }}
              >
                <div className="bg-white rounded-3xl card-shadow h-full" />
              </div>
            ))}

            {/* Top swipeable card */}
            <div className="absolute inset-0" style={{ zIndex: 10 }}>
              <AnimatePresence>
                {remaining[0] && (
                  <SwipeCard
                    key={remaining[0].id}
                    counselor={remaining[0]}
                    onLike={handleLike}
                    onPass={handlePass}
                    isTop
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      {remaining.length > 0 && (
        <div className="flex items-center justify-center gap-5 pb-28">
          {/* Pass */}
          <motion.button
            onClick={() => handlePass(remaining[0]?.id)}
            whileTap={{ scale: 0.88 }}
            className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center text-red-400 border-2 border-red-100 active:bg-red-50 transition-colors"
          >
            <X size={24} strokeWidth={2.5} />
          </motion.button>

          {/* Undo */}
          <motion.button
            onClick={handleReset}
            whileTap={{ scale: 0.88 }}
            className="w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center text-gray-400 border border-gray-100"
          >
            <RotateCcw size={16} />
          </motion.button>

          {/* Like */}
          <motion.button
            onClick={() => handleLike(remaining[0]?.id)}
            whileTap={{ scale: 0.88 }}
            className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
          >
            <Heart size={24} strokeWidth={2.5} fill="white" />
          </motion.button>
        </div>
      )}

      {/* Detail modal */}
      <AnimatePresence>
        {showDetail && (
          <DetailModal counselor={showDetail} onClose={() => setShowDetail(null)} onLike={handleLike} onPass={handlePass} />
        )}
      </AnimatePresence>

      {/* Match modal */}
      <AnimatePresence>
        {state.activeMatch && <MatchModal counselorId={state.activeMatch} />}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}

function EmptyState({ onReset, passed, liked }) {
  return (
    <motion.div
      className="text-center px-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="text-6xl mb-4">🌟</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">You've seen everyone!</h2>
      <p className="text-gray-500 mb-2">
        You connected with <strong className="text-violet-600">{liked}</strong> counselor{liked !== 1 ? 's' : ''} and skipped {passed}.
      </p>
      <p className="text-gray-400 text-sm mb-8">Check your matches or browse again to explore more options.</p>
      <button
        onClick={onReset}
        className="px-8 py-3.5 rounded-2xl font-bold text-white"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
      >
        Browse Again
      </button>
    </motion.div>
  );
}

function DetailModal({ counselor, onClose, onLike, onPass }) {
  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-end bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white w-full rounded-t-3xl max-h-[90vh] overflow-y-auto"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className={`h-32 bg-gradient-to-br ${counselor.slideColor} mx-4 rounded-2xl flex items-end p-4`}>
          <div className="w-16 h-16 rounded-xl bg-white shadow-lg overflow-hidden">
            <img src={counselor.image} alt={counselor.name} className="w-full h-full object-cover" />
          </div>
          <div className="ml-3">
            <h3 className="text-white font-bold text-lg">{counselor.name}</h3>
            <p className="text-white/80 text-sm">{counselor.title}</p>
          </div>
        </div>

        <div className="px-5 py-5 space-y-5">
          <p className="text-gray-600 leading-relaxed">{counselor.bio}</p>

          <Section title="Specializations">
            <div className="flex flex-wrap gap-2">
              {counselor.specializations.map(s => (
                <span key={s} className="text-sm px-3 py-1.5 rounded-full font-medium"
                  style={{ background: `${counselor.accentColor}18`, color: counselor.accentColor }}>
                  {s}
                </span>
              ))}
            </div>
          </Section>

          <Section title="Therapeutic Approaches">
            <div className="flex flex-wrap gap-2">
              {counselor.approaches.map(a => (
                <span key={a} className="text-sm px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 font-medium">{a}</span>
              ))}
            </div>
          </Section>

          <Section title="Details">
            <div className="grid grid-cols-2 gap-3">
              <DetailRow label="Experience" value={`${counselor.yearsExperience} years`} />
              <DetailRow label="Languages" value={counselor.languages.join(', ')} />
              <DetailRow label="Session Cost" value={`$${counselor.sessionCost}/session`} />
              <DetailRow label="Availability" value={counselor.availability} />
              <DetailRow label="Format" value={[counselor.remote && 'Online', counselor.inPerson && 'In-person'].filter(Boolean).join(' & ')} />
              <DetailRow label="Reviews" value={`${counselor.reviewCount} reviews`} />
            </div>
          </Section>

          <Section title="Insurance Accepted">
            <div className="flex flex-wrap gap-2">
              {counselor.insurance.map(ins => (
                <span key={ins} className="text-sm bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg text-gray-600">{ins}</span>
              ))}
            </div>
          </Section>

          {/* Action buttons */}
          <div className="flex gap-3 pb-4">
            <button
              onClick={() => { onPass(counselor.id); onClose(); }}
              className="flex-1 py-3.5 rounded-2xl border-2 border-red-200 text-red-500 font-bold flex items-center justify-center gap-2"
            >
              <X size={18} /> Skip
            </button>
            <button
              onClick={() => { onLike(counselor.id); onClose(); }}
              className="flex-1 py-3.5 rounded-2xl font-bold text-white flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
            >
              <Heart size={18} fill="white" /> Connect
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h4 className="font-bold text-gray-900 mb-2.5">{title}</h4>
      {children}
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3">
      <div className="text-xs text-gray-400 mb-0.5">{label}</div>
      <div className="text-sm font-semibold text-gray-800">{value}</div>
    </div>
  );
}
