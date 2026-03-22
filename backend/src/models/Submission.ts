import mongoose, { Schema, Document } from 'mongoose';

export interface ISubmission extends Document {
    assignmentId: mongoose.Types.ObjectId;
    studentId: mongoose.Types.ObjectId;
    fileUrl?: string;
    marks?: number;
    feedback?: string;
}

const SubmissionSchema: Schema = new Schema({
    assignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fileUrl: { type: String },
    marks: { type: Number },
    feedback: { type: String },
}, { timestamps: true });

export default mongoose.model<ISubmission>('Submission', SubmissionSchema);
