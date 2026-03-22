import { Request, Response } from 'express';
import Assignment from '../models/Assignment';

export const createAssignment = async (req: Request, res: Response) => {
    try {
        const { title, description, deadline, courseId } = req.body;
        const assignment = await Assignment.create({ title, description, deadline, courseId });
        res.status(201).json(assignment);
    } catch (error) {
        res.status(500).json({ message: 'Error creating assignment', error });
    }
};

export const getAssignmentsByCourse = async (req: Request, res: Response) => {
    try {
        const { courseId } = req.params;
        const assignments = await Assignment.find({ courseId });
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching assignments', error });
    }
};

export const deleteAssignment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Assignment.findByIdAndDelete(id);
        res.json({ message: 'Assignment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting assignment', error });
    }
};
