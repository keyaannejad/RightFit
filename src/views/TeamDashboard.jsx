import { useState } from 'react';
import { BookOpen, Eye, Users, Calendar, MessageSquare, TrendingUp } from 'lucide-react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const TODAY_IDX = new Date().getDay();

const RECENT_BOOKINGS = [
  { id: 6, name: 'User 6', email: 'user6@example.com', date: 'Mar 23, 3:57 AM', status: 'confirmed', unread: 3 },
  { id: 5, name: 'User 5', email: 'user5@example.com', date: 'Mar 22, 11:57 PM', status: 'confirmed', unread: 0 },
  { id: 4, name: 'User 4', email: 'user4@example.com', date: 'Mar 22, 8:14 PM', status: 'pending', unread: 1 },
  { id: 3, name: 'User 3', email: 'user3@example.com', date: 'Mar 21, 4:22 PM', status: 'confirmed', unread: 0 },
];

const AGE_GROUPS = [
  { label: '18-24 years', users: 1843, pct: 18 },
  { label: '25-34 years', users: 3586, pct: 35 },
  { label: '35-44 years', users: 2562, pct: 25 },
  { label: '45-54 years', users: 1638, pct: 16 },
  { label: '55+ years',   users: 618,  pct: 6  },
];

export default function TeamDashboard({ onSwitchView }) {
  const [activeTab, setActiveTab] = useState('counselor'); // 'counselor' | 'analytics'

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Sub-tabs */}
      <div className="flex justify-center mb-8 gap-3">
        <button
          onClick={() => { setActiveTab('counselor'); onSwitchView('counselor'); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <BookOpen size={15} /> Client View
        </button>
        <button
          onClick={() => setActiveTab(activeTab === 'counselor' ? 'analytics' : 'counselor')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium"
          style={{ background: '#f97316', color: 'white' }}
        >
          <TrendingUp size={15} /> {activeTab === 'analytics' ? 'Counselor View' : 'Team Analytics'}
        </button>
      </div>

      {activeTab === 'counselor' ? <CounselorDashboard /> : <AnalyticsDashboard />}
    </div>
  );
}

function CounselorDashboard() {
  const [selectedDay, setSelectedDay] = useState(TODAY_IDX);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Counselor Dashboard</h1>

      {/* Stat cards */}
      <div className="bg-white rounded-2xl p-6 card-shadow">
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Total Bookings" value={8} color="#3b82f6" icon={<BookOpen size={22} className="text-white" />} />
          <StatCard label="Profile Views" value={0} color="#22c55e" icon={<Eye size={22} className="text-white" />} />
          <StatCard label="Connections" value={0} color="#f97316" icon={<Users size={22} className="text-white" />} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Availability */}
        <div className="bg-white rounded-2xl p-6 card-shadow">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar size={18} className="text-[#f97316]" /> Weekly Availability
          </h2>
          {/* Day selector */}
          <div className="flex gap-1.5 mb-4 flex-wrap">
            {DAYS.map((d, i) => (
              <button
                key={d}
                onClick={() => setSelectedDay(i)}
                className="px-3 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: selectedDay === i ? '#3b82f6' : '#f3f4f6',
                  color: selectedDay === i ? 'white' : '#374151',
                }}
              >
                {d}
              </button>
            ))}
          </div>
          {/* Time grid */}
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {['12:00 AM','1:00 AM','2:00 AM','3:00 AM','4:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM'].map(time => (
              <div key={time} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-16 flex-shrink-0">{time}</span>
                <div className="flex gap-1 flex-1">
                  <div className="flex-1 h-7 bg-gray-100 rounded text-center text-xs text-gray-400 flex items-center justify-center">:00</div>
                  <div className="flex-1 h-7 bg-gray-100 rounded text-center text-xs text-gray-400 flex items-center justify-center">:30</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl p-6 card-shadow">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Users size={18} className="text-[#f97316]" /> Recent Bookings
          </h2>
          <div className="space-y-3">
            {RECENT_BOOKINGS.map(b => (
              <div key={b.id} className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users size={16} className="text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900 text-sm">{b.name}</span>
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ background: b.status === 'confirmed' ? '#dcfce7' : '#fef3c7', color: b.status === 'confirmed' ? '#16a34a' : '#d97706' }}
                    >
                      {b.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">{b.email}</div>
                  <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <span>🕐</span> {b.date}
                  </div>
                </div>
                <div className="relative flex-shrink-0">
                  <MessageSquare size={18} className="text-gray-400" />
                  {b.unread > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold" style={{fontSize:9}}>
                      {b.unread}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color, icon }) {
  return (
    <div className="rounded-xl p-5 flex items-center justify-between" style={{ background: color }}>
      <div>
        <div className="text-white/80 text-sm mb-1">{label}</div>
        <div className="text-white text-3xl font-bold">{value}</div>
      </div>
      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
        {icon}
      </div>
    </div>
  );
}

function AnalyticsDashboard() {
  const stats = [
    { label: 'Total Users', value: '10,247', change: '+12.5%', color: '#eff6ff', iconBg: '#dbeafe', icon: '👥' },
    { label: 'Total Counselors', value: '3,512', change: '+8.3%', color: '#f0fdf4', iconBg: '#dcfce7', icon: '🩺' },
    { label: 'Active Bookings', value: '1,856', badge: 'Live', badgeColor: '#f97316', color: '#fff7ed', iconBg: '#fed7aa', icon: '📊' },
    { label: 'Completed Sessions', value: '28,934', badge: 'All time', badgeColor: '#3b82f6', color: '#eff6ff', iconBg: '#dbeafe', icon: '✅' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Team Analytics Dashboard</h1>
        <p className="text-gray-400 mt-1">Platform-wide metrics and insights</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 card-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: s.iconBg }}>
                {s.icon}
              </div>
              {s.change && <span className="text-xs font-semibold text-green-500">{s.change}</span>}
              {s.badge && <span className="text-xs font-semibold" style={{ color: s.badgeColor }}>{s.badge}</span>}
            </div>
            <div className="text-gray-500 text-sm">{s.label}</div>
            <div className="text-2xl font-bold text-gray-900 mt-0.5">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Counselor:User Ratio */}
        <div className="bg-white rounded-2xl p-6 card-shadow">
          <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
            <span className="text-[#f97316]">📊</span> Counselor:User Ratio
          </h2>
          <div className="text-center py-6">
            <div className="text-6xl font-bold text-[#3b82f6]">1:2.9</div>
            <div className="text-gray-400 mt-2">Average users per counselor</div>
          </div>
          <div className="flex justify-center gap-12 pt-4 border-t border-gray-100">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">10,247</div>
              <div className="text-gray-400 text-sm">Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">3,512</div>
              <div className="text-gray-400 text-sm">Counselors</div>
            </div>
          </div>
        </div>

        {/* Age Distribution */}
        <div className="bg-white rounded-2xl p-6 card-shadow">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-[#22c55e]">📊</span> User Age Distribution
          </h2>
          <div className="space-y-4">
            {AGE_GROUPS.map(g => (
              <div key={g.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{g.label}</span>
                  <div className="flex gap-3">
                    <span className="text-gray-400">{g.users.toLocaleString()} users</span>
                    <span className="font-bold text-[#22c55e]">{g.pct}%</span>
                  </div>
                </div>
                <div className="h-7 bg-gray-100 rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-[#22c55e] rounded-lg flex items-center justify-end pr-2 transition-all"
                    style={{ width: `${g.pct}%` }}
                  >
                    <span className="text-white text-xs font-semibold">{g.pct}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
