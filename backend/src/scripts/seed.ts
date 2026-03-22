import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import College from '../models/College';
import User, { Role } from '../models/User';
import Course from '../models/Course';
import Job from '../models/Job';

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/unilearnhub');
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await College.deleteMany({});
        await User.deleteMany({});
        await Course.deleteMany({});
        await Job.deleteMany({});

        const hashedPassword = await bcrypt.hash('password123', 10);

        // 1. Create Colleges
        const mit = await College.create({ name: 'MIT Institute', location: 'Cambridge, MA' });
        const stanford = await College.create({ name: 'Stanford University', location: 'Stanford, CA' });
        const parul = await College.create({ name: 'Parul University', location: 'Vadodara, Gujarat' });

        // 2. Create Central Admin
        await User.create({
            name: 'Platform Admin',
            email: 'admin@unilearn.com',
            password: hashedPassword,
            role: Role.CENTRAL_ADMIN,
        });

        // 3. Create College Admins
        await User.create({
            name: 'MIT Admin',
            email: 'admin@mit.edu',
            password: hashedPassword,
            role: Role.COLLEGE_ADMIN,
            collegeId: mit._id,
        });

        // 4. Create Faculty
        const faculty = await User.create({
            name: 'Dr. Smith',
            email: 'smith@mit.edu',
            password: hashedPassword,
            role: Role.FACULTY,
            collegeId: mit._id,
        });

        // 5. Create Students
        const student = await User.create({
            name: 'Alice Johnson',
            email: 'alice@mit.edu',
            password: hashedPassword,
            role: Role.STUDENT,
            collegeId: mit._id,
        });

        // 6. Create Recruiters
        const recruiter = await User.create({
            name: 'Tech Corp Recruiter',
            email: 'recruiter@techcorp.com',
            password: hashedPassword,
            role: Role.RECRUITER,
        });

        // 7. Create Course
        const course = await Course.create({
            title: 'Advanced React Patterns',
            description: 'Master React with advanced patterns and performance optimization.',
            facultyId: faculty._id,
            collegeId: mit._id,
        });

        // 8. Create Job (Global)
        await Job.create({
            title: 'Full Stack Developer',
            description: 'Looking for a skilled developer to join our core team.',
            recruiterId: recruiter._id,
            deadline: new Date('2026-12-31'),
        });

        console.log('Seed data created successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seed();
