import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Plus, Loader2, Edit3, X, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';

const FacultyCourses = () => {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCourse, setNewCourse] = useState({ title: '', description: '', category: 'Programming', duration: '', difficulty: 'Beginner' });
    const [creating, setCreating] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const { user } = useAuth();

    const fetchCourses = async () => {
        try {
            const response = await api.get('/courses/faculty');
            console.log('[FacultyCourses] Fetched courses:', response.data);
            setCourses(response.data);
        } catch (error) {
            console.error('[FacultyCourses] Error fetching courses:', error);
            setMessage({ type: 'error', text: 'Cloud Link failed. Ensure your connection is active.' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const [editingCourse, setEditingCourse] = useState<any>(null);

    const handleOpenModal = (course: any = null) => {
        if (course) {
            setEditingCourse(course);
            setNewCourse({
                title: course.title,
                description: course.description,
                category: course.category || 'Programming',
                duration: course.duration || '',
                difficulty: course.difficulty || 'Beginner'
            });
        } else {
            setEditingCourse(null);
            setNewCourse({ title: '', description: '', category: 'Programming', duration: '', difficulty: 'Beginner' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        setMessage(null);
        try {
            if (editingCourse) {
                await api.put(`/courses/${editingCourse._id}`, newCourse);
                setMessage({ type: 'success', text: 'Course updated successfully!' });
            } else {
                await api.post('/courses', {
                    ...newCourse,
                    collegeId: typeof user?.collegeId === 'object' ? user?.collegeId?.id || user?.collegeId?._id : user?.collegeId
                });
                setMessage({ type: 'success', text: 'Course created! It will be visible after admin approval.' });
            }
            setIsModalOpen(false);
            setNewCourse({ title: '', description: '', category: 'Programming', duration: '', difficulty: 'Beginner' });
            setEditingCourse(null);
            fetchCourses();
        } catch (error: any) {
            const errMsg = error.response?.data?.message || 'Error saving course. Please try again.';
            setMessage({ type: 'error', text: errMsg });
            console.error('Error saving course:', error);
        } finally {
            setCreating(false);
            setTimeout(() => setMessage(null), 5000);
        }
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {message && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-bold ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                    {message.text}
                </div>
            )}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 text-left">My Courses</h1>
                    <p className="text-slate-500 text-left">Manage your created courses and track student progress.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-xl shadow-lg shadow-primary-200 hover:bg-primary-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    <span className="font-semibold">Add Course</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course, index) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={course._id}
                        className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group text-left relative"
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-primary-50 rounded-xl text-primary-600">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${course.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                        {course.status || 'pending'}
                                    </span>
                                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-[9px] font-bold uppercase">
                                        {course.difficulty}
                                    </span>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-1">{course.title}</h3>
                            <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3">{course.category}</p>
                            <p className="text-sm text-slate-500 line-clamp-2 mb-6">{course.description}</p>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{course.duration}</span>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleOpenModal(course)}
                                        className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                    <Link to={`/dashboard/faculty/courses/${course._id}`} className="text-primary-600 font-bold text-xs uppercase tracking-widest hover:underline flex items-center gap-1">
                                        Manage <ChevronRight className="w-3 h-3" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-[2.5rem] p-10 max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto no-scrollbar"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-slate-900 italic">
                                {editingCourse ? 'Refine Course Details' : 'Launch New Course'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Course Title</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Advanced Machine Learning"
                                        className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary-600 transition-all outline-none font-bold shadow-sm"
                                        value={newCourse.title}
                                        onChange={e => setNewCourse({ ...newCourse, title: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Skill Category</label>
                                    <select
                                        className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary-600 transition-all outline-none font-bold shadow-sm appearance-none"
                                        value={newCourse.category}
                                        onChange={e => setNewCourse({ ...newCourse, category: e.target.value })}
                                    >
                                        <option>Programming</option>
                                        <option>Data Science</option>
                                        <option>AI & Machine Learning</option>
                                        <option>Cybersecurity</option>
                                        <option>Cloud Computing</option>
                                        <option>Mobile Dev</option>
                                        <option>UI/UX Design</option>
                                        <option>Business</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Difficulty Level</label>
                                    <select
                                        className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary-600 transition-all outline-none font-bold shadow-sm appearance-none"
                                        value={newCourse.difficulty}
                                        onChange={e => setNewCourse({ ...newCourse, difficulty: e.target.value as any })}
                                    >
                                        <option>Beginner</option>
                                        <option>Intermediate</option>
                                        <option>Advanced</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Duration (e.g. 8 Weeks)</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. 12 Weeks"
                                        className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary-600 transition-all outline-none font-bold shadow-sm"
                                        value={newCourse.duration}
                                        onChange={e => setNewCourse({ ...newCourse, duration: e.target.value })}
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Description</label>
                                    <textarea
                                        required
                                        rows={4}
                                        placeholder="Describe the course learning path..."
                                        className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary-600 transition-all outline-none resize-none font-bold shadow-sm"
                                        value={newCourse.description}
                                        onChange={e => setNewCourse({ ...newCourse, description: e.target.value })}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={creating}
                                className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-primary-600 transition-all shadow-xl shadow-slate-200 disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
                            >
                                {creating ? <Loader2 className="w-5 h-5 animate-spin" /> : editingCourse ? 'Update Metadata' : 'Launch Course'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
            {courses.length === 0 && (
                <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-dashed border-slate-200">
                    You haven't created any courses yet.
                </div>
            )}
        </div>
    );
};

export default FacultyCourses;
