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
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority || !imgRef.current) return;

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
  }, [priority]);

  return (
    <div 
      ref={imgRef}
      className={cn('relative overflow-hidden', className)}
      style={aspectRatio ? { paddingBottom: aspectRatio } : undefined}
    >
      {/* Placeholder with blur effect */}
      <div 
        className={cn(
          'absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-700 animate-pulse transition-opacity duration-500',
          isLoaded ? 'opacity-0' : 'opacity-100'
        )}
      />
      
      {/* Actual image */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-500',
            isLoaded ? 'opacity-100' : 'opacity-0',
            aspectRatio ? 'absolute inset-0' : ''
          )}
          loading={priority ? 'eager' : 'lazy'}
          onLoad={() => {
            setIsLoaded(true);
            onLoad?.();
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
