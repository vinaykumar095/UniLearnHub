import { Router } from 'express';
import { getPlatformStats, getCollegeStats } from '../controllers/analyticsController';
import { protect, authorize } from '../middlewares/auth';
import { Role } from '../models/User';

const router = Router();

router.get('/platform', protect, authorize(Role.CENTRAL_ADMIN), getPlatformStats);
router.get('/college', protect, authorize(Role.COLLEGE_ADMIN), getCollegeStats);

export default router;
