import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Users, TrendingUp, BookOpen, Star, Loader2,
    Search, ChevronDown, Award, Zap, GraduationCap, Filter,
    PieChart, BarChart3, Target
} from 'lucide-react';
import api from '../../api/client';

const SKILL_TAGS = ['React', 'Node.js', 'Python', 'Java', 'Machine Learning', 'Data Science', 'SQL', 'AWS', 'TypeScript', 'Flutter', 'DSA', 'System Design'];

const RecruiterStudentInsights = () => {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [skillFilter, setSkillFilter] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [expanded, setExpanded] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await api.get('/users?role=STUDENT');
                setStudents(res.data);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        load();
    }, []);

    const filtered = students
        .filter(s => s.name?.toLowerCase().includes(search.toLowerCase()) || s.email?.toLowerCase().includes(search.toLowerCase()))
        .filter(s => !skillFilter || (s.skills || []).some((sk: string) => sk.toLowerCase().includes(skillFilter.toLowerCase())))
        .sort((a, b) => {
            if (sortBy === 'cgpa') return (b.cgpa ?? 0) - (a.cgpa ?? 0);
            if (sortBy === 'year') return (a.year ?? '').localeCompare(b.year ?? '');
            return a.name?.localeCompare(b.name ?? '') ?? 0;
        });

    // Aggregate analytics
    const branchCount: Record<string, number> = {};
    const skillCount: Record<string, number> = {};
    let totalCgpa = 0, cgpaCount = 0;

    students.forEach(s => {
        if (s.branch) branchCount[s.branch] = (branchCount[s.branch] ?? 0) + 1;
        (s.skills ?? []).forEach((sk: string) => { skillCount[sk] = (skillCount[sk] ?? 0) + 1; });
        if (s.cgpa) { totalCgpa += Number(s.cgpa); cgpaCount++; }
    });

    const avgCgpa = cgpaCount > 0 ? (totalCgpa / cgpaCount).toFixed(2) : '—';
    const topBranches = Object.entries(branchCount).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const topSkills = Object.entries(skillCount).sort((a, b) => b[1] - a[1]).slice(0, 8);

    if (loading) return (
        <div className="h-full flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center gap-5 justify-between">
                <div className="flex items-center gap-5">
                    <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
                        <TrendingUp className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 italic">Student Insights</h1>
                        <p className="text-slate-500 font-medium text-sm mt-0.5">Analytics and profiles of {students.length} students in the talent pool</p>
                    </div>
                </div>
            </div>

            {/* Aggregate Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 md:col-span-1">
                    {[
                        { label: 'Total Students', value: students.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'Avg CGPA', value: avgCgpa, icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
                        { label: 'With Skills', value: students.filter(s => (s.skills ?? []).length > 0).length, icon: Zap, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                        { label: 'Branches', value: Object.keys(branchCount).length, icon: GraduationCap, color: 'text-emerald-600', bg: 'bg-emerald-50' },
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

                {/* Branch Distribution */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-7 space-y-4">
                    <div className="flex items-center gap-3">
                        <BarChart3 className="w-5 h-5 text-slate-400" />
                        <h3 className="font-black text-slate-900 text-sm">By Branch</h3>
                    </div>
                    <div className="space-y-3">
                        {topBranches.length === 0 && <p className="text-xs text-slate-300 font-bold">No branch data</p>}
                        {topBranches.map(([branch, count]) => {
                            const pct = Math.round((count / students.length) * 100);
                            return (
                                <div key={branch}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[10px] font-black text-slate-600 truncate">{branch}</span>
                                        <span className="text-[9px] font-black text-slate-400 ml-2">{count} ({pct}%)</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-100 rounded-full">
                                        <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Top Skills */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-7 space-y-4">
                    <div className="flex items-center gap-3">
                        <PieChart className="w-5 h-5 text-slate-400" />
                        <h3 className="font-black text-slate-900 text-sm">Skills Overview</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {topSkills.length === 0 && <p className="text-xs text-slate-300 font-bold">No skill data yet</p>}
                        {topSkills.map(([skill, count]) => (
                            <button key={skill} onClick={() => setSkillFilter(skillFilter === skill ? '' : skill)}
                                className={`px-3 py-1.5 rounded-full text-[10px] font-black transition-all ${skillFilter === skill ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}>
                                {skill} <span className="opacity-60">({count})</span>
                            </button>
                        ))}
                    </div>
                    {skillFilter && (
                        <p className="text-[10px] font-black text-blue-600 flex items-center gap-1">
                            <Target className="w-3 h-3" /> Filtered: {skillFilter} ({filtered.length} students)
                        </p>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search by name or email..."
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-2xl text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-200 transition-all" />
                </div>
                <div className="relative">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select value={skillFilter} onChange={e => setSkillFilter(e.target.value)}
                        className="pl-11 pr-8 py-3 bg-slate-50 rounded-2xl text-sm font-bold text-slate-700 outline-none appearance-none cursor-pointer">
                        <option value="">All Skills</option>
                        {SKILL_TAGS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
                <div className="relative">
                    <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                        className="px-5 py-3 bg-slate-50 rounded-2xl text-sm font-bold text-slate-700 outline-none appearance-none cursor-pointer pr-8">
                        <option value="name">Sort: Name</option>
                        <option value="cgpa">Sort: CGPA</option>
                        <option value="year">Sort: Year</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
            </div>

            {/* Student Cards */}
            <div className="space-y-3">
                {filtered.length === 0 && (
                    <div className="py-24 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                        <Users className="w-14 h-14 text-slate-200 mx-auto mb-4" />
                        <p className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">No students found</p>
                    </div>
                )}
                {filtered.map((student, i) => (
                    <motion.div key={student._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                        className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-5 flex items-center gap-5 cursor-pointer hover:bg-slate-50/50 transition-colors"
                            onClick={() => setExpanded(expanded === student._id ? null : student._id)}>
                            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-lg shrink-0">
                                {student.name?.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-black text-slate-900">{student.name}</p>
                                <p className="text-xs font-medium text-slate-400">{student.email}</p>
                            </div>
                            <div className="hidden md:flex items-center gap-5">
                                {student.cgpa && (
                                    <div className="text-center">
                                        <p className="text-lg font-black text-slate-900">{student.cgpa}</p>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">CGPA</p>
                                    </div>
                                )}
                                {student.year && (
                                    <div className="text-center">
                                        <p className="font-black text-slate-700">{student.year}</p>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Year</p>
                                    </div>
                                )}
                                {student.branch && (
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">{student.branch}</span>
                                )}
                            </div>
                            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expanded === student._id ? 'rotate-180' : ''}`} />
                        </div>

                        {expanded === student._id && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                className="border-t border-slate-50 px-5 pb-5 pt-4 space-y-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { label: 'CGPA', value: student.cgpa ?? '—', icon: Star },
                                        { label: 'Year', value: student.year ?? '—', icon: GraduationCap },
                                        { label: 'Branch', value: student.branch ?? '—', icon: BookOpen },
                                        { label: 'College', value: student.collegeId?.name ?? '—', icon: Award },
                                    ].map(({ label, value, icon: Icon }) => (
                                        <div key={label} className="bg-slate-50 rounded-xl p-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Icon className="w-3.5 h-3.5 text-slate-400" />
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
                                            </div>
                                            <p className="font-black text-slate-900 text-sm">{value}</p>
                                        </div>
                                    ))}
                                </div>

                                {(student.skills ?? []).length > 0 && (
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Zap className="w-3 h-3" /> Skills & Certifications</p>
                                        <div className="flex flex-wrap gap-2">
                                            {student.skills.map((sk: string) => (
                                                <span key={sk} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black">{sk}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default RecruiterStudentInsights;
