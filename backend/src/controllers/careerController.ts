import { Request, Response } from 'express';
import CareerRoadmap from '../models/CareerRoadmap';
import Guidance from '../models/Guidance';

export const getRoadmap = async (req: any, res: Response) => {
    try {
        const studentId = req.user.id;
        const roadmap = await CareerRoadmap.findOne({ studentId }).populate('steps.courseId');
        res.json(roadmap);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching roadmap', error });
    }
};

export const createRoadmap = async (req: any, res: Response) => {
    try {
        const studentId = req.user.id;
        const { branch, goal, interests, stages } = req.body;
        const roadmap = await CareerRoadmap.create({ studentId, branch, goal, interests, stages });
        res.status(201).json(roadmap);
    } catch (error) {
        res.status(500).json({ message: 'Error creating roadmap', error });
    }
};

export const updateRoadmapStep = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; 
        const { milestoneTitle, status } = req.body;

        
        
        const roadmap = await CareerRoadmap.findOneAndUpdate(
            { _id: id, 'stages.milestones.title': milestoneTitle },
            { $set: { 'stages.$[].milestones.$[m].status': status } },
            {
                arrayFilters: [{ 'm.title': milestoneTitle }],
                returnDocument: 'after'
            }
        );
        res.json(roadmap);
    } catch (error) {
        res.status(500).json({ message: 'Error updating roadmap milestone', error });
    }
};

export const deleteRoadmap = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        await CareerRoadmap.findByIdAndDelete(id);
        res.json({ message: 'Roadmap deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting roadmap', error });
    }
};

export const getStudentGuidance = async (req: any, res: Response) => {
    try {
        const studentId = req.user.id;
        const guidances = await Guidance.find({ studentId })
            .populate('facultyId', 'name')
            .sort({ createdAt: -1 });
        res.json(guidances);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching student guidance', error });
    }
};
