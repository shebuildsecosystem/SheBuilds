import React, { useState, useRef, useEffect } from 'react';
import { getOptimizedImageSrc, isCloudinaryConfigured, CloudinaryOptions } from '@/lib/cloudinary';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  cloudinaryId?: string;
  cloudinaryOptions?: CloudinaryOptions;
  lazy?: boolean;
  placeholder?: 'blur' | 'empty';
  onLoadComplete?: () => void;
}

/**
 * Optimized Image component with:
 * - Lazy loading (intersection observer)
 * - WebP format support with PNG fallback
 * - Cloudinary integration when configured
 * - Loading placeholder
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  cloudinaryId,
  cloudinaryOptions,
  lazy = true,
  placeholder = 'empty',
  className = '',
  onLoadComplete,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px', // Start loading 100px before entering viewport
        threshold: 0,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [lazy]);

  // Get the optimized source
  const optimizedSrc = getOptimizedImageSrc(src, cloudinaryId, cloudinaryOptions);

  // Fallback to original PNG if WebP fails
  const fallbackSrc = src;

  const handleLoad = () => {
    setIsLoaded(true);
    onLoadComplete?.();
  };

  const handleError = () => {
    // If WebP fails, try original format
    if (!hasError && optimizedSrc !== fallbackSrc) {
      setHasError(true);
    }
  };

  const currentSrc = hasError ? fallbackSrc : optimizedSrc;

  return (
    <div className={`relative ${className}`} ref={imgRef as any}>
      {/* Placeholder while loading */}
      {!isLoaded && placeholder === 'blur' && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-inherit" />
      )}

      {/* Actual image */}
      {isInView && (
        <img
          src={currentSrc}
          alt={alt}
          className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
          onLoad={handleLoad}
          onError={handleError}
          loading={lazy ? 'lazy' : 'eager'}
          decoding="async"
          {...props}
        />
      )}
    </div>
  );
};

export default OptimizedImage;
