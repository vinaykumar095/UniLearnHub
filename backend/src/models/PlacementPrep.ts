import mongoose, { Schema, Document } from 'mongoose';

export interface IPlacementPrep extends Document {
    studentId: mongoose.Types.ObjectId;
    module: 'Quantitative' | 'Logical' | 'Data Interpretation' | 'Coding' | 'Technical Mock' | 'HR Mock' | 'Aptitude' | 'DSA' | 'Reasoning';
    category?: string;
    score: number;
    total: number;
    completedAt: Date;
}

const PlacementPrepSchema: Schema = new Schema({
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    module: {
        type: String,
        enum: ['Quantitative', 'Logical', 'Data Interpretation', 'Coding', 'Technical Mock', 'HR Mock', 'Aptitude', 'DSA', 'Reasoning'],
        required: true
    },
    category: { type: String },
    score: { type: Number, required: true },
    total: { type: Number, required: true, default: 100 },
    completedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model<IPlacementPrep>('PlacementPrep', PlacementPrepSchema);
