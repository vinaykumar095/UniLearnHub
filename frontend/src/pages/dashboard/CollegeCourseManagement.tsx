import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    BookOpen, CheckCircle2, XCircle, Clock, 
    Search, Filter, Loader2, 
    Info, AlertCircle 
} from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export const CollegeCourseManagement = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending');
    const [searchTerm, setSearchTerm] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<any>(null);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await api.get('/courses', {
                params: {
                    status: activeTab,
                    collegeId: typeof user?.collegeId === 'object' ? user?.collegeId?.id || user?.collegeId?._id : user?.collegeId
                }
            });
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, [activeTab]);

    const handleStatusUpdate = async (courseId: string, newStatus: 'approved' | 'rejected' | 'pending') => {
        setActionLoading(courseId);
        try {
            await api.patch(`/courses/${courseId}/approve`, { status: newStatus });
            setMessage({ type: 'success', text: `Course successfully ${newStatus === 'approved' ? 'approved' : 'rejected'}.` });
            fetchCourses();
            setSelectedCourse(null);
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Action failed.' });
        } finally {
            setActionLoading(null);
            setTimeout(() => setMessage(null), 5000);
        }
    };

    const filteredCourses = courses.filter(c => 
        c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.faculty?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-20">
            {}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="text-left">
                    <h1 className="text-3xl font-black text-slate-900 italic">Academic Catalog Control</h1>
                    <p className="text-slate-500 font-medium">Review and moderate courses submitted by your faculty members.</p>
                </div>
                
                <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
                    <button 
                        onClick={() => setActiveTab('pending')}
                        className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'pending' ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' : 'text-slate-400 hover:text-primary-600'}`}
                    >
                        <Clock className="w-3.5 h-3.5" /> Pending ({activeTab === 'pending' ? filteredCourses.length : '...'})
                    </button>
                    <button 
                        onClick={() => setActiveTab('approved')}
                        className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'approved' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'text-slate-400 hover:text-emerald-600'}`}
                    >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                    </button>
                </div>
            </div>

            {message && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-bold border ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                    <AlertCircle className="w-5 h-5" />
                    {message.text}
                </motion.div>
            )}

            {}
            <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search by course title or instructor name..."
                    className="w-full pl-14 pr-6 py-5 bg-white border-2 border-slate-100 rounded-3xl outline-none focus:border-primary-600 transition-all shadow-sm font-bold text-slate-700"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>

            {}
            {loading ? (
                <div className="py-20 flex flex-col items-center justify-center">
                    <Loader2 className="w-10 h-10 animate-spin text-primary-600 mb-4" />
                    <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs">Synchronizing Catalog...</p>
                </div>
            ) : filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course, idx) => (
                        <motion.div 
                            key={course._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all p-8 flex flex-col text-left group"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${activeTab === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                    <BookOpen className="w-7 h-7" />
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Category</span>
                                    <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-600 uppercase">
                                        {course.category || 'General'}
                                    </span>
                                </div>
                            </div>

                            <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight group-hover:text-primary-600 transition-colors">{course.title}</h3>
                            <p className="text-sm font-bold text-slate-400 mb-6 flex items-center gap-2">
                                <span className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center text-primary-600 font-black text-[10px]">{course.faculty?.name?.[0]}</span>
                                {course.faculty?.name || 'Unknown Faculty'}
                            </p>

                            <div className="space-y-3 mb-8 flex-1">
                                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {course.duration || 'Self-paced'}</span>
                                    <span className="flex items-center gap-1.5 capitalize"><Filter className="w-3.5 h-3.5" /> {course.difficulty}</span>
                                </div>
                                <p className="text-xs text-slate-500 line-clamp-2 italic leading-relaxed">
                                    {course.description || 'No description provided by faculty.'}
                                </p>
                            </div>

                            <div className="pt-6 border-t border-slate-50 flex items-center justify-between gap-4">
                                <button 
                                    onClick={() => setSelectedCourse(course)}
                                    className="p-3 text-slate-400 hover:text-primary-600 hover:bg-slate-50 rounded-xl transition-all"
                                    title="View Detailed Syllabus"
                                >
                                    <Info className="w-5 h-5" />
                                </button>
                                
                                <div className="flex items-center gap-2">
                                    {activeTab === 'pending' ? (
                                        <>
                                            <button 
                                                disabled={!!actionLoading}
                                                onClick={() => handleStatusUpdate(course._id, 'approved')}
                                                className="flex-1 bg-primary-600 text-white px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 disabled:opacity-50 flex items-center gap-2"
                                            >
                                                {actionLoading === course._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><CheckCircle2 className="w-3.5 h-3.5" /> Approve</>}
                                            </button>
                                            <button 
                                                disabled={!!actionLoading}
                                                onClick={() => handleStatusUpdate(course._id, 'rejected')}
                                                className="p-3 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                                title="Reject Course"
                                            >
                                                <XCircle className="w-5 h-5" />
                                            </button>
                                        </>
                                    ) : (
                                        <button 
                                            disabled={!!actionLoading}
                                            onClick={() => handleStatusUpdate(course._id, 'pending')}
                                            className="px-5 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                                        >
                                            Move to Pending
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="py-32 bg-white rounded-[3rem] border-4 border-dashed border-slate-50 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-200">
                        <BookOpen className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 italic mb-2">Clear Horizon</h3>
                    <p className="text-slate-500 font-medium">There are currently no {activeTab} courses for your institution.</p>
                </div>
            )}

            {}
            <AnimatePresence>
                {selectedCourse && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setSelectedCourse(null)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
                        
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
                            className="bg-white rounded-[3rem] p-10 max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto no-scrollbar scroll-smooth"
                        >
                            <div className="flex justify-between items-start mb-8">
                                <div className="text-left">
                                    <h2 className="text-2xl font-black text-slate-900 italic mb-1">{selectedCourse.title}</h2>
                                    <p className="text-xs font-black text-primary-600 uppercase tracking-widest">{selectedCourse.category} • {selectedCourse.difficulty}</p>
                                </div>
                                <button onClick={() => setSelectedCourse(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                                    <XCircle className="w-6 h-6 text-slate-400" />
                                </button>
                            </div>

                            <section className="mb-8 text-left">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Academic Rationale</h4>
                                <p className="text-sm text-slate-600 font-medium leading-relaxed italic border-l-4 border-primary-500 pl-4 py-1">
                                    {selectedCourse.description}
                                </p>
                            </section>

                            <section className="mb-10 text-left">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Curriculum Structure</h4>
                                <div className="space-y-4">
                                    {selectedCourse.syllabus?.length > 0 ? selectedCourse.syllabus.map((m: any, i: number) => (
                                        <div key={i} className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                            <h5 className="font-black text-slate-800 text-sm mb-2 flex items-center gap-2">
                                                <span className="w-6 h-6 bg-white rounded flex items-center justify-center text-[10px] text-primary-600 border border-slate-200">{i + 1}</span>
                                                {m.title}
                                            </h5>
                                            <ul className="space-y-1.5">
                                                {m.lessons?.map((l: string, idx: number) => (
                                                    <li key={idx} className="text-xs font-bold text-slate-500 flex items-center gap-2 pl-8">
                                                        <div className="w-1.5 h-1.5 bg-primary-400 rounded-full" /> {l}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )) : (
                                        <div className="p-10 text-center border-2 border-dashed border-slate-100 rounded-3xl text-slate-400 text-xs font-black uppercase italic">
                                            No explicit syllabus mapped.
                                        </div>
                                    )}
                                </div>
                            </section>

                            {selectedCourse.status === 'pending' && (
                                <div className="flex gap-4">
                                    <button 
                                        onClick={() => handleStatusUpdate(selectedCourse._id, 'approved')}
                                        className="flex-1 bg-primary-600 text-white py-4 rounded-xl font-black uppercase text-xs tracking-[0.2em] hover:bg-primary-700 transition-all shadow-xl shadow-primary-200"
                                    >
                                        Authorize Content
                                    </button>
                                    <button 
                                        onClick={() => handleStatusUpdate(selectedCourse._id, 'rejected')}
                                        className="flex-1 bg-slate-900 text-white py-4 rounded-xl font-black uppercase text-xs tracking-[0.2em] hover:bg-slate-800 transition-all"
                                    >
                                        Request Refinement
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};


