import { Router } from 'express';
import { getRoadmap, createRoadmap, updateRoadmapStep, deleteRoadmap, getStudentGuidance } from '../controllers/careerController';
import { protect } from '../middlewares/auth';

const router = Router();

router.get('/guidance', protect, getStudentGuidance);
router.get('/roadmap', protect, getRoadmap);
router.post('/roadmap', protect, createRoadmap);
router.put('/roadmap/:id/step', protect, updateRoadmapStep);
router.patch('/roadmap/:id/step', protect, updateRoadmapStep);
router.delete('/roadmap/:id', protect, deleteRoadmap);

export default router;
