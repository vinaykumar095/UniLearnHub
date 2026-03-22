import { Request, Response } from 'express';
import Submission from '../models/Submission';

export const submitAssignment = async (req: any, res: Response) => {
    try {
        const { assignmentId, fileUrl } = req.body;
        const studentId = req.user.id;
        const submission = await Submission.create({ assignmentId, studentId, fileUrl });
        res.status(201).json(submission);
    } catch (error) {
        res.status(500).json({ message: 'Error submitting assignment', error });
    }
};

export const getSubmissionsByAssignment = async (req: Request, res: Response) => {
    try {
        const { assignmentId } = req.params;
        const submissions = await Submission.find({ assignmentId })
            .populate('studentId', 'name email');
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching submissions', error });
    }
};

export const gradeSubmission = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { marks, feedback } = req.body;
        const submission = await Submission.findByIdAndUpdate(id, { marks, feedback }, { returnDocument: 'after' })
            .populate({ path: 'assignmentId', select: 'title' });

        if (submission) {
            const { createNotification } = require('./notificationController');
            await createNotification(submission.studentId, `Your submission for "${(submission.assignmentId as any).title}" has been graded.`);
        }

        res.json(submission);
    } catch (error) {
        res.status(500).json({ message: 'Error grading submission', error });
    }
};
