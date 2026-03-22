import { Router } from 'express';
import {
    getUsers, updateUserRole, updateUserStatus, createUser, deleteUser,
    getProfile, updateProfile, changePassword, updateSettings, getRecentActivity,
    getUserById
} from '../controllers/userController';
import { protect, authorize } from '../middlewares/auth';
import { Role } from '../models/User';

const router = Router();

router.route('/profile')
    .get(protect, getProfile)
    .put(protect, updateProfile);
router.post('/profile/password', protect, changePassword);
router.put('/profile/settings', protect, updateSettings);
router.get('/profile/activity', protect, getRecentActivity);

router.route('/')
    .get(protect, authorize(Role.CENTRAL_ADMIN, Role.COLLEGE_ADMIN), getUsers)
    .post(protect, authorize(Role.CENTRAL_ADMIN), createUser);
router.get('/:id', protect, authorize(Role.CENTRAL_ADMIN, Role.COLLEGE_ADMIN), getUserById);
router.patch('/:id/role', protect, authorize(Role.CENTRAL_ADMIN), updateUserRole);
router.patch('/:id/status', protect, authorize(Role.CENTRAL_ADMIN, Role.COLLEGE_ADMIN), updateUserStatus);
router.delete('/:id', protect, authorize(Role.CENTRAL_ADMIN, Role.COLLEGE_ADMIN), deleteUser);

export default router;
