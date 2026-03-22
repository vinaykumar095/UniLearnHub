
const mongoose = require('mongoose');

async function migrateOrphans() {
    try {
        await mongoose.connect('mongodb://localhost:27017/unilearnhub');
        
        const Schema = mongoose.Schema;
        const UserSchema = new Schema({ 
            name: String, 
            email: String, 
            role: String, 
            status: String, 
            collegeId: { type: Schema.Types.ObjectId, ref: 'College' } 
        });
        const CollegeSchema = new Schema({ 
            name: String, 
            status: String 
        });

        // Use try-catch for model registration to prevent "Already defined" error
        let User;
        try { User = mongoose.model('User'); } catch (e) { User = mongoose.model('User', UserSchema); }
        let College;
        try { College = mongoose.model('College'); } catch (e) { College = mongoose.model('College', CollegeSchema); }

        const users = await User.find({ 
            role: { $nin: ['CENTRAL_ADMIN', 'RECRUITER'] }, 
            status: { $ne: 'deleted' } 
        });

        console.log(`Checking ${users.length} non-admin/recruiter users...`);
        let updatedCount = 0;

        for (const user of users) {
            if (!user.collegeId) {
                console.log(`Orphan detected (no collegeId): ${user.email}`);
                user.status = 'deleted';
                await user.save();
                updatedCount++;
                continue;
            }

            const college = await College.findById(user.collegeId);
            if (!college || college.status === 'deleted') {
                console.log(`Orphan detected (college ${college ? 'deleted' : 'missing'}): ${user.email}`);
                user.status = 'deleted';
                await user.save();
                updatedCount++;
            }
        }

        console.log(`MIGRATION_COMPLETE: Updated ${updatedCount} users to deleted status.`);
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrateOrphans();
