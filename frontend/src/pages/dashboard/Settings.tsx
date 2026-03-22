import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Mail, Building2, Loader2, AlertCircle,
    Lock, Eye, Shield, Phone, Bell, Globe,
    LogOut, History, Smartphone, Settings as SettingsIcon,
    X, ShieldCheck, Zap, Layout, Award, Clock,
    Users, ShieldAlert, Briefcase
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';

type SettingsTab = 'profile' | 'security' | 'notifications' | 'privacy' | 'logout';

const Settings = () => {
    const { logout, updateUser, user } = useAuth();
    const isFaculty = user?.role === 'FACULTY';
    const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
    const [profile, setProfile] = useState<any>(null);
    const [activity, setActivity] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [logoutConfirm, setLogoutConfirm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Security States
    const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [profileRes, activityRes] = await Promise.all([
                api.get('/users/profile'),
                api.get('/users/profile/activity')
            ]);
            setProfile(profileRes.data);
            setActivity(activityRes.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMsg({ type, text });
        setTimeout(() => setMsg(null), 4000);
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await api.put('/users/profile', profile);
            setProfile(res.data);
            updateUser(res.data);
            showMessage('success', 'Identity updated successfully');
        } catch (e) {
            showMessage('error', 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateSettings = async (updates: any) => {
        setSaving(true);
        try {
            const res = await api.put('/users/profile/settings', updates);
            setProfile(res.data);
            updateUser(res.data);
            showMessage('success', 'Preferences saved');
        } catch (e) {
            showMessage('error', 'Failed to update settings');
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (pwForm.newPassword !== pwForm.confirmPassword) {
            return showMessage('error', 'Passwords do not match');
        }
        setSaving(true);
        try {
            await api.post('/users/profile/password', {
                currentPassword: pwForm.currentPassword,
                newPassword: pwForm.newPassword
            });
            showMessage('success', 'Password updated successfully');
            setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (e: any) {
            showMessage('error', e.response?.data?.message || 'Password update failed');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>;

    const tabs: { id: SettingsTab; label: string; icon: any }[] = [
        { id: 'profile', label: 'Identity', icon: User },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'notifications', label: 'Alerts', icon: Bell },
        { id: 'privacy', label: 'Privacy', icon: Globe },
        { id: 'logout', label: 'Logout', icon: LogOut },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="bg-slate-900 rounded-[3rem] p-10 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/10 blur-[100px]" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-primary-600 rounded-[2rem] flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-primary-900/40">
                            {profile?.name?.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-white">{profile?.name}</h1>
                            <p className="text-slate-400 font-medium">{profile?.email}</p>
                            <div className="flex gap-2 mt-2 flex-wrap">
                                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-primary-400 uppercase tracking-widest">
                                    {isFaculty ? 'Faculty' : profile?.role}
                                </span>
                                {isFaculty && profile?.department && (
                                    <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-widest">{profile.department}</span>
                                )}
                                {profile?.isPhoneVerified && <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-[10px] font-black text-green-400 uppercase tracking-widest">Verified</span>}
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setActiveTab('logout')} className="px-6 py-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 font-black text-sm uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center gap-2">
                        <LogOut className="w-4 h-4" /> Logout
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-3 space-y-2">
                    {tabs.map((tab) => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-primary-600 shadow-xl' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>
                            <tab.icon className="w-5 h-5" /> {tab.label}
                        </button>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-9">
                    <AnimatePresence mode="wait">
                        <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                            {/* Profile Section */}
                            {activeTab === 'profile' && (
                                <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-8">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-2xl font-black text-slate-900">Account Identity</h2>
                                        <SettingsIcon className="w-6 h-6 text-slate-300" />
                                    </div>
                                    <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Full Display Name</label>
                                            <div className="relative group">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary-600 transition-colors" />
                                                <input type="text" value={profile?.name} onChange={e => setProfile({ ...profile, name: e.target.value })}
                                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary-600 outline-none font-bold text-slate-900 transition-all" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Email (Immutable)</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                                <input type="email" value={profile?.email} disabled
                                                    className="w-full pl-12 pr-4 py-4 bg-slate-100 border-2 border-transparent rounded-2xl font-bold text-slate-400 cursor-not-allowed" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Mobile Number</label>
                                            <div className="relative group">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary-600 transition-colors" />
                                                <input type="text" value={profile?.phone || ''} onChange={e => setProfile({ ...profile, phone: e.target.value })}
                                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary-600 outline-none font-bold text-slate-900 transition-all" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Campus / Organization</label>
                                            <div className="relative">
                                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                                <input type="text" value={profile?.collegeId?.name || profile?.company || 'Not Specified'} disabled
                                                    className="w-full pl-12 pr-4 py-4 bg-slate-100 border-2 border-transparent rounded-2xl font-bold text-slate-400 cursor-not-allowed" />
                                            </div>
                                        </div>
                                        {profile?.role === 'FACULTY' && (
                                            <>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Department</label>
                                                    <div className="relative group">
                                                        <Layout className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary-600 transition-colors" />
                                                        <input type="text" value={profile?.department || ''} onChange={e => setProfile({ ...profile, department: e.target.value })}
                                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary-600 outline-none font-bold text-slate-900 transition-all" />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Highest Qualification</label>
                                                    <div className="relative group">
                                                        <Award className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary-600 transition-colors" />
                                                        <input type="text" value={profile?.qualification || ''} onChange={e => setProfile({ ...profile, qualification: e.target.value })}
                                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary-600 outline-none font-bold text-slate-900 transition-all" />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Years of Experience</label>
                                                    <div className="relative group">
                                                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary-600 transition-colors" />
                                                        <input type="text" value={profile?.experience || ''} onChange={e => setProfile({ ...profile, experience: e.target.value })}
                                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary-600 outline-none font-bold text-slate-900 transition-all" />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Specialization Area</label>
                                                    <div className="relative group">
                                                        <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary-600 transition-colors" />
                                                        <input type="text" value={profile?.specialization || ''} onChange={e => setProfile({ ...profile, specialization: e.target.value })}
                                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary-600 outline-none font-bold text-slate-900 transition-all" />
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        <div className="md:col-span-2 pt-4">
                                            <button type="submit" disabled={saving} className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-slate-100 flex items-center justify-center gap-3 active:scale-95 transition-all">
                                                {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <><ShieldCheck className="w-6 h-6" /> Save Profile Updates</>}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Security Section */}
                            {activeTab === 'security' && (
                                <div className="space-y-8">
                                    {/* 2FA Toggle */}
                                    <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm flex items-center justify-between">
                                        <div className="flex gap-6 items-center">
                                            <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-[1.5rem] flex items-center justify-center">
                                                <Smartphone className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-slate-900">Two-Factor Authentication</h3>
                                                <p className="text-sm text-slate-500 font-medium">Add an extra layer of security to your account.</p>
                                            </div>
                                        </div>
                                        <button onClick={() => handleUpdateSettings({ twoFactorEnabled: !profile?.twoFactorEnabled })}
                                            className={`w-16 h-8 rounded-full relative transition-all duration-300 ${profile?.twoFactorEnabled ? 'bg-green-500' : 'bg-slate-200'}`}>
                                            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${profile?.twoFactorEnabled ? 'left-9' : 'left-1'}`} />
                                        </button>
                                    </div>

                                    {/* Password Management */}
                                    <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-8">
                                        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2 mr-Auto">
                                            <History className="w-6 h-6 text-red-500" /> Change Password
                                        </h3>
                                        <form onSubmit={handleChangePassword} className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="md:col-span-2 space-y-2">
                                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Current Password</label>
                                                    <div className="relative group">
                                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary-600 transition-colors" />
                                                        <input type={showPw.current ? 'text' : 'password'} value={pwForm.currentPassword} onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                                                            className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary-600 outline-none font-bold text-slate-900 transition-all" />
                                                        <button type="button" onClick={() => setShowPw({ ...showPw, current: !showPw.current })} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"><Eye className="w-5 h-5" /></button>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">New Strong Password</label>
                                                    <div className="relative group">
                                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary-600 transition-colors" />
                                                        <input type={showPw.new ? 'text' : 'password'} value={pwForm.newPassword} onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })}
                                                            className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary-600 outline-none font-bold text-slate-900 transition-all" />
                                                        <button type="button" onClick={() => setShowPw({ ...showPw, new: !showPw.new })} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"><Eye className="w-5 h-5" /></button>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Confirm Password</label>
                                                    <div className="relative group">
                                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary-600 transition-colors" />
                                                        <input type={showPw.confirm ? 'text' : 'password'} value={pwForm.confirmPassword} onChange={e => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                                                            className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary-600 outline-none font-bold text-slate-900 transition-all" />
                                                        <button type="button" onClick={() => setShowPw({ ...showPw, confirm: !showPw.confirm })} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"><Eye className="w-5 h-5" /></button>
                                                    </div>
                                                </div>
                                            </div>
                                            <button type="submit" className="w-full bg-red-600 text-white py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-red-100 flex items-center justify-center gap-3">
                                                Confirm Password Change
                                            </button>
                                        </form>
                                    </div>

                                    {/* Login Activity */}
                                    <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-6">
                                        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                            <ShieldCheck className="w-6 h-6 text-green-500" /> Recent Activity
                                        </h3>
                                        <div className="space-y-4">
                                            {activity.slice(0, 5).map((act, i) => (
                                                <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-lg transition-all">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-slate-400 group-hover:text-primary-600 transition-all">
                                                            <Smartphone className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-slate-900 text-sm">{act.browser} on {act.os}</p>
                                                            <p className="text-xs text-slate-400 font-bold">{new Date(act.timestamp).toLocaleString()} · {act.ip}</p>
                                                        </div>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${act.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{act.status}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Notifications Section */}
                            {activeTab === 'notifications' && (
                                <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-8">
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900 mb-2">Alert Preferences</h2>
                                        <p className="text-slate-500 font-medium tracking-tight">
                                            {isFaculty
                                                ? 'Control which teaching and administrative events trigger notifications.'
                                                : 'Control how you stay informed about your progress and campus activities.'}
                                        </p>
                                    </div>
                                    <div className="space-y-4 pt-4">
                                        {(isFaculty ? [
                                            { id: 'email', label: 'Email Notifications', desc: 'Important alerts and digest emails delivered to your inbox.', icon: Mail },
                                            { id: 'inApp', label: 'In-App Notifications', desc: 'Real-time bell alerts for enrollments, submissions, and messages.', icon: Bell },
                                            { id: 'enrollmentAlerts', label: 'Student Enrollment Alerts', desc: 'Get notified whenever a student joins one of your courses.', icon: Users },
                                            { id: 'activityAlerts', label: 'Student Activity Alerts', desc: 'Submission, quiz, and progress milestones for your students.', icon: Zap },
                                            { id: 'adminMessages', label: 'Admin Messages', desc: 'Receive notices sent by College Admin or Central Admin.', icon: ShieldAlert },
                                            { id: 'placementAlerts', label: 'Placement Drive Alerts', desc: 'Notifications about upcoming company drives and workshops.', icon: Briefcase },
                                        ] : [
                                            { id: 'email', label: 'Email Notifications', desc: 'Receive performance reports and job alerts via email.', icon: Bell },
                                            { id: 'inApp', label: 'In-App Notifications', desc: 'Real-time alerts for assignments and approvals.', icon: Zap }
                                        ]).map((item: any) => {
                                            const ItemIcon = item.icon ?? Bell;
                                            return (
                                                <div key={item.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:bg-white hover:shadow-xl transition-all group">
                                                    <div className="flex gap-5 items-center">
                                                        <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all">
                                                            <ItemIcon className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-black text-slate-900 text-sm">{item.label}</h4>
                                                            <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                                                        </div>
                                                    </div>
                                                    <button onClick={() => handleUpdateSettings({
                                                        notificationPreferences: { ...profile?.notificationPreferences, [item.id]: !profile?.notificationPreferences?.[item.id] }
                                                    })}
                                                        className={`w-14 h-7 rounded-full relative transition-all duration-300 shrink-0 ${profile?.notificationPreferences?.[item.id] !== false ? 'bg-primary-600' : 'bg-slate-200'}`}>
                                                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 ${profile?.notificationPreferences?.[item.id] !== false ? 'left-8' : 'left-1'}`} />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Privacy Section */}
                            {activeTab === 'privacy' && (
                                <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-8">
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900 mb-2">Exposure Control</h2>
                                        <p className="text-slate-500 font-medium tracking-tight">Decide who has visibility into your portfolio and academic success.</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                        {[
                                            { id: 'recruiterVisible', label: 'Recruiter Access', desc: 'Allow companies to see your portfolio.' },
                                            { id: 'facultyVisible', label: 'Faculty Visibility', desc: 'Campus staff can review your progress.' },
                                            { id: 'publicVisible', label: 'Public Profile', desc: 'Anyone can view your public resume link.' }
                                        ].map(item => (
                                            <div key={item.id} className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col justify-between hover:bg-white hover:shadow-xl transition-all">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary-600 shadow-sm">
                                                        {item.id === 'publicVisible' ? <Globe className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
                                                    </div>
                                                    <button onClick={() => handleUpdateSettings({
                                                        privacySettings: { ...profile?.privacySettings, [item.id]: !profile?.privacySettings?.[item.id] }
                                                    })}
                                                        className={`w-12 h-6 rounded-full relative transition-all duration-300 ${profile?.privacySettings?.[item.id] ? 'bg-green-500' : 'bg-slate-300'}`}>
                                                        <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300 ${profile?.privacySettings?.[item.id] ? 'left-6.5' : 'left-0.5'}`} />
                                                    </button>
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-slate-900 text-sm mb-1">{item.label}</h4>
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {/* Logout Section */}
                            {activeTab === 'logout' && (
                                <div className="space-y-6">
                                    <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-8">
                                        <div className="flex items-center gap-5">
                                            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-[1.5rem] flex items-center justify-center">
                                                <LogOut className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-black text-slate-900">Secure Logout</h2>
                                                <p className="text-slate-500 font-medium text-sm mt-1">End your faculty session and return to the login page.</p>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 rounded-2xl p-6 space-y-3">
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Current Session</p>
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-sm font-bold text-slate-700">{profile?.name}</span>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">·</span>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Faculty</span>
                                            </div>
                                            <p className="text-xs font-medium text-slate-500">{profile?.email}</p>
                                            {profile?.department && (
                                                <p className="text-xs font-medium text-slate-500">{profile.department} Department</p>
                                            )}
                                        </div>

                                        {!logoutConfirm ? (
                                            <button onClick={() => setLogoutConfirm(true)}
                                                className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 uppercase tracking-widest text-sm italic transition-all shadow-xl shadow-red-100">
                                                <LogOut className="w-5 h-5" /> Initiate Secure Logout
                                            </button>
                                        ) : (
                                            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                                className="space-y-3">
                                                <p className="text-center text-sm font-black text-slate-700 uppercase tracking-widest">Are you sure?</p>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <button onClick={() => setLogoutConfirm(false)}
                                                        className="py-4 rounded-2xl border-2 border-slate-200 text-slate-600 font-black text-xs uppercase tracking-widest hover:border-slate-300 transition-all">
                                                        Cancel
                                                    </button>
                                                    <button onClick={logout}
                                                        className="py-4 rounded-2xl bg-red-600 text-white font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-200">
                                                        Yes, Logout
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>

                                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
                                        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                        <p className="text-sm font-medium text-amber-800 leading-relaxed">
                                            Logging out will clear your local session. Any unsaved changes will be lost. You can log back in at any time with your faculty password.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Notification Toast */}
            <AnimatePresence>
                {msg && (
                    <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className={`fixed bottom-10 right-10 px-8 py-5 rounded-[2rem] flex items-center gap-4 shadow-2xl z-50 ${msg.type === 'success' ? 'bg-slate-900 text-white' : 'bg-red-600 text-white'}`}>
                        {msg.type === 'success' ? <Zap className="w-6 h-6 text-primary-400" /> : <AlertCircle className="w-6 h-6" />}
                        <span className="font-black text-sm tracking-tight">{msg.text}</span>
                        <X className="w-4 h-4 ml-4 opacity-40 cursor-pointer" onClick={() => setMsg(null)} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Settings;
