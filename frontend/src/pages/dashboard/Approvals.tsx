import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import api from '../../api/client';

const Approvals = () => {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPendingCourses = async () => {
        try {
            const response = await api.get('/courses?status=pending');
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingCourses();
    }, []);

    const updateStatus = async (id: string, status: string) => {
        try {
            await api.patch(`/courses/${id}/approve`, { status });
            setCourses(courses.filter(c => c.id !== id));
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-black text-slate-900">Academic Approvals</h1>
                <p className="text-slate-500 font-medium">Review and verify new course submissions from faculty.</p>
            </div>

            {courses.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center text-slate-500">
                    <CheckCircle className="w-12 h-12 text-green-200 mx-auto mb-4" />
                    <p className="text-lg font-medium">No pending approvals</p>
                    <p className="text-sm">All faculty courses have been processed.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {courses.map((course, index) => (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            key={course.id}
                            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
                        >
                            <div className="flex items-center space-x-6">
                                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600">
                                    <BookOpen className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">{course.title}</h3>
                                    <p className="text-slate-500 font-medium">Faculty: {course.faculty?.name || 'Unknown'}</p>
                                    <div className="flex items-center mt-2 text-xs text-slate-400">
                                        <Clock className="w-3 h-3 mr-1" />
                                        Submitted on {new Date().toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => updateStatus(course.id, 'approved')}
                                    className="flex items-center space-x-2 bg-green-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-lg shadow-green-100"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    <span>Approve</span>
                                </button>
                                <button
                                    onClick={() => updateStatus(course.id, 'rejected')}
                                    className="flex items-center space-x-2 bg-white text-red-600 border border-red-100 px-6 py-2.5 rounded-xl font-semibold hover:bg-red-50 transition-colors"
                                >
                                    <XCircle className="w-4 h-4" />
                                    <span>Reject</span>
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Approvals;
