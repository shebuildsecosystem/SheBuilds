// Cloudinary Configuration
// To use Cloudinary, set your cloud name in the environment variable VITE_CLOUDINARY_CLOUD_NAME
// or replace the default value below

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'your-cloud-name';

export interface CloudinaryOptions {
  width?: number;
  height?: number;
  quality?: number | 'auto';
  format?: 'auto' | 'webp' | 'avif' | 'png' | 'jpg';
  crop?: 'fill' | 'fit' | 'scale' | 'crop' | 'thumb';
  gravity?: 'auto' | 'face' | 'center';
}

/**
 * Generate a Cloudinary optimized URL
 * @param publicId - The public ID of the image in Cloudinary (e.g., "shebuilds/1")
 * @param options - Transformation options
 */
export function getCloudinaryUrl(publicId: string, options: CloudinaryOptions = {}): string {
  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'fill',
    gravity = 'auto',
  } = options;

  const transformations: string[] = [];

  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (crop) transformations.push(`c_${crop}`);
  if (gravity) transformations.push(`g_${gravity}`);
  if (quality) transformations.push(`q_${quality}`);
  if (format) transformations.push(`f_${format}`);

  const transformString = transformations.join(',');

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformString}/${publicId}`;
}

/**
 * Check if Cloudinary is configured
 */
export function isCloudinaryConfigured(): boolean {
  return CLOUDINARY_CLOUD_NAME !== 'your-cloud-name' && !!CLOUDINARY_CLOUD_NAME;
}

/**
 * Get optimized image source - uses Cloudinary if configured, otherwise falls back to local
 * @param localPath - Local path like "/1.png"
 * @param cloudinaryId - Cloudinary public ID like "shebuilds/1"
 * @param options - Cloudinary transformation options
 */
export function getOptimizedImageSrc(
  localPath: string,
  cloudinaryId?: string,
  options?: CloudinaryOptions
): string {
  // If Cloudinary is configured and we have a cloudinaryId, use Cloudinary
  if (isCloudinaryConfigured() && cloudinaryId) {
    return getCloudinaryUrl(cloudinaryId, options);
  }

  // Otherwise, use local path (prefer .webp if available)
  // The build process should have created .webp versions
  const webpPath = localPath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  return webpPath;
}

// Preset configurations for common use cases
export const imagePresets = {
  thumbnail: { width: 150, height: 150, crop: 'thumb' as const },
  card: { width: 400, height: 300, crop: 'fill' as const },
  carousel: { width: 600, height: 400, crop: 'fill' as const },
  hero: { width: 1200, height: 800, crop: 'fill' as const },
  avatar: { width: 100, height: 100, crop: 'thumb' as const, gravity: 'face' as const },
  logo: { width: 200, height: 80, crop: 'fit' as const },
};
