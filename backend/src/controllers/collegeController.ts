import { Request, Response } from 'express';
import College from '../models/College';
import User, { Role } from '../models/User';
import Course from '../models/Course';
import bcrypt from 'bcrypt';


export const registerCollege = async (req: Request, res: Response) => {
    try {
        const { name, location, email, phone, principal, website, adminName, password } = req.body;
        if (!name || !email || !adminName || !password) {
            return res.status(400).json({ message: 'Name, email, admin name, and password are required.' });
        }

        const existingCollege = await College.findOne({ email });
        if (existingCollege) return res.status(400).json({ message: 'A college with this email already exists.' });

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'A user with this email already exists.' });

        
        const college = await College.create({ name, location, email, phone, principal, website, status: 'pending' });

        
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            name: adminName,
            email,
            password: hashedPassword,
            role: Role.COLLEGE_ADMIN,
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
                const centralAdmins = await User.find({ role: Role.CENTRAL_ADMIN }).select('_id');
                for (const admin of centralAdmins) {
                    await createNotification(admin._id, `New institution registration: ${name} pending approval.`);
                }
            } catch (notifyError) {
                console.error('[registerCollege] Notification Error:', notifyError);
            }
        })();
    } catch (error) {
        res.status(500).json({ message: 'Error registering college', error });
    }
};


export const approveCollege = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body; 
        const college = await College.findByIdAndUpdate(id, { status }, { returnDocument: 'after' });
        
        
        if (college) {
            (async () => {
                try {
                    const { createNotification } = require('./notificationController');
                    const collegeAdmins = await User.find({ collegeId: id, role: Role.COLLEGE_ADMIN }).select('_id');
                    for (const admin of collegeAdmins) {
                        await createNotification(admin._id, `Your institution status has been updated to "${status}".`);
                    }
                } catch (notifyError) {
                    console.error('[approveCollege] Notification Error:', notifyError);
                }
            })();
        }

        res.json(college);
    } catch (error) {
        res.status(500).json({ message: 'Error updating college status', error });
    }
};

export const createCollege = async (req: Request, res: Response) => {
    try {
        const { name, location } = req.body;
        const college = await College.create({ name, location, status: 'active' });
        res.status(201).json(college);
    } catch (error) {
        res.status(500).json({ message: 'Error creating college', error });
    }
};

export const getColleges = async (req: Request, res: Response) => {
    try {
        const { status } = req.query;
        const query: any = { status: { $ne: 'deleted' } };
        if (status) query.status = status;

        const colleges = await College.find(query);
        const collegesWithCounts = await Promise.all(colleges.map(async (college) => {
            const userCount = await User.countDocuments({ collegeId: college._id, status: { $ne: 'deleted' } });
            const courseCount = await Course.countDocuments({ collegeId: college._id, status: { $ne: 'deleted' } });
            return {
                ...college.toObject(),
                id: college._id,
                _count: { users: userCount, courses: courseCount }
            };
        }));
        res.json(collegesWithCounts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching colleges', error });
    }
};

export const getCollegeStats = async (req: Request, res: Response) => {
    try {
        const totalColleges = await College.countDocuments({ status: { $ne: 'deleted' } });
        const totalUsers = await User.countDocuments({ status: { $ne: 'deleted' } });
        const totalCourses = await Course.countDocuments({ status: { $ne: 'deleted' } });

        res.json({ totalColleges, totalUsers, totalCourses });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error });
    }
};

export const updateCollegeStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const college = await College.findByIdAndUpdate(id, { status }, { returnDocument: 'after' });
        res.json(college);
    } catch (error) {
        res.status(500).json({ message: 'Error updating college status', error });
    }
};

export const updateCollege = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if ((req as any).user.role === Role.COLLEGE_ADMIN && (req as any).user.collegeId !== id) {
            return res.status(403).json({ message: 'Unauthorized: You can only update your own institution.' });
        }

        const college = await College.findByIdAndUpdate(id, updates, { returnDocument: 'after' });
        res.json(college);
    } catch (error) {
        res.status(500).json({ message: 'Error updating college', error });
    }
};

export const getCollegeById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const college = await College.findById(id);
        if (!college) return res.status(404).json({ message: 'College not found' });

        const userCount = await User.countDocuments({ collegeId: college._id, status: { $ne: 'deleted' } });
        const courseCount = await Course.countDocuments({ collegeId: college._id, status: { $ne: 'deleted' } });

        res.json({
            ...college.toObject(),
            id: college._id,
            _count: { users: userCount, courses: courseCount }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching college details', error });
    }
};

export const deleteCollege = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const users = await User.find({ collegeId: id });
        const userIds = users.map((u: any) => u._id);

        const courses = await Course.find({ collegeId: id });
        const courseIds = courses.map((c: any) => c._id);

        
        await User.deleteMany({ collegeId: id });
        await Course.deleteMany({ collegeId: id });
 
        
        await College.findByIdAndDelete(id);
 
        console.log(`[deleteCollege] Hard-deleted college ${id} and all associated users/courses.`);
        res.json({ message: 'College and all associated data have been permanently deleted.' });
    } catch (error) {
        console.error('[deleteCollege] Error:', error);
        res.status(500).json({ message: 'Error performing cascading hard-delete', error });
    }
};

export const getPlatformStats = async (req: Request, res: Response) => {
    try {
        const totalColleges = await College.countDocuments({ status: { $ne: 'deleted' } });
        const totalStudents = await User.countDocuments({ role: Role.STUDENT, status: { $ne: 'deleted' } });
        const totalRecruiters = await User.countDocuments({ role: Role.RECRUITER, status: { $ne: 'deleted' } });

        res.json({
            colleges: totalColleges,
            students: totalStudents,
            recruiters: totalRecruiters
        });
    } catch (error) {
        console.error('[getPlatformStats] Error:', error);
        res.status(500).json({ message: 'Error fetching platform statistics', error });
    }
};
