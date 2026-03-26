import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, MapPin, Shield, ShieldOff, CheckCircle, XCircle, Loader2, Search, Clock, Trash2 } from 'lucide-react';
import api from '../../api/client';
import { Link } from 'react-router-dom';

const Colleges = () => {
    const [colleges, setColleges] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchColleges = async () => {
        try {
            const response = await api.get('/colleges');
            setColleges(response.data);
        } catch (error) {
            console.error('Error fetching colleges:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchColleges();
    }, []);

    const approveCollege = async (id: string) => {
        try {
            await api.patch(`/colleges/${id}/approve`, { status: 'active' });
            setColleges(colleges.map(c => c._id === id ? { ...c, status: 'active' } : c));
        } catch (error) {
            console.error('Error approving college:', error);
        }
    };

    const toggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
        try {
            await api.patch(`/colleges/${id}/status`, { status: newStatus });
            setColleges(colleges.map(c => c._id === id ? { ...c, status: newStatus } : c));
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const deleteCollege = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this college registration? This cannot be undone.')) return;
        try {
            await api.delete(`/colleges/${id}`);
            setColleges(colleges.filter(c => c._id !== id));
        } catch (error) {
            console.error('Error deleting college:', error);
        }
    };

    const filteredColleges = colleges.filter(college =>
        college.name.toLowerCase().includes(search.toLowerCase()) ||
        college.location?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    const pendingColleges = filteredColleges.filter(c => c.status === 'pending');
    const activeColleges = filteredColleges.filter(c => c.status !== 'pending');

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">College Management</h1>
                    <p className="text-slate-500 font-medium">Approve, manage and monitor all partner institutions.</p>
                </div>
                {pendingColleges.length > 0 && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl">
                        <Clock className="w-4 h-4" />
                        <span className="font-bold text-sm">{pendingColleges.length} Pending Approval{pendingColleges.length > 1 ? 's' : ''}</span>
                    </div>
                )}
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search colleges by name or location..."
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {}
            {pendingColleges.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-sm font-black text-amber-600 uppercase tracking-widest flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Awaiting Approval ({pendingColleges.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {pendingColleges.map((college) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    key={college.id || college._id}
                                    className="bg-white rounded-2xl border-2 border-amber-200 shadow-sm overflow-hidden"
                                >
                                    <div className="h-20 bg-amber-50 flex items-center justify-center">
                                        <GraduationCap className="w-10 h-10 text-amber-500" />
                                    </div>
                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="text-base font-bold text-slate-900">{college.name}</h3>
                                                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                                    <MapPin className="w-3 h-3" />{college.location || 'Not specified'}
                                                </p>
                                            </div>
                                            <span className="px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-amber-100 text-amber-700">Pending</span>
                                        </div>
                                        {college.email && <p className="text-xs text-slate-400 mb-4">{college.email}</p>}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => approveCollege(college._id)}
                                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-colors shadow-lg shadow-green-100"
                                            >
                                                <CheckCircle className="w-4 h-4" /> Approve
                                            </button>
                                            <button
                                                onClick={() => toggleStatus(college._id, 'pending')}
                                                className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-red-50 text-red-600 border border-red-100 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors"
                                            >
                                                <XCircle className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            )}

            {}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeColleges.map((college) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        key={college.id || college._id}
                        className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all group ${college.status === 'suspended' ? 'opacity-75 grayscale-[0.5]' : ''}`}
                    >
                        <div className={`h-24 flex items-center justify-center transition-colors ${college.status === 'suspended' ? 'bg-slate-100' : 'bg-primary-50 group-hover:bg-primary-100'}`}>
                            <GraduationCap className={`w-12 h-12 ${college.status === 'suspended' ? 'text-slate-400' : 'text-primary-600'}`} />
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">{college.name}</h3>
                                    <div className="flex items-center text-sm text-slate-500 mt-1">
                                        <MapPin className="w-3 h-3 mr-1" />
                                        {college.location || 'Location Not Specified'}
                                    </div>
                                </div>
                                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${college.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {college.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50 mb-6">
                                <div className="text-center">
                                    <p className="text-xs text-slate-400 uppercase font-bold tracking-tight">Users</p>
                                    <p className="text-lg font-bold text-slate-900">{college._count?.users || 0}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-slate-400 uppercase font-bold tracking-tight">Courses</p>
                                    <p className="text-lg font-bold text-slate-900">{college._count?.courses || 0}</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Link
                                    to={`/dashboard/admin/colleges/${college.id || college._id}`}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 italic"
                                >
                                    View Details
                                </Link>
                                <button
                                    onClick={() => toggleStatus(college.id || college._id, college.status)}
                                    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${college.status === 'active' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'
                                        }`}
                                >
                                    {college.status === 'active' ? (
                                        <ShieldOff className="w-4 h-4" />
                                    ) : (
                                        <Shield className="w-4 h-4" />
                                    )}
                                </button>
                                <button
                                    onClick={() => deleteCollege(college.id || college._id)}
                                    className="p-2.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                    title="Delete/Reset Registration"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
            {filteredColleges.length === 0 && (
                <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-dashed border-slate-200">
                    No colleges found.
                </div>
            )}
        </div>
    );
};

export default Colleges;
