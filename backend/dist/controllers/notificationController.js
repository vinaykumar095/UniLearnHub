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
exports.adminBroadcast = exports.broadcastAnnouncement = exports.markAllAsRead = exports.markAsRead = exports.getNotifications = exports.notifyStudents = exports.createNotification = void 0;
const Notification_1 = __importDefault(require("../models/Notification"));
const User_1 = __importStar(require("../models/User"));
const createNotification = async (userId, message) => {
    try {
        await Notification_1.default.create({ userId, message });
    }
    catch (error) {
        console.error('Error creating notification:', error);
    }
};
exports.createNotification = createNotification;
const notifyStudents = async (message, collegeId) => {
    try {
        const query = { role: User_1.Role.STUDENT };
        if (collegeId) {
            query.collegeId = collegeId;
        }
        const students = await User_1.default.find(query).select('_id');
        const notifications = students.map(student => ({
            userId: student._id,
            message
        }));
        if (notifications.length > 0) {
            await Notification_1.default.insertMany(notifications);
        }
    }
    catch (error) {
        console.error('Error notifying students:', error);
    }
};
exports.notifyStudents = notifyStudents;
const getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const notifications = await Notification_1.default.find({ userId })
            .sort({ createdAt: -1 });
        res.json(notifications);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching notifications', error });
    }
};
exports.getNotifications = getNotifications;
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification_1.default.findByIdAndUpdate(id, { read: true }, { returnDocument: 'after' });
        res.json(notification);
    }
    catch (error) {
        res.status(500).json({ message: 'Error marking notification as read', error });
    }
};
exports.markAsRead = markAsRead;
const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        await Notification_1.default.updateMany({ userId, read: false }, { read: true });
        res.json({ message: 'All notifications marked as read' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error marking notifications as read', error });
    }
};
exports.markAllAsRead = markAllAsRead;
const broadcastAnnouncement = async (req, res) => {
    try {
        const senderId = req.user.id;
        const senderRole = req.user.role;
        const { message, category, courseId } = req.body;
        const prefixMap = {
            COURSE: senderRole === 'RECRUITER' ? '💼 Job Update' : '📚 Course Update',
            PLACEMENT: '🎯 Placement Alert',
            GENERAL: senderRole === 'RECRUITER' ? '📢 Recruiter Notice' : '📢 Notice',
        };
        const prefix = prefixMap[category] || (senderRole === 'RECRUITER' ? '💼 Job Update' : '📢 Notice');
        const fullMessage = `[${prefix}] ${message}`;
        let studentIds = [];
        if (senderRole === 'RECRUITER') {
            const allStudents = await User_1.default.find({ role: User_1.Role.STUDENT }).select('_id');
            studentIds = allStudents.map((s) => s._id);
        }
        else {
            const { default: Course } = require('../models/Course');
            const { default: Enrollment } = require('../models/Enrollment');
            if (courseId && courseId !== 'ALL') {
                const enrollments = await Enrollment.find({ courseId }).select('studentId');
                studentIds = enrollments.map((e) => e.studentId);
            }
            else {
                const courses = await Course.find({ facultyId: senderId }).select('_id');
                const courseIds = courses.map((c) => c._id);
                const enrollments = await Enrollment.find({ courseId: { $in: courseIds } }).select('studentId');
                const uniqueIds = new Set(enrollments.map((e) => e.studentId.toString()));
                studentIds = Array.from(uniqueIds);
            }
        }
        if (studentIds.length > 0) {
            const notifications = studentIds.map((uid) => ({ userId: uid, message: fullMessage }));
            await Notification_1.default.insertMany(notifications);
        }
        res.status(201).json({
            message: 'Announcement broadcast successfully',
            recipientCount: studentIds.length,
            announcement: { message, category, courseId, createdAt: new Date() }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error broadcasting announcement', error });
    }
};
exports.broadcastAnnouncement = broadcastAnnouncement;
const adminBroadcast = async (req, res) => {
    try {
        const { message, targetRoles } = req.body;
        let query = {};
        if (targetRoles && !targetRoles.includes('ALL')) {
            query.role = { $in: targetRoles };
        }
        const users = await User_1.default.find(query).select('_id');
        const notifications = users.map(u => ({
            userId: u._id,
            message: `[📢 SYSTEM WIDE] ${message}`
        }));
        if (notifications.length > 0) {
            await Notification_1.default.insertMany(notifications);
        }
        res.status(201).json({
            message: 'System-wide announcement broadcasted',
            recipientCount: users.length
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error broadcasting admin announcement', error });
    }
};
exports.adminBroadcast = adminBroadcast;
