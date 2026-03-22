import { motion } from 'framer-motion';
import { UserCircle, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const OverallAdminProfile = () => {
    const { user } = useAuth();

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 italic tracking-tight">System Administrator Profile</h1>
                    <p className="text-slate-500 font-medium">Manage your personal details and account security.</p>
                </div>
                <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center shadow-xl shadow-primary-200">
                    <ShieldCheck className="w-8 h-8 text-white" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="md:col-span-1 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center"
                >
                    <div className="w-32 h-32 bg-slate-100 rounded-[2.5rem] mx-auto mb-6 flex items-center justify-center text-4xl font-black text-slate-400 border-4 border-slate-50">
                        {user?.name?.charAt(0)}
                    </div>
                    <h2 className="text-xl font-black text-slate-900">{user?.name}</h2>
                    <p className="text-xs font-black text-primary-600 uppercase tracking-widest mt-2">Overall Admin</p>
                    <button className="mt-8 w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                        Update Photo
                    </button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:col-span-2 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Full Name</label>
                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 italic">
                                <UserCircle className="w-5 h-5 text-slate-400" />
                                <span className="text-slate-900 font-medium">{user?.name}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Email Address</label>
                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 italic">
                                <Mail className="w-5 h-5 text-slate-400" />
                                <span className="text-slate-900 font-medium">{user?.email}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-primary-50 rounded-3xl border border-primary-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/5 blur-3xl" />
                        <h4 className="text-xs font-black text-primary-900 uppercase tracking-widest mb-4">Security Notice</h4>
                        <p className="text-sm text-primary-700 leading-relaxed font-medium italic">
                            Your account has system-wide administrative privileges. Please ensure multi-factor authentication is active and periodically update your password in the Settings module.
                        </p>
                    </div>

                    <div className="pt-6 border-t border-slate-50">
                        <button className="px-8 py-3.5 bg-primary-600 text-white rounded-xl font-bold text-sm hover:bg-primary-700 transition-all shadow-xl shadow-primary-200 uppercase tracking-widest">
                            Edit Profile Details
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default OverallAdminProfile;
