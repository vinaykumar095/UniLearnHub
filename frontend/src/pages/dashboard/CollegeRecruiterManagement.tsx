import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Building2, Search, ChevronDown, Loader2, Briefcase,
    CheckCircle2, Globe, Mail, Star, Shield
} from 'lucide-react';
import api from '../../api/client';

const CollegeRecruiterManagement = () => {
    const [recruiters, setRecruiters] = useState<any[]>([]);
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [expanded, setExpanded] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const [recRes, jobRes] = await Promise.all([
                    api.get('/users?role=RECRUITER'),
                    api.get('/jobs'),
                ]);
                setRecruiters(recRes.data);
                setJobs(jobRes.data);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        load();
    }, []);

    const getRecruiterJobs = (rId: string) => jobs.filter((j: any) => j.recruiterId === rId || j.recruiter?._id === rId);

    const filtered = recruiters.filter(r => {
        return r.name?.toLowerCase().includes(search.toLowerCase()) ||
               r.company?.toLowerCase().includes(search.toLowerCase());
    });

    if (loading) return (
        <div className="h-full flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
            <div className="flex items-center gap-5">
                <div className="p-3 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-200">
                    <Building2 className="w-7 h-7 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 italic">Recruiter Management</h1>
                    <p className="text-slate-500 font-medium text-sm mt-0.5">{recruiters.length} recruiters · {jobs.length} active job postings</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Total Recruiters', value: recruiters.length, icon: Building2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Approved', value: recruiters.filter(r => r.status === 'active').length, icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Job Postings', value: jobs.length, icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                ].map(({ label, value, icon: Icon, color, bg }) => (
                    <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                        <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                            <Icon className={`w-4 h-4 ${color}`} />
                        </div>
                        <p className="text-2xl font-black text-slate-900">{value}</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{label}</p>
                    </div>
                ))}
            </div>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search by name or company..."
                    className="w-full pl-11 pr-4 py-3.5 bg-white rounded-2xl border border-slate-100 shadow-sm text-sm font-medium outline-none" />
            </div>

            <div className="space-y-2">
                {filtered.length === 0 && (
                    <div className="py-24 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                        <Building2 className="w-14 h-14 text-slate-200 mx-auto mb-4" />
                        <p className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">No recruiters found</p>
                    </div>
                )}
                {filtered.map((recruiter, i) => {
                    const rJobs = getRecruiterJobs(recruiter._id);
                    const isOpen = expanded === recruiter._id;
                    return (
                        <motion.div key={recruiter._id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-5 flex items-center gap-5 cursor-pointer hover:bg-slate-50/50 transition-colors"
                                onClick={() => setExpanded(isOpen ? null : recruiter._id)}>
                                <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xl shrink-0">
                                    {recruiter.company?.charAt(0) ?? recruiter.name?.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-black text-slate-900">{recruiter.name}</p>
                                    <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                                        <Building2 className="w-3 h-3" /> {recruiter.company ?? 'Company not set'}
                                    </p>
                                </div>
                                <div className="hidden md:flex items-center gap-4">
                                    <div className="text-center">
                                        <p className="text-lg font-black text-slate-900">{rJobs.length}</p>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Jobs</p>
                                    </div>
                                    <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${recruiter.status === 'active' ? 'bg-emerald-50 text-emerald-600' : recruiter.status === 'suspended' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                                        <Shield className="w-3 h-3" /> {recruiter.status === 'active' ? 'Approved' : recruiter.status === 'suspended' ? 'Suspended' : 'Pending'}
                                    </span>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                            </div>

                            <AnimatePresence>
                                {isOpen && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-slate-50 px-5 pb-5 pt-4 space-y-4">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {[
                                                { label: 'Company', value: recruiter.company ?? '—', icon: Building2 },
                                                { label: 'Email', value: recruiter.email, icon: Mail },
                                                { label: 'Industry', value: recruiter.industry ?? '—', icon: Star },
                                                { label: 'Job Postings', value: rJobs.length, icon: Briefcase },
                                            ].map(({ label, value, icon: Icon }) => (
                                                <div key={label} className="bg-slate-50 rounded-xl p-4">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Icon className="w-3.5 h-3.5 text-slate-400" />
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
                                                    </div>
                                                    <p className="font-black text-slate-900 text-sm truncate">{value}</p>
                                                </div>
                                            ))}
                                        </div>
                                        {rJobs.length > 0 && (
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Job Postings</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {rJobs.map((j: any) => (
                                                        <span key={j._id} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black">{j.title}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex gap-2 pt-2">
                                            {recruiter.website && (
                                                <a href={recruiter.website} target="_blank" rel="noreferrer"
                                                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">
                                                    <Globe className="w-3.5 h-3.5" /> Website
                                                </a>
                                            )}
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

export default CollegeRecruiterManagement;
