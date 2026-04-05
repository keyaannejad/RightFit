import { useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Star, MapPin, Video, Building2, Clock, Languages } from 'lucide-react';

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
    animate(x, target, { duration: 0.35, ease: 'easeOut', onComplete: () => dir === 'right' ? onLike(counselor.id) : onPass(counselor.id) });
    animate(y, 60, { duration: 0.35, ease: 'easeOut' });
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
        className="absolute top-8 left-5 z-20 border-4 border-green-500 text-green-500 font-black text-xl px-4 py-1 rounded-xl -rotate-12 select-none"
        style={{ opacity: likeOpacity }}
      >
        CONNECT
      </motion.div>

      {/* SKIP stamp */}
      <motion.div
        className="absolute top-8 right-5 z-20 border-4 border-red-400 text-red-400 font-black text-xl px-4 py-1 rounded-xl rotate-12 select-none"
        style={{ opacity: nopeOpacity }}
      >
        SKIP
      </motion.div>

      <div className="bg-white rounded-3xl overflow-hidden card-shadow select-none" style={{ cursor: isTop ? 'grab' : 'default' }}>
        {/* Full photo header */}
        <div className="relative h-52 overflow-hidden">
          <img
            src={counselor.photo}
            alt={counselor.name}
            className="w-full h-full object-cover object-top"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

          {/* Rating badge */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <span className="text-gray-900 text-sm font-bold">{counselor.rating}</span>
          </div>
        </div>

        <div className="p-5 space-y-3.5">
          {/* Name & credentials */}
          <div>
            <h3 className="font-bold text-gray-900 text-lg leading-tight">{counselor.name}</h3>
            <p className="text-violet-600 font-semibold text-sm mt-0.5">{counselor.title}</p>
            <p className="text-gray-400 text-xs">{counselor.credentials || counselor.certifications?.[0]}</p>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap gap-3">
            <MetaItem icon={MapPin} text={counselor.location} />
            <MetaItem icon={Clock} text={`Available ${counselor.availability}`} color="green" />
            {counselor.remote && <MetaItem icon={Video} text="Online" />}
            {counselor.inPerson && <MetaItem icon={Building2} text="In-person" />}
          </div>

          {/* Bio */}
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{counselor.about || counselor.bio}</p>

          {/* Specializations */}
          <div className="flex flex-wrap gap-1.5">
            {counselor.specializations.slice(0, 3).map(spec => (
              <span
                key={spec}
                className="text-xs px-2.5 py-1 rounded-full font-medium bg-violet-50 text-violet-700"
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
            <div className="flex gap-3 text-xs text-gray-500">
              <span className="text-green-600 font-bold">{counselor.successRate}% success</span>
              <span>{counselor.clientsHelped} clients</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MetaItem({ icon: Icon, text, color = 'gray' }) {
  return (
    <div className={`flex items-center gap-1 ${color === 'green' ? 'text-emerald-600' : 'text-gray-500'}`}>
      <Icon size={12} />
      <span className="text-xs">{text}</span>
    </div>
  );
}
