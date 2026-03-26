import { Request, Response } from 'express';
import Course from '../models/Course';
import Enrollment from '../models/Enrollment';
import User from '../models/User';

export const createCourse = async (req: any, res: Response) => {
    try {
        const { title, description, duration, difficulty, category } = req.body;
        const facultyId = req.user.id;
        const collegeId = req.body.collegeId || req.user.collegeId;

        console.log(`[createCourse] Attempting to create course:`, { 
            title, 
            facultyId, 
            collegeId,
            bodyCollegeId: req.body.collegeId,
            userCollegeId: req.user.collegeId 
        });

        if (!collegeId) {
            return res.status(400).json({ message: 'College ID is required. Your account may not be linked to a college.' });
        }
        if (!title) {
            return res.status(400).json({ message: 'Course title is required.' });
        }

        const course = await Course.create({
            title,
            description,
            collegeId,
            facultyId,
            duration,
            difficulty,
            category,
            status: 'pending'
        });
        console.log(`[createCourse] Course created successfully:`, course._id, `Status:`, course.status);
        res.status(201).json(course);

        
        (async () => {
            try {
                const { createNotification } = require('./notificationController');
                const collegeAdmins = await User.find({ collegeId, role: 'COLLEGE_ADMIN' }).select('_id');
                for (const admin of collegeAdmins) {
                    await createNotification(admin._id, `New course pending approval: ${title}`);
                }
            } catch (notifyError) {
                console.error('[createCourse] Notification Error:', notifyError);
            }
        })();
    } catch (error) {
        console.error('[createCourse] Error:', error);
        res.status(500).json({ message: 'Error creating course', error });
    }
};

export const getCourses = async (req: any, res: Response) => {
    try {
        const { collegeId, status } = req.query;
        const query: any = {};
        
        console.log(`[getCourses] Initial params:`, { collegeId, status, userRole: req.user?.role });

        if (collegeId) {
            try {
                const mongoose = require('mongoose');
                query.collegeId = new mongoose.Types.ObjectId(collegeId);
            } catch (e) {
                query.collegeId = collegeId;
            }
        }

        
        if (req.user?.role === 'STUDENT') {
            query.status = 'approved';
        } else if (status) {
            
            query.status = status;
        }

        
        if (req.user?.role === 'COLLEGE_ADMIN' && req.user?.collegeId) {
            console.log(`[getCourses] COLLEGE_ADMIN enforcing collegeId:`, req.user.collegeId);
            const mongoose = require('mongoose');
            query.collegeId = new mongoose.Types.ObjectId(req.user.collegeId);
        }

        console.log(`[getCourses] Final generated query:`, query);
        console.log(`[getCourses] Final generated query stringified:`, JSON.stringify(query));

        const sortedBy = req.query.sortBy || 'createdAt';
        const order = req.query.order === 'asc' ? 1 : -1;

        const courses = await Course.find(query)
            .populate('facultyId', 'name')
            .populate('collegeId', 'name')
            .sort({ [sortedBy as string]: order });

        console.log(`[getCourses] Found ${courses.length} courses.`);
        if (courses.length > 0) {
            console.log(`[getCourses] Sample course:`, { 
                id: courses[0]._id, 
                title: courses[0].title, 
                status: courses[0].status, 
                collegeId: courses[0].collegeId?._id || courses[0].collegeId 
            });
        }

        const formattedCourses = courses.map(course => {
            const obj = course.toObject();
            return {
                id: obj._id,
                _id: obj._id,
                title: obj.title,
                description: obj.description,
                faculty: obj.facultyId ? { name: (obj.facultyId as any).name } : null,
                college: obj.collegeId ? { name: (obj.collegeId as any).name } : null,
                duration: obj.duration,
                difficulty: obj.difficulty,
                rating: obj.rating,
                ratingCount: obj.ratingCount,
                enrollmentCount: obj.enrollmentCount,
                category: obj.category,
                syllabus: obj.syllabus,
                learningOutcomes: obj.learningOutcomes,
                status: obj.status,
                createdAt: (obj as any).createdAt
            };
        });

        res.json(formattedCourses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching courses', error });
    }
};

export const enrollInCourse = async (req: any, res: Response) => {
    try {
        const { courseId } = req.body;
        const studentId = req.user.id;

        const course = await Course.findById(courseId);
        if (!course || course.status !== 'approved') {
            return res.status(400).json({ message: 'Cannot enroll in an unapproved or non-existent course.' });
        }

        const existing = await Enrollment.findOne({ studentId, courseId });
        if (existing) return res.status(400).json({ message: 'Already enrolled.' });

        const enrollment = await Enrollment.create({ studentId, courseId });

        
        await Course.findByIdAndUpdate(courseId, { $inc: { enrollmentCount: 1 } });

        res.status(201).json(enrollment);
    } catch (error) {
        res.status(500).json({ message: 'Error enrolling in course', error });
    }
};
export const approveCourse = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const course = await Course.findByIdAndUpdate(id, { status }, { returnDocument: 'after' });

        if (course && status === 'approved') {
            const { createNotification, notifyStudents } = require('./notificationController');
            await createNotification(course.facultyId, `Your course "${course.title}" has been approved!`);
            await notifyStudents(`New course available: ${course.title}`, course.collegeId?.toString());
        }

        res.json(course);
    } catch (error) {
        res.status(500).json({ message: 'Error approving course', error });
    }
};

export const updateCourse = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const { title, description, category, difficulty, duration, syllabus, learningOutcomes } = req.body;
        const course = await Course.findByIdAndUpdate(
            id,
            { title, description, category, difficulty, duration, syllabus, learningOutcomes },
            { returnDocument: 'after' }
        );
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: 'Error updating course', error });
    }
};

export const updateCourseMaterials = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { materials } = req.body; 
        const course = await Course.findByIdAndUpdate(id, { materials }, { returnDocument: 'after' });
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: 'Error updating materials', error });
    }
};

export const getFacultyCourses = async (req: any, res: Response) => {
    try {
        const facultyId = req.user.id;
        const mongoose = require('mongoose');
        const query = { facultyId: new mongoose.Types.ObjectId(facultyId) };
        
        console.log(`[getFacultyCourses] Querying for facultyId:`, facultyId);
        
        const courses = await Course.find(query)
            .populate('collegeId', 'name');
            
        console.log(`[getFacultyCourses] Found ${courses.length} courses for faculty.`);
        if (courses.length > 0) {
            console.log(`[getFacultyCourses] IDs:`, courses.map(c => c._id));
        }
        
        res.json(courses);
    } catch (error) {
        console.error('[getFacultyCourses] Error:', error);
        res.status(500).json({ message: 'Error fetching faculty courses', error });
    }
};
export const getEnrolledCourses = async (req: any, res: Response) => {
    try {
        const studentId = req.user.id;
        const enrollments = await Enrollment.find({ studentId })
            .populate({
                path: 'courseId',
                populate: { path: 'facultyId', select: 'name' }
            });
        res.json(enrollments.map(e => e.courseId));
    } catch (error) {
        res.status(500).json({ message: 'Error fetching enrolled courses', error });
    }
};

export const getCourseById = async (req: Request, res: Response) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('facultyId', 'name email department bio designation qualification experience specialization researchInterests avatar')
            .populate('collegeId', 'name');
        if (!course) return res.status(404).json({ message: 'Course not found' });
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching course', error });
    }
};
