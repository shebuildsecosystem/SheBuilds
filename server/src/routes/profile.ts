import { Router } from 'express';
import { getFullPublicProfile, setupOrUpdateProfile } from '../controllers/profileController';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/:username', getFullPublicProfile);
router.post('/setup', auth, setupOrUpdateProfile);

export default router; 