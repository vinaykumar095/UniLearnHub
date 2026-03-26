import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, CheckCircle, XCircle, Loader2, ArrowLeft, ExternalLink,
    Mail, Building2, Search, Filter, ChevronDown, Calendar,
    MessageSquare, Star, GraduationCap, Zap, Clock
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import api from '../../api/client';

const STATUS_META: Record<string, { label: string; cls: string; dot: string }> = {
    pending: { label: 'Pending', cls: 'bg-slate-100 text-slate-500', dot: 'bg-slate-400' },
    shortlisted: { label: 'Shortlisted', cls: 'bg-emerald-50 text-emerald-600', dot: 'bg-emerald-500' },
    interview: { label: 'Interview', cls: 'bg-blue-50 text-blue-600', dot: 'bg-blue-500' },
    rejected: { label: 'Rejected', cls: 'bg-red-50 text-red-600', dot: 'bg-red-500' },
    hired: { label: 'Hired', cls: 'bg-amber-50 text-amber-600', dot: 'bg-amber-500' },
};
const STATUSES = Object.keys(STATUS_META);

const ApplicantTracking = () => {
    const { jobId } = useParams();
    const [applicants, setApplicants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [jobTitle, setJobTitle] = useState('');
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [notes, setNotes] = useState<Record<string, string>>({});
    const [editNote, setEditNote] = useState<string | null>(null);
    const [expanded, setExpanded] = useState<string | null>(null);

    const isGlobal = !jobId;  

    useEffect(() => {
        const load = async () => {
            try {
                if (isGlobal) {
                    const jobsRes = await api.get('/jobs/recruiter');
                    const allApps: any[] = [];
                    for (const job of jobsRes.data) {
                        try {
                            const res = await api.get(`/jobs/${job._id}/applicants`);
                            res.data.forEach((a: any) => allApps.push({ ...a, _jobTitle: job.title }));
                        } catch { }
                    }
                    setApplicants(allApps);
                } else {
                    const res = await api.get(`/jobs/${jobId}/applicants`);
                    setApplicants(res.data);
                    const jobRes = await api.get('/jobs/recruiter');
                    const job = jobRes.data.find((j: any) => j._id === jobId);
                    if (job) setJobTitle(job.title);
                }
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        load();
    }, [jobId]);

    const updateStatus = async (appId: string, status: string) => {
        try {
            await api.patch(`/jobs/applications/${appId}/status`, { status });
            setApplicants(applicants.map(a => a._id === appId ? { ...a, status } : a));
        } catch (e) { console.error(e); }
    };

    const filtered = applicants
        .filter(a => a.studentId?.name?.toLowerCase().includes(search.toLowerCase()) || a.studentId?.email?.toLowerCase().includes(search.toLowerCase()))
        .filter(a => statusFilter === 'ALL' || a.status === statusFilter);

    const statusCounts = STATUSES.reduce((acc, s) => {
        acc[s] = applicants.filter(a => a.status === s).length;
        return acc;
    }, {} as Record<string, number>);

    if (loading) return (
        <div className="h-full flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
            {}
            <div className="flex items-center gap-5">
                {!isGlobal && (
                    <Link to="/dashboard/recruiter/jobs" className="p-3 hover:bg-slate-100 rounded-2xl transition-colors shrink-0">
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </Link>
                )}
                <div className="flex items-center gap-5 flex-1">
                    <div className="p-3 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-200">
                        <Users className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 italic">
                            {isGlobal ? 'All Applications' : `Applications — ${jobTitle}`}
                        </h1>
                        <p className="text-slate-500 font-medium text-sm mt-0.5">
                            {applicants.length} total · {statusCounts['shortlisted'] ?? 0} shortlisted · {statusCounts['interview'] ?? 0} interview
                        </p>
                    </div>
                </div>
            </div>

            {}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {STATUSES.map(s => {
                    const meta = STATUS_META[s];
                    return (
                        <button key={s} onClick={() => setStatusFilter(statusFilter === s ? 'ALL' : s)}
                            className={`p-4 rounded-2xl border-2 transition-all text-left ${statusFilter === s ? 'border-slate-900 bg-slate-900 text-white' : 'bg-white border-slate-100 hover:border-slate-200'}`}>
                            <div className={`flex items-center gap-2 ${statusFilter === s ? 'text-white/70' : 'text-slate-400'}`}>
                                <div className={`w-2 h-2 rounded-full ${meta.dot}`} />
                                <span className="text-[9px] font-black uppercase tracking-widest">{meta.label}</span>
                            </div>
                            <p className={`text-2xl font-black mt-1 ${statusFilter === s ? 'text-white' : 'text-slate-900'}`}>{statusCounts[s] ?? 0}</p>
                        </button>
                    );
                })}
            </div>

            {}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-5 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search by name or email..."
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-2xl text-sm font-medium outline-none" />
                </div>
                <div className="flex gap-2 items-center">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <div className="flex gap-2 flex-wrap">
                        {['ALL', ...STATUSES].map(s => (
                            <button key={s} onClick={() => setStatusFilter(s)}
                                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${statusFilter === s ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {}
            <div className="space-y-3">
                {filtered.length === 0 && (
                    <div className="py-24 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                        <Users className="w-14 h-14 text-slate-200 mx-auto mb-4" />
                        <p className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">No applications found</p>
                    </div>
                )}
                {filtered.map((app, i) => {
                    const meta = STATUS_META[app.status] ?? STATUS_META.pending;
                    const isOpen = expanded === app._id;
                    return (
                        <motion.div key={app._id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                            className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
                            {}
                            <div className="p-5 flex items-center gap-5 cursor-pointer hover:bg-slate-50/50 transition-colors"
                                onClick={() => setExpanded(isOpen ? null : app._id)}>
                                <div className="w-12 h-12 bg-indigo-600 rounded-xl shrink-0 flex items-center justify-center text-white font-black text-lg">
                                    {app.studentId?.name?.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-black text-slate-900">{app.studentId?.name}</p>
                                    <p className="text-xs font-medium text-slate-400 flex items-center gap-1 mt-0.5">
                                        <Mail className="w-3 h-3" /> {app.studentId?.email}
                                    </p>
                                </div>
                                {isGlobal && app._jobTitle && (
                                    <span className="hidden md:block text-xs font-black text-slate-400 px-3 py-1 bg-slate-50 rounded-xl truncate max-w-[160px]">
                                        {app._jobTitle}
                                    </span>
                                )}
                                <div className="flex items-center gap-2">
                                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${meta.cls}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                                        {meta.label}
                                    </div>
                                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                </div>
                            </div>

                            {}
                            <AnimatePresence>
                                {isOpen && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-slate-50">
                                        <div className="p-6 space-y-5">
                                            {}
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                {[
                                                    { label: 'Branch', value: app.studentId?.branch, icon: GraduationCap },
                                                    { label: 'Year', value: app.studentId?.year, icon: Calendar },
                                                    { label: 'CGPA', value: app.studentId?.cgpa, icon: Star },
                                                    { label: 'College', value: app.studentId?.collegeId?.name ?? '—', icon: Building2 },
                                                ].map(({ label, value, icon: Icon }) => (
                                                    <div key={label} className="bg-slate-50 rounded-xl p-4">
                                                        <div className="flex items-center gap-1.5 mb-1">
                                                            <Icon className="w-3.5 h-3.5 text-slate-400" />
                                                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
                                                        </div>
                                                        <p className="font-black text-slate-900 text-sm">{value ?? '—'}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            {}
                                            {(app.studentId?.skills ?? []).length > 0 && (
                                                <div>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1"><Zap className="w-3 h-3" /> Skills</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {app.studentId.skills.map((sk: string) => (
                                                            <span key={sk} className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black">{sk}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {}
                                            {app.createdAt && (
                                                <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5">
                                                    <Clock className="w-3 h-3" /> Applied {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </p>
                                            )}

                                            {}
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><MessageSquare className="w-3 h-3" /> Recruiter Notes</p>
                                                    <button onClick={() => setEditNote(editNote === app._id ? null : app._id)}
                                                        className="text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:underline">
                                                        {editNote === app._id ? 'Done' : 'Edit'}
                                                    </button>
                                                </div>
                                                {editNote === app._id ? (
                                                    <textarea rows={2} value={notes[app._id] ?? ''}
                                                        onChange={e => setNotes({ ...notes, [app._id]: e.target.value })}
                                                        placeholder="Add private notes about this candidate..."
                                                        className="w-full p-4 bg-slate-50 rounded-xl border-2 border-transparent focus:border-indigo-400 outline-none text-sm font-medium resize-none transition-all" />
                                                ) : (
                                                    <p className="text-sm font-medium text-slate-500 bg-slate-50 rounded-xl p-4 min-h-[48px]">
                                                        {notes[app._id] || <span className="text-slate-300 italic">No notes added yet</span>}
                                                    </p>
                                                )}
                                            </div>

                                            {}
                                            <div className="flex flex-wrap gap-2 pt-2">
                                                {[
                                                    { label: 'Shortlist', status: 'shortlisted', cls: 'bg-emerald-600 text-white hover:bg-emerald-700', icon: CheckCircle },
                                                    { label: 'Schedule Interview', status: 'interview', cls: 'bg-blue-600 text-white hover:bg-blue-700', icon: Calendar },
                                                    { label: 'Reject', status: 'rejected', cls: 'bg-red-500 text-white hover:bg-red-600', icon: XCircle },
                                                    { label: 'Mark Hired', status: 'hired', cls: 'bg-amber-500 text-white hover:bg-amber-600', icon: Star },
                                                ].map(({ label, status, cls, icon: Icon }) => (
                                                    <button key={status} onClick={() => updateStatus(app._id, status)}
                                                        disabled={app.status === status}
                                                        className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-40 ${cls}`}>
                                                        <Icon className="w-3.5 h-3.5" /> {label}
                                                    </button>
                                                ))}
                                                {app.studentId?.email && (
                                                    <a href={`mailto:${app.studentId.email}`}
                                                        className="flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all">
                                                        <ExternalLink className="w-3.5 h-3.5" /> Contact
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default ApplicantTracking;
