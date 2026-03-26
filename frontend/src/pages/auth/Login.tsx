import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    GraduationCap, Lock, Mail, Loader2, AlertCircle,
    Users, Building2, ArrowLeft, ChevronRight, BookOpen, Briefcase, User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';

type PathType = null | 'users' | 'colleges';
type UserRole = 'STUDENT' | 'FACULTY' | 'RECRUITER';

const Login = () => {
    const [path, setPath] = useState<PathType>(null);
    const [selectedRole, setSelectedRole] = useState<UserRole>('STUDENT');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [stats, setStats] = useState({ colleges: '100+', students: '50k+', recruiters: '1k+' });
    const navigate = useNavigate();
    const { login } = useAuth();

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/colleges/public-stats');
                const { colleges, students, recruiters } = response.data;
                setStats({
                    colleges: colleges > 0 ? `${colleges}` : '0',
                    students: students > 0 ? (students >= 1000 ? `${(students / 1000).toFixed(1)}k+` : `${students}`) : '0',
                    recruiters: recruiters > 0 ? `${recruiters}` : '0'
                });
            } catch (error) {
                console.error('Error fetching platform stats:', error);
            }
        };
        fetchStats();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, user } = response.data;
            login(token, user);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const userRoles = [
        { id: 'STUDENT' as UserRole, label: 'Student', icon: BookOpen, desc: 'Learn & Grow', color: 'from-blue-500 to-indigo-600' },
        { id: 'FACULTY' as UserRole, label: 'Faculty', icon: User, desc: 'Teach & Guide', color: 'from-violet-500 to-purple-600' },
        { id: 'RECRUITER' as UserRole, label: 'Recruiter', icon: Briefcase, desc: 'Hire Talent', color: 'from-emerald-500 to-teal-600' },
    ];

    const formVariants = {
        hidden: { opacity: 0, x: 40 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
        exit: { opacity: 0, x: -40, transition: { duration: 0.3 } }
    };

    return (
        <div className="min-h-screen flex bg-white overflow-hidden">
            {}
            <div className="w-full lg:w-[48%] flex flex-col justify-center p-8 md:p-12 lg:p-16 relative">
                {}
                <div className="flex items-center gap-4 mb-12 transform scale-110 origin-left">
                    <div className="w-16 h-16 bg-primary-600 rounded-3xl flex items-center justify-center shadow-xl shadow-primary-200">
                        <GraduationCap className="w-10 h-10 text-white" />
                    </div>
                    <span className="text-4xl font-black text-slate-900 tracking-tight">UniLearnHub</span>
                </div>

                <div className="max-w-md w-full mx-auto">
                    <AnimatePresence mode="wait">

                        {}
                        {path === null && (
                            <motion.div key="selection" variants={formVariants} initial="hidden" animate="visible" exit="exit">
                                <h1 className="text-4xl font-black text-slate-900 mb-2">Welcome Back</h1>
                                <p className="text-slate-500 mb-10 text-lg font-medium">Select how you'd like to sign in.</p>

                                <div className="space-y-4">
                                    <button
                                        onClick={() => setPath('users')}
                                        className="w-full flex items-center justify-between p-6 bg-slate-900 text-white rounded-2xl hover:bg-primary-600 transition-all group shadow-xl shadow-slate-200 active:scale-[0.98]"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                                                <Users className="w-6 h-6" />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-black text-lg">Users</p>
                                                <p className="text-white/60 text-sm font-medium">Student · Faculty · Recruiter</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-white/60 group-hover:translate-x-1 transition-transform" />
                                    </button>

                                    <button
                                        onClick={() => setPath('colleges')}
                                        className="w-full flex items-center justify-between p-6 bg-white border-2 border-slate-100 text-slate-900 rounded-2xl hover:border-primary-600 hover:bg-primary-50/30 transition-all group shadow-sm active:scale-[0.98]"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                                                <Building2 className="w-6 h-6 text-slate-600" />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-black text-lg">Colleges</p>
                                                <p className="text-slate-400 text-sm font-medium">College Administrator</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>

                            </motion.div>
                        )}

                        {/* ── STEP 2A: USERS LOGIN ── */}
                        {path === 'users' && (
                            <motion.div key="users-form" variants={formVariants} initial="hidden" animate="visible" exit="exit">
                                <button onClick={() => { setPath(null); setError(''); }} className="flex items-center gap-2 text-slate-400 hover:text-slate-700 font-bold mb-8 group transition-colors">
                                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                    Back
                                </button>
                                <h1 className="text-4xl font-black text-slate-900 mb-2">User Sign In</h1>
                                <p className="text-slate-500 mb-8 text-base font-medium">Select your role and enter credentials.</p>

                                {/* Role Selector */}
                                <div className="grid grid-cols-3 gap-3 mb-8">
                                    {userRoles.map(role => (
                                        <button
                                            key={role.id}
                                            type="button"
                                            onClick={() => setSelectedRole(role.id)}
                                            className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all gap-2 ${selectedRole === role.id
                                                ? 'border-primary-600 bg-primary-50/60 shadow-md shadow-primary-100'
                                                : 'border-slate-100 bg-white hover:border-slate-200'
                                                }`}
                                        >
                                            <role.icon className={`w-6 h-6 ${selectedRole === role.id ? 'text-primary-600' : 'text-slate-400'}`} />
                                            <span className={`text-xs font-black ${selectedRole === role.id ? 'text-slate-900' : 'text-slate-500'}`}>{role.label}</span>
                                        </button>
                                    ))}
                                </div>

                                {error && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-medium">
                                        <AlertCircle className="w-5 h-5 shrink-0" />
                                        {error}
                                    </motion.div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                                        <input 
                                            name="email"
                                            type="email" 
                                            autoComplete="username"
                                            required 
                                            placeholder="Email address" 
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary-600 outline-none text-slate-900 font-medium transition-all" 
                                            value={email} 
                                            onChange={e => setEmail(e.target.value)} 
                                        />
                                    </div>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                                        <input 
                                            name="password"
                                            type="password" 
                                            autoComplete="current-password"
                                            required 
                                            placeholder="Password" 
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary-600 outline-none text-slate-900 font-medium transition-all" 
                                            value={password} 
                                            onChange={e => setPassword(e.target.value)} 
                                        />
                                    </div>
                                    <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-primary-600 active:scale-[0.98] transition-all shadow-xl shadow-slate-200 flex items-center justify-center disabled:opacity-70">
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : `Sign in as ${selectedRole.charAt(0) + selectedRole.slice(1).toLowerCase()}`}
                                    </button>
                                    <div className="text-right">
                                        <Link to="/forgot-password" className="text-sm text-primary-600 font-bold hover:underline">Forgot Password?</Link>
                                    </div>
                                </form>

                                <div className="mt-8 text-center">
                                    <p className="text-sm font-medium text-slate-400">
                                        New member? <Link to="/register" className="text-primary-600 font-bold hover:underline">Request Access</Link>
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* ── STEP 2B: COLLEGES LOGIN ── */}
                        {path === 'colleges' && (
                            <motion.div key="colleges-form" variants={formVariants} initial="hidden" animate="visible" exit="exit">
                                <button onClick={() => { setPath(null); setError(''); }} className="flex items-center gap-2 text-slate-400 hover:text-slate-700 font-bold mb-8 group transition-colors">
                                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                    Back
                                </button>

                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                                        <Building2 className="w-5 h-5 text-slate-700" />
                                    </div>
                                    <h1 className="text-4xl font-black text-slate-900">College Admin</h1>
                                </div>
                                <p className="text-slate-500 mb-8 text-base font-medium">Sign in to manage your institution.</p>

                                {error && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-medium">
                                        <AlertCircle className="w-5 h-5 shrink-0" />
                                        {error}
                                    </motion.div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                                        <input 
                                            name="email"
                                            type="email" 
                                            autoComplete="username"
                                            required 
                                            placeholder="Institutional email" 
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary-600 outline-none text-slate-900 font-medium transition-all" 
                                            value={email} 
                                            onChange={e => setEmail(e.target.value)} 
                                        />
                                    </div>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                                        <input 
                                            name="password"
                                            type="password" 
                                            autoComplete="current-password"
                                            required 
                                            placeholder="Password" 
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary-600 outline-none text-slate-900 font-medium transition-all" 
                                            value={password} 
                                            onChange={e => setPassword(e.target.value)} 
                                        />
                                    </div>
                                    <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 active:scale-[0.98] transition-all shadow-xl shadow-slate-200 flex items-center justify-center disabled:opacity-70">
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign in to Dashboard'}
                                    </button>
                                    <div className="text-right">
                                        <Link to="/forgot-password" className="text-sm text-primary-600 font-bold hover:underline">Forgot Password?</Link>
                                    </div>
                                </form>

                                <div className="mt-8 text-center">
                                    <p className="text-sm text-slate-400 font-medium">New institution? <Link to="/register-college" className="text-primary-600 font-bold hover:underline">Register Your College</Link></p>
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>

                {/* Hidden Admin Link */}
                {path === null && (
                    <div className="mt-12 text-center">
                        <Link to="/central-admin-portal" className="text-xs text-slate-200 hover:text-slate-400 transition-colors font-medium">
                            System Access
                        </Link>
                    </div>
                )}
            </div>

            {/* Right Side: Visual */}
            <div className="hidden lg:block lg:w-[52%] relative overflow-hidden bg-slate-900">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600/40 to-slate-900/90" />
                <img src="/login-bg.png" alt="Background" className="w-full h-full object-cover mix-blend-overlay opacity-60" />

                <div className="absolute inset-0 flex flex-col justify-end p-20 z-10">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="max-w-xl">
                        <div className="flex gap-3 mb-8">
                            {['Users', 'Colleges', 'Admins'].map((tag) => (
                                <span key={tag} className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white/80 text-xs font-bold rounded-full border border-white/10">{tag}</span>
                            ))}
                        </div>
                        <h2 className="text-5xl font-black text-white mb-6 leading-tight">Elevate Your Institution with <span className="text-primary-400">UniLearnHub</span>.</h2>
                        <div className="flex gap-12 text-white/70 font-medium font-inter">
                            <div><p className="text-3xl font-black text-white mb-1 tracking-tight">{stats.colleges}+</p><p className="text-sm uppercase tracking-widest font-black text-white/40">Colleges</p></div>
                            <div><p className="text-3xl font-black text-white mb-1 tracking-tight">{stats.students}+</p><p className="text-sm uppercase tracking-widest font-black text-white/40">Students</p></div>
                            <div><p className="text-3xl font-black text-white mb-1 tracking-tight">{stats.recruiters}+</p><p className="text-sm uppercase tracking-widest font-black text-white/40">Recruiters</p></div>
                        </div>
                    </motion.div>
                </div>

                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary-500/20 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] left-[10%] w-[300px] h-[300px] bg-indigo-500/20 blur-[100px] rounded-full animate-pulse [animation-delay:2s]" />
            </div>
        </div>
    );
};

export default Login;
