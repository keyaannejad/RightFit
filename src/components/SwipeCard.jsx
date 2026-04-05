import { useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Star, MapPin, Video, Building2, Clock, Languages } from 'lucide-react';

const SWIPE_THRESHOLD = 100;
const ROTATE_FACTOR = 0.08;

export default function SwipeCard({ counselor, onLike, onPass, isTop, style = {} }) {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-25, 25]);
  const likeOpacity = useTransform(x, [20, 80], [0, 1]);
  const nopeOpacity = useTransform(x, [-80, -20], [1, 0]);

  const [isDragging, setIsDragging] = useState(false);

  function handleDragEnd(_, info) {
    const offsetX = info.offset.x;
    setIsDragging(false);

    if (offsetX > SWIPE_THRESHOLD) {
      flyOut('right');
    } else if (offsetX < -SWIPE_THRESHOLD) {
      flyOut('left');
    } else {
      // Snap back
      animate(x, 0, { type: 'spring', stiffness: 400, damping: 30 });
      animate(y, 0, { type: 'spring', stiffness: 400, damping: 30 });
    }
  }

  function flyOut(dir) {
    const target = dir === 'right' ? 600 : -600;
    animate(x, target, {
      duration: 0.35,
      ease: 'easeOut',
      onComplete: () => dir === 'right' ? onLike(counselor.id) : onPass(counselor.id),
    });
    animate(y, 80, { duration: 0.35, ease: 'easeOut' });
  }

  return (
    <motion.div
      ref={cardRef}
      className="absolute w-full swipe-card"
      style={{ x, y, rotate, ...style }}
      drag={isTop}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.8}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      whileDrag={{ cursor: 'grabbing' }}
    >
      {/* LIKE stamp */}
      <motion.div
        className="absolute top-8 left-6 z-20 border-4 border-green-500 text-green-500 font-black text-2xl px-4 py-1 rounded-xl -rotate-12 select-none"
        style={{ opacity: likeOpacity }}
      >
        CONNECT
      </motion.div>

      {/* NOPE stamp */}
      <motion.div
        className="absolute top-8 right-6 z-20 border-4 border-red-400 text-red-400 font-black text-2xl px-4 py-1 rounded-xl rotate-12 select-none"
        style={{ opacity: nopeOpacity }}
      >
        SKIP
      </motion.div>

      <div
        className="bg-white rounded-3xl overflow-hidden card-shadow select-none"
        style={{ cursor: isTop ? 'grab' : 'default' }}
      >
        {/* Card header gradient */}
        <div className={`h-44 bg-gradient-to-br ${counselor.slideColor} relative flex items-end p-5`}>
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-white shadow-lg overflow-hidden flex items-center justify-center">
            <img
              src={counselor.image}
              alt={counselor.name}
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>

          {/* Name overlay */}
          <div className="ml-4">
            <h3 className="text-white font-bold text-xl leading-tight">{counselor.name}</h3>
            <p className="text-white/80 text-sm">{counselor.credentials}</p>
          </div>

          {/* Rating badge */}
          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
            <Star size={12} className="text-yellow-300 fill-yellow-300" />
            <span className="text-white text-sm font-bold">{counselor.rating}</span>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Title & meta */}
          <div>
            <p className="text-violet-600 font-semibold text-sm">{counselor.title}</p>
            <div className="flex flex-wrap gap-3 mt-2">
              <MetaItem icon={MapPin} text={counselor.location} />
              <MetaItem icon={Clock} text={`Available ${counselor.availability}`} color="green" />
              {counselor.remote && <MetaItem icon={Video} text="Online" />}
              {counselor.inPerson && <MetaItem icon={Building2} text="In-person" />}
            </div>
          </div>

          {/* Bio */}
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{counselor.bio}</p>

          {/* Specializations */}
          <div className="flex flex-wrap gap-1.5">
            {counselor.specializations.slice(0, 4).map(spec => (
              <span
                key={spec}
                className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ background: `${counselor.accentColor}18`, color: counselor.accentColor }}
              >
                {spec}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-1 border-t border-gray-100">
            <div className="flex items-center gap-1 text-gray-500 text-xs">
              <Languages size={13} />
              <span>{counselor.languages.join(', ')}</span>
            </div>
            <div className="text-gray-900 font-bold text-sm">
              ${counselor.sessionCost}
              <span className="text-gray-400 font-normal">/session</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MetaItem({ icon: Icon, text, color = 'gray' }) {
  const colors = {
    gray: 'text-gray-500',
    green: 'text-emerald-600',
  };
  return (
    <div className={`flex items-center gap-1 ${colors[color]}`}>
      <Icon size={12} />
      <span className="text-xs">{text}</span>
    </div>
  );
}
