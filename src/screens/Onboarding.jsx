import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

const AVATARS = ['🧑', '👩', '👨', '🧔', '👱', '🧕', '👩‍🦱', '👨‍🦱', '🧑‍🦰', '👩‍🦳'];

const QUESTIONS = [
  {
    id: 'name',
    type: 'text',
    emoji: '👋',
    question: 'What should we call you?',
    hint: 'You can use a nickname or first name only.',
    placeholder: 'Your name or nickname',
    privacy: '🔒 Your personal information is never shared without your permission.',
  },
  {
    id: 'addiction_type',
    type: 'single',
    emoji: '💙',
    question: 'What brings you here today?',
    hint: 'This helps us find counselors with the right expertise.',
    options: ['Alcohol', 'Opioids / Prescription Drugs', 'Stimulants', 'Cannabis', 'Gambling', 'Other / Not sure'],
  },
  {
    id: 'duration',
    type: 'single',
    emoji: '🕐',
    question: 'How long have you been dealing with this?',
    hint: 'There is no wrong answer — this helps us match you better.',
    options: ['Less than 6 months', '6 months – 2 years', '2–5 years', 'More than 5 years'],
  },
  {
    id: 'goal',
    type: 'multi',
    emoji: '🎯',
    question: 'What are your goals for recovery?',
    hint: 'Select all that resonate with you.',
    options: ['Full sobriety', 'Harm reduction', 'Understand my patterns', 'Heal family relationships', 'Address mental health too', 'Prevent relapse'],
  },
  {
    id: 'session_type',
    type: 'single',
    emoji: '💬',
    question: 'What kind of sessions do you prefer?',
    hint: 'You can always change this later.',
    options: ['Individual (1-on-1)', 'Family sessions', 'Group therapy', 'Online only', 'In-person'],
  },
  {
    id: 'avatar',
    type: 'avatar',
    emoji: '🎨',
    question: 'Choose your avatar',
    hint: 'Pick an emoji that represents you on this journey.',
  },
];

const TOTAL = QUESTIONS.length;

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
  const [answers, setAnswers] = useState({ avatar: '🧑' });

  const q = QUESTIONS[step];

  function canProceed() {
    if (q.type === 'text') return (answers.name || '').trim().length >= 2;
    if (q.type === 'multi') return (answers[q.id] || []).length > 0;
    if (q.type === 'avatar') return true;
    return !!answers[q.id];
  }

  function goNext() {
    if (!canProceed()) return;
    if (step < TOTAL - 1) {
      setDirection(1);
      setStep(s => s + 1);
    } else {
      dispatch({ type: 'SET_USER', payload: answers });
      navigate('/discover');
    }
  }

  function goBack() {
    if (step > 0) {
      setDirection(-1);
      setStep(s => s - 1);
    }
  }

  function setSingle(id, value) {
    setAnswers(a => ({ ...a, [id]: value }));
  }

  function toggleMulti(id, value) {
    setAnswers(a => {
      const arr = a[id] || [];
      return { ...a, [id]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value] };
    });
  }

  return (
    <div className="min-h-dvh flex flex-col bg-gradient-to-b from-violet-50 to-white">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pb-4 screen-top">
        <button
          onClick={goBack}
          className={`w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-500 active:scale-90 transition-transform ${step === 0 ? 'opacity-0 pointer-events-none' : ''}`}
        >
          <ChevronLeft size={20} />
        </button>

        {/* Progress dots */}
        <div className="flex gap-2">
          {Array.from({ length: TOTAL }).map((_, i) => (
            <motion.div
              key={i}
              className="h-2 rounded-full"
              animate={{ width: i === step ? 24 : 8, backgroundColor: i <= step ? '#7c3aed' : '#e5e7eb' }}
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
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 px-5 py-4 overflow-y-auto"
          >
            <div className="pt-2">
              <span className="text-4xl">{q.emoji}</span>
              <h2 className="text-2xl font-bold text-gray-900 mt-3 mb-1 leading-snug">{q.question}</h2>
              <p className="text-gray-500 text-sm mb-6">{q.hint}</p>

              {q.type === 'text' && (
                <>
                  <input
                    type="text"
                    value={answers.name || ''}
                    onChange={e => setSingle('name', e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && goNext()}
                    placeholder={q.placeholder}
                    maxLength={30}
                    autoFocus
                    className="w-full bg-white border-2 border-violet-200 focus:border-violet-500 rounded-2xl px-5 py-4 text-lg text-gray-900 outline-none transition-colors placeholder-gray-300"
                  />
                  <p className="text-gray-400 text-xs mt-3">{q.privacy}</p>
                </>
              )}

              {q.type === 'single' && (
                <div className="space-y-3">
                  {q.options.map(opt => {
                    const selected = answers[q.id] === opt;
                    return (
                      <motion.button
                        key={opt}
                        onClick={() => { setSingle(q.id, opt); }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-between py-4 px-5 rounded-2xl border-2 text-left transition-all"
                        style={{
                          borderColor: selected ? '#7c3aed' : '#e5e7eb',
                          background: selected ? '#f5f0ff' : 'white',
                        }}
                      >
                        <span className={`font-semibold text-sm ${selected ? 'text-violet-700' : 'text-gray-700'}`}>{opt}</span>
                        <div
                          className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                          style={{ borderColor: selected ? '#7c3aed' : '#d1d5db', background: selected ? '#7c3aed' : 'transparent' }}
                        >
                          {selected && <Check size={13} className="text-white" />}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {q.type === 'multi' && (
                <div className="space-y-3">
                  {q.options.map(opt => {
                    const selected = (answers[q.id] || []).includes(opt);
                    return (
                      <motion.button
                        key={opt}
                        onClick={() => toggleMulti(q.id, opt)}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-between py-4 px-5 rounded-2xl border-2 text-left transition-all"
                        style={{
                          borderColor: selected ? '#7c3aed' : '#e5e7eb',
                          background: selected ? '#f5f0ff' : 'white',
                        }}
                      >
                        <span className={`font-semibold text-sm ${selected ? 'text-violet-700' : 'text-gray-700'}`}>{opt}</span>
                        <div
                          className="w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all"
                          style={{ borderColor: selected ? '#7c3aed' : '#d1d5db', background: selected ? '#7c3aed' : 'transparent' }}
                        >
                          {selected && <Check size={13} className="text-white" />}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {q.type === 'avatar' && (
                <>
                  <div className="w-24 h-24 bg-violet-100 rounded-3xl flex items-center justify-center text-5xl mx-auto mb-8 shadow-sm">
                    {answers.avatar}
                  </div>
                  <div className="grid grid-cols-5 gap-3">
                    {AVATARS.map(emoji => (
                      <motion.button
                        key={emoji}
                        onClick={() => setSingle('avatar', emoji)}
                        whileTap={{ scale: 0.85 }}
                        className="h-14 rounded-2xl text-3xl flex items-center justify-center transition-all"
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
                    Almost there, {answers.name || 'friend'} 🌟
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* CTA */}
      <div className="px-5 pb-safe pt-4">
        <motion.button
          onClick={goNext}
          disabled={!canProceed()}
          whileTap={canProceed() ? { scale: 0.97 } : {}}
          className="w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all"
          style={{
            background: canProceed() ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : '#e5e7eb',
            color: canProceed() ? 'white' : '#9ca3af',
          }}
        >
          {step < TOTAL - 1 ? 'Continue' : "Let's go →"}
        </motion.button>
      </div>
    </div>
  );
}
