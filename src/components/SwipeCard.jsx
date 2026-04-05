import { useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Star, MapPin } from 'lucide-react';

const SWIPE_THRESHOLD = 100;

export default function SwipeCard({ counselor, onLike, onPass, isTop, style = {} }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-15, 15]);
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
    animate(x, target, {
      duration: 0.3,
      ease: 'easeOut',
      onComplete: () => dir === 'right' ? onLike(counselor.id) : onPass(counselor.id),
    });
    animate(y, 60, { duration: 0.3, ease: 'easeOut' });
  }

  return (
    <motion.div
      className="absolute inset-0 swipe-card"
      style={{ x, y, rotate, ...style }}
      drag={isTop}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      whileDrag={{ cursor: 'grabbing' }}
    >
      {/* CONNECT stamp */}
      <motion.div
        className="absolute top-6 left-4 z-20 border-4 border-green-500 text-green-600 font-black text-lg px-3 py-0.5 rounded-xl -rotate-12 select-none pointer-events-none"
        style={{ opacity: likeOpacity }}
      >
        CONNECT
      </motion.div>

      {/* SKIP stamp */}
      <motion.div
        className="absolute top-6 right-4 z-20 border-4 border-red-400 text-red-500 font-black text-lg px-3 py-0.5 rounded-xl rotate-12 select-none pointer-events-none"
        style={{ opacity: nopeOpacity }}
      >
        SKIP
      </motion.div>

      <div
        className="bg-white rounded-3xl overflow-hidden card-shadow h-full flex flex-col select-none"
        style={{ cursor: isTop ? 'grab' : 'default' }}
      >
        {/* Photo */}
        <div className="relative overflow-hidden" style={{ flex: '1 1 0', minHeight: 0 }}>
          <img
            src={counselor.photo}
            alt={counselor.name}
            className="w-full h-full object-cover object-top"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

          {/* Rating */}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <span className="text-gray-900 text-sm font-bold">{counselor.rating}</span>
          </div>

          {/* Name overlay */}
          <div className="absolute bottom-3 left-4 right-4">
            <p className="text-white font-bold text-xl leading-tight drop-shadow-md">{counselor.name}</p>
            <p className="text-white/80 text-sm leading-tight drop-shadow">{counselor.title}</p>
          </div>
        </div>

        {/* Info strip */}
        <div className="px-4 pt-3 pb-3 space-y-2">
          {/* Location row */}
          <div className="flex items-center gap-1.5 text-gray-500 overflow-hidden">
            <MapPin size={11} className="flex-shrink-0" />
            <span className="text-xs truncate">{counselor.location}</span>
            <span className="text-gray-300 mx-1 flex-shrink-0">·</span>
            <span className="text-xs text-emerald-600 font-semibold whitespace-nowrap flex-shrink-0">{counselor.availability}</span>
          </div>

          {/* Tags row — all on one line, overflow hidden */}
          <div className="flex gap-1.5 overflow-hidden">
            {counselor.specializations.slice(0, 3).map(s => (
              <span
                key={s}
                className="text-xs px-2 py-0.5 rounded-full font-medium bg-violet-50 text-violet-700 whitespace-nowrap flex-shrink-0"
              >
                {s}
              </span>
            ))}
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-green-600">{counselor.successRate}% success</span>
            <span className="text-gray-300">·</span>
            <span className="text-gray-500">{counselor.clientsHelped} clients</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
