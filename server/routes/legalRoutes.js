import express from 'express';
import {
  createLegalGuide,
  createLegalRequest,
  deleteLegalGuide,
  deleteLegalRequest,
  getLegalGuides,
  getMyLegalRequests,
  updateLegalGuide,
  updateLegalRequest
} from '../controllers/legalController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.route('/requests').get(protect, getMyLegalRequests).post(protect, createLegalRequest);
router.route('/requests/:id').put(protect, updateLegalRequest).delete(protect, deleteLegalRequest);
router.route('/').get(getLegalGuides).post(protect, adminOnly, createLegalGuide);
router.route('/:guideId').put(protect, adminOnly, updateLegalGuide).delete(protect, adminOnly, deleteLegalGuide);
export default router;
