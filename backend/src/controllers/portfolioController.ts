import { Request, Response } from 'express';
import Portfolio from '../models/Portfolio';

export const getPortfolio = async (req: any, res: Response) => {
    try {
        const studentId = req.user.id;
        let portfolio = await Portfolio.findOne({ studentId });
        if (!portfolio) {
            portfolio = await Portfolio.create({ studentId, projects: [], certificates: [] });
        }
        res.json(portfolio);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching portfolio', error });
    }
};

export const updatePortfolioInfo = async (req: any, res: Response) => {
    try {
        const studentId = req.user.id;
        const { city, state, country, bio, github, linkedin, leetcode, codechef, hackerrank, website, branch, year, cgpa, college, skills } = req.body;
        const portfolio = await Portfolio.findOneAndUpdate(
            { studentId },
            { city, state, country, bio, github, linkedin, leetcode, codechef, hackerrank, website, branch, year, cgpa, college, skills },
            { returnDocument: 'after', upsert: true }
        );
        res.json(portfolio);
    } catch (error) {
        res.status(500).json({ message: 'Error updating portfolio info', error });
    }
};

export const addProject = async (req: any, res: Response) => {
    try {
        const studentId = req.user.id;
        const { title, description, link, techStack } = req.body;
        const portfolio = await Portfolio.findOneAndUpdate(
            { studentId },
            { $push: { projects: { title, description, link, techStack } } },
            { returnDocument: 'after', upsert: true }
        );
        res.status(201).json(portfolio);
    } catch (error) {
        res.status(500).json({ message: 'Error adding project', error });
    }
};

export const deleteProject = async (req: any, res: Response) => {
    try {
        const studentId = req.user.id;
        const { projectId } = req.params;
        const portfolio = await Portfolio.findOneAndUpdate(
            { studentId },
            { $pull: { projects: { _id: projectId } } },
            { returnDocument: 'after' }
        );
        res.json(portfolio);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting project', error });
    }
};

export const addCertificate = async (req: any, res: Response) => {
    try {
        const studentId = req.user.id;
        const { title, issuer, date, link } = req.body;
        const portfolio = await Portfolio.findOneAndUpdate(
            { studentId },
            { $push: { certificates: { title, issuer, date: date ? new Date(date) : undefined, link } } },
            { returnDocument: 'after', upsert: true }
        );
        res.status(201).json(portfolio);
    } catch (error) {
        res.status(500).json({ message: 'Error adding certificate', error });
    }
};

export const deleteCertificate = async (req: any, res: Response) => {
    try {
        const studentId = req.user.id;
        const { certId } = req.params;
        const portfolio = await Portfolio.findOneAndUpdate(
            { studentId },
            { $pull: { certificates: { _id: certId } } },
            { returnDocument: 'after' }
        );
        res.json(portfolio);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting certificate', error });
    }
};
