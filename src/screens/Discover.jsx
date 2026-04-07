import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Users, GraduationCap, Award, Languages as LanguagesIcon, Video, Calendar, User, Sparkles, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import SlotMachine from '../components/SlotMachine';
import CoinFlip from '../components/CoinFlip';
import MatchModal from '../components/MatchModal';
import BottomNav from '../components/BottomNav';

export default function Discover() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [coinFlipCounselor, setCoinFlipCounselor] = useState(null);
  const [showDetail, setShowDetail] = useState(null);

  const handleResult = useCallback((outcome, counselor) => {
    if (outcome === 'provided') {
      // Directly match — trigger match modal
      dispatch({ type: 'LIKE_COUNSELOR', payload: counselor.id });
    } else {
      // Private therapist — show coin flip
      setCoinFlipCounselor(counselor);
    }
  }, [dispatch]);

  function handleCoinFlipClose() {
    const c = coinFlipCounselor;
    setCoinFlipCounselor(null);
    if (c) dispatch({ type: 'LIKE_COUNSELOR', payload: c.id });
  }

  return (
    <div className="h-dvh flex flex-col overflow-hidden" style={{ background: 'linear-gradient(180deg, #0d0520 0%, #1a0533 60%, #2d1b69 100%)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 pb-3 screen-top flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white">
            RightFit <span>💜</span>
          </h1>
          {state.user && (
            <p className="text-violet-300 text-xs">Hello, {state.user.name} ✨</p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/matches')}
            className="px-3 py-1.5 rounded-full text-xs font-bold text-violet-300 border border-violet-700"
          >
            My Matches
          </button>
        </div>
      </div>

      {/* Slot machine — fills remaining space */}
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center pb-24 overflow-hidden">
        <SlotMachine onResult={handleResult} />
      </div>

      {/* Coin flip modal */}
      <AnimatePresence>
        {coinFlipCounselor && (
          <CoinFlip counselor={coinFlipCounselor} onClose={handleCoinFlipClose} />
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
    <div className="bg-gray-50 rounded-xl p-3">
      <div className="text-2xl font-bold mb-0.5" style={{ color }}>{value}</div>
      <div className="text-gray-500 text-xs">{label}</div>
    </div>
  );
}
