import { Router } from 'express';
import { getPortfolio, updatePortfolioInfo, addProject, deleteProject, addCertificate, deleteCertificate } from '../controllers/portfolioController';
import { protect } from '../middlewares/auth';

const router = Router();

router.get('/', protect, getPortfolio);
router.put('/info', protect, updatePortfolioInfo);


router.post('/project', protect, addProject);
router.post('/projects', protect, addProject);
router.delete('/project/:projectId', protect, deleteProject);


router.post('/certificate', protect, addCertificate);
router.post('/certificates', protect, addCertificate);
router.delete('/certificate/:certId', protect, deleteCertificate);

export default router;
