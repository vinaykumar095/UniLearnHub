import mongoose, { Schema, Document } from 'mongoose';

export interface IAssignment extends Document {
    title: string;
    description?: string;
    deadline: Date;
    courseId: mongoose.Types.ObjectId;
}

const AssignmentSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    deadline: { type: Date, required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
}, { timestamps: true });

export default mongoose.model<IAssignment>('Assignment', AssignmentSchema);
