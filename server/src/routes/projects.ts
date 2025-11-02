import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { 
  createProject, 
  getProjects, 
  getProjectById, 
  updateProject, 
  deleteProject, 
  getUserProjects,
  getMyProjects
} from '../controllers/projectController';
import { auth } from '../middleware/auth';
import { validateProject } from '../middleware/validation';

const router = Router();

// Rate limiter for projects routes - more lenient
const projectsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 500 : 100, // More lenient in development
  message: 'Too many requests to projects API, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Public routes
router.get('/', projectsLimiter, getProjects);
router.get('/user/:userId', projectsLimiter, getUserProjects);

// Protected routes
router.get('/my-projects', projectsLimiter, auth, getMyProjects);
router.post('/', projectsLimiter, auth, validateProject, createProject);
router.put('/:id', projectsLimiter, auth, validateProject, updateProject);
router.delete('/:id', projectsLimiter, auth, deleteProject);

// This must be last to avoid conflicts with other routes
router.get('/:id', projectsLimiter, getProjectById);

export default router; 