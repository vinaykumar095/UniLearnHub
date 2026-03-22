import { Router } from 'express';
import { createAssignment, getAssignmentsByCourse, deleteAssignment } from '../controllers/assignmentController';
import { protect, authorize } from '../middlewares/auth';
import { Role } from '../models/User';

const router = Router();

router.post('/', protect, authorize(Role.FACULTY), createAssignment);
router.get('/course/:courseId', protect, getAssignmentsByCourse);
router.delete('/:id', protect, authorize(Role.FACULTY), deleteAssignment);

export default router;
