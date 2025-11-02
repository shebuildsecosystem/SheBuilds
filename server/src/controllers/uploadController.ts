import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { uploadService } from '../utils/uploadService';

interface AuthRequest extends Request {
  user?: any;
}

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
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'));
    }
  }
});

// Upload profile picture
export const uploadProfilePicture = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    upload.single('profile_picture')(req, res, async (err) => {
      if (err) {
        res.status(400).json({ message: err.message });
        return;
      }

      if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
      }

      try {
        const result = await uploadService.uploadProfilePicture(req.file);
        
        res.json({
          message: 'Profile picture uploaded successfully',
          image: {
            url: result.secure_url,
            public_id: result.public_id
          }
        });
      } catch (error) {
        console.error('Profile picture upload error:', error);
        res.status(500).json({ message: 'Failed to upload profile picture' });
      }
    });
  } catch (error) {
    console.error('Upload profile picture error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Upload project media
export const uploadProjectMedia = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    upload.array('media', 10)(req, res, async (err) => {
      if (err) {
        res.status(400).json({ message: err.message });
        return;
      }

      if (!req.files || req.files.length === 0) {
        res.status(400).json({ message: 'No files uploaded' });
        return;
      }

      try {
        const files = req.files as Express.Multer.File[];
        const results = await uploadService.uploadMultipleImages(files, 'shebuilds/projects');
        
        res.json({
          message: 'Project media uploaded successfully',
          media: results.map(result => ({
            url: result.secure_url,
            public_id: result.public_id
          }))
        });
      } catch (error) {
        console.error('Project media upload error:', error);
        res.status(500).json({ message: 'Failed to upload project media' });
      }
    });
  } catch (error) {
    console.error('Upload project media error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Upload progress log media
export const uploadProgressMedia = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    upload.array('media', 5)(req, res, async (err) => {
      if (err) {
        res.status(400).json({ message: err.message });
        return;
      }

      if (!req.files || req.files.length === 0) {
        res.status(400).json({ message: 'No files uploaded' });
        return;
      }

      try {
        const files = req.files as Express.Multer.File[];
        const results = await uploadService.uploadMultipleImages(files, 'shebuilds/progress');
        
        res.json({
          message: 'Progress media uploaded successfully',
          media: results.map(result => ({
            url: result.secure_url,
            public_id: result.public_id
          }))
        });
      } catch (error) {
        console.error('Progress media upload error:', error);
        res.status(500).json({ message: 'Failed to upload progress media' });
      }
    });
  } catch (error) {
    console.error('Upload progress media error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Upload cover image
export const uploadCoverImage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    upload.single('cover_image')(req, res, async (err) => {
      if (err) {
        res.status(400).json({ message: err.message });
        return;
      }

      if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
      }

      try {
        const result = await uploadService.uploadCoverImage(req.file);
        res.json({
          message: 'Cover image uploaded successfully',
          image: {
            url: result.secure_url,
            public_id: result.public_id
          }
        });
      } catch (error) {
        console.error('Cover image upload error:', error);
        res.status(500).json({ message: 'Failed to upload cover image' });
      }
    });
  } catch (error) {
    console.error('Upload cover image error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Upload event image
export const uploadEventImage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    upload.single('event_image')(req, res, async (err) => {
      if (err) {
        res.status(400).json({ message: err.message });
        return;
      }

      if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
      }

      try {
        const result = await uploadService.uploadEventImage(req.file);
        res.json({
          message: 'Event image uploaded successfully',
          image: {
            url: result.secure_url,
            public_id: result.public_id
          }
        });
      } catch (error) {
        console.error('Event image upload error:', error);
        res.status(500).json({ message: 'Failed to upload event image' });
      }
    });
  } catch (error) {
    console.error('Upload event image error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete uploaded file
export const deleteFile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { publicId } = req.params;

    const success = await uploadService.deleteFile(publicId);
    
    if (success) {
      res.json({ message: 'File deleted successfully' });
    } else {
      res.status(400).json({ message: 'Failed to delete file' });
    }
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 