import mongoose, { Schema, Document } from 'mongoose';

export interface IApplication extends Document {
    jobId: mongoose.Types.ObjectId;
    studentId: mongoose.Types.ObjectId;
    status: string;
    resumeUrl?: string;
    portfolioLink?: string;
    coverLetter?: string;
}

const ApplicationSchema: Schema = new Schema({
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, default: 'pending' }, // pending, shortlisted, rejected, accepted
    resumeUrl: { type: String },
    portfolioLink: { type: String },
    coverLetter: { type: String },
}, { timestamps: true });

export default mongoose.model<IApplication>('Application', ApplicationSchema);
