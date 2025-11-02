import { Router } from 'express';
import { 
  applyForGrant, 
  getUserGrants, 
  getGrantById, 
  updateGrantStatus, 
  getAllGrants, 
  adminDeleteGrant 
} from '../controllers/grantController';
import { auth, adminAuth } from '../middleware/auth';
import { validateGrant } from '../middleware/validation';

const router = Router();

// Protected routes
router.post('/apply', auth, validateGrant, applyForGrant);
router.get('/my-grants', auth, getUserGrants);
router.get('/:id', auth, getGrantById);

// Admin routes
router.get('/', adminAuth, getAllGrants);
router.put('/:id/status', adminAuth, updateGrantStatus);
router.delete('/:id', adminAuth, adminDeleteGrant);

export default router; 