"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProgress = exports.recordSubmission = void 0;
const DSASubmission_1 = __importDefault(require("../models/DSASubmission"));
const recordSubmission = async (req, res) => {
    try {
        const { problemId, status } = req.body;
        const studentId = req.user.id;
        const submission = await DSASubmission_1.default.findOneAndUpdate({ studentId, problemId }, { studentId, problemId, status: status || 'solved', completedAt: new Date() }, { upsert: true, new: true });
        res.status(200).json({ success: true, submission });
    }
    catch (error) {
        res.status(500).json({ message: 'Error recording submission', error });
    }
};
exports.recordSubmission = recordSubmission;
const getProgress = async (req, res) => {
    try {
        const studentId = req.user.id;
        const submissions = await DSASubmission_1.default.find({ studentId, status: 'solved' });
        const solvedProblemIds = submissions.map(s => s.problemId);
        res.status(200).json({ success: true, solvedProblemIds });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching progress', error });
    }
};
exports.getProgress = getProgress;
