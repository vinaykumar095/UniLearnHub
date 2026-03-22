import express from 'express';
import { createDrive, getDrives, getRecruiterDrives, deleteDrive } from '../controllers/placementDriveController';
import { protect, authorize } from '../middlewares/auth';
import { Role } from '../models/User';

const router = express.Router();

router.post('/', protect, authorize(Role.RECRUITER), createDrive);
router.get('/', protect, getDrives);
router.get('/recruiter', protect, authorize(Role.RECRUITER), getRecruiterDrives);
router.delete('/:id', protect, authorize(Role.RECRUITER), deleteDrive);

export default router;
