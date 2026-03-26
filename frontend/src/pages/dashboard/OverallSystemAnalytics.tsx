import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart3, PieChart, TrendingUp, Users, GraduationCap,
    Building2, Briefcase, ArrowUpRight, ArrowDownRight,
    Calendar, Loader2
} from 'lucide-react';
import api from '../../api/client';

const StatCard = ({ icon: Icon, label, value, trend, color, delay }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
    >
        <div className={`absolute top-0 right-0 w-24 h-24 ${color}/5 blur-3xl group-hover:bg-primary-600/10 transition-all`} />
        <div className="flex items-start justify-between mb-6">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color} shadow-lg transition-transform group-hover:scale-110`}>
                <Icon className="w-7 h-7" />
            </div>
            <div className={`flex items-center gap-1 text-[10px] font-black italic px-3 py-1 rounded-full ${trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {Math.abs(trend)}%
            </div>
        </div>
        <div>
            <p className="text-3xl font-black text-slate-900 italic tracking-tighter">{value}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">{label}</p>
        </div>
    </motion.div>
);

const OverallSystemAnalytics = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [velocityPeriod, setVelocityPeriod] = useState<'D' | 'W' | 'M' | 'Y'>('M');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/analytics/platform');
                setStats(res.data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const getVelocityValue = () => {
        if (!stats?.enrollmentVelocity) return 0;
        switch (velocityPeriod) {
            case 'D': return stats.enrollmentVelocity.daily;
            case 'W': return stats.enrollmentVelocity.weekly;
            case 'M': return stats.enrollmentVelocity.monthly;
            case 'Y': return stats.enrollmentVelocity.yearly;
            default: return stats.enrollmentVelocity.monthly;
        }
    };

    if (loading) return (
        <div className="h-full flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
        </div>
    );

    return (
        <div className="space-y-10 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 italic tracking-tight flex items-center gap-3">
                        <BarChart3 className="w-8 h-8 text-indigo-600" /> Platform-Wide Intelligence
                    </h1>
                    <p className="text-slate-500 font-medium font-italic">Aggregated performance and growth metrics across all institutions.</p>
                </div>
                <div className="px-6 py-3 bg-slate-900 text-white rounded-2xl flex items-center gap-3 shadow-xl shadow-slate-200">
                    <Calendar className="w-5 h-5 text-primary-400" />
                    <span className="text-xs font-black uppercase tracking-widest italic">Last 30 Days</span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={GraduationCap} label="Total Students" value={stats?.students || '0'} trend={0} color="bg-blue-600 text-white" delay={0.1} />
                <StatCard icon={Users} label="Active Faculty" value={stats?.faculty || '0'} trend={0} color="bg-indigo-600 text-white" delay={0.2} />
                <StatCard icon={Building2} label="Colleges" value={stats?.colleges || '0'} trend={0} color="bg-emerald-600 text-white" delay={0.3} />
                <StatCard icon={Briefcase} label="Active Jobs" value={stats?.jobs || '0'} trend={0} color="bg-rose-600 text-white" delay={0.4} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-xl font-black text-slate-900 italic flex items-center gap-3">
                            <TrendingUp className="w-6 h-6 text-primary-600" /> Enrollment Velocity
                        </h3>
                        <div className="flex gap-2">
                            {['D', 'W', 'M', 'Y'].map(p => (
                                <button
                                    key={p}
                                    onClick={() => setVelocityPeriod(p as any)}
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black transition-all ${velocityPeriod === p ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                    {}
                    <div className="h-64 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center">
                        <motion.div
                            key={velocityPeriod}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center"
                        >
                            <p className="text-6xl font-black text-slate-900 tracking-tighter mb-2">{getVelocityValue()}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Growth Curve Enrolled ({velocityPeriod === 'D' ? 'Today' : velocityPeriod === 'W' ? 'This Week' : velocityPeriod === 'M' ? 'This Month' : 'This Year'})</p>
                        </motion.div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-1 bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/20 blur-[60px]" />
                    <h3 className="text-xl font-black italic mb-8 flex items-center gap-3">
                        <PieChart className="w-6 h-6 text-primary-400" /> Institutional Pulse
                    </h3>
                    <div className="space-y-6 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                        {(stats?.institutionalPulse || []).length > 0 ? (stats.institutionalPulse as any[]).map((item, idx) => (
                            <div key={idx} className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <span>{item.name}</span>
                                    <span className="text-white">{item.percentage}%</span>
                                </div>
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.percentage}%` }}
                                        transition={{ duration: 1, delay: idx * 0.1 }}
                                        className={`h-full bg-primary-500 rounded-full`}
                                    />
                                </div>
                            </div>
                        )) : (
                            <p className="text-xs text-slate-500 italic">No distribution data available.</p>
                        )}
                    </div>
                    <div className="mt-10 pt-8 border-t border-slate-800">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">
                            Data aggregated from {stats?.activeColleges || stats?.colleges || '0'} connected colleges as of {stats?.aggregatedDate || new Date().toLocaleDateString()}.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default OverallSystemAnalytics;
