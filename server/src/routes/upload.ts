import { Router } from 'express';
import { 
  uploadProfilePicture, 
  uploadProjectMedia, 
  uploadProgressMedia, 
  uploadCoverImage, 
  uploadEventImage,
  deleteFile 
} from '../controllers/uploadController';
import { auth } from '../middleware/auth';

const router = Router();

// Protected routes
router.post('/profile-picture', auth, uploadProfilePicture);
router.post('/cover-image', auth, uploadCoverImage);
router.post('/project-media', auth, uploadProjectMedia);
router.post('/progress-media', auth, uploadProgressMedia);
router.post('/event-image', auth, uploadEventImage);
router.delete('/:publicId', auth, deleteFile);

export default router; 