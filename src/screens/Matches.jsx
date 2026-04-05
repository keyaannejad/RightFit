import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowLeft, Star, Calendar, Clock, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { COUNSELORS } from '../data/counselors';
import BottomNav from '../components/BottomNav';

const AUTO_REPLIES = [
  "Thank you so much for reaching out! I'm really glad you connected with me. I'd love to set up a free 15-minute intro call — when works best for you?",
  "Hi! Taking this step takes real courage, and I'm honored you chose to connect. I have openings this week. Would any of these times work?",
  "Hello! I've reviewed your profile and I genuinely think we'd work well together. Feel free to share whatever you're comfortable with — no pressure at all.",
  "Welcome! I specialize in exactly the areas you mentioned. Let's start with a conversation and go from there at your own pace.",
];

const BOOKING_REPLY = (date, time) =>
  `Perfect! I've confirmed our virtual meeting for ${date} at ${time}. You'll receive a calendar invite shortly with the video link. I'm really looking forward to connecting with you! 💜`;

// ─── Calendar helpers ────────────────────────────────────────────────
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS_SHORT = ['Su','Mo','Tu','We','Th','Fr','Sa'];
const TIME_SLOTS = ['9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM','2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM'];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

// ─── Main Matches screen ─────────────────────────────────────────────
export default function Matches() {
  const { state } = useApp();
  const location = useLocation();
  const [activeChat, setActiveChat] = useState(null);

  const matchedCounselors = COUNSELORS.filter(c => state.matches.includes(c.id));

  // Auto-open chat if navigated from match modal
  useEffect(() => {
    if (location.state?.openChatId) {
      const c = COUNSELORS.find(c => c.id === location.state.openChatId);
      if (c) setActiveChat(c);
    }
  }, [location.state]);

  if (activeChat) {
    return <ChatScreen counselor={activeChat} onBack={() => setActiveChat(null)} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-violet-50 to-white">
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

        {/* Pending (liked but not matched) */}
        {state.liked.filter(id => !state.matches.includes(id)).length > 0 && (
          <div className="mt-6">
            <p className="text-gray-400 text-sm font-medium mb-3">Awaiting response</p>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {COUNSELORS.filter(c => state.liked.includes(c.id) && !state.matches.includes(c.id)).map(c => (
                <div key={c.id} className="flex-shrink-0 text-center">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-dashed border-violet-300 opacity-60">
                    <img src={c.photo} alt={c.name} className="w-full h-full object-cover object-top" />
                  </div>
                  <p className="text-xs text-gray-400 mt-1 w-14 truncate">{c.name.split(' ')[0]}</p>
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
        <div className="w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-violet-200">
          <img src={counselor.photo} alt={counselor.name} className="w-full h-full object-cover object-top" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <h3 className="font-bold text-gray-900 text-sm truncate">{counselor.name}</h3>
          {lastMessage && <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{formatTime(lastMessage.ts)}</span>}
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

// ─── Chat screen ─────────────────────────────────────────────────────
function ChatScreen({ counselor, onBack }) {
  const { state, dispatch } = useApp();
  const [input, setInput] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [bookedSlot, setBookedSlot] = useState(null);
  const messagesEndRef = useRef(null);
  const messages = state.messages[counselor.id] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showCalendar]);

  // Auto-reply if we have no counselor reply yet
  useEffect(() => {
    if (messages.length === 1 && messages[0].from === 'user') {
      const timer = setTimeout(() => {
        dispatch({
          type: 'RECEIVE_MESSAGE',
          payload: {
            counselorId: counselor.id,
            message: { from: 'counselor', text: AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)], ts: Date.now(), read: false },
          },
        });
      }, 1400 + Math.random() * 600);
      return () => clearTimeout(timer);
    }
  }, [messages.length]);

  function send(text) {
    if (!text?.trim()) return;
    dispatch({ type: 'SEND_MESSAGE', payload: { counselorId: counselor.id, message: { from: 'user', text: text.trim(), ts: Date.now(), read: true } } });
    setInput('');

    // Auto reply after a pause
    setTimeout(() => {
      dispatch({
        type: 'RECEIVE_MESSAGE',
        payload: {
          counselorId: counselor.id,
          message: { from: 'counselor', text: AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)], ts: Date.now(), read: false },
        },
      });
    }, 1500 + Math.random() * 1000);
  }

  function handleBooking(date, time) {
    setShowCalendar(false);
    setBookedSlot({ date, time });

    const userMsg = `I'd like to book a virtual meeting on ${date} at ${time}. Does that work for you?`;
    dispatch({ type: 'SEND_MESSAGE', payload: { counselorId: counselor.id, message: { from: 'user', text: userMsg, ts: Date.now(), read: true } } });

    setTimeout(() => {
      dispatch({
        type: 'RECEIVE_MESSAGE',
        payload: {
          counselorId: counselor.id,
          message: { from: 'counselor', text: BOOKING_REPLY(date, time), ts: Date.now(), read: false },
        },
      });
    }, 1200);
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-4 border-b border-gray-100 bg-white/95 backdrop-blur-sm sticky top-0 z-10">
        <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 active:scale-90 transition-transform">
          <ArrowLeft size={18} />
        </button>
        <div className="w-10 h-10 rounded-xl overflow-hidden">
          <img src={counselor.photo} alt={counselor.name} className="w-full h-full object-cover object-top" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-sm">{counselor.name}</h3>
          <p className="text-xs text-green-500 font-medium">● Online now</p>
        </div>
        <div className="flex items-center gap-1">
          <Star size={13} className="text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-bold text-gray-800">{counselor.rating}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-4">
        {/* Match banner */}
        <div className="text-center py-2">
          <span className="text-xs bg-violet-50 text-violet-500 px-3 py-1 rounded-full font-medium">
            You matched with {counselor.name.split(' ')[0]} 💜
          </span>
        </div>

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}
            >
              {msg.from === 'counselor' && (
                <div className="w-7 h-7 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={counselor.photo} alt="" className="w-full h-full object-cover object-top" />
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

        {/* Empty state prompts */}
        {messages.length === 0 && (
          <div className="text-center py-6">
            <p className="text-gray-400 text-sm mb-4">Say hi to {counselor.name.split(' ')[0]}! 👋</p>
            <div className="flex flex-col gap-2">
              {[
                `Hi ${counselor.name.split(' ')[0]}! I'd love to learn more about your approach.`,
                "What does a first session look like?",
                "Do you have availability this week?",
              ].map(prompt => (
                <button
                  key={prompt}
                  onClick={() => send(prompt)}
                  className="text-sm bg-violet-50 text-violet-600 border border-violet-200 px-4 py-2.5 rounded-xl font-medium active:bg-violet-100 transition-colors text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Calendar widget */}
        <AnimatePresence>
          {showCalendar && (
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            >
              <CalendarPicker counselor={counselor} onBook={handleBooking} onCancel={() => setShowCalendar(false)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Booked confirmation banner */}
        {bookedSlot && !showCalendar && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3"
          >
            <div className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Check size={18} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-green-800 text-sm">Meeting Booked!</p>
              <p className="text-green-600 text-xs">{bookedSlot.date} at {bookedSlot.time} · Virtual</p>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Book a meeting button */}
      {!showCalendar && (
        <div className="px-4 pt-2 pb-1">
          <button
            onClick={() => setShowCalendar(true)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-violet-200 text-violet-600 font-semibold text-sm bg-violet-50 hover:bg-violet-100 transition-colors"
          >
            <Calendar size={16} />
            Book a Virtual Meeting
          </button>
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-8 pt-2 border-t border-gray-100 bg-white flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send(input)}
          placeholder="Write a message..."
          className="flex-1 bg-gray-100 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none placeholder-gray-400 focus:bg-violet-50 focus:ring-2 focus:ring-violet-200 transition-all"
        />
        <motion.button
          onClick={() => send(input)}
          disabled={!input.trim()}
          whileTap={input.trim() ? { scale: 0.88 } : {}}
          className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: input.trim() ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : '#e5e7eb' }}
        >
          <Send size={16} className={input.trim() ? 'text-white' : 'text-gray-400'} style={{ transform: 'translateX(1px)' }} />
        </motion.button>
      </div>
    </div>
  );
}

// ─── Calendar picker ─────────────────────────────────────────────────
function CalendarPicker({ counselor, onBook, onCancel }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  function isPast(day) {
    const d = new Date(viewYear, viewMonth, day);
    const t = new Date(); t.setHours(0,0,0,0);
    return d < t;
  }

  function formatSelected() {
    if (!selectedDate) return '';
    return new Date(viewYear, viewMonth, selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  }

  return (
    <div className="bg-white rounded-2xl border border-violet-100 shadow-lg overflow-hidden mx-1">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-white" />
          <span className="text-white font-bold text-sm">Book a Virtual Meeting</span>
        </div>
        <button onClick={onCancel} className="text-white/70 hover:text-white">
          <X size={16} />
        </button>
      </div>

      <div className="p-4">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-3">
          <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500">
            <ChevronLeft size={16} />
          </button>
          <span className="font-bold text-gray-900 text-sm">{MONTHS[viewMonth]} {viewYear}</span>
          <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500">
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-1">
          {DAYS_SHORT.map(d => (
            <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-y-1">
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
            const past = isPast(day);
            const selected = selectedDate === day;
            return (
              <button
                key={day}
                disabled={past}
                onClick={() => { setSelectedDate(day); setSelectedTime(null); }}
                className="h-8 w-8 mx-auto rounded-full text-sm font-medium transition-all flex items-center justify-center"
                style={{
                  background: selected ? '#7c3aed' : 'transparent',
                  color: selected ? 'white' : past ? '#d1d5db' : '#374151',
                }}
              >
                {day}
              </button>
            );
          })}
        </div>

        {/* Time slots */}
        <AnimatePresence>
          {selectedDate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 overflow-hidden"
            >
              <div className="flex items-center gap-1.5 mb-2">
                <Clock size={13} className="text-violet-500" />
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Available times — {formatSelected()}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {TIME_SLOTS.map(t => (
                  <button
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    className="py-2.5 rounded-xl text-sm font-semibold border-2 transition-all"
                    style={{
                      borderColor: selectedTime === t ? '#7c3aed' : '#e5e7eb',
                      background: selectedTime === t ? '#f5f0ff' : 'white',
                      color: selectedTime === t ? '#7c3aed' : '#374151',
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confirm */}
        <AnimatePresence>
          {selectedDate && selectedTime && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => onBook(formatSelected(), selectedTime)}
              className="w-full mt-4 py-3.5 rounded-2xl font-bold text-white flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
            >
              <Check size={17} />
              Confirm — {formatSelected()} at {selectedTime}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function EmptyMatches() {
  return (
    <motion.div className="text-center py-16" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <div className="text-6xl mb-4">💌</div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">No matches yet</h2>
      <p className="text-gray-500 text-sm max-w-xs mx-auto">
        When you connect with a counselor and they accept, they'll appear here. Keep exploring!
      </p>
    </motion.div>
  );
}

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
