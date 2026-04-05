import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ADDICTION_TYPES, GOALS } from '../data/counselors';

const AVATARS = ['🧑', '👩', '👨', '🧔', '👱', '🧕', '👩‍🦱', '👨‍🦱', '🧑‍🦰', '👩‍🦳'];

const TOTAL_STEPS = 4;

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
};

export default function Onboarding() {
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [form, setForm] = useState({
    name: '',
    avatar: '🧑',
    addictions: [],
    goals: [],
    type: 'seeker',
  });

  function goNext() {
    if (step < TOTAL_STEPS - 1) {
      setDirection(1);
      setStep(s => s + 1);
    } else {
      finish();
    }
  }

  function goBack() {
    if (step > 0) {
      setDirection(-1);
      setStep(s => s - 1);
    }
  }

  function finish() {
    dispatch({ type: 'SET_USER', payload: form });
    navigate('/discover');
  }

  function toggle(key, value) {
    setForm(f => {
      const arr = f[key];
      return {
        ...f,
        [key]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value],
      };
    });
  }

  const canProceed = [
    form.name.trim().length >= 2,
    form.addictions.length > 0,
    form.goals.length > 0,
    true, // avatar step always ok
  ][step];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-violet-50 to-white">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <button
          onClick={goBack}
          className={`w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-500 active:scale-90 transition-transform ${step === 0 ? 'opacity-0 pointer-events-none' : ''}`}
        >
          <ChevronLeft size={20} />
        </button>

        {/* Progress dots */}
        <div className="flex gap-2">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <motion.div
              key={i}
              className="h-2 rounded-full"
              animate={{
                width: i === step ? 24 : 8,
                backgroundColor: i <= step ? '#7c3aed' : '#e5e7eb',
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>

        <div className="w-10" />
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-hidden relative px-5">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 px-5 py-4 overflow-y-auto"
          >
            {step === 0 && <StepName form={form} setForm={setForm} />}
            {step === 1 && <StepAddiction form={form} toggle={toggle} />}
            {step === 2 && <StepGoals form={form} toggle={toggle} />}
            {step === 3 && <StepAvatar form={form} setForm={setForm} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer CTA */}
      <div className="px-5 pb-10 pt-4">
        <motion.button
          onClick={goNext}
          disabled={!canProceed}
          className="w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all"
          style={{
            background: canProceed ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : '#e5e7eb',
            color: canProceed ? 'white' : '#9ca3af',
          }}
          whileTap={canProceed ? { scale: 0.97 } : {}}
        >
          {step < TOTAL_STEPS - 1 ? 'Continue' : "Let's go →"}
        </motion.button>
      </div>
    </div>
  );
}

function StepName({ form, setForm }) {
  return (
    <div className="pt-4">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <span className="text-4xl">👋</span>
        <h2 className="text-3xl font-bold text-gray-900 mt-3 mb-2">What should we call you?</h2>
        <p className="text-gray-500 text-base mb-8">This is your safe space. You can use a nickname or first name only.</p>
        <input
          type="text"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          placeholder="Your name or nickname"
          maxLength={30}
          autoFocus
          className="w-full bg-white border-2 border-violet-200 focus:border-violet-500 rounded-2xl px-5 py-4 text-lg text-gray-900 outline-none transition-colors placeholder-gray-300"
        />
        <p className="text-gray-400 text-sm mt-3">
          🔒 Your personal information is never shared with counselors without your permission.
        </p>
      </motion.div>
    </div>
  );
}

function StepAddiction({ form, toggle }) {
  return (
    <div className="pt-4">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <span className="text-4xl">💙</span>
        <h2 className="text-3xl font-bold text-gray-900 mt-3 mb-2">What brings you here?</h2>
        <p className="text-gray-500 text-base mb-6">Select all that apply. This helps us find counselors with the right expertise.</p>
        <div className="grid grid-cols-2 gap-3">
          {ADDICTION_TYPES.map(({ id, label, icon }) => {
            const selected = form.addictions.includes(id);
            return (
              <motion.button
                key={id}
                onClick={() => toggle('addictions', id)}
                whileTap={{ scale: 0.95 }}
                className="relative flex flex-col items-center gap-2 py-4 px-3 rounded-2xl border-2 text-center transition-all"
                style={{
                  borderColor: selected ? '#7c3aed' : '#e5e7eb',
                  background: selected ? '#f5f0ff' : 'white',
                }}
              >
                {selected && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-violet-600 rounded-full flex items-center justify-center">
                    <Check size={11} className="text-white" />
                  </div>
                )}
                <span className="text-3xl">{icon}</span>
                <span className={`text-sm font-semibold ${selected ? 'text-violet-700' : 'text-gray-700'}`}>{label}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

function StepGoals({ form, toggle }) {
  return (
    <div className="pt-4">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <span className="text-4xl">🎯</span>
        <h2 className="text-3xl font-bold text-gray-900 mt-3 mb-2">What are your goals?</h2>
        <p className="text-gray-500 text-base mb-6">Your goals shape the kind of support you need. Pick any that resonate.</p>
        <div className="space-y-3">
          {GOALS.map(({ id, label }) => {
            const selected = form.goals.includes(id);
            return (
              <motion.button
                key={id}
                onClick={() => toggle('goals', id)}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-between py-4 px-5 rounded-2xl border-2 text-left transition-all"
                style={{
                  borderColor: selected ? '#7c3aed' : '#e5e7eb',
                  background: selected ? '#f5f0ff' : 'white',
                }}
              >
                <span className={`font-semibold ${selected ? 'text-violet-700' : 'text-gray-700'}`}>{label}</span>
                <div
                  className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                  style={{
                    borderColor: selected ? '#7c3aed' : '#d1d5db',
                    background: selected ? '#7c3aed' : 'transparent',
                  }}
                >
                  {selected && <Check size={13} className="text-white" />}
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

function StepAvatar({ form, setForm }) {
  return (
    <div className="pt-4">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <span className="text-4xl">🎨</span>
        <h2 className="text-3xl font-bold text-gray-900 mt-3 mb-2">Choose your avatar</h2>
        <p className="text-gray-500 text-base mb-8">Pick an emoji that represents you on this journey.</p>

        <div className="w-24 h-24 bg-violet-100 rounded-3xl flex items-center justify-center text-5xl mx-auto mb-8 shadow-sm">
          {form.avatar}
        </div>

        <div className="grid grid-cols-5 gap-3">
          {AVATARS.map(emoji => (
            <motion.button
              key={emoji}
              onClick={() => setForm(f => ({ ...f, avatar: emoji }))}
              whileTap={{ scale: 0.85 }}
              className="h-14 rounded-2xl text-3xl flex items-center justify-center transition-all"
              style={{
                background: form.avatar === emoji ? '#f5f0ff' : 'white',
                border: `2px solid ${form.avatar === emoji ? '#7c3aed' : '#e5e7eb'}`,
              }}
            >
              {emoji}
            </motion.button>
          ))}
        </div>

        <p className="text-center text-gray-400 text-sm mt-6">
          You're almost there, {form.name || 'friend'} 🌟
        </p>
      </motion.div>
    </div>
  );
}
