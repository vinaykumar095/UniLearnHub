import { Request, Response } from 'express';
import PlacementPrep from '../models/PlacementPrep';
import AptitudeStatus from '../models/AptitudeStatus';

export const getPlacementProgress = async (req: any, res: Response) => {
    try {
        const studentId = req.user.id;
        const progress = await PlacementPrep.find({ studentId }).sort({ createdAt: -1 });
        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching placement progress', error });
    }
};

export const submitAttempt = async (req: any, res: Response) => {
    try {
        const studentId = req.user.id;
        const { module, category, score, total } = req.body;
        const attempt = await PlacementPrep.create({ studentId, module, category, score, total });
        res.status(201).json(attempt);
    } catch (error) {
        res.status(500).json({ message: 'Error submitting attempt', error });
    }
};

export const toggleAptitudeStatus = async (req: any, res: Response) => {
    try {
        const { topicId, status } = req.body;
        const studentId = req.user.id;

        if (status === 'not_started') {
            await AptitudeStatus.findOneAndDelete({ studentId, topicId });
            return res.json({ success: true, message: 'Status removed' });
        }

        const aptitudeStatus = await AptitudeStatus.findOneAndUpdate(
            { studentId, topicId },
            { studentId, topicId, status: 'completed' },
            { upsert: true, new: true }
        );

        res.json({ success: true, status: aptitudeStatus });
    } catch (error) {
        res.status(500).json({ message: 'Error toggling aptitude status', error });
    }
};

export const getAptitudeStatus = async (req: any, res: Response) => {
    try {
        const studentId = req.user.id;
        const statuses = await AptitudeStatus.find({ studentId });
        const completedTopicIds = statuses.map(s => s.topicId);
        res.json({ success: true, completedTopicIds });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching aptitude status', error });
    }
};
