"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const placementDriveController_1 = require("../controllers/placementDriveController");
const auth_1 = require("../middlewares/auth");
const User_1 = require("../models/User");
const router = express_1.default.Router();
router.post('/', auth_1.protect, (0, auth_1.authorize)(User_1.Role.RECRUITER), placementDriveController_1.createDrive);
router.get('/', auth_1.protect, placementDriveController_1.getDrives);
router.get('/recruiter', auth_1.protect, (0, auth_1.authorize)(User_1.Role.RECRUITER), placementDriveController_1.getRecruiterDrives);
router.delete('/:id', auth_1.protect, (0, auth_1.authorize)(User_1.Role.RECRUITER), placementDriveController_1.deleteDrive);
exports.default = router;
