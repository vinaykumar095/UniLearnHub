const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://user_debug:Password123@cluster0.p7d0s.mongodb.net/UniLearnHub?retryWrites=true&w=majority';

async function verifyCascadingDelete() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // 1. Create a dummy college
        const College = mongoose.model('College', new mongoose.Schema({}, { strict: false }));
        const college = await College.create({ name: 'Delete Me University', status: 'active' });
        const collegeId = college._id;
        console.log('Created College:', collegeId);

        // 2. Create users and courses for this college
        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
        const Course = mongoose.model('Course', new mongoose.Schema({}, { strict: false }));
        
        const user = await User.create({ name: 'Disposable Student', collegeId: collegeId, role: 'STUDENT' });
        const course = await Course.create({ title: 'Course to be Deleted', collegeId: collegeId, facultyId: user._id });
        console.log('Created User:', user._id);
        console.log('Created Course:', course._id);

        const Enrollment = mongoose.model('Enrollment', new mongoose.Schema({}, { strict: false }));
        const Submission = mongoose.model('Submission', new mongoose.Schema({}, { strict: false }));
        const Assignment = mongoose.model('Assignment', new mongoose.Schema({}, { strict: false }));

        const assignment = await Assignment.create({ title: 'Final Test', courseId: course._id });
        const enrollment = await Enrollment.create({ studentId: user._id, courseId: course._id });
        const submission = await Submission.create({ studentId: user._id, assignmentId: assignment._id });
        
        console.log('Created dependencies: Enrollment, Assignment, Submission');

        console.log('--- PERFORMING CASCADING DELETE SIMULATION ---');
        
        const usersInColl = await User.find({ collegeId: collegeId });
        const uIds = usersInColl.map(u => u._id);
        const coursesInColl = await Course.find({ collegeId: collegeId });
        const cIds = coursesInColl.map(c => c._id);

        await Submission.deleteMany({ $or: [ { assignmentId: { $in: [assignment._id] } }, { studentId: { $in: uIds } } ] });
        await Assignment.deleteMany({ courseId: { $in: cIds } });
        await Enrollment.deleteMany({ $or: [ { courseId: { $in: cIds } }, { studentId: { $in: uIds } } ] });
        await Course.deleteMany({ collegeId: collegeId });
        await User.deleteMany({ collegeId: collegeId });
        await College.findByIdAndDelete(collegeId);

        console.log('--- VERIFYING PURGE ---');
        const endCollege = await College.findById(collegeId);
        const endUser = await User.findById(user._id);
        const endCourse = await Course.findById(course._id);
        const endEnroll = await Enrollment.findById(enrollment._id);
        const endSub = await Submission.findById(submission._id);

        console.log('College exists?', !!endCollege);
        console.log('User exists?', !!endUser);
        console.log('Course exists?', !!endCourse);
        console.log('Enrollment exists?', !!endEnroll);
        console.log('Submission exists?', !!endSub);

        if (!endCollege && !endUser && !endCourse && !endEnroll && !endSub) {
            console.log('SUCCESS: All related data purged.');
        } else {
            console.log('FAILURE: Some data remains.');
        }

    } catch (error) {
        console.error('Verification failed:', error);
    } finally {
        await mongoose.connection.close();
    }
}

verifyCascadingDelete();
