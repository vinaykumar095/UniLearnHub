import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Search, Filter, BookOpen, ExternalLink,
    MessageSquare, Loader2, X,
    Github, Linkedin, Cpu, Award,
    CheckCircle2, Circle, Send, Target, Zap
} from 'lucide-react';
import api from '../../api/client';

const StudentManagement = () => {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [showPortfolio, setShowPortfolio] = useState(false);
    const [showGuidance, setShowGuidance] = useState(false);
    const [guidanceData, setGuidanceData] = useState({
        type: 'GENERAL_FEEDBACK',
        content: '',
        impacts: { dashboard: true, roadmap: true }
    });
    const [sendingGuidance, setSendingGuidance] = useState(false);

    const fetchStudents = async () => {
        try {
            const res = await api.get('/faculty/students');
            setStudents(res.data);
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleSendGuidance = async () => {
        if (!selectedStudent || !guidanceData.content) return;
        setSendingGuidance(true);
        try {
            await api.post('/faculty/guidance', {
                ...guidanceData,
                studentId: selectedStudent.studentId,
                courseId: selectedStudent.courseId 
            });
            setShowGuidance(false);
            setGuidanceData({ type: 'GENERAL_FEEDBACK', content: '', impacts: { dashboard: true, roadmap: true } });
            
        } catch (error) {
            console.error('Error sending guidance:', error);
        } finally {
            setSendingGuidance(false);
        }
    };

    const filteredStudents = students.filter(s =>
        s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="h-full flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
        </div>
    );

    return (
        <div className="space-y-8">
            {}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="text-left">
                    <h1 className="text-3xl font-black text-slate-900 italic">Student Management Hub</h1>
                    <p className="text-slate-500 font-medium">Monitor engagement, analyze performance, and mentor future talent.</p>
                </div>

                <div className="flex w-full md:w-auto gap-4">
                    <div className="relative flex-1 md:w-96">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Identify a student or course pulse..."
                            className="w-full pl-14 pr-6 py-4 bg-white border-2 border-slate-100 rounded-[2rem] focus:border-indigo-600 outline-none transition-all font-bold shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {}
            <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-10 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Student Pulse</th>
                                <th className="px-10 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Active Course</th>
                                <th className="px-10 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Mastery Progress</th>
                                <th className="px-10 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Skill Signal</th>
                                <th className="px-10 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Interactions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredStudents.map((student, idx) => (
                                <motion.tr
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    key={student.id}
                                    className="hover:bg-indigo-50/30 transition-all group"
                                >
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-5">
                                            <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-slate-200">
                                                {student.studentName.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-slate-900 text-lg leading-tight">{student.studentName}</h4>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="px-3 py-1 bg-indigo-100 text-[9px] font-black text-indigo-700 rounded-full uppercase tracking-widest">{student.branch}</span>
                                                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{student.year} Year</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-left">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white border-2 border-slate-100 rounded-xl flex items-center justify-center text-indigo-600">
                                                <BookOpen className="w-5 h-5" />
                                            </div>
                                            <span className="text-sm font-black text-slate-700 max-w-[150px] truncate">{student.courseTitle}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="w-48">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{student.progress}% Mastery</span>
                                            </div>
                                            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${student.progress}%` }}
                                                    className="h-full bg-indigo-600 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.3)]"
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-left">
                                        <div className="flex flex-wrap gap-2 max-w-[220px]">
                                            {student.skills.slice(0, 3).map((skill: string, i: number) => (
                                                <span key={i} className="px-3 py-1.5 bg-white border border-slate-200 text-[9px] font-black text-slate-500 rounded-xl uppercase tracking-widest">
                                                    {skill}
                                                </span>
                                            ))}
                                            {student.skills.length > 3 && (
                                                <span className="w-10 h-8 flex items-center justify-center bg-slate-50 border border-slate-100 rounded-xl text-[9px] font-black text-slate-400">
                                                    +{student.skills.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => { setSelectedStudent(student); setShowPortfolio(true); }}
                                                className="p-4 bg-white border border-slate-100 hover:border-emerald-500 rounded-[1.2rem] text-slate-400 hover:text-emerald-600 transition-all shadow-sm hover:shadow-md"
                                                title="Intel View"
                                            >
                                                <Zap className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => { setSelectedStudent(student); setShowGuidance(true); }}
                                                className="p-4 bg-white border border-slate-100 hover:border-indigo-500 rounded-[1.2rem] text-slate-400 hover:text-indigo-600 transition-all shadow-sm hover:shadow-md"
                                                title="Deploy Guidance"
                                            >
                                                <MessageSquare className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredStudents.length === 0 && (
                    <div className="p-32 text-center text-left">
                        <Users className="w-24 h-24 text-slate-100 mx-auto mb-6" />
                        <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">Awaiting data pulse detection...</p>
                    </div>
                )}
            </div>

            {}
            <AnimatePresence>
                {showPortfolio && selectedStudent && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-[3.5rem] max-w-5xl w-full shadow-2xl relative max-h-[90vh] overflow-hidden flex flex-col"
                        >
                            <div className="p-12 overflow-y-auto no-scrollbar flex-1">
                                <div className="flex justify-between items-start mb-12">
                                    <div className="flex items-center gap-8">
                                        <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white font-black text-3xl shadow-2xl shadow-indigo-200">
                                            {selectedStudent.studentName.charAt(0)}
                                        </div>
                                        <div className="text-left">
                                            <h2 className="text-4xl font-black text-slate-900 italic tracking-tight">{selectedStudent.studentName}</h2>
                                            <p className="text-indigo-600 font-black uppercase tracking-[0.2em] text-xs mt-2">{selectedStudent.branch} · {selectedStudent.year} Year Pulse</p>
                                            <div className="flex gap-4 mt-6">
                                                {selectedStudent.socials?.github && <a href={selectedStudent.socials.github} target="_blank" rel="noreferrer" className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all"><Github className="w-5 h-5 text-slate-600" /></a>}
                                                {selectedStudent.socials?.linkedin && <a href={selectedStudent.socials.linkedin} target="_blank" rel="noreferrer" className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all"><Linkedin className="w-5 h-5 text-slate-600" /></a>}
                                                <button onClick={() => { setShowPortfolio(false); setShowGuidance(true); }} className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all flex items-center gap-2">
                                                    Deploy Mentor Package <Target className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => setShowPortfolio(false)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all group">
                                        <X className="w-8 h-8 text-slate-300 group-hover:text-slate-900" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 text-left">
                                    <div className="lg:col-span-2 space-y-12">
                                        <section>
                                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                                                <Zap className="w-4 h-4" /> Strategic Intel
                                            </h3>
                                            <p className="text-lg text-slate-600 font-medium leading-relaxed">
                                                {selectedStudent.studentBio || "No bio payload detected. Student is focusing on core architectural mastery."}
                                            </p>
                                        </section>

                                        <section>
                                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                                                <Cpu className="w-4 h-4" /> Project Inventory
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {selectedStudent.projects?.length > 0 ? selectedStudent.projects.map((proj: any, i: number) => (
                                                    <div key={i} className="p-8 bg-slate-50 rounded-[2.5rem] border border-transparent hover:border-indigo-100 transition-all">
                                                        <h4 className="font-black text-slate-900 text-lg mb-2">{proj.title}</h4>
                                                        <p className="text-sm text-slate-500 mb-6 line-clamp-3 font-medium">{proj.description}</p>
                                                        <div className="flex flex-wrap gap-2 mb-6">
                                                            {proj.techStack?.map((t: string, j: number) => (
                                                                <span key={j} className="px-3 py-1 bg-white border border-slate-200 text-[9px] font-black text-indigo-500 rounded-full uppercase tracking-widest">
                                                                    {t}
                                                                </span>
                                                            ))}
                                                        </div>
                                                        <div className="flex gap-4">
                                                            {proj.github && <a href={proj.github} className="text-slate-400 hover:text-indigo-600 transition-all"><Github className="w-5 h-5" /></a>}
                                                            {proj.link && <a href={proj.link} className="text-slate-400 hover:text-indigo-600 transition-all"><ExternalLink className="w-5 h-5" /></a>}
                                                        </div>
                                                    </div>
                                                )) : (
                                                    <div className="col-span-2 p-12 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200 text-center">
                                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Awaiting project submission payload...</p>
                                                    </div>
                                                )}
                                            </div>
                                        </section>
                                    </div>

                                    <div className="space-y-12">
                                        <section>
                                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                                                <Award className="w-4 h-4" /> Mastery Milestones
                                            </h3>
                                            <div className="space-y-6">
                                                {selectedStudent.milestones?.length > 0 ? selectedStudent.milestones.map((ms: any, i: number) => (
                                                    <div key={i} className="flex gap-4">
                                                        <div className={`mt-1 ${ms.status === 'completed' ? 'text-emerald-500' : 'text-slate-200'}`}>
                                                            {ms.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                                                        </div>
                                                        <div>
                                                            <p className={`font-black text-xs uppercase tracking-widest ${ms.status === 'completed' ? 'text-slate-900' : 'text-slate-400'}`}>
                                                                {ms.title}
                                                            </p>
                                                            {ms.completedAt && <p className="text-[10px] text-slate-400 font-bold mt-1">Achieved: {new Date(ms.completedAt).toLocaleDateString()}</p>}
                                                        </div>
                                                    </div>
                                                )) : (
                                                    <div className="p-8 bg-indigo-50 rounded-[2rem] border border-indigo-100 italic text-[10px] font-bold text-indigo-500 uppercase tracking-widest leading-loose">
                                                        Student is consistently pushing boundaries in "{selectedStudent.courseTitle}". Detailed milestone logs pending system sync.
                                                    </div>
                                                )}
                                            </div>
                                        </section>

                                        <section>
                                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                                                <Filter className="w-4 h-4" /> Skill Topology
                                            </h3>
                                            <div className="flex flex-wrap gap-2 text-left">
                                                {selectedStudent.skills.map((skill: string, i: number) => (
                                                    <span key={i} className="px-4 py-2 bg-indigo-50 text-[10px] font-black text-indigo-700 rounded-2xl uppercase tracking-[0.15em]">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </section>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {}
            <AnimatePresence>
                {showGuidance && selectedStudent && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-[4rem] p-16 max-w-2xl w-full shadow-2xl relative"
                        >
                            <div className="flex justify-between items-center mb-12">
                                <h2 className="text-3xl font-black text-slate-900 italic tracking-tight">Deploy Guidance</h2>
                                <button onClick={() => setShowGuidance(false)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all">
                                    <X className="w-8 h-8 text-slate-300" />
                                </button>
                            </div>

                            <div className="space-y-10 text-left">
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] px-2">Intelligence Type</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        {['CAREER_PATH', 'SKILL_RECOMMENDATION', 'GENERAL_FEEDBACK'].map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => setGuidanceData({ ...guidanceData, type: type as any })}
                                                className={`px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border-2 ${guidanceData.type === type
                                                    ? 'bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200'
                                                    : 'bg-white text-slate-400 border-slate-100 hover:border-indigo-200'
                                                    }`}
                                            >
                                                {type.replace('_', ' ')}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3 text-left">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] px-2">Knowledge Payload</label>
                                    <textarea
                                        rows={5}
                                        placeholder="Enter strategic mentorship feedback..."
                                        className="w-full px-8 py-6 bg-slate-50 border-2 border-transparent rounded-[2.5rem] focus:bg-white focus:border-indigo-600 outline-none transition-all font-bold text-slate-700 resize-none shadow-inner"
                                        value={guidanceData.content}
                                        onChange={(e) => setGuidanceData({ ...guidanceData, content: e.target.value })}
                                    />
                                </div>

                                <div className="flex items-center gap-6 px-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            onClick={() => setGuidanceData({ ...guidanceData, impacts: { ...guidanceData.impacts, dashboard: !guidanceData.impacts.dashboard } })}
                                            className={`w-10 h-6 rounded-full relative transition-all cursor-pointer ${guidanceData.impacts.dashboard ? 'bg-indigo-600' : 'bg-slate-200'}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${guidanceData.impacts.dashboard ? 'left-5' : 'left-1'}`} />
                                        </div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Dashboard Impact</label>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div
                                            onClick={() => setGuidanceData({ ...guidanceData, impacts: { ...guidanceData.impacts, roadmap: !guidanceData.impacts.roadmap } })}
                                            className={`w-10 h-6 rounded-full relative transition-all cursor-pointer ${guidanceData.impacts.roadmap ? 'bg-emerald-600' : 'bg-slate-200'}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${guidanceData.impacts.roadmap ? 'left-5' : 'left-1'}`} />
                                        </div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Roadmap Impact</label>
                                    </div>
                                </div>

                                <button
                                    disabled={sendingGuidance || !guidanceData.content}
                                    onClick={handleSendGuidance}
                                    className="w-full bg-slate-900 text-white py-6 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-indigo-600 transition-all shadow-2xl shadow-slate-200 disabled:opacity-50"
                                >
                                    {sendingGuidance ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Initiate Mentorship <Send className="w-5 h-5" /></>}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StudentManagement;
