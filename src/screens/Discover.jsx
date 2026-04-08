import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Heart, Info, RotateCcw, MapPin, Users, GraduationCap,
  Award, Languages as LanguagesIcon, Video, Calendar, User, Sparkles,
} from 'lucide-react';
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

  const displayName = state.anonymous ? 'Friend' : (state.user?.name || 'Friend');

  return (
    <div className="h-dvh flex flex-col bg-gradient-to-b from-violet-50 to-white overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-5 pb-3 screen-top flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold text-gray-900">RightFit <span>💜</span></h1>
          <p className="text-gray-400 text-xs">Hello, {displayName} ✨</p>
        </div>
        <button
          onClick={() => remaining[0] && setShowDetail(remaining[0])}
          disabled={!remaining[0]}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-500 disabled:opacity-30 active:scale-90 transition-transform"
        >
          <Info size={18} />
        </button>
      </div>

      {/* Card stack */}
      <div className="flex-1 min-h-0 relative px-3">
        {remaining.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <EmptyState
              onReset={handleReset}
              passed={state.passed.length}
              liked={state.liked.length}
            />
          </div>
        ) : (
          <div className="absolute inset-0">
            {remaining.slice(1, 3).map((c, i) => (
              <div
                key={c.id}
                className="absolute inset-0 pointer-events-none"
                style={{
                  transform: `scale(${0.96 - i * 0.03}) translateY(${(i + 1) * 10}px)`,
                  zIndex: 2 - i,
                  opacity: 0.6 - i * 0.2,
                }}
              >
                <div className="bg-white rounded-3xl h-full shadow-md" />
              </div>
            ))}
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
        <div className="flex-shrink-0 flex items-center justify-center gap-6 pt-3 pb-20">
          <motion.button
            onClick={() => handlePass(remaining[0]?.id)}
            whileTap={{ scale: 0.88 }}
            className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center text-red-400 border-2 border-red-100"
          >
            <X size={24} strokeWidth={2.5} />
          </motion.button>
          <motion.button
            onClick={handleReset}
            whileTap={{ scale: 0.88 }}
            className="w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center text-gray-400 border border-gray-100"
          >
            <RotateCcw size={16} />
          </motion.button>
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

      <AnimatePresence>
        {showDetail && (
          <DetailSheet
            counselor={showDetail}
            onClose={() => setShowDetail(null)}
            onLike={handleLike}
            onPass={handlePass}
          />
        )}
      </AnimatePresence>

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
      <p className="text-gray-400 text-sm mb-8">Check your matches or browse again to find your fit.</p>
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

function DetailSheet({ counselor, onClose, onLike }) {
  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-end bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white w-full rounded-t-3xl max-h-[92dvh] overflow-y-auto scroll-touch"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>
        <div className="relative h-44 mx-4 rounded-2xl overflow-hidden">
          <img src={counselor.photo} alt={counselor.name} className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4">
            <h3 className="text-white font-bold text-xl">{counselor.name}</h3>
            <p className="text-white/80 text-sm">{counselor.title}</p>
          </div>
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-xl px-2.5 py-1.5 flex items-center gap-1">
            <span className="text-yellow-400 text-sm">★</span>
            <span className="font-bold text-gray-800 text-sm">{counselor.rating}</span>
            <span className="text-gray-400 text-xs">({counselor.reviewCount})</span>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          <SheetSection icon={<MapPin size={16} className="text-violet-500" />} label="LOCATION">
            <p className="text-gray-700">{counselor.location}</p>
          </SheetSection>
          <SheetSection icon={<Users size={16} className="text-violet-500" />} label="EXPERIENCE & OUTCOMES">
            <div className="grid grid-cols-3 gap-3">
              <StatBox value={`${counselor.yearsExperience}y`} label="Experience" color="#7c3aed" />
              <StatBox value={`${counselor.successRate}%`} label="Success Rate" color="#22c55e" />
              <StatBox value={counselor.clientsHelped} label="Clients" color="#3b82f6" />
            </div>
          </SheetSection>
          <SheetSection icon={<GraduationCap size={16} className="text-violet-500" />} label="EDUCATION">
            <p className="text-gray-700">{counselor.education}</p>
          </SheetSection>
          <SheetSection icon={<Award size={16} className="text-violet-500" />} label="CERTIFICATIONS">
            <ul className="space-y-1.5">
              {counselor.certifications.map(c => (
                <li key={c} className="text-gray-700 text-sm flex gap-2">
                  <span className="text-violet-400 mt-0.5 flex-shrink-0">•</span>{c}
                </li>
              ))}
            </ul>
          </SheetSection>
          <SheetSection icon={<LanguagesIcon size={16} className="text-violet-500" />} label="LANGUAGES">
            <div className="flex flex-wrap gap-2">
              {counselor.languages.map(l => (
                <span key={l} className="px-3 py-1 rounded-full text-sm border border-blue-200 text-blue-600 bg-blue-50 font-medium">{l}</span>
              ))}
            </div>
          </SheetSection>
          <SheetSection icon={<Video size={16} className="text-violet-500" />} label="SESSION TYPES">
            <div className="flex flex-wrap gap-2">
              {counselor.sessionTypes.map(s => (
                <span key={s} className="px-3 py-1.5 rounded-full text-sm bg-purple-100 text-purple-700 font-medium">{s}</span>
              ))}
            </div>
          </SheetSection>
          <SheetSection icon={<Calendar size={16} className="text-violet-500" />} label="AVAILABILITY">
            <p className="text-gray-700">{counselor.availability}</p>
          </SheetSection>
          <SheetSection icon={<User size={16} className="text-violet-500" />} label="ABOUT">
            <p className="text-gray-600 text-sm leading-relaxed">{counselor.about}</p>
          </SheetSection>
          <SheetSection icon={<Sparkles size={16} className="text-violet-500" />} label="PERSONAL INTERESTS">
            <div className="flex flex-wrap gap-2">
              {counselor.interests.map(i => (
                <span key={i} className="px-3 py-1.5 rounded-full text-sm bg-gray-100 text-gray-700 border border-gray-200">{i}</span>
              ))}
            </div>
          </SheetSection>
        </div>

        <div className="px-5 pt-4 pb-8 space-y-3">
          <button
            onClick={() => { onLike(counselor.id); onClose(); }}
            className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2 text-base"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
          >
            <Heart size={18} fill="white" /> Connect with {counselor.name.split(' ')[0]}
          </button>
          <button
            onClick={onClose}
            className="w-full py-4 rounded-2xl font-bold text-white text-base"
            style={{ background: '#1a1a2e' }}
          >
            Close Profile
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SheetSection({ icon, label, children }) {
  return (
    <div className="px-5 py-4">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</span>
      </div>
      {children}
    </div>
  );
}

function StatBox({ value, label, color }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3 text-center">
      <div className="text-xl font-bold mb-0.5" style={{ color }}>{value}</div>
      <div className="text-gray-500 text-xs">{label}</div>
    </div>
  );
}
