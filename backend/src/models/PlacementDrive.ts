import mongoose, { Schema, Document } from 'mongoose';

export interface IPlacementDrive extends Document {
    title: string;
    description?: string;
    company: string;
    companyLogo?: string;
    date: Date;
    venue: string;
    status: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
    openRoles: string[];
    rounds: string[];
    registrationLink?: string;
    recruiterId: mongoose.Types.ObjectId;
    colleges: mongoose.Types.ObjectId[]; // Empty means global
}

const PlacementDriveSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    company: { type: String, required: true },
    companyLogo: { type: String },
    date: { type: Date, required: true },
    venue: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['UPCOMING', 'ONGOING', 'COMPLETED'], 
        default: 'UPCOMING' 
    },
    openRoles: [{ type: String }],
    rounds: [{ type: String }],
    registrationLink: { type: String },
    recruiterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    colleges: [{ type: Schema.Types.ObjectId, ref: 'College' }],
}, { timestamps: true });

export default mongoose.model<IPlacementDrive>('PlacementDrive', PlacementDriveSchema);
