import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import User, { Role } from '../models/User';
import Activity from '../models/Activity';
import Job from '../models/Job';
import PlacementDrive from '../models/PlacementDrive';
import fs from 'fs';
import { AuthRequest } from '../middlewares/auth';

export const getUsers = async (req: ExpressRequest, res: ExpressResponse) => {
    try {
        const { role, collegeId } = req.query;
        const query: any = { status: { $ne: 'deleted' } };
        if (role) query.role = role;
        
        // Restricted query logic
        const authReq = req as AuthRequest;
        const isAdmin = authReq.user?.role === Role.CENTRAL_ADMIN;
        const isCollegeAdmin = authReq.user?.role === Role.COLLEGE_ADMIN;

        if (isCollegeAdmin && authReq.user) {
            // Extract string ID from collegeId (handle both string and object cases)
            const adminCollegeId = authReq.user.collegeId && typeof authReq.user.collegeId === 'object' && '_id' in authReq.user.collegeId
                ? (authReq.user.collegeId as any)._id.toString()
                : authReq.user.collegeId?.toString();

            if (role === Role.RECRUITER) {
                // College Admins can only see APPROVED recruiters
                query.status = 'active';
                if (collegeId && collegeId !== 'null' && collegeId !== 'undefined') {
                    query.collegeId = collegeId;
                }
            } else {
                query.collegeId = adminCollegeId;
            }
        } else if (!isAdmin) {
            // Other roles (STUDENT, FACULTY) can only see users from their own college if searching
            if (authReq.user?.collegeId) {
                query.collegeId = authReq.user.collegeId;
            }
        } else if (collegeId && collegeId !== 'null' && collegeId !== 'undefined') {
            // Central Admin can filter by any collegeId
            query.collegeId = collegeId;
        }

        const users = await User.find(query)
            .select('name email role collegeId status branch year department cgpa skills company')
            .populate('collegeId', 'name');

        const logMsg = `[getUsers] ${new Date().toISOString()}\n` +
                       `Params: ${JSON.stringify({ role, collegeId })}\n` +
                       `Auth: ${JSON.stringify({ id: authReq.user?.id, role: authReq.user?.role, collegeId: authReq.user?.collegeId })}\n` +
                       `Query: ${JSON.stringify(query)}\n` +
                       `Found: ${users.length}\n` +
                       `-------------------\n`;
        fs.appendFileSync('api_logs.txt', logMsg);

        console.log(`[getUsers] Generated Query Object:`, JSON.stringify(query));
        console.log(`[getUsers] Found ${users.length} users. First user (if any):`, users[0]?.email);

        // Map _id and nested collegeId for frontend compatibility if needed
        const formattedUsers = await Promise.all(users.map(async (user) => {
            const obj = user.toObject();
            const formatted: any = {
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
                college: obj.collegeId ? { name: (obj.collegeId as any).name } : null
            };

            // Add counts for recruiters
            if (obj.role === Role.RECRUITER) {
                const [jobCount, driveCount] = await Promise.all([
                    Job.countDocuments({ recruiterId: obj._id }),
                    PlacementDrive.countDocuments({ recruiterId: obj._id })
                ]);
                formatted.jobCount = jobCount;
                formatted.driveCount = driveCount;
            }

            return formatted;
        }));

        res.json(formattedUsers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

export const updateUserStatus = async (req: ExpressRequest, res: ExpressResponse) => {
    try {
        const { id } = req.params;
        let { status } = req.body;

        // Map frontend aliases to backend values
        if (status === 'approved') status = 'active';
        if (status === 'rejected') status = 'suspended';

        if (!['active', 'suspended', 'pending'].includes(status)) {
            console.error(`[updateUserStatus] Invalid status received: "${status}"`);
            return res.status(400).json({ message: `Invalid status: ${status}. Must be active, suspended, or pending.` });
        }

        const authReq = req as AuthRequest;
        const userToUpdate = await User.findById(id);
        
        if (!userToUpdate) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Enforce approval restrictions
        if (authReq.user?.role === Role.COLLEGE_ADMIN) {
            const isTargetRecruiter = userToUpdate.role === Role.RECRUITER;
            if (isTargetRecruiter) {
                return res.status(403).json({ message: 'Recruiter approval is reserved for the Platform Administrator.' });
            }

            const targetCollegeId = userToUpdate.collegeId?.toString();
            const adminCollegeId = authReq.user?.collegeId && typeof authReq.user.collegeId === 'object' && '_id' in authReq.user.collegeId
                ? (authReq.user.collegeId as any)._id.toString()
                : authReq.user.collegeId?.toString();

            console.log(`[updateUserStatus] Comparing - Target Institution: ${targetCollegeId}, Admin Institution: ${adminCollegeId}`);

            if (targetCollegeId !== adminCollegeId) {
                console.warn(`[updateUserStatus] Forbidden: Institution mismatch. Admin: ${adminCollegeId}, Target: ${targetCollegeId}`);
                return res.status(403).json({ message: 'Not authorized to manage users from other institutions' });
            }
        }

        userToUpdate.status = status as any;
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
                } catch (notifyError) {
                    console.error('[updateUserStatus] Notification Error:', notifyError);
                }
            })();
        }
    } catch (error) {
        console.error('[updateUserStatus] Error:', error);
        res.status(500).json({ message: 'Error updating user status', error });
    }
};

export const updateUserRole = async (req: ExpressRequest, res: ExpressResponse) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(id, { role }, { returnDocument: 'after' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user role', error });
    }
};

import bcrypt from 'bcrypt';

export const createUser = async (req: ExpressRequest, res: ExpressResponse) => {
    try {
        const { name, email, password, role, collegeId } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: passwordHash, role, collegeId });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
};

export const deleteUser = async (req: ExpressRequest, res: ExpressResponse) => {
    try {
        const { id } = req.params;
        const authReq = req as AuthRequest;
        
        console.log(`[deleteUser] Attempting to delete user ${id}. Auth Role: ${authReq.user?.role}`);

        const userToDelete = await User.findById(id);
        if (!userToDelete) {
            console.error(`[deleteUser] User ${id} not found`);
            return res.status(404).json({ message: 'User not found' });
        }

        // Enforce college restriction for College Admins
        if (authReq.user?.role === Role.COLLEGE_ADMIN) {
            if (userToDelete.collegeId?.toString() !== authReq.user?.collegeId?.toString()) {
                console.warn(`[deleteUser] College Admin unauthorized for user ${id}`);
                return res.status(403).json({ message: 'Not authorized to delete users from other institutions' });
            }
        }

        // Cascading delete for Recruiters
        if (userToDelete.role === Role.RECRUITER) {
            await Job.deleteMany({ recruiterId: id });
            await PlacementDrive.deleteMany({ recruiterId: id });
            console.log(`[deleteUser] Cascading delete: removed jobs/drives for recruiter ${id}`);
        }

        await User.findByIdAndDelete(id);
        
        console.log(`[deleteUser] Successfully hard-deleted user ${id}`);
        res.json({ message: 'User deleted permanently from the system.' });
    } catch (error) {
        console.error('[deleteUser] Error:', error);
        res.status(500).json({ message: 'Error deleting user', error });
    }
};

export const getProfile = async (req: AuthRequest, res: ExpressResponse) => {
    try {
        const user = await User.findById(req.user!.id).select('-password').populate('collegeId');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error });
    }
};

export const updateProfile = async (req: AuthRequest, res: ExpressResponse) => {
    try {
        const {
            name, company, skills, phone, city, state, country, bio,
            github, linkedin, leetcode, codechef, hackerrank, website,
            branch, year, cgpa,
            department, designation, qualification, experience, specialization, researchInterests, projects, avatar
        } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user!.id,
            {
                name, company, skills, phone, city, state, country, bio,
                github, linkedin, leetcode, codechef, hackerrank, website,
                branch, year, cgpa,
                department, designation, qualification, experience, specialization, researchInterests, projects, avatar
            },
            { returnDocument: 'after' }
        ).select('-password').populate('collegeId', 'name');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error });
    }
};

export const changePassword = async (req: AuthRequest, res: ExpressResponse) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current and new password are required.' });
        }
        const user = await User.findById(req.user!.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Current password is incorrect.' });

        if (newPassword.length < 6) return res.status(400).json({ message: 'New password must be at least 6 characters.' });

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.json({ message: 'Password changed successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error changing password', error });
    }
};
export const updateSettings = async (req: AuthRequest, res: ExpressResponse) => {
    try {
        const { twoFactorEnabled, notificationPreferences, privacySettings } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user!.id,
            { twoFactorEnabled, notificationPreferences, privacySettings },
            { returnDocument: 'after' }
        ).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error updating settings', error });
    }
};

export const getRecentActivity = async (req: AuthRequest, res: ExpressResponse) => {
    try {
        const activities = await Activity.find({ userId: req.user!.id })
            .sort({ timestamp: -1 })
            .limit(10);
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching activity', error });
    }
};

export const getUserById = async (req: AuthRequest, res: ExpressResponse) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('-password').populate('collegeId', 'name');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user details', error });
    }
};
