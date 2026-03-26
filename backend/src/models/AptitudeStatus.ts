import mongoose, { Schema, Document } from 'mongoose';

export interface IAptitudeStatus extends Document {
    studentId: mongoose.Types.ObjectId;
    topicId: string; 
    status: 'completed' | 'not_started';
    updatedAt: Date;
}

const AptitudeStatusSchema: Schema = new Schema({
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    topicId: { type: String, required: true },
    status: { type: String, enum: ['completed', 'not_started'], default: 'completed' }
}, { timestamps: true });


AptitudeStatusSchema.index({ studentId: 1, topicId: 1 }, { unique: true });

export default mongoose.model<IAptitudeStatus>('AptitudeStatus', AptitudeStatusSchema);
