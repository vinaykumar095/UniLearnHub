import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Briefcase, Plus, Users, Loader2, X, MapPin, Clock,
    DollarSign, CheckCircle2, Tag,
    Building2, Globe, Zap, Calendar, Search
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';

const JOB_TYPES = ['Full-time', 'Internship', 'Part-time', 'Remote'];
const WORK_MODES = ['Onsite', 'Remote', 'Hybrid'];
const BRANCHES = ['Computer Science', 'IT', 'Electronics', 'Mechanical', 'Civil', 'Electrical', 'All Branches'];

const STATUS_META: Record<string, { label: string; cls: string }> = {
    OPEN: { label: 'Open', cls: 'bg-emerald-50 text-emerald-600' },
    CLOSED: { label: 'Closed', cls: 'bg-slate-100 text-slate-500' },
};

const EMPTY_FORM = {
    title: '', description: '', requirements: '',
    company: '', jobType: 'Full-time', workMode: 'Onsite',
    location: '', salary: '', stipend: '',
    experienceLevel: 'Entry',
    eligibility: { branches: [] as string[], minCgpa: '', skills: '' },
    deadline: '',
    visibility: 'GLOBAL' as 'GLOBAL' | 'SPECIFIC',
    collegeIds: [] as string[],
};

const RecruiterJobs = () => {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('ALL');
    const { user } = useAuth();

    const [form, setForm] = useState({ ...EMPTY_FORM, company: user?.company ?? '' });
    const [allColleges, setAllColleges] = useState<any[]>([]);
    const [collegeSearch, setCollegeSearch] = useState('');

    const fetchColleges = async () => {
        try {
            const res = await api.get('/colleges?status=active');
            setAllColleges(res.data);
        } catch (e) { console.error(e); }
    };

    const fetchJobs = async () => {
        try {
            const res = await api.get('/jobs/recruiter');
            setJobs(res.data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { 
        fetchJobs(); 
        fetchColleges();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.post('/jobs', {
                ...form,
                company: form.company || user?.company || 'Unknown Company',
                recruiterId: user?.id,
                collegeIds: form.visibility === 'GLOBAL' ? [] : form.collegeIds,
                eligibility: form.eligibility.skills
                    ? `${form.eligibility.branches.join(', ')} | ${form.eligibility.skills}`
                    : form.eligibility.branches.join(', '),
            });
            setShowForm(false);
            setForm({ ...EMPTY_FORM, company: user?.company ?? '' });
            fetchJobs();
        } catch (e) { console.error(e); }
        finally { setSaving(false); }
    };

    const toggleBranch = (branch: string) => {
        const branches = form.eligibility.branches;
        setForm({
            ...form,
            eligibility: {
                ...form.eligibility,
                branches: branches.includes(branch) ? branches.filter(b => b !== branch) : [...branches, branch]
            }
        });
    };

    const filtered = jobs
        .filter(j => j.title?.toLowerCase().includes(search.toLowerCase()) || j.company?.toLowerCase().includes(search.toLowerCase()))
        .filter(j => filterType === 'ALL' || j.jobType === filterType);

    const isExpired = (deadline: string) => new Date(deadline) < new Date();

    if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-indigo-600" /></div>;

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
            {}
            <div className="flex flex-col md:flex-row md:items-center gap-5 justify-between">
                <div className="flex items-center gap-5">
                    <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200">
                        <Briefcase className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 italic">Post Jobs & Internships</h1>
                        <p className="text-slate-500 font-medium text-sm mt-0.5">{jobs.length} posting{jobs.length !== 1 ? 's' : ''} — {jobs.filter(j => !isExpired(j.deadline)).length} active</p>
                    </div>
                </div>
                <button onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg">
                    <Plus className="w-4 h-4" /> Post New Opportunity
                </button>
            </div>

            {}
            <AnimatePresence>
                {showForm && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl p-10 space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black text-slate-900">New Opportunity</h2>
                            <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-8">
                            {}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Job Title / Role</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            required type="text" placeholder="e.g. Software Engineer Intern"
                                            value={form.title}
                                            onChange={e => setForm({ ...form, title: e.target.value })}
                                            className="w-full pl-11 pr-4 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:bg-white focus:border-indigo-600 outline-none text-sm font-medium transition-all" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Company Name</label>
                                    <div className="relative">
                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            readOnly type="text"
                                            value={form.company || user?.company || ''}
                                            className="w-full pl-11 pr-4 py-4 bg-slate-100 rounded-2xl border-2 border-transparent outline-none text-sm font-bold text-slate-500 cursor-not-allowed" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            required type="text" placeholder="e.g. Bangalore, Karnataka"
                                            value={form.location}
                                            onChange={e => setForm({ ...form, location: e.target.value })}
                                            className="w-full pl-11 pr-4 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:bg-white focus:border-indigo-600 outline-none text-sm font-medium transition-all" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Application Deadline</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            required type="date"
                                            value={form.deadline}
                                            onChange={e => setForm({ ...form, deadline: e.target.value })}
                                            className="w-full pl-11 pr-4 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:bg-white focus:border-indigo-600 outline-none text-sm font-medium transition-all" />
                                    </div>
                                </div>
                            </div>

                            {}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Job Type</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {JOB_TYPES.map(type => (
                                            <button key={type} type="button" onClick={() => setForm({ ...form, jobType: type })}
                                                className={`py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${form.jobType === type ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Experience Level</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['Intern', 'Entry', 'Mid', 'Senior'].map(level => (
                                            <button key={level} type="button" onClick={() => setForm({ ...form, experienceLevel: level })}
                                                className={`py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${form.experienceLevel === level ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Work Mode</label>
                                        <select value={form.workMode} onChange={e => setForm({ ...form, workMode: e.target.value })}
                                            className="w-full px-4 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:bg-white focus:border-indigo-600 outline-none text-sm font-medium transition-all">
                                            {WORK_MODES.map(m => <option key={m} value={m}>{m}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                            {form.jobType === 'Internship' ? 'Monthly Stipend (₹)' : 'Annual Salary (₹ LPA)'}
                                        </label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input type="text"
                                                placeholder={form.jobType === 'Internship' ? 'e.g. 15,000' : 'e.g. 8-12 LPA'}
                                                value={form.salary}
                                                onChange={e => setForm({ ...form, salary: e.target.value })}
                                                className="w-full pl-11 pr-4 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:bg-white focus:border-indigo-600 outline-none text-sm font-medium transition-all" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Job Description</label>
                                    <textarea required rows={5} value={form.description}
                                        onChange={e => setForm({ ...form, description: e.target.value })}
                                        placeholder="Describe the role, responsibilities, and day-to-day work..."
                                        className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:bg-white focus:border-indigo-600 outline-none text-sm font-medium resize-none transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Requirements</label>
                                    <textarea rows={5} value={form.requirements}
                                        onChange={e => setForm({ ...form, requirements: e.target.value })}
                                        placeholder="Skills, experience, tools required..."
                                        className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:bg-white focus:border-indigo-600 outline-none text-sm font-medium resize-none transition-all" />
                                </div>
                            </div>

                            {}
                            <div className="bg-slate-50 rounded-2xl p-6 space-y-5">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Eligibility Criteria</p>
                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-slate-600">Eligible Branches</p>
                                    <div className="flex flex-wrap gap-2">
                                        {BRANCHES.map(branch => (
                                            <button key={branch} type="button" onClick={() => toggleBranch(branch)}
                                                className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${form.eligibility.branches.includes(branch)
                                                    ? 'bg-indigo-600 text-white shadow-md'
                                                    : 'bg-white text-slate-500 border border-slate-200 hover:border-indigo-300'
                                                    }`}>
                                                {branch}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    {[
                                        { label: 'Min CGPA', field: 'minCgpa', placeholder: '6.0' },
                                    ].map(({ label, field, placeholder }) => (
                                        <div key={field} className="space-y-2">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
                                            <input type="text" placeholder={placeholder}
                                                value={(form.eligibility as any)[field]}
                                                onChange={e => setForm({ ...form, eligibility: { ...form.eligibility, [field]: e.target.value } })}
                                                className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 outline-none text-sm font-medium focus:border-indigo-400 transition-all" />
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Required Skills (comma-separated)</label>
                                    <div className="relative">
                                        <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input type="text" placeholder="e.g. React, Node.js, Python, SQL"
                                            value={form.eligibility.skills}
                                            onChange={e => setForm({ ...form, eligibility: { ...form.eligibility, skills: e.target.value } })}
                                            className="w-full pl-11 pr-4 py-3 bg-white rounded-xl border border-slate-200 outline-none text-sm font-medium focus:border-indigo-400 transition-all" />
                                    </div>
                                </div>
                            </div>

                            {}
                            <div className="bg-white rounded-[2.5rem] border-2 border-slate-100 p-8 space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-50 rounded-xl">
                                        <Globe className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-slate-900">Job Visibility</h3>
                                        <p className="text-xs font-bold text-slate-400">Choose who can see this posting</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button type="button" onClick={() => setForm({ ...form, visibility: 'GLOBAL', collegeIds: [] })}
                                        className={`flex-1 p-5 rounded-3xl border-2 transition-all text-left ${form.visibility === 'GLOBAL' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-50 bg-slate-50/50 hover:border-slate-200'}`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <Globe className={`w-6 h-6 ${form.visibility === 'GLOBAL' ? 'text-indigo-600' : 'text-slate-400'}`} />
                                            {form.visibility === 'GLOBAL' && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                                        </div>
                                        <p className={`font-black text-sm uppercase tracking-wider ${form.visibility === 'GLOBAL' ? 'text-indigo-900' : 'text-slate-600'}`}>Global Posting</p>
                                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Available to all colleges</p>
                                    </button>

                                    <button type="button" onClick={() => setForm({ ...form, visibility: 'SPECIFIC' })}
                                        className={`flex-1 p-5 rounded-3xl border-2 transition-all text-left ${form.visibility === 'SPECIFIC' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-50 bg-slate-50/50 hover:border-slate-200'}`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <Users className={`w-6 h-6 ${form.visibility === 'SPECIFIC' ? 'text-indigo-600' : 'text-slate-400'}`} />
                                            {form.visibility === 'SPECIFIC' && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                                        </div>
                                        <p className={`font-black text-sm uppercase tracking-wider ${form.visibility === 'SPECIFIC' ? 'text-indigo-900' : 'text-slate-600'}`}>Targeted Posting</p>
                                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Select specific colleges</p>
                                    </button>
                                </div>

                                {form.visibility === 'SPECIFIC' && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4 pt-4 border-t border-slate-100">
                                        <div className="relative">
                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input type="text" placeholder="Search colleges..." value={collegeSearch} onChange={e => setCollegeSearch(e.target.value)}
                                                className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-xl outline-none text-xs font-bold" />
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
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
                                                        className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${isSelected ? 'border-indigo-200 bg-indigo-50' : 'border-transparent bg-slate-50'}`}>
                                                        <div className={`w-4 h-4 rounded flex items-center justify-center border-2 ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'}`}>
                                                            {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                                                        </div>
                                                        <span className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? 'text-indigo-900' : 'text-slate-500'}`}>{college.name}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        {form.collegeIds.length > 0 && (
                                            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50/50 px-4 py-2 rounded-lg inline-block">
                                                {form.collegeIds.length} college{form.collegeIds.length !== 1 ? 's' : ''} selected
                                            </p>
                                        )}
                                    </motion.div>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <button type="submit" disabled={saving}
                                    className="flex-1 bg-slate-900 hover:bg-indigo-600 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 uppercase tracking-widest text-sm italic transition-all shadow-2xl shadow-slate-200 disabled:opacity-50">
                                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CheckCircle2 className="w-5 h-5" /> Post Opportunity</>}
                                </button>
                                <button type="button" onClick={() => setShowForm(false)}
                                    className="px-10 py-5 border-2 border-slate-200 text-slate-500 font-black rounded-2xl hover:border-slate-300 transition-all text-sm uppercase tracking-widest">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-5 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search by job title or company..."
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-2xl text-sm font-medium outline-none" />
                </div>
                <div className="flex gap-2">
                    {['ALL', ...JOB_TYPES].map(type => (
                        <button key={type} onClick={() => setFilterType(type)}
                            className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterType === type ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {}
            {filtered.length === 0 ? (
                <div className="py-24 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                    <Briefcase className="w-14 h-14 text-slate-200 mx-auto mb-4" />
                    <p className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">No postings found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((job, i) => {
                        const expired = isExpired(job.deadline);
                        const statusMeta = expired ? STATUS_META.CLOSED : STATUS_META.OPEN;
                        return (
                            <motion.div key={job._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                                className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-7 hover:shadow-xl hover:-translate-y-1 transition-all group space-y-5">
                                <div className="flex items-start justify-between">
                                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                                        <Briefcase className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${statusMeta.cls}`}>{statusMeta.label}</span>
                                </div>

                                <div>
                                    <h3 className="font-black text-slate-900 text-lg leading-snug">{job.title}</h3>
                                    <p className="text-sm font-medium text-slate-500 mt-1">{job.company || user?.company}</p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {job.jobType && (
                                        <span className="flex items-center gap-1 px-3 py-1 bg-slate-50 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest">
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

                                <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                                    <div className="flex items-center gap-1.5 text-slate-400">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span className="text-[10px] font-bold">{new Date(job.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                    </div>
                                    <div className="ml-auto flex gap-2">
                                        <Link to={`/dashboard/recruiter/jobs/${job._id}`}
                                            className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 uppercase tracking-widest transition-all">
                                            <Users className="w-3.5 h-3.5" /> {job.applications?.length ?? 0} Apps
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default RecruiterJobs;
