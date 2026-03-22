import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart3, Loader2, Users, BookOpen, Briefcase,
    GraduationCap, TrendingUp, Star, Target, Zap, CheckCircle2
} from 'lucide-react';
import api from '../../api/client';

const Bar = ({ pct, color }: { pct: number; color: string }) => (
    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${Math.min(pct, 100)}%` }} />
    </div>
);

const CollegeReports = () => {
    const [students, setStudents] = useState<any[]>([]);
    const [faculty, setFaculty] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [sRes, fRes, cRes, jRes] = await Promise.all([
                    api.get('/users?role=STUDENT'),
                    api.get('/users?role=FACULTY'),
                    api.get('/courses'),
                    api.get('/jobs'),
                ]);
                setStudents(sRes.data);
                setFaculty(fRes.data);
                setCourses(cRes.data);
                setJobs(jRes.data);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        load();
    }, []);

    // Analytics
    const branchCount: Record<string, number> = {};
    const skillCount: Record<string, number> = {};
    let totalCgpa = 0, cgpaCount = 0;

    students.forEach(s => {
        if (s.branch) branchCount[s.branch] = (branchCount[s.branch] ?? 0) + 1;
        (s.skills ?? []).forEach((sk: string) => { skillCount[sk] = (skillCount[sk] ?? 0) + 1; });
        if (s.cgpa) { totalCgpa += Number(s.cgpa); cgpaCount++; }
    });

    const avgCgpa = cgpaCount > 0 ? (totalCgpa / cgpaCount).toFixed(2) : '—';
    const topBranches = Object.entries(branchCount).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const topSkills = Object.entries(skillCount).sort((a, b) => b[1] - a[1]).slice(0, 8);
    const maxBranchCount = topBranches[0]?.[1] ?? 1;

    const isExpired = (d: string) => new Date(d) < new Date();
    const activeJobs = jobs.filter(j => !isExpired(j.deadline));

    if (loading) return (
        <div className="h-full flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
            <div className="flex items-center gap-5">
                <div className="p-3 bg-rose-600 rounded-2xl shadow-lg shadow-rose-200">
                    <BarChart3 className="w-7 h-7 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 italic">Reports & Analytics</h1>
                    <p className="text-slate-500 font-medium text-sm mt-0.5">College-wide performance metrics and insights</p>
                </div>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Students', value: students.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Faculty Members', value: faculty.length, icon: GraduationCap, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { label: 'Active Courses', value: courses.length, icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Avg Student CGPA', value: avgCgpa, icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
                ].map(({ label, value, icon: Icon, color, bg }) => (
                    <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                        <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                            <Icon className={`w-4 h-4 ${color}`} />
                        </div>
                        <p className="text-2xl font-black text-slate-900">{value}</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{label}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Branch Distribution */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 space-y-5">
                    <h3 className="font-black text-slate-900 text-lg italic flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-slate-400" /> Students by Branch
                    </h3>
                    <div className="space-y-4">
                        {topBranches.length === 0 && <p className="text-sm text-slate-300 font-bold">No branch data available</p>}
                        {topBranches.map(([branch, count]) => {
                            const pct = Math.round((count / (students.length || 1)) * 100);
                            const barPct = Math.round((count / maxBranchCount) * 100);
                            return (
                                <div key={branch} className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-black text-slate-700">{branch}</span>
                                        <span className="text-[10px] font-black text-slate-400">{count} ({pct}%)</span>
                                    </div>
                                    <Bar pct={barPct} color="bg-blue-500" />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Skills Overview */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 space-y-5">
                    <h3 className="font-black text-slate-900 text-lg italic flex items-center gap-2">
                        <Zap className="w-5 h-5 text-slate-400" /> Top Student Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {topSkills.length === 0 && <p className="text-sm text-slate-300 font-bold">No skill data available</p>}
                        {topSkills.map(([skill, count]) => (
                            <div key={skill} className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-xl">
                                <span className="text-[10px] font-black text-blue-700">{skill}</span>
                                <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-[8px] font-black">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Placement Stats */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 space-y-5">
                    <h3 className="font-black text-slate-900 text-lg italic flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-slate-400" /> Placement Reports
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: 'Total Job Postings', value: jobs.length, icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                            { label: 'Active Jobs', value: activeJobs.length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                            { label: 'Expired / Closed', value: jobs.length - activeJobs.length, icon: Target, color: 'text-slate-500', bg: 'bg-slate-100' },
                            { label: 'Unique Companies', value: new Set(jobs.map(j => j.company).filter(Boolean)).size, icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
                        ].map(({ label, value, icon: Icon, color, bg }) => (
                            <div key={label} className={`${bg} rounded-2xl p-4`}>
                                <Icon className={`w-4 h-4 ${color} mb-2`} />
                                <p className={`text-xl font-black ${color}`}>{value}</p>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Faculty Activity */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 space-y-5">
                    <h3 className="font-black text-slate-900 text-lg italic flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-slate-400" /> Faculty Overview
                    </h3>
                    <div className="space-y-4">
                        {[
                            { label: 'Total Faculty', value: faculty.length, pct: 100, color: 'bg-indigo-500' },
                            { label: 'Total Courses', value: courses.length, pct: 100, color: 'bg-blue-500' },
                            { label: 'Avg Courses/Faculty', value: faculty.length ? (courses.length / faculty.length).toFixed(1) : '—', pct: 60, color: 'bg-emerald-500' },
                        ].map(({ label, value, pct, color }) => (
                            <div key={label} className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-black text-slate-700">{label}</span>
                                    <span className="text-sm font-black text-slate-900">{value}</span>
                                </div>
                                <Bar pct={pct} color={color} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollegeReports;
