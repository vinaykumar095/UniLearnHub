import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    GraduationCap, Send, Lightbulb, Target, Loader2, Search,
    CheckCircle2, TrendingUp, MapPin, Code2, Brain, Cloud,
    Cpu, BarChart3, Zap, ChevronRight, Plus, X, Clock, Award
} from 'lucide-react';
import api from '../../api/client';

// ─── Static data ──────────────────────────────────────────────────────────────

const CAREER_PATHS = [
    { icon: Code2, label: 'Software Engineer', color: 'bg-blue-50 text-blue-600 border-blue-200', desc: 'Full-stack, systems, backend' },
    { icon: Brain, label: 'AI / ML Engineer', color: 'bg-purple-50 text-purple-600 border-purple-200', desc: 'Deep learning, NLP, CV' },
    { icon: BarChart3, label: 'Data Scientist', color: 'bg-amber-50 text-amber-600 border-amber-200', desc: 'Analytics, modelling, BI' },
    { icon: Cloud, label: 'Cloud Engineer', color: 'bg-sky-50 text-sky-600 border-sky-200', desc: 'AWS, Azure, DevOps' },
    { icon: Cpu, label: 'Embedded Systems', color: 'bg-emerald-50 text-emerald-600 border-emerald-200', desc: 'IoT, RTOS, firmware' },
    { icon: MapPin, label: 'Product Manager', color: 'bg-rose-50 text-rose-600 border-rose-200', desc: 'Strategy, roadmap, UX' },
];

const SKILL_CHIPS: Record<string, string[]> = {
    'Software Engineer': ['Data Structures', 'System Design', 'REST APIs', 'Git', 'SQL', 'TypeScript'],
    'AI / ML Engineer': ['Python', 'PyTorch', 'Transformers', 'Statistics', 'LangChain', 'Vector DBs'],
    'Data Scientist': ['Pandas', 'Matplotlib', 'SQL', 'Tableau', 'A/B Testing', 'R'],
    'Cloud Engineer': ['AWS EC2', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Linux'],
    'Embedded Systems': ['C/C++', 'RTOS', 'UART/SPI', 'Microcontrollers', 'PCB Design', 'FPGA'],
    'Product Manager': ['Agile/Scrum', 'JIRA', 'OKRs', 'Wireframing', 'SQL', 'Stakeholder Management'],
};

const MILESTONE_STEPS: Record<string, string[]> = {
    'Software Engineer': [
        'Master DSA fundamentals (Arrays, LL, Trees, Graphs)',
        'Build 2 full-stack projects with REST APIs',
        'Learn System Design principles (caching, scaling)',
        'Contribute to an open-source project on GitHub',
        'Complete 100 LeetCode problems (Easy + Medium)',
        'Pass technical interviews at 3 target companies',
    ],
    'AI / ML Engineer': [
        'Complete Andrew Ng Machine Learning Specialisation',
        'Implement 3 classification/regression models from scratch',
        'Build an NLP project using HuggingFace Transformers',
        'Publish a Kaggle notebook with top 25% ranking',
        'Deploy a model with FastAPI + Docker',
        'Read 5 landmark ML papers and summarise them',
    ],
    'Data Scientist': [
        'Master SQL through real dataset analysis',
        'Complete Pandas + Matplotlib proficiency',
        'Build an end-to-end analytics dashboard in Tableau',
        'Run a complete A/B test with statistical significance',
        'Complete Google Data Analytics Professional Certificate',
        'Present data findings to a non-technical audience',
    ],
    'Cloud Engineer': [
        'Earn AWS Cloud Practitioner certification',
        'Deploy a 3-tier web application on AWS',
        'Containerise an app with Docker & Compose',
        'Automate infrastructure with Terraform',
        'Set up a CI/CD pipeline with GitHub Actions',
        'Earn AWS Solutions Architect Associate',
    ],
    'Embedded Systems': [
        'Master C pointers, memory management, bit manipulation',
        'Build 3 projects with Arduino/STM32',
        'Implement UART/SPI/I2C communication protocols',
        'Port a bare-metal task scheduler (RTOS basics)',
        'Complete an IoT project with sensor + cloud integration',
        'Study a commercial product datasheet and prototype a driver',
    ],
    'Product Manager': [
        'Complete a Product Management fundamentals course',
        'Map a full user journey and write a PRD',
        'Run a 2-week Agile sprint as Scrum Master',
        'Conduct 5 user interviews and synthesise insights',
        'Define OKRs for a hypothetical product',
        'Build a working product prototype using Figma',
    ],
};

const TYPE_META = {
    SKILL_RECOMMENDATION: { icon: Lightbulb, color: 'indigo', label: 'Skill Suggestions', border: 'border-indigo-600', bg: 'bg-indigo-50', text: 'text-indigo-600' },
    CAREER_PATH: { icon: TrendingUp, color: 'primary', label: 'Career Path', border: 'border-primary-600', bg: 'bg-primary-50', text: 'text-primary-600' },
    LEARNING_MILESTONE: { icon: Target, color: 'emerald', label: 'Learning Milestones', border: 'border-emerald-600', bg: 'bg-emerald-50', text: 'text-emerald-600' },
    GENERAL_FEEDBACK: { icon: Award, color: 'amber', label: 'General Feedback', border: 'border-amber-500', bg: 'bg-amber-50', text: 'text-amber-600' },
};

// ─── Component ────────────────────────────────────────────────────────────────

const FacultyGuidance = () => {
    const [students, setStudents] = useState<any[]>([]);
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [guidanceType, setGuidanceType] = useState<string>('SKILL_RECOMMENDATION');
    const [content, setContent] = useState('');
    const [selectedCareerPath, setSelectedCareerPath] = useState('');
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [selectedMilestones, setSelectedMilestones] = useState<string[]>([]);
    const [impactDashboard, setImpactDashboard] = useState(true);
    const [impactRoadmap, setImpactRoadmap] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [tab, setTab] = useState<'compose' | 'history'>('compose');

    useEffect(() => {
        const load = async () => {
            try {
                const [studRes, histRes] = await Promise.all([
                    api.get('/faculty/students'),
                    api.get('/faculty/guidance'),
                ]);
                setStudents(studRes.data);
                setHistory(histRes.data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const filteredStudents = students.filter(s =>
        s.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.courseTitle?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleSkill = (skill: string) => {
        setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
    };

    const toggleMilestone = (ms: string) => {
        setSelectedMilestones(prev => prev.includes(ms) ? prev.filter(m => m !== ms) : [...prev, ms]);
    };

    const buildContent = () => {
        if (guidanceType === 'CAREER_PATH' && selectedCareerPath) {
            const skills = selectedSkills.length ? `\n\nRecommended Skills: ${selectedSkills.join(', ')}` : '';
            return `Recommended Career Path: ${selectedCareerPath}.\n${content}${skills}`.trim();
        }
        if (guidanceType === 'LEARNING_MILESTONE' && selectedMilestones.length) {
            const steps = selectedMilestones.map((m, i) => `${i + 1}. ${m}`).join('\n');
            return `Learning Milestones:\n${steps}\n\n${content}`.trim();
        }
        if (guidanceType === 'SKILL_RECOMMENDATION' && selectedSkills.length) {
            return `Skill Focus Areas: ${selectedSkills.join(', ')}.\n\n${content}`.trim();
        }
        return content.trim();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStudent) return;

        const finalContent = buildContent();
        if (!finalContent) return;

        setSubmitting(true);
        try {
            await api.post('/faculty/guidance', {
                type: guidanceType,
                content: finalContent,
                studentId: selectedStudent.studentId?._id || selectedStudent.studentId,
                courseId: selectedStudent.courseId?._id || selectedStudent.courseId,
                impacts: { dashboard: impactDashboard, roadmap: impactRoadmap }
            });
            setSuccess(true);
            setContent('');
            setSelectedSkills([]);
            setSelectedMilestones([]);
            setSelectedCareerPath('');
            // Refresh history
            const histRes = await api.get('/faculty/guidance');
            setHistory(histRes.data);
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error('Error sending guidance:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const typeKeys = Object.keys(TYPE_META) as (keyof typeof TYPE_META)[];
    const placeholders: Record<string, string> = {
        SKILL_RECOMMENDATION: 'Add any extra notes about why these skills matter for this student…',
        CAREER_PATH: 'Explain why this career path suits the student based on their strengths…',
        LEARNING_MILESTONE: 'Add any extra context or motivational note alongside the milestones…',
        GENERAL_FEEDBACK: 'Share your detailed observations, encouragement, or improvement areas…',
    };

    if (loading) return (
        <div className="h-full flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between">
                <div className="space-y-2">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-600 rounded-2xl">
                            <Target className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 italic">Career Guidance Hub</h1>
                            <p className="text-slate-500 font-medium text-sm">Forge strategic mentorship pulses that impact student roadmaps</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit">
                    <button onClick={() => setTab('compose')} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${tab === 'compose' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>
                        Compose
                    </button>
                    <button onClick={() => setTab('history')} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${tab === 'history' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>
                        History <span className="w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[9px] font-black">{history.length}</span>
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {/* ── COMPOSE TAB ── */}
                {tab === 'compose' && (
                    <motion.div key="compose" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* Left: Student Selector */}
                        <div className="lg:col-span-4 space-y-5">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">Select Student</h3>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search students…"
                                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:border-indigo-600 outline-none transition-all shadow-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-y-auto max-h-[480px] no-scrollbar divide-y divide-slate-50">
                                {filteredStudents.length === 0 && (
                                    <div className="py-16 text-center text-slate-400 text-xs font-black uppercase tracking-widest">No students found</div>
                                )}
                                {filteredStudents.map((student) => (
                                    <button
                                        key={student.id}
                                        onClick={() => setSelectedStudent(student)}
                                        className={`w-full px-6 py-5 flex items-center gap-4 text-left transition-all ${selectedStudent?.id === student.id ? 'bg-indigo-50 ring-2 ring-inset ring-indigo-600' : 'hover:bg-slate-50'}`}
                                    >
                                        <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-500 text-sm shrink-0">
                                            {student.studentName?.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-slate-900 text-sm truncate">{student.studentName}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{student.courseTitle}</p>
                                        </div>
                                        {selectedStudent?.id === student.id && <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right: Guidance Composer */}
                        <div className="lg:col-span-8">
                            <motion.div key={selectedStudent?.id ?? 'none'} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                className="bg-white rounded-[3rem] border border-slate-100 shadow-xl p-10 space-y-8">

                                {!selectedStudent ? (
                                    <div className="py-24 text-center space-y-4">
                                        <GraduationCap className="w-20 h-20 text-slate-100 mx-auto" />
                                        <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs">Select a student to begin mentoring</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Student header */}
                                        <div className="flex items-center gap-5 pb-8 border-b border-slate-50">
                                            <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-200">
                                                {selectedStudent.studentName?.charAt(0)}
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-black text-slate-900 italic">{selectedStudent.studentName}</h2>
                                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{selectedStudent.branch} · {selectedStudent.year} Year</p>
                                            </div>
                                            <div className="ml-auto flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Ready to mentor</span>
                                            </div>
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-8">
                                            {/* Guidance Type */}
                                            <div className="space-y-3">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Guidance Protocol</label>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                    {typeKeys.map((key) => {
                                                        const meta = TYPE_META[key];
                                                        const Icon = meta.icon;
                                                        const active = guidanceType === key;
                                                        return (
                                                            <button key={key} type="button" onClick={() => { setGuidanceType(key); setSelectedSkills([]); setSelectedMilestones([]); setSelectedCareerPath(''); }}
                                                                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${active ? `${meta.border} ${meta.bg} ${meta.text}` : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}>
                                                                <Icon className="w-5 h-5" />
                                                                <span className="text-[8px] font-black uppercase tracking-widest text-center leading-tight">{meta.label}</span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Career Path Presets */}
                                            {guidanceType === 'CAREER_PATH' && (
                                                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                                                    <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Choose a Career Trajectory</label>
                                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                        {CAREER_PATHS.map((path) => {
                                                            const Icon = path.icon;
                                                            const active = selectedCareerPath === path.label;
                                                            return (
                                                                <button key={path.label} type="button" onClick={() => { setSelectedCareerPath(path.label); setSelectedSkills([]); }}
                                                                    className={`p-4 rounded-2xl border-2 text-left transition-all ${active ? `border-current ${path.color}` : 'border-slate-100 hover:border-slate-200 text-slate-500'}`}>
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <Icon className="w-4 h-4 shrink-0" />
                                                                        <span className="text-xs font-black">{path.label}</span>
                                                                    </div>
                                                                    <span className="text-[10px] text-slate-400 font-medium">{path.desc}</span>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </motion.div>
                                            )}

                                            {/* Skill Chips */}
                                            {(guidanceType === 'SKILL_RECOMMENDATION' || (guidanceType === 'CAREER_PATH' && selectedCareerPath)) && (
                                                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                                                    <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                                                        {guidanceType === 'CAREER_PATH' ? `Skills for ${selectedCareerPath}` : 'Skill Focus Areas'}
                                                    </label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {(SKILL_CHIPS[selectedCareerPath] ?? SKILL_CHIPS['Software Engineer']).map((skill) => {
                                                            const active = selectedSkills.includes(skill);
                                                            return (
                                                                <button key={skill} type="button" onClick={() => toggleSkill(skill)}
                                                                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-1.5 border ${active ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300'}`}>
                                                                    {active ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                                                                    {skill}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </motion.div>
                                            )}

                                            {/* Milestone Steps */}
                                            {guidanceType === 'LEARNING_MILESTONE' && (
                                                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Step-by-Step Milestones</label>
                                                        <div className="flex gap-2">
                                                            {Object.keys(MILESTONE_STEPS).slice(0, 3).map(path => (
                                                                <button key={path} type="button" onClick={() => setSelectedMilestones(MILESTONE_STEPS[path])}
                                                                    className="px-3 py-1.5 text-[9px] font-black uppercase tracking-widest bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-all">
                                                                    {path.split(' ')[0]}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        {(MILESTONE_STEPS[selectedCareerPath] ?? MILESTONE_STEPS['Software Engineer']).map((ms, i) => {
                                                            const active = selectedMilestones.includes(ms);
                                                            return (
                                                                <button key={i} type="button" onClick={() => toggleMilestone(ms)}
                                                                    className={`w-full flex items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all ${active ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 hover:border-slate-200'}`}>
                                                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 ${active ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 text-slate-400'}`}>
                                                                        {active ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                                                                    </div>
                                                                    <span className={`text-sm font-medium ${active ? 'text-emerald-800' : 'text-slate-600'}`}>{ms}</span>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                    {selectedMilestones.length > 0 && (
                                                        <p className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                                                            <CheckCircle2 className="w-3.5 h-3.5" /> {selectedMilestones.length} milestones selected
                                                        </p>
                                                    )}
                                                </motion.div>
                                            )}

                                            {/* Mentor Note */}
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Mentor Note (Optional)</label>
                                                <textarea
                                                    rows={4}
                                                    placeholder={placeholders[guidanceType as keyof typeof placeholders]}
                                                    className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 transition-all outline-none font-medium text-sm resize-none"
                                                    value={content}
                                                    onChange={(e) => setContent(e.target.value)}
                                                />
                                            </div>

                                            {/* Impact Toggles */}
                                            <div className="flex gap-6">
                                                {[
                                                    { label: 'Dashboard Impact', state: impactDashboard, set: setImpactDashboard },
                                                    { label: 'Roadmap Impact', state: impactRoadmap, set: setImpactRoadmap },
                                                ].map(({ label, state, set }) => (
                                                    <button key={label} type="button" onClick={() => set(!state)}
                                                        className={`flex items-center gap-3 px-5 py-3 rounded-xl border-2 transition-all text-xs font-black uppercase tracking-widest ${state ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 text-slate-400'}`}>
                                                        <div className={`w-4 h-4 rounded-full border-2 transition-all ${state ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'}`} />
                                                        {label}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Submit */}
                                            <AnimatePresence>
                                                {success ? (
                                                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                                                        className="w-full bg-emerald-500 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 uppercase tracking-widest text-sm">
                                                        <CheckCircle2 className="w-5 h-5" /> Mentorship Pulse Deployed!
                                                    </motion.div>
                                                ) : (
                                                    <motion.button
                                                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                                        type="submit"
                                                        disabled={submitting || (!content && !selectedSkills.length && !selectedMilestones.length && !selectedCareerPath)}
                                                        className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-black py-5 rounded-2xl transition-all shadow-2xl shadow-slate-200 disabled:opacity-40 flex items-center justify-center gap-3 uppercase tracking-widest text-sm italic"
                                                    >
                                                        {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5" /> Deploy Mentorship Pulse</>}
                                                    </motion.button>
                                                )}
                                            </AnimatePresence>
                                        </form>
                                    </>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                )}

                {/* ── HISTORY TAB ── */}
                {tab === 'history' && (
                    <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="space-y-5">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Sent Guidance ({history.length})</h3>
                        {history.length === 0 && (
                            <div className="py-24 text-center text-slate-300 font-black uppercase tracking-[0.2em] text-xs">No guidance sent yet.</div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {history.map((g: any, i: number) => {
                                const meta = TYPE_META[g.type as keyof typeof TYPE_META] ?? TYPE_META.GENERAL_FEEDBACK;
                                const Icon = meta.icon;
                                return (
                                    <motion.div key={g._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                                        className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-7 space-y-4 group hover:shadow-lg hover:-translate-y-0.5 transition-all">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className={`w-10 h-10 rounded-2xl ${meta.bg} ${meta.text} flex items-center justify-center shrink-0`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${meta.bg} ${meta.text}`}>
                                                {meta.label}
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 text-sm">{g.studentId?.name}</h4>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{g.studentId?.branch} · {g.studentId?.year} Year</p>
                                        </div>
                                        <p className="text-sm text-slate-600 leading-relaxed italic line-clamp-3">"{g.content}"</p>
                                        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                                            <div className="flex gap-2">
                                                {g.impacts?.dashboard && <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[8px] font-black uppercase rounded-full">Dashboard</span>}
                                                {g.impacts?.roadmap && <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase rounded-full">Roadmap</span>}
                                            </div>
                                            <div className="flex items-center gap-1 text-slate-400">
                                                <Clock className="w-3 h-3" />
                                                <span className="text-[9px] font-bold">{new Date(g.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Stats strip */}
                        {history.length > 0 && (
                            <div className="mt-8 bg-slate-900 rounded-[2rem] p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
                                {[
                                    { label: 'Total Sent', value: history.length, icon: Zap },
                                    { label: 'Career Paths', value: history.filter((g: any) => g.type === 'CAREER_PATH').length, icon: TrendingUp },
                                    { label: 'Skill Recs', value: history.filter((g: any) => g.type === 'SKILL_RECOMMENDATION').length, icon: Lightbulb },
                                    { label: 'Milestones', value: history.filter((g: any) => g.type === 'LEARNING_MILESTONE').length, icon: Target },
                                ].map(({ label, value, icon: Icon }) => (
                                    <div key={label} className="text-center">
                                        <div className="flex justify-center mb-2"><Icon className="w-5 h-5 text-indigo-400" /></div>
                                        <div className="text-3xl font-black text-white italic">{value}</div>
                                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{label}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Side info: career paths quick reference */}
            {tab === 'compose' && selectedStudent && guidanceType === 'CAREER_PATH' && (
                <div className="bg-gradient-to-br from-indigo-700 to-indigo-900 rounded-[2.5rem] p-8 text-white">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                        <ChevronRight className="w-4 h-4" /> Career Path Intelligence
                    </h3>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                        {CAREER_PATHS.map(p => (
                            <div key={p.label} className="text-center">
                                <p className="text-[9px] font-black uppercase tracking-widest text-indigo-300">{p.label}</p>
                                <p className="text-[8px] text-indigo-400 mt-1">{p.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FacultyGuidance;
