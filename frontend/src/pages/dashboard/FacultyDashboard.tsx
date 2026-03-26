import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    BookOpen, Users, Activity, TrendingUp,
    Plus, Loader2, ChevronRight, GraduationCap,
    Clock, Award, Bell
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';

const StatWidget = ({ icon: Icon, label, value, color, delay }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 flex items-center gap-6 hover:shadow-xl hover:-translate-y-1 transition-all group"
    >
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
            <Icon className="w-8 h-8" />
        </div>
        <div>
            <p className="text-3xl font-black text-slate-900 leading-none">{value}</p>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-2">{label}</p>
        </div>
    </motion.div>
);

const SectionHeader = ({ icon: Icon, title, link, linkText }: any) => (
    <div className="flex items-center justify-between mb-6 px-2">
        <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-xl"><Icon className="w-5 h-5" /></div>
            {title}
        </h3>
        {link && (
            <Link to={link} className="text-xs font-black text-primary-600 uppercase tracking-widest hover:underline flex items-center gap-1">
                {linkText} <ChevronRight className="w-3 h-3" />
            </Link>
        )}
    </div>
);

const FacultyDashboard = () => {
    const { user } = useAuth();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await api.get('/faculty/dashboard');
                setData(res.data);
            } catch (error) {
                console.error('Error fetching faculty dashboard:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) return (
        <div className="h-full flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
        </div>
    );

    const {
        totalCourses,
        totalStudents,
        activeStudentsToday,
        recentSubmissions,
        facultyNotifications,
        upcomingDeadlines,
        progressStats
    } = data || {};

    return (
        <div className="space-y-10 pb-20 max-w-7xl mx-auto">
            {}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900 rounded-[3.5rem] p-12 relative overflow-hidden shadow-2xl shadow-primary-900/20"
            >
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-600/20 via-transparent to-transparent opacity-50" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-10">
                    <div className="w-28 h-28 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-[2.5rem] flex items-center justify-center text-4xl font-black text-white shadow-xl shadow-indigo-900/40 border-4 border-white/10">
                        {user?.name?.charAt(0)}
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl md:text-5xl font-black text-white italic">Welcome, Prof. {user?.name?.split(' ')[0]}!</h1>
                            <div className="px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Academic Lead</span>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-400 font-bold">
                            <span className="flex items-center gap-2"><GraduationCap className="w-5 h-5 text-indigo-400" /> {user?.department || 'Department of Science'}</span>
                            <span className="flex items-center gap-2 text-indigo-400 underline underline-offset-4 font-black">
                                {user?.collegeId?.name || 'College/University'}
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatWidget icon={BookOpen} label="Courses Created" value={totalCourses} color="bg-blue-50 text-blue-600" delay={0.1} />
                <StatWidget icon={Users} label="Students Enrolled" value={totalStudents} color="bg-emerald-50 text-emerald-600" delay={0.2} />
                <StatWidget icon={Activity} label="Active Pulses" value={activeStudentsToday} color="bg-amber-50 text-amber-600" delay={0.3} />
                <StatWidget icon={Award} label="Avg Mastery" value="72%" color="bg-purple-50 text-purple-600" delay={0.4} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {}
                <div className="lg:col-span-8 space-y-10">
                    {}
                    <div>
                        <SectionHeader icon={TrendingUp} title="Course Progress Analytics" link="/dashboard/faculty/courses" linkText="Full Audit" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {progressStats?.map((course: any, idx: number) => (
                                <motion.div
                                    key={course.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                {course.title.charAt(0)}
                                            </div>
                                            <div className="text-right">
                                                <span className="text-2xl font-black text-slate-900 italic">{course.avgProgress}%</span>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Avg Mastery</p>
                                            </div>
                                        </div>
                                        <h4 className="font-black text-slate-900 mb-1 leading-tight group-hover:text-indigo-600 transition-colors uppercase text-sm tracking-wide">{course.title}</h4>
                                        <p className="text-xs text-slate-400 font-bold mb-6">{course.enrolled} Enrolled Analysts</p>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${course.avgProgress}%` }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                                className="h-full rounded-full bg-indigo-600"
                                            />
                                        </div>
                                        <Link to={`/dashboard/faculty/courses/${course.id}`} className="flex items-center justify-center w-full py-2 bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest rounded-xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                                            Enter Command Center
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {}
                    <div>
                        <SectionHeader icon={Activity} title="Engagement Pulse (Student Activity Summary)" link="/dashboard/faculty/students" linkText="View All Pulses" />
                        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50">
                            {recentSubmissions?.length > 0 ? (
                                recentSubmissions.map((sub: any, idx: number) => (
                                    <div key={idx} className="p-6 hover:bg-slate-50 transition-all flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all font-black">
                                                {sub.studentName.charAt(0)}
                                            </div>
                                            <div>
                                                <h5 className="text-sm font-black text-slate-900 italic">{sub.studentName}</h5>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    {sub.studentBranch} · Submitted Assignment
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">COMPLETED</span>
                                            <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">{new Date(sub.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-20 text-center text-slate-300 font-black text-xs uppercase tracking-[0.2em] italic">
                                    Scanning for active signals... No recent pulses detected.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {}
                <div className="lg:col-span-4 space-y-10">
                    {}
                    <div>
                        <SectionHeader icon={Bell} title="Academic Radar" link="/dashboard/notifications" linkText="Alert Center" />
                        <div className="space-y-4">
                            {facultyNotifications?.length > 0 ? (
                                facultyNotifications.map((note: any, idx: number) => (
                                    <motion.div
                                        key={note.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className={`p-6 rounded-[2.5rem] border ${note.read ? 'bg-white border-slate-100' : 'bg-indigo-50/50 border-indigo-100 ring-2 ring-indigo-50'} flex gap-4 group transition-all`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${note.read ? 'bg-slate-100 text-slate-400' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'}`}>
                                            <Bell className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className={`text-xs leading-relaxed ${note.read ? 'text-slate-500' : 'text-slate-900 font-bold'}`}>{note.message}</p>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">{new Date(note.date).toLocaleDateString()}</p>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Radar Silent. No new alerts.
                                </div>
                            )}
                        </div>
                    </div>

                    {}
                    <div>
                        <SectionHeader icon={Clock} title="Task Horizon" />
                        <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-2xl shadow-slate-900/40">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/10 blur-3xl group-hover:scale-150 transition-transform" />
                            <div className="relative z-10 space-y-8">
                                {upcomingDeadlines?.length > 0 ? (
                                    upcomingDeadlines.map((item: any, idx: number) => (
                                        <div key={idx} className="flex gap-4 group/item">
                                            <div className="flex flex-col items-center">
                                                <div className="w-2.5 h-2.5 rounded-full bg-primary-500 shadow-[0_0_15px_rgba(37,99,235,0.8)]" />
                                                <div className="w-px h-full bg-white/10 my-2" />
                                            </div>
                                            <div className="flex-1 pb-4">
                                                <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest">
                                                    {new Date(item.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </p>
                                                <h4 className="font-bold text-sm mt-1 decoration-primary-500 group-hover/item:underline underline-offset-4">{item.title}</h4>
                                                <p className="text-[11px] text-slate-400 font-medium italic">{item.courseTitle}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10 opacity-40">
                                        <p className="text-[10px] font-black uppercase tracking-widest">Clear Horizons Detected</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {}
                    <div className="grid grid-cols-2 gap-4">
                        <Link to="/dashboard/faculty/announcements" className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm text-center hover:bg-slate-900 hover:text-white transition-all group">
                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mx-auto mb-3 group-hover:bg-primary-600 group-hover:text-white transition-all">
                                <Plus className="w-5 h-5" />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest">Broadcast</span>
                        </Link>
                        <Link to="/dashboard/faculty/placement" className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm text-center hover:bg-slate-900 hover:text-white transition-all group">
                            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mx-auto mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest">Placement</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FacultyDashboard;
