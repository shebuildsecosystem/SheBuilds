import { Router } from 'express';
import { 
  submitGrantApplication, 
  getUserGrantApplications, 
  getGrantApplicationById, 
  getAllGrantApplications, 
  updateGrantApplicationStatus, 
  deleteGrantApplication
} from '../controllers/grantApplicationController';
import { auth, adminAuth } from '../middleware/auth';
import { validateGrantApplication } from '../middleware/validation';

const router = Router();

// User routes
router.post('/', auth, validateGrantApplication, submitGrantApplication);
router.get('/my-applications', auth, getUserGrantApplications);
router.get('/:id', auth, getGrantApplicationById);

// Admin routes
router.get('/', adminAuth, getAllGrantApplications);
router.put('/:id/status', adminAuth, updateGrantApplicationStatus);
router.delete('/:id', adminAuth, deleteGrantApplication);

export default router; 