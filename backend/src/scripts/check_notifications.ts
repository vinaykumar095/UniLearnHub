
import mongoose from 'mongoose';
import Notification from '../models/Notification';
import User from '../models/User';

async function checkNotifications() {
    try {
        await mongoose.connect('mongodb://localhost:27017/unilearnhub');
        
        const notifications = await Notification.find({})
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('userId', 'name email role');
            
        console.log('--- RECENT NOTIFICATIONS ---');
        notifications.forEach((n: any) => {
            console.log(`[${n.createdAt.toISOString()}] To: ${n.userId?.name || 'Unknown'} (${n.userId?.email || 'N/A'})`);
            console.log(`Message: ${n.message}`);
            console.log(`Read: ${n.read}`);
            console.log('-----------------------------');
        });

        const total = await Notification.countDocuments();
        console.log(`Total Notifications in DB: ${total}`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkNotifications();
