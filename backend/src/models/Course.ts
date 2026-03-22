import mongoose, { Schema, Document } from 'mongoose';

export interface IMaterial {
    type: 'Video' | 'PDF' | 'Link' | 'Reading';
    title: string;
    url: string;
}

export interface ICourse extends Document {
    title: string;
    description?: string;
    facultyId: mongoose.Types.ObjectId;
    collegeId: mongoose.Types.ObjectId;
    status: 'pending' | 'approved';
    materials: IMaterial[];
    duration?: string;
    difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
    rating?: number;
    ratingCount?: number;
    enrollmentCount?: number;
    category?: string;
    syllabus?: { title: string; lessons: string[] }[];
    learningOutcomes?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

const CourseSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    facultyId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    collegeId: { type: Schema.Types.ObjectId, ref: 'College', required: true },
    status: { type: String, enum: ['pending', 'approved'], default: 'pending' },
    materials: [{
        type: { type: String, enum: ['Video', 'PDF', 'Link', 'Reading'], required: true },
        title: { type: String, required: true },
        url: { type: String, required: true }
    }],
    duration: { type: String, default: 'Self-paced' },
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    enrollmentCount: { type: Number, default: 0 },
    category: { type: String, default: 'General' },
    syllabus: [{
        title: { type: String },
        lessons: [{ type: String }]
    }],
    learningOutcomes: [{ type: String }],
}, { timestamps: true });

export default mongoose.model<ICourse>('Course', CourseSchema);
