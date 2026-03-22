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

        const students = await User.find({ role: Role.STUDENT });
        const faculty = await User.find({ role: Role.FACULTY });
        const recruiters = await User.find({ role: Role.RECRUITER });
        const colleges = await College.find();
        const jobs = await Job.find();

        console.log('--- Database Audit ---');
        console.log(`Colleges: ${colleges.length}`);
        console.log(`Students: ${students.length}`);
        console.log(`Faculty: ${faculty.length}`);
        console.log(`Recruiters: ${recruiters.length}`);
        console.log(`Jobs: ${jobs.length}`);

        if (students.length > 0) {
            console.log('\nSample Students:');
            students.slice(0, 3).forEach(s => console.log(`- ${s.name} (${s.email}), CollegeID: ${s.collegeId}`));
        }

        if (faculty.length > 0) {
            console.log('\nSample Faculty:');
            faculty.slice(0, 3).forEach(f => console.log(`- ${f.name} (${f.email}), CollegeID: ${f.collegeId}`));
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
};

diagnostic();
