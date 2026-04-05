import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowLeft, Star, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { COUNSELORS } from '../data/counselors';
import BottomNav from '../components/BottomNav';

const AUTO_REPLIES = [
  "Thank you for reaching out! I'd love to connect with you. When are you available for a free 15-minute intro call?",
  "Hi! I'm so glad you contacted me. I specialize in exactly what you're going through. Let's set up a time to talk.",
  "Welcome! Taking this step takes real courage. I have availability this week — would any of these times work for you?",
  "Hello! I've reviewed your profile and I think we'd work really well together. Feel free to share whatever you're comfortable with.",
];

export default function Matches() {
  const { state } = useApp();
  const [activeChat, setActiveChat] = useState(null);

  const matchedCounselors = COUNSELORS.filter(c => state.matches.includes(c.id));

  if (activeChat) {
    return <ChatScreen counselor={activeChat} onBack={() => setActiveChat(null)} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-violet-50 to-white">
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Your Matches 💜</h1>
        <p className="text-gray-400 text-sm mt-0.5">
          {matchedCounselors.length === 0
            ? 'Keep swiping to find your right fit'
            : `${matchedCounselors.length} counselor${matchedCounselors.length !== 1 ? 's' : ''} ready to support you`}
        </p>
      </div>

      <div className="flex-1 px-5 pb-28 overflow-y-auto">
        {matchedCounselors.length === 0 ? (
          <EmptyMatches />
        ) : (
          <div className="space-y-3">
            {matchedCounselors.map((counselor, i) => (
              <MatchCard
                key={counselor.id}
                counselor={counselor}
                messages={state.messages[counselor.id] || []}
                onClick={() => setActiveChat(counselor)}
                delay={i * 0.08}
              />
            ))}
          </div>
        )}

        {/* Liked but not matched yet */}
        {state.liked.filter(id => !state.matches.includes(id)).length > 0 && (
          <div className="mt-6">
            <p className="text-gray-400 text-sm font-medium mb-3">Awaiting response</p>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {COUNSELORS.filter(c => state.liked.includes(c.id) && !state.matches.includes(c.id)).map(c => (
                <div key={c.id} className="flex-shrink-0 text-center">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-dashed border-violet-300 opacity-60">
                    <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-xs text-gray-400 mt-1 w-16 truncate">{c.name.split(' ')[0]}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

function MatchCard({ counselor, messages, onClick, delay }) {
  const lastMessage = messages[messages.length - 1];
  const unread = messages.filter(m => m.from === 'counselor' && !m.read).length;

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileTap={{ scale: 0.98 }}
      className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-gray-100 text-left"
    >
      <div className="relative flex-shrink-0">
        <div className={`w-14 h-14 rounded-2xl overflow-hidden ring-2`} style={{ ringColor: counselor.accentColor }}>
          <img src={counselor.image} alt={counselor.name} className="w-full h-full object-cover" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <h3 className="font-bold text-gray-900 text-sm truncate">{counselor.name}</h3>
          {lastMessage && (
            <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
              {formatTime(lastMessage.ts)}
            </span>
          )}
        </div>
        <p className="text-xs text-violet-600 font-medium mb-1">{counselor.title}</p>
        <p className="text-sm text-gray-500 truncate">
          {lastMessage ? lastMessage.text : 'Tap to start a conversation →'}
        </p>
      </div>

      {unread > 0 && (
        <div className="w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-bold">{unread}</span>
        </div>
      )}
    </motion.button>
  );
}

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function EmptyMatches() {
  return (
    <motion.div
      className="text-center py-16"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="text-6xl mb-4">💌</div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">No matches yet</h2>
      <p className="text-gray-500 text-sm max-w-xs mx-auto">
        When you connect with a counselor and they accept, they'll appear here. Keep exploring!
      </p>
    </motion.div>
  );
}

function ChatScreen({ counselor, onBack }) {
  const { state, dispatch } = useApp();
  const [input, setInput] = useState('');
  const messages = state.messages[counselor.id] || [];

  function send() {
    if (!input.trim()) return;
    const msg = { from: 'user', text: input.trim(), ts: Date.now(), read: true };
    dispatch({ type: 'SEND_MESSAGE', payload: { counselorId: counselor.id, message: msg } });
    setInput('');

    // Simulate auto-reply
    setTimeout(() => {
      const reply = {
        from: 'counselor',
        text: AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)],
        ts: Date.now() + 100,
        read: false,
      };
      dispatch({ type: 'RECEIVE_MESSAGE', payload: { counselorId: counselor.id, message: reply } });
    }, 1200 + Math.random() * 800);
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-4 border-b border-gray-100 bg-white/95 backdrop-blur-sm sticky top-0 z-10">
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 active:scale-90 transition-transform"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="w-10 h-10 rounded-xl overflow-hidden">
          <img src={counselor.image} alt={counselor.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-sm">{counselor.name}</h3>
          <p className="text-xs text-green-500 font-medium">● Online now</p>
        </div>
        <div className="flex items-center gap-1 text-amber-500">
          <Star size={13} fill="currentColor" />
          <span className="text-sm font-bold text-gray-800">{counselor.rating}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-6">
        {/* Welcome banner */}
        <div className="text-center py-2">
          <span className="text-xs bg-violet-50 text-violet-500 px-3 py-1 rounded-full font-medium">
            You matched with {counselor.name.split(' ')[0]} 💜
          </span>
        </div>

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}
            >
              {msg.from === 'counselor' && (
                <div className="w-7 h-7 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={counselor.image} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div
                className="max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                style={
                  msg.from === 'user'
                    ? { background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: 'white', borderBottomRightRadius: 4 }
                    : { background: '#f5f0ff', color: '#1f2937', borderBottomLeftRadius: 4 }
                }
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {messages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm">Say hi to {counselor.name.split(' ')[0]}! 👋</p>
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {[
                "Hi! I'd love to learn more about your approach.",
                "What does a first session look like?",
                "Do you have availability this week?",
              ].map(prompt => (
                <button
                  key={prompt}
                  onClick={() => setInput(prompt)}
                  className="text-sm bg-violet-50 text-violet-600 border border-violet-200 px-3 py-1.5 rounded-full font-medium active:bg-violet-100 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-4 pb-8 pt-3 border-t border-gray-100 bg-white flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Write a message..."
          className="flex-1 bg-gray-100 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none placeholder-gray-400 focus:bg-violet-50 focus:ring-2 focus:ring-violet-200 transition-all"
        />
        <motion.button
          onClick={send}
          disabled={!input.trim()}
          whileTap={input.trim() ? { scale: 0.88 } : {}}
          className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
          style={{
            background: input.trim() ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : '#e5e7eb',
          }}
        >
          <Send size={16} className={input.trim() ? 'text-white' : 'text-gray-400'} style={{ transform: 'translateX(1px)' }} />
        </motion.button>
      </div>
    </div>
  );
}
