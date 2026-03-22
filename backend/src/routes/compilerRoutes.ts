import { Router } from 'express';
import { runCode } from '../controllers/compilerController';
import { protect } from '../middlewares/auth';

const router = Router();

router.post('/run', protect, runCode);

export default router;
