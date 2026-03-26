import { useEffect, useState } from 'react';
import { Loader2, UserPlus, Trash2 } from 'lucide-react';
import api from '../../api/client';
import { Link } from 'react-router-dom';

interface User {
    id?: string;
    _id?: string;
    name: string;
    email: string;
    role: string;
    college?: {
        name: string;
    };
    company?: string;
    status?: string;
}

const Users = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeRole, setActiveRole] = useState('COLLEGE_ADMIN');

    const roles = [
        { id: 'COLLEGE_ADMIN', label: 'College Admins' },
        { id: 'FACULTY', label: 'Faculty' },
        { id: 'STUDENT', label: 'Students' },
        { id: 'RECRUITER', label: 'Recruiters' },
        { id: 'ALL', label: 'All Users' }
    ];

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (id: string, name: string) => {
        if (!window.confirm(`Are you sure you want to permanently delete user "${name}"? This action cannot be undone.`)) return;
        try {
            await api.delete(`/users/${id}`);
            setUsers(users.filter(u => (u.id || u._id) !== id));
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user. Please check permissions.');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);



    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
                    <p className="text-slate-500">Manage platform users and their roles.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-200 transition-colors">
                        <UserPlus className="w-4 h-4" />
                        <span className="font-semibold text-sm">Add User</span>
                    </button>
                </div>
            </div>

            {/* Role Filter Tabs */}
            <div className="flex items-center space-x-1 bg-slate-100/50 p-1 rounded-2xl w-fit">
                {roles.map((role) => (
                    <button
                        key={role.id}
                        onClick={() => setActiveRole(role.id)}
                        className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                            activeRole === role.id
                                ? 'bg-white text-primary-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        {role.label}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                             <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">College</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {users.filter(u => u.status !== 'deleted' && (activeRole === 'ALL' || u.role === activeRole)).map((user: User) => (
                            <tr key={user.id || user._id} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold uppercase text-xs">
                                            {user.name?.charAt(0) || user.email?.charAt(0) || '?'}
                                        </div>
                                        <span className="font-medium text-slate-900">{user.name || 'Unnamed User'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-500 text-sm">{user.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-tighter ${
                                        user.role === 'COLLEGE_ADMIN' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                                        user.role === 'FACULTY' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                                        user.role === 'STUDENT' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                        'bg-slate-50 text-slate-700 border border-slate-100'
                                    }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-500 text-sm font-medium">
                                    {user.role === 'RECRUITER' ? (user.company || 'Direct') : (user.college?.name || 'Platform')}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                        user.status === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                        user.status === 'suspended' ? 'bg-red-50 text-red-600 border border-red-100' :
                                        user.status === 'deleted' ? 'bg-slate-200 text-slate-500 border border-slate-300' :
                                        'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                    }`}>
                                        {user.status === 'suspended' ? 'No Access' : 
                                         user.status === 'deleted' ? 'Deleted' : 
                                         user.status === 'active' ? 'Access' : (user.status || 'Access')}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                                        <Link to={`/dashboard/admin/users/${user.id || user._id}`} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-sm italic">
                                            View Profile
                                        </Link>
                                        <button 
                                            onClick={() => deleteUser((user.id || user._id)!, user.name)}
                                            className="p-2 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                            title="Permanently Delete User"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
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

export default Users;
