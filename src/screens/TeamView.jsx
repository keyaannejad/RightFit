import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Eye, Users, Calendar, MessageSquare, TrendingUp, BarChart2, ChevronLeft } from 'lucide-react';
import BottomNav from '../components/BottomNav';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const TODAY_IDX = new Date().getDay();

const RECENT_BOOKINGS = [
  { id: 6, name: 'User 6', email: 'user6@example.com', date: 'Mar 23, 3:57 AM', status: 'confirmed', unread: 3 },
  { id: 5, name: 'User 5', email: 'user5@example.com', date: 'Mar 22, 11:57 PM', status: 'confirmed', unread: 0 },
  { id: 4, name: 'User 4', email: 'user4@example.com', date: 'Mar 22, 8:14 PM', status: 'pending', unread: 1 },
  { id: 3, name: 'User 3', email: 'user3@example.com', date: 'Mar 21, 4:22 PM', status: 'confirmed', unread: 0 },
  { id: 2, name: 'User 2', email: 'user2@example.com', date: 'Mar 20, 2:10 PM', status: 'confirmed', unread: 0 },
];

const AGE_GROUPS = [
  { label: '18–24 years', users: 1843, pct: 18 },
  { label: '25–34 years', users: 3586, pct: 35 },
  { label: '35–44 years', users: 2562, pct: 25 },
  { label: '45–54 years', users: 1638, pct: 16 },
  { label: '55+ years',   users: 618,  pct: 6  },
];

const PLATFORM_STATS = [
  { label: 'Total Users',         value: '10,247', change: '+12.5%', changeColor: '#22c55e', icon: '👥', bg: '#eff6ff', iconBg: '#dbeafe' },
  { label: 'Total Counselors',    value: '3,512',  change: '+8.3%',  changeColor: '#22c55e', icon: '🩺', bg: '#f0fdf4', iconBg: '#dcfce7' },
  { label: 'Active Bookings',     value: '1,856',  badge: 'Live',    badgeColor: '#f97316', icon: '📅', bg: '#fff7ed', iconBg: '#fed7aa' },
  { label: 'Completed Sessions',  value: '28,934', badge: 'All time',badgeColor: '#3b82f6', icon: '✅', bg: '#eff6ff', iconBg: '#dbeafe' },
];

export default function TeamView() {
  const [tab, setTab] = useState('dashboard'); // 'dashboard' | 'analytics'

  return (
    <div className="min-h-dvh flex flex-col bg-gradient-to-b from-violet-50 to-white content-bottom">
      {/* Header */}
      <div className="px-5 pb-4 screen-top">
        <h1 className="text-2xl font-bold text-gray-900">
          {tab === 'dashboard' ? 'Counselor Dashboard' : 'Team Analytics'} 📊
        </h1>
        <p className="text-gray-400 text-sm mt-0.5">
          {tab === 'dashboard' ? 'Manage your sessions and availability' : 'Platform-wide metrics and insights'}
        </p>
      </div>

      {/* Tab switcher */}
      <div className="px-5 mb-5">
        <div className="bg-gray-100 rounded-2xl p-1 flex gap-1">
          <TabBtn active={tab === 'dashboard'} onClick={() => setTab('dashboard')} icon={<BookOpen size={15} />} label="Counselor Dashboard" />
          <TabBtn active={tab === 'analytics'} onClick={() => setTab('analytics')} icon={<BarChart2 size={15} />} label="Team Analytics" />
        </div>
      </div>

      <div className="px-5 overflow-y-auto flex-1 scroll-touch pb-4">
        <AnimatePresence mode="wait">
          {tab === 'dashboard' ? (
            <motion.div key="dash" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.25 }}>
              <CounselorDashboard />
            </motion.div>
          ) : (
            <motion.div key="analytics" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
              <AnalyticsDashboard />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
}

function TabBtn({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all"
      style={active ? { background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: 'white' } : { color: '#6b7280' }}
    >
      {icon}{label}
    </button>
  );
}

// ─── Counselor Dashboard ──────────────────────────────────────────────
function CounselorDashboard() {
  const [selectedDay, setSelectedDay] = useState(TODAY_IDX);

  const TIMES = ['9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM'];
  const BOOKED_SLOTS = { 1: ['10:00 AM', '2:00 PM'], 3: ['9:00 AM', '11:00 AM', '3:00 PM'], 5: ['1:00 PM'] };

  return (
    <div className="space-y-5">
      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3">
        <DashStatCard label="Total Bookings" value={8}  color="#3b82f6" icon={<BookOpen size={20} className="text-white" />} />
        <DashStatCard label="Profile Views"  value={24} color="#22c55e" icon={<Eye size={20} className="text-white" />} />
        <DashStatCard label="Connections"    value={5}  color="#f97316" icon={<Users size={20} className="text-white" />} />
      </div>

      {/* Weekly Availability */}
      <div className="bg-white rounded-2xl p-5 card-shadow">
        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-base">
          <Calendar size={17} className="text-violet-500" /> Weekly Availability
        </h2>

        {/* Day selector */}
        <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
          {DAYS.map((d, i) => (
            <button
              key={d}
              onClick={() => setSelectedDay(i)}
              className="flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all"
              style={
                selectedDay === i
                  ? { background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: 'white' }
                  : { background: '#f3f4f6', color: '#374151' }
              }
            >
              {d}
            </button>
          ))}
        </div>

        {/* Time grid */}
        <div className="space-y-2">
          {TIMES.map(time => {
            const isBooked = (BOOKED_SLOTS[selectedDay] || []).includes(time);
            return (
              <div key={time} className="flex items-center gap-3">
                <span className="text-xs text-gray-400 w-16 flex-shrink-0">{time}</span>
                <div
                  className="flex-1 h-8 rounded-lg flex items-center px-3 text-xs font-medium transition-all"
                  style={
                    isBooked
                      ? { background: '#f5f0ff', color: '#7c3aed', border: '1.5px solid #ddd6fe' }
                      : { background: '#f9fafb', color: '#9ca3af' }
                  }
                >
                  {isBooked ? '📅 Session booked' : 'Available'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl p-5 card-shadow">
        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-base">
          <Users size={17} className="text-violet-500" /> Recent Bookings
        </h2>
        <div className="space-y-3">
          {RECENT_BOOKINGS.map(b => (
            <div key={b.id} className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Users size={16} className="text-violet-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900 text-sm">{b.name}</span>
                  <span
                    className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                    style={b.status === 'confirmed'
                      ? { background: '#dcfce7', color: '#16a34a' }
                      : { background: '#fef3c7', color: '#d97706' }}
                  >
                    {b.status}
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-0.5">{b.email}</div>
                <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                  🕐 {b.date}
                </div>
              </div>
              <div className="relative flex-shrink-0">
                <MessageSquare size={18} className="text-gray-400" />
                {b.unread > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full text-white flex items-center justify-center font-bold" style={{ fontSize: 9 }}>
                    {b.unread}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DashStatCard({ label, value, color, icon }) {
  return (
    <div className="rounded-2xl p-4 flex flex-col gap-3" style={{ background: color }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
        {icon}
      </div>
      <div>
        <div className="text-white/80 text-xs leading-tight">{label}</div>
        <div className="text-white text-2xl font-bold">{value}</div>
      </div>
    </div>
  );
}

// ─── Team Analytics ───────────────────────────────────────────────────
function AnalyticsDashboard() {
  return (
    <div className="space-y-5">
      {/* Platform stats */}
      <div className="grid grid-cols-2 gap-3">
        {PLATFORM_STATS.map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 card-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{ background: s.iconBg }}>
                {s.icon}
              </div>
              {s.change && <span className="text-xs font-bold" style={{ color: s.changeColor }}>{s.change}</span>}
              {s.badge && <span className="text-xs font-bold" style={{ color: s.badgeColor }}>{s.badge}</span>}
            </div>
            <div className="text-gray-500 text-xs leading-tight">{s.label}</div>
            <div className="text-xl font-bold text-gray-900 mt-0.5">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Counselor:User Ratio */}
      <div className="bg-white rounded-2xl p-5 card-shadow">
        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-base">
          <TrendingUp size={17} className="text-violet-500" /> Counselor:User Ratio
        </h2>
        <div className="text-center py-4">
          <div className="text-5xl font-bold text-violet-600 mb-1">1:2.9</div>
          <div className="text-gray-400 text-sm">Average users per counselor</div>
        </div>

        {/* Bar visualization */}
        <div className="flex items-end justify-center gap-4 h-20 mt-4 px-4">
          <div className="flex flex-col items-center gap-1 flex-1">
            <div className="w-full rounded-t-lg" style={{ height: 60, background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }} />
            <span className="text-xs text-gray-500 font-semibold">3,512</span>
            <span className="text-xs text-gray-400">Counselors</span>
          </div>
          <div className="flex flex-col items-center gap-1 flex-1">
            <div className="w-full rounded-t-lg" style={{ height: '100%', background: 'linear-gradient(135deg, #3b82f6, #60a5fa)' }} />
            <span className="text-xs text-gray-500 font-semibold">10,247</span>
            <span className="text-xs text-gray-400">Users</span>
          </div>
        </div>
      </div>

      {/* Age Distribution */}
      <div className="bg-white rounded-2xl p-5 card-shadow">
        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-base">
          <BarChart2 size={17} className="text-violet-500" /> User Age Distribution
        </h2>
        <div className="space-y-3.5">
          {AGE_GROUPS.map((g, i) => (
            <div key={g.label}>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-gray-600 font-medium">{g.label}</span>
                <div className="flex gap-3">
                  <span className="text-gray-400">{g.users.toLocaleString()} users</span>
                  <span className="font-bold text-violet-600">{g.pct}%</span>
                </div>
              </div>
              <div className="h-8 bg-gray-100 rounded-xl overflow-hidden">
                <motion.div
                  className="h-full rounded-xl flex items-center justify-end pr-2"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${g.pct}%` }}
                  transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="text-white text-xs font-bold">{g.pct}%</span>
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
