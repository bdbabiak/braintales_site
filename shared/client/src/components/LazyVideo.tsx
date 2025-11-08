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

  if (isLoaded) {
    return (
      <div className="relative rounded-lg overflow-hidden bg-slate-900" style={{ paddingBottom: aspectRatio }}>
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // Use hqdefault which works for all videos including Shorts
  const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <button
      onClick={() => setIsLoaded(true)}
      className="w-full group relative overflow-hidden rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
      aria-label={`Play video: ${title}`}
    >
      <div className="relative bg-gradient-to-br from-slate-800 to-slate-900" style={{ paddingBottom: aspectRatio }}>
        <img 
          src={thumbnailUrl}
          alt={`${title} thumbnail`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Play button overlay */}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-red-600 group-hover:bg-red-700 flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
              <Play className="w-10 h-10 text-white ml-1" fill="currentColor" />
            </div>
            <p className="text-white font-semibold text-lg drop-shadow-lg">Watch Video</p>
            {description && (
              <p className="text-slate-200 text-sm mt-2 drop-shadow-lg px-4">{description}</p>
            )}
          </div>
        </div>
      </div>
    </button>
  );
};

export default LazyVideo;
