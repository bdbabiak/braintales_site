import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';

interface BookCover3DProps {
  src: string;
  alt: string;
  title: string;
  className?: string;
  onClick?: () => void;
}

export const BookCover3D: React.FC<BookCover3DProps> = ({ 
  src, 
  alt, 
  title,
  className = '',
  onClick
}) => {
  return (
    <div 
      className={`book-cover-3d rounded-lg overflow-hidden cursor-pointer ${className}`}
      onClick={onClick}
    >
      <img 
        src={src} 
        alt={alt}
        className="w-full h-auto"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-white font-bold text-sm drop-shadow-lg">{title}</p>
        </div>
      </div>
    </div>
  );
};

interface AnimatedStarRatingProps {
  rating: number;
  reviews: number;
  loading?: boolean;
  animated?: boolean;
  className?: string;
}

export const AnimatedStarRating: React.FC<AnimatedStarRatingProps> = ({ 
  rating, 
  reviews, 
  loading = false,
  animated = true,
  className = ''
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!loading && animated && rating > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    }
  }, [loading, animated, rating]);

  if (!rating && !reviews) return null;

  return (
    <div className={`star-rating flex items-center gap-2 ${className}`}>
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`
              w-4 h-4 
              ${i < Math.floor(rating) 
                ? 'fill-yellow-400 text-yellow-400 star-animated' 
                : 'text-slate-600'
              }
              ${isAnimating ? 'animate-star-pop' : ''}
            `}
            style={{ 
              animationDelay: isAnimating ? `${i * 0.1}s` : '0s',
              filter: i < Math.floor(rating) ? 'drop-shadow(0 0 4px rgba(251, 191, 36, 0.5))' : 'none'
            }}
          />
        ))}
      </div>
      <span className="text-sm text-slate-400">
        {rating.toFixed(1)} ({reviews.toLocaleString()})
      </span>
    </div>
  );
};

interface GradientHeadingProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  variant?: 'light' | 'dark';
}

export const GradientHeading: React.FC<GradientHeadingProps> = ({ 
  children, 
  className = '',
  as: Component = 'h1',
  variant = 'dark'
}) => {
  // Use brighter colors for dark backgrounds, darker colors for light
  const gradientClass = variant === 'dark' 
    ? 'gradient-text-animated' // existing bright gradient for dark backgrounds
    : 'gradient-text-animated-dark'; // new darker gradient for light backgrounds
    
  return (
    <Component className={`${gradientClass} font-bold ${className}`}>
      {children}
    </Component>
  );
};

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  children, 
  className = '',
  delay = 0,
  hover = true
}) => {
  return (
    <div 
      className={`
        animate-slide-up opacity-0 
        ${hover ? 'card-hover-lift' : ''} 
        ${className}
      `}
      style={{ 
        animationDelay: `${delay}s`, 
        animationFillMode: 'forwards' 
      }}
    >
      {children}
    </div>
  );
};

interface FloatingBookProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const FloatingBook: React.FC<FloatingBookProps> = ({ 
  children, 
  className = '',
  delay = 0
}) => {
  return (
    <div 
      className={`book-float ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
};

interface PulsingButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'success' | 'danger';
}

export const PulsingButton: React.FC<PulsingButtonProps> = ({ 
  children, 
  onClick,
  className = '',
  variant = 'default'
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return 'from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700';
      case 'danger':
        return 'from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700';
      default:
        return 'from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`
        cta-pulse 
        bg-gradient-to-r ${getVariantClasses()} 
        text-white font-bold px-8 py-4 rounded-lg 
        transition-all transform hover:scale-105
        ${className}
      `}
    >
      {children}
    </button>
  );
};

// Loading skeleton for books
export const BookSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="skeleton-shimmer bg-slate-800 aspect-[2/3] rounded-lg mb-4" />
      <div className="skeleton-shimmer bg-slate-800 h-6 rounded mb-2" />
      <div className="skeleton-shimmer bg-slate-800 h-4 w-3/4 rounded mb-2" />
      <div className="flex gap-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skeleton-shimmer bg-slate-800 w-4 h-4 rounded" />
        ))}
      </div>
    </div>
  );
};

export default BookCover3D;
