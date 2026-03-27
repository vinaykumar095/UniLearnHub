"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCourseById = exports.getEnrolledCourses = exports.getFacultyCourses = exports.updateCourseMaterials = exports.updateCourse = exports.approveCourse = exports.enrollInCourse = exports.getCourses = exports.createCourse = void 0;
const Course_1 = __importDefault(require("../models/Course"));
const Enrollment_1 = __importDefault(require("../models/Enrollment"));
const User_1 = __importDefault(require("../models/User"));
const createCourse = async (req, res) => {
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
        const course = await Course_1.default.create({
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
                const collegeAdmins = await User_1.default.find({ collegeId, role: 'COLLEGE_ADMIN' }).select('_id');
                for (const admin of collegeAdmins) {
                    await createNotification(admin._id, `New course pending approval: ${title}`);
                }
            }
            catch (notifyError) {
                console.error('[createCourse] Notification Error:', notifyError);
            }
        })();
    }
    catch (error) {
        console.error('[createCourse] Error:', error);
        res.status(500).json({ message: 'Error creating course', error });
    }
};
exports.createCourse = createCourse;
const getCourses = async (req, res) => {
    try {
        const { collegeId, status } = req.query;
        const query = {};
        console.log(`[getCourses] Initial params:`, { collegeId, status, userRole: req.user?.role });
        if (collegeId) {
            try {
                const mongoose = require('mongoose');
                query.collegeId = new mongoose.Types.ObjectId(collegeId);
            }
            catch (e) {
                query.collegeId = collegeId;
            }
        }
        if (req.user?.role === 'STUDENT') {
            query.status = 'approved';
        }
        else if (status) {
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
        const courses = await Course_1.default.find(query)
            .populate('facultyId', 'name')
            .populate('collegeId', 'name')
            .sort({ [sortedBy]: order });
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
                faculty: obj.facultyId ? { name: obj.facultyId.name } : null,
                college: obj.collegeId ? { name: obj.collegeId.name } : null,
                duration: obj.duration,
                difficulty: obj.difficulty,
                rating: obj.rating,
                ratingCount: obj.ratingCount,
                enrollmentCount: obj.enrollmentCount,
                category: obj.category,
                syllabus: obj.syllabus,
                learningOutcomes: obj.learningOutcomes,
                status: obj.status,
                createdAt: obj.createdAt
            };
        });
        res.json(formattedCourses);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching courses', error });
    }
};
exports.getCourses = getCourses;
const enrollInCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const studentId = req.user.id;
        const course = await Course_1.default.findById(courseId);
        if (!course || course.status !== 'approved') {
            return res.status(400).json({ message: 'Cannot enroll in an unapproved or non-existent course.' });
        }
        const existing = await Enrollment_1.default.findOne({ studentId, courseId });
        if (existing)
            return res.status(400).json({ message: 'Already enrolled.' });
        const enrollment = await Enrollment_1.default.create({ studentId, courseId });
        await Course_1.default.findByIdAndUpdate(courseId, { $inc: { enrollmentCount: 1 } });
        res.status(201).json(enrollment);
    }
    catch (error) {
        res.status(500).json({ message: 'Error enrolling in course', error });
    }
};
exports.enrollInCourse = enrollInCourse;
const approveCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const course = await Course_1.default.findByIdAndUpdate(id, { status }, { returnDocument: 'after' });
        if (course && status === 'approved') {
            const { createNotification, notifyStudents } = require('./notificationController');
            await createNotification(course.facultyId, `Your course "${course.title}" has been approved!`);
            await notifyStudents(`New course available: ${course.title}`, course.collegeId?.toString());
        }
        res.json(course);
    }
    catch (error) {
        res.status(500).json({ message: 'Error approving course', error });
    }
};
exports.approveCourse = approveCourse;
const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, category, difficulty, duration, syllabus, learningOutcomes } = req.body;
        const course = await Course_1.default.findByIdAndUpdate(id, { title, description, category, difficulty, duration, syllabus, learningOutcomes }, { returnDocument: 'after' });
        res.json(course);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating course', error });
    }
};
exports.updateCourse = updateCourse;
const updateCourseMaterials = async (req, res) => {
    try {
        const { id } = req.params;
        const { materials } = req.body;
        const course = await Course_1.default.findByIdAndUpdate(id, { materials }, { returnDocument: 'after' });
        res.json(course);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating materials', error });
    }
};
exports.updateCourseMaterials = updateCourseMaterials;
const getFacultyCourses = async (req, res) => {
    try {
        const facultyId = req.user.id;
        const mongoose = require('mongoose');
        const query = { facultyId: new mongoose.Types.ObjectId(facultyId) };
        console.log(`[getFacultyCourses] Querying for facultyId:`, facultyId);
        const courses = await Course_1.default.find(query)
            .populate('collegeId', 'name');
        console.log(`[getFacultyCourses] Found ${courses.length} courses for faculty.`);
        if (courses.length > 0) {
            console.log(`[getFacultyCourses] IDs:`, courses.map(c => c._id));
        }
        res.json(courses);
    }
    catch (error) {
        console.error('[getFacultyCourses] Error:', error);
        res.status(500).json({ message: 'Error fetching faculty courses', error });
    }
};
exports.getFacultyCourses = getFacultyCourses;
const getEnrolledCourses = async (req, res) => {
    try {
        const studentId = req.user.id;
        const enrollments = await Enrollment_1.default.find({ studentId })
            .populate({
            path: 'courseId',
            populate: { path: 'facultyId', select: 'name' }
        });
        res.json(enrollments.map(e => e.courseId));
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching enrolled courses', error });
    }
};
exports.getEnrolledCourses = getEnrolledCourses;
const getCourseById = async (req, res) => {
    try {
        const course = await Course_1.default.findById(req.params.id)
            .populate('facultyId', 'name email department bio designation qualification experience specialization researchInterests avatar')
            .populate('collegeId', 'name');
        if (!course)
            return res.status(404).json({ message: 'Course not found' });
        res.json(course);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching course', error });
    }
};
exports.getCourseById = getCourseById;
