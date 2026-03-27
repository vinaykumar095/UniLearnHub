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
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const College_1 = __importDefault(require("../models/College"));
const User_1 = __importStar(require("../models/User"));
const Course_1 = __importDefault(require("../models/Course"));
const Job_1 = __importDefault(require("../models/Job"));
dotenv_1.default.config();
const seed = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/unilearnhub');
        console.log('Connected to MongoDB for seeding...');
        await College_1.default.deleteMany({});
        await User_1.default.deleteMany({});
        await Course_1.default.deleteMany({});
        await Job_1.default.deleteMany({});
        const hashedPassword = await bcrypt_1.default.hash('password123', 10);
        const mit = await College_1.default.create({ name: 'MIT Institute', location: 'Cambridge, MA' });
        const stanford = await College_1.default.create({ name: 'Stanford University', location: 'Stanford, CA' });
        const parul = await College_1.default.create({ name: 'Parul University', location: 'Vadodara, Gujarat' });
        await User_1.default.create({
            name: 'Platform Admin',
            email: 'admin@unilearn.com',
            password: hashedPassword,
            role: User_1.Role.CENTRAL_ADMIN,
        });
        await User_1.default.create({
            name: 'MIT Admin',
            email: 'admin@mit.edu',
            password: hashedPassword,
            role: User_1.Role.COLLEGE_ADMIN,
            collegeId: mit._id,
        });
        const faculty = await User_1.default.create({
            name: 'Dr. Smith',
            email: 'smith@mit.edu',
            password: hashedPassword,
            role: User_1.Role.FACULTY,
            collegeId: mit._id,
        });
        const student = await User_1.default.create({
            name: 'Alice Johnson',
            email: 'alice@mit.edu',
            password: hashedPassword,
            role: User_1.Role.STUDENT,
            collegeId: mit._id,
        });
        const recruiter = await User_1.default.create({
            name: 'Tech Corp Recruiter',
            email: 'recruiter@techcorp.com',
            password: hashedPassword,
            role: User_1.Role.RECRUITER,
        });
        const course = await Course_1.default.create({
            title: 'Advanced React Patterns',
            description: 'Master React with advanced patterns and performance optimization.',
            facultyId: faculty._id,
            collegeId: mit._id,
        });
        await Job_1.default.create({
            title: 'Full Stack Developer',
            company: 'Tech Corp',
            location: 'Remote',
            workMode: 'Remote',
            jobType: 'Full-time',
            description: 'Looking for a skilled developer to join our core team.',
            recruiterId: recruiter._id,
            deadline: new Date('2026-12-31'),
        });
        console.log('Seed data created successfully!');
        process.exit();
    }
    catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};
seed();
