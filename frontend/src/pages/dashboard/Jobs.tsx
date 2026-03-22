import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Calendar, Loader2, Plus } from 'lucide-react';
import api from '../../api/client';

const Jobs = () => {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await api.get('/jobs');
                setJobs(response.data);
            } catch (error) {
                console.error('Error fetching jobs:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
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
                    <h1 className="text-2xl font-bold text-slate-900">Career Opportunities</h1>
                    <p className="text-slate-500">Discover jobs and internships from top recruiters.</p>
                </div>
                <button className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-xl shadow-lg shadow-primary-200">
                    <Plus className="w-5 h-5" />
                    <span className="font-semibold">Post Job</span>
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {jobs.map((job, index) => (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={job._id}
                        className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                        <div className="flex items-center space-x-6">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-primary-600">
                                <Briefcase className="w-8 h-8" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-xl font-bold text-slate-900">{job.title}</h3>
                                <p className="text-slate-500 font-medium">{job.recruiterId?.name || 'Recruiter'}</p>
                                <div className="flex flex-wrap gap-4 mt-2">
                                    <span className="flex items-center text-xs text-slate-400"><MapPin className="w-3 h-3 mr-1" /> Remote / On-site</span>
                                    <span className="flex items-center text-xs text-slate-400"><Calendar className="w-3 h-3 mr-1" /> Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                        <button className="bg-slate-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors">
                            Apply Now
                        </button>
                    </motion.div>
                ))}
            </div>
            {jobs.length === 0 && (
                <div className="p-12 text-center text-slate-500">
                    No job openings at the moment.
                </div>
            )}
        </div>
    );
};

export default Jobs;
