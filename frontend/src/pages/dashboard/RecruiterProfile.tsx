import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    User, Mail, Phone, Building2, Globe, Loader2,
    ShieldCheck, MapPin, Edit3, Briefcase, Zap, Camera, Tag
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';

const INDUSTRIES = ['IT & Software', 'Finance & Banking', 'Consulting', 'Manufacturing', 'Healthcare', 'E-commerce', 'EdTech', 'Media & Entertainment', 'Other'];

const RecruiterProfile = () => {
    const { updateUser } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);
    const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await api.get('/users/profile');
                setProfile(res.data);
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

    if (loading) return (
        <div className="h-full flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        </div>
    );

    const Input = ({ label, field, icon: Icon, placeholder = '', type = 'text', disabled = false }: any) => (
        <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</label>
            <div className="relative group">
                <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                <input type={type} placeholder={placeholder}
                    value={profile?.[field] ?? ''}
                    disabled={disabled || !editing}
                    onChange={e => setProfile({ ...profile, [field]: e.target.value })}
                    className={`w-full pl-11 pr-4 py-4 rounded-2xl border-2 font-bold text-sm transition-all outline-none ${editing && !disabled
                            ? 'bg-slate-50 border-transparent focus:bg-white focus:border-indigo-600 text-slate-900'
                            : 'bg-slate-50 border-transparent text-slate-400 cursor-not-allowed'
                        }`} />
            </div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">

            {}
            <div className="bg-slate-900 rounded-[3rem] p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/15 blur-[80px]" />
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    {}
                    <div className="relative">
                        <div className="w-28 h-28 bg-gradient-to-br from-indigo-500 to-indigo-800 rounded-[2.5rem] flex items-center justify-center text-4xl font-black text-white shadow-xl shadow-indigo-900/60">
                            {profile?.company?.charAt(0) ?? profile?.name?.charAt(0)}
                        </div>
                        <button className="absolute -bottom-2 -right-2 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-slate-50 transition-colors border-2 border-slate-100">
                            <Camera className="w-4 h-4 text-slate-600" />
                        </button>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-black text-white">{profile?.name}</h1>
                        <p className="text-slate-400 font-medium mt-1">{profile?.designation ?? 'Recruiter'}</p>
                        <p className="text-indigo-300 font-bold mt-0.5">{profile?.company}</p>
                        <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                            <span className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-[10px] font-black text-indigo-300 uppercase tracking-widest">Recruiter</span>
                            {profile?.industry && <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[10px] font-black text-white/70 uppercase tracking-widest">{profile.industry}</span>}
                            {profile?.location && <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[10px] font-black text-white/70 uppercase tracking-widest flex items-center gap-1"><MapPin className="w-2.5 h-2.5" />{profile.location}</span>}
                        </div>
                    </div>

                    <button onClick={() => setEditing(!editing)}
                        className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shrink-0 ${editing ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-900/40'}`}>
                        <Edit3 className="w-4 h-4" /> {editing ? 'Cancel' : 'Edit Profile'}
                    </button>
                </div>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                {}
                <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-10 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center"><User className="w-5 h-5 text-slate-500" /></div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900">Personal Information</h2>
                            <p className="text-xs font-medium text-slate-400">Your recruiter contact details</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Full Name" field="name" icon={User} />
                        <Input label="Email" field="email" icon={Mail} disabled />
                        <Input label="Contact Number" field="phone" icon={Phone} type="tel" placeholder="+91 98765 43210" />
                        <Input label="Designation" field="designation" icon={Briefcase} placeholder="e.g. HR Manager / Tech Recruiter" />
                    </div>
                </div>

                {}
                <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-10 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center"><Building2 className="w-5 h-5 text-indigo-600" /></div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900">Company Information</h2>
                            <p className="text-xs font-medium text-slate-400">Visible to students on job postings</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Company Name" field="company" icon={Building2} placeholder="e.g. Google India Pvt. Ltd." />
                        <Input label="Location" field="location" icon={MapPin} placeholder="e.g. Bangalore, Karnataka" />
                        <Input label="Website" field="website" icon={Globe} placeholder="https://company.com" />
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Industry</label>
                            <div className="relative">
                                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                <select value={profile?.industry ?? ''} disabled={!editing}
                                    onChange={e => setProfile({ ...profile, industry: e.target.value })}
                                    className={`w-full pl-11 pr-4 py-4 rounded-2xl border-2 font-bold text-sm appearance-none cursor-pointer transition-all outline-none ${editing ? 'bg-slate-50 border-transparent text-slate-900' : 'bg-slate-50 border-transparent text-slate-400 cursor-not-allowed'
                                        }`}>
                                    <option value="">Select Industry</option>
                                    {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">About Company</label>
                        <textarea rows={5} value={profile?.bio ?? ''} disabled={!editing}
                            onChange={e => setProfile({ ...profile, bio: e.target.value })}
                            placeholder="Describe your company culture, mission, products/services, and what makes you a great place to work..."
                            className={`w-full p-5 rounded-2xl border-2 font-medium text-sm resize-none transition-all outline-none ${editing ? 'bg-slate-50 border-transparent focus:bg-white focus:border-indigo-600 text-slate-900' : 'bg-slate-50 border-transparent text-slate-400 cursor-not-allowed'
                                }`} />
                    </div>
                </div>

                {editing && (
                    <motion.button initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        type="submit" disabled={saving}
                        className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 uppercase tracking-widest text-sm italic transition-all shadow-2xl shadow-slate-200 disabled:opacity-50">
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ShieldCheck className="w-5 h-5" /> Save Profile</>}
                    </motion.button>
                )}
            </form>

            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 flex items-start gap-4">
                <Zap className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-indigo-700">A complete company profile with your logo, about section, and industry details significantly increases student trust and application rates.</p>
            </div>

            {msg && (
                <div className={`fixed bottom-10 right-10 px-8 py-5 rounded-2xl flex items-center gap-3 shadow-2xl z-50 text-white font-black text-sm ${msg.type === 'success' ? 'bg-slate-900' : 'bg-red-600'}`}>
                    <ShieldCheck className="w-5 h-5" /> {msg.text}
                </div>
            )}
        </div>
    );
};

export default RecruiterProfile;
