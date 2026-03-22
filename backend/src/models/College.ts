import mongoose, { Schema, Document } from 'mongoose';

export interface ICollege extends Document {
    name: string;
    location?: string;
    email?: string;
    phone?: string;
    principal?: string;
    website?: string;
    currentYear?: string;
    status: 'pending' | 'active' | 'suspended' | 'deleted';
}

const CollegeSchema: Schema = new Schema({
    name: { type: String, required: true },
    location: { type: String },
    email: { type: String },
    phone: { type: String },
    principal: { type: String },
    website: { type: String },
    currentYear: { type: String, default: new Date().getFullYear().toString() },
    status: { type: String, enum: ['pending', 'active', 'suspended', 'deleted'], default: 'pending' },
}, { timestamps: true });

export default mongoose.model<ICollege>('College', CollegeSchema);
