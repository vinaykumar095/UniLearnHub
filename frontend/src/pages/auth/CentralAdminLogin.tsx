import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Lock, Loader2, AlertCircle, GraduationCap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';

const CentralAdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, user } = response.data;
            if (user.role !== 'CENTRAL_ADMIN') {
                setError('Access denied. This portal is for Central Administrators only.');
                return;
            }
            login(token, user);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Authentication failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
            {}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10"
            >
                {}
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-primary-600/10 border border-primary-600/20 rounded-2xl flex items-center justify-center mb-4">
                        <ShieldCheck className="w-8 h-8 text-primary-400" />
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                        <GraduationCap className="w-7 h-7 text-slate-500" />
                        <span className="text-slate-500 font-bold text-lg tracking-widest uppercase">UniLearnHub</span>
                    </div>
                    <h1 className="text-3xl font-black text-white mb-2">System Administration</h1>
                    <p className="text-slate-500 text-center text-sm font-medium">Restricted access. Authorized personnel only.</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
                    {error && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 bg-red-950/50 border border-red-900/50 text-red-400 rounded-2xl flex items-center gap-3 text-sm font-medium">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Admin Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-primary-500 transition-colors" />
                                <input
                                    name="email"
                                    type="email"
                                    autoComplete="username"
                                    required
                                    placeholder="Enter admin email address"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-800 border-2 border-transparent rounded-2xl focus:border-primary-600 outline-none text-white font-medium transition-all placeholder:text-slate-600"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-primary-500 transition-colors" />
                                <input
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    placeholder="••••••••••"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-800 border-2 border-transparent rounded-2xl focus:border-primary-600 outline-none text-white font-medium transition-all placeholder:text-slate-600"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary-600 text-white font-black py-4 rounded-2xl hover:bg-primary-500 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-xl shadow-primary-900/50 mt-2"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                <>
                                    <ShieldCheck className="w-5 h-5" />
                                    Authenticate
                                </>
                            )}
                        </button>
                    </form>
                    <div className="mt-4 text-center">
                        <Link to="/forgot-password" className="text-sm text-primary-400 font-bold hover:underline">Forgot Password?</Link>
                    </div>
                </div>

                <p className="text-center text-slate-700 text-xs font-medium mt-6">
                    Unauthorized access attempts are logged and reported.
                </p>
            </motion.div>
        </div>
    );
};

export default CentralAdminLogin;
