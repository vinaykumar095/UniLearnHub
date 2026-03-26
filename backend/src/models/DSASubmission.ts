import mongoose, { Schema, Document } from 'mongoose';

export interface IDSASubmission extends Document {
    studentId: mongoose.Types.ObjectId;
    problemId: string;
    status: 'solved' | 'attempted';
    completedAt: Date;
}

const DSASubmissionSchema: Schema = new Schema({
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    problemId: { type: String, required: true },
    status: { type: String, enum: ['solved', 'attempted'], default: 'solved' },
    completedAt: { type: Date, default: Date.now }
}, { timestamps: true });


DSASubmissionSchema.index({ studentId: 1, problemId: 1 }, { unique: true });

export default mongoose.model<IDSASubmission>('DSASubmission', DSASubmissionSchema);
