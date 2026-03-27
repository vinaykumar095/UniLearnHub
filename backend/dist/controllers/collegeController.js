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
exports.getPlatformStats = exports.deleteCollege = exports.getCollegeById = exports.updateCollege = exports.updateCollegeStatus = exports.getCollegeStats = exports.getColleges = exports.createCollege = exports.approveCollege = exports.registerCollege = void 0;
const College_1 = __importDefault(require("../models/College"));
const User_1 = __importStar(require("../models/User"));
const Course_1 = __importDefault(require("../models/Course"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const registerCollege = async (req, res) => {
    try {
        const { name, location, email, phone, principal, website, adminName, password } = req.body;
        if (!name || !email || !adminName || !password) {
            return res.status(400).json({ message: 'Name, email, admin name, and password are required.' });
        }
        const existingCollege = await College_1.default.findOne({ email });
        if (existingCollege)
            return res.status(400).json({ message: 'A college with this email already exists.' });
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: 'A user with this email already exists.' });
        const college = await College_1.default.create({ name, location, email, phone, principal, website, status: 'pending' });
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        await User_1.default.create({
            name: adminName,
            email,
            password: hashedPassword,
            role: User_1.Role.COLLEGE_ADMIN,
            collegeId: college._id,
            status: 'active'
        });
        res.status(201).json({
            message: 'College registration submitted. Your admin account has been created. You can log in once the Central Admin approves your institution.',
            college
        });
        (async () => {
            try {
                const { createNotification } = require('./notificationController');
                const centralAdmins = await User_1.default.find({ role: User_1.Role.CENTRAL_ADMIN }).select('_id');
                for (const admin of centralAdmins) {
                    await createNotification(admin._id, `New institution registration: ${name} pending approval.`);
                }
            }
            catch (notifyError) {
                console.error('[registerCollege] Notification Error:', notifyError);
            }
        })();
    }
    catch (error) {
        res.status(500).json({ message: 'Error registering college', error });
    }
};
exports.registerCollege = registerCollege;
const approveCollege = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const college = await College_1.default.findByIdAndUpdate(id, { status }, { returnDocument: 'after' });
        if (college) {
            (async () => {
                try {
                    const { createNotification } = require('./notificationController');
                    const collegeAdmins = await User_1.default.find({ collegeId: id, role: User_1.Role.COLLEGE_ADMIN }).select('_id');
                    for (const admin of collegeAdmins) {
                        await createNotification(admin._id, `Your institution status has been updated to "${status}".`);
                    }
                }
                catch (notifyError) {
                    console.error('[approveCollege] Notification Error:', notifyError);
                }
            })();
        }
        res.json(college);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating college status', error });
    }
};
exports.approveCollege = approveCollege;
const createCollege = async (req, res) => {
    try {
        const { name, location } = req.body;
        const college = await College_1.default.create({ name, location, status: 'active' });
        res.status(201).json(college);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating college', error });
    }
};
exports.createCollege = createCollege;
const getColleges = async (req, res) => {
    try {
        const { status } = req.query;
        const query = { status: { $ne: 'deleted' } };
        if (status)
            query.status = status;
        const colleges = await College_1.default.find(query);
        const collegesWithCounts = await Promise.all(colleges.map(async (college) => {
            const userCount = await User_1.default.countDocuments({ collegeId: college._id, status: { $ne: 'deleted' } });
            const courseCount = await Course_1.default.countDocuments({ collegeId: college._id, status: { $ne: 'deleted' } });
            return {
                ...college.toObject(),
                id: college._id,
                _count: { users: userCount, courses: courseCount }
            };
        }));
        res.json(collegesWithCounts);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching colleges', error });
    }
};
exports.getColleges = getColleges;
const getCollegeStats = async (req, res) => {
    try {
        const totalColleges = await College_1.default.countDocuments({ status: { $ne: 'deleted' } });
        const totalUsers = await User_1.default.countDocuments({ status: { $ne: 'deleted' } });
        const totalCourses = await Course_1.default.countDocuments({ status: { $ne: 'deleted' } });
        res.json({ totalColleges, totalUsers, totalCourses });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error });
    }
};
exports.getCollegeStats = getCollegeStats;
const updateCollegeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const college = await College_1.default.findByIdAndUpdate(id, { status }, { returnDocument: 'after' });
        res.json(college);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating college status', error });
    }
};
exports.updateCollegeStatus = updateCollegeStatus;
const updateCollege = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        if (req.user.role === User_1.Role.COLLEGE_ADMIN && req.user.collegeId !== id) {
            return res.status(403).json({ message: 'Unauthorized: You can only update your own institution.' });
        }
        const college = await College_1.default.findByIdAndUpdate(id, updates, { returnDocument: 'after' });
        res.json(college);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating college', error });
    }
};
exports.updateCollege = updateCollege;
const getCollegeById = async (req, res) => {
    try {
        const { id } = req.params;
        const college = await College_1.default.findById(id);
        if (!college)
            return res.status(404).json({ message: 'College not found' });
        const userCount = await User_1.default.countDocuments({ collegeId: college._id, status: { $ne: 'deleted' } });
        const courseCount = await Course_1.default.countDocuments({ collegeId: college._id, status: { $ne: 'deleted' } });
        res.json({
            ...college.toObject(),
            id: college._id,
            _count: { users: userCount, courses: courseCount }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching college details', error });
    }
};
exports.getCollegeById = getCollegeById;
const deleteCollege = async (req, res) => {
    try {
        const { id } = req.params;
        const users = await User_1.default.find({ collegeId: id });
        const userIds = users.map((u) => u._id);
        const courses = await Course_1.default.find({ collegeId: id });
        const courseIds = courses.map((c) => c._id);
        await User_1.default.deleteMany({ collegeId: id });
        await Course_1.default.deleteMany({ collegeId: id });
        await College_1.default.findByIdAndDelete(id);
        console.log(`[deleteCollege] Hard-deleted college ${id} and all associated users/courses.`);
        res.json({ message: 'College and all associated data have been permanently deleted.' });
    }
    catch (error) {
        console.error('[deleteCollege] Error:', error);
        res.status(500).json({ message: 'Error performing cascading hard-delete', error });
    }
};
exports.deleteCollege = deleteCollege;
const getPlatformStats = async (req, res) => {
    try {
        const totalColleges = await College_1.default.countDocuments({ status: { $ne: 'deleted' } });
        const totalStudents = await User_1.default.countDocuments({ role: User_1.Role.STUDENT, status: { $ne: 'deleted' } });
        const totalRecruiters = await User_1.default.countDocuments({ role: User_1.Role.RECRUITER, status: { $ne: 'deleted' } });
        res.json({
            colleges: totalColleges,
            students: totalStudents,
            recruiters: totalRecruiters
        });
    }
    catch (error) {
        console.error('[getPlatformStats] Error:', error);
        res.status(500).json({ message: 'Error fetching platform statistics', error });
    }
};
exports.getPlatformStats = getPlatformStats;
