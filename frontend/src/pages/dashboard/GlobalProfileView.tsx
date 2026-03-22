import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    User, Mail, Building2, Layout, Award,
    Clock, Zap, ShieldCheck, Loader2, Phone,
    BookOpen, Briefcase, GraduationCap, MapPin,
    Globe, Github, Linkedin, ArrowLeft
} from 'lucide-react';
import api from '../../api/client';

const GlobalProfileView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get(`/users/${id}`);
                setProfile(res.data);
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id]);

    if (loading) return (
        <div className="h-full flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
        </div>
    );

    if (!profile) return (
        <div className="h-full flex flex-col items-center justify-center space-y-4">
            <p className="text-slate-500 font-bold italic">User profile not found.</p>
            <button onClick={() => navigate(-1)} className="text-primary-600 font-black uppercase tracking-widest text-xs flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Go Back
            </button>
        </div>
    );

    const isStudent = profile.role === 'STUDENT';
    const isFaculty = profile.role === 'FACULTY';
    const isRecruiter = profile.role === 'RECRUITER';

    const getInfoItems = () => {
        const base = [
            { icon: User, label: 'Full Name', value: profile.name },
            { icon: Mail, label: 'Email Address', value: profile.email },
            { icon: Phone, label: 'Phone Number', value: profile.phone || 'Not Specified' },
        ];

        if (isStudent) {
            return [
                ...base,
                { icon: Building2, label: 'College/University', value: profile.collegeId?.name || 'Not Assigned' },
                { icon: GraduationCap, label: 'Branch', value: profile.branch || 'Not Specified' },
                { icon: Clock, label: 'Year', value: profile.year ? `Year ${profile.year}` : 'Not Specified' },
                { icon: Award, label: 'CGPA', value: profile.cgpa || 'Not Specified' },
                { icon: Zap, label: 'Skills', value: profile.skills?.join(', ') || 'None Listed' },
            ];
        }

        if (isFaculty) {
            return [
                ...base,
                { icon: Building2, label: 'College/University', value: profile.collegeId?.name || 'Not Assigned' },
                { icon: Layout, label: 'Department', value: profile.department || 'Not Specified' },
                { icon: ShieldCheck, label: 'Designation', value: profile.designation || 'Not Specified' },
                { icon: Award, label: 'Qualification', value: profile.qualification || 'Not Specified' },
                { icon: Clock, label: 'Experience', value: profile.experience ? `${profile.experience} Years` : 'Not Specified' },
                { icon: Zap, label: 'Specialization', value: profile.specialization || 'Not Specified' },
                { icon: BookOpen, label: 'Research', value: profile.researchInterests || 'Not Specified' },
            ];
        }

        if (isRecruiter) {
            return [
                ...base,
                { icon: Briefcase, label: 'Company', value: profile.company || 'Direct Recruiter' },
                { icon: Globe, label: 'Website', value: profile.website || 'Not Specified' },
                { icon: MapPin, label: 'Location', value: `${profile.city || ''}${profile.city && profile.state ? ', ' : ''}${profile.state || ''}` || 'Not Specified' },
            ];
        }

        return base;
    };

    const infoItems = getInfoItems();

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20 px-4">
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-black uppercase tracking-widest text-[10px]"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Management
                </button>
                <div className="flex items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${profile.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        profile.status === 'suspended' ? 'bg-red-50 text-red-600 border-red-100' :
                            'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                        Status: {profile.status || 'Active'}
                    </span>
                </div>
            </div>

            {/* Header Card */}
            <div className="bg-slate-900 rounded-[3.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 blur-[120px]" />
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[3rem] flex items-center justify-center text-5xl md:text-6xl font-black text-white shadow-2xl border-4 border-white/10 overflow-hidden">
                        {profile.avatar ? (
                            <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                        ) : (
                            profile.name?.charAt(0)
                        )}
                    </div>

                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-2 italic">
                            {profile.name}
                        </h1>
                        <p className="text-primary-400 font-black uppercase tracking-[0.3em] text-sm italic">
                            {profile.role.replace('_', ' ')}
                        </p>

                        <div className="flex flex-wrap gap-4 mt-8 justify-center md:justify-start">
                            {profile.github && (
                                <a href={profile.github} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white transition-all">
                                    <Github className="w-5 h-5" />
                                </a>
                            )}
                            {profile.linkedin && (
                                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white transition-all">
                                    <Linkedin className="w-5 h-5" />
                                </a>
                            )}
                            {profile.website && (
                                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white transition-all">
                                    <Globe className="w-5 h-5" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {infoItems.map((item, idx) => (
                    <div
                        key={idx}
                        className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all flex items-start gap-6 group"
                    >
                        <div className="w-14 h-14 bg-slate-50 text-slate-400 group-hover:bg-primary-600 group-hover:text-white rounded-2xl flex items-center justify-center transition-all">
                            <item.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{item.label}</p>
                            <p className="font-bold text-slate-900 truncate">
                                {item.value || 'N/A'}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bio Section if exists */}
            {profile.bio && (
                <div className="p-10 bg-white rounded-[3.5rem] border border-slate-100 shadow-sm">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                        <Layout className="w-4 h-4 text-primary-500" /> About {profile.name.split(' ')[0]}
                    </h3>
                    <p className="text-slate-600 font-medium leading-relaxed italic">
                        "{profile.bio}"
                    </p>
                </div>
            )}

            <div className="p-10 bg-amber-50 rounded-[3.5rem] border border-amber-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl" />
                <h4 className="text-xs font-black text-amber-900 uppercase tracking-widest mb-4">Admin Inspection Note</h4>
                <p className="text-sm text-amber-700 leading-relaxed font-medium italic">
                    You are viewing this profile as a Platform Administrator. All sensitive data is retrieved directly from the system archives for verification purposes.
                </p>
            </div>
        </div>
    );
};

export default GlobalProfileView;
