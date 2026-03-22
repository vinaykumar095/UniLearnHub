import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    GraduationCap, Mail, Lock, Loader2, AlertCircle,
    ArrowLeft, CheckCircle2, ShieldCheck, KeyRound
} from 'lucide-react';
import api from '../../api/client';

type Step = 'email' | 'otp' | 'newPassword' | 'success';

const ForgotPassword = () => {
    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [devOtp, setDevOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRequestOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/auth/forgot-password', { email });
            if (res.data.otp) {
                setDevOtp(res.data.otp);
            }
            setStep('otp');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length !== 6) {
            setError('Please enter the 6-digit code.');
            return;
        }
        setError('');
        setStep('newPassword');
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setLoading(true);
        try {
            await api.post('/auth/reset-password', { email, otp, newPassword });
            setStep('success');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to reset password.');
        } finally {
            setLoading(false);
        }
    };

    const formVariants = {
        hidden: { opacity: 0, x: 40 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
        exit: { opacity: 0, x: -40, transition: { duration: 0.3 } }
    };

    return (
        <div className="min-h-screen flex bg-white overflow-hidden">
            {/* Left Side */}
            <div className="w-full lg:w-[48%] flex flex-col justify-center p-8 md:p-12 lg:p-16 relative">
                {/* Logo */}
                <div className="flex items-center gap-4 mb-12 transform scale-110 origin-left">
                    <div className="w-16 h-16 bg-primary-600 rounded-3xl flex items-center justify-center shadow-xl shadow-primary-200">
                        <GraduationCap className="w-10 h-10 text-white" />
                    </div>
                    <span className="text-4xl font-black text-slate-900 tracking-tight">UniLearnHub</span>
                </div>

                <div className="max-w-md w-full mx-auto">
                    <AnimatePresence mode="wait">

                        {/* ── STEP 1: EMAIL ── */}
                        {step === 'email' && (
                            <motion.div key="email-step" variants={formVariants} initial="hidden" animate="visible" exit="exit">
                                <Link to="/login" className="flex items-center gap-2 text-slate-400 hover:text-slate-700 font-bold mb-8 group transition-colors">
                                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                    Back to Login
                                </Link>

                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center">
                                        <KeyRound className="w-6 h-6 text-amber-600" />
                                    </div>
                                    <h1 className="text-3xl font-black text-slate-900">Forgot Password?</h1>
                                </div>
                                <p className="text-slate-500 mb-8 text-base font-medium">
                                    Enter your email address and we'll send you a verification code to reset your password.
                                </p>

                                {error && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-medium">
                                        <AlertCircle className="w-5 h-5 shrink-0" />
                                        {error}
                                    </motion.div>
                                )}

                                <form onSubmit={handleRequestOtp} className="space-y-5">
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                                        <input
                                            type="email"
                                            required
                                            placeholder="Enter your email address"
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary-600 outline-none text-slate-900 font-medium transition-all"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-primary-600 active:scale-[0.98] transition-all shadow-xl shadow-slate-200 flex items-center justify-center disabled:opacity-70"
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Code'}
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {/* ── STEP 2: OTP ── */}
                        {step === 'otp' && (
                            <motion.div key="otp-step" variants={formVariants} initial="hidden" animate="visible" exit="exit">
                                <button onClick={() => { setStep('email'); setError(''); }} className="flex items-center gap-2 text-slate-400 hover:text-slate-700 font-bold mb-8 group transition-colors">
                                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                    Change Email
                                </button>

                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                                        <ShieldCheck className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <h1 className="text-3xl font-black text-slate-900">Verify Code</h1>
                                </div>
                                <p className="text-slate-500 mb-4 text-base font-medium">
                                    Enter the 6-digit code sent to <span className="font-bold text-slate-700">{email}</span>
                                </p>

                                {devOtp && (
                                    <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                                        <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">Dev Mode — Your OTP</p>
                                        <p className="text-2xl font-black text-amber-700 tracking-[0.3em]">{devOtp}</p>
                                    </div>
                                )}

                                {error && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-medium">
                                        <AlertCircle className="w-5 h-5 shrink-0" />
                                        {error}
                                    </motion.div>
                                )}

                                <form onSubmit={handleVerifyOtp} className="space-y-5">
                                    <div className="relative group">
                                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                                        <input
                                            type="text"
                                            required
                                            maxLength={6}
                                            placeholder="Enter 6-digit code"
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary-600 outline-none text-slate-900 font-medium transition-all text-center text-2xl tracking-[0.5em] font-black"
                                            value={otp}
                                            onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-primary-600 active:scale-[0.98] transition-all shadow-xl shadow-slate-200 flex items-center justify-center"
                                    >
                                        Verify Code
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {/* ── STEP 3: NEW PASSWORD ── */}
                        {step === 'newPassword' && (
                            <motion.div key="password-step" variants={formVariants} initial="hidden" animate="visible" exit="exit">
                                <button onClick={() => { setStep('otp'); setError(''); }} className="flex items-center gap-2 text-slate-400 hover:text-slate-700 font-bold mb-8 group transition-colors">
                                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                    Back
                                </button>

                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                                        <Lock className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <h1 className="text-3xl font-black text-slate-900">New Password</h1>
                                </div>
                                <p className="text-slate-500 mb-8 text-base font-medium">
                                    Create a strong new password for your account.
                                </p>

                                {error && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-medium">
                                        <AlertCircle className="w-5 h-5 shrink-0" />
                                        {error}
                                    </motion.div>
                                )}

                                <form onSubmit={handleResetPassword} className="space-y-5">
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                                        <input
                                            type="password"
                                            required
                                            placeholder="New password (min 6 characters)"
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary-600 outline-none text-slate-900 font-medium transition-all"
                                            value={newPassword}
                                            onChange={e => setNewPassword(e.target.value)}
                                        />
                                    </div>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                                        <input
                                            type="password"
                                            required
                                            placeholder="Confirm new password"
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary-600 outline-none text-slate-900 font-medium transition-all"
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-primary-600 active:scale-[0.98] transition-all shadow-xl shadow-slate-200 flex items-center justify-center disabled:opacity-70"
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Reset Password'}
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {/* ── STEP 4: SUCCESS ── */}
                        {step === 'success' && (
                            <motion.div key="success-step" variants={formVariants} initial="hidden" animate="visible" exit="exit" className="text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                                    className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8"
                                >
                                    <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                                </motion.div>
                                <h1 className="text-3xl font-black text-slate-900 mb-3">Password Reset!</h1>
                                <p className="text-slate-500 font-medium mb-10">
                                    Your password has been successfully reset. You can now log in with your new password.
                                </p>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-primary-600 active:scale-[0.98] transition-all shadow-xl shadow-slate-200"
                                >
                                    Go to Login
                                </button>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </div>

            {/* Right Side: Visual */}
            <div className="hidden lg:block lg:w-[52%] relative overflow-hidden bg-slate-900">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-600/30 to-slate-900/90" />
                <div className="absolute inset-0 flex flex-col justify-center items-center z-10 p-20">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="max-w-lg text-center">
                        <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-10 border border-white/10">
                            <KeyRound className="w-10 h-10 text-amber-400" />
                        </div>
                        <h2 className="text-4xl font-black text-white mb-6 leading-tight">
                            Account <span className="text-amber-400">Recovery</span>
                        </h2>
                        <p className="text-slate-400 text-lg font-medium leading-relaxed">
                            Don't worry, it happens to the best of us. Follow the simple steps to regain access to your account securely.
                        </p>
                        <div className="flex items-center justify-center gap-8 mt-12">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                                    <Mail className="w-5 h-5 text-white/70" />
                                </div>
                                <span className="text-sm text-white/60 font-medium">Email Verify</span>
                            </div>
                            <div className="w-8 h-px bg-white/20" />
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                                    <ShieldCheck className="w-5 h-5 text-white/70" />
                                </div>
                                <span className="text-sm text-white/60 font-medium">OTP Code</span>
                            </div>
                            <div className="w-8 h-px bg-white/20" />
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                                    <Lock className="w-5 h-5 text-white/70" />
                                </div>
                                <span className="text-sm text-white/60 font-medium">New Password</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-500/15 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] left-[10%] w-[300px] h-[300px] bg-orange-500/15 blur-[100px] rounded-full animate-pulse [animation-delay:2s]" />
            </div>
        </div>
    );
};

export default ForgotPassword;
