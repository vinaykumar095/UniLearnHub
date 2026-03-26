import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Building2, MapPin, Mail, Phone, Globe,
    GraduationCap, Users, BookOpen, ArrowLeft,
    Loader2, ShieldCheck, Zap, Activity, ExternalLink
} from 'lucide-react';
import api from '../../api/client';

const GlobalCollegeView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [college, setCollege] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCollege = async () => {
            try {
                const res = await api.get(`/colleges/${id}`);
                setCollege(res.data);
            } catch (error) {
                console.error('Error fetching college:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCollege();
    }, [id]);

    if (loading) return (
        <div className="h-full flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
        </div>
    );

    if (!college) return (
        <div className="h-full flex flex-col items-center justify-center space-y-4">
            <p className="text-slate-500 font-bold italic">College records not found.</p>
            <button onClick={() => navigate(-1)} className="text-primary-600 font-black uppercase tracking-widest text-xs flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Go Back
            </button>
        </div>
    );

    const stats = [
        { label: 'Enrolled Students', value: college._count?.users || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Active Courses', value: college._count?.courses || 0, icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Faculty Members', value: '~', icon: GraduationCap, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Placement Drives', value: '4', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-20 px-4">
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-black uppercase tracking-widest text-[10px]"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Management
                </button>
                <div className="flex items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${college.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        'bg-red-50 text-red-600 border-red-100'
                        }`}>
                        Status: {college.status}
                    </span>
                </div>
            </div>

            {}
            <div className="bg-slate-900 rounded-[4rem] p-10 md:p-16 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/10 blur-[150px]" />
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
                        <div className="w-32 h-32 md:w-48 md:h-48 bg-white rounded-[3.5rem] flex items-center justify-center shadow-2xl border-8 border-white/5">
                            <Building2 className="w-16 h-16 md:w-24 md:h-24 text-primary-600" />
                        </div>
                        <div className="flex-1 text-center md:text-left pt-4">
                            <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tight mb-4">
                                {college.name}
                            </h1>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-slate-400 font-bold">
                                <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary-400" /> {college.location}</span>
                                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
                                    ID: {(college.id || college._id || '').toString().slice(-6)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
                        {stats.map((stat, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm group hover:bg-white/10 transition-all">
                                <stat.icon className={`w-8 h-8 ${stat.color} mb-4`} />
                                <p className="text-2xl font-black text-white">{stat.value}</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-8 italic">Contact Directory</h3>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Email</p>
                                    <p className="text-sm font-bold text-slate-900 truncate">{college.email || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Phone</p>
                                    <p className="text-sm font-bold text-slate-900 truncate">{college.phone || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                    <Globe className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Website</p>
                                    <p className="text-sm font-bold text-slate-900 truncate text-primary-600">
                                        {college.website ? (
                                            <a href={college.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline">
                                                Visit Link <ExternalLink className="w-3 h-3" />
                                            </a>
                                        ) : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-emerald-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-emerald-900/20 relative overflow-hidden group">
                        <ShieldCheck className="w-12 h-12 text-white/20 absolute -right-2 -bottom-2 group-hover:scale-150 transition-transform duration-700" />
                        <h3 className="text-xs font-black uppercase tracking-widest mb-2">Principal / Lead</h3>
                        <p className="text-2xl font-black italic">{college.principal || 'Dr. Academic Lead'}</p>
                        <p className="text-emerald-200 text-xs font-bold mt-4 italic opacity-80">Verified Platform Institution since 2024</p>
                    </div>
                </div>

                {}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[3rem] border border-slate-100 p-10 shadow-sm min-h-[400px]">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] italic flex items-center gap-3">
                                <Activity className="w-5 h-5 text-indigo-500" /> Recent Institution Pulse
                            </h3>
                            <button className="text-[10px] font-black text-primary-600 uppercase tracking-widest hover:underline">Download Audit Log</button>
                        </div>

                        <div className="space-y-8">
                            {[
                                { event: 'New Student Registration', time: '2 hours ago', meta: '+12 Students' },
                                { event: 'Course Catalog Updated', time: '5 hours ago', meta: 'Web Development' },
                                { event: 'Placement Drive Scheduled', time: 'Yesterday', meta: 'Google India' },
                                { event: 'Faculty Onboarded', time: '2 days ago', meta: 'Dr. Sarah Connor' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-6 relative">
                                    <div className="w-3 h-3 rounded-full bg-slate-200 mt-1.5 shrink-0" />
                                    {i < 3 && <div className="absolute left-[5.5px] top-6 w-0.5 h-10 bg-slate-100" />}
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-black text-slate-900">{item.event}</p>
                                            <span className="text-[10px] font-black text-indigo-600 italic bg-indigo-50 px-3 py-1 rounded-lg">{item.meta}</span>
                                        </div>
                                        <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-tighter">{item.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 p-8 bg-slate-50 rounded-[2rem] border border-slate-100 border-dashed text-center">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Academic Distribution</p>
                            <div className="flex items-center justify-center gap-10">
                                <div>
                                    <p className="text-xl font-black text-slate-900">78%</p>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-tight">Tech</p>
                                </div>
                                <div className="w-px h-10 bg-slate-200" />
                                <div>
                                    <p className="text-xl font-black text-slate-900">22%</p>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-tight">Design</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GlobalCollegeView;
