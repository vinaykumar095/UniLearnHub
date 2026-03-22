import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    GraduationCap, Search, ChevronDown, Loader2,
    BookOpen, Users, Filter, BarChart3, Zap, Mail
} from 'lucide-react';
import api from '../../api/client';

const STATUS_META: Record<string, { label: string; cls: string }> = {
    pending: { label: 'Pending', cls: 'bg-amber-50 text-amber-600' },
    active: { label: 'Active', cls: 'bg-emerald-50 text-emerald-600' },
    inactive: { label: 'Inactive', cls: 'bg-red-50 text-red-500' },
    suspended: { label: 'Suspended', cls: 'bg-red-50 text-red-500' },
};

const CollegeFacultyManagement = () => {
    const [faculty, setFaculty] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [deptFilter, setDeptFilter] = useState('All');
    const [expanded, setExpanded] = useState<string | null>(null);

    const load = async () => {
        try {
            const [facRes, courseRes] = await Promise.all([
                api.get('/users?role=FACULTY'),
                api.get('/courses'),
            ]);
            setFaculty(facRes.data);
            setCourses(courseRes.data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        load();
    }, []);

    const handleStatusUpdate = async (userId: string, status: string) => {
        setUpdating(userId);
        try {
            await api.patch(`/users/${userId}/status`, { status });
            setFaculty(prev => prev.map(f => f._id === userId ? { ...f, status } : f));
        } catch (e) { 
            console.error(e); 
        } finally {
            setUpdating(null);
        }
    };

    const departments = ['All', ...Array.from(new Set(faculty.map(f => f.department).filter(Boolean))) as string[]];

    const getFacultyCourses = (fId: string) => courses.filter((c: any) => c.facultyId?._id === fId || c.facultyId === fId);

    const filtered = faculty
        .filter(f => f.name?.toLowerCase().includes(search.toLowerCase()) || f.email?.toLowerCase().includes(search.toLowerCase()))
        .filter(f => deptFilter === 'All' || f.department === deptFilter);

    const pendingCount = faculty.filter(f => f.status === 'pending').length;
    const activeCount = faculty.filter(f => f.status === 'active').length;

    if (loading) return (
        <div className="h-full flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center gap-5">
                <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200">
                    <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 italic">Faculty Management</h1>
                    <p className="text-slate-500 font-medium text-sm mt-0.5">{faculty.length} faculty members · {courses.length} courses</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Faculty', value: faculty.length, icon: GraduationCap, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { label: 'Pending Approval', value: pendingCount, icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Active Members', value: activeCount, icon: Zap, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Total Courses', value: courses.length, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
                ].map(({ label, value, icon: Icon, color, bg }) => (
                    <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                        <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                            <Icon className={`w-4 h-4 ${color}`} />
                        </div>
                        <p className="text-2xl font-black text-slate-900">{value}</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{label}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search by name or email..."
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-2xl text-sm font-medium outline-none" />
                </div>
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)}
                        className="pl-10 pr-8 py-3 bg-slate-50 rounded-2xl text-sm font-bold text-slate-700 outline-none appearance-none cursor-pointer">
                        {departments.map(d => <option key={d}>{d}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
            </div>

            {/* Faculty List */}
            <div className="space-y-2">
                {filtered.length === 0 && (
                    <div className="py-24 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                        <GraduationCap className="w-14 h-14 text-slate-200 mx-auto mb-4" />
                        <p className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">No faculty found</p>
                    </div>
                )}
                {filtered.map((member, i) => {
                    const memberCourses = getFacultyCourses(member._id);
                    const isOpen = expanded === member._id;
                    return (
                        <motion.div key={member._id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-5 flex items-center gap-5 cursor-pointer hover:bg-slate-50/50 transition-colors"
                                onClick={() => setExpanded(isOpen ? null : member._id)}>
                                <div className="w-11 h-11 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-base shrink-0">
                                    {member.name?.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-black text-slate-900">{member.name}</p>
                                    <p className="text-xs font-medium text-slate-400 flex items-center gap-1">
                                        <Mail className="w-3 h-3" /> {member.email}
                                    </p>
                                </div>
                                <div className="hidden md:flex items-center gap-4">
                                    {member.department && (
                                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-black">{member.department}</span>
                                    )}
                                    <div className="text-center">
                                        <p className="text-lg font-black text-slate-900">{memberCourses.length}</p>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Courses</p>
                                    </div>
                                    <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${STATUS_META[member.status || 'active']?.cls}`}>
                                        {STATUS_META[member.status || 'active']?.label}
                                    </span>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                            </div>

                            <AnimatePresence>
                                {isOpen && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-slate-50 px-5 pb-5 pt-4 space-y-4">
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {[
                                                { label: 'Department', value: member.department ?? '—', icon: GraduationCap },
                                                { label: 'Courses Assigned', value: memberCourses.length, icon: BookOpen },
                                                { label: 'Students Reached', value: memberCourses.reduce((a: number, c: any) => a + (c.enrolledCount ?? 0), 0), icon: Users },
                                            ].map(({ label, value, icon: Icon }) => (
                                                <div key={label} className="bg-slate-50 rounded-xl p-4">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Icon className="w-3.5 h-3.5 text-slate-400" />
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
                                                    </div>
                                                    <p className="font-black text-slate-900 text-sm">{value}</p>
                                                </div>
                                            ))}
                                        </div>
                                        {memberCourses.length > 0 && (
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Zap className="w-3 h-3" />Assigned Courses</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {memberCourses.map((c: any) => (
                                                        <span key={c._id} className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black">{c.title}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex gap-2 pt-4 border-t border-slate-50">
                                            {member.status === 'pending' ? (
                                                <>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); handleStatusUpdate(member._id, 'active'); }}
                                                        disabled={updating === member._id}
                                                        className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all disabled:opacity-50"
                                                    >
                                                        {updating === member._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <BarChart3 className="w-3.5 h-3.5" />} Approve Faculty
                                                    </button>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); handleStatusUpdate(member._id, 'suspended'); }}
                                                        disabled={updating === member._id}
                                                        className="flex items-center gap-2 px-4 py-2.5 bg-white text-red-600 border border-red-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all disabled:opacity-50"
                                                    >
                                                        Reject Submission
                                                    </button>
                                                </>
                                            ) : member.status === 'active' ? (
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); handleStatusUpdate(member._id, 'suspended'); }}
                                                    disabled={updating === member._id}
                                                    className="flex items-center gap-2 px-4 py-2.5 bg-white text-red-600 border border-red-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all disabled:opacity-50"
                                                >
                                                    Suspend Access
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); handleStatusUpdate(member._id, 'active'); }}
                                                    disabled={updating === member._id}
                                                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all disabled:opacity-50"
                                                >
                                                    Re-Activate Account
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default CollegeFacultyManagement;
