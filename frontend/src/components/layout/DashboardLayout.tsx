import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import {
    LayoutDashboard,
    BookOpen,
    Users,
    Briefcase,
    Bell,
    Settings,
    LogOut,
    Menu,
    X,
    GraduationCap,
    Compass,
    Trophy,
    UserCircle,
    Lightbulb,
    Target,
    TrendingUp,
    Star,
    Megaphone,
    Building2,
    BarChart3
} from 'lucide-react';
import StudentFooter from './StudentFooter';

const Sidebar = ({ isOpen, toggle }: { isOpen: boolean, toggle: () => void }) => {
    const location = useLocation();
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = user?.role === 'RECRUITER' ? [
        // ── Recruiter: exactly 8 items ──
        { title: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { title: 'My Profile', icon: UserCircle, path: '/dashboard/recruiter/profile' },
        { title: 'Post Jobs', icon: Briefcase, path: '/dashboard/recruiter/jobs' },
        { title: 'Manage Applications', icon: Users, path: '/dashboard/recruiter/applications' },
        { title: 'Student Insights', icon: TrendingUp, path: '/dashboard/recruiter/insights' },
        { title: 'Placement Drives', icon: Star, path: '/dashboard/recruiter/drives' },
        { title: 'Announcements', icon: Megaphone, path: '/dashboard/recruiter/announcements' },
        { title: 'Settings', icon: Settings, path: '/dashboard/settings' },
    ] : user?.role === 'COLLEGE_ADMIN' ? [
        // ── College Admin: exactly 9 items ──
        { title: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { title: 'My Profile', icon: UserCircle, path: '/dashboard/college/profile' },
        { title: 'Student Management', icon: Users, path: '/dashboard/college/students' },
        { title: 'Faculty Management', icon: GraduationCap, path: '/dashboard/college/faculty' },
        { title: 'Manage Courses', icon: BookOpen, path: '/dashboard/college/courses' },
        { title: 'Recruiter Management', icon: Building2, path: '/dashboard/college/recruiters' },
        { title: 'Placement Oversight', icon: Target, path: '/dashboard/college/placement' },
        { title: 'Inbox', icon: Bell, path: '/dashboard/notifications' },
        { title: 'Broadcast Hub', icon: Megaphone, path: '/dashboard/college/notifications' },
        { title: 'Reports & Analytics', icon: BarChart3, path: '/dashboard/college/reports' },
        { title: 'Settings', icon: Settings, path: '/dashboard/settings' },
    ] : user?.role === 'CENTRAL_ADMIN' ? [
        // ── Overall Admin (Central): exactly 8 items ──
        { title: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { title: 'My Profile', icon: UserCircle, path: '/dashboard/admin/profile' },
        { title: 'College Management', icon: GraduationCap, path: '/dashboard/admin/colleges' },
        { title: 'Recruiter Management', icon: Building2, path: '/dashboard/admin/recruiters' },
        { title: 'User Management', icon: Users, path: '/dashboard/admin/users' },
        { title: 'System Analytics', icon: BarChart3, path: '/dashboard/admin/analytics' },
        { title: 'Inbox', icon: Bell, path: '/dashboard/notifications' },
        { title: 'Broadcast Hub', icon: Megaphone, path: '/dashboard/admin/notifications' },
        { title: 'Settings', icon: Settings, path: '/dashboard/settings' },
    ] : [
        // ── All other roles ──
        { title: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        ...(user?.role === 'FACULTY' ? [
            { title: 'My Profile', icon: UserCircle, path: '/dashboard/faculty/profile' },
            { title: 'Manage Courses', icon: BookOpen, path: '/dashboard/faculty/courses' },
            { title: 'Student Management', icon: Users, path: '/dashboard/faculty/students' },
            { title: 'Career Guidance', icon: Lightbulb, path: '/dashboard/faculty/guidance' },
            { title: 'Placement Support', icon: Briefcase, path: '/dashboard/faculty/placement' },
            { title: 'Announcements', icon: Target, path: '/dashboard/faculty/announcements' }
        ] : []),
        ...(user?.role === 'STUDENT' ? [
            { title: 'My Portfolio', icon: UserCircle, path: '/dashboard/portfolio' },
            { title: 'Explore Courses', icon: BookOpen, path: '/dashboard/courses' },
            { title: 'Career Roadmap', icon: Compass, path: '/dashboard/roadmap' },
            { title: 'Placement Prep', icon: Trophy, path: '/dashboard/placement' },
            { title: 'Job Career', icon: Briefcase, path: '/dashboard/career' }
        ] : []),
        ...(user?.role !== 'STUDENT' && user?.role !== 'FACULTY' ? [{ title: 'Explore Courses', icon: BookOpen, path: '/dashboard/courses' }] : []),
        ...(user?.role !== 'STUDENT' && user?.role !== 'FACULTY' ? [{ title: 'Users', icon: Users, path: '/dashboard/users' }] : []),
        ...(user?.role !== 'STUDENT' && user?.role !== 'FACULTY' ? [{ title: 'Jobs', icon: Briefcase, path: '/dashboard/jobs' }] : []),
        { title: 'Notifications', icon: Bell, path: '/dashboard/notifications' },
        { title: 'Settings', icon: Settings, path: '/dashboard/settings' },
    ];

    return (
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen flex-shrink-0`}>
            <div className="h-full flex flex-col">
                <div className="p-6 flex items-center justify-between mb-4 mt-2">
                    <div className="flex items-center space-x-3 text-primary-400">
                        <div className="w-12 h-12 bg-primary-600/10 rounded-xl flex items-center justify-center shadow-lg shadow-primary-900/20 border border-primary-500/20">
                            <GraduationCap className="w-8 h-8 text-primary-400" />
                        </div>
                        <span className="text-2xl font-black tracking-tight text-white">UniLearnHub</span>
                    </div>
                    <button onClick={toggle} className="lg:hidden">
                        <X className="w-6 h-6 text-white" />
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.title}
                                to={item.path}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? 'bg-primary-600 text-white shadow-lg'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                                <span className="font-medium text-sm">{item.title}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all font-medium"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

const DashboardLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const { user } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!user) return;
        const fetchUnread = async () => {
            try {
                const res = await api.get('/notifications');
                const unread = res.data.filter((n: any) => !n.read).length;
                setUnreadCount(unread);
            } catch (e) {
                console.error('Error fetching unread status:', e);
            }
        };
        fetchUnread();
        const interval = setInterval(fetchUnread, 30000); // 30s pulse
        return () => clearInterval(interval);
    }, [user]);

    if (!user) {
        return <Outlet />;
    }

    return (
        <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} toggle={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
                <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shadow-sm">
                    <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-600">
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="flex items-center space-x-6 ml-auto">
                        <Link to="/dashboard/notifications" className="relative p-2 text-slate-400 hover:text-primary-600 transition-all group">
                            <Bell className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </Link>

                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                            <p className="text-xs text-slate-500">{user.role.replace('_', ' ')}</p>
                        </div>

                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold uppercase">
                            {user.name.charAt(0)}{user.name.split(' ')[1]?.charAt(0) || ''}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 flex flex-col bg-slate-50">
                    <div className="flex-1">
                        <Outlet />
                    </div>
                    {user?.role === 'STUDENT' && <StudentFooter />}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
