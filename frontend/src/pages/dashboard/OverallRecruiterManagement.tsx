import { useEffect, useState } from 'react';

import {
    Building2, Loader2, Search,
    Globe, ShieldCheck, ShieldAlert, Zap, Trash2
} from 'lucide-react';
import api from '../../api/client';
import { Link } from 'react-router-dom';

const OverallRecruiterManagement = () => {
    const [recruiters, setRecruiters] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchRecruiters = async () => {
            try {
                // In a real app, this would be a platform-wide endpoint
                const response = await api.get('/users?role=RECRUITER');
                setRecruiters(response.data);
            } catch (error) {
                console.error('Error fetching recruiters:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecruiters();
    }, []);

    const updateStatus = async (id: string, status: string) => {
        try {
            await api.patch(`/users/${id}/status`, { status });
            // Align local state with backend standardized values
            const newStatus = status === 'approved' ? 'active' : status === 'rejected' ? 'suspended' : status;
            setRecruiters(recruiters.map(r => r._id === id ? { ...r, status: newStatus } : r));
        } catch (error) {
            console.error('Error updating recruiter status:', error);
        }
    };

    const deleteRecruiter = async (id: string) => {
        try {
            await api.delete(`/users/${id}`);
            setRecruiters(recruiters.filter(r => r._id !== id));
        } catch (error) {
            console.error('Error deleting recruiter:', error);
            alert('Failed to terminate recruiter access. Check system logs.');
        }
    };

    const filtered = recruiters.filter(r =>
        (r.status !== 'deleted') && 
        (r.name.toLowerCase().includes(search.toLowerCase()) ||
         r.company?.toLowerCase().includes(search.toLowerCase()))
    );

    if (loading) return (
        <div className="h-full flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
        </div>
    );

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 italic tracking-tight flex items-center gap-3">
                        <Building2 className="w-8 h-8 text-primary-600" /> Platform Recruiter Oversight
                    </h1>
                    <p className="text-slate-500 font-medium">Monitor, verify, and manage corporate access across the platform.</p>
                </div>
                <div className="flex items-center gap-4 p-2 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl text-center">
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Approved</p>
                        <p className="text-xl font-black text-emerald-700">{recruiters.filter(r => r.status === 'active' || r.status === 'approved' || !r.status).length}</p>
                    </div>
                    <div className="px-4 py-2 bg-amber-50 border border-amber-100 rounded-xl text-center">
                        <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Pending</p>
                        <p className="text-xl font-black text-amber-700">{recruiters.filter(r => r.status === 'pending').length}</p>
                    </div>
                </div>
            </div>

            <div className="relative max-w-xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search companies, recruiters, or domains..."
                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 outline-none transition-all shadow-sm font-medium"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Company / domain</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Recruiter</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Activity</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Verification</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filtered.map((r) => (
                            <tr key={r.id || r._id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center group-hover:scale-110 transition-transform text-white font-black italic">
                                            {r.company?.charAt(0) || r.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900 text-sm italic uppercase tracking-wider">{r.company || 'Direct Recruiter'}</p>
                                            <p className="text-xs text-slate-400 font-bold flex items-center gap-1 mt-0.5">
                                                <Globe className="w-3 h-3" /> {r.email.split('@')[1]}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-bold text-slate-700">{r.name}</p>
                                        <p className="text-xs text-slate-400 font-medium">{r.email}</p>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-slate-900 italic">{r.jobCount || 0} Jobs</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Active drives: {r.driveCount || 0}</span>
                                        </div>
                                        <Zap className="w-4 h-4 text-primary-400 animate-pulse" />
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                        (r.status === 'pending') ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                        (r.status === 'suspended' || r.status === 'rejected') ? 'bg-red-50 text-red-600 border border-red-100' :
                                        'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                    }`}>
                                        {r.status === 'suspended' || r.status === 'rejected' ? 'suspended' : r.status === 'pending' ? 'pending' : 'approved'}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link
                                            to={`/dashboard/admin/users/${r._id}`}
                                            className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-sm italic"
                                        >
                                            View Profile
                                        </Link>
                                        <div className="flex items-center gap-1.5 border-l border-slate-200 pl-3 ml-1">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    updateStatus(r._id, 'approved');
                                                }}
                                                className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                                title="Approve"
                                            >
                                                <ShieldCheck className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    updateStatus(r._id, 'rejected');
                                                }}
                                                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                title="Suspend"
                                            >
                                                <ShieldAlert className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (window.confirm(`Are you sure you want to permanently delete recruiter "${r.name}" from ${r.company || 'Platform'}?`)) {
                                                        deleteRecruiter(r._id);
                                                    }
                                                }}
                                                className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-all shadow-sm ml-1"
                                                title="Delete Recruiter"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OverallRecruiterManagement;
