import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

interface UploadResult {
  url: string;
  public_id: string;
  secure_url: string;
}

// Multer file interface
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

class UploadService {
  // Upload single image
  async uploadImage(file: MulterFile, folder: string = 'shebuilds'): Promise<UploadResult> {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder,
        resource_type: 'image',
        transformation: [
          { width: 800, height: 600, crop: 'limit' },
          { quality: 'auto' }
        ]
      });

      return {
        url: result.url,
        public_id: result.public_id,
        secure_url: result.secure_url
      };
    } catch (error) {
      console.error('Image upload error:', error);
      throw new Error('Failed to upload image');
    }
  }

  // Upload multiple images
  async uploadMultipleImages(files: MulterFile[], folder: string = 'shebuilds'): Promise<UploadResult[]> {
    try {
      const uploadPromises = files.map(file => this.uploadImage(file, folder));
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Multiple images upload error:', error);
      throw new Error('Failed to upload images');
    }
  }

  // Upload video
  async uploadVideo(file: MulterFile, folder: string = 'shebuilds'): Promise<UploadResult> {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder,
        resource_type: 'video',
        transformation: [
          { width: 800, height: 600, crop: 'limit' },
          { quality: 'auto' }
        ]
      });

      return {
        url: result.url,
        public_id: result.public_id,
        secure_url: result.secure_url
      };
    } catch (error) {
      console.error('Video upload error:', error);
      throw new Error('Failed to upload video');
    }
  }

  // Delete file from Cloudinary
  async deleteFile(publicId: string): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === 'ok';
    } catch (error) {
      console.error('File deletion error:', error);
      return false;
    }
  }

  // Upload profile picture
  async uploadProfilePicture(file: MulterFile): Promise<UploadResult> {
    return this.uploadImage(file, 'shebuilds/profiles');
  }

  // Upload cover image
  async uploadCoverImage(file: MulterFile): Promise<UploadResult> {
    return this.uploadImage(file, 'shebuilds/covers');
  }

  // Upload project media
  async uploadProjectMedia(file: MulterFile): Promise<UploadResult> {
    return this.uploadImage(file, 'shebuilds/projects');
  }

  // Upload progress log media
  async uploadProgressMedia(file: MulterFile): Promise<UploadResult> {
    return this.uploadImage(file, 'shebuilds/progress');
  }

  // Upload event image
  async uploadEventImage(file: MulterFile): Promise<UploadResult> {
    return this.uploadImage(file, 'shebuilds/events');
  }

  // Upload grant program cover image
  async uploadGrantProgramCover(file: MulterFile): Promise<UploadResult> {
    return this.uploadImage(file, 'shebuilds/grant-programs');
  }
}

export const uploadService = new UploadService(); 