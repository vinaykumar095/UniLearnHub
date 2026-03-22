import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User, { Role } from '../models/User';
import College from '../models/College';
import Job from '../models/Job';
import Course from '../models/Course';
import PlacementDrive from '../models/PlacementDrive';

dotenv.config();

const nukeOrphans = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/unilearnhub');
        console.log('--- Database Cleanup Started ---');

        // 1. Hard delete users marked as 'deleted'
        const deletedUsers = await User.deleteMany({ status: 'deleted' });
        console.log(`- Permanently removed ${deletedUsers.deletedCount} users marked as 'deleted'.`);

        // 2. Identify and remove orphaned Students/Faculty (no valid college)
        const allColleges = await College.find().select('_id');
        const collegeIds = allColleges.map(c => c._id.toString());
        
        const orphans = await User.deleteMany({
            role: { $in: [Role.STUDENT, Role.FACULTY, Role.COLLEGE_ADMIN] },
            collegeId: { $nin: collegeIds.map(id => new mongoose.Types.ObjectId(id)) }
        });
        console.log(`- Removed ${orphans.deletedCount} orphaned users with invalid college IDs.`);

        // 3. Remove Jobs with no valid Recruiter
        const allRecruiters = await User.find({ role: Role.RECRUITER }).select('_id');
        const recruiterIds = allRecruiters.map(r => r._id.toString());

        const orphanedJobs = await Job.deleteMany({
            recruiterId: { $nin: recruiterIds.map(id => new mongoose.Types.ObjectId(id)) }
        });
        console.log(`- Removed ${orphanedJobs.deletedCount} orphaned jobs.`);

        // 4. Remove Placement Drives with no valid Recruiter
        const orphanedDrives = await PlacementDrive.deleteMany({
            recruiterId: { $nin: recruiterIds.map(id => new mongoose.Types.ObjectId(id)) }
        });
        console.log(`- Removed ${orphanedDrives.deletedCount} orphaned placement drives.`);

        // 5. Remove Courses with no valid Faculty or College
        const orphanedCourses = await Course.deleteMany({
            $or: [
                { collegeId: { $nin: collegeIds.map(id => new mongoose.Types.ObjectId(id)) } },
                { facultyId: { $nin: (await User.find({ role: Role.FACULTY }).select('_id')).map(f => f._id) } }
            ]
        });
        console.log(`- Removed ${orphanedCourses.deletedCount} orphaned courses.`);

        console.log('--- Cleanup Complete ---');
        await mongoose.disconnect();
    } catch (err) {
        console.error('Cleanup error:', err);
    }
};

nukeOrphans();
