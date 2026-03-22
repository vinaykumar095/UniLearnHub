const mongoose = require('mongoose');

async function fix() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/unilearnhub');
        const User = mongoose.model('User', new mongoose.Schema({ email: String, password: String, isApproved: Boolean }));
        
        // This is a bcrypt hash for 'password'
        const hash = '$2b$10$ZXSMDTkOx1GoBjdpeC2VIXsGu96aQm3nOBoW7bzKoj8V7fbI';
        
        const result = await User.updateOne(
            { email: 'new_student_notify_test@gmail.com' },
            { 
                $set: { 
                    password: hash,
                    status: 'active' 
                } 
            }
        );
        
        console.log('Update Result:', result);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
fix();
