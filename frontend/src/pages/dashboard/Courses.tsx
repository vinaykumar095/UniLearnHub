import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen, Search, GraduationCap, Loader2, CheckCircle2,
    Star, Clock, ChevronRight, X, Info,
    Layers, Users, TrendingUp, Calendar, Zap, List
} from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';

const Courses = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState<any[]>([]);
    const [enrolledIds, setEnrolledIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [enrollingId, setEnrollingId] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeLevel, setActiveLevel] = useState('All');
    const [sortBy, setSortBy] = useState('createdAt'); 
    const [message, setMessage] = useState('');
    const [selectedCourse, setSelectedCourse] = useState<any>(null);

    const categories = ['All', 'Development', 'Design', 'Business', 'Marketing', 'Data Science'];
    const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

    useEffect(() => {
        const load = async () => {
            try {
                const [coursesRes] = await Promise.all([api.get('/courses')]);
                setCourses(coursesRes.data);
                if (user?.role === 'STUDENT') {
                    const enrolled = await api.get('/courses/enrolled');
                    setEnrolledIds(new Set(enrolled.data.map((c: any) => c?._id?.toString() || c?.id?.toString())));
                }
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        load();
    }, [user]);

    const handleEnroll = async (courseId: string) => {
        setEnrollingId(courseId);
        try {
            await api.post('/courses/enroll', { courseId });
            setEnrolledIds(prev => new Set([...prev, courseId]));
            setMessage('Successfully enrolled! 🎉');
            
            const coursesRes = await api.get('/courses');
            setCourses(coursesRes.data);
            setTimeout(() => setMessage(''), 3000);
        } catch (e: any) {
            setMessage(e.response?.data?.message || 'Enrollment failed.');
            setTimeout(() => setMessage(''), 3000);
        } finally { setEnrollingId(null); }
    };

    const filteredAndSorted = courses
        .filter(c => {
            const matchesSearch = c.title?.toLowerCase().includes(search.toLowerCase()) ||
                c.faculty?.name?.toLowerCase().includes(search.toLowerCase()) ||
                c.college?.name?.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = activeCategory === 'All' || c.category === activeCategory;
            const matchesLevel = activeLevel === 'All' || c.difficulty === activeLevel;
            return matchesSearch && matchesCategory && matchesLevel;
        })
        .sort((a, b) => {
            if (sortBy === 'enrollmentCount') return (b.enrollmentCount || 0) - (a.enrollmentCount || 0);
            if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

    const getDifficultyColor = (diff: string) => {
        switch (diff) {
            case 'Beginner': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'Intermediate': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'Advanced': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>;

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-20">
            {}
            <div className="bg-slate-900 rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/20 blur-[100px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 blur-[80px] translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="flex-1">
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-primary-500/10 border border-primary-500/20 rounded-full text-primary-400 font-bold text-xs uppercase tracking-widest mb-4">
                            <Zap className="w-3 h-3" /> Skill Up Now
                        </motion.div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-2">Build Your Excellence</h1>
                        <p className="text-slate-400 font-medium text-lg max-w-xl">Join thousands of students learning world-class skills from accredited institutions.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 text-center">
                            <div className="text-3xl font-black text-white mb-1">{courses.length}</div>
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Courses</div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 text-center">
                            <div className="text-3xl font-black text-primary-400 mb-1">{courses.reduce((acc, curr) => acc + (curr.enrollmentCount || 0), 0)}</div>
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Enrolled</div>
                        </div>
                    </div>
                </div>
            </div>

            {}
            <AnimatePresence>
                {message && (
                    <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 p-4 bg-slate-900 text-white rounded-2xl text-sm font-black border border-white/10 flex items-center gap-3 shadow-2xl backdrop-blur-xl">
                        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-white" />
                        </div>
                        {message}
                    </motion.div>
                )}
            </AnimatePresence>

            {}
            <div className="space-y-6 sticky top-0 z-20 bg-slate-50/80 backdrop-blur-md py-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-[2]">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input type="text" placeholder="Search for courses, tools, or instructors..."
                            className="w-full pl-14 pr-6 py-5 bg-white border-2 border-slate-100 rounded-3xl outline-none focus:border-primary-500 transition-all shadow-xl shadow-slate-200/50 font-bold text-slate-800 placeholder:text-slate-400 focus:ring-8 focus:ring-primary-100/30"
                            value={search} onChange={e => setSearch(e.target.value)} />
                    </div>

                    <div className="flex flex-1 gap-4">
                        <div className="relative flex-1 group">
                            <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <select
                                value={sortBy} onChange={e => setSortBy(e.target.value)}
                                className="w-full pl-11 pr-4 py-5 bg-white border-2 border-slate-100 rounded-3xl outline-none focus:border-primary-500 appearance-none font-black text-sm text-slate-700 shadow-xl shadow-slate-200/50 cursor-pointer">
                                <option value="createdAt">Latest Added</option>
                                <option value="enrollmentCount">Popularity</option>
                                <option value="rating">Top Rated</option>
                            </select>
                        </div>
                        <div className="relative flex-1">
                            <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <select
                                value={activeLevel} onChange={e => setActiveLevel(e.target.value)}
                                className="w-full pl-11 pr-4 py-5 bg-white border-2 border-slate-100 rounded-3xl outline-none focus:border-primary-500 appearance-none font-black text-sm text-slate-700 shadow-xl shadow-slate-200/50 cursor-pointer">
                                {levels.map(l => <option key={l} value={l}>{l === 'All' ? 'All Levels' : l}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
                    {categories.map(cat => (
                        <button key={cat} onClick={() => setActiveCategory(cat)}
                            className={`px-8 py-4 rounded-2xl font-black text-xs transition-all whitespace-nowrap border-2 uppercase tracking-widest ${activeCategory === cat
                                ? 'bg-primary-600 text-white border-primary-600 shadow-xl shadow-primary-200'
                                : 'bg-white text-slate-500 border-slate-50 hover:border-slate-200 shadow-sm'}`}>
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredAndSorted.map((course, i) => {
                    const isEnrolled = enrolledIds.has(course.id?.toString() || course._id?.toString());
                    return (
                        <motion.div key={course.id || course._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => setSelectedCourse(course)}
                            className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-primary-100/30 transition-all duration-500 group relative flex flex-col h-full cursor-pointer">

                            {}
                            <div className="h-48 bg-slate-50 flex items-center justify-center relative overflow-hidden rounded-t-[2.5rem]">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary-600/5 to-indigo-600/5 group-hover:opacity-100 transition-opacity duration-700" />
                                <BookOpen className="w-16 h-16 text-slate-200 group-hover:scale-125 group-hover:text-primary-400 transition-all duration-700 ease-out" />

                                {}
                                <div className="absolute top-5 left-5">
                                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border-2 shadow-sm ${getDifficultyColor(course.difficulty || 'Beginner')}`}>
                                        {course.difficulty || 'Beginner'}
                                    </span>
                                </div>

                                {isEnrolled && (
                                    <div className="absolute top-5 right-5 bg-green-500 text-white text-[10px] font-black px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-lg shadow-green-200/50 uppercase tracking-widest">
                                        <CheckCircle2 className="w-3 h-3" /> Enrolled
                                    </div>
                                )}

                                <div className="absolute bottom-4 left-5 flex items-center gap-2">
                                    <div className="bg-white/80 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 text-[10px] font-black text-slate-700 shadow-sm">
                                        <Users className="w-3 h-3 text-primary-500" /> {(course.enrollmentCount || 0).toLocaleString()}
                                    </div>
                                    <div className="bg-white/80 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 text-[10px] font-black text-amber-600 shadow-sm">
                                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {course.rating || '4.5'}
                                    </div>
                                </div>
                            </div>

                            {}
                            <div className="p-8 flex flex-col flex-1">
                                <div className="mb-4 flex-1">
                                    <h3 className="font-black text-slate-900 text-xl leading-snug group-hover:text-primary-600 transition-colors line-clamp-2 min-h-[3.5rem] mb-2">{course.title}</h3>
                                    <p className="text-sm text-slate-400 font-bold flex items-center gap-1.5">
                                        <GraduationCap className="w-4 h-4 text-slate-300" /> {course.faculty?.name || 'Instructor'} • {course.college?.name || 'Partner College'}
                                    </p>
                                </div>

                                {}
                                <div className="grid grid-cols-2 gap-4 mb-6 pt-6 border-t border-slate-50">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                                            <Clock className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <span className="text-xs font-black text-slate-700">{course.duration || '12.5 hrs'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                                            <Layers className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <span className="text-xs font-black text-slate-700">{course.difficulty || 'Beginner'}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-4 mt-auto">
                                    <span className="text-xs font-black text-primary-600 uppercase tracking-widest flex items-center gap-1">View Details <ChevronRight className="w-3 h-3" /></span>
                                    <div className="w-10 h-10 rounded-full border-2 border-slate-100 flex items-center justify-center group-hover:bg-primary-600 group-hover:border-primary-600 group-hover:text-white transition-all">
                                        <Info className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {}
            <AnimatePresence>
                {selectedCourse && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setSelectedCourse(null)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" />

                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row">

                            <button onClick={() => setSelectedCourse(null)}
                                className="absolute top-6 right-6 z-10 p-3 bg-white/10 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-900 shadow-xl">
                                <X className="w-6 h-6" />
                            </button>

                            {}
                            <div className="md:w-2/5 p-10 bg-slate-50 overflow-y-auto custom-scrollbar">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 border border-primary-200 rounded-full text-primary-700 font-bold text-[10px] uppercase tracking-widest mb-6">
                                    {selectedCourse.category || 'Course Overview'}
                                </div>
                                <h2 className="text-3xl font-black text-slate-900 leading-tight mb-4">{selectedCourse.title}</h2>
                                <p className="text-slate-500 font-medium mb-8 leading-relaxed">{selectedCourse.description || 'Elevate your professional career with this comprehensive curriculum designed by industry experts.'}</p>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                        <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                                            <Calendar className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration</div>
                                            <div className="text-sm font-black text-slate-900">{selectedCourse.duration || 'Self-paced (approx 12h)'}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                        <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                                            <Star className="w-6 h-6 fill-amber-500" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rating</div>
                                            <div className="text-sm font-black text-slate-900">{selectedCourse.rating || '4.8'} (Customer Feedback)</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                                            <Users className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enrollments</div>
                                            <div className="text-sm font-black text-slate-900">{selectedCourse.enrollmentCount || 0} Students learning</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10 pt-8 border-t border-slate-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-primary-600 text-white rounded-xl flex items-center justify-center font-black text-xl">
                                            {selectedCourse.faculty?.name?.[0]}
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Instructor</div>
                                            <div className="font-black text-slate-900">{selectedCourse.faculty?.name}</div>
                                            <div className="text-xs text-slate-500 font-bold">{selectedCourse.college?.name}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {}
                            <div className="flex-1 p-10 overflow-y-auto custom-scrollbar flex flex-col">
                                <section className="mb-10">
                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" /> What you'll learn
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-medium text-slate-600">
                                        {(selectedCourse.learningOutcomes?.length ? selectedCourse.learningOutcomes : [
                                            'Master the core fundamentals',
                                            'Build real-world projects',
                                            'Learn industry best practices',
                                            'Certificate of completion'
                                        ]).map((outcome: string, i: number) => (
                                            <div key={i} className="flex items-start gap-2">
                                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <CheckCircle2 className="w-3 h-3 text-white" />
                                                </div>
                                                {outcome}
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="mb-10 flex-1">
                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                        <List className="w-4 h-4 text-blue-500" /> Syllabus Content
                                    </h4>
                                    <div className="space-y-4">
                                        {(selectedCourse.syllabus?.length ? selectedCourse.syllabus : [
                                            { title: 'Introduction', lessons: ['Welcome to the course', 'Setting up your environment'] },
                                            { title: 'Core Concepts', lessons: ['Learning the basics', 'Advanced data structures'] },
                                            { title: 'Final Project', lessons: ['Building the application', 'Deployment strategies'] }
                                        ]).map((module: any, i: number) => (
                                            <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h5 className="font-black text-slate-800 flex items-center gap-2">
                                                        <span className="w-6 h-6 bg-white border border-slate-200 rounded flex items-center justify-center text-[10px] text-slate-400">{i + 1}</span>
                                                        {module.title}
                                                    </h5>
                                                    <span className="text-[10px] font-black text-slate-400 uppercase">{module.lessons.length} Lessons</span>
                                                </div>
                                                <div className="space-y-2">
                                                    {module.lessons.map((lesson: string, idx: number) => (
                                                        <div key={idx} className="flex items-center gap-3 text-xs font-bold text-slate-500">
                                                            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" /> {lesson}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <div className="mt-auto pt-8 border-t border-slate-100">
                                    {user?.role === 'STUDENT' ? (
                                        <button
                                            onClick={() => !enrolledIds.has(selectedCourse.id || selectedCourse._id) && handleEnroll(selectedCourse.id || selectedCourse._id)}
                                            disabled={enrolledIds.has(selectedCourse.id || selectedCourse._id) || enrollingId === (selectedCourse.id || selectedCourse._id)}
                                            className={`w-full py-5 rounded-[2rem] font-black text-lg shadow-2xl transition-all flex items-center justify-center gap-3 ${enrolledIds.has(selectedCourse.id || selectedCourse._id)
                                                ? 'bg-emerald-100 text-emerald-700 cursor-default'
                                                : 'bg-primary-600 text-white hover:bg-primary-700 shadow-primary-200'}`}
                                        >
                                            {enrollingId === (selectedCourse.id || selectedCourse._id) ? <Loader2 className="w-6 h-6 animate-spin" /> :
                                                enrolledIds.has(selectedCourse.id || selectedCourse._id)
                                                    ? <><CheckCircle2 className="w-6 h-6" /> You're Learning This!</>
                                                    : <><Zap className="w-6 h-6" /> Start Learning Now</>}
                                        </button>
                                    ) : (
                                        <div className="p-5 bg-amber-50 rounded-2xl border-2 border-amber-100 flex items-center gap-3">
                                            <Info className="w-6 h-6 text-amber-600" />
                                            <p className="text-sm font-bold text-amber-800">Note: You are viewing this as a non-student user. Students can enroll and track progress here.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {}
            {filteredAndSorted.length === 0 && (
                <div className="text-center py-32 bg-white rounded-[3rem] border-4 border-dashed border-slate-50">
                    <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                        <BookOpen className="w-12 h-12 text-slate-200" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">No Courses Spotted</h3>
                    <p className="text-slate-500 font-medium text-lg">Try adjusting your filters or search terms to find relevant courses.</p>
                </div>
            )}
        </div>
    );
};

export default Courses;
