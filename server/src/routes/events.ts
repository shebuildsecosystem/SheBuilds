import express from 'express';
import { getEvents, getEvent, createEvent, updateEvent, deleteEvent, registerForEvent } from '../controllers/eventController';
import { auth, adminAuth } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getEvents);
router.get('/:eventId', getEvent);

// Protected routes (require authentication)
router.post('/:eventId/register', auth, registerForEvent);

// Admin routes (require admin authentication)
router.post('/', adminAuth, createEvent);
router.put('/:eventId', adminAuth, updateEvent);
router.delete('/:eventId', adminAuth, deleteEvent);

export default router; 