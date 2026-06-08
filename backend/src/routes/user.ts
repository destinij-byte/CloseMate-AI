import { Router } from 'express';
import { getUsage } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/usage', authenticateToken, getUsage);

export default router;
