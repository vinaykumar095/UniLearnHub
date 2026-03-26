import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell, CheckCheck, Loader2, BookOpen, Briefcase,
    Info, Users, ShieldAlert, Zap, UserCircle,
    Filter, CheckCircle2, Clock, LayoutGrid
} from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';



type NotiCategory = 'ENROLLMENT' | 'ACTIVITY' | 'ADMIN' | 'PLACEMENT' | 'COURSE' | 'REGISTRATION' | 'GENERAL' | 'APPLICATION';

const categorize = (msg: string): NotiCategory => {
    const m = msg.toLowerCase();
    if (m.includes('enrolled') || m.includes('enrollment')) return 'ENROLLMENT';
    if (m.includes('submission') || m.includes('progress') || m.includes('quiz') || m.includes('assignment')) return 'ACTIVITY';
    if (m.includes('registration') || m.includes('register') || m.includes('institution') || m.includes('recruiter')) return 'REGISTRATION';
    if (m.includes('admin') || m.includes('system') || m.includes('update') || m.includes('notice')) return 'ADMIN';
    if (m.includes('placement') || m.includes('drive') || m.includes('interview') || m.includes('placement alert')) return 'PLACEMENT';
    if (m.includes('course') || m.includes('material') || m.includes('approved') || m.includes('course update')) return 'COURSE';
    if (m.includes('application') || m.includes('applied')) return 'APPLICATION';
    return 'GENERAL';
};

const CAT_META: Record<NotiCategory, { label: string; icon: any; unreadClass: string; iconBg: string; dotColor: string }> = {
    ENROLLMENT: { label: 'Enrollment', icon: Users, unreadClass: 'border-blue-200 bg-blue-50/30', iconBg: 'bg-blue-100 text-blue-600', dotColor: 'bg-blue-500' },
    ACTIVITY: { label: 'Student Activity', icon: Zap, unreadClass: 'border-purple-200 bg-purple-50/30', iconBg: 'bg-purple-100 text-purple-600', dotColor: 'bg-purple-500' },
    REGISTRATION: { label: 'Registration', icon: UserCircle, unreadClass: 'border-amber-200 bg-amber-50/30', iconBg: 'bg-amber-100 text-amber-600', dotColor: 'bg-amber-500' },
    ADMIN: { label: 'Admin Message', icon: ShieldAlert, unreadClass: 'border-red-200 bg-red-50/30', iconBg: 'bg-red-100 text-red-600', dotColor: 'bg-red-500' },
    PLACEMENT: { label: 'Placement', icon: Briefcase, unreadClass: 'border-emerald-200 bg-emerald-50/30', iconBg: 'bg-emerald-100 text-emerald-600', dotColor: 'bg-emerald-500' },
    APPLICATION: { label: 'Job Application', icon: Briefcase, unreadClass: 'border-emerald-200 bg-emerald-50/30', iconBg: 'bg-emerald-100 text-emerald-600', dotColor: 'bg-emerald-500' },
    COURSE: { label: 'Course Update', icon: BookOpen, unreadClass: 'border-indigo-200 bg-indigo-50/30', iconBg: 'bg-indigo-100 text-indigo-600', dotColor: 'bg-indigo-500' },
    GENERAL: { label: 'General', icon: Info, unreadClass: 'border-slate-200', iconBg: 'bg-slate-100 text-slate-500', dotColor: 'bg-slate-400' },
};

const FILTERS: { id: string; label: string }[] = [
    { id: 'ALL', label: 'All' },
    { id: 'REGISTRATION', label: 'Registrations' },
    { id: 'ENROLLMENT', label: 'Enrollments' },
    { id: 'ACTIVITY', label: 'Activity' },
    { id: 'ADMIN', label: 'Admin' },
    { id: 'PLACEMENT', label: 'Placement' },
    { id: 'APPLICATION', label: 'Applications' },
    { id: 'COURSE', label: 'Courses' },
];



const Notifications = () => {
    const { user } = useAuth();
    const isFaculty = user?.role === 'FACULTY';

    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [markingAll, setMarkingAll] = useState(false);
    const [filter, setFilter] = useState('ALL');

    const load = async () => {
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { load(); }, []);

    const markRead = async (id: string) => {
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
        } catch (e) { console.error(e); }
    };

    const markAllRead = async () => {
        setMarkingAll(true);
        try {
            await api.patch('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (e) {
            
            const unread = notifications.filter(n => !n.read);
            await Promise.all(unread.map(n => api.patch(`/notifications/${n._id}/read`).catch(() => { })));
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } finally { setMarkingAll(false); }
    };

    if (loading) return (
        <div className="h-full flex items-center justify-center">
            <Loader2 className="w-9 h-9 animate-spin text-indigo-600" />
        </div>
    );

    const enriched = notifications.map(n => ({ ...n, _cat: categorize(n.message) as NotiCategory }));
    const unreadCount = enriched.filter(n => !n.read).length;

    const filtered = filter === 'ALL' ? enriched : enriched.filter(n => n._cat === filter);

    
    const catCounts = Object.keys(CAT_META).reduce((acc, key) => {
        acc[key] = enriched.filter(n => n._cat === key).length;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">

            {}
            <div className="flex flex-col md:flex-row md:items-center gap-5 justify-between">
                <div className="flex items-center gap-5">
                    <div className="relative">
                        <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200">
                            <Bell className="w-7 h-7 text-white" />
                        </div>
                        {unreadCount > 0 && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </div>
                        )}
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 italic">Notifications</h1>
                        <p className="text-slate-500 font-medium text-sm mt-0.5">
                            {unreadCount > 0 ? `${unreadCount} unread alert${unreadCount > 1 ? 's' : ''} pending` : 'You are fully caught up!'}
                        </p>
                    </div>
                </div>

                {unreadCount > 0 && (
                    <button onClick={markAllRead} disabled={markingAll}
                        className="flex items-center gap-2 text-xs bg-white border border-slate-200 text-slate-700 px-5 py-3 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-50 hover:border-indigo-300 transition-all shadow-sm disabled:opacity-50">
                        {markingAll ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCheck className="w-4 h-4" />}
                        Mark All Read
                    </button>
                )}
            </div>

            {}
            {isFaculty && notifications.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {(Object.keys(CAT_META) as NotiCategory[]).map((key) => {
                        const meta = CAT_META[key];
                        const Icon = meta.icon;
                        const count = catCounts[key] ?? 0;
                        return (
                            <button key={key} onClick={() => setFilter(filter === key ? 'ALL' : key)}
                                className={`p-4 rounded-2xl border text-center transition-all hover:shadow-md ${filter === key ? meta.unreadClass + ' border-current' : 'bg-white border-slate-100 shadow-sm'}`}>
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-2 ${filter === key ? meta.iconBg : 'bg-slate-50 text-slate-400'}`}>
                                    <Icon className="w-4 h-4" />
                                </div>
                                <p className="text-lg font-black text-slate-900 leading-none">{count}</p>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1 leading-tight">{meta.label}</p>
                            </button>
                        );
                    })}
                </div>
            )}

            {}
            {isFaculty && (
                <div className="flex items-center gap-2 flex-wrap">
                    <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                    {FILTERS.map(f => (
                        <button key={f.id} onClick={() => setFilter(f.id)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${filter === f.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'}`}>
                            {f.label}
                            {f.id !== 'ALL' && catCounts[f.id] > 0 && (
                                <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[8px] ${filter === f.id ? 'bg-white/20' : 'bg-slate-100'}`}>
                                    {catCounts[f.id]}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {}
            {filtered.length === 0 && (
                <div className="text-center py-28 bg-white rounded-[3rem] border border-dashed border-slate-200">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-5">
                        <Bell className="w-10 h-10 text-slate-200" />
                    </div>
                    <h2 className="font-black text-slate-900 mb-2">
                        {filter === 'ALL' ? 'No notifications yet' : `No ${FILTERS.find(f => f.id === filter)?.label} notifications`}
                    </h2>
                    <p className="text-slate-400 font-medium text-sm max-w-xs mx-auto">
                        {isFaculty
                            ? "You'll be notified about student enrollments, activity, and admin messages here."
                            : "You'll be notified about courses, jobs, and placement drives here."}
                    </p>
                </div>
            )}

            {}
            <AnimatePresence>
                {filtered.length > 0 && (
                    <motion.div key={filter} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                        {}
                        {filtered.some(n => !n.read) && (
                            <div className="space-y-3">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" /> Unread
                                </p>
                                {filtered.filter(n => !n.read).map((n, i) => (
                                    <NotificationCard key={n._id} n={n} i={i} onMarkRead={markRead} isFaculty={isFaculty} />
                                ))}
                            </div>
                        )}

                        {}
                        {filtered.some(n => n.read) && (
                            <div className="space-y-3 mt-6">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Read
                                </p>
                                {filtered.filter(n => n.read).map((n, i) => (
                                    <NotificationCard key={n._id} n={n} i={i} onMarkRead={markRead} isFaculty={isFaculty} />
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {}
            {isFaculty && notifications.length === 0 && !loading && (
                <div className="flex items-start gap-4 bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
                    <LayoutGrid className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-indigo-700 leading-relaxed">
                        Notifications will appear here when students enroll in your courses, submit assignments, or when admins send you important updates.
                        Use the <strong>Announcements</strong> module to broadcast messages to your students.
                    </p>
                </div>
            )}
        </div>
    );
};



const NotificationCard = ({ n, i, onMarkRead, isFaculty }: {
    n: any; i: number; onMarkRead: (id: string) => void; isFaculty: boolean;
}) => {
    const cat = n._cat as NotiCategory;
    const meta = CAT_META[cat] ?? CAT_META.GENERAL;
    const Icon = meta.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => !n.read && onMarkRead(n._id)}
            className={`bg-white rounded-2xl border shadow-sm px-5 py-4 flex items-start gap-4 cursor-pointer hover:shadow-md transition-all group ${!n.read ? meta.unreadClass : 'border-slate-100'
                }`}
        >
            {}
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${!n.read ? meta.iconBg : 'bg-slate-100 text-slate-400'
                }`}>
                <Icon className="w-5 h-5" />
            </div>

            {}
            <div className="flex-1 min-w-0">
                {isFaculty && (
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest mb-2 ${!n.read ? meta.iconBg : 'bg-slate-100 text-slate-400'
                        }`}>
                        {meta.label}
                    </span>
                )}
                <p className={`text-sm leading-snug ${!n.read ? 'font-bold text-slate-900' : 'font-medium text-slate-500'}`}>
                    {n.message}
                </p>
                <p className="text-[10px] text-slate-400 mt-1.5 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(n.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>

            {}
            {!n.read && (
                <div className={`w-2.5 h-2.5 ${meta.dotColor} rounded-full flex-shrink-0 mt-2 animate-pulse`} />
            )}

            {}
            {n.read && (
                <CheckCircle2 className="w-4 h-4 text-slate-200 flex-shrink-0 mt-2" />
            )}
        </motion.div>
    );
};

export default Notifications;
