import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import CentralAdminLogin from './pages/auth/CentralAdminLogin';
import ForgotPassword from './pages/auth/ForgotPassword';
import CollegeRegister from './pages/auth/CollegeRegister';
import DashboardLayout from './components/layout/DashboardLayout';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import Notifications from './pages/dashboard/Notifications';
import Courses from './pages/dashboard/Courses';
import Users from './pages/dashboard/OverallUserManagement';
import Jobs from './pages/dashboard/Jobs';
import Colleges from './pages/dashboard/OverallCollegeManagement';
import Approvals from './pages/dashboard/Approvals';
import Settings from './pages/dashboard/Settings';
import OverallAdminProfile from './pages/dashboard/OverallAdminProfile';
import OverallRecruiterManagement from './pages/dashboard/OverallRecruiterManagement';
import OverallSystemAnalytics from './pages/dashboard/OverallSystemAnalytics';
import OverallNotifications from './pages/dashboard/OverallNotifications';
import FacultyCourses from './pages/dashboard/FacultyCourses';
import CourseManagement from './pages/dashboard/CourseManagement';
import MyLearning from './pages/dashboard/MyLearning';
import StudentJobs from './pages/dashboard/StudentJobs';
import RecruiterJobs from './pages/dashboard/RecruiterJobs';
import ApplicantTracking from './pages/dashboard/ApplicantTracking';
import CareerRoadmap from './pages/dashboard/CareerRoadmap';
import PlacementPrep from './pages/dashboard/PlacementPrep';
import Portfolio from './pages/dashboard/Portfolio';
import StudentManagement from './pages/dashboard/StudentManagement';
import FacultyGuidance from './pages/dashboard/FacultyGuidance';
import FacultyProfile from './pages/dashboard/FacultyProfile';
import PlacementSupport from './pages/dashboard/PlacementSupport';
import FacultyAnnouncements from './pages/dashboard/FacultyAnnouncements';
import RecruiterProfile from './pages/dashboard/RecruiterProfile';
import RecruiterStudentInsights from './pages/dashboard/RecruiterStudentInsights';
import RecruiterPlacementDrives from './pages/dashboard/RecruiterPlacementDrives';
import RecruiterAnnouncements from './pages/dashboard/RecruiterAnnouncements';
import CollegeAdminProfile from './pages/dashboard/CollegeAdminProfile';
import CollegeStudentManagement from './pages/dashboard/CollegeStudentManagement';
import CollegeFacultyManagement from './pages/dashboard/CollegeFacultyManagement';
import CollegeRecruiterManagement from './pages/dashboard/CollegeRecruiterManagement';
import { CollegeCourseManagement } from './pages/dashboard/CollegeCourseManagement';
import CollegePlacementOversight from './pages/dashboard/CollegePlacementOversight';
import CollegeNotifications from './pages/dashboard/CollegeNotifications';
import CollegeReports from './pages/dashboard/CollegeReports';
import GlobalProfileView from './pages/dashboard/GlobalProfileView';
import GlobalCollegeView from './pages/dashboard/GlobalCollegeView';
import { useAuth } from './context/AuthContext';

// ─── Error Boundary ────────────────────────────────────────────────────────────
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: Error | null }> {
    constructor(props: any) {
        super(props);
        this.state = { error: null };
    }
    static getDerivedStateFromError(error: Error) {
        return { error };
    }
    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.error('[ErrorBoundary]', error, info.componentStack);
    }
    render() {
        if (this.state.error) {
            return (
                <div style={{ padding: '2rem', fontFamily: 'monospace', background: '#fff0f0', minHeight: '100vh' }}>
                    <h2 style={{ color: '#c00' }}>⚠ App crashed — render error</h2>
                    <pre style={{ fontSize: '0.8rem', color: '#333', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {this.state.error.message}
                    </pre>
                </div>
            );
        }
        return this.props.children;
    }
}

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                    <p className="text-slate-500 font-medium animate-pulse">Loading UniLearnHub...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

function App() {
    return (
        <AuthProvider>
            <ErrorBoundary>
                <Router>
                    <ScrollToTop />
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/register-college" element={<CollegeRegister />} />
                        <Route path="/central-admin-portal" element={<CentralAdminLogin />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <DashboardLayout />
                                </ProtectedRoute>
                            }
                        >
                            <Route index element={<AdminDashboard />} />
                            <Route path="notifications" element={<Notifications />} />
                            <Route path="courses" element={<Courses />} />
                            <Route path="users" element={<Users />} />
                            <Route path="jobs" element={<Jobs />} />
                            <Route path="colleges" element={<Colleges />} />
                            <Route path="approvals" element={<Approvals />} />
                            <Route path="settings" element={<Settings />} /> {/* Added Settings route */}
                            <Route path="faculty/courses" element={<FacultyCourses />} /> {/* Modified path */}
                            <Route path="faculty/courses/:id" element={<CourseManagement />} /> {/* Modified path */}
                            <Route path="faculty/students" element={<StudentManagement />} />
                            <Route path="faculty/guidance" element={<FacultyGuidance />} />
                            <Route path="faculty/profile" element={<FacultyProfile />} />
                            <Route path="faculty/placement" element={<PlacementSupport />} />
                            <Route path="faculty/announcements" element={<FacultyAnnouncements />} />
                            <Route path="learning" element={<MyLearning />} />
                            <Route path="career" element={<StudentJobs />} />
                            <Route path="roadmap" element={<CareerRoadmap />} />
                            <Route path="placement" element={<PlacementPrep />} />
                            <Route path="portfolio" element={<Portfolio />} />
                            <Route path="recruiter/jobs" element={<RecruiterJobs />} />
                            <Route path="recruiter/jobs/:jobId" element={<ApplicantTracking />} />
                            <Route path="recruiter/profile" element={<RecruiterProfile />} />
                            <Route path="recruiter/applications" element={<ApplicantTracking />} />
                            <Route path="recruiter/insights" element={<RecruiterStudentInsights />} />
                            <Route path="recruiter/drives" element={<RecruiterPlacementDrives />} />
                            <Route path="recruiter/announcements" element={<RecruiterAnnouncements />} />
                            {/* ── College Admin ── */}
                            <Route path="college/profile" element={<CollegeAdminProfile />} />
                            <Route path="college/students" element={<CollegeStudentManagement />} />
                            <Route path="college/faculty" element={<CollegeFacultyManagement />} />
                            <Route path="college/courses" element={<CollegeCourseManagement />} />
                            <Route path="college/recruiters" element={<CollegeRecruiterManagement />} />
                            <Route path="college/placement" element={<CollegePlacementOversight />} />
                            <Route path="college/notifications" element={<CollegeNotifications />} />
                            <Route path="college/reports" element={<CollegeReports />} />
                            {/* ── Overall Admin (Central) ── */}
                            <Route path="admin/profile" element={<OverallAdminProfile />} />
                            <Route path="admin/colleges" element={<Colleges />} />
                            <Route path="admin/recruiters" element={<OverallRecruiterManagement />} />
                            <Route path="admin/users" element={<Users />} />
                            <Route path="admin/users/:id" element={<GlobalProfileView />} />
                            <Route path="admin/analytics" element={<OverallSystemAnalytics />} />
                            <Route path="admin/notifications" element={<OverallNotifications />} />
                            <Route path="admin/colleges/:id" element={<GlobalCollegeView />} />
                        </Route>
                        <Route path="/" element={<Navigate to="/login" replace />} />
                    </Routes>
                </Router>
            </ErrorBoundary>
        </AuthProvider>
    );
}

export default App;
