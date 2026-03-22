import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, User, Loader2, AlertCircle, ArrowLeft, CheckCircle2, GraduationCap, Briefcase, Search, GraduationCap as CollegeIcon } from 'lucide-react';
import api from '../../api/client';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'STUDENT',
        collegeId: '',
        company: ''
    });
    const [colleges, setColleges] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchingColleges, setFetchingColleges] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');


    useEffect(() => {
        const fetchColleges = async () => {
            try {
                const response = await api.get('/colleges?status=active');
                setColleges(response.data);

                // Set Parul University as default if it exists
                const parul = response.data.find((c: any) => c.name.toLowerCase().includes('parul'));
                if (parul) {
                    setFormData(prev => ({ ...prev, collegeId: parul._id }));
                }
            } catch (err) {
                console.error('Error fetching colleges:', err);
            } finally {
                setFetchingColleges(false);
            }
        };
        fetchColleges();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const submissionData = {
                ...formData,
                collegeId: formData.role === 'RECRUITER' ? '' : formData.collegeId
            };
            await api.post('/auth/register', submissionData);
            setSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-white rounded-3xl shadow-xl p-12 text-center border border-slate-100"
                >
                    <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Registration Submitted!</h2>
                    <p className="text-slate-500 mb-4 text-base font-medium">
                        Your account has been created and is <span className="font-bold text-amber-600 uppercase tracking-wide">pending approval</span>.
                    </p>
                    <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                        {formData.role === 'RECRUITER' 
                            ? 'The Platform Administrator will verify your credentials. You will receive an email once access is granted.' 
                            : 'Your College/University admin will review your registration. Please wait for access to continue.'}
                    </p>
                    <Link to="/login" className="w-full inline-block bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all">
                        Go to Login
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-white overflow-hidden">
            {/* Left Side: Form */}
            <div className="w-full lg:w-[45%] flex flex-col justify-between p-8 md:p-12 lg:p-16 relative overflow-y-auto">
                <Link to="/login" className="flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors font-bold mb-8 group w-fit">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Login
                </Link>

                <div className="max-w-md w-full mx-auto pb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">Create Account</h1>
                        <p className="text-slate-500 mb-10 text-lg">Join our network of learners and recruiters.</p>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-medium"
                            >
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                                    <input
                                        name="name"
                                        type="text"
                                        autoComplete="name"
                                        required
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary-600 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-slate-900 font-medium"
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                                    <input
                                        name="email"
                                        type="email"
                                        autoComplete="username"
                                        required
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary-600 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-slate-900 font-medium"
                                        placeholder="Enter your email address"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                                    <input
                                        name="password"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        minLength={6}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary-600 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-slate-900 font-medium"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>

                            {formData.role === 'RECRUITER' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="space-y-2"
                                >
                                    <label className="text-sm font-bold text-slate-700 ml-1">Company Name</label>
                                    <div className="relative group">
                                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                                        <input
                                            type="text"
                                            required
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary-600 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-slate-900 font-medium"
                                            placeholder="Enter your company name"
                                            value={formData.company}
                                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {/* Role Selection Blocks */}
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-700 ml-1">Select Your Role</label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {[
                                        { id: 'STUDENT', label: 'Student', icon: GraduationCap, desc: 'Learn & Grow' },
                                        { id: 'FACULTY', label: 'Faculty', icon: User, desc: 'Teach & Guide' },
                                        { id: 'RECRUITER', label: 'Recruiter', icon: Briefcase, desc: 'Hire Talent' }
                                    ].map((r) => (
                                        <button
                                            key={r.id}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, role: r.id })}
                                            className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2 ${formData.role === r.id
                                                ? 'border-primary-600 bg-primary-50/50 shadow-md shadow-primary-100'
                                                : 'border-slate-100 bg-slate-50/30 hover:border-slate-200'
                                                }`}
                                        >
                                            <r.icon className={`w-6 h-6 ${formData.role === r.id ? 'text-primary-600' : 'text-slate-400'}`} />
                                            <div className="text-center">
                                                <p className={`text-sm font-bold ${formData.role === r.id ? 'text-slate-900' : 'text-slate-500'}`}>{r.label}</p>
                                                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">{r.desc}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* College Selection Grid */}
                            {formData.role !== 'RECRUITER' && (
                                <div className="space-y-4 transition-all duration-500">
                                    <div className="flex items-center justify-between ml-1">
                                        <label className="text-sm font-bold text-slate-700">Your College/University</label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Search college..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-bold outline-none focus:border-primary-400 focus:bg-white transition-all w-32 sm:w-48"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                                        {fetchingColleges ? (
                                            <div className="col-span-full py-8 flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100">
                                                <Loader2 className="w-6 h-6 animate-spin text-primary-400 mb-2" />
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Loading partners...</p>
                                            </div>
                                        ) : colleges.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 ? (
                                            <div className="col-span-full py-8 text-center bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No matching colleges found</p>
                                            </div>
                                        ) : (
                                            colleges.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map((college) => (
                                                <button
                                                    key={college._id}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, collegeId: college._id })}
                                                    className={`flex items-center p-3 rounded-2xl border-2 transition-all gap-3 text-left ${formData.collegeId === college._id
                                                        ? 'border-primary-600 bg-primary-50/50'
                                                        : 'border-slate-100 bg-white hover:border-slate-200'
                                                        }`}
                                                >
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${formData.collegeId === college._id ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-400'
                                                        }`}>
                                                        <CollegeIcon className="w-5 h-5" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className={`text-xs font-bold truncate ${formData.collegeId === college._id ? 'text-slate-900' : 'text-slate-600'}`}>
                                                            {college.name}
                                                        </p>
                                                        <p className="text-[9px] text-slate-400 font-medium truncate uppercase tracking-tighter">
                                                            {college.location || 'Partner Campus'}
                                                        </p>
                                                    </div>
                                                </button>
                                            ))
                                        )}
                                    </div>

                                    {!formData.collegeId && !fetchingColleges && (
                                        <p className="text-[10px] text-primary-600 font-bold ml-1 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            Please select your university to continue
                                        </p>
                                    )}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || (fetchingColleges && formData.role !== 'RECRUITER')}
                                className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 active:scale-[0.98] transition-all shadow-xl shadow-slate-200 flex items-center justify-center disabled:opacity-70 group mt-4"
                            >
                                {loading ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <>
                                        <span>Create Account</span>
                                        <div className="ml-2 p-1 bg-white/10 rounded-lg group-hover:translate-x-1 transition-transform">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>

            {/* Right Side: Visual Image Section */}
            <div className="hidden lg:block lg:w-[55%] relative overflow-hidden bg-slate-900">
                <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 z-0"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary-600/40 to-slate-900/90 mix-blend-multiply transition-all duration-700" />
                    <img
                        src="/login-bg.png"
                        alt="Background"
                        className="w-full h-full object-cover grayscale"
                    />
                </motion.div>

                <div className="absolute inset-0 flex flex-col justify-end p-20 z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="max-w-md"
                    >
                        <div className="w-16 h-1 bg-primary-400 mb-8 rounded-full" />
                        <h2 className="text-4xl font-bold text-white mb-6 leading-tight">Your gateway to academic and professional excellence.</h2>
                        <p className="text-white/60 text-lg font-medium leading-relaxed">
                            Join thousands of students and faculty members in building the future of digital education.
                        </p>
                    </motion.div>
                </div>

                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary-500/10 blur-[120px] rounded-full" />
            </div>
        </div>
    );
};

export default Register;
