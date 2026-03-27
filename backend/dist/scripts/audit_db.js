"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("../models/User"));
const College_1 = __importDefault(require("../models/College"));
async function checkOrphans() {
    try {
        await mongoose_1.default.connect('mongodb://localhost:27017/unilearnhub');
        const users = await User_1.default.find({}).populate('collegeId');
        console.log('Total Users:', users.length);
        const orphans = users.filter((u) => !u.collegeId && u.role !== 'CENTRAL_ADMIN' && u.role !== 'RECRUITER');
        console.log('Orphaned Users (Institutional but no College):', orphans.length);
        orphans.forEach((u) => {
            console.log(`- ${u.name} (${u.email}) | Role: ${u.role} | Status: ${u.status}`);
        });
        const recruiters = users.filter((u) => u.role === 'RECRUITER');
        console.log('Total Recruiters:', recruiters.length);
        const colleges = await College_1.default.find({});
        console.log('Total Colleges:', colleges.length);
        const centralAdmins = users.filter((u) => u.role === 'CENTRAL_ADMIN');
        console.log('Total Central Admins:', centralAdmins.length);
        process.exit(0);
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
}
checkOrphans();
