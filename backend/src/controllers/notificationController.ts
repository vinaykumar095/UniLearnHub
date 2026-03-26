import { Request, Response } from 'express';
import Notification from '../models/Notification';
import User, { Role } from '../models/User';

export const createNotification = async (userId: any, message: string) => {
    try {
        await Notification.create({ userId, message });
    } catch (error) {
        console.error('Error creating notification:', error);
    }
};


export const notifyStudents = async (message: string, collegeId?: string) => {
    try {
        const query: any = { role: Role.STUDENT };
        if (collegeId) {
            query.collegeId = collegeId;
        }

        const students = await User.find(query).select('_id');
        const notifications = students.map(student => ({
            userId: student._id,
            message
        }));

        if (notifications.length > 0) {
            await Notification.insertMany(notifications);
        }
    } catch (error) {
        console.error('Error notifying students:', error);
    }
};

export const getNotifications = async (req: any, res: Response) => {
    try {
        const userId = req.user.id;
        const notifications = await Notification.find({ userId })
            .sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notifications', error });
    }
};

export const markAsRead = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findByIdAndUpdate(id, { read: true }, { returnDocument: 'after' });
        res.json(notification);
    } catch (error) {
        res.status(500).json({ message: 'Error marking notification as read', error });
    }
};

export const markAllAsRead = async (req: any, res: Response) => {
    try {
        const userId = req.user.id;
        await Notification.updateMany({ userId, read: false }, { read: true });
        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Error marking notifications as read', error });
    }
};

export const broadcastAnnouncement = async (req: any, res: Response) => {
    try {
        const senderId = req.user.id;
        const senderRole = req.user.role;
        const { message, category, courseId } = req.body;

        const prefixMap: Record<string, string> = {
            COURSE: senderRole === 'RECRUITER' ? '💼 Job Update' : '📚 Course Update',
            PLACEMENT: '🎯 Placement Alert',
            GENERAL: senderRole === 'RECRUITER' ? '📢 Recruiter Notice' : '📢 Notice',
        };
        const prefix = prefixMap[category] || (senderRole === 'RECRUITER' ? '💼 Job Update' : '📢 Notice');
        const fullMessage = `[${prefix}] ${message}`;

        let studentIds: any[] = [];

        if (senderRole === 'RECRUITER') {
            
            const allStudents = await User.find({ role: Role.STUDENT }).select('_id');
            studentIds = allStudents.map((s: any) => s._id);
        } else {
            
            const { default: Course } = require('../models/Course');
            const { default: Enrollment } = require('../models/Enrollment');

            if (courseId && courseId !== 'ALL') {
                const enrollments = await Enrollment.find({ courseId }).select('studentId');
                studentIds = enrollments.map((e: any) => e.studentId);
            } else {
                const courses = await Course.find({ facultyId: senderId }).select('_id');
                const courseIds = courses.map((c: any) => c._id);
                const enrollments = await Enrollment.find({ courseId: { $in: courseIds } }).select('studentId');
                const uniqueIds = new Set(enrollments.map((e: any) => e.studentId.toString()));
                studentIds = Array.from(uniqueIds);
            }
        }

        if (studentIds.length > 0) {
            const notifications = studentIds.map((uid: any) => ({ userId: uid, message: fullMessage }));
            await Notification.insertMany(notifications);
        }

        res.status(201).json({
            message: 'Announcement broadcast successfully',
            recipientCount: studentIds.length,
            announcement: { message, category, courseId, createdAt: new Date() }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error broadcasting announcement', error });
    }
};
export const adminBroadcast = async (req: any, res: Response) => {
    try {
        const { message, targetRoles } = req.body; 

        let query: any = {};
        if (targetRoles && !targetRoles.includes('ALL')) {
            query.role = { $in: targetRoles };
        }

        const users = await User.find(query).select('_id');
        const notifications = users.map(u => ({
            userId: u._id,
            message: `[📢 SYSTEM WIDE] ${message}`
        }));

        if (notifications.length > 0) {
            await Notification.insertMany(notifications);
        }

        res.status(201).json({
            message: 'System-wide announcement broadcasted',
            recipientCount: users.length
        });
    } catch (error) {
        res.status(500).json({ message: 'Error broadcasting admin announcement', error });
    }
};
