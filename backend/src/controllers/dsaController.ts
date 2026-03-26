import { Response } from 'express';
import DSASubmission from '../models/DSASubmission';

export const recordSubmission = async (req: any, res: Response) => {
    try {
        const { problemId, status } = req.body;
        const studentId = req.user.id;

        
        const submission = await DSASubmission.findOneAndUpdate(
            { studentId, problemId },
            { studentId, problemId, status: status || 'solved', completedAt: new Date() },
            { upsert: true, new: true }
        );

        res.status(200).json({ success: true, submission });
    } catch (error) {
        res.status(500).json({ message: 'Error recording submission', error });
    }
};

export const getProgress = async (req: any, res: Response) => {
    try {
        const studentId = req.user.id;
        const submissions = await DSASubmission.find({ studentId, status: 'solved' });
        const solvedProblemIds = submissions.map(s => s.problemId);
        
        res.status(200).json({ success: true, solvedProblemIds });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching progress', error });
    }
};
