import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Check, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';

// Blueprint Q1–6 (gambling-specific) + name + avatar = 8 steps
const STEPS = [
  {
    id: 'name',
    type: 'text',
    emoji: '👋',
    headline: 'What should we call you?',
    sub: 'A first name or nickname is fine. You can always stay anonymous.',
    placeholder: 'Your name or nickname',
    privacy: true,
  },
  {
    id: 'reason',
    type: 'single',
    emoji: '💙',
    headline: 'What brings you here today?',
    sub: 'This helps us find counselors with the right expertise.',
    options: [
      { label: 'I think I have a gambling problem', icon: '🎲' },
      { label: 'I want to cut back on gambling', icon: '📉' },
      { label: 'I\'m struggling and need help now', icon: '🆘' },
      { label: 'Someone I love has a gambling problem', icon: '❤️' },
    ],
  },
  {
    id: 'duration',
    type: 'single',
    emoji: '🕐',
    headline: 'How long has gambling been a concern?',
    sub: 'There\'s no wrong answer — this helps us match you better.',
    options: [
      { label: 'Just recently noticed', icon: '🌱' },
      { label: 'A few months', icon: '📅' },
      { label: '1–2 years', icon: '📆' },
      { label: 'Several years or more', icon: '⏳' },
    ],
  },
  {
    id: 'priorHelp',
    type: 'single',
    emoji: '🤝',
    headline: 'Have you sought help before?',
    sub: 'Wherever you are in this journey, we can meet you there.',
    options: [
      { label: 'This is my first time', icon: '🌟' },
      { label: 'I\'ve tried before but stopped', icon: '🔄' },
      { label: 'I have ongoing support', icon: '✅' },
    ],
  },
  {
    id: 'sessionType',
    type: 'single',
    emoji: '💬',
    headline: 'How would you prefer to connect?',
    sub: 'You can always change this later.',
    options: [
      { label: 'Online / Video', icon: '💻' },
      { label: 'In-person', icon: '🏢' },
      { label: 'Either works for me', icon: '🔀' },
    ],
  },
  {
    id: 'language',
    type: 'single',
    emoji: '🌐',
    headline: 'What language do you prefer?',
    sub: 'We\'ll prioritize counselors who speak your language.',
    options: [
      { label: 'English', icon: '🇨🇦' },
      { label: 'French', icon: '🇫🇷' },
      { label: 'Spanish', icon: '🇪🇸' },
      { label: 'Other', icon: '🌍' },
    ],
  },
  {
    id: 'coverage',
    type: 'single',
    emoji: '🏥',
    headline: 'How are you thinking about paying?',
    sub: 'No worries if you\'re unsure — we\'ll help you figure it out.',
    options: [
      { label: 'I have coverage / insurance', icon: '✅' },
      { label: 'I\'ll pay privately', icon: '💳' },
      { label: 'I\'m not sure yet', icon: '🤷' },
    ],
  },
  {
    id: 'avatar',
    type: 'avatar',
    emoji: '🎨',
    headline: 'Choose your avatar',
    sub: 'Pick one that feels like you — you can always stay anonymous.',
  },
];

const AVATARS = ['🧑', '👩', '👨', '🧔', '👱', '🧕', '👩‍🦱', '👨‍🦱', '🧑‍🦰', '👩‍🦳', '🦸', '🧘'];
const TOTAL = STEPS.length;

const slideVariants = {
  enter: dir => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: dir => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
};

export default function Onboarding() {
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState({ avatar: '🧑' });

  const s = STEPS[step];

  function canProceed() {
    if (s.type === 'text') return (answers.name || '').trim().length >= 2;
    if (s.type === 'avatar') return true;
    return !!answers[s.id];
  }

  function goNext() {
    if (!canProceed()) return;
    if (step < TOTAL - 1) {
      setDirection(1);
      setStep(n => n + 1);
    } else {
      dispatch({ type: 'SET_USER', payload: { ...answers } });
      navigate('/discover');
    }
  }

  function goBack() {
    if (step > 0) { setDirection(-1); setStep(n => n - 1); }
  }

  function pick(id, value) {
    setAnswers(a => ({ ...a, [id]: value }));
  }

  const ctaLabel = step === 0
    ? 'Continue'
    : step < TOTAL - 1
    ? 'Next →'
    : 'See My Matches 💜';

  return (
    <div className="min-h-dvh flex flex-col bg-gradient-to-b from-violet-50 to-white">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pb-4 screen-top flex-shrink-0">
        <button
          onClick={goBack}
          className={`w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-500 active:scale-90 transition-transform ${step === 0 ? 'opacity-0 pointer-events-none' : ''}`}
        >
          <ChevronLeft size={20} />
        </button>

        {/* Progress bar */}
        <div className="flex-1 mx-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #7c3aed, #a855f7)' }}
            animate={{ width: `${((step + 1) / TOTAL) * 100}%` }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          />
        </div>

        <span className="text-xs text-gray-400 font-medium w-10 text-right">{step + 1}/{TOTAL}</span>
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 px-5 py-4 overflow-y-auto scroll-touch"
          >
            <div className="pt-2 pb-6">
              <span className="text-5xl">{s.emoji}</span>
              <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-1.5 leading-snug">{s.headline}</h2>
              <p className="text-gray-500 text-sm mb-6">{s.sub}</p>

              {/* Text input */}
              {s.type === 'text' && (
                <>
                  <input
                    type="text"
                    value={answers.name || ''}
                    onChange={e => pick('name', e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && goNext()}
                    placeholder={s.placeholder}
                    maxLength={30}
                    autoFocus
                    className="w-full bg-white border-2 border-violet-200 focus:border-violet-500 rounded-2xl px-5 py-4 text-lg text-gray-900 outline-none transition-colors placeholder-gray-300"
                  />
                  <div className="flex items-start gap-2 mt-4">
                    <Lock size={13} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-400 text-xs leading-relaxed">
                      Your information is never shared without your explicit consent. You can switch to Anonymous Mode at any time from your profile.
                    </p>
                  </div>
                </>
              )}

              {/* Single-select */}
              {s.type === 'single' && (
                <div className="space-y-3">
                  {s.options.map(opt => {
                    const selected = answers[s.id] === opt.label;
                    return (
                      <motion.button
                        key={opt.label}
                        onClick={() => pick(s.id, opt.label)}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center gap-4 py-4 px-5 rounded-2xl border-2 text-left transition-all"
                        style={{
                          borderColor: selected ? '#7c3aed' : '#e5e7eb',
                          background: selected ? '#f5f0ff' : 'white',
                        }}
                      >
                        <span className="text-2xl flex-shrink-0">{opt.icon}</span>
                        <span className={`font-semibold text-sm flex-1 ${selected ? 'text-violet-700' : 'text-gray-700'}`}>
                          {opt.label}
                        </span>
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
              )}

              {/* Avatar picker */}
              {s.type === 'avatar' && (
                <>
                  <div className="w-24 h-24 bg-violet-100 rounded-3xl flex items-center justify-center text-5xl mx-auto mb-8 shadow-sm">
                    {answers.avatar}
                  </div>
                  <div className="grid grid-cols-6 gap-3">
                    {AVATARS.map(emoji => (
                      <motion.button
                        key={emoji}
                        onClick={() => pick('avatar', emoji)}
                        whileTap={{ scale: 0.85 }}
                        className="h-13 aspect-square rounded-2xl text-2xl flex items-center justify-center transition-all"
                        style={{
                          background: answers.avatar === emoji ? '#f5f0ff' : 'white',
                          border: `2px solid ${answers.avatar === emoji ? '#7c3aed' : '#e5e7eb'}`,
                        }}
                      >
                        {emoji}
                      </motion.button>
                    ))}
                  </div>
                  <p className="text-center text-gray-400 text-sm mt-6">
                    Almost there{answers.name ? `, ${answers.name}` : ''} 🌟
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* CTA */}
      <div className="px-5 pb-safe pt-4 flex-shrink-0">
        <motion.button
          onClick={goNext}
          disabled={!canProceed()}
          whileTap={canProceed() ? { scale: 0.97 } : {}}
          className="w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all"
          style={{
            background: canProceed() ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : '#e5e7eb',
            color: canProceed() ? 'white' : '#9ca3af',
            boxShadow: canProceed() ? '0 4px 20px rgba(124,58,237,0.35)' : 'none',
          }}
        >
          {ctaLabel}
        </motion.button>
      </div>
    </div>
  );
}
