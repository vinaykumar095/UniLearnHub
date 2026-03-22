import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Brain, Code, Loader2, ChevronRight,
    Timer, Award, AlertCircle, Play,
    MessageSquare, UserCheck, ShieldCheck, Zap,
    FileSearch, Edit3, CheckCircle2, Circle
} from 'lucide-react';
import api from '../../api/client';
import CodingLab from '../../components/dashboard/CodingLab';
import { dsaProblems, dsaCategories } from '../../data/dsaProblems';
import { aptitudeTopics } from '../../data/aptitudeData';

type Tab = 'aptitude' | 'coding' | 'mocks' | 'resume';

const hrMockQuestions = [
    { q: 'Tell me about yourself.', tips: 'Focus on your trajectory: Past experience -> Present role -> Future goals.' },
    { q: 'What are your strengths and weaknesses?', tips: 'Be honest but focus on how you are improving your weaknesses.' },
    { q: 'Why should we hire you?', tips: 'Match your skills directly to the job description provided.' },
    { q: 'Where do you see yourself in 5 years?', tips: 'Show ambition but also commitment to the company\'s growth.' },
    { q: 'What is your greatest achievement?', tips: 'Use the STAR method to describe a specific situation where you made a difference.' },
    { q: 'How do you handle pressure?', tips: 'Give an example of a stressful situation and how you stayed calm and resolved it.' }
];

const technicalTopics = {
    'DBMS': [
        { q: 'What is Normalization?', options: ['Organizing data to reduce redundancy', 'Increasing data duplication', 'Sorting data alphabetically', 'Deleting old records'], answer: 0, explanation: 'Normalization is the process of organizing data in a database to reduce redundancy and improve data integrity.' },
        { q: 'What is a Primary Key?', options: ['A key that allows null values', 'A unique identifier for a row', 'A key used for encryption', 'A key shared by all tables'], answer: 1, explanation: 'A primary key is a field in a table which uniquely identifies each row/record in a database table.' },
        { q: 'Explain ACID properties.', tips: 'Atomicity, Consistency, Isolation, and Durability. Explain each with a simple transaction example.' }
    ],
    'OS': [
        { q: 'What is a Deadlock?', options: ['A state where everyone is working', 'A state where no process can proceed', 'A fast execution mode', 'A type of file system'], answer: 1, explanation: 'Deadlock is a situation where a set of processes are blocked because each process is holding a resource and waiting for another resource acquired by some other process.' },
        { q: 'What is Paging in OS?', tips: 'Explain it as a memory management scheme that eliminates the need for contiguous allocation of physical memory.' }
    ],
    'Networking': [
        { q: 'What is the OSI model?', options: ['A conceptual framework for networking', 'A hardware device', 'A programming language', 'An operating system'], answer: 0, explanation: 'The Open Systems Interconnection (OSI) model is a conceptual model that characterizes and standardizes the communication functions of a telecommunication or computing system.' },
        { q: 'Difference between TCP and UDP?', tips: 'TCP is connection-oriented, reliable. UDP is connectionless, faster but unreliable.' }
    ],
    'Project Viva': [
        { q: 'How do you choose your tech stack?', tips: 'Explain based on project requirements, scalability, and your familiarity with the tools.' },
        { q: 'What was the biggest challenge in your project?', tips: 'Discuss a specific technical or collaboration hurdle and how you overcame it.' }
    ]
};

const resumeTips = [
    { title: 'Project Descriptions', content: 'Use the STAR method (Situation, Task, Action, Result). Quantify impact: "Increased speed by 30%" instead of "Made it faster".' },
    { title: 'Highlighting Skills', content: 'Group skills by category (Languages, Tools, Frameworks). List them in order of proficiency.' },
    { title: 'Common Mistakes', content: 'Typos, using an unprofessional email, or including irrelevant hobbies. Keep it to one page for entry-level.' },
];

const PlacementPrep = () => {
    const [activeTab, setActiveTab] = useState<Tab>('aptitude');
    const [dsaProgress, setDsaProgress] = useState<string[]>([]);
    const [aptitudeProgress, setAptitudeProgress] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    // Quiz State
    const [quizActive, setQuizActive] = useState(false);
    const [quizCategory, setQuizCategory] = useState<string | null>(null);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
    const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
    const [quizTimer, setQuizTimer] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);
    const [totalAptitudeTopics, setTotalAptitudeTopics] = useState(0);
    const [mockActive, setMockActive] = useState(false);
    const [mockType, setMockType] = useState<'HR' | 'Technical' | null>(null);
    const [mockCategory, setMockCategory] = useState<string | null>(null);
    const [selectedSubTopic, setSelectedSubTopic] = useState<string | null>(null);
    const [labOpen, setLabOpen] = useState(false);
    const [selectedProblem, setSelectedProblem] = useState<any>(null);
    const [selectedCategory, setSelectedCategory] = useState(dsaCategories[0]);
    const timerRef = useRef<any>(null);

    useEffect(() => {
        loadProgress();
        // Calculate total subtopics once
        const total = Object.values(aptitudeTopics).reduce((acc, cat) => 
            acc + Object.keys(cat.subTopics).length, 0);
        setTotalAptitudeTopics(total);
    }, []);

    const loadProgress = async () => {
        try {
            const [dsaRes, aptitudeStatusRes] = await Promise.all([
                api.get('/dsa/progress'),
                api.get('/placement/status')
            ]);
            setDsaProgress(dsaRes.data.solvedProblemIds || []);
            setAptitudeProgress(aptitudeStatusRes.data.completedTopicIds || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    // Quiz Functions
    const startQuiz = (category: string, subTopic?: string) => {
        setQuizCategory(category);
        setSelectedSubTopic(subTopic || null);
        setQuizActive(true);
        setCurrentQIndex(0);
        setSelectedOpt(null);
        setQuizAnswers([]);
        setQuizTimer(0);
        setQuizFinished(false);
        timerRef.current = setInterval(() => setQuizTimer(prev => prev + 1), 1000);
    };

    const handleNextQ = () => {
        if (selectedOpt === null) return;
        const newAnswers = [...quizAnswers, selectedOpt];
        setQuizAnswers(newAnswers);
        setSelectedOpt(null);

        const category = aptitudeTopics[quizCategory!];
        const questions = selectedSubTopic ? category.subTopics[selectedSubTopic] : 
            Object.values(category.subTopics).flat();

        if (currentQIndex < questions.length - 1) {
            setCurrentQIndex(currentQIndex + 1);
        } else {
            finishQuiz(newAnswers);
        }
    };

    const finishQuiz = async (finalAnswers: number[]) => {
        if (timerRef.current) clearInterval(timerRef.current);
        const category = aptitudeTopics[quizCategory!];
        const questions = selectedSubTopic ? category.subTopics[selectedSubTopic] : 
            Object.values(category.subTopics).flat();
            
        const score = finalAnswers.filter((ans, i) => ans === questions[i].answer).length;

        try {
            await Promise.all([
                api.post('/placement/attempt', {
                    module: selectedSubTopic || quizCategory,
                    category: quizCategory,
                    score,
                    total: questions.length
                }),
                // Automatically mark as completed if it's a sub-topic quiz
                selectedSubTopic ? api.post('/placement/status/toggle', {
                    topicId: `${quizCategory}:${selectedSubTopic}`,
                    status: 'completed'
                }) : Promise.resolve()
            ]);
            loadProgress();
        } catch (e) { console.error(e); }
        setQuizFinished(true);
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>;

    const renderQuiz = () => {
        const category = aptitudeTopics[quizCategory!];
        const questions = selectedSubTopic ? category.subTopics[selectedSubTopic] : 
            Object.values(category.subTopics).flat();
        const currentQ = questions[currentQIndex];

        if (quizFinished) {
            const score = quizAnswers.filter((ans, i) => ans === questions[i].answer).length;
            return (
                <div className="max-w-3xl mx-auto space-y-8 py-10">
                    <div className="bg-white rounded-[3rem] p-12 text-center border shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-green-500" />
                        <div className="w-24 h-24 bg-green-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-green-600">
                            <Award className="w-12 h-12" />
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 mb-2">Quiz Conquered!</h2>
                        <p className="text-slate-500 font-bold mb-8">Performance breakdown for {selectedSubTopic || quizCategory}</p>

                        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                            <div className="bg-slate-50 p-6 rounded-3xl">
                                <div className="text-3xl font-black text-slate-900">{score}/{questions.length}</div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Final Score</div>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-3xl">
                                <div className="text-3xl font-black text-slate-900">{formatTime(quizTimer)}</div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Time Taken</div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {questions.map((q, i) => (
                            <div key={i} className={`p-6 rounded-3xl border ${quizAnswers[i] === q.answer ? 'bg-green-50/50 border-green-100' : 'bg-red-50/50 border-red-100'}`}>
                                <h4 className="font-black text-slate-800 mb-2">{i + 1}. {q.q}</h4>
                                <div className="flex items-center gap-3 text-sm">
                                    <span className={quizAnswers[i] === q.answer ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                                        {quizAnswers[i] === q.answer ? '✓ Correct' : '✗ Incorrect'}
                                    </span>
                                    <span className="text-slate-400">•</span>
                                    <span className="text-slate-600 font-medium">Answer: {q.options[q.answer]}</span>
                                </div>
                                <div className="mt-4 p-4 bg-white/50 rounded-2xl text-xs font-medium text-slate-500 italic">
                                    <span className="font-black text-slate-700 not-italic mr-1">Explanation:</span> {q.explanation}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => setQuizActive(false)} className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black hover:bg-primary-600 transition-all shadow-xl">Return to Overview</button>
                </div>
            );
        }

        return (
            <div className="max-w-2xl mx-auto space-y-6 py-10">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900">{quizCategory} Quiz</h2>
                        <div className="flex items-center gap-2 text-slate-400 mt-1">
                            <Timer className="w-4 h-4" />
                            <span className="text-sm font-bold tabular-nums">{formatTime(quizTimer)} elapsed</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-sm font-black text-primary-600 bg-primary-50 px-3 py-1 rounded-full uppercase tracking-tighter">Question {currentQIndex + 1}/{questions.length}</span>
                    </div>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
                        className="bg-primary-600 h-full shadow-[0_0_10px_rgba(37,99,235,0.3)] transition-all duration-500" />
                </div>

                <motion.div key={currentQIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-100">
                    <p className="text-xl font-black text-slate-900 mb-8 leading-relaxed">{currentQ.q}</p>
                    <div className="space-y-4">
                        {currentQ.options.map((opt, i) => (
                            <button key={i} onClick={() => setSelectedOpt(i)}
                                className={`w-full text-left px-6 py-5 rounded-2xl border-2 transition-all flex items-center justify-between group ${selectedOpt === i ? 'border-primary-600 bg-primary-50 text-primary-900' : 'border-slate-50 bg-slate-50 hover:border-slate-200 text-slate-600'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-all ${selectedOpt === i ? 'bg-primary-600 text-white' : 'bg-white border text-slate-400 group-hover:bg-primary-50'}`}>
                                        {String.fromCharCode(65 + i)}
                                    </div>
                                    <span className="font-bold">{opt}</span>
                                </div>
                                {selectedOpt === i && <CheckCircle2 className="w-6 h-6 text-primary-600" />}
                            </button>
                        ))}
                    </div>
                </motion.div>

                <button onClick={handleNextQ} disabled={selectedOpt === null}
                    className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black hover:bg-primary-600 transition-all shadow-2xl disabled:opacity-50 flex items-center justify-center gap-3 text-lg">
                    {currentQIndex === questions.length - 1 ? 'Finish Challenge' : 'Confirm & Continue'} <ChevronRight className="w-6 h-6" />
                </button>
            </div>
        );
    };

    const renderMockInterview = () => {
        const questions: any[] = mockType === 'HR' ? hrMockQuestions : (technicalTopics[mockCategory as keyof typeof technicalTopics] || []);
        const currentQ = questions[currentQIndex];

        if (!currentQ) return <div className="text-center py-20">No questions found. <button onClick={() => setMockActive(false)} className="text-primary-600 font-bold underline">Go Back</button></div>;

        if (quizFinished) {
            return (
                <div className="max-w-2xl mx-auto space-y-8 py-10">
                    <div className="bg-white rounded-[3rem] p-12 text-center border shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-violet-500" />
                        <div className="w-24 h-24 bg-violet-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-violet-600">
                            <UserCheck className="w-12 h-12" />
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 mb-2">Sim Finished!</h2>
                        <p className="text-slate-500 font-bold mb-8">You've completed the {mockType} {mockCategory || ''} Mock session.</p>
                        <button onClick={() => setMockActive(false)} className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black hover:bg-primary-600 transition-all shadow-xl">Return to Overview</button>
                    </div>
                </div>
            );
        }

        return (
            <div className="max-w-2xl mx-auto space-y-6 py-10">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900">{mockType} Simulator {mockCategory ? `(${mockCategory})` : ''}</h2>
                        <p className="text-sm font-bold text-slate-400 mt-1">Practice and refine your responses</p>
                    </div>
                    <div className="text-right">
                        <span className="text-sm font-black text-violet-600 bg-violet-50 px-3 py-1 rounded-full uppercase tracking-tighter">Round {currentQIndex + 1}/{questions.length}</span>
                    </div>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
                        className="bg-violet-600 h-full transition-all duration-500" />
                </div>

                <motion.div key={currentQIndex} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-100 flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center mb-6">
                        <MessageSquare className="w-6 h-6" />
                    </div>
                    <p className="text-2xl font-black text-slate-900 mb-4 leading-tight">{currentQ.q}</p>
                    <p className="text-slate-500 font-medium text-sm mb-10 max-w-md">Think about your answer. Press "Show Tip" if you're stuck, then proceed to the next question.</p>
                    
                    {(currentQ as any).options ? (
                         <div className="w-full space-y-3 mb-10 text-left">
                            {(currentQ as any).options.map((opt: string, i: number) => (
                                <button key={i} onClick={() => setSelectedOpt(i)}
                                    className={`w-full text-left px-6 py-4 rounded-2xl border-2 transition-all flex items-center justify-between group ${selectedOpt === i ? 'border-primary-600 bg-primary-50 text-primary-900' : 'border-slate-50 bg-slate-50 hover:border-slate-200 text-slate-600'}`}>
                                    <span className="font-bold">{opt}</span>
                                    {selectedOpt === i && <CheckCircle2 className="w-5 h-5 text-primary-600" />}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl mb-10 text-left w-full group overflow-hidden relative">
                             <div className="relative z-10">
                                <h5 className="flex items-center gap-2 text-amber-700 font-black text-xs uppercase tracking-widest mb-2">
                                    <Lightbulb className="w-4 h-4" /> Expert Tip
                                </h5>
                                <p className="text-amber-800 text-sm font-medium leading-relaxed italic">{(currentQ as any).tips}</p>
                             </div>
                             <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:rotate-12 transition-transform">
                                <Brain className="w-24 h-24 text-amber-900" />
                             </div>
                        </div>
                    )}

                    <div className="flex gap-4 w-full">
                        <button onClick={() => setMockActive(false)} className="flex-1 px-8 py-5 rounded-3xl font-black text-slate-400 hover:text-slate-600 border border-slate-100 transition-all">Quit Session</button>
                        <button 
                            onClick={() => {
                                if (currentQIndex < questions.length - 1) {
                                    setCurrentQIndex(currentQIndex + 1);
                                    setSelectedOpt(null);
                                } else {
                                    setQuizFinished(true);
                                }
                            }}
                            className="flex-[2] bg-slate-900 text-white py-5 rounded-[1.5rem] font-black hover:bg-violet-600 transition-all shadow-xl flex items-center justify-center gap-3"
                        >
                            {currentQIndex === questions.length - 1 ? 'Finish' : 'Next Question'} <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-20">
            {quizActive ? (
                renderQuiz()
            ) : mockActive ? (
                renderMockInterview()
            ) : (
                <>
                    <div className="bg-slate-900 rounded-[3rem] p-12 relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 blur-[120px] -translate-y-1/2 translate-x-1/2" />
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
                            <div className="flex-1">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-500/10 border border-primary-500/20 rounded-full text-primary-400 font-bold text-xs uppercase tracking-widest mb-4">
                                    <Zap className="w-3 h-3" /> Career Accelerator
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none mb-4">Placement Excellence</h1>
                                <p className="text-slate-400 font-medium text-lg max-w-xl">Master technical skills, sharpen your aptitude, and simulate interviews to land your dream role.</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 text-center">
                                    <div className="text-3xl font-black text-white mb-1">{dsaProgress.length}/120</div>
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">DSA Solved</div>
                                </div>
                                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 text-center">
                                    <div className="text-3xl font-black text-green-400 mb-1">{Math.round((dsaProgress.length / 120) * 100)}%</div>
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">DSA Score</div>
                                </div>
                                <div className="hidden md:block bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 text-center">
                                    <div className="text-3xl font-black text-primary-400 mb-1">
                                        {totalAptitudeTopics > 0 ? Math.round((aptitudeProgress.length / totalAptitudeTopics) * 100) : 0}%
                                    </div>
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Aptitude Score</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex p-2 bg-slate-100 rounded-3xl gap-2 sticky top-0 z-20 backdrop-blur-sm">
                        {(['aptitude', 'coding', 'mocks', 'resume'] as Tab[]).map((tab) => (
                            <button key={tab} onClick={() => setActiveTab(tab)}
                                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-primary-600 shadow-xl' : 'text-slate-500 hover:text-slate-800'}`}>
                                {tab === 'aptitude' && <Brain className="w-4 h-4" />}
                                {tab === 'coding' && <Code className="w-4 h-4" />}
                                {tab === 'mocks' && <MessageSquare className="w-4 h-4" />}
                                {tab === 'resume' && <FileSearch className="w-4 h-4" />}
                                {tab}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>

                            {/* Aptitude Tab */}
                            {activeTab === 'aptitude' && (
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {Object.keys(aptitudeTopics).map((catKey) => {
                                            const cat = aptitudeTopics[catKey];
                                            return (
                                                <div key={catKey} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-2xl transition-all group flex flex-col">
                                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-600 group-hover:text-white transition-all text-slate-400 shadow-inner">
                                                        <Brain className="w-8 h-8" />
                                                    </div>
                                                    <h3 className="text-xl font-black text-slate-900 mb-2">{cat.title}</h3>
                                                    <p className="text-sm text-slate-500 font-medium mb-6 leading-relaxed">{cat.description}</p>
                                                    
                                                    <div className="space-y-2 mb-8">
                                                        {Object.keys(cat.subTopics).map(sub => {
                                                            const topicId = `${catKey}:${sub}`;
                                                            const isCompleted = aptitudeProgress.includes(topicId);
                                                            return (
                                                                <div key={sub} className="flex items-center gap-2 group/sub">
                                                                    <button 
                                                                        onClick={async (e) => {
                                                                            e.stopPropagation();
                                                                            try {
                                                                                await api.post('/placement/status/toggle', { 
                                                                                    topicId,
                                                                                    status: isCompleted ? 'not_started' : 'completed'
                                                                                });
                                                                                loadProgress();
                                                                            } catch (err) { console.error('Toggle failed', err); }
                                                                        }}
                                                                        className={`transition-all hover:scale-110 active:scale-95 ${isCompleted ? 'text-emerald-500' : 'text-slate-200 hover:text-primary-300'}`}
                                                                    >
                                                                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => startQuiz(catKey, sub)}
                                                                        className={`flex-1 text-left px-2 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-between group/item ${isCompleted ? 'text-emerald-600' : 'text-slate-400 hover:text-primary-600 hover:bg-primary-50'}`}
                                                                    >
                                                                        {sub} <ChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 -translate-x-2 group-hover/item:translate-x-0 transition-all" />
                                                                    </button>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                    <div className="mt-auto">
                                                        <button onClick={() => startQuiz(catKey)} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-primary-600 transition-all flex items-center justify-center gap-2">
                                                            Master All <Play className="w-4 h-4 fill-white" />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Coding Tab */}
                            {activeTab === 'coding' && (
                                <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row h-[800px]">
                                    <div className="md:w-80 bg-slate-50 border-r border-slate-100 p-8 overflow-y-auto custom-scrollbar">
                                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">DSA Roadmap</h3>
                                        <div className="space-y-2">
                                            {dsaCategories.map(cat => (
                                                <button 
                                                    key={cat} 
                                                    onClick={() => setSelectedCategory(cat)}
                                                    className={`w-full text-left px-5 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all flex items-center justify-between group ${selectedCategory === cat ? 'bg-primary-600 text-white shadow-lg shadow-primary-100 translate-x-1' : 'text-slate-500 hover:bg-white hover:text-primary-600 hover:shadow-sm'}`}>
                                                    {cat} <ChevronRight className={`w-4 h-4 transition-transform ${selectedCategory === cat ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'}`} />
                                                </button>
                                            ))}
                                        </div>
                                        <div className="mt-10 p-6 bg-slate-900 rounded-[2.5rem] text-white">
                                            <TrophyCustom className="w-8 h-8 mb-4 text-primary-400" />
                                            <h4 className="font-black text-lg leading-tight mb-2">Platform Goal</h4>
                                            <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest leading-relaxed">Solve all 120 LeetCode-style challenges</p>
                                        </div>
                                    </div>
                                    <div className="flex-1 p-10 overflow-y-auto custom-scrollbar bg-white">
                                        <div className="flex items-center justify-between mb-8">
                                            <div>
                                                <h3 className="text-3xl font-black text-slate-900 mb-1">{selectedCategory}</h3>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">{dsaProblems[selectedCategory]?.length || 0} Professional Challenges</p>
                                            </div>
                                            <div className="flex gap-2">
                                                {['Easy', 'Medium', 'Hard'].map(d => (
                                                    <span key={d} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">{d}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            {(dsaProblems[selectedCategory] || []).map((problem) => {
                                                const isCompleted = dsaProgress.includes(problem.id);
                                                return (
                                                    <div key={problem.id} className={`p-8 bg-white border rounded-[2.5rem] hover:border-primary-200 hover:shadow-2xl transition-all shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 group relative overflow-hidden ${isCompleted ? 'border-emerald-100 bg-emerald-50/10' : 'border-slate-100'}`}>
                                                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] -rotate-12 translate-x-4 -translate-y-4">
                                                            <Code className="w-24 h-24" />
                                                        </div>
                                                        <div className="flex-1 relative z-10 flex gap-6 items-start">
                                                             <button 
                                                                onClick={async (e) => {
                                                                    e.stopPropagation();
                                                                    try {
                                                                        await api.post('/dsa/submit', { 
                                                                            problemId: problem.id,
                                                                            status: isCompleted ? 'incomplete' : 'solved'
                                                                        });
                                                                        loadProgress();
                                                                    } catch (err) { console.error('Toggle failed', err); }
                                                                }}
                                                                className={`mt-1 flex-shrink-0 transition-all hover:scale-110 active:scale-95 ${isCompleted ? 'text-emerald-500' : 'text-slate-200 hover:text-primary-300'}`}
                                                                title={isCompleted ? "Mark as Incomplete" : "Mark as Completed"}
                                                            >
                                                                {isCompleted ? <CheckCircle2 className="w-8 h-8" /> : <Circle className="w-8 h-8" />}
                                                            </button>
                                                            <div>
                                                                <div className="flex items-center gap-3 mb-3">
                                                                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${problem.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' : problem.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                                                                        {problem.difficulty}
                                                                    </span>
                                                                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">{problem.category}</span>
                                                                </div>
                                                                <h4 className={`text-xl font-black ${isCompleted ? 'text-emerald-900' : 'text-slate-900'}`}>{problem.title}</h4>
                                                            </div>
                                                        </div>
                                                        <button 
                                                            onClick={() => {
                                                                setSelectedProblem(problem);
                                                                setLabOpen(true);
                                                            }}
                                                            className={`px-10 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 relative z-10 ${isCompleted ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-50' : 'bg-slate-900 text-white hover:bg-primary-600 shadow-slate-100'}`}>
                                                            {isCompleted ? 'Review Solution' : 'Run Solution'}
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Mocks Tab */}
                            {activeTab === 'mocks' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-sm relative overflow-hidden group">
                                        <div className="absolute top-0 left-0 w-2 h-full bg-violet-600" />
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="w-16 h-16 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center shadow-inner">
                                                <UserCheck className="w-8 h-8" />
                                            </div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Behavioral Strategy</span>
                                        </div>
                                        <h3 className="text-3xl font-black text-slate-900 mb-4">HR Interview Simulator</h3>
                                        <p className="text-slate-500 font-medium leading-relaxed mb-8">Prepare for cultural fit questions and behavioral assessments with our AI-guided prompts.</p>

                                        <div className="space-y-4 mb-10">
                                            {hrMockQuestions.slice(0, 3).map((q) => (
                                                <div key={q.q} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-xl transition-all cursor-pointer">
                                                    <h4 className="font-black text-slate-800 text-sm mb-2">{q.q}</h4>
                                                    <div className="flex items-start gap-2 p-3 bg-white/50 rounded-xl text-[11px] font-medium text-slate-500 italic">
                                                        <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0" /> {q.tips}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <button 
                                            onClick={() => {
                                                setMockType('HR');
                                                setMockActive(true);
                                                setCurrentQIndex(0);
                                                setQuizFinished(false);
                                            }}
                                            className="w-full bg-violet-600 text-white py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-violet-100 hover:scale-[1.02] transition-all"
                                        >
                                            Start HR Simulation
                                        </button>
                                    </div>

                                    <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-sm relative overflow-hidden group">
                                        <div className="absolute top-0 left-0 w-2 h-full bg-emerald-600" />
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
                                                <ShieldCheck className="w-8 h-8" />
                                            </div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Technical Mastery</span>
                                        </div>
                                        <h3 className="text-3xl font-black text-slate-900 mb-4">Core Technical Mock</h3>
                                        <p className="text-slate-500 font-medium leading-relaxed mb-8">Deep dive into DBMS, OS, Computer Networks, and your core projects.</p>

                                        <div className="grid grid-cols-2 gap-4 mb-10">
                                            {Object.keys(technicalTopics).map(cat => (
                                                <div 
                                                    key={cat} 
                                                    onClick={() => {
                                                        setMockType('Technical');
                                                        setMockCategory(cat);
                                                        setMockActive(true);
                                                        setCurrentQIndex(0);
                                                        setQuizFinished(false);
                                                    }}
                                                    className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-center hover:bg-white hover:shadow-xl transition-all cursor-pointer"
                                                >
                                                    <div className="text-xs font-black text-slate-700 uppercase tracking-widest">{cat}</div>
                                                    <div className="text-[9px] font-bold text-slate-400 mt-1">Practice Viva</div>
                                                </div>
                                            ))}
                                        </div>
                                        <button 
                                            onClick={() => {
                                                setMockType('Technical');
                                                setMockCategory('DBMS');
                                                setMockActive(true);
                                                setCurrentQIndex(0);
                                                setQuizFinished(false);
                                            }}
                                            className="w-full bg-emerald-600 text-white py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-emerald-100 hover:scale-[1.02] transition-all"
                                        >
                                            Launch Technical Viva
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Resume Tab */}
                            {activeTab === 'resume' && (
                                <div className="max-w-4xl mx-auto space-y-8">
                                    <div className="bg-gradient-to-br from-primary-600 to-indigo-700 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full" />
                                        <h3 className="text-4xl font-black mb-4">Resume Excellence Guide</h3>
                                        <p className="text-primary-100 font-medium text-lg leading-relaxed max-w-2xl">Your resume is your ticket to the interview. We've compiled the latest industry standards to help you stand out from the crowd.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {resumeTips.map((tip) => (
                                            <div key={tip.title} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-2xl transition-all flex flex-col">
                                                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 text-primary-600">
                                                    <Edit3 className="w-7 h-7" />
                                                </div>
                                                <h4 className="text-xl font-black text-slate-900 mb-4">{tip.title}</h4>
                                                <p className="text-sm text-slate-500 font-medium leading-relaxed">{tip.content}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="bg-amber-50 border-2 border-amber-100 rounded-[2.5rem] p-10 flex items-start gap-6 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-10">
                                            <AlertCircle className="w-32 h-32 text-amber-900" />
                                        </div>
                                        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                                            <AlertCircle className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-black text-amber-900 mb-2">Pro Checklist</h4>
                                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-10 text-sm font-bold text-amber-800">
                                                <li className="flex items-center gap-2 decoration-amber-500/30">✓ Action verbs at start of points</li>
                                                <li className="flex items-center gap-2">✓ Links to GitHub/Portfolio included</li>
                                                <li className="flex items-center gap-2">✓ ATS friendly font (Inter/Roboto)</li>
                                                <li className="flex items-center gap-2">✓ No "Objective" section (use Summary)</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </motion.div>
                    </AnimatePresence>
                </>
            )}

            <AnimatePresence>
                {labOpen && (
                    <CodingLab 
                        problem={selectedProblem} 
                        onClose={() => {
                            setLabOpen(false);
                            loadProgress();
                        }} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

const Lightbulb = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5" />
        <path d="M9 18h6" />
        <path d="M10 22h4" />
    </svg>
);

const TrophyCustom = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
);

export default PlacementPrep;
