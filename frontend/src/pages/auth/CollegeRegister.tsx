import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Mail, Phone, Globe, User, MapPin, ArrowLeft, CheckCircle2, Loader2, AlertCircle, GraduationCap, Shield, ShieldCheck } from 'lucide-react';
import api from '../../api/client';

const CollegeRegister = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        principal: '',
        website: '',
        location: '',
        adminName: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }
        try {
            await api.post('/colleges/register', formData);
            setSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-white rounded-3xl shadow-xl p-12 text-center border border-slate-100"
                >
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-3">Registration Submitted!</h2>
                    <p className="text-slate-500 mb-2 text-lg font-medium">Your college registration is under review.</p>
                    <p className="text-slate-400 text-sm mb-8">The Central Administrator will review your request and approve access. You will be able to log in once approved.</p>
                    <Link to="/login" className="inline-block bg-slate-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-primary-600 transition-all shadow-xl shadow-slate-200">
                        Back to Login
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-white overflow-hidden">
            {/* Left: Form */}
            <div className="w-full lg:w-[50%] flex flex-col justify-center p-8 md:p-12 lg:p-16 overflow-y-auto">
                <Link to="/login" className="flex items-center gap-2 text-slate-400 hover:text-primary-600 font-bold mb-10 group transition-colors w-fit">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Login
                </Link>

                <div className="max-w-lg w-full mx-auto">
                    <div className="flex items-center gap-4 mb-4 transform scale-110 origin-left">
                        <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center">
                            <GraduationCap className="w-8 h-8 text-white" />
                        </div>
                        <span className="text-lg font-black text-slate-400 uppercase tracking-widest">UniLearnHub</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 mt-4 mb-2">Register Your College</h1>
                    <p className="text-slate-500 mb-10 text-base font-medium">Submit your institution details for review. The Central Admin will grant access after verification.</p>

                    {error && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-medium">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* College Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">College / University Name *</label>
                            <div className="relative group">
                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                                <input name="name" type="text" required placeholder="University Name" value={formData.name} onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary-600 outline-none text-slate-900 font-medium transition-all" />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Official Email Address *</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                                <input name="email" type="email" autoComplete="username" required placeholder="Official Email" value={formData.email} onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary-600 outline-none text-slate-900 font-medium transition-all" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {/* Principal Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Principal / Dean</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                                    <input name="principal" type="text" placeholder="Principal's Name" value={formData.principal} onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary-600 outline-none text-slate-900 font-medium transition-all" />
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Contact Phone</label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                                    <input name="phone" type="text" placeholder="Contact number" value={formData.phone} onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary-600 outline-none text-slate-900 font-medium transition-all" />
                                </div>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">City / Location</label>
                            <div className="relative group">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                                <input name="location" type="text" placeholder="City or Location" value={formData.location} onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary-600 outline-none text-slate-900 font-medium transition-all" />
                            </div>
                        </div>

                        {/* Website */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Website</label>
                            <div className="relative group">
                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                                <input name="website" type="url" placeholder="Institution Website" value={formData.website} onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary-600 outline-none text-slate-900 font-medium transition-all" />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100">
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Administrator Account</h3>

                            <div className="space-y-5">
                                {/* Admin Name */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Admin Full Name *</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                                        <input name="adminName" type="text" required placeholder="Administrator's Name" value={formData.adminName} onChange={handleChange}
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary-600 outline-none text-slate-900 font-medium transition-all" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    {/* Password */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Password *</label>
                                        <div className="relative group">
                                            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                                            <input name="password" type="password" autoComplete="new-password" required placeholder="••••••••" value={formData.password} onChange={handleChange}
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary-600 outline-none text-slate-900 font-medium transition-all" />
                                        </div>
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Confirm Password *</label>
                                        <div className="relative group">
                                            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                                            <input name="confirmPassword" type="password" autoComplete="new-password" required placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange}
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary-600 outline-none text-slate-900 font-medium transition-all" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button type="submit" disabled={loading}
                            className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-primary-600 active:scale-[0.98] transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 disabled:opacity-70 mt-2">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                <><Building2 className="w-5 h-5" /> Submit Registration</>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Right: Visual */}
            <div className="hidden lg:flex lg:w-[50%] bg-slate-900 relative overflow-hidden flex-col items-center justify-center p-20">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-600/30 via-slate-900/60 to-slate-900" />
                <div className="relative z-10 max-w-md text-center">
                    <div className="w-24 h-24 bg-primary-600/10 border border-primary-600/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
                        <Building2 className="w-12 h-12 text-primary-400" />
                    </div>
                    <h2 className="text-4xl font-black text-white mb-4 leading-tight">
                        Join the UniLearnHub Network
                    </h2>
                    <p className="text-white/50 text-lg font-medium mb-10">
                        Register your institution and unlock access to a world-class academic management system.
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-left">
                        {[
                            { label: 'Course Management', desc: 'Manage and approve faculty courses' },
                            { label: 'Job Placements', desc: 'Connect students with top recruiters' },
                            { label: 'Student Tracking', desc: 'Monitor enrollment and grades' },
                            { label: 'Admin Dashboard', desc: 'Real-time analytics and reports' },
                        ].map(f => (
                            <div key={f.label} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                <p className="text-white font-bold text-sm mb-1">{f.label}</p>
                                <p className="text-white/40 text-xs font-medium">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 blur-[120px] rounded-full" />
            </div>
        </div>
    );
};

export default CollegeRegister;
