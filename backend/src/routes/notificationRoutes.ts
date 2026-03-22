import { Router } from 'express';
import { getNotifications, markAsRead, markAllAsRead, broadcastAnnouncement, adminBroadcast } from '../controllers/notificationController';
import { protect, authorize } from '../middlewares/auth';
import { Role } from '../models/User';

const router = Router();

router.get('/', protect, getNotifications);
router.patch('/read-all', protect, markAllAsRead);
router.patch('/:id/read', protect, markAsRead);
router.post('/broadcast', protect, authorize(Role.FACULTY, Role.RECRUITER), broadcastAnnouncement);
router.post('/admin-broadcast', protect, authorize(Role.CENTRAL_ADMIN), adminBroadcast);

export default router;
