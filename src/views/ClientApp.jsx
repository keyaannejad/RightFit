import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import IntroSlides from '../components/IntroSlides';
import Questionnaire from '../components/Questionnaire';
import SwipeDeck from '../components/SwipeDeck';

const SECTIONS = ['intro', 'questionnaire', 'swiping'];

export default function ClientApp() {
  const [section, setSection] = useState('intro');
  const [answers, setAnswers] = useState({});

  function goNext() {
    const idx = SECTIONS.indexOf(section);
    if (idx < SECTIONS.length - 1) setSection(SECTIONS[idx + 1]);
  }

  function goPrev() {
    const idx = SECTIONS.indexOf(section);
    if (idx > 0) setSection(SECTIONS[idx - 1]);
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-120px)]">
      <AnimatePresence mode="wait">
        {section === 'intro' && (
          <motion.div key="intro" className="w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <IntroSlides onComplete={goNext} />
          </motion.div>
        )}
        {section === 'questionnaire' && (
          <motion.div key="q" className="w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Questionnaire answers={answers} setAnswers={setAnswers} onComplete={goNext} onBack={goPrev} />
          </motion.div>
        )}
        {section === 'swiping' && (
          <motion.div key="swipe" className="w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <SwipeDeck answers={answers} onBack={goPrev} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
