import express from 'express';
import { createTour, deleteTour, getTours, updateTour } from '../controllers/tourController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.route('/').get(getTours).post(protect, adminOnly, createTour);
router.route('/:id').put(protect, adminOnly, updateTour).delete(protect, adminOnly, deleteTour);
export default router;
