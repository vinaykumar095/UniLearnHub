import mongoose, { Schema, Document } from 'mongoose';

export enum Role {
    CENTRAL_ADMIN = 'CENTRAL_ADMIN',
    COLLEGE_ADMIN = 'COLLEGE_ADMIN',
    FACULTY = 'FACULTY',
    STUDENT = 'STUDENT',
    RECRUITER = 'RECRUITER',
}

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: Role;
    collegeId?: mongoose.Types.ObjectId;
    company?: string;
    skills?: string[];
    phone?: string;
    isPhoneVerified?: boolean;
    twoFactorEnabled?: boolean;
    notificationPreferences?: {
        email: boolean;
        inApp: boolean;
    };
    privacySettings?: {
        recruiterVisible: boolean;
        facultyVisible: boolean;
        publicVisible: boolean;
    };
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
    cgpa?: number;
    department?: string;
    designation?: string;
    qualification?: string;
    experience?: string;
    specialization?: string;
    researchInterests?: string;
    projects?: {
        title: string;
        description: string;
        techStack: string[];
        link?: string;
        github?: string;
    }[];
    avatar?: string;
    status: 'active' | 'suspended' | 'pending' | 'deleted';
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(Role), required: true },
    collegeId: { type: Schema.Types.ObjectId, ref: 'College' },
    company: { type: String },
    skills: [{ type: String }],
    phone: { type: String },
    isPhoneVerified: { type: Boolean, default: false },
    twoFactorEnabled: { type: Boolean, default: false },
    notificationPreferences: {
        email: { type: Boolean, default: true },
        inApp: { type: Boolean, default: true }
    },
    privacySettings: {
        recruiterVisible: { type: Boolean, default: true },
        facultyVisible: { type: Boolean, default: true },
        publicVisible: { type: Boolean, default: false }
    },
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
    cgpa: { type: Number },
    department: { type: String },
    designation: { type: String },
    qualification: { type: String },
    experience: { type: String },
    specialization: { type: String },
    researchInterests: { type: String },
    projects: [{
        title: { type: String, required: true },
        description: { type: String, required: true },
        techStack: [{ type: String }],
        link: { type: String },
        github: { type: String }
    }],
    avatar: { type: String },
    status: { type: String, enum: ['active', 'suspended', 'pending', 'deleted'], default: 'active' },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
