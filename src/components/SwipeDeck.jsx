import { useState, useCallback } from 'react';
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from 'framer-motion';
import { MapPin, Video, Building2, Clock, Languages, Star, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { COUNSELORS } from '../data/counselors';
import DotPagination from './DotPagination';

export default function SwipeDeck({ answers, onBack }) {
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState([]);
  const [passed, setPassed] = useState([]);
  const [showDetail, setShowDetail] = useState(false);
  const [match, setMatch] = useState(null);

  const remaining = COUNSELORS.filter(c => !liked.includes(c.id) && !passed.includes(c.id));
  const current = remaining[0];

  function handleLike(id) {
    setLiked(l => [...l, id]);
    const isMatch = Math.random() > 0.3;
    if (isMatch) setMatch(COUNSELORS.find(c => c.id === id));
  }

  function handlePass(id) {
    setPassed(p => [...p, id]);
  }

  function goNext() {
    if (current) handlePass(current.id);
  }

  function goPrev() {
    if (index > 0) setIndex(i => i - 1);
    else onBack();
  }

  const allCounselors = COUNSELORS;
  const currentGlobalIdx = allCounselors.findIndex(c => c.id === current?.id);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4 relative">
      {/* Prev arrow */}
      <button
        onClick={goPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-500 hover:shadow-lg z-20 text-xl"
      >
        ‹
      </button>
      {/* Next arrow */}
      <button
        onClick={goNext}
        disabled={!current}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-500 hover:shadow-lg z-20 disabled:opacity-30 text-xl"
      >
        ›
      </button>

      {remaining.length === 0 ? (
        <EmptyState onReset={() => { setLiked([]); setPassed([]); }} liked={liked.length} />
      ) : (
        <>
          <div className="relative" style={{ width: 320, height: 480 }}>
            {/* Stack shadows */}
            {remaining.slice(1, 3).map((c, i) => (
              <div
                key={c.id}
                className="absolute inset-0 bg-white rounded-3xl card-shadow pointer-events-none"
                style={{
                  transform: `scale(${0.96 - i * 0.03}) translateY(${(i + 1) * 10}px)`,
                  zIndex: 1 - i,
                  opacity: 0.7 - i * 0.2,
                }}
              />
            ))}

            {/* Top card */}
            <AnimatePresence>
              {current && (
                <SwipeCard
                  key={current.id}
                  counselor={current}
                  onLike={handleLike}
                  onPass={handlePass}
                  onTap={() => setShowDetail(true)}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Dot pagination */}
          <div className="mt-8">
            <DotPagination
              total={COUNSELORS.length}
              current={Math.max(0, currentGlobalIdx)}
            />
            <p className="text-center text-gray-400 text-sm mt-3">Swipe left or right to browse counselors</p>
          </div>
        </>
      )}

      {/* Detail modal */}
      <AnimatePresence>
        {showDetail && current && (
          <DetailSheet counselor={current} onClose={() => setShowDetail(false)} onLike={handleLike} onPass={handlePass} />
        )}
      </AnimatePresence>

      {/* Match modal */}
      <AnimatePresence>
        {match && <MatchModal counselor={match} onDismiss={() => setMatch(null)} />}
      </AnimatePresence>
    </div>
  );
}

function SwipeCard({ counselor, onLike, onPass, onTap }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const likeOpacity = useTransform(x, [30, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, -30], [1, 0]);

  function handleDragEnd(_, info) {
    if (info.offset.x > 100) {
      animate(x, 600, { duration: 0.3, onComplete: () => onLike(counselor.id) });
    } else if (info.offset.x < -100) {
      animate(x, -600, { duration: 0.3, onComplete: () => onPass(counselor.id) });
    } else {
      animate(x, 0, { type: 'spring', stiffness: 400, damping: 30 });
    }
  }

  return (
    <motion.div
      className="absolute inset-0 swipe-card cursor-grab active:cursor-grabbing"
      style={{ x, rotate, zIndex: 10 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      onClick={onTap}
    >
      {/* CONNECT stamp */}
      <motion.div
        className="absolute top-5 left-4 z-20 border-4 border-green-500 text-green-500 font-black text-lg px-3 py-1 rounded-xl -rotate-12 select-none"
        style={{ opacity: likeOpacity }}
      >
        CONNECT
      </motion.div>
      {/* SKIP stamp */}
      <motion.div
        className="absolute top-5 right-4 z-20 border-4 border-red-400 text-red-400 font-black text-lg px-3 py-1 rounded-xl rotate-12 select-none"
        style={{ opacity: nopeOpacity }}
      >
        SKIP
      </motion.div>

      <div className="w-full h-full bg-white rounded-3xl card-shadow overflow-hidden select-none">
        {/* Photo */}
        <div className="relative" style={{ height: 380 }}>
          <img
            src={counselor.photo}
            alt={counselor.name}
            className="w-full h-full object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Name + age */}
        <div className="px-5 py-4 flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">{counselor.name}</span>
          <span className="text-xl text-gray-500">{counselor.age}</span>
        </div>
      </div>
    </motion.div>
  );
}

function DetailSheet({ counselor, onClose, onLike, onPass }) {
  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-end bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white w-full max-w-md mx-auto rounded-t-3xl max-h-[88vh] overflow-y-auto"
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

        {/* Photo header */}
        <div className="relative h-48 mx-4 rounded-2xl overflow-hidden">
          <img src={counselor.photo} alt={counselor.name} className="w-full h-full object-cover object-top" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 p-4">
            <div className="text-white font-bold text-xl">{counselor.name}, {counselor.age}</div>
            <div className="text-white/80 text-sm">{counselor.title}</div>
          </div>
        </div>

        <div className="px-5 py-5 space-y-0 divide-y divide-gray-100">
          <DetailSection icon="📍" label="LOCATION">
            <p className="text-gray-700">{counselor.location}</p>
          </DetailSection>

          <DetailSection icon="👥" label="EXPERIENCE & SUCCESS">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <StatBox value={`${counselor.yearsExperience}`} label="Years Experience" color="#374151" />
              <StatBox value={`${counselor.successRate}%`} label="Success Rate" color="#22c55e" />
            </div>
            <StatBox value={`${counselor.clientsHelped}`} label="Clients Helped" color="#3b82f6" />
          </DetailSection>

          <DetailSection icon="🎓" label="EDUCATION">
            <p className="text-gray-700">{counselor.education}</p>
          </DetailSection>

          <DetailSection icon="🏅" label="CERTIFICATIONS">
            <ul className="space-y-1">
              {counselor.certifications.map(c => (
                <li key={c} className="text-gray-700 flex gap-2"><span>•</span>{c}</li>
              ))}
            </ul>
          </DetailSection>

          <DetailSection icon="🌐" label="LANGUAGES">
            <div className="flex flex-wrap gap-2">
              {counselor.languages.map(l => (
                <span key={l} className="px-3 py-1 rounded-full text-sm border border-blue-200 text-blue-600 bg-blue-50">{l}</span>
              ))}
            </div>
          </DetailSection>

          <DetailSection icon="📹" label="SESSION TYPES">
            <div className="flex flex-wrap gap-2">
              {counselor.sessionTypes.map(s => (
                <span key={s} className="px-3 py-1.5 rounded-full text-sm bg-purple-100 text-purple-700 font-medium">{s}</span>
              ))}
            </div>
          </DetailSection>

          <DetailSection icon="📅" label="AVAILABILITY">
            <p className="text-gray-700">{counselor.availability}</p>
          </DetailSection>

          <DetailSection icon="" label="ABOUT">
            <p className="text-gray-600 leading-relaxed text-sm">{counselor.about}</p>
          </DetailSection>

          <DetailSection icon="" label="PERSONAL INTERESTS">
            <div className="flex flex-wrap gap-2">
              {counselor.interests.map(i => (
                <span key={i} className="px-3 py-1.5 rounded-full text-sm bg-gray-100 text-gray-700 border border-gray-200">{i}</span>
              ))}
            </div>
          </DetailSection>
        </div>

        {/* Close button */}
        <div className="px-5 pb-8 pt-2">
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

function DetailSection({ icon, label, children }) {
  return (
    <div className="py-4">
      <div className="flex items-center gap-2 mb-3">
        {icon && <span className="text-[#f97316]">{icon}</span>}
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</span>
      </div>
      {children}
    </div>
  );
}

function StatBox({ value, label, color }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3">
      <div className="text-2xl font-bold mb-0.5" style={{ color }}>{value}</div>
      <div className="text-gray-500 text-xs">{label}</div>
    </div>
  );
}

function MatchModal({ counselor, onDismiss }) {
  const pieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.6,
    dur: 1.5 + Math.random() * 1,
    color: ['#f97316','#22c55e','#3b82f6','#a855f7','#ec4899'][Math.floor(Math.random()*5)],
    size: 6 + Math.random() * 8,
  }));

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {pieces.map(p => (
          <motion.div
            key={p.id}
            className="absolute top-0 rounded-sm"
            style={{ left: `${p.x}%`, width: p.size, height: p.size, background: p.color }}
            initial={{ y: -20, opacity: 1, rotate: 0 }}
            animate={{ y: '110vh', opacity: 0, rotate: 720 }}
            transition={{ delay: p.delay, duration: p.dur, ease: 'linear' }}
          />
        ))}
      </div>

      <motion.div
        className="bg-white rounded-3xl w-full max-w-sm p-7 text-center"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <div className="text-5xl mb-3">🎉</div>
        <div className="text-[#f97316] font-bold uppercase tracking-widest text-sm mb-1">It's a Match!</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{counselor.name} wants to connect</h2>
        <p className="text-gray-500 text-sm mb-6">You're one step closer to finding the right support.</p>
        <div className="space-y-3">
          <button
            className="w-full py-3.5 rounded-2xl font-bold text-white"
            style={{ background: '#f97316' }}
            onClick={onDismiss}
          >
            Send a Message
          </button>
          <button
            className="w-full py-3.5 rounded-2xl font-semibold text-gray-600 bg-gray-100"
            onClick={onDismiss}
          >
            Keep Browsing
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function EmptyState({ onReset, liked }) {
  return (
    <div className="text-center px-6">
      <div className="text-6xl mb-4">🌟</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">You've seen everyone!</h2>
      <p className="text-gray-500 mb-6">You connected with <strong className="text-[#f97316]">{liked}</strong> counselor{liked !== 1 ? 's' : ''}.</p>
      <button onClick={onReset} className="px-8 py-3.5 rounded-full font-bold text-white" style={{ background: '#f97316' }}>
        Browse Again
      </button>
    </div>
  );
}
