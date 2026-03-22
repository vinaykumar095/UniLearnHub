import express from 'express';
import { recordSubmission, getProgress } from '../controllers/dsaController';
import { protect } from '../middlewares/auth';

const router = express.Router();

router.post('/submit', protect, recordSubmission);
router.get('/progress', protect, getProgress);

export default router;
