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
exports.getUserById = exports.getRecentActivity = exports.updateSettings = exports.changePassword = exports.updateProfile = exports.getProfile = exports.deleteUser = exports.createUser = exports.updateUserRole = exports.updateUserStatus = exports.getUsers = void 0;
const User_1 = __importStar(require("../models/User"));
const Activity_1 = __importDefault(require("../models/Activity"));
const Job_1 = __importDefault(require("../models/Job"));
const PlacementDrive_1 = __importDefault(require("../models/PlacementDrive"));
const fs_1 = __importDefault(require("fs"));
const getUsers = async (req, res) => {
    try {
        const { role, collegeId } = req.query;
        const query = { status: { $ne: 'deleted' } };
        if (role)
            query.role = role;
        const authReq = req;
        const isAdmin = authReq.user?.role === User_1.Role.CENTRAL_ADMIN;
        const isCollegeAdmin = authReq.user?.role === User_1.Role.COLLEGE_ADMIN;
        if (isCollegeAdmin && authReq.user) {
            const adminCollegeId = authReq.user.collegeId && typeof authReq.user.collegeId === 'object' && '_id' in authReq.user.collegeId
                ? authReq.user.collegeId._id.toString()
                : authReq.user.collegeId?.toString();
            if (role === User_1.Role.RECRUITER) {
                query.status = 'active';
                if (collegeId && collegeId !== 'null' && collegeId !== 'undefined') {
                    query.collegeId = collegeId;
                }
            }
            else {
                query.collegeId = adminCollegeId;
            }
        }
        else if (!isAdmin) {
            if (authReq.user?.collegeId) {
                query.collegeId = authReq.user.collegeId;
            }
        }
        else if (collegeId && collegeId !== 'null' && collegeId !== 'undefined') {
            query.collegeId = collegeId;
        }
        const users = await User_1.default.find(query)
            .select('name email role collegeId status branch year department cgpa skills company')
            .populate('collegeId', 'name');
        const logMsg = `[getUsers] ${new Date().toISOString()}\n` +
            `Params: ${JSON.stringify({ role, collegeId })}\n` +
            `Auth: ${JSON.stringify({ id: authReq.user?.id, role: authReq.user?.role, collegeId: authReq.user?.collegeId })}\n` +
            `Query: ${JSON.stringify(query)}\n` +
            `Found: ${users.length}\n` +
            `-------------------\n`;
        fs_1.default.appendFileSync('api_logs.txt', logMsg);
        console.log(`[getUsers] Generated Query Object:`, JSON.stringify(query));
        console.log(`[getUsers] Found ${users.length} users. First user (if any):`, users[0]?.email);
        // Map _id and nested collegeId for frontend compatibility if needed
        const formattedUsers = await Promise.all(users.map(async (user) => {
            const obj = user.toObject();
            const formatted = {
                id: obj._id,
                _id: obj._id,
                name: obj.name,
                email: obj.email,
                role: obj.role,
                status: obj.status,
                branch: obj.branch,
                year: obj.year,
                department: obj.department,
                cgpa: obj.cgpa,
                skills: obj.skills,
                company: obj.company,
                collegeId: obj.collegeId?._id || obj.collegeId,
                college: obj.collegeId ? { name: obj.collegeId.name } : null
            };
            // Add counts for recruiters
            if (obj.role === User_1.Role.RECRUITER) {
                const [jobCount, driveCount] = await Promise.all([
                    Job_1.default.countDocuments({ recruiterId: obj._id }),
                    PlacementDrive_1.default.countDocuments({ recruiterId: obj._id })
                ]);
                formatted.jobCount = jobCount;
                formatted.driveCount = driveCount;
            }
            return formatted;
        }));
        res.json(formattedUsers);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};
exports.getUsers = getUsers;
const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        let { status } = req.body;
        // Map frontend aliases to backend values
        if (status === 'approved')
            status = 'active';
        if (status === 'rejected')
            status = 'suspended';
        if (!['active', 'suspended', 'pending'].includes(status)) {
            console.error(`[updateUserStatus] Invalid status received: "${status}"`);
            return res.status(400).json({ message: `Invalid status: ${status}. Must be active, suspended, or pending.` });
        }
        const authReq = req;
        const userToUpdate = await User_1.default.findById(id);
        if (!userToUpdate) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Enforce approval restrictions
        if (authReq.user?.role === User_1.Role.COLLEGE_ADMIN) {
            const isTargetRecruiter = userToUpdate.role === User_1.Role.RECRUITER;
            if (isTargetRecruiter) {
                return res.status(403).json({ message: 'Recruiter approval is reserved for the Platform Administrator.' });
            }
            const targetCollegeId = userToUpdate.collegeId?.toString();
            const adminCollegeId = authReq.user?.collegeId && typeof authReq.user.collegeId === 'object' && '_id' in authReq.user.collegeId
                ? authReq.user.collegeId._id.toString()
                : authReq.user.collegeId?.toString();
            console.log(`[updateUserStatus] Comparing - Target Institution: ${targetCollegeId}, Admin Institution: ${adminCollegeId}`);
            if (targetCollegeId !== adminCollegeId) {
                console.warn(`[updateUserStatus] Forbidden: Institution mismatch. Admin: ${adminCollegeId}, Target: ${targetCollegeId}`);
                return res.status(403).json({ message: 'Not authorized to manage users from other institutions' });
            }
        }
        userToUpdate.status = status;
        await userToUpdate.save();
        console.log(`[updateUserStatus] Successfully updated user ${id} to ${status}`);
        res.json({ message: `User status updated to ${status}`, user: userToUpdate });
        // Notify User
        if (userToUpdate) {
            (async () => {
                try {
                    const { createNotification } = require('./notificationController');
                    const msg = status === 'active'
                        ? 'Your account access has been granted. You can now log in.'
                        : `Your account status has been updated to "${status}".`;
                    await createNotification(userToUpdate._id, msg);
                }
                catch (notifyError) {
                    console.error('[updateUserStatus] Notification Error:', notifyError);
                }
            })();
        }
    }
    catch (error) {
        console.error('[updateUserStatus] Error:', error);
        res.status(500).json({ message: 'Error updating user status', error });
    }
};
exports.updateUserStatus = updateUserStatus;
const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        const user = await User_1.default.findByIdAndUpdate(id, { role }, { returnDocument: 'after' });
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating user role', error });
    }
};
exports.updateUserRole = updateUserRole;
const bcrypt_1 = __importDefault(require("bcrypt"));
const createUser = async (req, res) => {
    try {
        const { name, email, password, role, collegeId } = req.body;
        const passwordHash = await bcrypt_1.default.hash(password, 10);
        const user = await User_1.default.create({ name, email, password: passwordHash, role, collegeId });
        res.status(201).json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
};
exports.createUser = createUser;
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const authReq = req;
        console.log(`[deleteUser] Attempting to delete user ${id}. Auth Role: ${authReq.user?.role}`);
        const userToDelete = await User_1.default.findById(id);
        if (!userToDelete) {
            console.error(`[deleteUser] User ${id} not found`);
            return res.status(404).json({ message: 'User not found' });
        }
        // Enforce college restriction for College Admins
        if (authReq.user?.role === User_1.Role.COLLEGE_ADMIN) {
            if (userToDelete.collegeId?.toString() !== authReq.user?.collegeId?.toString()) {
                console.warn(`[deleteUser] College Admin unauthorized for user ${id}`);
                return res.status(403).json({ message: 'Not authorized to delete users from other institutions' });
            }
        }
        // Cascading delete for Recruiters
        if (userToDelete.role === User_1.Role.RECRUITER) {
            await Job_1.default.deleteMany({ recruiterId: id });
            await PlacementDrive_1.default.deleteMany({ recruiterId: id });
            console.log(`[deleteUser] Cascading delete: removed jobs/drives for recruiter ${id}`);
        }
        await User_1.default.findByIdAndDelete(id);
        console.log(`[deleteUser] Successfully hard-deleted user ${id}`);
        res.json({ message: 'User deleted permanently from the system.' });
    }
    catch (error) {
        console.error('[deleteUser] Error:', error);
        res.status(500).json({ message: 'Error deleting user', error });
    }
};
exports.deleteUser = deleteUser;
const getProfile = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.user.id).select('-password').populate('collegeId');
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error });
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res) => {
    try {
        const { name, company, skills, phone, city, state, country, bio, github, linkedin, leetcode, codechef, hackerrank, website, branch, year, cgpa, department, designation, qualification, experience, specialization, researchInterests, projects, avatar } = req.body;
        const user = await User_1.default.findByIdAndUpdate(req.user.id, {
            name, company, skills, phone, city, state, country, bio,
            github, linkedin, leetcode, codechef, hackerrank, website,
            branch, year, cgpa,
            department, designation, qualification, experience, specialization, researchInterests, projects, avatar
        }, { returnDocument: 'after' }).select('-password').populate('collegeId', 'name');
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating profile', error });
    }
};
exports.updateProfile = updateProfile;
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current and new password are required.' });
        }
        const user = await User_1.default.findById(req.user.id);
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        const isMatch = await bcrypt_1.default.compare(currentPassword, user.password);
        if (!isMatch)
            return res.status(401).json({ message: 'Current password is incorrect.' });
        if (newPassword.length < 6)
            return res.status(400).json({ message: 'New password must be at least 6 characters.' });
        user.password = await bcrypt_1.default.hash(newPassword, 10);
        await user.save();
        res.json({ message: 'Password changed successfully.' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error changing password', error });
    }
};
exports.changePassword = changePassword;
const updateSettings = async (req, res) => {
    try {
        const { twoFactorEnabled, notificationPreferences, privacySettings } = req.body;
        const user = await User_1.default.findByIdAndUpdate(req.user.id, { twoFactorEnabled, notificationPreferences, privacySettings }, { returnDocument: 'after' }).select('-password');
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating settings', error });
    }
};
exports.updateSettings = updateSettings;
const getRecentActivity = async (req, res) => {
    try {
        const activities = await Activity_1.default.find({ userId: req.user.id })
            .sort({ timestamp: -1 })
            .limit(10);
        res.json(activities);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching activity', error });
    }
};
exports.getRecentActivity = getRecentActivity;
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User_1.default.findById(id).select('-password').populate('collegeId', 'name');
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching user details', error });
    }
};
exports.getUserById = getUserById;
