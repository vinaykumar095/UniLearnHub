"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDrive = exports.getRecruiterDrives = exports.getDrives = exports.createDrive = void 0;
const PlacementDrive_1 = __importDefault(require("../models/PlacementDrive"));
const createDrive = async (req, res) => {
    try {
        const { title, description, company, companyLogo, date, venue, status, openRoles, rounds, registrationLink, recruiterId, collegeIds } = req.body;
        const drive = await PlacementDrive_1.default.create({
            title,
            description,
            company,
            companyLogo,
            date: new Date(date),
            venue,
            status,
            openRoles: Array.isArray(openRoles) ? openRoles : (openRoles ? openRoles.split(',').map((s) => s.trim()) : []),
            rounds: Array.isArray(rounds) ? rounds : (rounds ? rounds.split(',').map((s) => s.trim()) : []),
            registrationLink,
            recruiterId,
            colleges: collegeIds || []
        });
        const { notifyStudents } = require('./notificationController');
        if (collegeIds && collegeIds.length > 0) {
            for (const cid of collegeIds) {
                await notifyStudents(`New Placement Drive: ${title} by ${company}`, cid);
            }
        }
        else {
            await notifyStudents(`New Global Placement Drive: ${title} by ${company}`);
        }
        res.status(201).json(drive);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating placement drive', error });
    }
};
exports.createDrive = createDrive;
const getDrives = async (req, res) => {
    try {
        const { collegeId } = req.query;
        let query = {};
        if (collegeId) {
            query.$or = [
                { colleges: collegeId },
                { colleges: { $size: 0 } }
            ];
        }
        const drives = await PlacementDrive_1.default.find(query)
            .populate('recruiterId', 'name company')
            .populate('colleges', 'name')
            .sort({ date: 1 });
        res.json(drives);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching placement drives', error });
    }
};
exports.getDrives = getDrives;
const getRecruiterDrives = async (req, res) => {
    try {
        const recruiterId = req.user.id;
        const drives = await PlacementDrive_1.default.find({ recruiterId })
            .populate('colleges', 'name')
            .sort({ date: 1 });
        res.json(drives);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching recruiter placement drives', error });
    }
};
exports.getRecruiterDrives = getRecruiterDrives;
const deleteDrive = async (req, res) => {
    try {
        const { id } = req.params;
        await PlacementDrive_1.default.findByIdAndDelete(id);
        res.json({ message: 'Placement drive deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting placement drive', error });
    }
};
exports.deleteDrive = deleteDrive;
