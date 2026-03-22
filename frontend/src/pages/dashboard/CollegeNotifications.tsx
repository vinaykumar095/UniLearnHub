import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell, Users, GraduationCap, Building2,
    Send, Loader2, Clock
} from 'lucide-react';
import api from '../../api/client';

const TARGETS = [
    { id: 'STUDENT', label: 'Students', icon: Users, color: 'bg-blue-600', desc: 'All students get this in Notifications' },
    { id: 'FACULTY', label: 'Faculty', icon: GraduationCap, color: 'bg-indigo-600', desc: 'Faculty see this in their Announcements' },
    { id: 'RECRUITER', label: 'Recruiters', icon: Building2, color: 'bg-emerald-600', desc: 'Recruiters see this in their Notifications' },
];

const CATEGORIES = ['GENERAL', 'PLACEMENT', 'COURSE'];

const CollegeNotifications = () => {
    const [target, setTarget] = useState('STUDENT');
    const [category, setCategory] = useState('GENERAL');
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [history, setHistory] = useState<any[]>([
        { id: '1', target: 'STUDENT', category: 'PLACEMENT', message: 'Placement drive registration deadline is tomorrow. Apply now in Job Career section.', sentAt: new Date(Date.now() - 3600000) },
        { id: '2', target: 'FACULTY', category: 'GENERAL', message: 'Please update your course materials before the semester review.', sentAt: new Date(Date.now() - 86400000) },
    ]);
    const [filterTarget, setFilterTarget] = useState('ALL');

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;
        setSending(true);
        try {
            await api.post('/notifications/broadcast', { message, category, targetRole: target });
            setHistory([{ id: Date.now().toString(), target, category, message, sentAt: new Date() }, ...history]);
            setMessage('');
        } catch (e) { console.error(e); }
        finally { setSending(false); }
    };

    const filtered = history.filter(h => filterTarget === 'ALL' || h.target === filterTarget);

    const CAT_PREFIX: Record<string, string> = { GENERAL: '📢', PLACEMENT: '🎯', COURSE: '📚' };
    const TARGET_CLS: Record<string, string> = { STUDENT: 'bg-blue-50 text-blue-600', FACULTY: 'bg-indigo-50 text-indigo-700', RECRUITER: 'bg-emerald-50 text-emerald-700' };

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            <div className="flex items-center gap-5">
                <div className="p-3 bg-violet-600 rounded-2xl shadow-lg shadow-violet-200">
                    <Bell className="w-7 h-7 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 italic">College Notifications</h1>
                    <p className="text-slate-500 font-medium text-sm mt-0.5">Broadcast alerts to students, faculty, or recruiters</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Composer */}
                <div className="lg:col-span-7">
                    <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-10 space-y-7">
                        <h2 className="text-xl font-black text-slate-900">Compose Announcement</h2>

                        {/* Target Selection */}
                        <div className="space-y-3">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Send To</p>
                            <div className="grid grid-cols-3 gap-3">
                                {TARGETS.map(t => {
                                    const Icon = t.icon;
                                    return (
                                        <button key={t.id} type="button" onClick={() => setTarget(t.id)}
                                            className={`p-4 rounded-2xl border-2 text-center transition-all ${target === t.id ? `${t.color} text-white border-transparent shadow-lg` : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'}`}>
                                            <Icon className="w-5 h-5 mx-auto mb-1.5" />
                                            <p className="text-[10px] font-black uppercase tracking-widest">{t.label}</p>
                                        </button>
                                    );
                                })}
                            </div>
                            <p className="text-[10px] font-medium text-slate-400">{TARGETS.find(t => t.id === target)?.desc}</p>
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Category</p>
                            <div className="flex gap-2">
                                {CATEGORIES.map(cat => (
                                    <button key={cat} type="button" onClick={() => setCategory(cat)}
                                        className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${category === cat ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>
                                        {CAT_PREFIX[cat]} {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Message */}
                        <form onSubmit={handleSend} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Message</label>
                                <textarea rows={5} required value={message} onChange={e => setMessage(e.target.value)}
                                    placeholder="Type your announcement here..."
                                    className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:bg-white focus:border-violet-500 outline-none text-sm font-medium resize-none transition-all" />
                            </div>

                            {/* Preview */}
                            {message && (
                                <div className="bg-slate-50 rounded-2xl p-5 border-l-4 border-violet-500">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Preview</p>
                                    <p className="text-sm font-bold text-slate-700">{CAT_PREFIX[category]} {message}</p>
                                    <p className="text-[10px] text-slate-400 mt-2">→ To: {TARGETS.find(t => t.id === target)?.label}</p>
                                </div>
                            )}

                            <button type="submit" disabled={sending || !message.trim()}
                                className="w-full bg-slate-900 hover:bg-violet-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 uppercase tracking-widest text-sm transition-all shadow-lg disabled:opacity-50">
                                {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5" /> Broadcast Now</>}
                            </button>
                        </form>
                    </div>
                </div>

                {/* History */}
                <div className="lg:col-span-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-black text-slate-900 italic flex items-center gap-2">
                            <Clock className="w-4 h-4 text-slate-400" /> Dispatch History
                        </h2>
                        <div className="flex gap-1">
                            {['ALL', 'STUDENT', 'FACULTY', 'RECRUITER'].map(t => (
                                <button key={t} onClick={() => setFilterTarget(t)}
                                    className={`px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${filterTarget === t ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                                    {t === 'ALL' ? 'All' : t.charAt(0) + t.slice(1).toLowerCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <AnimatePresence>
                            {filtered.map(item => (
                                <motion.div key={item.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${TARGET_CLS[item.target] ?? 'bg-slate-100 text-slate-500'}`}>
                                            {item.target}
                                        </span>
                                        <span className="px-2.5 py-1 bg-slate-50 rounded-full text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                            {CAT_PREFIX[item.category]} {item.category}
                                        </span>
                                        <span className="ml-auto text-[9px] text-slate-400 font-bold">
                                            {new Date(item.sentAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-700 leading-relaxed">{item.message}</p>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {filtered.length === 0 && (
                            <div className="py-12 text-center text-xs font-black text-slate-300 uppercase tracking-widest">No history</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollegeNotifications;
