import express from 'express';
import {
  createApplication,
  deleteApplication,
  getApplications,
  updateApplication,
  updateApplicationStatus
} from '../controllers/applicationController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.route('/').get(protect, getApplications).post(protect, createApplication);
router.route('/:id').put(protect, updateApplication).delete(protect, deleteApplication);
router.patch('/:id/status', protect, adminOnly, updateApplicationStatus);
export default router;
