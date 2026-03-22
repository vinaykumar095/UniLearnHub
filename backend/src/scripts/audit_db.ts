
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import College from '../models/College';

async function checkOrphans() {
    try {
        await mongoose.connect('mongodb://localhost:27017/unilearnhub');
        const users = await User.find({}).populate('collegeId');
        console.log('Total Users:', users.length);
        
        const orphans = users.filter((u: any) => !u.collegeId && u.role !== 'CENTRAL_ADMIN' && u.role !== 'RECRUITER');
        console.log('Orphaned Users (Institutional but no College):', orphans.length);
        orphans.forEach((u: any) => {
            console.log(`- ${u.name} (${u.email}) | Role: ${u.role} | Status: ${u.status}`);
        });

        const recruiters = users.filter((u: any) => u.role === 'RECRUITER');
        console.log('Total Recruiters:', recruiters.length);

        const colleges = await College.find({});
        console.log('Total Colleges:', colleges.length);

        const centralAdmins = users.filter((u: any) => u.role === 'CENTRAL_ADMIN');
        console.log('Total Central Admins:', centralAdmins.length);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkOrphans();
