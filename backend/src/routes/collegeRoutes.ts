import { Router } from 'express';
import { createCollege, getColleges, getCollegeById, getCollegeStats, updateCollege, updateCollegeStatus, registerCollege, approveCollege, deleteCollege, getPlatformStats } from '../controllers/collegeController';
import { protect, authorize } from '../middlewares/auth';
import { Role } from '../models/User';

const router = Router();

// Public: Self-registration for colleges
router.post('/register', registerCollege);
router.get('/public-stats', getPlatformStats);

// Admin-only: Create, manage, approve colleges
router.post('/', protect, authorize(Role.CENTRAL_ADMIN), createCollege);
router.get('/', getColleges);
router.get('/:id', protect, authorize(Role.CENTRAL_ADMIN), getCollegeById);
router.get('/stats', protect, authorize(Role.CENTRAL_ADMIN), getCollegeStats);
router.put('/:id', protect, authorize(Role.CENTRAL_ADMIN, Role.COLLEGE_ADMIN), updateCollege);
router.patch('/:id/status', protect, authorize(Role.CENTRAL_ADMIN), updateCollegeStatus);
router.patch('/:id/approve', protect, authorize(Role.CENTRAL_ADMIN), approveCollege);
router.delete('/:id', protect, authorize(Role.CENTRAL_ADMIN), deleteCollege);

export default router;
