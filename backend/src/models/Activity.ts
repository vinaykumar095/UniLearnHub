import mongoose, { Schema, Document } from 'mongoose';

export interface IActivity extends Document {
    userId: mongoose.Types.ObjectId;
    type: 'LOGIN' | 'PASSWORD_CHANGE' | 'PROFILE_UPDATE' | 'SECURITY_ALERT';
    browser: string;
    os: string;
    ip: string;
    status: 'SUCCESS' | 'FAILED';
    timestamp: Date;
}

const ActivitySchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
        type: String,
        enum: ['LOGIN', 'PASSWORD_CHANGE', 'PROFILE_UPDATE', 'SECURITY_ALERT'],
        default: 'LOGIN'
    },
    browser: { type: String },
    os: { type: String },
    ip: { type: String },
    status: { type: String, enum: ['SUCCESS', 'FAILED'], default: 'SUCCESS' },
    timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model<IActivity>('Activity', ActivitySchema);
