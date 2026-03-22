import mongoose, { Schema, Document } from 'mongoose';

export interface ICareerRoadmap extends Document {
    studentId: mongoose.Types.ObjectId;
    branch: string;
    goal: string;
    interests: string[];
    stages: {
        stageNumber: number;
        title: string;
        milestones: {
            title: string;
            description: string;
            status: 'pending' | 'completed';
            resources?: { label: string; link: string }[];
        }[];
    }[];
}

const CareerRoadmapSchema: Schema = new Schema({
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    branch: { type: String, required: true },
    goal: { type: String, required: true },
    interests: [{ type: String }],
    stages: [{
        stageNumber: { type: Number, required: true },
        title: { type: String, required: true },
        milestones: [{
            title: { type: String, required: true },
            description: { type: String },
            status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
            resources: [{
                label: { type: String },
                link: { type: String }
            }]
        }]
    }]
}, { timestamps: true });

export default mongoose.model<ICareerRoadmap>('CareerRoadmap', CareerRoadmapSchema);
