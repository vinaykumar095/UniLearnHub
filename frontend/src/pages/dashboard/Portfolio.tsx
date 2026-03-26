import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FolderOpen, Award, Plus, X, ExternalLink, Loader2, Printer,
    Tag, MapPin, Globe, Github, Linkedin, Code2, User, BookOpen,
    Trash2, ChevronDown, ChevronUp, FileText, CheckCircle2, Calendar
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';



const Field = ({ label, icon: Icon, ...props }: any) => (
    <div>
        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">{label}</label>
        <div className="relative group">
            {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-600 transition-colors" />}
            <input {...props}
                className={`w-full ${Icon ? 'pl-9' : 'pl-3'} pr-3 py-2.5 bg-slate-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-primary-600 outline-none text-slate-900 font-medium text-sm transition-all`} />
        </div>
    </div>
);

const Section = ({ id, title, icon: Icon, children, color = 'text-primary-600', bg = 'bg-primary-50', expanded, onToggle, saving }: any) => (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <button onClick={() => onToggle(id)} className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
                <div className={`w-8 h-8 ${bg} ${color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-4 h-4" />
                </div>
                <span className="font-black text-slate-900">{title}</span>
                {saving && <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
            </div>
            {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
        <AnimatePresence>
            {expanded && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }} className="overflow-hidden">
                    <div className="px-6 pb-6">{children}</div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

const Modal = ({ title, onClose, children }: any) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-slate-900">{title}</h3>
                <button onClick={onClose}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            {children}
        </motion.div>
    </div>
);

const ResumeModal = ({ portfolio, user, onClose }: any) => {
    const handlePrint = () => {
        const content = document.getElementById('resume-content')?.innerHTML;
        const win = window.open('', '_blank');
        if (!win || !content) return;
        win.document.write(`<!DOCTYPE html><html><head><title>Resume - ${user?.name}</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Times New Roman', Times, serif; color: #000; padding: 40px; font-size: 10.5pt; line-height: 1.25; }
            .header-center { text-align: center; margin-bottom: 5px; }
            .name { font-size: 22pt; font-weight: bold; text-transform: uppercase; margin-bottom: 2px; }
            .location { font-size: 9pt; margin-bottom: 4px; }
            .contact-row { display: flex; justify-content: center; gap: 10px; font-size: 9pt; margin-bottom: 12px; }
            .contact-item { display: flex; align-items: center; gap: 3px; color: #000; text-decoration: none; }
            .separator { color: #666; }
            h2 { font-size: 11pt; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #000; margin-top: 14px; margin-bottom: 6px; padding-bottom: 1px; }
            .item-header { display: flex; justify-content: space-between; font-weight: bold; font-size: 10.5pt; margin-bottom: 1px; }
            .item-sub { display: flex; justify-content: space-between; font-size: 9.5pt; margin-bottom: 2px; }
            .tech-stack { font-size: 10pt; font-style: italic; color: #333; }
            ul { margin-left: 18px; margin-bottom: 6px; }
            li { margin-bottom: 1px; text-align: justify; }
            .skill-line { margin-bottom: 3px; font-size: 10pt; }
            .skill-label { font-weight: bold; }
            a { color: #000; text-decoration: underline; }
            .star-bullet { list-style: none; margin-left: 5px; position: relative; }
            .star-bullet::before { content: "☆"; position: absolute; left: -15px; font-size: 8pt; top: 2px; }
            @media print { body { padding: 30px; } }
        </style></head><body>${content}</body></html>`);
        win.document.close();
        setTimeout(() => win.print(), 300);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
                    <h3 className="font-black text-slate-900 flex items-center gap-2"><FileText className="w-5 h-5 text-primary-600" /> Resume Preview</h3>
                    <div className="flex gap-3">
                        <button onClick={handlePrint} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-black transition-all">
                            <Printer className="w-4 h-4" /> Print / Download PDF
                        </button>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                    </div>
                </div>
                <div className="overflow-y-auto p-8 font-['Times_New_Roman',serif] text-black text-[13px] leading-relaxed">
                    <div id="resume-content">
                        {}
                        <div className="header-center" style={{ textAlign: 'center' }}>
                            <div className="name" style={{ fontSize: '22pt', fontWeight: 'bold', textTransform: 'uppercase' }}>{user?.name}</div>
                            <div className="location" style={{ fontSize: '9pt', marginBottom: '4px' }}>
                                {[portfolio?.city, portfolio?.state, portfolio?.country].filter(Boolean).join(', ')}
                            </div>
                            <div className="contact-row" style={{ display: 'flex', justifyContent: 'center', gap: '10px', fontSize: '9pt', marginBottom: '12px' }}>
                                {user?.phone && <span className="contact-item">📞 {user.phone}</span>}
                                <span className="separator"> — </span>
                                {user?.email && <span className="contact-item">✉ Email</span>}
                                <span className="separator"> — </span>
                                {portfolio?.linkedin && <span className="contact-item">in LinkedIn</span>}
                                <span className="separator"> — </span>
                                {portfolio?.github && <span className="contact-item">GitHub</span>}
                                <span className="separator"> — </span>
                                {portfolio?.leetcode && <span className="contact-item">{'</>'} LeetCode</span>}
                            </div>
                        </div>

                        {portfolio?.bio && (
                            <div style={{ marginBottom: '10px' }}>
                                <h2 style={{ fontSize: '11pt', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #000', marginBottom: '6px' }}>Summary</h2>
                                <p style={{ textAlign: 'justify', fontSize: '10.5pt' }}>{portfolio.bio}</p>
                            </div>
                        )}

                        {portfolio?.skills?.length > 0 && (
                            <div style={{ marginBottom: '10px' }}>
                                <h2 style={{ fontSize: '11pt', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #000', marginBottom: '6px' }}>Skills</h2>
                                <p className="skill-line" style={{ fontSize: '10.5pt' }}><span className="skill-label" style={{ fontWeight: 'bold' }}>Technical Skills:</span> {portfolio.skills.join(', ')}</p>
                            </div>
                        )}

                        {(portfolio?.college || portfolio?.branch) && (
                            <div style={{ marginBottom: '10px' }}>
                                <h2 style={{ fontSize: '11pt', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #000', marginBottom: '6px' }}>Education</h2>
                                <div className="item-header" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '10.5pt' }}>
                                    <span>{portfolio.college || 'University'}</span>
                                    <span>{portfolio.year || '2023 — 2027'}</span>
                                </div>
                                <div className="item-sub" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5pt' }}>
                                    <span>{portfolio.branch} {portfolio.cgpa ? `— CGPA: ${portfolio.cgpa}` : ''}</span>
                                    <span>{[portfolio.city, portfolio.state].filter(Boolean).join(', ')}</span>
                                </div>
                            </div>
                        )}

                        {portfolio?.projects?.length > 0 && (
                            <div style={{ marginBottom: '10px' }}>
                                <h2 style={{ fontSize: '11pt', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #000', marginBottom: '6px' }}>Projects</h2>
                                {portfolio.projects.map((p: any) => (
                                    <div key={p._id} style={{ marginBottom: '8px' }}>
                                        <div className="item-header" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '10.5pt' }}>
                                            <span>
                                                {p.title} (Live Website) <span style={{ fontSize: '9pt' }}>🔗</span>
                                                {p.techStack && <span style={{ fontWeight: 'normal', fontStyle: 'italic', fontSize: '10pt', marginLeft: '5px' }}> | {p.techStack}</span>}
                                            </span>
                                            <span>{p.date || '2024'}</span>
                                        </div>
                                        <ul style={{ marginLeft: '18px', marginTop: '2px' }}>
                                            {p.description?.split('. ').filter(Boolean).map((line: string, i: number) => (
                                                <li key={i} style={{ fontSize: '10pt', marginBottom: '1px' }}>{line.trim()}{line.endsWith('.') ? '' : '.'}</li>
                                            ))}
                                            {p.link && (
                                                <li style={{ fontSize: '10pt' }}>Source Code: <a href={p.link} target="_blank" rel="noreferrer" style={{ color: '#000', textDecoration: 'underline' }}>GitHub Repository</a></li>
                                            )}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        )}

                        {portfolio?.certificates?.length > 0 && (
                            <div style={{ marginBottom: '10px' }}>
                                <h2 style={{ fontSize: '11pt', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #000', marginBottom: '6px' }}>Certifications</h2>
                                {portfolio.certificates.map((c: any) => (
                                    <div key={c._id} style={{ marginBottom: '6px' }}>
                                        <div className="item-header" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '10.5pt' }}>
                                            <span>{c.title} <span style={{ fontSize: '9pt' }}>🔗</span></span>
                                            <span>{c.date ? new Date(c.date).getFullYear() : '2024'}</span>
                                        </div>
                                        <div style={{ marginLeft: '15px', fontSize: '10pt', position: 'relative' }}>
                                            <span style={{ position: 'absolute', left: '-12px', top: '0' }}>☆</span>
                                            Certified in building applications using {c.issuer}.
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};


const Portfolio = () => {
    const { user } = useAuth();
    const [portfolio, setPortfolio] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null); 
    const [saved, setSaved] = useState<string | null>(null);
    const [showResume, setShowResume] = useState(false);
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [showCertModal, setShowCertModal] = useState(false);
    const [newSkill, setNewSkill] = useState('');
    const [expandedSection, setExpandedSection] = useState<string | null>('personal');

    
    const [personalForm, setPersonalForm] = useState({ city: '', state: '', country: '', bio: '' });
    const [academicForm, setAcademicForm] = useState({ college: '', branch: '', year: '', cgpa: '' });
    const [profilesForm, setProfilesForm] = useState({ github: '', linkedin: '', leetcode: '', codechef: '', hackerrank: '', website: '' });

    const [projectForm, setProjectForm] = useState({ title: '', description: '', link: '', techStack: '', date: '' });
    const [certForm, setCertForm] = useState({ title: '', issuer: '', date: '', link: '' });

    const load = async () => {
        try {
            const res = await api.get('/portfolio');
            const d = res.data;
            setPortfolio(d);
            setPersonalForm({ city: d.city || '', state: d.state || '', country: d.country || '', bio: d.bio || '' });
            setAcademicForm({ college: d.college || '', branch: d.branch || '', year: d.year || '', cgpa: d.cgpa || '' });
            setProfilesForm({ github: d.github || '', linkedin: d.linkedin || '', leetcode: d.leetcode || '', codechef: d.codechef || '', hackerrank: d.hackerrank || '', website: d.website || '' });
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { load(); }, []);

    const saveSection = async (sectionId: string, data: any) => {
        setSaving(sectionId);
        try {
            const res = await api.put('/portfolio/info', { ...portfolio, ...data });
            setPortfolio(res.data);
            setSaved(sectionId);
            setTimeout(() => setSaved(null), 2000);
        } catch (e) { console.error(e); }
        finally { setSaving(null); }
    };

    const toggle = useCallback((sec: string) => {
        setExpandedSection(prev => prev === sec ? null : sec);
    }, []);

    const addProject = async (e: React.FormEvent) => {
        e.preventDefault(); setSaving('projects');
        try {
            const res = await api.post('/portfolio/project', projectForm);
            setPortfolio(res.data);
            setShowProjectModal(false);
            setProjectForm({ title: '', description: '', link: '', techStack: '', date: '' });
        } catch (e) { console.error(e); } finally { setSaving(null); }
    };

    const deleteProject = async (id: string) => {
        try { const res = await api.delete(`/portfolio/project/${id}`); setPortfolio(res.data); } catch (e) { console.error(e); }
    };

    const addCert = async (e: React.FormEvent) => {
        e.preventDefault(); setSaving('certs');
        try {
            const res = await api.post('/portfolio/certificate', certForm);
            setPortfolio(res.data);
            setShowCertModal(false);
            setCertForm({ title: '', issuer: '', date: '', link: '' });
        } catch (e) { console.error(e); } finally { setSaving(null); }
    };

    const deleteCert = async (id: string) => {
        try { const res = await api.delete(`/portfolio/certificate/${id}`); setPortfolio(res.data); } catch (e) { console.error(e); }
    };

    const addSkill = () => {
        const trimmed = newSkill.trim();
        if (!trimmed || portfolio?.skills?.includes(trimmed)) { setNewSkill(''); return; }
        const skills = [...(portfolio?.skills || []), trimmed];
        setNewSkill('');
        saveSection('skills', { skills });
        setPortfolio((p: any) => ({ ...p, skills }));
    };

    const removeSkill = (skill: string) => {
        const skills = (portfolio?.skills || []).filter((s: string) => s !== skill);
        saveSection('skills', { skills });
        setPortfolio((p: any) => ({ ...p, skills }));
    };

    const SaveBtn = ({ sectionId, color = 'bg-primary-600 hover:bg-primary-700' }: any) => (
        <button onClick={() => saveSection(sectionId,
            sectionId === 'personal' ? personalForm :
                sectionId === 'academic' ? academicForm : profilesForm)}
            className={`mt-4 flex items-center gap-2 px-5 py-2 ${color} text-white rounded-xl font-bold text-sm transition-all`}>
            {saving === sectionId ? <Loader2 className="w-4 h-4 animate-spin" /> :
                saved === sectionId ? <><CheckCircle2 className="w-4 h-4" /> Saved!</> : 'Save'}
        </button>
    );

    if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>;

    return (
        <div className="space-y-4 max-w-3xl">
            {}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">My Portfolio</h1>
                    <p className="text-slate-500 font-medium text-sm">Click a section to expand and edit. Changes save when you press Save.</p>
                </div>
                <button onClick={() => setShowResume(true)}
                    className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-primary-600 transition-all shadow-lg shadow-slate-200">
                    <FileText className="w-4 h-4" /> Generate Resume
                </button>
            </div>

            {}
            <div className="bg-gradient-to-r from-primary-600 to-indigo-600 rounded-2xl p-5 flex items-center gap-4 text-white">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-xl font-black flex-shrink-0">{user?.name?.charAt(0)}</div>
                <div>
                    <h2 className="text-lg font-black">{user?.name}</h2>
                    <p className="text-white/70 text-sm">{user?.email}</p>
                    {portfolio?.bio && <p className="text-white/80 text-sm mt-0.5">{portfolio.bio}</p>}
                </div>
            </div>

            {}
            <Section id="personal" title="Personal Information" icon={User} color="text-blue-600" bg="bg-blue-50"
                expanded={expandedSection === 'personal'} onToggle={toggle} saving={saving === 'personal'}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                    <Field label="City" type="text" icon={MapPin} placeholder="Vadodara" value={personalForm.city} onChange={(e: any) => setPersonalForm(f => ({ ...f, city: e.target.value }))} />
                    <Field label="State" type="text" icon={MapPin} placeholder="Gujarat" value={personalForm.state} onChange={(e: any) => setPersonalForm(f => ({ ...f, state: e.target.value }))} />
                    <Field label="Country" type="text" icon={Globe} placeholder="India" value={personalForm.country} onChange={(e: any) => setPersonalForm(f => ({ ...f, country: e.target.value }))} />
                </div>
                <div className="mt-3">
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">Bio / Summary</label>
                    <textarea rows={3} placeholder="Brief professional summary..." value={personalForm.bio}
                        onChange={e => setPersonalForm(f => ({ ...f, bio: e.target.value }))}
                        className="w-full px-3 py-2.5 bg-slate-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-primary-600 outline-none text-slate-900 font-medium text-sm transition-all resize-none" />
                </div>
                <SaveBtn sectionId="personal" color="bg-blue-600 hover:bg-blue-700" />
            </Section>

            {}
            <Section id="academic" title="Academic Details" icon={BookOpen} color="text-violet-600" bg="bg-violet-50"
                expanded={expandedSection === 'academic'} onToggle={toggle} saving={saving === 'academic'}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                    <Field label="College / University" type="text" icon={BookOpen} placeholder="Parul University" value={academicForm.college} onChange={(e: any) => setAcademicForm(f => ({ ...f, college: e.target.value }))} />
                    <Field label="Branch / Course" type="text" icon={BookOpen} placeholder="B.Tech Computer Science" value={academicForm.branch} onChange={(e: any) => setAcademicForm(f => ({ ...f, branch: e.target.value }))} />
                    <Field label="Graduation Year" type="text" icon={BookOpen} placeholder="2025" value={academicForm.year} onChange={(e: any) => setAcademicForm(f => ({ ...f, year: e.target.value }))} />
                    <Field label="CGPA / Percentage" type="text" icon={BookOpen} placeholder="8.5 / 10" value={academicForm.cgpa} onChange={(e: any) => setAcademicForm(f => ({ ...f, cgpa: e.target.value }))} />
                </div>
                <SaveBtn sectionId="academic" color="bg-violet-600 hover:bg-violet-700" />
            </Section>

            {}
            <Section id="profiles" title="Social & Coding Profiles" icon={Code2} color="text-emerald-600" bg="bg-emerald-50"
                expanded={expandedSection === 'profiles'} onToggle={toggle} saving={saving === 'profiles'}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                    <Field label="GitHub" type="text" icon={Github} placeholder="github.com/username" value={profilesForm.github} onChange={(e: any) => setProfilesForm(f => ({ ...f, github: e.target.value }))} />
                    <Field label="LinkedIn" type="text" icon={Linkedin} placeholder="linkedin.com/in/name" value={profilesForm.linkedin} onChange={(e: any) => setProfilesForm(f => ({ ...f, linkedin: e.target.value }))} />
                    <Field label="LeetCode" type="text" icon={Code2} placeholder="leetcode.com/username" value={profilesForm.leetcode} onChange={(e: any) => setProfilesForm(f => ({ ...f, leetcode: e.target.value }))} />
                    <Field label="CodeChef" type="text" icon={Code2} placeholder="codechef.com/users/..." value={profilesForm.codechef} onChange={(e: any) => setProfilesForm(f => ({ ...f, codechef: e.target.value }))} />
                    <Field label="HackerRank" type="text" icon={Code2} placeholder="hackerrank.com/username" value={profilesForm.hackerrank} onChange={(e: any) => setProfilesForm(f => ({ ...f, hackerrank: e.target.value }))} />
                    <Field label="Website / Portfolio" type="text" icon={Globe} placeholder="https://yoursite.com" value={profilesForm.website} onChange={(e: any) => setProfilesForm(f => ({ ...f, website: e.target.value }))} />
                </div>
                <SaveBtn sectionId="profiles" color="bg-emerald-600 hover:bg-emerald-700" />
            </Section>

            {}
            <Section id="skills" title="Skills" icon={Tag} color="text-orange-600" bg="bg-orange-50"
                expanded={expandedSection === 'skills'} onToggle={toggle} saving={saving === 'skills'}>
                <div className="flex flex-wrap gap-2 mt-3 mb-3">
                    {!portfolio?.skills?.length
                        ? <p className="text-sm text-slate-400 font-medium">No skills yet. Add below.</p>
                        : portfolio.skills.map((s: string) => (
                            <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 text-sm font-bold rounded-full border border-orange-100">
                                {s}
                                <button onClick={() => removeSkill(s)} className="text-orange-400 hover:text-red-500 transition-colors"><X className="w-3.5 h-3.5" /></button>
                            </span>
                        ))}
                </div>
                <div className="flex gap-2">
                    <input type="text" placeholder="e.g. Python, React..." value={newSkill}
                        onChange={e => setNewSkill(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                        className="flex-1 px-4 py-2.5 bg-slate-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-orange-500 outline-none font-medium text-slate-900 text-sm transition-all" />
                    <button onClick={addSkill} disabled={!newSkill.trim()}
                        className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 text-white rounded-xl font-bold text-sm hover:bg-orange-600 transition-all disabled:opacity-50">
                        <Plus className="w-4 h-4" /> Add
                    </button>
                </div>
            </Section>

            {}
            <Section id="projects" title={`Projects (${portfolio?.projects?.length || 0})`} icon={FolderOpen} color="text-blue-600" bg="bg-blue-50"
                expanded={expandedSection === 'projects'} onToggle={toggle} saving={saving === 'projects'}>
                <div className="space-y-3 mt-3 mb-3">
                    {!portfolio?.projects?.length
                        ? <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-xl"><p className="text-slate-400 text-sm font-medium">No projects yet.</p></div>
                        : portfolio.projects.map((p: any) => (
                            <div key={p._id} className="flex items-start justify-between gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-black text-slate-900 text-sm">{p.title}</h3>
                                    {p.techStack && <p className="text-xs text-primary-600 font-bold">{p.techStack}</p>}
                                    {p.description && <p className="text-xs text-slate-500 mt-1">{p.description}</p>}
                                    {p.link && <a href={p.link} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-primary-600 font-bold mt-1 hover:underline"><ExternalLink className="w-3 h-3" />{p.link}</a>}
                                </div>
                                <button onClick={() => deleteProject(p._id)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        ))}
                </div>
                <button onClick={() => setShowProjectModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all">
                    <Plus className="w-4 h-4" /> Add Project
                </button>
            </Section>

            {}
            <Section id="certs" title={`Certificates (${portfolio?.certificates?.length || 0})`} icon={Award} color="text-amber-600" bg="bg-amber-50"
                expanded={expandedSection === 'certs'} onToggle={toggle} saving={saving === 'certs'}>
                <div className="space-y-3 mt-3 mb-3">
                    {!portfolio?.certificates?.length
                        ? <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-xl"><p className="text-slate-400 text-sm font-medium">No certificates yet.</p></div>
                        : portfolio.certificates.map((c: any) => (
                            <div key={c._id} className="flex items-start justify-between gap-3 p-4 bg-amber-50/50 rounded-xl border border-amber-100">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center flex-shrink-0"><Award className="w-4 h-4" /></div>
                                    <div>
                                        <h3 className="font-black text-slate-900 text-sm">{c.title}</h3>
                                        <p className="text-xs text-slate-500">{c.issuer}{c.date ? ` • ${new Date(c.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}` : ''}</p>
                                        {c.link && <a href={c.link} target="_blank" rel="noreferrer" className="text-xs text-primary-600 font-bold hover:underline">View →</a>}
                                    </div>
                                </div>
                                <button onClick={() => deleteCert(c._id)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        ))}
                </div>
                <button onClick={() => setShowCertModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-white rounded-xl font-bold text-sm hover:bg-amber-600 transition-all">
                    <Plus className="w-4 h-4" /> Add Certificate
                </button>
            </Section>

            {}
            {showResume && <ResumeModal portfolio={{ ...portfolio, ...personalForm, ...academicForm, ...profilesForm }} user={user} onClose={() => setShowResume(false)} />}

            {showProjectModal && (
                <Modal title="Add Project" onClose={() => setShowProjectModal(false)}>
                    <form onSubmit={addProject} className="space-y-3">
                        <Field label="Title *" icon={FolderOpen} type="text" placeholder="Project name" value={projectForm.title} onChange={(e: any) => setProjectForm(f => ({ ...f, title: e.target.value }))} />
                        <Field label="Date" icon={Calendar} type="text" placeholder="2024" value={projectForm.date} onChange={(e: any) => setProjectForm(f => ({ ...f, date: e.target.value }))} />
                        <Field label="Tech Stack" icon={Code2} type="text" placeholder="React, Node.js, MongoDB" value={projectForm.techStack} onChange={(e: any) => setProjectForm(f => ({ ...f, techStack: e.target.value }))} />
                        <Field label="Live Link / GitHub" icon={Globe} type="text" placeholder="https://..." value={projectForm.link} onChange={(e: any) => setProjectForm(f => ({ ...f, link: e.target.value }))} />
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">Description</label>
                            <textarea required rows={3} placeholder="What does this project do?" value={projectForm.description}
                                onChange={e => setProjectForm(f => ({ ...f, description: e.target.value }))}
                                className="w-full px-3 py-2.5 bg-slate-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-primary-600 outline-none font-medium text-sm resize-none transition-all" />
                        </div>
                        <button type="submit" disabled={saving === 'projects' || !projectForm.title}
                            className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                            {saving === 'projects' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Add Project'}
                        </button>
                    </form>
                </Modal>
            )}

            {showCertModal && (
                <Modal title="Add Certificate" onClose={() => setShowCertModal(false)}>
                    <form onSubmit={addCert} className="space-y-3">
                        <Field label="Certificate Title *" icon={Award} type="text" placeholder="AWS Cloud Practitioner" value={certForm.title} onChange={(e: any) => setCertForm(f => ({ ...f, title: e.target.value }))} />
                        <Field label="Issuing Organization" icon={Award} type="text" placeholder="Amazon Web Services" value={certForm.issuer} onChange={(e: any) => setCertForm(f => ({ ...f, issuer: e.target.value }))} />
                        <Field label="Certificate Link" icon={Globe} type="text" placeholder="https://..." value={certForm.link} onChange={(e: any) => setCertForm(f => ({ ...f, link: e.target.value }))} />
                        <Field label="Date" icon={Award} type="date" value={certForm.date} onChange={(e: any) => setCertForm(f => ({ ...f, date: e.target.value }))} />
                        <button type="submit" disabled={saving === 'certs' || !certForm.title}
                            className="w-full bg-amber-500 text-white py-3 rounded-xl font-bold hover:bg-amber-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                            {saving === 'certs' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Add Certificate'}
                        </button>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default Portfolio;
