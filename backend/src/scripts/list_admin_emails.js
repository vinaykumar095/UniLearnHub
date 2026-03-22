const mongoose = require('mongoose');

async function listEmails() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/unilearnhub');
        const User = mongoose.model('User', new mongoose.Schema({ email: String, role: String }));
        const admins = await User.find({ role: { $in: ['CENTRAL_ADMIN', 'COLLEGE_ADMIN'] } });
        admins.forEach(u => console.log(`${u.role}: ${u.email}`));
        process.exit(0);
    } catch (err) {
        process.exit(1);
    }
}
listEmails();
