import { Router } from 'express';
import { createCourse, getCourses, enrollInCourse, approveCourse, getFacultyCourses, getEnrolledCourses, getCourseById, updateCourse } from '../controllers/courseController';
import { protect, authorize } from '../middlewares/auth';
import { Role } from '../models/User';

const router = Router();

router.post('/', protect, authorize(Role.CENTRAL_ADMIN, Role.COLLEGE_ADMIN, Role.FACULTY), createCourse);
router.get('/', protect, getCourses);
router.get('/faculty', protect, authorize(Role.FACULTY), getFacultyCourses);
router.get('/enrolled', protect, authorize(Role.STUDENT), getEnrolledCourses);
router.post('/enroll', protect, authorize(Role.STUDENT), enrollInCourse);
router.get('/:id', protect, getCourseById);
router.patch('/:id/approve', protect, authorize(Role.COLLEGE_ADMIN, Role.CENTRAL_ADMIN), approveCourse);
router.put('/:id', protect, authorize(Role.FACULTY), updateCourse);

export default router;
