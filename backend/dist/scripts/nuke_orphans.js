"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importStar(require("../models/User"));
const College_1 = __importDefault(require("../models/College"));
const Job_1 = __importDefault(require("../models/Job"));
const Course_1 = __importDefault(require("../models/Course"));
const PlacementDrive_1 = __importDefault(require("../models/PlacementDrive"));
dotenv_1.default.config();
const nukeOrphans = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/unilearnhub');
        console.log('--- Database Cleanup Started ---');
        const deletedUsers = await User_1.default.deleteMany({ status: 'deleted' });
        console.log(`- Permanently removed ${deletedUsers.deletedCount} users marked as 'deleted'.`);
        const allColleges = await College_1.default.find().select('_id');
        const collegeIds = allColleges.map(c => c._id.toString());
        const orphans = await User_1.default.deleteMany({
            role: { $in: [User_1.Role.STUDENT, User_1.Role.FACULTY, User_1.Role.COLLEGE_ADMIN] },
            collegeId: { $nin: collegeIds.map(id => new mongoose_1.default.Types.ObjectId(id)) }
        });
        console.log(`- Removed ${orphans.deletedCount} orphaned users with invalid college IDs.`);
        const allRecruiters = await User_1.default.find({ role: User_1.Role.RECRUITER }).select('_id');
        const recruiterIds = allRecruiters.map(r => r._id.toString());
        const orphanedJobs = await Job_1.default.deleteMany({
            recruiterId: { $nin: recruiterIds.map(id => new mongoose_1.default.Types.ObjectId(id)) }
        });
        console.log(`- Removed ${orphanedJobs.deletedCount} orphaned jobs.`);
        const orphanedDrives = await PlacementDrive_1.default.deleteMany({
            recruiterId: { $nin: recruiterIds.map(id => new mongoose_1.default.Types.ObjectId(id)) }
        });
        console.log(`- Removed ${orphanedDrives.deletedCount} orphaned placement drives.`);
        const orphanedCourses = await Course_1.default.deleteMany({
            $or: [
                { collegeId: { $nin: collegeIds.map(id => new mongoose_1.default.Types.ObjectId(id)) } },
                { facultyId: { $nin: (await User_1.default.find({ role: User_1.Role.FACULTY }).select('_id')).map(f => f._id) } }
            ]
        });
        console.log(`- Removed ${orphanedCourses.deletedCount} orphaned courses.`);
        console.log('--- Cleanup Complete ---');
        await mongoose_1.default.disconnect();
    }
    catch (err) {
        console.error('Cleanup error:', err);
    }
};
nukeOrphans();
