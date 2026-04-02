import { Shield, Clock, Activity, Star, AlertCircle, Search, Calendar, Bell, SlidersHorizontal, Eye, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, LabelList } from 'recharts';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

// Since the application is local and freshly spun up,
// we will start with empty/initial stats unless the backend provides them.
const initialActivityData = [
    { name: 'Mon', minutes: 0 },
    { name: 'Tue', minutes: 0 },
    { name: 'Wed', minutes: 0 },
    { name: 'Thu', minutes: 0 },
    { name: 'Fri', minutes: 0 },
    { name: 'Sat', minutes: 0 },
    { name: 'Sun', minutes: 0 },
];

const initialTopicData = [];

export default function ParentDashboard({ session }) {
    const [stats, setStats] = useState(null);
    const [filterLevel, setFilterLevel] = useState('Strict');
    const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        let intervalId;
        const fetchStats = () => {
            if (session?.sessionId) {
                fetch(`${API_URL}/dashboard?sessionId=${session.sessionId}`)
                    .then(r => r.json())
                    .then(d => setStats(d))
                    .catch(console.error);
            }
        };

        if (session?.sessionId) {
            fetchStats();
            intervalId = setInterval(fetchStats, 5000);
        } else {
            // Fresh instance, start at 0
            setStats({
                conversationsCount: 0,
                exercisesCompleted: 0,
                rewards: { stars: 0 },
                sessionDuration: 0
            });
        }
        return () => { if (intervalId) clearInterval(intervalId); };
    }, [session]);

    const toggleFilterLevel = () => {
        setFilterLevel(prev => prev === 'Strict' ? 'Moderate' : 'Strict');
    };

    if (!stats) return <div className="p-8 text-center text-xl font-bold text-slate-500 min-h-screen bg-slate-50 flex items-center justify-center">Loading Dashboard...</div>;

    // Helper to format minutes into hrs and mins
    const formatTime = (minutes) => {
        if (!minutes) return "0m";
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        if (h > 0) return `${h}h ${m}m`;
        return `${m}m`;
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 flex flex-col sticky top-0 md:h-screen z-20 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] md:shadow-none">
                <div className="p-6 flex items-center justify-between border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <div className="bg-indigo-500 p-2 rounded-xl text-white">
                            <Shield size={20} />
                        </div>
                        <span className="text-xl font-black text-slate-800">Parent Panel</span>
                    </div>
                    <button className="md:hidden text-slate-500 hover:text-indigo-600 p-2 -mr-2" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                <div className={`${isSidebarOpen ? 'flex' : 'hidden'} md:flex flex-col flex-1 absolute md:static top-full left-0 w-full md:w-auto bg-white border-b md:border-b-0 border-slate-200 shadow-lg md:shadow-none z-30`}>
                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                        <button
                            onClick={() => { setActiveTab('overview'); setIsSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'overview' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                        >
                            <Activity size={20} /> Overview
                        </button>
                        <button
                            onClick={() => { setActiveTab('history'); setIsSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'history' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                        >
                            <Eye size={20} /> Chat History
                        </button>
                        <button
                            onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'settings' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                        >
                            <SlidersHorizontal size={20} /> Safety Settings
                        </button>
                    </nav>

                    <div className="p-4 border-t border-slate-100">
                        <Link to="/" className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors">
                            Back to Home
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-800">Dashboard Overview</h1>
                        <p className="text-slate-500 font-medium mt-1">Monitor learning progress and safety metrics.</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="bg-white border border-slate-200 rounded-full px-4 py-2 flex items-center gap-2 shadow-sm text-sm font-bold text-slate-600">
                            <Calendar size={16} /> Last 7 Days
                        </div>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-500 flex items-center justify-center"><Clock size={24} /></div>
                            <span className="font-bold text-slate-500">Screen Time</span>
                        </div>
                        <div>
                            <div className="text-4xl font-black text-slate-800">{formatTime(stats.sessionDuration || 5)}</div>
                            <div className="text-sm font-bold text-slate-400 mt-2 bg-slate-100 inline-block px-2 py-1 rounded-md">Current Session</div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-500 flex items-center justify-center"><Activity size={24} /></div>
                            <span className="font-bold text-slate-500">Interactions</span>
                        </div>
                        <div>
                            <div className="text-4xl font-black text-slate-800">{stats.conversationsCount} <span className="text-xl text-slate-400">msgs</span></div>
                            <div className="text-sm font-bold text-slate-400 mt-2 bg-slate-100 inline-block px-2 py-1 rounded-md">Real-time</div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-yellow-100 text-yellow-500 flex items-center justify-center"><Star size={24} /></div>
                            <span className="font-bold text-slate-500">Rewards</span>
                        </div>
                        <div>
                            <div className="text-4xl font-black text-slate-800">{stats.rewards?.stars || 0} <span className="text-xl text-slate-400">★</span></div>
                            <div className="text-sm font-bold text-slate-400 mt-2 bg-slate-100 inline-block px-2 py-1 rounded-md">Real-time</div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center"><AlertCircle size={24} /></div>
                            <span className="font-bold text-slate-500">Flags</span>
                        </div>
                        <div>
                            <div className="text-4xl font-black text-slate-800">{stats.flagsCount !== undefined ? stats.flagsCount : 0}</div>
                            <div className="text-sm font-bold text-slate-400 mt-2 bg-slate-100 inline-block px-2 py-1 rounded-md">{(stats.flagsCount || 0) > 0 ? 'Action required' : 'No safety issues'}</div>
                        </div>
                    </div>
                </div>

                {activeTab === 'history' && (
                    <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm mb-8 animate-fade-in">
                        <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-4">
                            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                                <Search size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-800">Detailed Chat History</h3>
                                <p className="text-slate-500 font-medium">Review your child's interactions with SafeChat Kids.</p>
                            </div>
                        </div>
                        
                        <div className="space-y-6">
                            {!stats.chatHistory || stats.chatHistory.length === 0 ? (
                                <p className="text-center text-slate-500 font-medium py-10">No messages found for this session yet.</p>
                            ) : (
                                stats.chatHistory.map((msg, i) => (
                                    <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                        <div className="flex items-center gap-2 mb-1 px-2">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{msg.role === 'user' ? 'Child' : 'SafeChat'}</span>
                                            {msg.is_flagged ? <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><AlertCircle size={10} /> Flagged</span> : null}
                                        </div>
                                        <div className={`p-4 rounded-2xl max-w-[85%] text-[15px] font-medium leading-relaxed relative ${msg.role === 'user' ? (msg.is_flagged ? 'bg-red-50 border border-red-200 text-red-900 rounded-tr-sm' : 'bg-slate-100 text-slate-800 rounded-tr-sm') : 'bg-indigo-50 text-indigo-900 rounded-tl-sm'}`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'overview' && (
                    <>
                        {/* Charts Row */}
                        <div className="grid lg:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm lg:col-span-2">
                                <h3 className="text-xl font-bold text-slate-800 mb-6">Activity Timeline (Minutes)</h3>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={stats.activityTimeline || initialActivityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontWeight: 600 }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontWeight: 600 }} />
                                            <Tooltip wrapperStyle={{ outline: 'none' }} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                                            <Area type="monotone" dataKey="minutes" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorMin)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                <h3 className="text-xl font-bold text-slate-800 mb-6">Topics Formulated</h3>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={stats.topicBreakdown || initialTopicData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                                            <XAxis type="number" hide />
                                            <YAxis dataKey="subject" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontWeight: 600 }} width={70} />
                                            <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                            <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24}>
                                                <LabelList dataKey="count" position="right" fill="#64748b" fontWeight="bold"/>
                                            </Bar>
                                            {!stats.topicBreakdown && <text x="50%" y="50%" textAnchor="middle" fill="#94a3b8" className="font-bold">No questions asked yet.</text>}
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Filter Settings Segment */}
                {(activeTab === 'settings' || activeTab === 'overview') && (
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm mt-8 animate-fade-in">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-emerald-100 p-4 rounded-2xl text-emerald-600">
                                    <Shield size={32} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">Safety Filter: {filterLevel}</h3>
                                    <p className="text-slate-500 font-medium">Currently configured for {session?.age ? session.age + ' year olds' : 'General'}. Blocks inappropriate content.</p>
                                </div>
                            </div>
                            <button
                                onClick={toggleFilterLevel}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-xl transition-colors shrink-0"
                            >
                                Change to {filterLevel === 'Strict' ? 'Moderate' : 'Strict'}
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
