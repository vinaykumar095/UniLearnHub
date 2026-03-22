import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send, Bell, Trash2, CheckCircle2, Loader2, Megaphone,
    BookOpen, Briefcase, AlertCircle, Users, Zap, Clock,
    ChevronDown, Filter
} from 'lucide-react';
import api from '../../api/client';

// ─── Category Definitions ────────────────────────────────────────────────────

const CATEGORIES = [
    {
        id: 'COURSE',
        label: 'Course Announcement',
        icon: BookOpen,
        color: 'border-blue-500 bg-blue-50 text-blue-700',
        activeBg: 'bg-blue-600',
        desc: 'New materials, exam dates, assignment updates',
        badge: 'bg-blue-50 text-blue-600',
        templates: [
            'New lecture materials have been uploaded for {course}. Please review before next class.',
            'Mid-term exam for {course} is scheduled for next Monday. Check the portal for details.',
            'Assignment deadline for {course} has been extended by 2 days.',
            'Quiz results for {course} are now published. Check your scores in the portal.',
        ],
    },
    {
        id: 'PLACEMENT',
        label: 'Placement Alert',
        icon: Briefcase,
        color: 'border-emerald-500 bg-emerald-50 text-emerald-700',
        activeBg: 'bg-emerald-600',
        desc: 'Placement drives, workshops, company visits',
        badge: 'bg-emerald-50 text-emerald-600',
        templates: [
            'Placement drive by Google is scheduled for April 15. Ensure your resume is updated.',
            'Resume submission deadline for TCS NQT is tomorrow — submit via the portal.',
            'Career workshop on System Design Interviews — this Saturday, 10 AM in Hall B.',
            'Mock interview registration is now open for final-year students.',
        ],
    },
    {
        id: 'GENERAL',
        label: 'General Notice',
        icon: AlertCircle,
        color: 'border-amber-500 bg-amber-50 text-amber-700',
        activeBg: 'bg-amber-500',
        desc: 'System updates, reminders, academic alerts',
        badge: 'bg-amber-50 text-amber-600',
        templates: [
            'Reminder: Internal assessment submissions close this Friday.',
            'Academic calendar has been updated. Please check the portal for revised dates.',
            'Fee payment deadline is approaching. Clear dues to avoid grade holds.',
            'Holiday notice: The college/university will remain closed on March 25 for the annual day.',
        ],
    },
];

const CAT_META: Record<string, (typeof CATEGORIES)[0]> = {};
CATEGORIES.forEach(c => { CAT_META[c.id] = c; });

// ─── Component ────────────────────────────────────────────────────────────────

const FacultyAnnouncements = () => {
    const [courses, setCourses] = useState<any[]>([]);
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [recipientCount, setRecipientCount] = useState<number | null>(null);

    // Form state
    const [category, setCategory] = useState('COURSE');
    const [courseId, setCourseId] = useState('ALL');
    const [message, setMessage] = useState('');
    const [showTemplates, setShowTemplates] = useState(false);

    // History filter
    const [filterCat, setFilterCat] = useState('ALL');

    useEffect(() => {
        const load = async () => {
            try {
                const res = await api.get('/faculty/dashboard');
                // Extract course list from faculty dashboard
                const courseList = res.data.progressStats || [];
                setCourses(courseList);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();

        // Load local history from sessionStorage if present
        const saved = sessionStorage.getItem('faculty_announcements');
        if (saved) setAnnouncements(JSON.parse(saved));
    }, []);

    const saveHistory = (list: any[]) => {
        setAnnouncements(list);
        sessionStorage.setItem('faculty_announcements', JSON.stringify(list));
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;
        setSending(true);
        try {
            const res = await api.post('/notifications/broadcast', {
                message: message.trim(),
                category,
                courseId,
            });
            const count = res.data.recipientCount ?? 0;
            setRecipientCount(count);
            setSent(true);

            const newAnn = {
                id: Date.now(),
                message: message.trim(),
                category,
                courseId,
                courseName: courseId === 'ALL' ? 'All Students' : (courses.find(c => c.id?.toString() === courseId)?.title ?? courseId),
                date: new Date().toISOString(),
                recipientCount: count,
            };
            saveHistory([newAnn, ...announcements]);
            setMessage('');
            setTimeout(() => { setSent(false); setRecipientCount(null); }, 4000);
        } catch (error) {
            console.error('Error broadcasting announcement:', error);
            // Still show local "sent" for UX continuity
            const fallbackAnn = {
                id: Date.now(), message: message.trim(), category, courseId,
                courseName: courseId === 'ALL' ? 'All Students' : courseId,
                date: new Date().toISOString(), recipientCount: 0,
            };
            saveHistory([fallbackAnn, ...announcements]);
            setMessage('');
        } finally {
            setSending(false);
        }
    };

    const deleteAnnouncement = (id: number) => {
        saveHistory(announcements.filter((a: any) => a.id !== id));
    };

    const fillTemplate = (tmpl: string) => {
        const course = courses.find(c => c.id?.toString() === courseId)?.title ?? 'your course';
        setMessage(tmpl.replace('{course}', course));
        setShowTemplates(false);
    };

    const filteredHistory = filterCat === 'ALL'
        ? announcements
        : announcements.filter((a: any) => a.category === filterCat);

    const currentCatMeta = CAT_META[category];
    const CatIcon = currentCatMeta?.icon ?? Megaphone;

    if (loading) return (
        <div className="h-full flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-20">

            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between">
                <div className="flex items-center gap-5">
                    <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200">
                        <Megaphone className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 italic">Announcement Command</h1>
                        <p className="text-slate-500 font-medium text-sm mt-0.5">Broadcast critical updates directly to students' Notifications</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-5 py-3 bg-indigo-50 border border-indigo-200 rounded-2xl">
                    <Bell className="w-4 h-4 text-indigo-500" />
                    <span className="text-xs font-black text-indigo-700 uppercase tracking-widest">{announcements.length} Dispatches This Session</span>
                </div>
            </div>

            {/* ── Composer + History side by side ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left: Compose */}
                <div className="lg:col-span-7 space-y-6">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">New Announcement</h3>

                    {/* Category Selector */}
                    <div className="grid grid-cols-3 gap-4">
                        {CATEGORIES.map(cat => {
                            const Icon = cat.icon;
                            const active = category === cat.id;
                            return (
                                <button key={cat.id} onClick={() => setCategory(cat.id)}
                                    className={`p-5 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all text-center ${active ? cat.color + ' border-current' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}>
                                    <Icon className="w-5 h-5" />
                                    <span className="text-[9px] font-black uppercase tracking-widest leading-tight">{cat.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    <form onSubmit={handleSend} className="bg-white rounded-[3rem] border border-slate-100 shadow-xl p-10 space-y-6">
                        {/* Target Audience */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Target Audience</label>
                            <div className="flex items-center gap-3">
                                <div className="relative flex-1">
                                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <select value={courseId} onChange={e => setCourseId(e.target.value)}
                                        className="w-full pl-11 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-indigo-600 outline-none text-sm font-bold text-slate-700 appearance-none cursor-pointer transition-all">
                                        <option value="ALL">All Enrolled Students</option>
                                        {courses.map((c: any) => (
                                            <option key={c.id} value={c.id}>{c.title}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                </div>
                                <div className={`px-4 py-3 rounded-xl ${currentCatMeta?.badge ?? 'bg-slate-50 text-slate-500'} text-[9px] font-black uppercase tracking-widest shrink-0 flex items-center gap-2`}>
                                    <CatIcon className="w-3.5 h-3.5" />
                                    {currentCatMeta?.id ?? ''}
                                </div>
                            </div>
                        </div>

                        {/* Message + Templates */}
                        <div className="space-y-2 relative">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Message</label>
                                <button type="button" onClick={() => setShowTemplates(!showTemplates)}
                                    className="text-[9px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-all">
                                    <Zap className="w-3 h-3" /> Quick Templates
                                </button>
                            </div>

                            <AnimatePresence>
                                {showTemplates && (
                                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                                        className="absolute top-full left-0 right-0 z-20 bg-white rounded-2xl border border-slate-200 shadow-xl p-4 space-y-2">
                                        {(CAT_META[category]?.templates ?? []).map((tmpl, i) => (
                                            <button key={i} type="button" onClick={() => fillTemplate(tmpl)}
                                                className="w-full text-left text-xs font-medium text-slate-700 p-3 rounded-xl hover:bg-indigo-50 hover:text-indigo-700 transition-all leading-relaxed">
                                                {tmpl}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <textarea required rows={5} value={message} onChange={e => setMessage(e.target.value)}
                                placeholder={`Type your ${currentCatMeta?.desc ?? 'announcement'} here…`}
                                className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 outline-none font-medium text-sm resize-none transition-all" />
                            <p className="text-[10px] text-slate-400 font-bold text-right">{message.length} characters</p>
                        </div>

                        {/* Preview Banner */}
                        {message && (
                            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                                className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Student will see:</p>
                                <p className="text-sm font-medium text-slate-700 leading-relaxed">
                                    <span className="font-black">[{currentCatMeta?.label}]</span> {message}
                                </p>
                            </motion.div>
                        )}

                        {/* Submit */}
                        <AnimatePresence>
                            {sent ? (
                                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                                    className="w-full bg-emerald-500 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 uppercase tracking-widest text-sm">
                                    <CheckCircle2 className="w-5 h-5" />
                                    Dispatched to {recipientCount ?? 0} students!
                                </motion.div>
                            ) : (
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                                    type="submit" disabled={sending || !message.trim()}
                                    className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 uppercase tracking-widest text-sm italic transition-all shadow-2xl shadow-slate-200 disabled:opacity-40">
                                    {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5" /> Broadcast Announcement</>}
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </form>
                </div>

                {/* Right: History */}
                <div className="lg:col-span-5 space-y-5">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Dispatch History</h3>
                        <div className="flex items-center gap-2">
                            <Filter className="w-3.5 h-3.5 text-slate-400" />
                            <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
                                className="text-[10px] font-black uppercase tracking-widest bg-slate-100 rounded-xl px-3 py-2 outline-none cursor-pointer">
                                <option value="ALL">All</option>
                                <option value="COURSE">Course</option>
                                <option value="PLACEMENT">Placement</option>
                                <option value="GENERAL">General</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4 max-h-[640px] overflow-y-auto no-scrollbar pr-1">
                        {filteredHistory.length === 0 && (
                            <div className="py-20 text-center">
                                <Bell className="w-14 h-14 text-slate-200 mx-auto mb-4" />
                                <p className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">No announcements yet</p>
                            </div>
                        )}
                        {filteredHistory.map((ann: any, idx: number) => {
                            const meta = CAT_META[ann.category];
                            const Icon = meta?.icon ?? AlertCircle;
                            return (
                                <motion.div key={ann.id}
                                    initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                                    className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 relative group hover:shadow-lg hover:-translate-y-0.5 transition-all">
                                    {/* Delete button */}
                                    <button onClick={() => deleteAnnouncement(ann.id)}
                                        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all">
                                        <Trash2 className="w-4 h-4" />
                                    </button>

                                    {/* Header */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${meta?.badge ?? 'bg-slate-50 text-slate-400'}`}>
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${meta?.badge ?? 'bg-slate-50 text-slate-500'}`}>
                                                {meta?.label ?? ann.category}
                                            </span>
                                        </div>
                                        <div className="ml-auto flex items-center gap-1 text-slate-400">
                                            <Clock className="w-3 h-3" />
                                            <span className="text-[9px] font-bold">
                                                {new Date(ann.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <p className="text-sm font-medium text-slate-700 leading-relaxed mb-4">"{ann.message}"</p>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                            <Users className="w-3 h-3" /> {ann.courseName}
                                        </span>
                                        <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600">
                                            <CheckCircle2 className="w-3 h-3" /> {ann.recipientCount ?? '-'} notified
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── Quick Stats Strip ── */}
            {announcements.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900 rounded-[2.5rem] p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { label: 'Total Dispatches', value: announcements.length, icon: Megaphone },
                        { label: 'Course Updates', value: announcements.filter((a: any) => a.category === 'COURSE').length, icon: BookOpen },
                        { label: 'Placement Alerts', value: announcements.filter((a: any) => a.category === 'PLACEMENT').length, icon: Briefcase },
                        { label: 'General Notices', value: announcements.filter((a: any) => a.category === 'GENERAL').length, icon: AlertCircle },
                    ].map(({ label, value, icon: Icon }) => (
                        <div key={label} className="text-center">
                            <div className="flex justify-center mb-2"><Icon className="w-4 h-4 text-indigo-400" /></div>
                            <div className="text-2xl font-black text-white italic">{value}</div>
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{label}</div>
                        </div>
                    ))}
                </motion.div>
            )}
        </div>
    );
};

export default FacultyAnnouncements;
