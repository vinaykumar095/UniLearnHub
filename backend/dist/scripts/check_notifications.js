"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Notification_1 = __importDefault(require("../models/Notification"));
async function checkNotifications() {
    try {
        await mongoose_1.default.connect('mongodb://localhost:27017/unilearnhub');
        const notifications = await Notification_1.default.find({})
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
        const total = await Notification_1.default.countDocuments();
        console.log(`Total Notifications in DB: ${total}`);
        process.exit(0);
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
}
checkNotifications();
