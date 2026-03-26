import { Request, Response } from 'express';
import College from '../models/College';
import User, { Role } from '../models/User';
import Course from '../models/Course';
import Job from '../models/Job';
import PlacementDrive from '../models/PlacementDrive';

export const getPlatformStats = async (req: Request, res: Response) => {
    try {
        const now = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        
        const getVelocity = async (days: number) => {
            const start = new Date();
            start.setDate(start.getDate() - days);
            return await User.countDocuments({ 
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

        
        const branches = await User.aggregate([
            { 
                $match: { 
                    role: Role.STUDENT, 
                    status: { $ne: 'deleted' },
                    branch: { $exists: true, $ne: null } 
                } 
            },
            { $group: { _id: "$branch", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const totalStudents = await User.countDocuments({ role: Role.STUDENT, status: { $ne: 'deleted' } });
        const institutionalPulse = branches.map(b => ({
            name: b._id,
            percentage: totalStudents > 0 ? Math.round((b.count / totalStudents) * 100) : 0
        }));

        
        const recruiterTrends = await Job.aggregate([
            { $match: { createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) } } },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        
        const registrationActivity = await User.find({ status: { $ne: 'deleted' } })
            .sort({ createdAt: -1 })
            .limit(10)
            .select('name email role createdAt status');

        const activeCollegesCount = await College.countDocuments({ status: 'active' });

        const stats = {
            colleges: await College.countDocuments({ status: { $ne: 'deleted' } }),
            activeColleges: activeCollegesCount,
            newColleges: await College.countDocuments({ 
                status: { $ne: 'deleted' }, 
                createdAt: { $gte: thirtyDaysAgo } 
            }),
            students: totalStudents,
            faculty: await User.countDocuments({ role: Role.FACULTY, status: { $ne: 'deleted' } }),
            recruiters: {
                total: await User.countDocuments({ role: Role.RECRUITER, status: { $ne: 'deleted' } }),
                active: await User.countDocuments({ role: Role.RECRUITER, status: 'active' }),
                pending: await User.countDocuments({ role: Role.RECRUITER, status: 'pending' }),
                new: await User.countDocuments({ 
                    role: Role.RECRUITER, 
                    status: { $ne: 'deleted' },
                    createdAt: { $gte: thirtyDaysAgo } 
                })
            },
            courses: await Course.countDocuments({ status: { $ne: 'deleted' } }),
            jobs: await Job.countDocuments(), 
            placementDrives: await PlacementDrive.countDocuments({ status: { $ne: 'COMPLETED' } }),
            systemPulse: '99.9%',
            topInstitutions: await College.find({ status: 'active' }).limit(5).select('name location'),
            recruiterTrends,
            registrationActivity,
            enrollmentVelocity,
            institutionalPulse,
            aggregatedDate: now.toLocaleDateString()
        };

        
        const topInstitutionsWithCounts = await Promise.all(stats.topInstitutions.map(async (c: any) => {
            const students = await User.countDocuments({ 
                role: Role.STUDENT, 
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
        (stats as any).topInstitutions = topInstitutionsWithCounts;

        res.json(stats);
    } catch (error) {
        console.error('Error in getPlatformStats:', error);
        res.status(500).json({ message: 'Error fetching stats', error });
    }
};
export const getCollegeStats = async (req: any, res: Response) => {
    try {
        const collegeId = req.user.collegeId;
        if (!collegeId) {
            return res.status(400).json({ message: 'College ID not found for this user' });
        }

        const college = await College.findById(collegeId).select('name');

        const jobQuery = {
            $or: [
                { colleges: collegeId },
                { colleges: { $size: 0 } },
                { colleges: { $exists: false } }
            ]
        };

        const relevantJobs = await Job.countDocuments(jobQuery);
        const recruiters = await Job.distinct('recruiterId', jobQuery);
        const relevantRecruiters = recruiters.length;

        const stats = {
            collegeName: college?.name || 'Institution',
            students: await User.countDocuments({ role: Role.STUDENT, collegeId }),
            faculty: await User.countDocuments({ role: Role.FACULTY, collegeId }),
            courses: await Course.countDocuments({ collegeId }),
            relevantJobs,
            relevantRecruiters,
            pendingCourses: await Course.countDocuments({ collegeId, status: 'pending' }),
            pendingStudents: await User.countDocuments({ role: Role.STUDENT, collegeId, status: 'pending' }),
            pendingFaculty: await User.countDocuments({ role: Role.FACULTY, collegeId, status: 'pending' }),
        };
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching college stats', error });
    }
};
