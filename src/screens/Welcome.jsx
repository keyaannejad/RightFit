import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Shield, Sparkles } from 'lucide-react';

function RightFitEmblem() {
  return (
    <svg viewBox="0 0 220 220" width="220" height="220" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Glow circle */}
      <circle cx="110" cy="105" r="90" fill="rgba(255,255,255,0.08)" />

      {/* Left hand */}
      <g fill="rgba(255,255,255,0.92)">
        {/* Left palm */}
        <ellipse cx="72" cy="148" rx="26" ry="18" transform="rotate(-18 72 148)" />
        {/* Left thumb */}
        <ellipse cx="50" cy="138" rx="8" ry="14" transform="rotate(-40 50 138)" />
        {/* Left index */}
        <ellipse cx="58" cy="118" rx="7" ry="18" transform="rotate(-25 58 118)" />
        {/* Left middle */}
        <ellipse cx="72" cy="112" rx="7" ry="20" transform="rotate(-10 72 112)" />
        {/* Left ring */}
        <ellipse cx="86" cy="116" rx="7" ry="18" transform="rotate(8 86 116)" />
        {/* Left pinky */}
        <ellipse cx="97" cy="124" rx="6" ry="14" transform="rotate(20 97 124)" />
      </g>

      {/* Right hand (mirror) */}
      <g fill="rgba(255,255,255,0.92)">
        {/* Right palm */}
        <ellipse cx="148" cy="148" rx="26" ry="18" transform="rotate(18 148 148)" />
        {/* Right thumb */}
        <ellipse cx="170" cy="138" rx="8" ry="14" transform="rotate(40 170 138)" />
        {/* Right index */}
        <ellipse cx="162" cy="118" rx="7" ry="18" transform="rotate(25 162 118)" />
        {/* Right middle */}
        <ellipse cx="148" cy="112" rx="7" ry="20" transform="rotate(10 148 112)" />
        {/* Right ring */}
        <ellipse cx="134" cy="116" rx="7" ry="18" transform="rotate(-8 134 116)" />
        {/* Right pinky */}
        <ellipse cx="123" cy="124" rx="6" ry="14" transform="rotate(-20 123 124)" />
      </g>

      {/* Spade shape */}
      {/* Spade top (heart shape inverted) */}
      <path
        d="M110 48
           C110 48 80 68 80 88
           C80 104 94 112 110 104
           C126 112 140 104 140 88
           C140 68 110 48 110 48Z"
        fill="rgba(255,255,255,0.95)"
      />
      {/* Spade bottom stem + wings */}
      <path
        d="M103 104 C103 118 94 126 84 128 L136 128 C126 126 117 118 117 104Z"
        fill="rgba(255,255,255,0.95)"
      />

      {/* Subtle text below */}
      <text x="110" y="175" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="600" letterSpacing="2" fill="rgba(255,255,255,0.65)">
        RECOVERY COUNSELING
      </text>
    </svg>
  );
}

const features = [
  { icon: Heart, text: 'Matched to counselors who understand your journey' },
  { icon: Shield, text: 'Private, judgment-free, and fully confidential' },
  { icon: Sparkles, text: 'Swipe to find the right fit at your own pace' },
];

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 px-6 py-12">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

      {/* Wordmark */}
      <motion.div
        className="text-center mt-8"
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="text-white text-4xl font-bold tracking-tight">RightFit</h1>
        <p className="text-white/80 text-lg mt-1">Find your path to recovery</p>
      </motion.div>

      {/* Emblem */}
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <RightFitEmblem />
      </motion.div>

      {/* Features */}
      <motion.div
        className="w-full max-w-sm space-y-3"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.6 }}
      >
        {features.map(({ icon: Icon, text }, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-3 bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
          >
            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Icon size={16} className="text-white" />
            </div>
            <span className="text-white/90 text-sm font-medium">{text}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div
        className="w-full max-w-sm space-y-3"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.5 }}
      >
        <button
          onClick={() => navigate('/onboarding')}
          className="w-full bg-white text-violet-700 font-bold text-lg py-4 rounded-2xl shadow-xl active:scale-95 transition-transform"
        >
          Get Started
        </button>
        <p className="text-center text-white/60 text-xs pb-2">
          Free to browse · No credit card required
        </p>
      </motion.div>
    </div>
  );
}
