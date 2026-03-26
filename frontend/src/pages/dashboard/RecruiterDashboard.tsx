import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Briefcase, Users, CheckCircle2,
    Loader2, ChevronRight, Plus, Target, Star, Zap,
    TrendingUp, Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';

const StatCard = ({ icon: Icon, label, value, color, delay }: any) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
        className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-7 flex items-center gap-5 hover:shadow-xl hover:-translate-y-1 transition-all group">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
            <Icon className="w-7 h-7" />
        </div>
        <div>
            <p className="text-3xl font-black text-slate-900 leading-none">{value ?? '—'}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5">{label}</p>
        </div>
    </motion.div>
);

const RecruiterDashboard = () => {
    const { user } = useAuth();
    const [jobs, setJobs] = useState<any[]>([]);
    const [recentApps, setRecentApps] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const jobsRes = await api.get('/jobs/recruiter');
                const jobList = jobsRes.data;
                setJobs(jobList);

                
                const apps: any[] = [];
                for (const job of jobList.slice(0, 4)) {
                    if (apps.length >= 5) break;
                    try {
                        const res = await api.get(`/jobs/${job._id}/applicants`);
                        res.data.slice(0, 2).forEach((a: any) => {
                            if (apps.length < 5) apps.push({ ...a, _jobTitle: job.title });
                        });
                    } catch { }
                }
                setRecentApps(apps);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        load();
    }, []);

    if (loading) return (
        <div className="h-full flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        </div>
    );

    const isExpired = (d: string) => new Date(d) < new Date();
    const activeJobs = jobs.filter(j => !isExpired(j.deadline));
    const totalApplicants = jobs.reduce((acc, j) => acc + (j.applications?.length ?? 0), 0);
    const shortlisted = recentApps.filter(a => a.status === 'shortlisted').length;

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-20">
            {}
            <div className="bg-slate-900 rounded-[3rem] p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 blur-[100px]" />
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full mb-6">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-black text-white/80 uppercase tracking-widest">Recruiter Portal</span>
                    </div>
                    <h1 className="text-4xl font-black text-white italic mb-3">
                        Welcome back, {user?.name?.split(' ')[0]} 👋
                    </h1>
                    <p className="text-slate-400 font-medium max-w-lg mb-8">
                        {user?.company ? `Recruiting for ${user.company} · ` : ''}
                        {activeJobs.length} active listing{activeJobs.length !== 1 ? 's' : ''}, {totalApplicants} total applications.
                    </p>
                    <div className="flex gap-4 flex-wrap">
                        <Link to="/dashboard/recruiter/jobs" className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-lg shadow-indigo-900/40">
                            <Plus className="w-4 h-4" /> Post New Job
                        </Link>
                        <Link to="/dashboard/recruiter/applications" className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/20 transition-all flex items-center gap-2">
                            <Users className="w-4 h-4" /> All Applications
                        </Link>
                    </div>
                </div>
            </div>

            {}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard icon={Briefcase} label="Total Postings" value={jobs.length} color="bg-indigo-50 text-indigo-600" delay={0.1} />
                <StatCard icon={Zap} label="Active Listings" value={activeJobs.length} color="bg-emerald-50 text-emerald-600" delay={0.15} />
                <StatCard icon={Users} label="Total Applicants" value={totalApplicants} color="bg-blue-50 text-blue-600" delay={0.2} />
                <StatCard icon={CheckCircle2} label="Drive Shortlisted" value={shortlisted} color="bg-amber-50 text-amber-600" delay={0.25} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {}
                <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-lg font-black text-slate-900 italic flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-slate-400" /> Job Posting Summary
                        </h2>
                        <Link to="/dashboard/recruiter/jobs" className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline flex items-center gap-1">
                            All Postings <ChevronRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {jobs.slice(0, 6).map((job, i) => {
                            const expired = isExpired(job.deadline);
                            const appCount = job.applications?.length ?? 0;
                            return (
                                <motion.div key={job._id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                                    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                                    <div className="w-11 h-11 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-indigo-50 transition-colors shrink-0">
                                        <Briefcase className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-black text-slate-900 text-sm truncate">{job.title}</p>
                                        <p className="text-[10px] font-medium text-slate-400 mt-0.5 flex items-center gap-1.5">
                                            <Clock className="w-3 h-3" />
                                            Deadline: {new Date(job.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>

                                    {}
                                    <div className="text-center hidden md:block">
                                        <p className="text-xl font-black text-slate-900">{appCount}</p>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Apps</p>
                                    </div>

                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shrink-0 ${expired ? 'bg-slate-100 text-slate-400' : 'bg-emerald-50 text-emerald-600'}`}>
                                        {expired ? 'Closed' : 'Open'}
                                    </span>
                                    <Link to={`/dashboard/recruiter/jobs/${job._id}`}
                                        className="px-3 py-2 bg-slate-50 rounded-xl text-[9px] font-black text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all uppercase tracking-widest shrink-0">
                                        View
                                    </Link>
                                </motion.div>
                            );
                        })}
                        {jobs.length === 0 && (
                            <div className="py-16 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                                <Target className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                <p className="font-black text-slate-400 uppercase tracking-widest text-xs mb-4">No postings yet</p>
                                <Link to="/dashboard/recruiter/jobs" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all">
                                    <Plus className="w-3.5 h-3.5" /> Post First Job
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {}
                <div className="lg:col-span-5 space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-lg font-black text-slate-900 italic flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-slate-400" /> Recent Applicants
                        </h2>
                        <Link to="/dashboard/recruiter/applications" className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline flex items-center gap-1">
                            All <ChevronRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {recentApps.length === 0 && (
                            <div className="py-12 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                                <Users className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No applications yet</p>
                            </div>
                        )}
                        {recentApps.map((app, i) => {
                            const STATUS_CLS: Record<string, string> = {
                                pending: 'bg-slate-100 text-slate-500',
                                shortlisted: 'bg-emerald-50 text-emerald-600',
                                interview: 'bg-blue-50 text-blue-600',
                                rejected: 'bg-red-50 text-red-500',
                                hired: 'bg-amber-50 text-amber-600',
                            };
                            return (
                                <motion.div key={app._id + i} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                                    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all">
                                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-base shrink-0">
                                        {app.studentId?.name?.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-black text-slate-900 text-sm truncate">{app.studentId?.name}</p>
                                        <p className="text-[10px] font-medium text-slate-400 truncate">{app._jobTitle}</p>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shrink-0 ${STATUS_CLS[app.status] ?? STATUS_CLS.pending}`}>
                                        {app.status ?? 'pending'}
                                    </span>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Post Jobs', icon: Plus, path: '/dashboard/recruiter/jobs', color: 'bg-indigo-600 text-white' },
                    { label: 'Applications', icon: Users, path: '/dashboard/recruiter/applications', color: 'bg-emerald-600 text-white' },
                    { label: 'Student Insights', icon: TrendingUp, path: '/dashboard/recruiter/insights', color: 'bg-blue-600 text-white' },
                    { label: 'Placement Drives', icon: Star, path: '/dashboard/recruiter/drives', color: 'bg-amber-500 text-white' },
                ].map(({ label, icon: Icon, path, color }) => (
                    <Link key={label} to={path}
                        className={`${color} rounded-2xl p-6 flex flex-col items-center gap-3 hover:opacity-90 hover:shadow-xl transition-all font-black text-sm uppercase tracking-widest text-center`}>
                        <Icon className="w-7 h-7" />
                        {label}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default RecruiterDashboard;
