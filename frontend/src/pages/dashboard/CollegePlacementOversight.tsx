import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Target, Briefcase, Users, CheckCircle2,
    Loader2, Building2, ChevronRight, Star, Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/client';

const STATUS_META: Record<string, { label: string; cls: string; dot: string }> = {
    pending: { label: 'Pending', cls: 'bg-slate-100 text-slate-500', dot: 'bg-slate-400' },
    shortlisted: { label: 'Shortlisted', cls: 'bg-emerald-50 text-emerald-600', dot: 'bg-emerald-500' },
    interview: { label: 'Interview', cls: 'bg-blue-50 text-blue-600', dot: 'bg-blue-500' },
    rejected: { label: 'Rejected', cls: 'bg-red-50 text-red-600', dot: 'bg-red-500' },
    hired: { label: 'Hired', cls: 'bg-amber-50 text-amber-600', dot: 'bg-amber-500' },
};

const CollegePlacementOversight = () => {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [allApps, setAllApps] = useState<any[]>([]);

    useEffect(() => {
        const load = async () => {
            try {
                const [jobRes, appRes] = await Promise.all([
                    api.get('/jobs'),
                    api.get('/jobs/college/applications')
                ]);
                setJobs(jobRes.data);
                setAllApps(appRes.data.map((a: any) => ({
                    ...a,
                    _jobTitle: a.jobId?.title || 'Unknown Job',
                    _company: a.jobId?.company || 'Unknown Company'
                })));
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        load();
    }, []);

    const statusCounts = Object.keys(STATUS_META).reduce((acc, s) => {
        acc[s] = allApps.filter(a => (a.status ?? 'pending').toLowerCase() === s).length;
        return acc;
    }, {} as Record<string, number>);

    const isExpired = (d: string) => new Date(d) < new Date();

    if (loading) return (
        <div className="h-full flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
            <div className="flex items-center gap-5">
                <div className="p-3 bg-amber-500 rounded-2xl shadow-lg shadow-amber-200">
                    <Target className="w-7 h-7 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 italic">Placement Oversight</h1>
                    <p className="text-slate-500 font-medium text-sm mt-0.5">
                        {jobs.length} jobs · {allApps.length} applications tracked
                    </p>
                </div>
            </div>

            {/* Application Status Strip */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {Object.entries(STATUS_META).map(([status, meta]) => (
                    <div key={status} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center">
                        <div className={`flex items-center justify-center gap-1.5 mb-2`}>
                            <div className={`w-2 h-2 rounded-full ${meta.dot}`} />
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{meta.label}</span>
                        </div>
                        <p className="text-2xl font-black text-slate-900">{statusCounts[status] ?? 0}</p>
                    </div>
                ))}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Jobs', value: jobs.length, icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { label: 'Active Jobs', value: jobs.filter(j => !isExpired(j.deadline)).length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Total Applications', value: allApps.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Hired', value: statusCounts['hired'] ?? 0, icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
                ].map(({ label, value, icon: Icon, color, bg }) => (
                    <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                        <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                            <Icon className={`w-4 h-4 ${color}`} />
                        </div>
                        <p className="text-2xl font-black text-slate-900">{value}</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{label}</p>
                    </div>
                ))}
            </div>

            {/* Job-wise Application Summary */}
            <div className="space-y-3">
                <h2 className="text-lg font-black text-slate-900 italic flex items-center gap-2 px-1">
                    <Briefcase className="w-5 h-5 text-slate-400" /> Job-Wise Breakdown
                </h2>
                {jobs.map((job, i) => {
                    const expired = isExpired(job.deadline);
                    const appCount = allApps.filter(a => a._jobTitle === job.title).length;
                    const shortlisted = allApps.filter(a => a._jobTitle === job.title && a.status === 'shortlisted').length;
                    const hired = allApps.filter(a => a._jobTitle === job.title && a.status === 'hired').length;
                    return (
                        <motion.div key={job._id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-5 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                            <div className="w-11 h-11 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-indigo-50 transition-colors shrink-0">
                                <Briefcase className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-black text-slate-900 truncate">{job.title}</p>
                                <p className="text-xs font-medium text-slate-400 flex items-center gap-2">
                                    <Building2 className="w-3 h-3" /> {job.company}
                                    <Clock className="w-3 h-3 ml-2" />
                                    {new Date(job.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                </p>
                            </div>
                            <div className="hidden md:flex items-center gap-6">
                                <div className="text-center">
                                    <p className="text-xl font-black text-slate-900">{appCount}</p>
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Applied</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xl font-black text-emerald-600">{shortlisted}</p>
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Shortlisted</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xl font-black text-amber-600">{hired}</p>
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Hired</p>
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shrink-0 ${expired ? 'bg-slate-100 text-slate-400' : 'bg-emerald-50 text-emerald-600'}`}>
                                {expired ? 'Closed' : 'Open'}
                            </span>
                            <Link to={`/dashboard/recruiter/jobs/${job._id}`}
                                className="px-3 py-2 bg-slate-50 rounded-xl text-[9px] font-black text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all uppercase tracking-widest shrink-0 flex items-center gap-1">
                                View <ChevronRight className="w-3 h-3" />
                            </Link>
                        </motion.div>
                    );
                })}
                {jobs.length === 0 && (
                    <div className="py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                        <Target className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                        <p className="text-xs font-black text-slate-300 uppercase tracking-widest">No placement data yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CollegePlacementOversight;
