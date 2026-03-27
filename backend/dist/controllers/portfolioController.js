"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCertificate = exports.addCertificate = exports.deleteProject = exports.addProject = exports.updatePortfolioInfo = exports.getPortfolio = void 0;
const Portfolio_1 = __importDefault(require("../models/Portfolio"));
const getPortfolio = async (req, res) => {
    try {
        const studentId = req.user.id;
        let portfolio = await Portfolio_1.default.findOne({ studentId });
        if (!portfolio) {
            portfolio = await Portfolio_1.default.create({ studentId, projects: [], certificates: [] });
        }
        res.json(portfolio);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching portfolio', error });
    }
};
exports.getPortfolio = getPortfolio;
const updatePortfolioInfo = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { city, state, country, bio, github, linkedin, leetcode, codechef, hackerrank, website, branch, year, cgpa, college, skills } = req.body;
        const portfolio = await Portfolio_1.default.findOneAndUpdate({ studentId }, { city, state, country, bio, github, linkedin, leetcode, codechef, hackerrank, website, branch, year, cgpa, college, skills }, { returnDocument: 'after', upsert: true });
        res.json(portfolio);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating portfolio info', error });
    }
};
exports.updatePortfolioInfo = updatePortfolioInfo;
const addProject = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { title, description, link, techStack } = req.body;
        const portfolio = await Portfolio_1.default.findOneAndUpdate({ studentId }, { $push: { projects: { title, description, link, techStack } } }, { returnDocument: 'after', upsert: true });
        res.status(201).json(portfolio);
    }
    catch (error) {
        res.status(500).json({ message: 'Error adding project', error });
    }
};
exports.addProject = addProject;
const deleteProject = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { projectId } = req.params;
        const portfolio = await Portfolio_1.default.findOneAndUpdate({ studentId }, { $pull: { projects: { _id: projectId } } }, { returnDocument: 'after' });
        res.json(portfolio);
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting project', error });
    }
};
exports.deleteProject = deleteProject;
const addCertificate = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { title, issuer, date, link } = req.body;
        const portfolio = await Portfolio_1.default.findOneAndUpdate({ studentId }, { $push: { certificates: { title, issuer, date: date ? new Date(date) : undefined, link } } }, { returnDocument: 'after', upsert: true });
        res.status(201).json(portfolio);
    }
    catch (error) {
        res.status(500).json({ message: 'Error adding certificate', error });
    }
};
exports.addCertificate = addCertificate;
const deleteCertificate = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { certId } = req.params;
        const portfolio = await Portfolio_1.default.findOneAndUpdate({ studentId }, { $pull: { certificates: { _id: certId } } }, { returnDocument: 'after' });
        res.json(portfolio);
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting certificate', error });
    }
};
exports.deleteCertificate = deleteCertificate;
