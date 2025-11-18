import express from 'express';
import {
  getTickets,
  getTicket,
  createTicket,
  updateTicket,
  deleteTicket,
  addComment,
  uploadFile,
} from '../controllers/ticketController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router
  .route('/')
  .get(protect, getTickets)
  .post(protect, authorize('client'), createTicket);

router
  .route('/:id')
  .get(protect, getTicket)
  .put(protect, updateTicket)
  .delete(protect, authorize('admin'), deleteTicket);

router.post('/:id/comments', protect, upload.array('attachments', 5), addComment);
router.post('/:id/upload', protect, upload.single('file'), uploadFile);

export default router;

