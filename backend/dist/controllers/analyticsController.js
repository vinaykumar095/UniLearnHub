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
exports.getCollegeStats = exports.getPlatformStats = void 0;
const College_1 = __importDefault(require("../models/College"));
const User_1 = __importStar(require("../models/User"));
const Course_1 = __importDefault(require("../models/Course"));
const Job_1 = __importDefault(require("../models/Job"));
const PlacementDrive_1 = __importDefault(require("../models/PlacementDrive"));
const getPlatformStats = async (req, res) => {
    try {
        const now = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const getVelocity = async (days) => {
            const start = new Date();
            start.setDate(start.getDate() - days);
            return await User_1.default.countDocuments({
                createdAt: { $gte: start },
                status: { $ne: 'deleted' }
            });
        };
        const enrollmentVelocity = {
            daily: await getVelocity(1),
            weekly: await getVelocity(7),
            monthly: await getVelocity(30),
            yearly: await getVelocity(365)
        };
        const branches = await User_1.default.aggregate([
            {
                $match: {
                    role: User_1.Role.STUDENT,
                    status: { $ne: 'deleted' },
                    branch: { $exists: true, $ne: null }
                }
            },
            { $group: { _id: "$branch", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        const totalStudents = await User_1.default.countDocuments({ role: User_1.Role.STUDENT, status: { $ne: 'deleted' } });
        const institutionalPulse = branches.map(b => ({
            name: b._id,
            percentage: totalStudents > 0 ? Math.round((b.count / totalStudents) * 100) : 0
        }));
        const recruiterTrends = await Job_1.default.aggregate([
            { $match: { createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) } } },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);
        const registrationActivity = await User_1.default.find({ status: { $ne: 'deleted' } })
            .sort({ createdAt: -1 })
            .limit(10)
            .select('name email role createdAt status');
        const activeCollegesCount = await College_1.default.countDocuments({ status: 'active' });
        const stats = {
            colleges: await College_1.default.countDocuments({ status: { $ne: 'deleted' } }),
            activeColleges: activeCollegesCount,
            newColleges: await College_1.default.countDocuments({
                status: { $ne: 'deleted' },
                createdAt: { $gte: thirtyDaysAgo }
            }),
            students: totalStudents,
            faculty: await User_1.default.countDocuments({ role: User_1.Role.FACULTY, status: { $ne: 'deleted' } }),
            recruiters: {
                total: await User_1.default.countDocuments({ role: User_1.Role.RECRUITER, status: { $ne: 'deleted' } }),
                active: await User_1.default.countDocuments({ role: User_1.Role.RECRUITER, status: 'active' }),
                pending: await User_1.default.countDocuments({ role: User_1.Role.RECRUITER, status: 'pending' }),
                new: await User_1.default.countDocuments({
                    role: User_1.Role.RECRUITER,
                    status: { $ne: 'deleted' },
                    createdAt: { $gte: thirtyDaysAgo }
                })
            },
            courses: await Course_1.default.countDocuments({ status: { $ne: 'deleted' } }),
            jobs: await Job_1.default.countDocuments(),
            placementDrives: await PlacementDrive_1.default.countDocuments({ status: { $ne: 'COMPLETED' } }),
            systemPulse: '99.9%',
            topInstitutions: await College_1.default.find({ status: 'active' }).limit(5).select('name location'),
            recruiterTrends,
            registrationActivity,
            enrollmentVelocity,
            institutionalPulse,
            aggregatedDate: now.toLocaleDateString()
        };
        const topInstitutionsWithCounts = await Promise.all(stats.topInstitutions.map(async (c) => {
            const students = await User_1.default.countDocuments({
                role: User_1.Role.STUDENT,
                collegeId: c._id,
                status: { $ne: 'deleted' }
            });
            return {
                id: c._id,
                name: c.name,
                city: c.location,
                students: students > 1000 ? `${(students / 1000).toFixed(1)}k` : students.toString(),
                rawCount: students
            };
        }));
        stats.topInstitutions = topInstitutionsWithCounts;
        res.json(stats);
    }
    catch (error) {
        console.error('Error in getPlatformStats:', error);
        res.status(500).json({ message: 'Error fetching stats', error });
    }
};
exports.getPlatformStats = getPlatformStats;
const getCollegeStats = async (req, res) => {
    try {
        const collegeId = req.user.collegeId;
        if (!collegeId) {
            return res.status(400).json({ message: 'College ID not found for this user' });
        }
        const college = await College_1.default.findById(collegeId).select('name');
        const jobQuery = {
            $or: [
                { colleges: collegeId },
                { colleges: { $size: 0 } },
                { colleges: { $exists: false } }
            ]
        };
        const relevantJobs = await Job_1.default.countDocuments(jobQuery);
        const recruiters = await Job_1.default.distinct('recruiterId', jobQuery);
        const relevantRecruiters = recruiters.length;
        const stats = {
            collegeName: college?.name || 'Institution',
            students: await User_1.default.countDocuments({ role: User_1.Role.STUDENT, collegeId }),
            faculty: await User_1.default.countDocuments({ role: User_1.Role.FACULTY, collegeId }),
            courses: await Course_1.default.countDocuments({ collegeId }),
            relevantJobs,
            relevantRecruiters,
            pendingCourses: await Course_1.default.countDocuments({ collegeId, status: 'pending' }),
            pendingStudents: await User_1.default.countDocuments({ role: User_1.Role.STUDENT, collegeId, status: 'pending' }),
            pendingFaculty: await User_1.default.countDocuments({ role: User_1.Role.FACULTY, collegeId, status: 'pending' }),
        };
        res.json(stats);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching college stats', error });
    }
};
exports.getCollegeStats = getCollegeStats;
