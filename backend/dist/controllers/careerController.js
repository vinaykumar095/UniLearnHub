"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentGuidance = exports.deleteRoadmap = exports.updateRoadmapStep = exports.createRoadmap = exports.getRoadmap = void 0;
const CareerRoadmap_1 = __importDefault(require("../models/CareerRoadmap"));
const Guidance_1 = __importDefault(require("../models/Guidance"));
const getRoadmap = async (req, res) => {
    try {
        const studentId = req.user.id;
        const roadmap = await CareerRoadmap_1.default.findOne({ studentId }).populate('steps.courseId');
        res.json(roadmap);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching roadmap', error });
    }
};
exports.getRoadmap = getRoadmap;
const createRoadmap = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { branch, goal, interests, stages } = req.body;
        const roadmap = await CareerRoadmap_1.default.create({ studentId, branch, goal, interests, stages });
        res.status(201).json(roadmap);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating roadmap', error });
    }
};
exports.createRoadmap = createRoadmap;
const updateRoadmapStep = async (req, res) => {
    try {
        const { id } = req.params;
        const { milestoneTitle, status } = req.body;
        const roadmap = await CareerRoadmap_1.default.findOneAndUpdate({ _id: id, 'stages.milestones.title': milestoneTitle }, { $set: { 'stages.$[].milestones.$[m].status': status } }, {
            arrayFilters: [{ 'm.title': milestoneTitle }],
            returnDocument: 'after'
        });
        res.json(roadmap);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating roadmap milestone', error });
    }
};
exports.updateRoadmapStep = updateRoadmapStep;
const deleteRoadmap = async (req, res) => {
    try {
        const { id } = req.params;
        await CareerRoadmap_1.default.findByIdAndDelete(id);
        res.json({ message: 'Roadmap deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting roadmap', error });
    }
};
exports.deleteRoadmap = deleteRoadmap;
const getStudentGuidance = async (req, res) => {
    try {
        const studentId = req.user.id;
        const guidances = await Guidance_1.default.find({ studentId })
            .populate('facultyId', 'name')
            .sort({ createdAt: -1 });
        res.json(guidances);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching student guidance', error });
    }
};
exports.getStudentGuidance = getStudentGuidance;
