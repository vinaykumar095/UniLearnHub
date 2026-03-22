import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, PlayCircle, Loader2, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/client';

const MyLearning = () => {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchEnrolledCourses = async () => {
        try {
            const response = await api.get('/courses/enrolled');
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching enrolled courses:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEnrolledCourses();
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
                    <h1 className="text-2xl font-bold text-slate-900">My Learning Portal</h1>
                    <p className="text-slate-500">Track your progress and access your course materials.</p>
                </div>
                <div className="hidden md:flex items-center space-x-4">
                    <div className="px-4 py-2 bg-yellow-50 text-yellow-700 rounded-xl border border-yellow-100 flex items-center gap-2">
                        <Trophy className="w-5 h-5" />
                        <span className="font-bold text-sm">Level 4 Scholar</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course, index) => (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        key={course._id}
                        className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl hover:shadow-primary-100/20 transition-all"
                    >
                        <div className="h-40 bg-slate-100 relative overflow-hidden">
                            <div className="absolute inset-0 bg-primary-600/10 transition-colors group-hover:bg-primary-600/20" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <BookOpen className="w-16 h-16 text-primary-200" />
                            </div>
                            <div className="absolute bottom-4 left-4 right-4 h-1 bg-white/30 rounded-full overflow-hidden">
                                <div className="h-full bg-primary-500 w-1/3" />
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-slate-900 mb-2 truncate">{course.title}</h3>
                            <p className="text-sm text-slate-500 mb-6">By {course.facultyId?.name || 'Academic Expert'}</p>

                            <Link
                                to={`/dashboard/learning/${course._id}`}
                                className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-2xl font-bold hover:bg-primary-600 transition-colors group"
                            >
                                <PlayCircle className="w-5 h-5 transition-transform group-hover:scale-110" />
                                Continue Learning
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>

            {courses.length === 0 && (
                <div className="p-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <BookOpen className="w-10 h-10 text-slate-300" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">No active enrollments</h2>
                    <p className="text-slate-500 mb-8 max-w-sm mx-auto">Start your learning journey by exploring courses from our premier partner colleges.</p>
                    <Link to="/dashboard/courses" className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all inline-block text-left">
                        Explore Courses
                    </Link>
                </div>
            )}
        </div>
    );
};

export default MyLearning;
