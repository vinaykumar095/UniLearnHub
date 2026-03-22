import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Search, ChevronDown, Loader2, GraduationCap,
    Star, Zap, BookOpen, Filter, Eye, UserCheck, UserX, Award
} from 'lucide-react';
import api from '../../api/client';

const STATUS_META: Record<string, { label: string; cls: string }> = {
    pending: { label: 'Pending', cls: 'bg-amber-50 text-amber-600' },
    active: { label: 'Active', cls: 'bg-emerald-50 text-emerald-600' },
    inactive: { label: 'Inactive', cls: 'bg-red-50 text-red-500' },
    suspended: { label: 'Suspended', cls: 'bg-red-50 text-red-500' },
    alumni: { label: 'Alumni', cls: 'bg-slate-100 text-slate-500' },
};

const CollegeStudentManagement = () => {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [branchFilter, setBranchFilter] = useState('All');
    const [sortBy, setSortBy] = useState('name');
    const [expanded, setExpanded] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await api.get('/users?role=STUDENT');
                setStudents(res.data);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        load();
    }, []);

    const branches = ['All', ...Array.from(new Set(students.map(s => s.branch).filter(Boolean))) as string[]];

    const filtered = students
        .filter(s => s.name?.toLowerCase().includes(search.toLowerCase()) || s.email?.toLowerCase().includes(search.toLowerCase()))
        .filter(s => branchFilter === 'All' || s.branch === branchFilter)
        .sort((a, b) => {
            if (sortBy === 'cgpa') return (b.cgpa ?? 0) - (a.cgpa ?? 0);
            if (sortBy === 'year') return (a.year ?? '').localeCompare(b.year ?? '');
            return a.name?.localeCompare(b.name ?? '') ?? 0;
        });

    const totalActive = students.filter(s => s.status === 'active').length;
    const totalPending = students.filter(s => s.status === 'pending').length;

    const handleStatusUpdate = async (userId: string, status: string) => {
        setUpdating(userId);
        try {
            await api.patch(`/users/${userId}/status`, { status });
            setStudents(prev => prev.map(s => s._id === userId ? { ...s, status } : s));
        } catch (e) { console.error(e); }
        finally { setUpdating(null); }
    };

    if (loading) return (
        <div className="h-full flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center gap-5">
                <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
                    <Users className="w-7 h-7 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 italic">Student Management</h1>
                    <p className="text-slate-500 font-medium text-sm mt-0.5">{students.length} students · {totalActive} active</p>
                </div>
            </div>

            {/* Stats Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Students', value: students.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Pending Approval', value: totalPending, icon: UserX, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Active', value: totalActive, icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Branches', value: branches.length - 1, icon: GraduationCap, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                ].map(({ label, value, icon: Icon, color, bg }) => (
                    <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
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
                <div className="flex gap-3">
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select value={branchFilter} onChange={e => setBranchFilter(e.target.value)}
                            className="pl-10 pr-8 py-3 bg-slate-50 rounded-2xl text-sm font-bold text-slate-700 outline-none appearance-none cursor-pointer">
                            {branches.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                    <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                        className="px-5 py-3 bg-slate-50 rounded-2xl text-sm font-bold text-slate-700 outline-none appearance-none cursor-pointer">
                        <option value="name">Sort: Name</option>
                        <option value="cgpa">Sort: CGPA ↓</option>
                        <option value="year">Sort: Year</option>
                    </select>
                </div>
            </div>

            {/* Student List */}
            <div className="space-y-2">
                {filtered.length === 0 && (
                    <div className="py-24 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                        <Users className="w-14 h-14 text-slate-200 mx-auto mb-4" />
                        <p className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">No students found</p>
                    </div>
                )}
                {filtered.map((student, i) => {
                    const statusMeta = STATUS_META[student.status ?? 'active'] ?? STATUS_META.active;
                    const isOpen = expanded === student._id;
                    return (
                        <motion.div key={student._id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.025 }}
                            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-5 flex items-center gap-5 cursor-pointer hover:bg-slate-50/50 transition-colors"
                                onClick={() => setExpanded(isOpen ? null : student._id)}>
                                <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-base shrink-0">
                                    {student.name?.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-black text-slate-900">{student.name}</p>
                                    <p className="text-xs font-medium text-slate-400">{student.email}</p>
                                </div>
                                <div className="hidden md:flex items-center gap-5">
                                    {student.branch && <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black">{student.branch}</span>}
                                    {student.year && <span className="text-sm font-black text-slate-500">Year {student.year}</span>}
                                    {student.cgpa && (
                                        <div className="text-center">
                                            <p className="text-lg font-black text-slate-900">{student.cgpa}</p>
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">CGPA</p>
                                        </div>
                                    )}
                                </div>
                                <span className={`hidden md:block px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${statusMeta.cls}`}>{statusMeta.label}</span>
                                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                            </div>

                            <AnimatePresence>
                                {isOpen && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-slate-50 px-5 pb-5 pt-4 space-y-4">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {[
                                                { label: 'Branch', value: student.branch ?? '—', icon: GraduationCap },
                                                { label: 'Year', value: student.year ?? '—', icon: BookOpen },
                                                { label: 'CGPA', value: student.cgpa ?? '—', icon: Star },
                                                { label: 'Status', value: statusMeta.label, icon: UserCheck },
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
                                        {(student.skills ?? []).length > 0 && (
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Zap className="w-3 h-3" />Skills</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {student.skills.map((sk: string) => (
                                                        <span key={sk} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black">{sk}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex gap-2 pt-2">
                                            {student.resume && (
                                                <a href={student.resume} target="_blank" rel="noreferrer"
                                                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all">
                                                    <Eye className="w-3.5 h-3.5" /> View Resume
                                                </a>
                                            )}
                                            <span className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${statusMeta.cls}`}>
                                                <Award className="w-3.5 h-3.5" /> {statusMeta.label}
                                            </span>
                                            {student.status === 'pending' && (
                                                <>
                                                    <button 
                                                        onClick={() => handleStatusUpdate(student._id, 'active')}
                                                        disabled={updating === student._id}
                                                        className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all disabled:opacity-50"
                                                    >
                                                        {updating === student._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserCheck className="w-3.5 h-3.5" />} Approve
                                                    </button>
                                                    <button 
                                                        onClick={() => handleStatusUpdate(student._id, 'suspended')}
                                                        disabled={updating === student._id}
                                                        className="flex items-center gap-2 px-4 py-2.5 bg-white text-red-600 border border-red-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all disabled:opacity-50"
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                            {student.status === 'active' && (
                                                <button 
                                                    onClick={() => handleStatusUpdate(student._id, 'suspended')}
                                                    disabled={updating === student._id}
                                                    className="flex items-center gap-2 px-4 py-2.5 bg-white text-red-600 border border-red-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all disabled:opacity-50"
                                                >
                                                    {updating === student._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserX className="w-3.5 h-3.5" />} Suspend
                                                </button>
                                            )}
                                            {student.status === 'suspended' && (
                                                <button 
                                                    onClick={() => handleStatusUpdate(student._id, 'active')}
                                                    disabled={updating === student._id}
                                                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all disabled:opacity-50"
                                                >
                                                    {updating === student._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserCheck className="w-3.5 h-3.5" />} Reactivate
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

export default CollegeStudentManagement;
