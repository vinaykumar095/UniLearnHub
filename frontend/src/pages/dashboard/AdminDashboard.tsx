import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    BookOpen, Briefcase, TrendingUp, GraduationCap,
    CheckCircle2, Loader2, Calendar, Clock,
    ArrowUpRight, ChevronRight, Activity, Zap, Star, Target,
    Building2, Users
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import FacultyDashboard from './FacultyDashboard';
import RecruiterDashboard from './RecruiterDashboard';

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

const AdminDashboard = () => {
    const { user } = useAuth();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [velocityRange, setVelocityRange] = useState('M');

    useEffect(() => {
        const load = async () => {
            try {
                if (user?.role === 'STUDENT') {
                    const res = await api.get('/jobs/student/dashboard');
                    setData(res.data);
                } else if (user?.role === 'CENTRAL_ADMIN') {
                    const res = await api.get('/analytics/platform');
                    setData(res.data);
                } else if (user?.role === 'COLLEGE_ADMIN') {
                    const res = await api.get('/analytics/college');
                    setData(res.data);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [user]);

    if (loading) return (
        <div className="h-full flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
        </div>
    );

    if (user?.role === 'FACULTY') {
        return <FacultyDashboard />;
    }

    if (user?.role === 'RECRUITER') {
        return <RecruiterDashboard />;
    }

    if (user?.role === 'COLLEGE_ADMIN') {
        const stats = [
            { label: 'Total Students', value: data?.students || 0, icon: GraduationCap, color: 'text-blue-600', bg: 'bg-blue-50', link: '/dashboard/college/students' },
            { label: 'Active Jobs', value: data?.relevantJobs || 0, icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-50', link: '/dashboard/college/placement-oversight' },
            { label: 'Active Recruiters', value: data?.relevantRecruiters || 0, icon: Building2, color: 'text-indigo-600', bg: 'bg-indigo-50', link: '/dashboard/college/recruiters' },
            { label: 'Pending Users', value: (data?.pendingStudents || 0) + (data?.pendingFaculty || 0), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', urgent: true },
        ];

        return (
            <div className="space-y-10 pb-20 max-w-7xl mx-auto">
                {}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900 rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/20 blur-[100px]" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="w-24 h-24 bg-primary-600 rounded-[2rem] flex items-center justify-center text-3xl font-black italic shadow-xl">
                            {user?.name?.charAt(0)}
                        </div>
                        <div className="space-y-2 text-center md:text-left">
                            <h1 className="text-4xl font-black italic tracking-tight">Institutional Oversight 👋</h1>
                            <p className="text-slate-400 font-medium max-w-2xl leading-relaxed italic">
                                Welcome, {user?.name}. You are managing {user?.collegeId?.name || 'your institution'}. 
                                All academic and registration metrics are synchronized.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((s, i) => (
                        <Link key={i} to={s.link || '#'}>
                            <StatWidget icon={s.icon} label={s.label} value={s.value} color={s.bg + ' ' + s.color} delay={0.1 * i} />
                        </Link>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                        className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-black text-slate-900 flex items-center gap-3 italic text-xl">
                                <Activity className="w-6 h-6 text-primary-600" /> Approval Queue
                            </h3>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-6 bg-amber-50 rounded-2xl border border-amber-100 group-hover:bg-amber-100/50 transition-all">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-amber-600 shadow-sm">
                                    <Users className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-lg font-black text-slate-900">{data?.pendingStudents || 0}</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending Student Registrations</p>
                                </div>
                                <Link to="/dashboard/college/students" className="px-5 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary-600 transition-all">
                                    Review List
                                </Link>
                            </div>

                            <div className="flex items-center gap-4 p-6 bg-indigo-50 rounded-2xl border border-indigo-100 group-hover:bg-indigo-100/50 transition-all">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-lg font-black text-slate-900">{data?.pendingFaculty || 0}</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending Faculty Approvals</p>
                                </div>
                                <Link to="/dashboard/college/faculty" className="px-5 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary-600 transition-all">
                                    Review List
                                </Link>
                            </div>

                            <div className="flex items-center gap-4 p-6 bg-rose-50 rounded-2xl border border-rose-100 group-hover:bg-rose-100/50 transition-all">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-rose-600 shadow-sm">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-lg font-black text-slate-900">{data?.pendingCourses || 0}</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending Course Approvals</p>
                                </div>
                                <Link to="/dashboard/college/courses" className="px-5 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary-600 transition-all">
                                    Review List
                                </Link>
                            </div>
                        </div>

                        <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide leading-relaxed italic text-center">
                                New users registered under your institution will appear here for verification. 
                                Ensure you cross-verify credentials before granting system access.
                            </p>
                        </div>
                    </motion.div>

                    {}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
                        className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-black text-slate-900 flex items-center gap-3 italic text-xl">
                                <Target className="w-6 h-6 text-emerald-500" /> Academic Health
                            </h3>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                                    <span>Active Courses</span>
                                    <span className="text-primary-600">{data?.courses || 0}</span>
                                </div>
                                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} className="h-full bg-primary-600 rounded-full" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                                    <span>Faculty Engagement</span>
                                    <span className="text-emerald-600">88%</span>
                                </div>
                                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: '88%' }} className="h-full bg-emerald-500 rounded-full" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 bg-gradient-to-br from-slate-900 to-primary-900 rounded-[2rem] p-8 text-white relative overflow-hidden group">
                            <Building2 className="absolute -bottom-8 -right-8 w-32 h-32 opacity-10 group-hover:scale-125 transition-transform duration-700" />
                            <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-4 text-primary-400">System Information</h4>
                            <p className="text-sm font-medium leading-relaxed italic text-slate-300">
                                Your institution is currently operating on the {data?.collegeName || 'Institution'}-Enterprise license tier. 
                                Automatic approval for verified domain emails is OFF.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    if (user?.role === 'CENTRAL_ADMIN') {
        return (
            <div className="space-y-10 pb-20 max-w-7xl mx-auto">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    className="bg-slate-900 rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 blur-[100px]" />
                    <div className="relative z-10 space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-xl font-black italic shadow-lg shadow-indigo-900/50 uppercase tracking-widest border border-white/10">
                                OA
                            </div>
                            <h1 className="text-4xl font-black italic tracking-tight">System Access: Granted 👋</h1>
                        </div>
                        <p className="text-slate-400 font-medium max-w-2xl leading-relaxed italic">
                            Welcome, {user?.name}. You are logged into the central oversight node. All institutional data streams are active and ready for analysis.
                        </p>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatWidget icon={Building2} label="Institutions" value={data?.colleges || '0'} color="bg-indigo-50 text-indigo-600" delay={0.1} />
                    <StatWidget icon={GraduationCap} label="Total Students" value={data?.students || '0'} color="bg-blue-50 text-blue-600" delay={0.2} />
                    <StatWidget icon={Briefcase} label="Active Jobs" value={data?.jobs || '0'} color="bg-emerald-50 text-emerald-600" delay={0.3} />
                    <StatWidget icon={Zap} label="Active Drives" value={data?.placementDrives || '0'} color="bg-rose-50 text-rose-600" delay={0.4} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {}
                    <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-black text-slate-900 flex items-center gap-3 italic">
                                <Activity className="w-5 h-5 text-indigo-600" /> Enrollment Velocity
                            </h3>
                            <div className="flex bg-slate-100 p-1 rounded-xl">
                                {['D', 'W', 'M', 'Y'].map((range) => (
                                    <button
                                        key={range}
                                        onClick={() => setVelocityRange(range)}
                                        className={`px-3 py-1 rounded-lg text-[9px] font-black transition-all ${velocityRange === range ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                                    >
                                        {range}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        <div className="flex items-end justify-center mb-10 h-32">
                            <div className="text-center">
                                <motion.p 
                                    key={velocityRange}
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-6xl font-black text-slate-900 tracking-tighter"
                                >
                                    {velocityRange === 'D' ? data?.enrollmentVelocity?.daily :
                                     velocityRange === 'W' ? data?.enrollmentVelocity?.weekly :
                                     velocityRange === 'M' ? data?.enrollmentVelocity?.monthly :
                                     data?.enrollmentVelocity?.yearly}
                                </motion.p>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">New Explorers Enrolled</p>
                            </div>
                        </div>
                        
                        <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                                    <TrendingUp className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-slate-900">{data?.students || 0} Learners</p>
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Aggregate Platform Population</p>
                                </div>
                            </div>
                            <Link to="/dashboard/admin/analytics" className="text-[10px] font-black text-primary-600 uppercase tracking-widest hover:underline">Full Analytics →</Link>
                        </div>
                    </div>

                    {}
                    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-black text-slate-900 flex items-center gap-3 italic">
                                <Clock className="w-5 h-5 text-amber-500" /> Registration Activity
                            </h3>
                        </div>
                        <div className="space-y-3 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
                            {data?.registrationActivity?.map((act: any, i: number) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-indigo-200 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-[10px] italic shadow-sm ${
                                            act.role === 'RECRUITER' ? 'bg-emerald-50 text-emerald-600' : 
                                            act.role === 'FACULTY' ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'
                                        }`}>
                                            {act.role === 'RECRUITER' ? 'R' : act.role === 'FACULTY' ? 'F' : 'S'}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight truncate max-w-[120px]">{act.name}</p>
                                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{new Date(act.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest ${
                                        act.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                    }`}>
                                        {act.status}
                                    </span>
                                </div>
                            )) || (
                                <div className="text-center py-10 italic text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                                    No institution records found.
                                </div>
                            )}
                        </div>
                        <Link to="/dashboard/admin/users" className="mt-6 block w-full text-center py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all">
                            Manage All Users
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {}
                    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-black text-slate-900 flex items-center gap-3 italic">
                                <Target className="w-5 h-5 text-indigo-600" /> Institutional Pulse
                            </h3>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Branch Distribution</span>
                        </div>
                        <div className="space-y-6">
                            {(data?.institutionalPulse || []).length > 0 ? data.institutionalPulse.map((item: any, i: number) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                                        <span>{item.name}</span>
                                        <span className="text-indigo-600">{item.percentage}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }} 
                                            animate={{ width: `${item.percentage}%` }}
                                            className="h-full bg-indigo-600 rounded-full" 
                                        />
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-10 italic text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                                    No branch data aggregated yet.
                                </div>
                            )}
                        </div>
                        <div className="mt-8 pt-6 border-t border-slate-50">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide leading-relaxed italic text-center">
                                Data aggregated from {data?.activeColleges || 0} connected colleges as of {data?.aggregatedDate || new Date().toLocaleDateString()}.
                            </p>
                        </div>
                    </div>

                    {}
                    <div className="bg-gradient-to-br from-indigo-600 to-primary-900 rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-xl">
                        <Building2 className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10 group-hover:scale-125 transition-transform duration-700" />
                        <div className="relative z-10">
                            <h4 className="text-xs font-black uppercase tracking-[0.4em] mb-6 text-indigo-200">System Control Center</h4>
                            <div className="space-y-4">
                                <Link to="/dashboard/admin/colleges" className="flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/5">
                                    <span className="text-[10px] font-black uppercase tracking-widest">Approve New Institutions</span>
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                                <Link to="/dashboard/admin/users" className="flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/5">
                                    <span className="text-[10px] font-black uppercase tracking-widest">Global User Moderation</span>
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                                <div className="p-6 bg-white/5 rounded-2xl border border-dashed border-white/10 mt-6">
                                    <p className="text-[9px] font-bold text-indigo-200 uppercase tracking-wide italic leading-relaxed">
                                        Central Admin has full CRUD permissions across all institutional nodes. 
                                        All actions are logged in the secure audit trail.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const { student, stats, learningProgress, upcomingDeadlines, recentActivity, guidances } = data || {};

    return (
        <div className="space-y-10 pb-20 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900 rounded-[3.5rem] p-12 relative overflow-hidden shadow-2xl shadow-primary-900/20"
            >
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-600/20 via-transparent to-transparent opacity-50" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-10">
                    <div className="w-28 h-28 bg-gradient-to-br from-primary-400 to-primary-600 rounded-[2.5rem] flex items-center justify-center text-4xl font-black text-white shadow-xl shadow-primary-900/40 border-4 border-white/10">
                        {student?.name?.charAt(0)}
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl md:text-5xl font-black text-white italic">Welcome back, {student?.name?.split(' ')[0]}!</h1>
                            <div className="px-4 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] font-black text-green-400 uppercase tracking-[0.2em]">Active Session</span>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-400 font-bold">
                            <span className="flex items-center gap-2"><GraduationCap className="w-5 h-5 text-primary-400" /> {student?.college || 'Institution'}</span>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-4 right-12 opacity-5">
                    <Zap className="w-64 h-64 text-white" />
                </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatWidget icon={BookOpen} label="Courses Enrolled" value={stats?.enrolledCourses} color="bg-blue-50 text-blue-600" delay={0.1} />
                <StatWidget icon={CheckCircle2} label="Courses Completed" value={stats?.completedCourses} color="bg-emerald-50 text-emerald-600" delay={0.2} />
                <StatWidget icon={Clock} label="Pending Tasks" value={stats?.pendingAssignmentsCount} color="bg-amber-50 text-amber-600" delay={0.3} />
                <StatWidget icon={Briefcase} label="Job Applications" value={stats?.jobsApplied} color="bg-purple-50 text-purple-600" delay={0.4} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-10">
                    <div>
                        <SectionHeader icon={TrendingUp} title="Academic Velocity" link="/dashboard/learning" linkText="Full Analytics" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {learningProgress?.length > 0 ? (
                                learningProgress.map((course: any, idx: number) => (
                                    <motion.div
                                        key={course.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
                                    >
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-slate-400 group-hover:bg-primary-600 group-hover:text-white transition-all">
                                                {course.title.charAt(0)}
                                            </div>
                                            <span className="text-2xl font-black text-slate-900 italic">{course.progress}%</span>
                                        </div>
                                        <h4 className="font-black text-slate-900 mb-1 leading-tight group-hover:text-primary-600 transition-colors uppercase text-sm tracking-wide">{course.title}</h4>
                                        <p className="text-xs text-slate-400 font-bold mb-6">Instructor: {course.faculty || 'Unassigned'}</p>
                                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${course.progress}%` }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                                className={`h-full rounded-full ${course.progress === 100 ? 'bg-emerald-500' : 'bg-primary-600'}`}
                                            />
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="md:col-span-2 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 p-20 text-center">
                                    <GraduationCap className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                                    <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No active courses detected.</p>
                                    <Link to="/dashboard/courses" className="mt-4 inline-block px-6 py-3 bg-white border-2 border-slate-200 rounded-2xl font-black text-xs uppercase text-slate-600 hover:border-primary-600 hover:text-primary-600 transition-all">Explore Catalog</Link>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <SectionHeader icon={Calendar} title="Temporal Radar" />
                        <div className="flex overflow-x-auto pb-4 gap-6 no-scrollbar">
                            {upcomingDeadlines?.map((dl: any, idx: number) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="min-w-[280px] bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:border-red-100 transition-all"
                                >
                                    <div className={`absolute top-0 right-0 w-2 h-full ${dl.type === 'ASSIGNMENT' ? 'bg-amber-400' : 'bg-red-500'}`} />
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${dl.type === 'ASSIGNMENT' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}`}>
                                            {dl.type}
                                        </span>
                                    </div>
                                    <h4 className="font-black text-slate-900 text-sm mb-4 leading-relaxed truncate">{dl.title}</h4>
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Clock className="w-4 h-4" />
                                        <span className="text-xs font-black uppercase tracking-tight">
                                            {new Date(dl.deadline).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-10">
                    {guidances?.length > 0 && (
                        <div>
                            <SectionHeader icon={Target} title="Mentorship Intel" />
                            <div className="space-y-4">
                                {guidances.map((g: any, i: number) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group border border-slate-800"
                                    >
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary-600/20 blur-3xl group-hover:bg-primary-600/40 transition-all" />
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                                                <Zap className="w-4 h-4 text-white" />
                                            </div>
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary-400">
                                                {g.type.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <p className="text-sm font-medium leading-relaxed mb-6 italic text-slate-200">"{g.content}"</p>
                                        <div className="flex items-center justify-between border-t border-slate-800 pt-5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 bg-slate-800 rounded-md flex items-center justify-center text-[10px] font-black italic">
                                                    {g.facultyId?.name?.charAt(0)}
                                                </div>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{g.facultyId?.name}</span>
                                            </div>
                                            <Link to="/dashboard/roadmap" className="text-[9px] font-black text-primary-400 uppercase tracking-widest hover:text-white transition-all">Impact Roadmap →</Link>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <SectionHeader icon={Activity} title="Activity Pulse" />
                        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50">
                            {recentActivity?.length > 0 ? (
                                recentActivity.map((act: any, idx: number) => (
                                    <div key={idx} className="p-6 hover:bg-slate-50 transition-all flex items-start gap-4 group">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:rotate-12 ${act.type === 'QUIZ' ? 'bg-blue-50 text-blue-600' :
                                            act.type === 'APPLICATION' ? 'bg-purple-50 text-purple-600' : 'bg-emerald-50 text-emerald-600'
                                            }`}>
                                            {act.type === 'QUIZ' ? <ArrowUpRight className="w-6 h-6" /> :
                                                act.type === 'APPLICATION' ? <Zap className="w-6 h-6" /> : <Star className="w-6 h-6" />}
                                        </div>
                                        <div className="min-w-0">
                                            <h5 className="text-sm font-black text-slate-900 italic truncate">{act.title}</h5>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                                {act.type} · {new Date(act.date).toLocaleDateString()}
                                                {act.score !== undefined && ` · ${act.score}% Score`}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 text-center text-slate-400 font-black text-xs uppercase tracking-[0.2em] italic">
                                    Static Signal. No Recent Pulses.
                                </div>
                            )}
                        </div>

                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="mt-10 bg-gradient-to-br from-indigo-600 to-primary-700 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[50px] group-hover:scale-150 transition-transform" />
                            <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-4 opacity-70">Mastery Index</h4>
                            <div className="flex items-end justify-between">
                                <div className="space-y-1">
                                    <div className="text-5xl font-black italic mb-2 tracking-tighter">{stats?.masteryIndex || 0}%</div>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Overall Platform Progress</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-black italic text-primary-300">{data?.avgPlacementScore || 0}%</div>
                                    <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Avg Performance</p>
                                </div>
                            </div>
                            <Link to="/dashboard/placement" className="mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] bg-white/10 p-3 rounded-2xl text-center justify-center hover:bg-white/20 transition-all">
                                Boost Mastery
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
