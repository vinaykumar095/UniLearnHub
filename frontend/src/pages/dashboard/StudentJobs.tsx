import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Briefcase, Search, Calendar, CheckCircle2, Clock, XCircle,
    Loader2, MapPin, Globe, DollarSign, Tag, Star,
    ChevronDown, Zap, Filter, GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';

// All 5 statuses the recruiter can set
const STATUS_CFG: Record<string, { color: string; bg: string; icon: any; label: string }> = {
    pending: { color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', icon: Clock, label: 'Pending' },
    applied: { color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', icon: Clock, label: 'Pending' },
    shortlisted: { color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', icon: CheckCircle2, label: 'Shortlisted' },
    interview: { color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', icon: Calendar, label: 'Interview Scheduled' },
    rejected: { color: 'text-red-700', bg: 'bg-red-50 border-red-200', icon: XCircle, label: 'Rejected' },
    hired: { color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', icon: Star, label: 'Hired 🎉' },
    // legacy uppercase variants
    PENDING: { color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', icon: Clock, label: 'Pending' },
    SHORTLISTED: { color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', icon: CheckCircle2, label: 'Shortlisted' },
    REJECTED: { color: 'text-red-700', bg: 'bg-red-50 border-red-200', icon: XCircle, label: 'Rejected' },
    ACCEPTED: { color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', icon: CheckCircle2, label: 'Accepted' },
};

const JOB_TYPES = ['All', 'Full-time', 'Internship', 'Part-time', 'Remote'];
const WORK_MODES = ['All', 'Onsite', 'Remote', 'Hybrid'];

const StudentJobs = () => {
    const { user } = useAuth();
    const [jobs, setJobs] = useState<any[]>([]);
    const [drives, setDrives] = useState<any[]>([]);
    const [myApplications, setMyApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [applyingId, setApplyingId] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');
    const [modeFilter, setModeFilter] = useState('All');
    const [activeTab, setActiveTab] = useState<'browse' | 'drives' | 'tracker'>('browse');
    const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
    const [expandedJob, setExpandedJob] = useState<string | null>(null);
    const [showApplyModal, setShowApplyModal] = useState<any>(null);
    const [applyForm, setApplyForm] = useState({ resumeUrl: '', portfolioLink: '', coverLetter: '' });

    const load = async () => {
        try {
            const params = user?.collegeId ? `?collegeId=${user.collegeId}` : '';
            const [jobsRes, drivesRes, appsRes] = await Promise.all([
                api.get(`/jobs${params}`),
                api.get(`/placement-drives${params}`),
                api.get('/jobs/student/applications'),
            ]);
            setJobs(jobsRes.data);
            setDrives(drivesRes.data);
            setMyApplications(appsRes.data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { load(); }, [user]);

    const appliedJobIds = new Set(myApplications.map((a: any) => a.jobId?._id || a.jobId?.id || a.jobId));

    const handleApply = async () => {
        if (!showApplyModal) return;
        setApplyingId(showApplyModal.id || showApplyModal._id);
        try {
            await api.post('/jobs/apply', { 
                jobId: showApplyModal.id || showApplyModal._id,
                ...applyForm
            });
            setMessage({ type: 'success', text: 'Application submitted successfully! 🎉' });
            setShowApplyModal(null);
            setApplyForm({ resumeUrl: '', portfolioLink: '', coverLetter: '' });
            await load();
        } catch (e: any) {
            setMessage({ type: 'error', text: e.response?.data?.message || 'Failed to apply.' });
        } finally {
            setApplyingId(null);
            setTimeout(() => setMessage(null), 3500);
        }
    };

    const isExpired = (deadline: string) => new Date(deadline) < new Date();

    const filtered = jobs
        .filter(j =>
            j.title?.toLowerCase().includes(search.toLowerCase()) ||
            j.company?.toLowerCase().includes(search.toLowerCase())
        )
        .filter(j => typeFilter === 'All' || j.jobType === typeFilter)
        .filter(j => modeFilter === 'All' || j.workMode === modeFilter);

    if (loading) return (
        <div className="h-full flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-slate-900 italic">Job Career</h1>
                <p className="text-slate-500 font-medium mt-1">Discover opportunities posted by recruiters and track your applications.</p>
            </div>

            {/* Toast */}
            <AnimatePresence>
                {message && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className={`p-4 rounded-2xl text-sm font-bold border ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                        {message.text}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tabs */}
            <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit">
                {(['browse', 'drives', 'tracker'] as const).map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === tab ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>
                        {tab === 'browse' ? `Browse Jobs (${jobs.length})` : tab === 'drives' ? `Placement Drives (${drives.length})` : `My Applications (${myApplications.length})`}
                    </button>
                ))}
            </div>
            {activeTab === 'browse' ? (
                <>
                    {/* Search + Filters */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-6 space-y-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input placeholder="Search by role, company..." type="text" value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 rounded-2xl outline-none font-medium text-sm focus:ring-2 focus:ring-indigo-100 transition-all" />
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <div className="flex items-center gap-2">
                                <Filter className="w-3.5 h-3.5 text-slate-400" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type:</span>
                                <div className="flex gap-1.5">
                                    {JOB_TYPES.map(t => (
                                        <button key={t} onClick={() => setTypeFilter(t)}
                                            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${typeFilter === t ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mode:</span>
                                <div className="flex gap-1.5">
                                    {WORK_MODES.map(m => (
                                        <button key={m} onClick={() => setModeFilter(m)}
                                            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${modeFilter === m ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                                            {m}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Job Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {filtered.map((job, i) => {
                            const applied = appliedJobIds.has(job.id?.toString() || job._id?.toString());
                            const expired = isExpired(job.deadline);
                            const isOpen = expandedJob === (job._id || job.id);

                            return (
                                <motion.div key={job._id || job.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                    className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all overflow-hidden">
                                    <div className="p-7">
                                        {/* Top row */}
                                        <div className="flex items-start justify-between mb-5">
                                            <div className="flex items-center gap-4">
                                                {job.companyLogo ? (
                                                    <img src={job.companyLogo} alt={job.company} className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shadow-sm" />
                                                ) : (
                                                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center font-black text-white text-xl uppercase shadow-lg shadow-indigo-200">
                                                        {job.company?.charAt(0) || 'C'}
                                                    </div>
                                                )}
                                                <div>
                                                    <h3 className="font-black text-slate-900 text-lg leading-tight">{job.title}</h3>
                                                    <p className="text-sm font-bold text-slate-500 flex items-center gap-2">
                                                        {job.company}
                                                        {job.experienceLevel && <span className="w-1 h-1 bg-slate-300 rounded-full" />}
                                                        <span className="text-primary-600 italic uppercase tracking-wider text-[10px]">{job.experienceLevel}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                {applied && (() => {
                                                    const app = myApplications.find(a => (a.jobId?._id || a.jobId?.id || a.jobId) === (job._id || job.id));
                                                    const rawStatus = (app?.status ?? 'pending').toLowerCase();
                                                    const cfg = STATUS_CFG[rawStatus] ?? STATUS_CFG[app?.status] ?? STATUS_CFG.pending;
                                                    const StatusIcon = cfg.icon;
                                                    return (
                                                        <span className={`text-[9px] font-black px-2.5 py-1 ${cfg.bg} ${cfg.color} border rounded-full uppercase tracking-widest flex items-center gap-1.5`}>
                                                            <StatusIcon className="w-3 h-3" /> {cfg.label} ✓
                                                        </span>
                                                    );
                                                })()}
                                                <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${expired ? 'bg-slate-100 text-slate-400' : 'bg-emerald-50 text-emerald-600'}`}>
                                                    {expired ? 'Closed' : 'Open'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {job.jobType && (
                                                <span className="flex items-center gap-1 px-3 py-1 bg-indigo-50 rounded-full text-[9px] font-black text-indigo-600 uppercase tracking-widest">
                                                    <Tag className="w-2.5 h-2.5" /> {job.jobType}
                                                </span>
                                            )}
                                            {job.workMode && (
                                                <span className="flex items-center gap-1 px-3 py-1 bg-slate-50 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                                    <Globe className="w-2.5 h-2.5" /> {job.workMode}
                                                </span>
                                            )}
                                            {job.location && (
                                                <span className="flex items-center gap-1 px-3 py-1 bg-slate-50 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                                    <MapPin className="w-2.5 h-2.5" /> {job.location}
                                                </span>
                                            )}
                                            {job.salary && (
                                                <span className="flex items-center gap-1 px-3 py-1 bg-emerald-50 rounded-full text-[9px] font-black text-emerald-600 uppercase tracking-widest">
                                                    <DollarSign className="w-2.5 h-2.5" /> {job.salary}
                                                </span>
                                            )}
                                        </div>

                                        {/* Description */}
                                        <p className={`text-sm text-slate-600 font-medium leading-relaxed mb-4 ${!isOpen ? 'line-clamp-2' : ''}`}>
                                            {job.description}
                                        </p>

                                        {/* Eligibility + Deadline */}
                                        <div className="flex flex-wrap gap-3 text-[10px] text-slate-400 font-bold mb-4">
                                            {job.eligibility && (
                                                <span className="flex items-center gap-1.5">
                                                    <GraduationCap className="w-3.5 h-3.5 text-indigo-400" /> {job.eligibility}
                                                </span>
                                            )}
                                            {job.deadline && (
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5 text-red-400" />
                                                    Closes {new Date(job.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </span>
                                            )}
                                        </div>

                                        {/* Show more toggle */}
                                        {job.requirements && (
                                            <button onClick={() => setExpandedJob(isOpen ? null : (job._id || job.id))}
                                                className="flex items-center gap-1 text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-4 hover:underline">
                                                <Zap className="w-3 h-3" />
                                                {isOpen ? 'Less Info' : 'View Requirements'}
                                                <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                            </button>
                                        )}

                                        <AnimatePresence>
                                            {isOpen && job.requirements && (
                                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                                    className="bg-slate-50 rounded-2xl p-4 mb-4 text-sm font-medium text-slate-600 leading-relaxed">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Requirements</p>
                                                    {job.requirements}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Apply Button */}
                                        <button onClick={() => !applied && !expired && setShowApplyModal(job)}
                                            disabled={applied || expired || applyingId === (job._id || job.id)}
                                            className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all uppercase tracking-widest ${applied
                                                ? 'bg-emerald-50 text-emerald-600 cursor-default border border-emerald-200'
                                                : expired
                                                    ? 'bg-slate-50 text-slate-400 cursor-not-allowed'
                                                    : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-lg shadow-slate-100 active:scale-95'
                                                }`}>
                                            {applyingId === (job._id || job.id)
                                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                                : applied
                                                    ? (() => {
                                                        const app = myApplications.find(a => (a.jobId?._id || a.jobId?.id || a.jobId) === (job._id || job.id));
                                                        const rawStatus = (app?.status ?? 'pending').toLowerCase();
                                                        const cfg = STATUS_CFG[rawStatus] ?? STATUS_CFG[app?.status] ?? STATUS_CFG.pending;
                                                        const StatusIcon = cfg.icon;
                                                        return <><StatusIcon className="w-4 h-4" /> {cfg.label}</>;
                                                    })()
                                                    : expired
                                                        ? 'Deadline Passed'
                                                        : <><Zap className="w-4 h-4" /> Easy Apply</>
                                            }
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}

                        {filtered.length === 0 && (
                            <div className="col-span-full text-center py-24 bg-white rounded-[3rem] border border-dashed border-slate-200">
                                <Briefcase className="w-14 h-14 text-slate-200 mx-auto mb-4" />
                                <p className="font-black text-slate-400 uppercase tracking-widest text-xs">No job openings match your filters</p>
                            </div>
                        )}
                    </div>
                </>
            ) : activeTab === 'drives' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {drives.map((drive, i) => (
                        <motion.div key={drive._id || drive.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                            className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 space-y-6 hover:shadow-xl transition-all relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8">
                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                    drive.status === 'UPCOMING' ? 'bg-blue-50 text-blue-600' : 
                                    drive.status === 'ONGOING' ? 'bg-emerald-50 text-emerald-600' : 
                                    'bg-slate-100 text-slate-500'
                                }`}>
                                    {drive.status}
                                </span>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center shrink-0">
                                    <Star className="w-7 h-7 text-amber-500 shadow-sm" />
                                </div>
                                <div className="flex-1 pr-12">
                                    <h3 className="text-xl font-black text-slate-900 leading-tight">{drive.title}</h3>
                                    <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-wider">{drive.company}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Date</p>
                                        <p className="text-xs font-bold text-slate-700">{new Date(drive.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                    </div>
                                </div>
                                <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
                                    <MapPin className="w-4 h-4 text-slate-400" />
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Venue</p>
                                        <p className="text-xs font-bold text-slate-700 truncate">{drive.venue}</p>
                                    </div>
                                </div>
                            </div>

                            {drive.openRoles?.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Open Roles</p>
                                    <div className="flex flex-wrap gap-2">
                                        {drive.openRoles.map((role: string) => (
                                            <span key={role} className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                                {role}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {drive.registrationLink && (
                                <a href={drive.registrationLink} target="_blank" rel="noopener noreferrer"
                                    className="block w-full py-4 bg-slate-900 hover:bg-amber-500 text-white text-center rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg active:scale-95">
                                    Register Now
                                </a>
                            )}
                        </motion.div>
                    ))}

                    {drives.length === 0 && (
                        <div className="col-span-full text-center py-24 bg-white rounded-[3rem] border border-dashed border-slate-200">
                            <Star className="w-14 h-14 text-slate-200 mx-auto mb-4" />
                            <p className="font-black text-slate-400 uppercase tracking-widest text-xs">No active placement drives found</p>
                        </div>
                    )}
                </div>
            ) : (
                /* Application Tracker */
                <div className="space-y-4">
                    {/* Status summary strip */}
                    {myApplications.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-2">
                            {Object.entries({
                                pending: 'Pending', shortlisted: 'Shortlisted', interview: 'Interview',
                                rejected: 'Rejected', hired: 'Hired',
                            }).map(([status, label]) => {
                                const count = myApplications.filter(a => {
                                    const s = (a.status ?? 'pending').toLowerCase();
                                    return s === status || (status === 'pending' && s === 'applied');
                                }).length;
                                const cfg = STATUS_CFG[status];
                                const Icon = cfg.icon;
                                return (
                                    <div key={status} className={`p-4 rounded-2xl border text-center ${cfg.bg}`}>
                                        <Icon className={`w-5 h-5 mx-auto mb-1 ${cfg.color}`} />
                                        <p className={`text-xl font-black ${cfg.color}`}>{count}</p>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {myApplications.length === 0 ? (
                        <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-slate-200">
                            <Briefcase className="w-14 h-14 text-slate-200 mx-auto mb-4" />
                            <p className="font-black text-slate-400 uppercase tracking-widest text-xs mb-2">No applications yet</p>
                            <button onClick={() => setActiveTab('browse')}
                                className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all">
                                Browse Jobs
                            </button>
                        </div>
                    ) : (
                        myApplications.map((app: any, i) => {
                            const rawStatus = (app.status ?? 'pending').toLowerCase();
                            const cfg = STATUS_CFG[rawStatus] ?? STATUS_CFG[app.status] ?? STATUS_CFG.pending;
                            const Icon = cfg.icon;
                            return (
                                <motion.div key={app._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                                    className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 flex items-center gap-5 hover:shadow-md hover:-translate-y-0.5 transition-all">
                                    <div className="w-13 h-13 w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center font-black text-white text-xl uppercase shadow-md shrink-0">
                                        {app.jobId?.title?.charAt(0) || 'J'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-black text-slate-900">{app.jobId?.title || 'Position'}</h3>
                                        <p className="text-xs font-medium text-slate-400 mt-0.5">
                                            {app.jobId?.company && <span className="font-bold text-slate-600 mr-2">{app.jobId.company}</span>}
                                            Applied {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                        {(app.jobId?.jobType || app.jobId?.workMode) && (
                                            <div className="flex gap-2 mt-1.5">
                                                {app.jobId?.jobType && <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-black">{app.jobId.jobType}</span>}
                                                {app.jobId?.workMode && <span className="px-2 py-0.5 bg-slate-50 text-slate-500 rounded-full text-[9px] font-black">{app.jobId.workMode}</span>}
                                            </div>
                                        )}
                                    </div>
                                    <div className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-sm font-black shrink-0 ${cfg.bg} ${cfg.color}`}>
                                        <Icon className="w-4 h-4" />
                                        {cfg.label}
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            )}
            {/* Easy Apply Modal */}
            <AnimatePresence>
                {showApplyModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden border border-white">
                            <div className="bg-slate-900 p-8 text-white relative">
                                <button onClick={() => setShowApplyModal(null)} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-xl transition-colors">
                                    <XCircle className="w-6 h-6 text-white/50" />
                                </button>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center font-black text-white text-lg italic">
                                        EA
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black leading-tight">{showApplyModal.title}</h3>
                                        <p className="text-white/60 text-xs font-bold uppercase tracking-widest">{showApplyModal.company}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Apply as</p>
                                        <p className="text-sm font-black text-slate-900">{user?.name}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</p>
                                        <p className="text-sm font-black text-slate-900 truncate">{user?.email}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Portfolio / LinkedIn Link</label>
                                        <div className="relative">
                                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input type="url" placeholder="https://linkedin.com/in/username"
                                                value={applyForm.portfolioLink}
                                                onChange={e => setApplyForm({ ...applyForm, portfolioLink: e.target.value })}
                                                className="w-full pl-11 pr-4 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:bg-white focus:border-indigo-600 outline-none text-sm font-medium transition-all" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Resume Drive Link</label>
                                        <div className="relative">
                                            <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input type="url" placeholder="https://drive.google.com/..."
                                                value={applyForm.resumeUrl}
                                                onChange={e => setApplyForm({ ...applyForm, resumeUrl: e.target.value })}
                                                className="w-full pl-11 pr-4 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:bg-white focus:border-indigo-600 outline-none text-sm font-medium transition-all" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Short Cover Note (Optional)</label>
                                        <textarea rows={3} placeholder="Tell the recruiter why you are a good fit..."
                                            value={applyForm.coverLetter}
                                            onChange={e => setApplyForm({ ...applyForm, coverLetter: e.target.value })}
                                            className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:bg-white focus:border-indigo-600 outline-none text-sm font-medium transition-all resize-none" />
                                    </div>
                                </div>

                                <button onClick={handleApply} disabled={!!applyingId || !applyForm.resumeUrl}
                                    className="w-full py-5 bg-slate-900 hover:bg-indigo-600 text-white font-black rounded-2xl flex items-center justify-center gap-3 uppercase tracking-widest text-sm italic transition-all shadow-2xl shadow-indigo-100 disabled:opacity-50">
                                    {applyingId ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Zap className="w-5 h-5 text-amber-400 fill-amber-400" /> Submit Application</>}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StudentJobs;
