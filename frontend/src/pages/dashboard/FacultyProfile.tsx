import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Mail, Building2, Layout, Award,
    Clock, Zap, ShieldCheck, Loader2, Edit3,
    Save, Phone, BookOpen, Camera
} from 'lucide-react';
import api from '../../api/client';

const FacultyProfile = () => {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<any>({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/users/profile');
                setProfile(res.data);
                setFormData(res.data);
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await api.put('/users/profile', formData);
            setProfile(res.data);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="h-full flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
        </div>
    );

    const infoItems = [
        { icon: User, label: 'Full Name', value: profile?.name, key: 'name' },
        { icon: Mail, label: 'Email Address', value: profile?.email, key: 'email', disabled: true },
        { icon: Phone, label: 'Phone Number', value: profile?.phone || 'Not Specified', key: 'phone' },
        { icon: Building2, label: 'College/University', value: profile?.collegeId?.name || 'Not Assigned', disabled: true },
        { icon: Layout, label: 'Department', value: profile?.department || 'Not Specified', key: 'department' },
        { icon: ShieldCheck, label: 'Designation', value: profile?.designation || 'Not Specified', key: 'designation' },
        { icon: Award, label: 'Qualification', value: profile?.qualification || 'Not Specified', key: 'qualification' },
        { icon: Clock, label: 'Experience', value: profile?.experience ? `${profile.experience} Years` : 'Not Specified', key: 'experience' },
        { icon: Zap, label: 'Specialization', value: profile?.specialization || 'Not Specified', key: 'specialization' },
        { icon: BookOpen, label: 'Research Interests', value: profile?.researchInterests || 'Not Specified', key: 'researchInterests' },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20 px-4">
            {/* Header Card */}
            <div className="bg-slate-900 rounded-[3.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 blur-[120px]" />
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                    <div className="relative group">
                        <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-primary-400 to-indigo-600 rounded-[3rem] flex items-center justify-center text-5xl md:text-6xl font-black text-white shadow-2xl shadow-primary-900/40 border-4 border-white/10 overflow-hidden">
                            {profile?.avatar ? (
                                <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                            ) : (
                                profile?.name?.charAt(0)
                            )}
                        </div>
                        {isEditing && (
                            <button className="absolute bottom-0 right-0 p-3 bg-white text-slate-900 rounded-2xl shadow-xl hover:scale-110 transition-transform">
                                <Camera className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    <div className="text-center md:text-left flex-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black text-white mb-2 italic">
                                    Prof. {profile?.name}
                                </h1>
                                <p className="text-primary-400 font-black uppercase tracking-[0.3em] text-sm italic">
                                    {profile?.designation || profile?.department || 'Academic Lead'}
                                </p>
                            </div>
                            <button
                                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                disabled={saving}
                                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${isEditing
                                    ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-900/40'
                                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                                    }`}
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                                {isEditing ? 'Save Changes' : 'Edit Profile'}
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-3 mt-8 justify-center md:justify-start">
                            <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Verified Faculty
                            </span>
                            <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                                <Award className="w-3 h-3 text-indigo-400" /> {profile?.qualification || 'Expert'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={isEditing ? 'editing' : 'viewing'}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    {infoItems.map((item, idx) => (
                        <div
                            key={idx}
                            className={`p-8 rounded-[2.5rem] border transition-all flex items-start gap-6 group ${isEditing ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-100 shadow-sm hover:shadow-xl'
                                }`}
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isEditing ? 'bg-white text-primary-600 shadow-sm' : 'bg-slate-50 text-slate-400 group-hover:bg-primary-600 group-hover:text-white'
                                }`}>
                                <item.icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{item.label}</p>
                                {isEditing && !item.disabled && item.key ? (
                                    <input
                                        type="text"
                                        value={formData[item.key as string] || ''}
                                        onChange={(e) => setFormData({ ...formData, [item.key as string]: e.target.value })}
                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                    />
                                ) : (
                                    <p className="font-bold text-slate-900 truncate">
                                        {item.value}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </motion.div>
            </AnimatePresence>

            {isEditing && (
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => setIsEditing(false)}
                        className="px-10 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-10 py-4 bg-primary-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary-700 shadow-xl shadow-primary-900/20 transition-all"
                    >
                        Apply Changes
                    </button>
                </div>
            )}
        </div>
    );
};

export default FacultyProfile;
