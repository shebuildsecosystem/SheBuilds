import { Router } from 'express';
import { 
  createProgressLog, 
  getProjectProgressLogs, 
  getUserProgressLogs, 
  getProgressLogById, 
  updateProgressLog, 
  deleteProgressLog,
  getRecentProgressLogs
} from '../controllers/progressLogController';
import { auth } from '../middleware/auth';
import { validateProgressLog } from '../middleware/validation';

const router = Router();

// Public routes
router.get('/recent', getRecentProgressLogs);
router.get('/project/:projectId', getProjectProgressLogs);
router.get('/:id', getProgressLogById);

// Protected routes
router.get('/user/my-logs', auth, getUserProgressLogs);
router.post('/', auth, validateProgressLog, createProgressLog);
router.put('/:id', auth, validateProgressLog, updateProgressLog);
router.delete('/:id', auth, deleteProgressLog);

export default router; 