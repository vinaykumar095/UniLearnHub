import { Router } from 'express';
import { getFacultyDashboard, getStudentProgress, provideGuidance, getCourseStudents, updateCourseMaterials, getGuidanceHistory } from '../controllers/facultyController';
import { protect, authorize } from '../middlewares/auth';
import { Role } from '../models/User';

const router = Router();

router.get('/dashboard', protect, authorize(Role.FACULTY), getFacultyDashboard);
router.get('/students', protect, authorize(Role.FACULTY), getStudentProgress);
router.get('/courses/:id/students', protect, authorize(Role.FACULTY), getCourseStudents);
router.patch('/courses/:id/materials', protect, authorize(Role.FACULTY), updateCourseMaterials);
router.post('/guidance', protect, authorize(Role.FACULTY), provideGuidance);
router.get('/guidance', protect, authorize(Role.FACULTY), getGuidanceHistory);

export default router;
