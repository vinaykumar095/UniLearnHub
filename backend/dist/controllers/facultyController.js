"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGuidanceHistory = exports.updateCourseMaterials = exports.getCourseStudents = exports.provideGuidance = exports.getStudentProgress = exports.getFacultyDashboard = void 0;
const Course_1 = __importDefault(require("../models/Course"));
const Enrollment_1 = __importDefault(require("../models/Enrollment"));
const Submission_1 = __importDefault(require("../models/Submission"));
const User_1 = __importDefault(require("../models/User"));
const Assignment_1 = __importDefault(require("../models/Assignment"));
const Notification_1 = __importDefault(require("../models/Notification"));
const getFacultyDashboard = async (req, res) => {
    try {
        const facultyId = req.user.id;
        const totalCourses = await Course_1.default.countDocuments({ facultyId });
        const facultyCourses = await Course_1.default.find({ facultyId });
        const courseIds = facultyCourses.map(c => c._id);
        const enrollments = await Enrollment_1.default.find({ courseId: { $in: courseIds } });
        const uniqueStudents = new Set(enrollments.map(e => e.studentId.toString()));
        const totalStudents = uniqueStudents.size;
        const assignments = await Assignment_1.default.find({ courseId: { $in: courseIds } });
        const assignmentIds = assignments.map(a => a._id);
        const recentSubmissions = await Submission_1.default.find({
            assignmentId: { $in: assignmentIds }
        }).sort({ createdAt: -1 }).limit(10).populate('studentId', 'name email branch year');
        const facultyNotifications = await Notification_1.default.find({ userId: facultyId })
            .sort({ createdAt: -1 })
            .limit(5);
        const upcomingDeadlines = await Assignment_1.default.find({
            courseId: { $in: courseIds },
            deadline: { $gt: new Date() }
        }).sort({ deadline: 1 }).limit(5).populate('courseId', 'title');
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
            activeStudentsToday: recentSubmissions.length,
            recentSubmissions: recentSubmissions.map(s => ({
                id: s._id,
                studentName: s.studentId?.name,
                studentBranch: s.studentId?.branch,
                date: s.createdAt
            })),
            facultyNotifications: facultyNotifications.map(n => ({
                id: n._id,
                message: n.message,
                date: n.createdAt,
                read: n.read
            })),
            upcomingDeadlines: upcomingDeadlines.map(a => ({
                id: a._id,
                title: a.title,
                courseTitle: a.courseId?.title,
                deadline: a.deadline
            })),
            progressStats
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching faculty dashboard', error });
    }
};
exports.getFacultyDashboard = getFacultyDashboard;
const Guidance_1 = __importDefault(require("../models/Guidance"));
const getStudentProgress = async (req, res) => {
    try {
        const facultyId = req.user.id;
        const facultyCourses = await Course_1.default.find({ facultyId });
        const courseIds = facultyCourses.map(c => c._id);
        const enrollments = await Enrollment_1.default.find({ courseId: { $in: courseIds } })
            .populate('studentId', 'name email branch year skills projects bio experience github linkedin leetcode')
            .populate('courseId', 'title');
        const studentData = enrollments.map(e => ({
            id: e._id,
            studentId: e.studentId?._id,
            studentName: e.studentId?.name,
            studentEmail: e.studentId?.email,
            studentBio: e.studentId?.bio,
            courseTitle: e.courseId?.title,
            progress: e.progress,
            milestones: e.milestones || [],
            skills: e.studentId?.skills || [],
            projects: e.studentId?.projects || [],
            experience: e.studentId?.experience,
            branch: e.studentId?.branch,
            year: e.studentId?.year,
            socials: {
                github: e.studentId?.github,
                linkedin: e.studentId?.linkedin,
                leetcode: e.studentId?.leetcode
            }
        }));
        res.json(studentData);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching student progress', error });
    }
};
exports.getStudentProgress = getStudentProgress;
const provideGuidance = async (req, res) => {
    try {
        const { type, content, studentId, courseId, impacts, isBroadcast } = req.body;
        const facultyId = req.user.id;
        const { createNotification } = require('./notificationController');
        let message = '';
        if (type === 'CAREER_PATH')
            message = `Faculty Suggestion: Explore ${content} career path.`;
        else if (type === 'SKILL_RECOMMENDATION')
            message = `Faculty Recommendation: Learn ${content} for better placement.`;
        else
            message = `Faculty Guidance: ${content}`;
        if (isBroadcast || !studentId) {
            const collegeId = req.user.collegeId;
            const students = await User_1.default.find({
                role: { $regex: /^student$/i },
                collegeId: collegeId
            }).distinct('_id');
            for (const sid of students) {
                await Guidance_1.default.create({
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
        const guidance = await Guidance_1.default.create({
            facultyId,
            studentId,
            courseId,
            type,
            content,
            impacts: impacts || { dashboard: true, roadmap: true }
        });
        await createNotification(studentId, message);
        res.status(200).json({ message: 'Guidance sent successfully', guidance });
    }
    catch (error) {
        res.status(500).json({ message: 'Error providing guidance', error });
    }
};
exports.provideGuidance = provideGuidance;
const getCourseStudents = async (req, res) => {
    try {
        const { id } = req.params;
        const enrollments = await Enrollment_1.default.find({ courseId: id })
            .populate('studentId', 'name email branch year skills');
        const studentData = enrollments.map(e => ({
            id: e._id,
            studentId: e.studentId?._id,
            studentName: e.studentId?.name,
            studentEmail: e.studentId?.email,
            progress: e.progress,
            skills: e.studentId?.skills || [],
            branch: e.studentId?.branch,
            year: e.studentId?.year
        }));
        res.json(studentData);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching course students', error });
    }
};
exports.getCourseStudents = getCourseStudents;
const updateCourseMaterials = async (req, res) => {
    try {
        const { id } = req.params;
        const { materials } = req.body;
        const course = await Course_1.default.findByIdAndUpdate(id, { materials }, { returnDocument: 'after' });
        res.json(course);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating materials', error });
    }
};
exports.updateCourseMaterials = updateCourseMaterials;
const getGuidanceHistory = async (req, res) => {
    try {
        const facultyId = req.user.id;
        const guidances = await Guidance_1.default.find({ facultyId })
            .populate('studentId', 'name branch year')
            .sort({ createdAt: -1 })
            .limit(20);
        res.json(guidances);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching guidance history', error });
    }
};
exports.getGuidanceHistory = getGuidanceHistory;
