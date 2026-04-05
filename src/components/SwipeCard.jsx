import { useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Star, MapPin, Clock } from 'lucide-react';

const SWIPE_THRESHOLD = 100;

export default function SwipeCard({ counselor, onLike, onPass, isTop, style = {} }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-18, 18]);
  const likeOpacity = useTransform(x, [20, 80], [0, 1]);
  const nopeOpacity = useTransform(x, [-80, -20], [1, 0]);

  function handleDragEnd(_, info) {
    if (info.offset.x > SWIPE_THRESHOLD) {
      flyOut('right');
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      flyOut('left');
    } else {
      animate(x, 0, { type: 'spring', stiffness: 400, damping: 30 });
      animate(y, 0, { type: 'spring', stiffness: 400, damping: 30 });
    }
  }

  function flyOut(dir) {
    const target = dir === 'right' ? 600 : -600;
    animate(x, target, { duration: 0.3, ease: 'easeOut', onComplete: () => dir === 'right' ? onLike(counselor.id) : onPass(counselor.id) });
    animate(y, 60, { duration: 0.3, ease: 'easeOut' });
  }

  return (
    <motion.div
      className="absolute w-full swipe-card"
      style={{ x, y, rotate, ...style }}
      drag={isTop}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      whileDrag={{ cursor: 'grabbing' }}
    >
      {/* CONNECT stamp */}
      <motion.div
        className="absolute top-6 left-5 z-20 border-4 border-green-500 text-green-500 font-black text-xl px-4 py-1 rounded-xl -rotate-12 select-none pointer-events-none"
        style={{ opacity: likeOpacity }}
      >
        CONNECT
      </motion.div>

      {/* SKIP stamp */}
      <motion.div
        className="absolute top-6 right-5 z-20 border-4 border-red-400 text-red-400 font-black text-xl px-4 py-1 rounded-xl rotate-12 select-none pointer-events-none"
        style={{ opacity: nopeOpacity }}
      >
        SKIP
      </motion.div>

      <div
        className="bg-white rounded-3xl overflow-hidden card-shadow select-none h-full flex flex-col"
        style={{ cursor: isTop ? 'grab' : 'default' }}
      >
        {/* Photo — takes up most of the card */}
        <div className="relative flex-1 min-h-0 overflow-hidden">
          <img
            src={counselor.photo}
            alt={counselor.name}
            className="w-full h-full object-cover object-top"
            draggable={false}
          />
          {/* Gradient overlay at bottom of photo */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Rating badge top-right */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
            <Star size={13} className="text-yellow-400 fill-yellow-400" />
            <span className="text-gray-900 text-sm font-bold">{counselor.rating}</span>
          </div>

          {/* Name + title over photo bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-bold text-xl leading-tight drop-shadow">{counselor.name}</h3>
            <p className="text-white/85 text-sm font-medium drop-shadow">{counselor.title}</p>
          </div>
        </div>

        {/* Compact info row */}
        <div className="px-4 py-3 space-y-2.5">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1"><MapPin size={11} />{counselor.location}</span>
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <Clock size={11} />{counselor.availability}
            </span>
          </div>

          {/* Specialization tags */}
          <div className="flex flex-wrap gap-1.5">
            {counselor.specializations.slice(0, 3).map(s => (
              <span key={s} className="text-xs px-2.5 py-1 rounded-full font-medium bg-violet-50 text-violet-700">
                {s}
              </span>
            ))}
          </div>

          {/* Success stats */}
          <div className="flex items-center gap-3 text-xs pb-0.5">
            <span className="text-green-600 font-bold">{counselor.successRate}% success rate</span>
            <span className="text-gray-400">·</span>
            <span className="text-gray-500">{counselor.clientsHelped} clients helped</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
