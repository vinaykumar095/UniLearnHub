import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import Job from '../models/Job';
import Application from '../models/Application';
import Enrollment from '../models/Enrollment';
import PlacementPrep from '../models/PlacementPrep';
import Assignment from '../models/Assignment';
import Submission from '../models/Submission';
import User, { Role } from '../models/User';
import { AuthRequest } from '../middlewares/auth';

export const createJob = async (req: any, res: any) => {
    try {
        const { 
            title, description, recruiterId, collegeIds, eligibility, deadline,
            company, companyLogo, location, jobType, workMode, salary,
            experienceLevel, skillsRequired, requirements 
        } = req.body;

        const job = await Job.create({
            title,
            description,
            company,
            companyLogo,
            location,
            jobType,
            workMode,
            salary,
            experienceLevel,
            skillsRequired: Array.isArray(skillsRequired) ? skillsRequired : (skillsRequired ? skillsRequired.split(',').map((s: string) => s.trim()) : []),
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
        } else {
            await notifyStudents(`New global job opening: ${title}`);
        }

        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({ message: 'Error creating job', error });
    }
};

export const getJobs = async (req: any, res: any) => {
    try {
        const user = req.user;
        let query: any = {};

        // Auto-filter by college participation for Students and College Admins
        const filterCollegeId = (user?.role === Role.COLLEGE_ADMIN || user?.role === Role.STUDENT) 
            ? user.collegeId 
            : req.query.collegeId;

        if (filterCollegeId) {
            query.$or = [
                { colleges: filterCollegeId },
                { colleges: { $size: 0 } },
                { colleges: { $exists: false } }
            ];
        }

        const jobs = await Job.find(query)
            .populate('recruiterId', 'name company')
            .populate('colleges', 'name');

        const formattedJobs = jobs.map(job => {
            const obj = job.toObject();
            return {
                id: obj._id,
                title: obj.title,
                description: obj.description,
                company: obj.company || (obj.recruiterId as any)?.company || 'Unknown',
                companyLogo: obj.companyLogo,
                location: obj.location,
                jobType: obj.jobType,
                workMode: obj.workMode,
                salary: obj.salary,
                experienceLevel: obj.experienceLevel,
                skillsRequired: obj.skillsRequired,
                recruiter: obj.recruiterId ? { name: (obj.recruiterId as any).name } : null,
                colleges: obj.colleges.map((c: any) => ({ name: c.name })),
                eligibility: obj.eligibility,
                requirements: obj.requirements,
                deadline: obj.deadline
            };
        });
        res.json(formattedJobs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching jobs', error });
    }
};

export const applyForJob = async (req: any, res: ExpressResponse) => {
    try {
        const { jobId, resumeUrl, portfolioLink, coverLetter } = req.body;
        const studentId = req.user.id;

        // Check for duplicate application
        const existing = await Application.findOne({ jobId, studentId });
        if (existing) {
            return res.status(400).json({ message: 'You have already applied for this job' });
        }

        const application = await Application.create({ 
            jobId, 
            studentId,
            resumeUrl,
            portfolioLink,
            coverLetter
        });

        // Notify Recruiter with Student Name
        const job = await Job.findById(jobId);
        const student = await User.findById(studentId).select('name');
        if (job && student) {
            const { createNotification } = require('./notificationController');
            await createNotification(
                job.recruiterId, 
                `[💼 APPLICATION] ${student.name} has applied for your job: ${job.title}`
            );
        }

        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ message: 'Error applying for job', error });
    }
};
export const getRecruiterJobs = async (req: any, res: ExpressResponse) => {
    try {
        const recruiterId = req.user.id;
        const jobs = await Job.find({ recruiterId })
            .populate('colleges', 'name');
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recruiter jobs', error });
    }
};

export const getJobApplicants = async (req: any, res: any) => {
    try {
        const { jobId } = req.params;
        const applications = await Application.find({ jobId })
            .populate('studentId', 'name email collegeId');
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching applicants', error });
    }
};

export const updateApplicationStatus = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const application = await Application.findByIdAndUpdate(id, { status }, { returnDocument: 'after' })
            .populate({ path: 'jobId', select: 'title company' });

        if (application) {
            const { createNotification } = require('./notificationController');
            await createNotification(application.studentId, `Your application for "${(application.jobId as any).title}" has been ${status}.`);
        }

        res.json(application);
    } catch (error) {
        res.status(500).json({ message: 'Error updating application status', error });
    }
};

// Student: get my own applications with status
export const getStudentApplications = async (req: any, res: ExpressResponse) => {
    try {
        const studentId = req.user.id;
        const applications = await Application.find({ studentId })
            .populate('jobId', 'title description eligibility deadline')
            .sort({ createdAt: -1 });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching applications', error });
    }
};

// College Admin: get all applications from their students
export const getCollegeApplications = async (req: any, res: ExpressResponse) => {
    try {
        const collegeId = req.user.collegeId;
        if (!collegeId) return res.status(400).json({ message: 'College ID required' });

        // Find students belonging to this college
        const students = await User.find({ collegeId, role: Role.STUDENT }).select('_id');
        const studentIds = students.map(s => s._id);

        const applications = await Application.find({ studentId: { $in: studentIds } })
            .populate('studentId', 'name email branch year')
            .populate('jobId', 'title company')
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching college applications', error });
    }
};

import Guidance from '../models/Guidance';
import AptitudeStatus from '../models/AptitudeStatus';
import DSASubmission from '../models/DSASubmission';

export const getStudentDashboard = async (req: AuthRequest, res: ExpressResponse) => {
    try {
        const studentId = req.user!.id;

        // Fetch Guidance pulses
        const guidances = await Guidance.find({ studentId, status: 'active', 'impacts.dashboard': true })
            .populate('facultyId', 'name')
            .sort({ createdAt: -1 })
            .limit(3);

        // Basic Counts
        const enrolledCount = await Enrollment.countDocuments({ studentId });
        const completedCoursesCount = await Enrollment.countDocuments({ studentId, progress: 100 });
        const appliedCount = await Application.countDocuments({ studentId });
        const pendingApplicationsCount = await Application.countDocuments({ studentId, status: { $in: ['pending', 'applied'] } });
        const aptitudeCompletedCount = await AptitudeStatus.countDocuments({ studentId, status: 'completed' });
        const dsaSolvedCount = await DSASubmission.countDocuments({ studentId, status: 'solved' });

        const totalPlatformsItems = 120 + 36; // 120 DSA + 36 Aptitude topics
        const masteryIndex = Math.round(((dsaSolvedCount + aptitudeCompletedCount) / totalPlatformsItems) * 100);

        // Fetch Enrollments for details
        const enrollments = await Enrollment.find({ studentId })
            .populate({ path: 'courseId', populate: { path: 'facultyId', select: 'name' } });

        const enrolledCourseIds = enrollments.map(e => e.courseId._id);

        // Pending Assignments
        // 1. Get all assignments for enrolled courses
        const allAssignments = await Assignment.find({ courseId: { $in: enrolledCourseIds } });
        // 2. Get all submissions by this student
        const submissions = await Submission.find({ studentId }).select('assignmentId');
        const submittedIds = submissions.map(s => s.assignmentId.toString());

        const pendingAssignments = allAssignments.filter(a => !submittedIds.includes(a._id.toString()));

        // Learning Progress List
        const learningProgress = enrollments.map(e => ({
            id: e.courseId._id,
            title: (e.courseId as any).title,
            progress: e.progress,
            faculty: (e.courseId as any).facultyId?.name
        }));

        // Placement Stats
        const placementAttempts = await PlacementPrep.find({ studentId }).sort({ createdAt: -1 }).limit(10);
        const avgScore = placementAttempts.length
            ? Math.round(placementAttempts.reduce((s, a) => s + (a.score / a.total) * 100, 0) / placementAttempts.length)
            : 0;

        // Upcoming Deadlines (Combined Jobs + Assignments)
        const upcomingJobs = await Job.find({
            $or: [{ colleges: req.user!.collegeId }, { colleges: { $size: 0 } }],
            deadline: { $gte: new Date() }
        }).sort({ deadline: 1 }).limit(3);

        const upcomingDeadlines = [
            ...pendingAssignments.map(a => ({ type: 'ASSIGNMENT', title: a.title, deadline: a.deadline })),
            ...upcomingJobs.map(j => ({ type: 'JOB', title: j.title, deadline: j.deadline }))
        ].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()).slice(0, 5);

        // Recent Activity (Attempts + Apps + Enrollments)
        const recentActivity = [
            ...placementAttempts.map(a => ({ type: 'QUIZ', title: a.module, date: (a as any).createdAt, score: a.score })),
            ...(await Application.find({ studentId }).populate('jobId', 'title').sort({ createdAt: -1 }).limit(5)).map(app => ({
                type: 'APPLICATION',
                title: (app.jobId as any).title,
                date: (app as any).createdAt
            })),
            ...enrollments.slice(0, 5).map(e => ({ type: 'ENROLLMENT', title: (e.courseId as any).title, date: (e as any).createdAt }))
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);

        // User Info (Academic context)
        const studentInfo = await User.findById(studentId).populate('collegeId', 'name');

        res.json({
            student: {
                name: studentInfo?.name,
                college: (studentInfo?.collegeId as any)?.name,
                branch: (studentInfo as any)?.branch,
                year: (studentInfo as any)?.year,
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
    } catch (error) {
        res.status(500).json({ message: 'Error fetching dashboard stats', error });
    }
};
