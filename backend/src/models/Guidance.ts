import mongoose, { Schema, Document } from 'mongoose';

export interface IGuidance extends Document {
    facultyId: mongoose.Types.ObjectId;
    studentId: mongoose.Types.ObjectId;
    courseId?: mongoose.Types.ObjectId;
    type: 'CAREER_PATH' | 'SKILL_RECOMMENDATION' | 'LEARNING_MILESTONE' | 'GENERAL_FEEDBACK';
    content: string;
    impacts: {
        dashboard: boolean;
        roadmap: boolean;
    };
    status: 'active' | 'archived';
}

const GuidanceSchema: Schema = new Schema({
    facultyId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
    type: { type: String, enum: ['CAREER_PATH', 'SKILL_RECOMMENDATION', 'LEARNING_MILESTONE', 'GENERAL_FEEDBACK'], required: true },
    content: { type: String, required: true },
    impacts: {
        dashboard: { type: Boolean, default: true },
        roadmap: { type: Boolean, default: true }
    },
    status: { type: String, enum: ['active', 'archived'], default: 'active' }
}, { timestamps: true });

export default mongoose.model<IGuidance>('Guidance', GuidanceSchema);
