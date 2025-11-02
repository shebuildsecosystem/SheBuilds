import { Router } from 'express';
import { listAnnouncements, createAnnouncement, deleteAnnouncement } from '../controllers/announcementController';
import { adminAuth } from '../middleware/auth';

const router = Router();

// Public route
router.get('/', listAnnouncements);

// Admin routes
router.post('/', adminAuth, createAnnouncement);
router.delete('/:id', adminAuth, deleteAnnouncement);

export default router; 