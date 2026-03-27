"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAptitudeStatus = exports.toggleAptitudeStatus = exports.submitAttempt = exports.getPlacementProgress = void 0;
const PlacementPrep_1 = __importDefault(require("../models/PlacementPrep"));
const AptitudeStatus_1 = __importDefault(require("../models/AptitudeStatus"));
const getPlacementProgress = async (req, res) => {
    try {
        const studentId = req.user.id;
        const progress = await PlacementPrep_1.default.find({ studentId }).sort({ createdAt: -1 });
        res.json(progress);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching placement progress', error });
    }
};
exports.getPlacementProgress = getPlacementProgress;
const submitAttempt = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { module, category, score, total } = req.body;
        const attempt = await PlacementPrep_1.default.create({ studentId, module, category, score, total });
        res.status(201).json(attempt);
    }
    catch (error) {
        res.status(500).json({ message: 'Error submitting attempt', error });
    }
};
exports.submitAttempt = submitAttempt;
const toggleAptitudeStatus = async (req, res) => {
    try {
        const { topicId, status } = req.body;
        const studentId = req.user.id;
        if (status === 'not_started') {
            await AptitudeStatus_1.default.findOneAndDelete({ studentId, topicId });
            return res.json({ success: true, message: 'Status removed' });
        }
        const aptitudeStatus = await AptitudeStatus_1.default.findOneAndUpdate({ studentId, topicId }, { studentId, topicId, status: 'completed' }, { upsert: true, new: true });
        res.json({ success: true, status: aptitudeStatus });
    }
    catch (error) {
        res.status(500).json({ message: 'Error toggling aptitude status', error });
    }
};
exports.toggleAptitudeStatus = toggleAptitudeStatus;
const getAptitudeStatus = async (req, res) => {
    try {
        const studentId = req.user.id;
        const statuses = await AptitudeStatus_1.default.find({ studentId });
        const completedTopicIds = statuses.map(s => s.topicId);
        res.json({ success: true, completedTopicIds });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching aptitude status', error });
    }
};
exports.getAptitudeStatus = getAptitudeStatus;
