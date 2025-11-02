import { Router } from 'express';
import { 
  searchUsers, 
  searchProjects, 
  getPopularSkills, 
  getPopularTechStack, 
  getAnalytics,
  getAllUsers
} from '../controllers/searchController';

const router = Router();

// Public routes
router.get('/users', searchUsers);
router.get('/users/all', getAllUsers);
router.get('/projects', searchProjects);
router.get('/skills/popular', getPopularSkills);
router.get('/tech-stack/popular', getPopularTechStack);
router.get('/analytics', getAnalytics);

export default router; 