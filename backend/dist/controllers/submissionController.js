"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gradeSubmission = exports.getSubmissionsByAssignment = exports.submitAssignment = void 0;
const Submission_1 = __importDefault(require("../models/Submission"));
const submitAssignment = async (req, res) => {
    try {
        const { assignmentId, fileUrl } = req.body;
        const studentId = req.user.id;
        const submission = await Submission_1.default.create({ assignmentId, studentId, fileUrl });
        res.status(201).json(submission);
    }
    catch (error) {
        res.status(500).json({ message: 'Error submitting assignment', error });
    }
};
exports.submitAssignment = submitAssignment;
const getSubmissionsByAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const submissions = await Submission_1.default.find({ assignmentId })
            .populate('studentId', 'name email');
        res.json(submissions);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching submissions', error });
    }
};
exports.getSubmissionsByAssignment = getSubmissionsByAssignment;
const gradeSubmission = async (req, res) => {
    try {
        const { id } = req.params;
        const { marks, feedback } = req.body;
        const submission = await Submission_1.default.findByIdAndUpdate(id, { marks, feedback }, { returnDocument: 'after' })
            .populate({ path: 'assignmentId', select: 'title' });
        if (submission) {
            const { createNotification } = require('./notificationController');
            await createNotification(submission.studentId, `Your submission for "${submission.assignmentId.title}" has been graded.`);
        }
        res.json(submission);
    }
    catch (error) {
        res.status(500).json({ message: 'Error grading submission', error });
    }
};
exports.gradeSubmission = gradeSubmission;
