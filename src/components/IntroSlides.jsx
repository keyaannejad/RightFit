import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { INTRO_SLIDES } from '../data/counselors';
import DotPagination from './DotPagination';

export default function IntroSlides({ onComplete }) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);

  const total = INTRO_SLIDES.length;
  const slide = INTRO_SLIDES[index];

  function goNext() {
    if (index < total - 1) {
      setDir(1);
      setIndex(i => i + 1);
    } else {
      onComplete();
    }
  }

  function goPrev() {
    if (index > 0) {
      setDir(-1);
      setIndex(i => i - 1);
    }
  }

  const variants = {
    enter: d => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: d => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-6 relative">
      {/* Nav arrows */}
      <button
        onClick={goPrev}
        disabled={index === 0}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-500 disabled:opacity-20 transition-opacity hover:shadow-lg"
      >
        ‹
      </button>
      <button
        onClick={goNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-500 hover:shadow-lg"
      >
        ›
      </button>

      <div className="max-w-xs w-full text-center">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={index}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="text-7xl mb-6">{slide.emoji}</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">{slide.title}</h2>
            <p className="text-gray-500 text-base leading-relaxed mb-8">{slide.body}</p>

            {index === total - 1 && (
              <button
                onClick={onComplete}
                className="px-8 py-3.5 rounded-full font-bold text-white text-base transition-transform active:scale-95"
                style={{ background: '#f97316' }}
              >
                Get Started →
              </button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot pagination */}
      <div className="absolute bottom-8 left-0 right-0">
        <DotPagination total={total} current={index} onDotClick={i => { setDir(i > index ? 1 : -1); setIndex(i); }} />
        <p className="text-center text-gray-400 text-sm mt-3">
          {index < total - 1 ? 'Swipe left or right to browse' : 'Ready to find your counselor'}
        </p>
      </div>
    </div>
  );
}
