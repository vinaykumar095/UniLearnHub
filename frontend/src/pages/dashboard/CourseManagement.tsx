import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Clock, Loader2, FileText,
    Send, Users, Award, Layout, ListChecks,
    Trash2, ExternalLink, Activity, ChevronRight
} from 'lucide-react';
import api from '../../api/client';

const CourseManagement = () => {
    const { id } = useParams();
    const [course, setCourse] = useState<any>(null);
    const [assignments, setAssignments] = useState<any[]>([]);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [materials, setMaterials] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'assignments' | 'submissions' | 'materials' | 'students'>('assignments');
    const [newMaterial, setNewMaterial] = useState({ title: '', url: '', type: 'Link' });

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const [courseRes, assignRes, studentRes] = await Promise.all([
                    api.get(`/courses/${id}`),
                    api.get(`/assignments/course/${id}`),
                    api.get(`/faculty/courses/${id}/students`)
                ]);
                setCourse(courseRes.data);
                setAssignments(assignRes.data);
                setStudents(studentRes.data);
                setMaterials(courseRes.data.materials || []);
            } catch (error) {
                console.error('Error fetching course data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourseData();
    }, [id]);

    const fetchSubmissions = async (assignmentId: string) => {
        try {
            const res = await api.get(`/submissions/assignment/${assignmentId}`);
            setSubmissions(res.data);
            setActiveTab('submissions');
        } catch (error) {
            console.error('Error fetching submissions:', error);
        }
    };

    const handleAddMaterial = async () => {
        if (!newMaterial.url || !newMaterial.title) return;
        const updatedMaterials = [...materials, newMaterial];
        try {
            await api.patch(`/faculty/courses/${id}/materials`, { materials: updatedMaterials });
            setMaterials(updatedMaterials);
            setNewMaterial({ title: '', url: '', type: 'Link' });
        } catch (error) {
            console.error('Error adding material:', error);
        }
    };

    const handleRemoveMaterial = async (index: number) => {
        const updatedMaterials = materials.filter((_, i) => i !== index);
        try {
            await api.patch(`/faculty/courses/${id}/materials`, { materials: updatedMaterials });
            setMaterials(updatedMaterials);
        } catch (error) {
            console.error('Error removing material:', error);
        }
    };

    if (loading) return (
        <div className="h-full flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
        </div>
    );

    return (
        <div className="space-y-10 pb-20 max-w-7xl mx-auto">
            {/* 1. Course Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 rounded-[3.5rem] p-12 relative overflow-hidden shadow-2xl shadow-indigo-900/10"
            >
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-600/10 via-transparent to-transparent opacity-50" />
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex items-center gap-8">
                        <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-900/40">
                            <Layout className="w-10 h-10" />
                        </div>
                        <div className="text-left">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl md:text-4xl font-black text-white italic">{course?.title}</h1>
                                <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                                    {course?.category}
                                </span>
                            </div>
                            <p className="text-slate-400 font-medium max-w-xl">{course?.description}</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-4">
                        <div className="flex items-center gap-6 text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">
                            <span className="flex items-center gap-2"><Users className="w-4 h-4 text-indigo-400" /> {students.length} Enrolled</span>
                            <span className="flex items-center gap-2"><Award className="w-4 h-4 text-emerald-400" /> {course?.difficulty}</span>
                        </div>
                        <Link to="/dashboard/faculty/courses" className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black text-white uppercase tracking-widest transition-all">
                            Back to Hub
                        </Link>
                    </div>
                </div>
            </motion.div>

            {/* 2. Navigation Tabs */}
            <div className="flex flex-wrap gap-4 p-2 bg-white rounded-[2rem] border border-slate-100 shadow-sm w-fit">
                {[
                    { id: 'assignments', label: 'Assignments', icon: ListChecks },
                    { id: 'submissions', label: 'Submissions', icon: Send },
                    { id: 'materials', label: 'Learning Materials', icon: FileText },
                    { id: 'students', label: 'Student Progress', icon: Users }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-50'}`}
                    >
                        <tab.icon className="w-4 h-4" /> {tab.label}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'assignments' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center px-4">
                                <h3 className="text-xl font-black text-slate-900 flex items-center gap-3 italic">
                                    <ListChecks className="w-6 h-6 text-indigo-600" /> Course Milestones
                                </h3>
                                <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-600 transition-all shadow-lg">
                                    <Plus className="w-4 h-4" /> Add Milestone
                                </button>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {assignments.map((item, idx) => (
                                    <div key={item._id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-xl transition-all">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                <span className="font-black text-xl italic">{idx + 1}</span>
                                            </div>
                                            <div>
                                                <h4 className="font-black text-slate-900 text-lg">{item.title}</h4>
                                                <div className="flex items-center gap-4 mt-1 text-xs text-slate-400 font-bold italic uppercase tracking-tight">
                                                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Due: {new Date(item.deadline).toLocaleDateString()}</span>
                                                    <span className="text-indigo-600">•</span>
                                                    <span>{item.points || 100} Points</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => fetchSubmissions(item._id)}
                                            className="px-6 py-3 bg-indigo-50 text-indigo-600 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-600 hover:text-white transition-all"
                                        >
                                            Assess Pulse
                                        </button>
                                    </div>
                                ))}
                                {assignments.length === 0 && (
                                    <div className="p-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                                        <ListChecks className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                                        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No active signals detected.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'submissions' && (
                        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden">
                            <div className="p-10 border-b border-slate-50 flex justify-between items-center">
                                <h3 className="text-xl font-black text-slate-900 flex items-center gap-3 italic">
                                    <Send className="w-6 h-6 text-indigo-600" /> Signal Assessment
                                </h3>
                                <span className="px-4 py-2 bg-slate-50 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    {submissions.length} Total Submissions
                                </span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50/50">
                                        <tr>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Signal</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Pulse</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Payload</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Protocol</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {submissions.map((sub) => (
                                            <tr key={sub._id} className="hover:bg-slate-50/50 transition-all group">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-sm">
                                                            {sub.studentId?.name?.charAt(0)}
                                                        </div>
                                                        <span className="font-bold text-slate-900">{sub.studentId?.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-sm text-slate-500 font-medium">
                                                    {new Date(sub.createdAt).toLocaleString()}
                                                </td>
                                                <td className="px-8 py-6">
                                                    <a href={sub.fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:underline">
                                                        <FileText className="w-4 h-4" /> View Work
                                                    </a>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <button className="px-6 py-2 bg-slate-900 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-600 transition-all italic">
                                                        Grade Now
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {submissions.length === 0 && (
                                <div className="p-20 text-center italic text-slate-400 italic">Select an assignment to assess pulses.</div>
                            )}
                        </div>
                    )}

                    {activeTab === 'materials' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center px-4">
                                <h3 className="text-xl font-black text-slate-900 flex items-center gap-3 italic">
                                    <FileText className="w-6 h-6 text-indigo-600" /> Resource Hub
                                </h3>
                            </div>

                            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl space-y-8 text-left">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="md:col-span-1">
                                        <select
                                            className="w-full px-5 py-5 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 transition-all outline-none font-bold appearance-none"
                                            value={newMaterial.type}
                                            onChange={(e) => setNewMaterial({ ...newMaterial, type: e.target.value })}
                                        >
                                            <option>Video</option>
                                            <option>PDF</option>
                                            <option>Link</option>
                                            <option>Reading</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-1">
                                        <input
                                            type="text"
                                            placeholder="Resource Title..."
                                            className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 transition-all outline-none font-bold"
                                            value={newMaterial.title}
                                            onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                                        />
                                    </div>
                                    <div className="md:col-span-1">
                                        <input
                                            type="text"
                                            placeholder="URL / Location..."
                                            className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 transition-all outline-none font-bold"
                                            value={newMaterial.url}
                                            onChange={(e) => setNewMaterial({ ...newMaterial, url: e.target.value })}
                                        />
                                    </div>
                                    <button
                                        onClick={handleAddMaterial}
                                        className="bg-slate-900 text-white px-8 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-600 transition-all"
                                    >
                                        Deploy
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {materials.map((mat, idx) => (
                                        <div key={idx} className="p-6 bg-slate-50 rounded-[2.5rem] border border-transparent hover:border-indigo-200 transition-all flex items-center justify-between group">
                                            <div className="flex items-center gap-5 min-w-0">
                                                <div className={`w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm ${mat.type === 'Video' ? 'text-rose-500' :
                                                    mat.type === 'PDF' ? 'text-amber-500' :
                                                        'text-indigo-600'
                                                    }`}>
                                                    {mat.type === 'Video' ? <Activity className="w-6 h-6" /> :
                                                        mat.type === 'PDF' ? <FileText className="w-6 h-6" /> :
                                                            <ExternalLink className="w-6 h-6" />}
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="font-bold text-slate-900 truncate">{mat.title}</h4>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{mat.type}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <a
                                                    href={mat.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all shadow-sm"
                                                >
                                                    <ChevronRight className="w-5 h-5" />
                                                </a>
                                                <button
                                                    onClick={() => handleRemoveMaterial(idx)}
                                                    className="p-3 text-slate-300 hover:text-red-500 hover:bg-white rounded-xl transition-all shadow-sm"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {materials.length === 0 && (
                                        <div className="md:col-span-2 p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                                            No resources deployed yet.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'students' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center px-4">
                                <h3 className="text-xl font-black text-slate-900 flex items-center gap-3 italic">
                                    <Activity className="w-6 h-6 text-emerald-600" /> Enrollment Velocity
                                </h3>
                            </div>

                            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50/50">
                                            <tr>
                                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Scholar Details</th>
                                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Velocity</th>
                                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Aptitude Tags</th>
                                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {students.map((student) => (
                                                <tr key={student.id} className="hover:bg-slate-50/50 transition-all group">
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 font-black">
                                                                {student.studentName.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-slate-900">{student.studentName}</h4>
                                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">{student.branch}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="w-32">
                                                            <div className="flex justify-between items-end mb-1">
                                                                <span className="text-[10px] font-black text-emerald-600">{student.progress}%</span>
                                                            </div>
                                                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-emerald-500 rounded-full"
                                                                    style={{ width: `${student.progress}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                                                            {student.skills.slice(0, 2).map((skill: string, i: number) => (
                                                                <span key={i} className="px-2 py-0.5 bg-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-tight rounded">
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <Link
                                                            to="/dashboard/faculty/guidance"
                                                            className="text-emerald-600 font-black uppercase text-[10px] tracking-widest hover:underline italic"
                                                        >
                                                            Mentor
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {students.length === 0 && (
                                    <div className="p-20 text-center italic text-slate-400 italic">Course data stream empty. Awaiting enrollments.</div>
                                )}
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default CourseManagement;
