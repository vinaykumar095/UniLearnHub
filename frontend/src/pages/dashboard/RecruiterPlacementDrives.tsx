import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Star, Plus, Calendar, MapPin, Users,
    Loader2, CheckCircle2, Trash2, Building2, Zap,
    Globe, Search, X
} from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';

const STATUS_META: Record<string, { label: string; cls: string }> = {
    UPCOMING: { label: 'Upcoming', cls: 'bg-blue-50 text-blue-600' },
    ONGOING: { label: 'Ongoing', cls: 'bg-emerald-50 text-emerald-600' },
    COMPLETED: { label: 'Completed', cls: 'bg-slate-100 text-slate-500' },
};

const EMPTY_FORM = { 
    title: '', company: '', date: '', venue: '', status: 'UPCOMING', 
    openRoles: '', rounds: '', registrationLink: '',
    visibility: 'GLOBAL' as 'GLOBAL' | 'SPECIFIC',
    collegeIds: [] as string[]
};

const RecruiterPlacementDrives = () => {
    const { user } = useAuth();
    const [drives, setDrives] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [notified, setNotified] = useState(false);
    
    // College state
    const [allColleges, setAllColleges] = useState<any[]>([]);
    const [collegeSearch, setCollegeSearch] = useState('');

    const [form, setForm] = useState({ ...EMPTY_FORM, company: user?.company ?? '' });

    const fetchDrives = async () => {
        try {
            const res = await api.get('/placement-drives/recruiter');
            setDrives(res.data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const fetchColleges = async () => {
        try {
            const res = await api.get('/colleges?status=active');
            setAllColleges(res.data);
        } catch (e) { console.error(e); }
    };

    useEffect(() => { 
        fetchDrives(); 
        fetchColleges();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const openRoles = form.openRoles.split(',').map(s => s.trim()).filter(Boolean);
            const rounds = form.rounds.split(',').map(s => s.trim()).filter(Boolean);
            
            await api.post('/placement-drives', {
                ...form,
                openRoles,
                rounds,
                recruiterId: user?.id,
                collegeIds: form.visibility === 'GLOBAL' ? [] : form.collegeIds
            });

            setShowForm(false);
            setForm({ ...EMPTY_FORM, company: user?.company ?? '' });
            fetchDrives();
            
            setNotified(true);
            setTimeout(() => setNotified(false), 4000);
        } catch (e) { console.error(e); }
        finally { setSaving(false); }
    };

    const deleteDrive = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this drive?')) return;
        try {
            await api.delete(`/placement-drives/${id}`);
            fetchDrives();
        } catch (e) { console.error(e); }
    };

    if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-amber-500" /></div>;

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            {/* Notified toast */}
            <AnimatePresence>
                {notified && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="fixed bottom-10 right-10 z-50 bg-slate-900 text-white px-8 py-5 rounded-2xl shadow-2xl font-black text-sm flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Drive Published! 🎉
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center gap-5 justify-between">
                <div className="flex items-center gap-5">
                    <div className="p-3 bg-amber-500 rounded-2xl shadow-lg shadow-amber-200">
                        <Star className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 italic">Placement Drives</h1>
                        <p className="text-slate-500 font-medium text-sm mt-0.5">Schedule and manage campus recruitment drives</p>
                    </div>
                </div>
                <button onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-amber-500 transition-all shadow-lg">
                    <Plus className="w-4 h-4" /> Schedule Drive
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Total Drives', value: drives.length, color: 'text-amber-600' },
                    { label: 'Upcoming', value: drives.filter(d => d.status === 'UPCOMING').length, color: 'text-blue-600' },
                    { label: 'Completed', value: drives.filter(d => d.status === 'COMPLETED').length, color: 'text-slate-500' },
                ].map(({ label, value, color }) => (
                    <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
                        <p className={`text-2xl font-black ${color}`}>{value}</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{label}</p>
                    </div>
                ))}
            </div>

            {/* Create Form */}
            <AnimatePresence>
                {showForm && (
                    <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
                        className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl p-10 space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black text-slate-900">Schedule New Drive</h2>
                            <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleCreate} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { label: 'Drive Title', field: 'title', placeholder: 'e.g. SDE Hiring Drive – Google', icon: Star },
                                    { label: 'Company', field: 'company', placeholder: 'e.g. Google', icon: Building2 },
                                    { label: 'Date', field: 'date', placeholder: '', icon: Calendar, type: 'date' },
                                    { label: 'Venue', field: 'venue', placeholder: 'Virtual / Campus Hall A', icon: MapPin },
                                    { label: 'Open Roles (comma-separated)', field: 'openRoles', placeholder: 'SDE-1, SDE Intern', icon: Building2 },
                                    { label: 'Interview Rounds (comma-separated)', field: 'rounds', placeholder: 'Online Test, Interview', icon: Zap },
                                    { label: 'Registration Link (Optional)', field: 'registrationLink', placeholder: 'https://...', icon: Globe },
                                ].map(({ label, field, placeholder, icon: Icon, type = 'text' }: any) => (
                                    <div key={field} className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</label>
                                        <div className="relative">
                                            <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input required={field !== 'registrationLink'} type={type} placeholder={placeholder} value={(form as any)[field]}
                                                onChange={e => setForm({ ...form, [field]: e.target.value })}
                                                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-amber-200 transition-all" />
                                        </div>
                                    </div>
                                ))}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</label>
                                    <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                                        className="w-full px-4 py-3.5 bg-slate-50 rounded-2xl text-sm font-bold outline-none appearance-none cursor-pointer">
                                        <option value="UPCOMING">Upcoming</option>
                                        <option value="ONGOING">Ongoing</option>
                                        <option value="COMPLETED">Completed</option>
                                    </select>
                                </div>
                            </div>

                            {/* Visibility Section */}
                            <div className="bg-slate-50 rounded-3xl p-8 space-y-6">
                                <div className="flex items-center gap-3">
                                    <Globe className="w-5 h-5 text-indigo-600" />
                                    <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Drive Visibility</p>
                                </div>

                                <div className="flex gap-4">
                                    <button type="button" onClick={() => setForm({ ...form, visibility: 'GLOBAL', collegeIds: [] })}
                                        className={`flex-1 p-5 rounded-2xl border-2 transition-all text-left ${form.visibility === 'GLOBAL' ? 'border-indigo-600 bg-white' : 'border-transparent bg-white/50 hover:bg-white'}`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <Globe className={`w-6 h-6 ${form.visibility === 'GLOBAL' ? 'text-indigo-600' : 'text-slate-400'}`} />
                                            {form.visibility === 'GLOBAL' && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                                        </div>
                                        <p className="font-black text-xs uppercase tracking-wider text-slate-900">Global Drive</p>
                                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase italic">All colleges can participate</p>
                                    </button>

                                    <button type="button" onClick={() => setForm({ ...form, visibility: 'SPECIFIC' })}
                                        className={`flex-1 p-5 rounded-2xl border-2 transition-all text-left ${form.visibility === 'SPECIFIC' ? 'border-indigo-600 bg-white' : 'border-transparent bg-white/50 hover:bg-white'}`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <Users className={`w-6 h-6 ${form.visibility === 'SPECIFIC' ? 'text-indigo-600' : 'text-slate-400'}`} />
                                            {form.visibility === 'SPECIFIC' && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                                        </div>
                                        <p className="font-black text-xs uppercase tracking-wider text-slate-900">Targeted Drive</p>
                                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase italic">Only selected colleges</p>
                                    </button>
                                </div>

                                {form.visibility === 'SPECIFIC' && (
                                    <div className="space-y-4 pt-4 border-t border-slate-200">
                                        <div className="relative">
                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input type="text" placeholder="Search colleges..." value={collegeSearch} onChange={e => setCollegeSearch(e.target.value)}
                                                className="w-full pl-11 pr-4 py-3 bg-white rounded-xl outline-none text-xs font-bold" />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                            {allColleges.filter(c => c.name.toLowerCase().includes(collegeSearch.toLowerCase())).map(college => {
                                                const isSelected = form.collegeIds.includes(college._id);
                                                return (
                                                    <button key={college._id} type="button"
                                                        onClick={() => {
                                                            const newIds = isSelected 
                                                                ? form.collegeIds.filter(id => id !== college._id)
                                                                : [...form.collegeIds, college._id];
                                                            setForm({ ...form, collegeIds: newIds });
                                                        }}
                                                        className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${isSelected ? 'border-indigo-200 bg-white' : 'border-transparent bg-white/40'}`}>
                                                        <div className={`w-4 h-4 rounded flex items-center justify-center border-2 ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'}`}>
                                                            {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                                                        </div>
                                                        <span className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? 'text-indigo-900' : 'text-slate-500'}`}>{college.name}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <button type="submit" disabled={saving}
                                    className="flex-1 bg-slate-900 hover:bg-amber-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 uppercase tracking-widest text-sm transition-all disabled:opacity-50 shadow-xl shadow-amber-100">
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4" /> Publish Placement Drive</>}
                                </button>
                                <button type="button" onClick={() => setShowForm(false)}
                                    className="px-8 py-4 border-2 border-slate-200 text-slate-500 font-black rounded-2xl hover:border-slate-300 transition-all text-sm uppercase tracking-widest">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Drive Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {drives.map((drive, i) => {
                    const meta = STATUS_META[drive.status] ?? STATUS_META.UPCOMING;
                    return (
                        <motion.div key={drive._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                            className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 space-y-5 relative group hover:shadow-xl hover:-translate-y-1 transition-all">
                            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                <button onClick={() => deleteDrive(drive._id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center shrink-0">
                                    <Star className="w-6 h-6 text-amber-500" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-black text-slate-900 leading-snug">{drive.title}</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">{drive.company}</p>
                                    <span className={`mt-2 inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${meta.cls}`}>{meta.label}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-2.5">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    <span className="text-xs font-bold text-slate-700">{new Date(drive.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-2.5">
                                    <MapPin className="w-4 h-4 text-slate-400" />
                                    <span className="text-xs font-bold text-slate-700 truncate">{drive.venue}</span>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-2.5 md:col-span-2">
                                    <Globe className="w-4 h-4 text-slate-400" />
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                        {drive.colleges?.length === 0 ? '🌍 Global Visibility' : `🎓 ${drive.colleges?.length} Colleges`}
                                    </span>
                                </div>
                            </div>

                            {drive.openRoles?.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {drive.openRoles.map((role: string) => (
                                        <span key={role} className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">{role}</span>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    );
                })}
                {drives.length === 0 && (
                    <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                        <Star className="w-14 h-14 text-slate-200 mx-auto mb-4" />
                        <p className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">No placement drives scheduled</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecruiterPlacementDrives;
