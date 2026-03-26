import express from 'express';
import { getDashboardSummary, getPublicOverview } from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/public', getPublicOverview);
router.get('/summary', protect, getDashboardSummary);

export default router;
