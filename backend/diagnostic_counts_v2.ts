import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User, { Role } from './src/models/User';
import College from './src/models/College';
import Job from './src/models/Job';
import Course from './src/models/Course';

dotenv.config();

const diagnostic = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/unilearnhub');
        console.log('Connected to MongoDB');

        const allUsers = await User.find();
        const allColleges = await College.find();
        const allJobs = await Job.find();
        const allCourses = await Course.find();

        console.log('--- Database Summary ---');
        console.log(`Total Users: ${allUsers.length}`);
        console.log(`Total Colleges: ${allColleges.length}`);
        console.log(`Total Jobs: ${allJobs.length}`);
        console.log(`Total Courses: ${allCourses.length}`);

        console.log('\n--- Role Breakdown ---');
        const roles = ['STUDENT', 'FACULTY', 'RECRUITER', 'COLLEGE_ADMIN', 'CENTRAL_ADMIN'];
        for (const role of roles) {
            const count = allUsers.filter(u => u.role === role).length;
            const deleted = allUsers.filter(u => u.role === role && u.status === 'deleted').length;
            console.log(`${role}: ${count} (Deleted: ${deleted})`);
        }

        console.log('\n--- Orphan Check ---');
        const orphans = allUsers.filter(u => 
            (u.role === 'STUDENT' || u.role === 'FACULTY' || u.role === 'COLLEGE_ADMIN') && 
            (!u.collegeId || !allColleges.find(c => c._id.toString() === u.collegeId.toString()))
        );
        console.log(`Users with missing/invalid CollegeID: ${orphans.length}`);
        if (orphans.length > 0) {
            orphans.slice(0, 5).forEach(o => console.log(`- Orphan: ${o.name} (${o.email}), Role: ${o.role}, CollegeID: ${o.collegeId}`));
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error('Diagnostic error:', err);
    }
};

diagnostic();
