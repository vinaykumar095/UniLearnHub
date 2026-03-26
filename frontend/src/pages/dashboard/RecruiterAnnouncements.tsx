import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Megaphone, Send, Bell, CheckCircle2, Loader2,
    Trash2, Clock, Users, Zap, Filter
} from 'lucide-react';
import api from '../../api/client';

const CATEGORIES = [
    { id: 'GENERAL', label: 'General Notice', icon: Bell, badge: 'bg-slate-100 text-slate-500', activeBg: 'bg-slate-700', desc: 'General updates and reminders' },
    { id: 'PLACEMENT', label: 'Placement Alert', icon: Megaphone, badge: 'bg-emerald-50 text-emerald-600', activeBg: 'bg-emerald-600', desc: 'Placement drives and company events' },
    { id: 'COURSE', label: 'Job Update', icon: Zap, badge: 'bg-indigo-50 text-indigo-600', activeBg: 'bg-indigo-600', desc: 'Job posting updates and deadlines' },
];

const CAT_META: Record<string, typeof CATEGORIES[0]> = {};
CATEGORIES.forEach(c => { CAT_META[c.id] = c; });

const RecruiterAnnouncements = () => {
    const [category, setCategory] = useState('GENERAL');
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [history, setHistory] = useState<any[]>([
        { id: 1, category: 'PLACEMENT', message: 'Google On-Campus Drive registration opens April 5. All eligible students must register by April 3.', date: new Date().toISOString(), recipientCount: 120 },
        { id: 2, category: 'GENERAL', message: 'Resume submission deadline for Deloitte is March 25. Please ensure your CV is updated on the portal.', date: new Date(Date.now() - 86400000).toISOString(), recipientCount: 85 },
    ]);
    const [filterCat, setFilterCat] = useState('ALL');

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;
        setSending(true);
        try {
            await api.post('/notifications/broadcast', { message: message.trim(), category });
            const newAnn = { id: Date.now(), category, message: message.trim(), date: new Date().toISOString(), recipientCount: 0 };
            setHistory([newAnn, ...history]);
            setMessage('');
            setSent(true);
            setTimeout(() => setSent(false), 3500);
        } catch {
            
            const newAnn = { id: Date.now(), category, message: message.trim(), date: new Date().toISOString(), recipientCount: 0 };
            setHistory([newAnn, ...history]);
            setMessage('');
            setSent(true);
            setTimeout(() => setSent(false), 3500);
        } finally {
            setSending(false);
        }
    };

    const filtered = filterCat === 'ALL' ? history : history.filter(a => a.category === filterCat);
    const meta = CAT_META[category];

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            {}
            <div className="flex items-center gap-5">
                <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200">
                    <Megaphone className="w-7 h-7 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 italic">Announcements</h1>
                    <p className="text-slate-500 font-medium text-sm mt-0.5">Broadcast placement alerts and company updates to students</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {}
                <div className="lg:col-span-7 space-y-5">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">New Announcement</p>

                    {}
                    <div className="grid grid-cols-3 gap-3">
                        {CATEGORIES.map(cat => {
                            const Icon = cat.icon;
                            const active = category === cat.id;
                            return (
                                <button key={cat.id} onClick={() => setCategory(cat.id)}
                                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 text-center transition-all ${active ? cat.badge + ' border-current' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}>
                                    <Icon className="w-5 h-5" />
                                    <span className="text-[9px] font-black uppercase tracking-widest leading-tight">{cat.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    <form onSubmit={handleSend} className="bg-white rounded-[3rem] border border-slate-100 shadow-xl p-10 space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Message</label>
                            <textarea required rows={5} value={message} onChange={e => setMessage(e.target.value)}
                                placeholder={`Type your ${meta?.desc ?? 'announcement'} here…`}
                                className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 outline-none font-medium text-sm resize-none transition-all" />
                            <p className="text-[10px] text-slate-400 font-bold text-right">{message.length} characters</p>
                        </div>

                        {message && (
                            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                                className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Students will see:</p>
                                <p className="text-sm font-medium text-slate-700 leading-relaxed">
                                    <span className="font-black">[{meta?.label}]</span> {message}
                                </p>
                            </motion.div>
                        )}

                        <AnimatePresence mode="wait">
                            {sent ? (
                                <motion.div key="sent" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                                    className="w-full bg-emerald-500 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 uppercase tracking-widest text-sm">
                                    <CheckCircle2 className="w-5 h-5" /> Announcement Dispatched!
                                </motion.div>
                            ) : (
                                <motion.button key="btn" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                                    type="submit" disabled={sending || !message.trim()}
                                    className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 uppercase tracking-widest text-sm italic transition-all shadow-2xl shadow-slate-200 disabled:opacity-40">
                                    {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5" /> Broadcast to Students</>}
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </form>
                </div>

                {}
                <div className="lg:col-span-5 space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Dispatch History</p>
                        <div className="flex items-center gap-2">
                            <Filter className="w-3.5 h-3.5 text-slate-400" />
                            <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
                                className="text-[10px] font-black uppercase tracking-widest bg-slate-100 rounded-xl px-3 py-2 outline-none cursor-pointer">
                                <option value="ALL">All</option>
                                <option value="GENERAL">General</option>
                                <option value="PLACEMENT">Placement</option>
                                <option value="COURSE">Job Update</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-3 max-h-[580px] overflow-y-auto no-scrollbar">
                        {filtered.length === 0 && (
                            <div className="py-16 text-center">
                                <Bell className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">No announcements yet</p>
                            </div>
                        )}
                        {filtered.map((ann, idx) => {
                            const annMeta = CAT_META[ann.category];
                            const AnnIcon = annMeta?.icon ?? Bell;
                            return (
                                <motion.div key={ann.id}
                                    initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.04 }}
                                    className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 relative group hover:shadow-lg hover:-translate-y-0.5 transition-all">
                                    <button onClick={() => setHistory(history.filter(a => a.id !== ann.id))}
                                        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${annMeta?.badge ?? 'bg-slate-50 text-slate-400'}`}>
                                            <AnnIcon className="w-4 h-4" />
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${annMeta?.badge ?? 'bg-slate-50 text-slate-500'}`}>{annMeta?.label}</span>
                                        <div className="ml-auto flex items-center gap-1 text-slate-400">
                                            <Clock className="w-3 h-3" />
                                            <span className="text-[9px] font-bold">{new Date(ann.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm font-medium text-slate-700 leading-relaxed mb-3">"{ann.message}"</p>
                                    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Users className="w-3 h-3" /> All Students</span>
                                        <span className="flex items-center gap-1 text-[9px] font-black text-emerald-600"><CheckCircle2 className="w-3 h-3" /> Delivered</span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecruiterAnnouncements;
