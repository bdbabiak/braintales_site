import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean; // Load immediately for above-the-fold images
  aspectRatio?: string; // For maintaining aspect ratio during load
  onLoad?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({ 
  src, 
  alt, 
  className = '',
  priority = false,
  aspectRatio,
  onLoad
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [imageError, setImageError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Priority images should load immediately
    if (priority) {
      setIsInView(true);
      // Preload priority images
      const img = new Image();
      img.src = src;
      img.onload = () => {
        // Image is cached now
      };
      return;
    }

    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [priority, src]);

  // Fallback for image loading errors
  if (imageError) {
    return (
      <div 
        className={cn('relative overflow-hidden bg-slate-800', className)}
        style={aspectRatio ? { paddingBottom: aspectRatio } : undefined}
      >
        <div className="absolute inset-0 flex items-center justify-center text-slate-500">
          Image loading failed
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={imgRef}
      className={cn('relative overflow-hidden', className)}
      style={aspectRatio ? { paddingBottom: aspectRatio } : undefined}
    >
      {/* Placeholder with blur effect */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-700 animate-pulse"
        />
      )}
      
      {/* Actual image */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0',
            aspectRatio ? 'absolute inset-0' : ''
          )}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={() => {
            setIsLoaded(true);
            onLoad?.();
          }}
          onError={() => {
            setImageError(true);
          }}
        />
      )}
    </div>
  );
};

// Specific component for book covers with 2:3 aspect ratio
export const BookCoverImage: React.FC<Omit<OptimizedImageProps, 'aspectRatio'>> = (props) => {
  return <OptimizedImage {...props} aspectRatio="150%" />; // 2:3 aspect ratio
};

export default OptimizedImage;
