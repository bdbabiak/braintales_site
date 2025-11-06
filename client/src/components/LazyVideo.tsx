import { useState } from 'react';
import { Play } from 'lucide-react';

interface LazyVideoProps {
  videoId: string;
  title: string;
  description?: string;
  aspectRatio?: string; // e.g., '56.25%' for 16:9, '177.78%' for 9:16
  autoplay?: boolean;
}

export const LazyVideo: React.FC<LazyVideoProps> = ({ 
  videoId, 
  title, 
  description,
  aspectRatio = '56.25%', // Default 16:9
  autoplay = false
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoad = () => {
    setIsLoading(true);
    // Give iframe a moment to start loading
    setTimeout(() => {
      setIsLoaded(true);
      setIsLoading(false);
    }, 100);
  };

  if (isLoaded) {
    return (
      <div className="relative rounded-lg overflow-hidden bg-slate-900" style={{ paddingBottom: aspectRatio }}>
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?${autoplay ? 'autoplay=1&' : ''}rel=0&modestbranding=1`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <button
      onClick={handleLoad}
      disabled={isLoading}
      className="w-full group relative overflow-hidden rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
    >
      <div className="relative bg-gradient-to-br from-slate-800 to-slate-900" style={{ paddingBottom: aspectRatio }}>
        {/* Use lower quality thumbnail for faster loading */}
        <img 
          src={`https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`}
          alt={`${title} thumbnail`}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Loading state */}
        {isLoading ? (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-white/20 flex items-center justify-center animate-pulse">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="text-white font-medium mt-3">Loading video...</p>
            </div>
          </div>
        ) : (
          /* Play button overlay */
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/90 group-hover:bg-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all">
                <Play className="w-8 h-8 text-slate-900 ml-1" fill="currentColor" />
              </div>
              <p className="text-white font-medium drop-shadow-lg">Watch Video</p>
              {description && (
                <p className="text-slate-200 text-sm mt-1 drop-shadow-lg px-4">{description}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </button>
  );
};

export default LazyVideo;
