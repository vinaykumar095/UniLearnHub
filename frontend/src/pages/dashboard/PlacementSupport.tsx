import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Briefcase, Code2, FileText, TrendingUp, ExternalLink,
    CheckCircle2, Plus, Loader2, Zap, Link as LinkIcon,
    ChevronRight, Star, BookOpen, Cpu, Users, Lightbulb, Award
} from 'lucide-react';
import api from '../../api/client';



const INTERVIEW_PREP = [
    {
        category: 'HR Interview',
        icon: Users,
        color: 'bg-indigo-50 text-indigo-600',
        tips: [
            'Tell me about yourself — structure: Present → Past → Future',
            'Use the STAR method for behavioral questions (Situation, Task, Action, Result)',
            "Research the company's mission, products, and recent news before the interview",
            'Prepare 3 thoughtful questions to ask the interviewer at the end',
            'Strengths & Weaknesses: Be honest; frame weakness with growth steps',
            'Salary negotiation: Research market rates and anchor high',
        ],
        resources: [
            { label: 'STAR Method Guide', url: 'https://www.themuse.com/advice/star-interview-method' },
            { label: 'Top 50 HR Questions', url: 'https://www.interviewbit.com/hr-interview-questions/' },
            { label: 'Body Language Tips', url: 'https://www.indeed.com/career-advice/interviewing/interview-body-language' },
        ]
    },
    {
        category: 'Technical Interview',
        icon: Cpu,
        color: 'bg-purple-50 text-purple-600',
        tips: [
            'Always think out loud — interviewers evaluate your thought process',
            'Clarify the problem before coding: constraints, edge cases, expected I/O',
            'Start with a brute-force approach, then optimise step by step',
            'Know your time & space complexity for every solution (Big-O analysis)',
            'Practice writing clean, readable code — variable naming matters',
            'Review core CS concepts: OS, DBMS, Networking, OOP principles',
        ],
        resources: [
            { label: 'NeetCode Roadmap', url: 'https://neetcode.io/roadmap' },
            { label: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer' },
            { label: 'Tech Interview Handbook', url: 'https://www.techinterviewhandbook.org' },
        ]
    },
];

const CODING_RESOURCES = [
    { label: 'LeetCode', desc: 'DSA practice — curated company-wise & topic-wise', url: 'https://leetcode.com', icon: Code2, badge: 'Top Pick', color: 'text-amber-500 bg-amber-50 border-amber-200' },
    { label: 'NeetCode 150', desc: 'Curated 150 most important DSA problems', url: 'https://neetcode.io', icon: Zap, badge: 'Curated', color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    { label: 'Codeforces', desc: 'Competitive programming contests and problems', url: 'https://codeforces.com', icon: TrendingUp, badge: 'Competitive', color: 'text-rose-600 bg-rose-50 border-rose-200' },
    { label: 'GeeksforGeeks', desc: 'Articles, DSA sheets, company archives', url: 'https://www.geeksforgeeks.org', icon: BookOpen, badge: 'Reference', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    { label: 'HackerRank', desc: 'Structured skill tracks with certificates', url: 'https://www.hackerrank.com', icon: Award, badge: 'Certified', color: 'text-teal-600 bg-teal-50 border-teal-200' },
    { label: 'Coding Ninjas', desc: 'Guided DSA + placement prep courses', url: 'https://www.codingninjas.com', icon: Lightbulb, badge: 'Guided', color: 'text-purple-600 bg-purple-50 border-purple-200' },
];

const RESUME_TIPS = [
    { heading: 'One-Page Rule', body: 'For students with < 3 years of experience, keep the resume to exactly one page. Recruiters spend ~6 seconds on a first scan.' },
    { heading: 'Quantify Everything', body: 'Use numbers to describe impact. "Improved API response time by 40%" beats "Improved performance".' },
    { heading: 'Action Verb Openings', body: 'Start every bullet with a strong action verb: Built, Reduced, Optimised, Designed, Led, Automated, Integrated.' },
    { heading: 'Tailor to JD', body: 'Mirror keywords from the job description — ATS parsers shortlist based on keyword density.' },
    { heading: 'Projects > GPA', body: 'Highlight 2–3 impactful projects with tech stack, problem, and outcome. A live demo URL is a strong differentiator.' },
    { heading: 'Skills Section Format', body: 'Group skills: Languages · Frameworks · Cloud · Tools. Avoid generic fluff like "MS Office" or "Teamwork".' },
    { heading: 'No Photo or DOB', body: 'Keep resumes anonymous to avoid unconscious bias. Most international companies do not want personal photos.' },
    { heading: 'Clean Formatting', body: 'Use consistent fonts (Calibri/Roboto 10–11pt), 0.75in margins, and clear section headers. Avoid tables and columns in ATS contexts.' },
];

const RESUME_RESOURCES = [
    { label: 'Harvard OCS Resume Guide', url: 'https://ocs.fas.harvard.edu/files/ocs/files/hes-resume-cover-letter-guide.pdf' },
    { label: "Jake's LaTeX Resume Template", url: 'https://github.com/jakegut/resume' },
    { label: 'Canva Resume Builder', url: 'https://www.canva.com/resumes' },
    { label: 'Resume Worded (AI Feedback)', url: 'https://resumeworded.com' },
];



const TABS = [
    { id: 'interview', label: 'Interview Prep', icon: Briefcase },
    { id: 'coding', label: 'Coding Practice', icon: Code2 },
    { id: 'resume', label: 'Resume & CV Tips', icon: FileText },
    { id: 'publish', label: 'Publish Resource', icon: Plus },
];



const PlacementSupport = () => {
    const [activeTab, setActiveTab] = useState('interview');
    const [expandedCategory, setExpandedCategory] = useState<string | null>('HR Interview');

    
    const [resTitle, setResTitle] = useState('');
    const [resCategory, setResCategory] = useState('INTERVIEW');
    const [resUrl, setResUrl] = useState('');
    const [resDesc, setResDesc] = useState('');
    const [publishing, setPublishing] = useState(false);
    const [published, setPublished] = useState(false);
    const [sharedItems, setSharedItems] = useState<string[]>([]);

    const handleShareResource = async (title: string, category: string, url: string, desc: string = '') => {
        const itemKey = `${title}-${url}`;
        if (sharedItems.includes(itemKey)) return;
        
        try {
            await api.post('/faculty/guidance', {
                type: 'GENERAL_FEEDBACK',
                content: `[Placement Resource: ${category}] ${title} — ${desc} | ${url}`,
                studentId: null,
                impacts: { dashboard: true, roadmap: false },
                isBroadcast: true,
            });
            setSharedItems(prev => [...prev, itemKey]);
            setTimeout(() => {
                setSharedItems(prev => prev.filter(i => i !== itemKey));
            }, 3000);
        } catch (e) {
            console.error(e);
        }
    };

    const handlePublish = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resTitle || !resUrl) return;
        setPublishing(true);
        try {
            await api.post('/faculty/guidance', {
                type: 'GENERAL_FEEDBACK',
                content: `[Placement Resource: ${resCategory}] ${resTitle} — ${resDesc} | ${resUrl}`,
                studentId: null,
                impacts: { dashboard: true, roadmap: false },
                isBroadcast: true,
            }).catch(() => {  });
            setPublished(true);
            setResTitle(''); setResUrl(''); setResDesc('');
            setTimeout(() => setPublished(false), 3000);
        } finally {
            setPublishing(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-20">
            {}
            <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between">
                <div className="flex items-center gap-5">
                    <div className="p-3 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-200">
                        <Briefcase className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 italic">Placement Support Hub</h1>
                        <p className="text-slate-500 font-medium text-sm mt-0.5">Curate interview, coding & resume resources that appear in student Placement Prep</p>
                    </div>
                </div>
                {}
                <div className="flex items-center gap-2 px-5 py-3 bg-emerald-50 border border-emerald-200 rounded-2xl">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">Live Sync with Student Module</span>
                </div>
            </div>

            {}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Interview Tips', value: INTERVIEW_PREP.reduce((a, c) => a + c.tips.length, 0), icon: Briefcase, color: 'bg-indigo-50 text-indigo-600' },
                    { label: 'Coding Resources', value: CODING_RESOURCES.length, icon: Code2, color: 'bg-purple-50 text-purple-600' },
                    { label: 'Resume Tips', value: RESUME_TIPS.length, icon: FileText, color: 'bg-amber-50 text-amber-600' },
                    { label: 'Career Paths Supported', value: 6, icon: TrendingUp, color: 'bg-emerald-50 text-emerald-600' },
                ].map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                        className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 flex items-center gap-4 hover:shadow-lg hover:-translate-y-0.5 transition-all group">
                        <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-slate-900 leading-none">{stat.value}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {}
            <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit">
                {TABS.map(tab => {
                    const Icon = tab.icon;
                    const active = activeTab === tab.id;
                    return (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${active ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>
                            <Icon className="w-3.5 h-3.5" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            <AnimatePresence mode="wait">

                {}
                {activeTab === 'interview' && (
                    <motion.div key="interview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {INTERVIEW_PREP.map((section) => {
                            const Icon = section.icon;
                            const expanded = expandedCategory === section.category;
                            return (
                                <div key={section.category} className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                                    <div className="flex items-center gap-5 p-8 group">
                                        <button onClick={() => setExpandedCategory(expanded ? null : section.category)}
                                            className="flex-1 flex items-center gap-5 text-left transition-all">
                                            <div className={`w-14 h-14 ${section.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-black text-slate-900">{section.category}</h3>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{section.tips.length} tips · {section.resources.length} resources</p>
                                            </div>
                                            <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${expanded ? 'rotate-90' : ''}`} />
                                        </button>
                                        
                                        <button 
                                            onClick={() => handleShareResource(`${section.category} Tips`, 'INTERVIEW', '#', section.tips.join('\n'))}
                                            className={`px-4 py-2 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${sharedItems.includes(`${section.category} Tips-#`) ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-emerald-500 hover:text-emerald-500'}`}
                                        >
                                            {sharedItems.includes(`${section.category} Tips-#`) ? 'Shared!' : 'Broadcast Tips'}
                                        </button>
                                    </div>

                                    <AnimatePresence>
                                        {expanded && (
                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden">
                                                {/* Tips list */}
                                                <div className="px-8 pb-4 space-y-3">
                                                    {section.tips.map((tip, i) => (
                                                        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                                                            className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl group hover:bg-white hover:shadow-sm transition-all">
                                                            <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                                                            <p className="text-sm font-medium text-slate-700 leading-relaxed">{tip}</p>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                                {/* Resources */}
                                                <div className="px-8 pb-8 pt-4 border-t border-slate-50 space-y-3">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Reference Links</p>
                                                    {section.resources.map((r, i) => {
                                                        const itemKey = `${r.label}-${r.url}`;
                                                        const isShared = sharedItems.includes(itemKey);
                                                        return (
                                                            <div key={i} className="flex items-center gap-2 group/row">
                                                                <a href={r.url} target="_blank" rel="noopener noreferrer"
                                                                    className="flex-1 flex items-center gap-3 p-4 bg-slate-900 text-white rounded-2xl hover:bg-indigo-600 transition-all group/link">
                                                                    <LinkIcon className="w-4 h-4 text-indigo-400 group-hover/link:text-white transition-colors" />
                                                                    <span className="text-sm font-bold">{r.label}</span>
                                                                    <ExternalLink className="w-3 h-3 ml-auto opacity-40" />
                                                                </a>
                                                                <button 
                                                                    onClick={() => handleShareResource(r.label, 'INTERVIEW', r.url, `Curated resource for ${section.category}`)}
                                                                    className={`p-4 rounded-2xl border-2 transition-all shrink-0 ${isShared ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-100 text-slate-400 hover:border-emerald-500 hover:text-emerald-500'}`}
                                                                    title="Broadcast to Students"
                                                                >
                                                                    {isShared ? <CheckCircle2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                                                </button>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </motion.div>
                )}

                {/* ── CODING PRACTICE TAB ── */}
                {activeTab === 'coding' && (
                    <motion.div key="coding" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {CODING_RESOURCES.map((res, i) => {
                                const Icon = res.icon;
                                return (
                                    <motion.div key={res.label} 
                                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                                        whileHover={{ y: -4 }}
                                        className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 flex flex-col gap-5 hover:shadow-xl transition-all group">
                                        <div className="flex items-start justify-between">
                                            <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center ${res.color}`}>
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${res.color}`}>
                                                {res.badge}
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{res.label}</h4>
                                            <p className="text-sm text-slate-500 font-medium mt-1 leading-relaxed">{res.desc}</p>
                                        </div>

                                        <div className="flex items-center gap-2 mt-auto pt-4 border-t border-slate-50">
                                            <a href={res.url} target="_blank" rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-xs font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors">
                                                Open Platform <ExternalLink className="w-3.5 h-3.5" />
                                            </a>
                                            <button 
                                                onClick={() => handleShareResource(res.label, 'CODING', res.url, res.desc)}
                                                className={`ml-auto px-4 py-2 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${sharedItems.includes(`${res.label}-${res.url}`) ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-100 text-slate-400 hover:border-emerald-500 hover:text-emerald-500'}`}
                                            >
                                                {sharedItems.includes(`${res.label}-${res.url}`) ? 'Shared!' : 'Broadcast'}
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* DSA Focus Topics */}
                        <div className="bg-slate-900 rounded-[3rem] p-10 text-white">
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8 flex items-center gap-3 text-slate-400">
                                <Zap className="w-4 h-4 text-indigo-400" /> DSA Topic Priority Matrix
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { topic: 'Arrays & Hashing', priority: '🔴 Critical' },
                                    { topic: 'Two Pointers & Sliding Window', priority: '🔴 Critical' },
                                    { topic: 'Binary Search', priority: '🟠 High' },
                                    { topic: 'Linked Lists', priority: '🟠 High' },
                                    { topic: 'Trees & BST', priority: '🔴 Critical' },
                                    { topic: 'Graphs & BFS/DFS', priority: '🔴 Critical' },
                                    { topic: 'Dynamic Programming', priority: '🟡 Important' },
                                    { topic: 'Heaps & Priority Queue', priority: '🟡 Important' },
                                    { topic: 'Tries & Segment Tree', priority: '🟢 Advanced' },
                                    { topic: 'Backtracking', priority: '🟠 High' },
                                    { topic: 'Greedy Algorithms', priority: '🟠 High' },
                                    { topic: 'Bit Manipulation', priority: '🟢 Advanced' },
                                ].map((item, i) => (
                                    <div key={i} className="bg-white/5 rounded-2xl p-4 hover:bg-white/10 transition-all">
                                        <p className="text-xs font-black text-white leading-snug">{item.topic}</p>
                                        <p className="text-[9px] font-bold text-slate-400 mt-2">{item.priority}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ── RESUME & CV TIPS TAB ── */}
                {activeTab === 'resume' && (
                    <motion.div key="resume" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Tips */}
                        <div className="lg:col-span-7 space-y-4">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Expert Resume Tips</h3>
                            {RESUME_TIPS.map((tip, i) => {
                                const itemKey = `${tip.heading}-resume-tip`;
                                const isShared = sharedItems.includes(itemKey);
                                return (
                                    <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                                        className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all group">
                                        <div className="flex items-start gap-4">
                                            <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-xs font-black shrink-0 group-hover:bg-amber-500 group-hover:text-white transition-all">
                                                {i + 1}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-black text-slate-900">{tip.heading}</h4>
                                                <p className="text-sm text-slate-500 font-medium mt-1 leading-relaxed">{tip.body}</p>
                                            </div>
                                            <button 
                                                onClick={() => handleShareResource(tip.heading, 'RESUME', '#', tip.body)}
                                                className={`px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-widest transition-all ${isShared ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-emerald-500 hover:text-emerald-500'}`}
                                            >
                                                {isShared ? 'Shared!' : 'Broadcast'}
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                                </div>

                        {/* Sidebar: Links + Checklist */}
                        <div className="lg:col-span-5 space-y-6">
                            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 space-y-4">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Template & Tool Resources</h3>
                                {RESUME_RESOURCES.map((r, i) => {
                                    const itemKey = `${r.label}-${r.url}`;
                                    const isShared = sharedItems.includes(itemKey);
                                    return (
                                        <div key={i} className="flex items-center gap-2">
                                            <a href={r.url} target="_blank" rel="noopener noreferrer"
                                                className="flex-1 flex items-center gap-3 p-4 bg-slate-50 rounded-2xl hover:bg-slate-900 hover:text-white transition-all group/link">
                                                <LinkIcon className="w-4 h-4 text-slate-400 group-hover/link:text-indigo-400 transition-colors shrink-0" />
                                                <span className="text-sm font-bold text-slate-700 group-hover/link:text-white transition-colors">{r.label}</span>
                                                <ExternalLink className="w-3 h-3 ml-auto opacity-40" />
                                            </a>
                                            <button 
                                                onClick={() => handleShareResource(r.label, 'RESUME', r.url, 'Professional Resume Resource')}
                                                className={`p-4 rounded-2xl border-2 transition-all shrink-0 ${isShared ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-50 text-slate-400 hover:border-emerald-500 hover:text-emerald-500'}`}
                                            >
                                                {isShared ? <CheckCircle2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Resume Checklist */}
                            <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-[2.5rem] p-8 text-white">
                                <h3 className="font-black text-lg italic mb-6 flex items-center gap-3">
                                    <Star className="w-5 h-5" /> Resume Checklist
                                </h3>
                                <div className="space-y-3">
                                    {['Contact info is correct & professional', 'No spelling / grammar errors', 'Each bullet starts with action verb', 'All metrics are quantified', 'Tailored for target role', 'ATS-friendly single-column format', 'PDF format submitted'].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <CheckCircle2 className="w-4 h-4 text-white/70 shrink-0" />
                                            <span className="text-sm font-medium text-white/90">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ── PUBLISH RESOURCE TAB ── */}
                {activeTab === 'publish' && (
                    <motion.div key="publish" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="max-w-3xl space-y-8">
                        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl p-10 space-y-8">
                            <div className="flex items-center gap-4 pb-6 border-b border-slate-50">
                                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                                    <Plus className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-900">Publish a Resource</h2>
                                    <p className="text-sm text-slate-400 font-medium">Add a curated resource visible to all your students in Placement Prep</p>
                                </div>
                            </div>

                            <form onSubmit={handlePublish} className="space-y-6">
                                {/* Category */}
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Resource Category</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { val: 'INTERVIEW', label: 'Interview Prep', icon: Briefcase },
                                            { val: 'CODING', label: 'Coding Practice', icon: Code2 },
                                            { val: 'RESUME', label: 'Resume & CV', icon: FileText },
                                        ].map(({ val, label, icon: Icon }) => (
                                            <button key={val} type="button" onClick={() => setResCategory(val)}
                                                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${resCategory === val ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}>
                                                <Icon className="w-5 h-5" />
                                                <span className="text-[9px] font-black uppercase tracking-widest text-center">{label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {}
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Resource Title</label>
                                    <input type="text" required value={resTitle} onChange={e => setResTitle(e.target.value)}
                                        placeholder="e.g. Top 10 System Design Interview Questions"
                                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-600 outline-none font-medium text-sm transition-all" />
                                </div>

                                {}
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Resource URL</label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input type="url" required value={resUrl} onChange={e => setResUrl(e.target.value)}
                                            placeholder="https://..."
                                            className="w-full pl-11 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-600 outline-none font-medium text-sm transition-all" />
                                    </div>
                                </div>

                                {}
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Brief Description (Optional)</label>
                                    <textarea rows={3} value={resDesc} onChange={e => setResDesc(e.target.value)}
                                        placeholder="Why should students check this out?"
                                        className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-600 outline-none font-medium text-sm resize-none transition-all" />
                                </div>

                                {}
                                <AnimatePresence>
                                    {published ? (
                                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                                            className="w-full bg-emerald-500 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 uppercase tracking-widest text-sm">
                                            <CheckCircle2 className="w-5 h-5" /> Resource Published to Students!
                                        </motion.div>
                                    ) : (
                                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                                            type="submit" disabled={publishing || !resTitle || !resUrl}
                                            className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 uppercase tracking-widest text-sm italic transition-all shadow-2xl shadow-slate-200 disabled:opacity-40">
                                            {publishing ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Plus className="w-5 h-5" /> Publish to Student Module</>}
                                        </motion.button>
                                    )}
                                </AnimatePresence>
                            </form>
                        </div>

                        {}
                        <div className="flex items-start gap-4 bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
                            <Zap className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                            <p className="text-sm font-medium text-indigo-700 leading-relaxed">
                                Resources published here are immediately visible to your enrolled students under <strong>Placement Prep → Resources</strong>. Students can also receive a dashboard notification if Dashboard Impact is enabled.
                            </p>
                        </div>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
};

export default PlacementSupport;
