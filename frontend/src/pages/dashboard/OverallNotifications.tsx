import { useState } from 'react';
import api from '../../api/client';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Megaphone, Users, GraduationCap, Building2,
    Send, History, Loader2,
    AlertCircle, Trash2, Clock, Shield, Globe
} from 'lucide-react';

const OverallNotifications = () => {
    const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
    const [target, setTarget] = useState<'ALL' | 'COLLEGE_ADMIN' | 'RECRUITER' | 'STUDENT' | 'FACULTY'>('ALL');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!message) return;
        setLoading(true);
        try {
            await api.post('/notifications/admin-broadcast', {
                message,
                targetRoles: target === 'ALL' ? ['ALL'] : [target]
            });
            setMessage('');
            alert('System-wide announcement broadcasted successfully!');
        } catch (error) {
            console.error('Error broadcasting:', error);
            alert('Failed to broadcast announcement.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 pb-20 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 italic tracking-tight flex items-center gap-3">
                        <Megaphone className="w-8 h-8 text-rose-600" /> Platform Communication Hub
                    </h1>
                    <p className="text-slate-500 font-medium font-italic">Broadcast system updates or critical alerts to the entire UniLearnHub ecosystem.</p>
                </div>
                <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
                    <button
                        onClick={() => setActiveTab('create')}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'create' ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'text-slate-400 hover:text-slate-900'}`}
                    >
                        New Alert
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'text-slate-400 hover:text-slate-900'}`}
                    >
                        Audit Logs
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'create' ? (
                    <motion.div
                        key="create"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm"
                    >
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Select Audience Target</label>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                    {[
                                        { id: 'ALL', label: 'Ecosystem', icon: Globe },
                                        { id: 'COLLEGE_ADMIN', label: 'Institutions', icon: GraduationCap },
                                        { id: 'RECRUITER', label: 'Recruiter', icon: Building2 },
                                        { id: 'STUDENT', label: 'Students', icon: Users },
                                        { id: 'FACULTY', label: 'Faculty', icon: Shield }
                                    ].map((role) => (
                                        <button
                                            key={role.id}
                                            onClick={() => setTarget(role.id as any)}
                                            className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group ${target === role.id ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-slate-50 bg-slate-50/50 text-slate-400 hover:border-slate-200 hover:bg-white'}`}
                                        >
                                            <role.icon className={`w-6 h-6 ${target === role.id ? 'text-primary-600' : 'text-slate-300 group-hover:text-slate-500'}`} />
                                            <span className="text-[9px] font-black uppercase tracking-widest">{role.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Notification Content</label>
                                <div className="relative">
                                    <textarea
                                        rows={6}
                                        placeholder="Type your system announcement here... (Markdown supported)"
                                        className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[2rem] focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-medium italic text-slate-700"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                    <div className="absolute bottom-6 right-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 select-none">
                                        <Clock className="w-3 h-3" /> Scheduled broadcast ready
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-xl border border-amber-100">
                                    <AlertCircle className="w-4 h-4 text-amber-600" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-amber-700">Action cannot be undone once sent</span>
                                </div>
                                <button
                                    onClick={handleSend}
                                    disabled={!message || loading}
                                    className="px-10 py-4 bg-primary-600 text-white rounded-2xl font-black text-sm hover:bg-primary-700 transition-all shadow-xl shadow-primary-200 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                    Broadcast Alert
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="history"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-4"
                    >
                        {[
                            { title: 'Scheduled Maintenance: Sunday, 2 AM', target: 'ALL', date: '2 hours ago', status: 'Sent' },
                            { title: 'New Recruiter Verification Policy', target: 'RECRUITER', date: 'Yesterday', status: 'Sent' },
                            { title: 'Institutional Grant Applications Open', target: 'COLLEGE_ADMIN', date: '3 days ago', status: 'Sent' }
                        ].map((log, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-primary-100 transition-all">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-all">
                                        <History className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-slate-900 italic tracking-tight">{log.title}</h4>
                                        <div className="flex items-center gap-4 mt-1.5">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                                                Target: <span className="text-primary-600">{log.target}</span>
                                            </span>
                                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                                                {log.date}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default OverallNotifications;
