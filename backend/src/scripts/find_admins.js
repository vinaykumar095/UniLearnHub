const mongoose = require('mongoose');

async function findAdmins() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/unilearnhub');
        const User = mongoose.model('User', new mongoose.Schema({
            email: String,
            role: String,
            name: String
        }));

        const admins = await User.find({ role: { $in: ['CENTRAL_ADMIN', 'COLLEGE_ADMIN'] } }, 'email role name');
        console.log('--- ADMINS ---');
        admins.forEach(u => {
            console.log(`Role: ${u.role}, Email: ${u.email}, Name: ${u.name}`);
        });
        console.log('--------------');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

findAdmins();
