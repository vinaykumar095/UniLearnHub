const mongoose = require('mongoose');

async function getEmail() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/unilearnhub');
        const User = mongoose.model('User', new mongoose.Schema({ email: String, role: String }));
        const admin = await User.findOne({ role: 'COLLEGE_ADMIN' });
        if (admin) {
            console.log(`FULL_EMAIL:${admin.email}:END_EMAIL`);
        } else {
            console.log('NO_COLLEGE_ADMIN');
        }
        process.exit(0);
    } catch (err) {
        process.exit(1);
    }
}
getEmail();
