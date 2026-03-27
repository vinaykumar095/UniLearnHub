"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAssignment = exports.getAssignmentsByCourse = exports.createAssignment = void 0;
const Assignment_1 = __importDefault(require("../models/Assignment"));
const createAssignment = async (req, res) => {
    try {
        const { title, description, deadline, courseId } = req.body;
        const assignment = await Assignment_1.default.create({ title, description, deadline, courseId });
        res.status(201).json(assignment);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating assignment', error });
    }
};
exports.createAssignment = createAssignment;
const getAssignmentsByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const assignments = await Assignment_1.default.find({ courseId });
        res.json(assignments);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching assignments', error });
    }
};
exports.getAssignmentsByCourse = getAssignmentsByCourse;
const deleteAssignment = async (req, res) => {
    try {
        const { id } = req.params;
        await Assignment_1.default.findByIdAndDelete(id);
        res.json({ message: 'Assignment deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting assignment', error });
    }
};
exports.deleteAssignment = deleteAssignment;
