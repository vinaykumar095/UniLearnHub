
const mongoose = require('mongoose');

async function checkNotifications() {
    try {
        await mongoose.connect('mongodb://localhost:27017/unilearnhub');
        
        const Schema = mongoose.Schema;
        const NotificationSchema = new Schema({
            userId: { type: Schema.Types.ObjectId, ref: 'User' },
            message: String,
            read: Boolean
        }, { timestamps: true });
        
        const UserSchema = new Schema({
            name: String,
            email: String,
            role: String
        });

        let Notification;
        try { Notification = mongoose.model('Notification'); } catch (e) { Notification = mongoose.model('Notification', NotificationSchema); }
        let User;
        try { User = mongoose.model('User'); } catch (e) { User = mongoose.model('User', UserSchema); }

        const notifications = await Notification.find({})
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('userId', 'name email role');
            
        console.log('--- RECENT NOTIFICATIONS ---');
        notifications.forEach((n) => {
            console.log(`[${n.createdAt.toISOString()}] To: ${n.userId?.name || 'Unknown'} (${n.userId?.email || 'N/A'})`);
            console.log(`Message: ${n.message}`);
            console.log(`Read: ${n.read}`);
            console.log('-----------------------------');
        });

        const total = await Notification.countDocuments();
        console.log(`Total Notifications in DB: ${total}`);

        process.exit(0);
    } catch (err) {
        console.error('Check failed:', err);
        process.exit(1);
    }
}

checkNotifications();
