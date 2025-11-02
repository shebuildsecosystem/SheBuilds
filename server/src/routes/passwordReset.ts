import { Router } from 'express';
import { 
  requestPasswordReset, 
  resetPassword, 
  verifyResetToken 
} from '../controllers/passwordResetController';

const router = Router();

// Public routes
router.post('/request', requestPasswordReset);
router.post('/reset', resetPassword);
router.get('/verify/:token', verifyResetToken);

export default router; 