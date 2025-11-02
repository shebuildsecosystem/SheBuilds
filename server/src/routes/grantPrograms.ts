import { Router } from 'express';
import { 
  getAllGrantPrograms, 
  getGrantProgram, 
  createGrantProgram, 
  updateGrantProgram, 
  deleteGrantProgram, 
  getGrantProgramStats, 
  toggleFeatured,
  uploadCoverImage
} from '../controllers/grantProgramController';
import { auth, adminAuth } from '../middleware/auth';
import multer from 'multer';
import path from 'path';

const router = Router();

// Public routes
router.get('/', getAllGrantPrograms);
router.get('/:programId', getGrantProgram);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Admin routes
router.post('/', adminAuth, createGrantProgram);
router.put('/:programId', adminAuth, updateGrantProgram);
router.delete('/:programId', adminAuth, deleteGrantProgram);
router.get('/admin/stats', adminAuth, getGrantProgramStats);
router.patch('/:programId/featured', adminAuth, toggleFeatured);
router.post('/upload-cover', adminAuth, upload.single('coverImage'), uploadCoverImage);

export default router; 