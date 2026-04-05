import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QUESTIONNAIRE } from '../data/counselors';
import DotPagination from './DotPagination';

export default function Questionnaire({ answers, setAnswers, onComplete, onBack }) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const total = QUESTIONNAIRE.length;
  const q = QUESTIONNAIRE[step];

  function select(option) {
    setAnswers(a => ({ ...a, [q.id]: option }));
    if (step < total - 1) {
      setDir(1);
      setStep(s => s + 1);
    } else {
      onComplete();
    }
  }

  function goBack() {
    if (step > 0) {
      setDir(-1);
      setStep(s => s - 1);
    } else {
      onBack();
    }
  }

  const variants = {
    enter: d => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: d => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-6">
      <div className="max-w-sm w-full">
        {/* Back button */}
        <button
          onClick={goBack}
          className="mb-6 flex items-center gap-1 text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors"
        >
          ← Back
        </button>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-400 mb-1.5">
            <span>Question {step + 1} of {total}</span>
            <span>{Math.round(((step) / total) * 100)}% complete</span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: '#f97316' }}
              animate={{ width: `${((step) / total) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 leading-snug">{q.question}</h2>

            <div className="space-y-3">
              {q.options.map(option => {
                const selected = answers[q.id] === option;
                return (
                  <motion.button
                    key={option}
                    onClick={() => select(option)}
                    whileTap={{ scale: 0.98 }}
                    className="w-full text-left px-5 py-4 rounded-2xl border-2 font-medium text-sm transition-all"
                    style={{
                      borderColor: selected ? '#f97316' : '#e5e7eb',
                      background: selected ? '#fff7ed' : 'white',
                      color: selected ? '#c2410c' : '#374151',
                    }}
                  >
                    {option}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div className="mt-10">
        <DotPagination total={total} current={step} />
        <p className="text-center text-gray-400 text-sm mt-3">Swipe left or right to browse</p>
      </div>
    </div>
  );
}
