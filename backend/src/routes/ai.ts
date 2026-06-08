import { Router } from 'express';
import { objectionHandle, generateScript, suggestResponse } from '../controllers/aiController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/objection-handle', authenticateToken, objectionHandle);
router.post('/generate-script', authenticateToken, generateScript);
router.post('/suggest-response', authenticateToken, suggestResponse);

export default router;
