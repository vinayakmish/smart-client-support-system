import express from 'express';
import { getUsers, getUser } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, authorize('admin', 'agent'), getUsers);
router.get('/:id', protect, authorize('admin'), getUser);

export default router;

