const mongoose = require('mongoose');

async function checkUsers() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/unilearnhub');
        const User = mongoose.model('User', new mongoose.Schema({
            email: String,
            role: String,
            name: String
        }));

        const users = await User.find({}, 'email role name');
        console.log('--- USERS IN DB ---');
        users.forEach(u => {
            console.log(`[${u.role}] ${u.name} (${u.email})`);
        });
        console.log('-------------------');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkUsers();
