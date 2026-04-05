import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Shield, Sparkles } from 'lucide-react';

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

      {/* Logo area */}
      <motion.div
        className="text-center mt-8"
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
          <span className="text-4xl">💜</span>
        </div>
        <h1 className="text-white text-4xl font-bold tracking-tight">RightFit</h1>
        <p className="text-white/80 text-lg mt-1">Find your path to recovery</p>
      </motion.div>

      {/* Illustration / card preview */}
      <motion.div
        className="relative w-full max-w-sm mx-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Stack of cards preview */}
        <div className="relative h-64 flex items-center justify-center">
          <div className="absolute bg-white/20 backdrop-blur-sm rounded-3xl w-64 h-56 rotate-6 shadow-lg" />
          <div className="absolute bg-white/30 backdrop-blur-sm rounded-3xl w-64 h-56 -rotate-3 shadow-lg" />
          <div className="bg-white rounded-3xl w-64 h-56 shadow-2xl p-5 flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center text-2xl">👩‍⚕️</div>
              <div>
                <div className="font-bold text-gray-900 text-sm">Dr. Amara Osei</div>
                <div className="text-violet-600 text-xs font-medium">Clinical Psychologist</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {['Trauma & PTSD', 'Dual Diagnosis', 'CBT'].map(tag => (
                <span key={tag} className="text-xs bg-violet-50 text-violet-700 px-2 py-0.5 rounded-full font-medium">{tag}</span>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-yellow-400 text-sm">★</span>
                <span className="text-gray-700 text-sm font-semibold">4.9</span>
                <span className="text-gray-400 text-xs">(134)</span>
              </div>
              <div className="flex gap-2">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-lg">✕</div>
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-lg">♥</div>
              </div>
            </div>
          </div>
        </div>
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
