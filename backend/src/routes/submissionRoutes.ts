import { Router } from 'express';
import { submitAssignment, getSubmissionsByAssignment, gradeSubmission } from '../controllers/submissionController';
import { protect, authorize } from '../middlewares/auth';
import { Role } from '../models/User';

const router = Router();

router.post('/', protect, authorize(Role.STUDENT), submitAssignment);
router.get('/assignment/:assignmentId', protect, authorize(Role.FACULTY), getSubmissionsByAssignment);
router.patch('/:id/grade', protect, authorize(Role.FACULTY), gradeSubmission);

export default router;
