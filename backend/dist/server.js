"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const hpp_1 = __importDefault(require("hpp"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const collegeRoutes_1 = __importDefault(require("./routes/collegeRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const courseRoutes_1 = __importDefault(require("./routes/courseRoutes"));
const jobRoutes_1 = __importDefault(require("./routes/jobRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
const analyticsRoutes_1 = __importDefault(require("./routes/analyticsRoutes"));
const assignmentRoutes_1 = __importDefault(require("./routes/assignmentRoutes"));
const submissionRoutes_1 = __importDefault(require("./routes/submissionRoutes"));
const careerRoutes_1 = __importDefault(require("./routes/careerRoutes"));
const placementRoutes_1 = __importDefault(require("./routes/placementRoutes"));
const portfolioRoutes_1 = __importDefault(require("./routes/portfolioRoutes"));
const facultyRoutes_1 = __importDefault(require("./routes/facultyRoutes"));
const compilerRoutes_1 = __importDefault(require("./routes/compilerRoutes"));
const dsaRoutes_1 = __importDefault(require("./routes/dsaRoutes"));
const placementDriveRoutes_1 = __importDefault(require("./routes/placementDriveRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
const connectDB = async () => {
    try {
        const conn = await mongoose_1.default.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/unilearnhub');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error(`Error: ${error}`);
        process.exit(1);
    }
};
connectDB();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((req, res, next) => {
    console.log(`[Request] ${req.method} ${req.url}`);
    next();
});
app.use((0, helmet_1.default)());
app.use((0, hpp_1.default)());
const PORT = process.env.PORT || 5000;
app.use('/api/auth', authRoutes_1.default);
app.use('/api/colleges', collegeRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/courses', courseRoutes_1.default);
app.use('/api/jobs', jobRoutes_1.default);
app.use('/api/notifications', notificationRoutes_1.default);
app.use('/api/analytics', analyticsRoutes_1.default);
app.use('/api/assignments', assignmentRoutes_1.default);
app.use('/api/submissions', submissionRoutes_1.default);
app.use('/api/career', careerRoutes_1.default);
app.use('/api/placement', placementRoutes_1.default);
app.use('/api/portfolio', portfolioRoutes_1.default);
app.use('/api/faculty', facultyRoutes_1.default);
app.use('/api/compiler', compilerRoutes_1.default);
app.use('/api/dsa', dsaRoutes_1.default);
app.use('/api/placement-drives', placementDriveRoutes_1.default);
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'UniLearnHub API is running' });
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} [v2.1-debug]`);
});
