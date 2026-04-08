import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Check, Lock, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

const STEPS = [
  {
    id: 'name',
    type: 'text',
    headline: 'What should we call you?',
    sub: 'A first name or nickname is fine. You can always stay anonymous.',
    placeholder: 'Your name or nickname',
  },
  {
    id: 'reason',
    type: 'single',
    headline: 'What brings you here today?',
    sub: 'This helps us find counselors with the right expertise.',
    options: [
      'I think I have a gambling problem',
      'I want to cut back on gambling',
      'I\'m struggling and need help now',
      'Someone I love has a gambling problem',
    ],
  },
  {
    id: 'duration',
    type: 'single',
    headline: 'How long has gambling been a concern?',
    sub: 'There\'s no wrong answer — this helps us match you better.',
    options: [
      'Just recently noticed',
      'A few months',
      '1–2 years',
      'Several years or more',
    ],
  },
  {
    id: 'priorHelp',
    type: 'single',
    headline: 'Have you sought help before?',
    sub: 'Wherever you are in this journey, we can meet you there.',
    options: [
      'This is my first time',
      'I\'ve tried before but stopped',
      'I have ongoing support',
    ],
  },
  {
    id: 'sessionType',
    type: 'single',
    headline: 'How would you prefer to connect?',
    sub: 'You can always change this later.',
    options: [
      'Online / Video',
      'In-person',
      'Either works for me',
    ],
  },
  {
    id: 'language',
    type: 'single',
    headline: 'What language do you prefer?',
    sub: 'We\'ll prioritize counselors who speak your language.',
    options: [
      'English',
      'French',
      'Spanish',
      'Other',
    ],
  },
  {
    id: 'ohip',
    type: 'info',
    headline: 'Your sessions are covered',
    sub: 'RightFit is covered by OHIP at no cost to you. There are no fees, no billing, and no surprises.',
  },
  {
    id: 'avatar',
    type: 'avatar',
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
  const [answers, setAnswers] = useState({ avatar: '🧑', ohip: 'acknowledged' });

  const s = STEPS[step];

  function canProceed() {
    if (s.type === 'text') return (answers.name || '').trim().length >= 2;
    if (s.type === 'avatar' || s.type === 'info') return true;
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

  const isLast = step === TOTAL - 1;
  const ctaLabel = isLast ? 'See My Matches' : 'Continue';

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
              <h2 className="text-2xl font-bold text-gray-900 mb-1.5 leading-snug">{s.headline}</h2>
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

              {/* Single-select — no icons, clean text tiles */}
              {s.type === 'single' && (
                <div className="space-y-3">
                  {s.options.map(opt => {
                    const selected = answers[s.id] === opt;
                    return (
                      <motion.button
                        key={opt}
                        onClick={() => pick(s.id, opt)}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-between py-4 px-5 rounded-2xl border-2 text-left transition-all"
                        style={{
                          borderColor: selected ? '#7c3aed' : '#e5e7eb',
                          background: selected ? '#f5f0ff' : 'white',
                        }}
                      >
                        <span className={`font-semibold text-sm ${selected ? 'text-violet-700' : 'text-gray-700'}`}>
                          {opt}
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

              {/* OHIP info screen */}
              {s.type === 'info' && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-3xl overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', border: '1.5px solid #86efac' }}
                >
                  <div className="px-6 py-8 text-center">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                      style={{ background: 'linear-gradient(135deg, #16a34a, #22c55e)' }}
                    >
                      <ShieldCheck size={32} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-green-900 mb-3">Covered by OHIP</h3>
                    <p className="text-green-700 text-sm leading-relaxed mb-5">
                      Your counselling sessions through RightFit are fully covered by the Ontario Health Insurance Plan.
                      There is no cost to you — ever.
                    </p>
                    <div className="space-y-2 text-left">
                      {[
                        'No fees or co-pays',
                        'No credit card required',
                        'Unlimited sessions with your matched counselor',
                      ].map(item => (
                        <div key={item} className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                            <Check size={9} className="text-white" />
                          </div>
                          <span className="text-green-800 text-sm font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
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
                        className="aspect-square rounded-2xl text-2xl flex items-center justify-center transition-all"
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
                    Almost there{answers.name ? `, ${answers.name}` : ''}.
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
