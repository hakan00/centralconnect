import express from 'express';
import {
  createTransfer,
  deleteTransfer,
  getTransfers,
  updateTransfer,
  updateTransferStatus
} from '../controllers/transferController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.route('/').get(protect, getTransfers).post(protect, createTransfer);
router.route('/:id').put(protect, updateTransfer).delete(protect, deleteTransfer);
router.patch('/:id/status', protect, adminOnly, updateTransferStatus);
export default router;
