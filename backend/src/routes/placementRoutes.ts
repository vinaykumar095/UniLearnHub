import { Router } from 'express';
import { getPlacementProgress, submitAttempt, toggleAptitudeStatus, getAptitudeStatus } from '../controllers/placementController';
import { protect } from '../middlewares/auth';

const router = Router();

router.get('/progress', protect, getPlacementProgress);
router.post('/attempt', protect, submitAttempt);
router.post('/status/toggle', protect, toggleAptitudeStatus);
router.get('/status', protect, getAptitudeStatus);

export default router;
