import express from 'express';
import { createPost, deletePost, getPosts, updatePost } from '../controllers/communityController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.route('/').get(getPosts).post(protect, createPost);
router.route('/:id').put(protect, updatePost).delete(protect, deletePost);
export default router;
