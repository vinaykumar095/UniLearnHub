import { Request, Response } from 'express';
import PlacementDrive from '../models/PlacementDrive';
import { AuthRequest } from '../middlewares/auth';

export const createDrive = async (req: any, res: any) => {
    try {
        const { 
            title, description, company, companyLogo, date, venue, 
            status, openRoles, rounds, registrationLink, recruiterId, collegeIds 
        } = req.body;

        const drive = await PlacementDrive.create({
            title,
            description,
            company,
            companyLogo,
            date: new Date(date),
            venue,
            status,
            openRoles: Array.isArray(openRoles) ? openRoles : (openRoles ? openRoles.split(',').map((s: string) => s.trim()) : []),
            rounds: Array.isArray(rounds) ? rounds : (rounds ? rounds.split(',').map((s: string) => s.trim()) : []),
            registrationLink,
            recruiterId,
            colleges: collegeIds || []
        });

        const { notifyStudents } = require('./notificationController');
        if (collegeIds && collegeIds.length > 0) {
            for (const cid of collegeIds) {
                await notifyStudents(`New Placement Drive: ${title} by ${company}`, cid);
            }
        } else {
            await notifyStudents(`New Global Placement Drive: ${title} by ${company}`);
        }

        res.status(201).json(drive);
    } catch (error) {
        res.status(500).json({ message: 'Error creating placement drive', error });
    }
};

export const getDrives = async (req: any, res: any) => {
    try {
        const { collegeId } = req.query;
        let query: any = {};

        if (collegeId) {
            query.$or = [
                { colleges: collegeId },
                { colleges: { $size: 0 } }
            ];
        }

        const drives = await PlacementDrive.find(query)
            .populate('recruiterId', 'name company')
            .populate('colleges', 'name')
            .sort({ date: 1 });

        res.json(drives);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching placement drives', error });
    }
};

export const getRecruiterDrives = async (req: any, res: any) => {
    try {
        const recruiterId = req.user.id;
        const drives = await PlacementDrive.find({ recruiterId })
            .populate('colleges', 'name')
            .sort({ date: 1 });
        res.json(drives);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recruiter placement drives', error });
    }
};

export const deleteDrive = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        await PlacementDrive.findByIdAndDelete(id);
        res.json({ message: 'Placement drive deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting placement drive', error });
    }
};
