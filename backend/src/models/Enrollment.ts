import mongoose, { Schema, Document } from 'mongoose';

export interface IEnrollment extends Document {
    studentId: mongoose.Types.ObjectId;
    courseId: mongoose.Types.ObjectId;
    progress: number;
    milestones: {
        title: string;
        status: 'pending' | 'completed';
        completedAt?: Date;
    }[];
}

const EnrollmentSchema: Schema = new Schema({
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    progress: { type: Number, default: 0 },
    milestones: [{
        title: { type: String, required: true },
        status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
        completedAt: { type: Date }
    }]
}, { timestamps: true });

export default mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema);
