"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentDashboard = exports.getCollegeApplications = exports.getStudentApplications = exports.updateApplicationStatus = exports.getJobApplicants = exports.getRecruiterJobs = exports.applyForJob = exports.getJobs = exports.createJob = void 0;
const Job_1 = __importDefault(require("../models/Job"));
const Application_1 = __importDefault(require("../models/Application"));
const Enrollment_1 = __importDefault(require("../models/Enrollment"));
const PlacementPrep_1 = __importDefault(require("../models/PlacementPrep"));
const Assignment_1 = __importDefault(require("../models/Assignment"));
const Submission_1 = __importDefault(require("../models/Submission"));
const User_1 = __importStar(require("../models/User"));
const createJob = async (req, res) => {
    try {
        const { title, description, recruiterId, collegeIds, eligibility, deadline, company, companyLogo, location, jobType, workMode, salary, experienceLevel, skillsRequired, requirements } = req.body;
        const job = await Job_1.default.create({
            title,
            description,
            company,
            companyLogo,
            location,
            jobType,
            workMode,
            salary,
            experienceLevel,
            skillsRequired: Array.isArray(skillsRequired) ? skillsRequired : (skillsRequired ? skillsRequired.split(',').map((s) => s.trim()) : []),
            recruiterId,
            eligibility,
            requirements,
            deadline: new Date(deadline),
            colleges: collegeIds || []
        });
        const { notifyStudents } = require('./notificationController');
        if (collegeIds && collegeIds.length > 0) {
            for (const cid of collegeIds) {
                await notifyStudents(`New job opening: ${title}`, cid);
            }
        }
        else {
            await notifyStudents(`New global job opening: ${title}`);
        }
        res.status(201).json(job);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating job', error });
    }
};
exports.createJob = createJob;
const getJobs = async (req, res) => {
    try {
        const user = req.user;
        let query = {};
        const filterCollegeId = (user?.role === User_1.Role.COLLEGE_ADMIN || user?.role === User_1.Role.STUDENT)
            ? user.collegeId
            : req.query.collegeId;
        if (filterCollegeId) {
            query.$or = [
                { colleges: filterCollegeId },
                { colleges: { $size: 0 } },
                { colleges: { $exists: false } }
            ];
        }
        const jobs = await Job_1.default.find(query)
            .populate('recruiterId', 'name company')
            .populate('colleges', 'name');
        const formattedJobs = jobs.map(job => {
            const obj = job.toObject();
            return {
                id: obj._id,
                title: obj.title,
                description: obj.description,
                company: obj.company || obj.recruiterId?.company || 'Unknown',
                companyLogo: obj.companyLogo,
                location: obj.location,
                jobType: obj.jobType,
                workMode: obj.workMode,
                salary: obj.salary,
                experienceLevel: obj.experienceLevel,
                skillsRequired: obj.skillsRequired,
                recruiter: obj.recruiterId ? { name: obj.recruiterId.name } : null,
                colleges: obj.colleges.map((c) => ({ name: c.name })),
                eligibility: obj.eligibility,
                requirements: obj.requirements,
                deadline: obj.deadline
            };
        });
        res.json(formattedJobs);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching jobs', error });
    }
};
exports.getJobs = getJobs;
const applyForJob = async (req, res) => {
    try {
        const { jobId, resumeUrl, portfolioLink, coverLetter } = req.body;
        const studentId = req.user.id;
        const existing = await Application_1.default.findOne({ jobId, studentId });
        if (existing) {
            return res.status(400).json({ message: 'You have already applied for this job' });
        }
        const application = await Application_1.default.create({
            jobId,
            studentId,
            resumeUrl,
            portfolioLink,
            coverLetter
        });
        const job = await Job_1.default.findById(jobId);
        const student = await User_1.default.findById(studentId).select('name');
        if (job && student) {
            const { createNotification } = require('./notificationController');
            await createNotification(job.recruiterId, `[💼 APPLICATION] ${student.name} has applied for your job: ${job.title}`);
        }
        res.status(201).json(application);
    }
    catch (error) {
        res.status(500).json({ message: 'Error applying for job', error });
    }
};
exports.applyForJob = applyForJob;
const getRecruiterJobs = async (req, res) => {
    try {
        const recruiterId = req.user.id;
        const jobs = await Job_1.default.find({ recruiterId })
            .populate('colleges', 'name');
        res.json(jobs);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching recruiter jobs', error });
    }
};
exports.getRecruiterJobs = getRecruiterJobs;
const getJobApplicants = async (req, res) => {
    try {
        const { jobId } = req.params;
        const applications = await Application_1.default.find({ jobId })
            .populate('studentId', 'name email collegeId');
        res.json(applications);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching applicants', error });
    }
};
exports.getJobApplicants = getJobApplicants;
const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const application = await Application_1.default.findByIdAndUpdate(id, { status }, { returnDocument: 'after' })
            .populate({ path: 'jobId', select: 'title company' });
        if (application) {
            const { createNotification } = require('./notificationController');
            await createNotification(application.studentId, `Your application for "${application.jobId.title}" has been ${status}.`);
        }
        res.json(application);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating application status', error });
    }
};
exports.updateApplicationStatus = updateApplicationStatus;
const getStudentApplications = async (req, res) => {
    try {
        const studentId = req.user.id;
        const applications = await Application_1.default.find({ studentId })
            .populate('jobId', 'title description eligibility deadline')
            .sort({ createdAt: -1 });
        res.json(applications);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching applications', error });
    }
};
exports.getStudentApplications = getStudentApplications;
const getCollegeApplications = async (req, res) => {
    try {
        const collegeId = req.user.collegeId;
        if (!collegeId)
            return res.status(400).json({ message: 'College ID required' });
        const students = await User_1.default.find({ collegeId, role: User_1.Role.STUDENT }).select('_id');
        const studentIds = students.map(s => s._id);
        const applications = await Application_1.default.find({ studentId: { $in: studentIds } })
            .populate('studentId', 'name email branch year')
            .populate('jobId', 'title company')
            .sort({ createdAt: -1 });
        res.json(applications);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching college applications', error });
    }
};
exports.getCollegeApplications = getCollegeApplications;
const Guidance_1 = __importDefault(require("../models/Guidance"));
const AptitudeStatus_1 = __importDefault(require("../models/AptitudeStatus"));
const DSASubmission_1 = __importDefault(require("../models/DSASubmission"));
const getStudentDashboard = async (req, res) => {
    try {
        const studentId = req.user.id;
        const guidances = await Guidance_1.default.find({ studentId, status: 'active', 'impacts.dashboard': true })
            .populate('facultyId', 'name')
            .sort({ createdAt: -1 })
            .limit(3);
        const enrolledCount = await Enrollment_1.default.countDocuments({ studentId });
        const completedCoursesCount = await Enrollment_1.default.countDocuments({ studentId, progress: 100 });
        const appliedCount = await Application_1.default.countDocuments({ studentId });
        const pendingApplicationsCount = await Application_1.default.countDocuments({ studentId, status: { $in: ['pending', 'applied'] } });
        const aptitudeCompletedCount = await AptitudeStatus_1.default.countDocuments({ studentId, status: 'completed' });
        const dsaSolvedCount = await DSASubmission_1.default.countDocuments({ studentId, status: 'solved' });
        const totalPlatformsItems = 120 + 36;
        const masteryIndex = Math.round(((dsaSolvedCount + aptitudeCompletedCount) / totalPlatformsItems) * 100);
        const enrollments = await Enrollment_1.default.find({ studentId })
            .populate({ path: 'courseId', populate: { path: 'facultyId', select: 'name' } });
        const enrolledCourseIds = enrollments.map(e => e.courseId._id);
        const allAssignments = await Assignment_1.default.find({ courseId: { $in: enrolledCourseIds } });
        const submissions = await Submission_1.default.find({ studentId }).select('assignmentId');
        const submittedIds = submissions.map(s => s.assignmentId.toString());
        const pendingAssignments = allAssignments.filter(a => !submittedIds.includes(a._id.toString()));
        const learningProgress = enrollments.map(e => ({
            id: e.courseId._id,
            title: e.courseId.title,
            progress: e.progress,
            faculty: e.courseId.facultyId?.name
        }));
        const placementAttempts = await PlacementPrep_1.default.find({ studentId }).sort({ createdAt: -1 }).limit(10);
        const avgScore = placementAttempts.length
            ? Math.round(placementAttempts.reduce((s, a) => s + (a.score / a.total) * 100, 0) / placementAttempts.length)
            : 0;
        const upcomingJobs = await Job_1.default.find({
            $or: [{ colleges: req.user.collegeId }, { colleges: { $size: 0 } }],
            deadline: { $gte: new Date() }
        }).sort({ deadline: 1 }).limit(3);
        const upcomingDeadlines = [
            ...pendingAssignments.map(a => ({ type: 'ASSIGNMENT', title: a.title, deadline: a.deadline })),
            ...upcomingJobs.map(j => ({ type: 'JOB', title: j.title, deadline: j.deadline }))
        ].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()).slice(0, 5);
        const recentActivity = [
            ...placementAttempts.map(a => ({ type: 'QUIZ', title: a.module, date: a.createdAt, score: a.score })),
            ...(await Application_1.default.find({ studentId }).populate('jobId', 'title').sort({ createdAt: -1 }).limit(5)).map(app => ({
                type: 'APPLICATION',
                title: app.jobId.title,
                date: app.createdAt
            })),
            ...enrollments.slice(0, 5).map(e => ({ type: 'ENROLLMENT', title: e.courseId.title, date: e.createdAt }))
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);
        const studentInfo = await User_1.default.findById(studentId).populate('collegeId', 'name');
        res.json({
            student: {
                name: studentInfo?.name,
                college: studentInfo?.collegeId?.name,
                branch: studentInfo?.branch,
                year: studentInfo?.year,
                role: studentInfo?.role
            },
            stats: {
                enrolledCourses: enrolledCount,
                completedCourses: completedCoursesCount,
                pendingAssignmentsCount: pendingAssignments.length + pendingApplicationsCount,
                jobsApplied: appliedCount,
                aptitudeCompleted: aptitudeCompletedCount,
                masteryIndex: masteryIndex
            },
            avgPlacementScore: avgScore,
            learningProgress,
            upcomingDeadlines,
            recentActivity,
            guidances
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching dashboard stats', error });
    }
};
exports.getStudentDashboard = getStudentDashboard;
