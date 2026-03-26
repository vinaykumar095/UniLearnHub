import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, Linkedin, Twitter, Instagram, ChevronRight } from 'lucide-react';

const StudentFooter = () => {
    return (
        <footer className="bg-slate-900 text-white mt-20 pt-20 pb-10 rounded-t-[3rem]">
            <div className="max-w-7xl mx-auto px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                    {}
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-primary-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-primary-500/20">
                                <GraduationCap className="w-10 h-10" />
                            </div>
                            <span className="text-4xl font-black tracking-tighter">UniLearnHub</span>
                        </div>
                        <p className="text-slate-400 text-lg leading-relaxed font-medium">
                            The ultimate platform for modern education, bridge the gap between learning and your dream career.
                        </p>
                        <div className="flex gap-4">
                            {[Linkedin, Twitter, Instagram].map((Icon, idx) => (
                                <button key={idx} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-primary-600 hover:scale-110 transition-all duration-300 group">
                                    <Icon className="w-5 h-5 text-slate-400 group-hover:text-white" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {}
                    <div className="space-y-8">
                        <h4 className="text-xl font-black">Quick Links</h4>
                        <nav className="flex flex-col gap-4">
                            {[
                                { name: 'Dashboard', path: '/dashboard' },
                                { name: 'My Portfolio', path: '/dashboard/portfolio' },
                                { name: 'Explore Courses', path: '/dashboard/courses' },
                                { name: 'Career Roadmap', path: '/dashboard/roadmap' },
                                { name: 'Placement Prep', path: '/dashboard/placement' },
                                { name: 'Job Career', path: '/dashboard/career' },
                            ].map((link) => (
                                <Link key={link.name} to={link.path} className="text-slate-400 hover:text-white flex items-center group font-bold tracking-wide">
                                    <ChevronRight className="w-5 h-5 text-primary-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all mr-0 group-hover:mr-2" />
                                    {link.name}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {}
                    <div className="space-y-8">
                        <h4 className="text-xl font-black">Resources</h4>
                        <nav className="flex flex-col gap-4">
                            {['Documentation', 'Community', 'FAQ', 'Support', 'Terms of Service'].map((link) => (
                                <button key={link} className="text-left text-slate-400 hover:text-white font-bold tracking-wide">
                                    {link}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {}
                    <div className="space-y-8">
                        <h4 className="text-xl font-black">Get in Touch</h4>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 group cursor-pointer">
                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                                    <Mail className="w-5 h-5 text-primary-400 group-hover:text-white" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Email Us</p>
                                    <p className="font-bold text-slate-200">support@unilearnhub.com</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group cursor-pointer">
                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                                    <Phone className="w-5 h-5 text-primary-400 group-hover:text-white" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Call Anytime</p>
                                    <p className="font-bold text-slate-200">+1 234 567 890</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-500 font-bold">
                        &copy; {new Date().getFullYear()} UniLearnHub. Built for Excellence.
                    </p>
                    <div className="flex gap-10">
                        <button className="text-slate-500 hover:text-white font-bold text-sm">Privacy Policy</button>
                        <button className="text-slate-500 hover:text-white font-bold text-sm">Cookie Settings</button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default StudentFooter;
