"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middlewares/auth");
const User_1 = require("../models/User");
const router = (0, express_1.Router)();
router.route('/profile')
    .get(auth_1.protect, userController_1.getProfile)
    .put(auth_1.protect, userController_1.updateProfile);
router.post('/profile/password', auth_1.protect, userController_1.changePassword);
router.put('/profile/settings', auth_1.protect, userController_1.updateSettings);
router.get('/profile/activity', auth_1.protect, userController_1.getRecentActivity);
router.route('/')
    .get(auth_1.protect, (0, auth_1.authorize)(User_1.Role.CENTRAL_ADMIN, User_1.Role.COLLEGE_ADMIN), userController_1.getUsers)
    .post(auth_1.protect, (0, auth_1.authorize)(User_1.Role.CENTRAL_ADMIN), userController_1.createUser);
router.get('/:id', auth_1.protect, (0, auth_1.authorize)(User_1.Role.CENTRAL_ADMIN, User_1.Role.COLLEGE_ADMIN), userController_1.getUserById);
router.patch('/:id/role', auth_1.protect, (0, auth_1.authorize)(User_1.Role.CENTRAL_ADMIN), userController_1.updateUserRole);
router.patch('/:id/status', auth_1.protect, (0, auth_1.authorize)(User_1.Role.CENTRAL_ADMIN, User_1.Role.COLLEGE_ADMIN), userController_1.updateUserStatus);
router.delete('/:id', auth_1.protect, (0, auth_1.authorize)(User_1.Role.CENTRAL_ADMIN, User_1.Role.COLLEGE_ADMIN), userController_1.deleteUser);
exports.default = router;
