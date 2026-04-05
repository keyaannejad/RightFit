import { motion } from 'framer-motion';

export default function DotPagination({ total, current, onDotClick }) {
  return (
    <div className="flex items-center justify-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <motion.button
          key={i}
          onClick={() => onDotClick?.(i)}
          animate={{
            width: i === current ? 28 : 8,
            background: i === current ? '#f97316' : '#d1d5db',
          }}
          transition={{ duration: 0.25 }}
          className="h-2 rounded-full"
        />
      ))}
    </div>
  );
}
