import mongoose, { Schema, Document } from 'mongoose';

export interface IPortfolio extends Document {
    studentId: mongoose.Types.ObjectId;
    
    city?: string;
    state?: string;
    country?: string;
    bio?: string;
    
    github?: string;
    linkedin?: string;
    leetcode?: string;
    codechef?: string;
    hackerrank?: string;
    website?: string;
    
    branch?: string;
    year?: string;
    cgpa?: string;
    college?: string;
    
    skills?: string[];
    
    projects: {
        title: string;
        description?: string;
        link?: string;
        techStack?: string;
        date?: string;
    }[];
    certificates: {
        title: string;
        issuer: string;
        date?: Date;
        link?: string;
    }[];
}

const PortfolioSchema: Schema = new Schema({
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    bio: { type: String },
    github: { type: String },
    linkedin: { type: String },
    leetcode: { type: String },
    codechef: { type: String },
    hackerrank: { type: String },
    website: { type: String },
    branch: { type: String },
    year: { type: String },
    cgpa: { type: String },
    college: { type: String },
    skills: [{ type: String }],
    projects: [{
        title: { type: String, required: true },
        description: { type: String },
        link: { type: String },
        techStack: { type: String },
        date: { type: String },
    }],
    certificates: [{
        title: { type: String, required: true },
        issuer: { type: String },
        date: { type: Date },
        link: { type: String },
    }]
}, { timestamps: true });

export default mongoose.model<IPortfolio>('Portfolio', PortfolioSchema);
