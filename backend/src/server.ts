import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes';
import collegeRoutes from './routes/collegeRoutes';
import userRoutes from './routes/userRoutes';
import courseRoutes from './routes/courseRoutes';
import jobRoutes from './routes/jobRoutes';
import notificationRoutes from './routes/notificationRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import assignmentRoutes from './routes/assignmentRoutes';
import submissionRoutes from './routes/submissionRoutes';
import careerRoutes from './routes/careerRoutes';
import placementRoutes from './routes/placementRoutes';
import portfolioRoutes from './routes/portfolioRoutes';
import facultyRoutes from './routes/facultyRoutes';
import compilerRoutes from './routes/compilerRoutes';
import dsaRoutes from './routes/dsaRoutes';
import placementDriveRoutes from './routes/placementDriveRoutes';

dotenv.config();

const app = express();


const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/unilearnhub');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error}`);
        process.exit(1);
    }
};

connectDB();

app.use(express.json());
app.use(cors());


app.use((req, res, next) => {
    console.log(`[Request] ${req.method} ${req.url}`);
    next();
});

app.use(helmet());
app.use(hpp());

const PORT = process.env.PORT || 5000;

app.use('/api/auth', authRoutes);
app.use('/api/colleges', collegeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/placement', placementRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/compiler', compilerRoutes);
app.use('/api/dsa', dsaRoutes);
app.use('/api/placement-drives', placementDriveRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'UniLearnHub API is running' });
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} [v2.1-debug]`);
});

export { app };
