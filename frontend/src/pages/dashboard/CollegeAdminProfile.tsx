import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    User, Mail, Phone, Building2, ShieldCheck,
    Edit3, Loader2, Zap, Globe
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';

const CollegeAdminProfile = () => {
    const { updateUser } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [savingCollege, setSavingCollege] = useState(false);
    const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [collegeData, setCollegeData] = useState<any>(null);
    const [editingCollege, setEditingCollege] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await api.get('/users/profile');
                setProfile(res.data);
                if (res.data.role === 'COLLEGE_ADMIN' && res.data.collegeId) {
                    setCollegeData(res.data.collegeId);
                }
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        load();
    }, []);

    const showMsg = (type: 'success' | 'error', text: string) => {
        setMsg({ type, text });
        setTimeout(() => setMsg(null), 3500);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await api.put('/users/profile', profile);
            setProfile(res.data);
            updateUser(res.data);
            setEditing(false);
            showMsg('success', 'Profile updated successfully');
        } catch { showMsg('error', 'Failed to save profile'); }
        finally { setSaving(false); }
    };

    const handleSaveCollege = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingCollege(true);
        try {
            await api.put(`/colleges/${collegeData._id}`, collegeData);
            setEditingCollege(false);
            showMsg('success', 'College settings updated');
        } catch { showMsg('error', 'Failed to update college settings'); }
        finally { setSavingCollege(false); }
    };

    if (loading) return (
        <div className="h-full flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        </div>
    );

    const Field = ({ label, field, icon: Icon, type = 'text', disabled = false }: any) => (
        <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</label>
            <div className="relative group">
                <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                <input type={type} value={profile?.[field] ?? ''}
                    disabled={disabled || !editing}
                    onChange={e => setProfile({ ...profile, [field]: e.target.value })}
                    className={`w-full pl-11 pr-4 py-4 rounded-2xl border-2 font-bold text-sm transition-all outline-none ${editing && !disabled ? 'bg-slate-50 border-transparent focus:bg-white focus:border-blue-600 text-slate-900' : 'bg-slate-50 border-transparent text-slate-400 cursor-not-allowed'}`} />
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            {/* Hero */}
            <div className="bg-slate-900 rounded-[3rem] p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/15 blur-[80px]" />
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-800 rounded-[2rem] flex items-center justify-center text-4xl font-black text-white shadow-xl">
                        {profile?.name?.charAt(0)}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-black text-white">{profile?.name}</h1>
                        <p className="text-slate-400 font-medium mt-1">College Admin</p>
                        <p className="text-blue-300 font-bold mt-0.5">{profile?.collegeId?.name ?? 'College Not Set'}</p>
                        <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                            <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-[10px] font-black text-blue-300 uppercase tracking-widest">College Admin</span>
                        </div>
                    </div>
                    <button onClick={() => setEditing(!editing)}
                        className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shrink-0 ${editing ? 'bg-slate-700 text-slate-300' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg'}`}>
                        <Edit3 className="w-4 h-4" /> {editing ? 'Cancel' : 'Edit Profile'}
                    </button>
                </div>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-10 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center"><User className="w-5 h-5 text-blue-600" /></div>
                        <h2 className="text-lg font-black text-slate-900">Personal Information</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Field label="Full Name" field="name" icon={User} />
                        <Field label="Email" field="email" icon={Mail} disabled />
                        <Field label="Phone Number" field="phone" icon={Phone} type="tel" />
                        <Field label="College" field="collegeName" icon={Building2} disabled />
                    </div>
                </div>

                {editing && (
                    <motion.button initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        type="submit" disabled={saving}
                        className="w-full bg-slate-900 hover:bg-blue-600 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 uppercase tracking-widest text-sm italic transition-all shadow-2xl disabled:opacity-50">
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ShieldCheck className="w-5 h-5" /> Save Profile</>}
                    </motion.button>
                )}
            </form>

            {profile?.role === 'COLLEGE_ADMIN' && collegeData && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-slate-900 leading-tight">College Settings</h2>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Institutional Management</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setEditingCollege(!editingCollege)}
                            className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all ${editingCollege ? 'bg-slate-100 text-slate-400' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'}`}
                        >
                            {editingCollege ? 'View Mode' : 'Configure Institution'}
                        </button>
                    </div>

                    <form onSubmit={handleSaveCollege} className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-10 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Current Academic Year</label>
                                <div className="relative group">
                                    <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="e.g. 2024-2025"
                                        value={collegeData.currentYear || ''}
                                        disabled={!editingCollege}
                                        onChange={e => setCollegeData({ ...collegeData, currentYear: e.target.value })}
                                        className={`w-full pl-11 pr-4 py-4 rounded-2xl border-2 font-black text-sm transition-all outline-none ${editingCollege ? 'bg-slate-50 border-transparent focus:bg-white focus:border-indigo-600 text-slate-900 italic' : 'bg-slate-50 border-transparent text-slate-400 cursor-not-allowed'}`}
                                    />
                                </div>
                                <p className="text-[9px] font-bold text-slate-400 italic">This year will be applied to all newly registered students and reports.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Institutional Website</label>
                                <div className="relative group">
                                    <Globe className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors`} />
                                    <input
                                        type="url"
                                        value={collegeData.website || ''}
                                        disabled={!editingCollege}
                                        onChange={e => setCollegeData({ ...collegeData, website: e.target.value })}
                                        className={`w-full pl-11 pr-4 py-4 rounded-2xl border-2 font-bold text-sm transition-all outline-none ${editingCollege ? 'bg-slate-50 border-transparent focus:bg-white focus:border-indigo-600 text-slate-900' : 'bg-slate-50 border-transparent text-slate-400 cursor-not-allowed'}`}
                                    />
                                </div>
                            </div>
                        </div>

                        {editingCollege && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                type="submit"
                                disabled={savingCollege}
                                className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 uppercase tracking-widest text-xs italic transition-all shadow-xl disabled:opacity-50 mt-4"
                            >
                                {savingCollege ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ShieldCheck className="w-4 h-4" /> Apply Institutional Changes</>}
                            </motion.button>
                        )}
                    </form>
                </div>
            )}

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-start gap-4">
                <Zap className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-blue-700">Your profile is only visible to you. It is used for account management and system communications.</p>
            </div>

            {msg && (
                <div className={`fixed bottom-10 right-10 px-8 py-5 rounded-2xl flex items-center gap-3 shadow-2xl z-50 text-white font-black text-sm ${msg.type === 'success' ? 'bg-slate-900' : 'bg-red-600'}`}>
                    <ShieldCheck className="w-5 h-5" /> {msg.text}
                </div>
            )}
        </div>
    );
};

export default CollegeAdminProfile;
