import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import Course from '../models/Course';
import Enrollment from '../models/Enrollment';
import Submission from '../models/Submission';
import User from '../models/User';
import Assignment from '../models/Assignment';
import Notification from '../models/Notification';
import { AuthRequest } from '../middlewares/auth';

export const getFacultyDashboard = async (req: AuthRequest, res: ExpressResponse) => {
    try {
        const facultyId = req.user!.id;

        // 1. Total Courses Created
        const totalCourses = await Course.countDocuments({ facultyId });

        // 2. Fetch Faculty Courses for aggregation
        const facultyCourses = await Course.find({ facultyId });
        const courseIds = facultyCourses.map(c => c._id);

        // 3. Students Enrolled (Unique students across all courses)
        const enrollments = await Enrollment.find({ courseId: { $in: courseIds } });
        const uniqueStudents = new Set(enrollments.map(e => e.studentId.toString()));
        const totalStudents = uniqueStudents.size;

        // 4. Recently Active Students (Approximated by submissions)
        const assignments = await Assignment.find({ courseId: { $in: courseIds } });
        const assignmentIds = assignments.map(a => a._id);
        const recentSubmissions = await Submission.find({
            assignmentId: { $in: assignmentIds }
        }).sort({ createdAt: -1 }).limit(10).populate('studentId', 'name email branch year');

        // 5. Faculty Notifications
        const facultyNotifications = await Notification.find({ userId: facultyId })
            .sort({ createdAt: -1 })
            .limit(5);

        // 6. Upcoming Deadlines
        const upcomingDeadlines = await Assignment.find({
            courseId: { $in: courseIds },
            deadline: { $gt: new Date() }
        }).sort({ deadline: 1 }).limit(5).populate('courseId', 'title');

        // 7. Course Progress Statistics
        const progressStats = facultyCourses.map(course => {
            const courseEnrollments = enrollments.filter(e => e.courseId.toString() === course._id.toString());
            const avgProgress = courseEnrollments.length
                ? Math.round(courseEnrollments.reduce((sum, e) => sum + e.progress, 0) / courseEnrollments.length)
                : 0;
            return {
                id: course._id,
                title: course.title,
                enrolled: courseEnrollments.length,
                avgProgress
            };
        });

        res.json({
            totalCourses,
            totalStudents,
            activeStudentsToday: recentSubmissions.length, // approximation
            recentSubmissions: recentSubmissions.map(s => ({
                id: s._id,
                studentName: (s.studentId as any)?.name,
                studentBranch: (s.studentId as any)?.branch,
                date: (s as any).createdAt
            })),
            facultyNotifications: facultyNotifications.map(n => ({
                id: n._id,
                message: n.message,
                date: (n as any).createdAt,
                read: n.read
            })),
            upcomingDeadlines: upcomingDeadlines.map(a => ({
                id: a._id,
                title: a.title,
                courseTitle: (a.courseId as any)?.title,
                deadline: a.deadline
            })),
            progressStats
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching faculty dashboard', error });
    }
};

import Guidance from '../models/Guidance';

export const getStudentProgress = async (req: AuthRequest, res: ExpressResponse) => {
    try {
        const facultyId = req.user!.id;
        const facultyCourses = await Course.find({ facultyId });
        const courseIds = facultyCourses.map(c => c._id);

        const enrollments = await Enrollment.find({ courseId: { $in: courseIds } })
            .populate('studentId', 'name email branch year skills projects bio experience github linkedin leetcode')
            .populate('courseId', 'title');

        const studentData = enrollments.map(e => ({
            id: e._id,
            studentId: (e.studentId as any)?._id,
            studentName: (e.studentId as any)?.name,
            studentEmail: (e.studentId as any)?.email,
            studentBio: (e.studentId as any)?.bio,
            courseTitle: (e.courseId as any)?.title,
            progress: e.progress,
            milestones: (e as any).milestones || [],
            skills: (e.studentId as any)?.skills || [],
            projects: (e.studentId as any)?.projects || [],
            experience: (e.studentId as any)?.experience,
            branch: (e.studentId as any)?.branch,
            year: (e.studentId as any)?.year,
            socials: {
                github: (e.studentId as any)?.github,
                linkedin: (e.studentId as any)?.linkedin,
                leetcode: (e.studentId as any)?.leetcode
            }
        }));

        res.json(studentData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching student progress', error });
    }
};

export const provideGuidance = async (req: AuthRequest, res: ExpressResponse) => {
    try {
        const { type, content, studentId, courseId, impacts, isBroadcast } = req.body;
        const facultyId = req.user!.id;

        const { createNotification } = require('./notificationController');
        let message = '';
        if (type === 'CAREER_PATH') message = `Faculty Suggestion: Explore ${content} career path.`;
        else if (type === 'SKILL_RECOMMENDATION') message = `Faculty Recommendation: Learn ${content} for better placement.`;
        else message = `Faculty Guidance: ${content}`;

        if (isBroadcast || !studentId) {
            // Find students belonging to the same college as the faculty
            const collegeId = (req as any).user.collegeId;
            const students = await User.find({ 
                role: { $regex: /^student$/i },
                collegeId: collegeId
            }).distinct('_id');
            
            for (const sid of students) {
                await Guidance.create({
                    facultyId,
                    studentId: sid,
                    courseId,
                    type,
                    content,
                    impacts: impacts || { dashboard: true, roadmap: true }
                });
                await createNotification(sid, message);
            }
            return res.status(200).json({ message: 'Broadcast guidance sent successfully' });
        }

        const guidance = await Guidance.create({
            facultyId,
            studentId,
            courseId,
            type,
            content,
            impacts: impacts || { dashboard: true, roadmap: true }
        });

        await createNotification(studentId, message);
        res.status(200).json({ message: 'Guidance sent successfully', guidance });
    } catch (error) {
        res.status(500).json({ message: 'Error providing guidance', error });
    }
};

export const getCourseStudents = async (req: AuthRequest, res: ExpressResponse) => {
    try {
        const { id } = req.params;
        const enrollments = await Enrollment.find({ courseId: id })
            .populate('studentId', 'name email branch year skills');

        const studentData = enrollments.map(e => ({
            id: e._id,
            studentId: (e.studentId as any)?._id,
            studentName: (e.studentId as any)?.name,
            studentEmail: (e.studentId as any)?.email,
            progress: e.progress,
            skills: (e.studentId as any)?.skills || [],
            branch: (e.studentId as any)?.branch,
            year: (e.studentId as any)?.year
        }));

        res.json(studentData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching course students', error });
    }
};

export const updateCourseMaterials = async (req: AuthRequest, res: ExpressResponse) => {
    try {
        const { id } = req.params;
        const { materials } = req.body;
        const course = await Course.findByIdAndUpdate(id, { materials }, { returnDocument: 'after' });
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: 'Error updating materials', error });
    }
};

export const getGuidanceHistory = async (req: AuthRequest, res: ExpressResponse) => {
    try {
        const facultyId = req.user!.id;
        const guidances = await Guidance.find({ facultyId })
            .populate('studentId', 'name branch year')
            .sort({ createdAt: -1 })
            .limit(20);
        res.json(guidances);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching guidance history', error });
    }
};
