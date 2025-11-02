import { Router } from 'express';
import { 
  createChallenge, 
  getChallenges, 
  getChallengeById, 
  registerForChallenge, 
  submitProjectToChallenge,
  updateChallenge,
  setChallengeWinners,
  getUserChallenges,
  adminDeleteChallenge
} from '../controllers/challengeController';
import { auth, adminAuth } from '../middleware/auth';
import { validateChallenge } from '../middleware/validation';

const router = Router();

// Public routes
router.get('/', getChallenges);
router.get('/:id', getChallengeById);

// Protected routes
router.get('/user/my-challenges', auth, getUserChallenges);
router.post('/:challengeId/register', auth, registerForChallenge);
router.post('/:challengeId/submit', auth, submitProjectToChallenge);

// Admin routes
router.post('/', adminAuth, validateChallenge, createChallenge);
router.put('/:id', adminAuth, validateChallenge, updateChallenge);
router.put('/:id/winners', adminAuth, setChallengeWinners);
router.delete('/:id', adminAuth, adminDeleteChallenge);

export default router; 