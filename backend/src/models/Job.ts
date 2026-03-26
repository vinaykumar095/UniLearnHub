import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
    title: string;
    description?: string;
    company: string;
    companyLogo?: string;
    location: string;
    jobType: string; 
    workMode: string; 
    salary?: string;
    experienceLevel: string; 
    skillsRequired: string[];
    recruiterId: mongoose.Types.ObjectId;
    colleges: mongoose.Types.ObjectId[];
    eligibility?: string;
    requirements?: string;
    deadline: Date;
    applications?: mongoose.Types.ObjectId[];
}

const JobSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    company: { type: String, required: true },
    companyLogo: { type: String },
    location: { type: String, required: true },
    jobType: { type: String, required: true },
    workMode: { type: String, required: true },
    salary: { type: String },
    experienceLevel: { type: String },
    skillsRequired: [{ type: String }],
    recruiterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    colleges: [{ type: Schema.Types.ObjectId, ref: 'College' }],
    eligibility: { type: String },
    requirements: { type: String },
    deadline: { type: Date, required: true },
}, { timestamps: true });

export default mongoose.model<IJob>('Job', JobSchema);
