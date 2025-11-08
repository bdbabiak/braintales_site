import { Clock, BookOpen, FileText } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';

// Book metadata with word counts
export const BOOK_METADATA = {
  // Fiction
  'B0FSSW9XGX': { wordCount: 65000, pages: 260, series: null }, // The Doubles
  'B0FS9Y48RX': { wordCount: 72000, pages: 288, series: 'Neuroscience and Psychiatry in Fiction' },
  'B0FN3M4DFZ': { wordCount: 58000, pages: 232, series: null }, // The Sight Eater
  'B0FP9MRCJM': { wordCount: 68000, pages: 272, series: 'The Absurd Quantum Chronicles' },
  'B0FLT5SKPL': { wordCount: 70000, pages: 280, series: 'Neuroscience and Psychiatry in Fiction' },
  'B0FMPYTC8H': { wordCount: 62000, pages: 248, series: 'Neuroscience and Psychiatry in Fiction' },
  'B0FNM5TB9Y': { wordCount: 75000, pages: 300, series: 'Impossible Systems' },
  'B0FMXKQ8BJ': { wordCount: 69000, pages: 276, series: 'Impossible Systems' },
  'B0FNCPTGPS': { wordCount: 71000, pages: 284, series: 'Impossible Systems' },
  'B0FR32348P': { wordCount: 66000, pages: 264, series: 'The Absurd Quantum Chronicles' },
  'B0FQTGSFJG': { wordCount: 64000, pages: 256, series: 'The Absurd Quantum Chronicles' },
  
  // Non-Fiction
  'B0FWTY1VVS': { wordCount: 85000, pages: 340, series: null }, // The ADHD Brain
  'B0FXT51Y14': { wordCount: 78000, pages: 312, series: null }, // Trading Psychology
  'B0FVF3ZRJQ': { wordCount: 73000, pages: 292, series: null }, // Epicurus 2.0
};

interface ReadingTimeProps {
  wordCount: number;
  className?: string;
  showIcon?: boolean;
  detailed?: boolean;
}

export const ReadingTime: React.FC<ReadingTimeProps> = ({ 
  wordCount, 
  className = '',
  showIcon = true,
  detailed = false
}) => {
  const { hours, minutes, days } = useMemo(() => {
    const averageWPM = 250; // Average adult reading speed
    const totalMinutes = Math.ceil(wordCount / averageWPM);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const days = hours > 24 ? Math.ceil(hours / 6) : 0; // Assuming 6 hours reading per day
    
    return { hours, minutes, days };
  }, [wordCount]);

  const formatTime = () => {
    if (days > 0 && detailed) {
      return `${days} days (${hours}h total)`;
    }
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  };

  return (
    <div className={`flex items-center gap-1.5 text-slate-400 text-sm ${className}`}>
      {showIcon && <Clock className="w-3.5 h-3.5" />}
      <span>{formatTime()} read</span>
    </div>
  );
};

interface BookMetadataProps {
  asin: string;
  className?: string;
  showAll?: boolean;
}

export const BookMetadata: React.FC<BookMetadataProps> = ({ 
  asin, 
  className = '',
  showAll = true
}) => {
  const metadata = BOOK_METADATA[asin as keyof typeof BOOK_METADATA];
  
  if (!metadata) return null;

  return (
    <div className={`flex flex-wrap items-center gap-4 text-sm ${className}`}>
      <ReadingTime wordCount={metadata.wordCount} />
      
      {showAll && metadata.pages && (
        <div className="flex items-center gap-1.5 text-slate-400">
          <FileText className="w-3.5 h-3.5" />
          <span>{metadata.pages} pages</span>
        </div>
      )}
      
      {showAll && metadata.series && (
        <div className="flex items-center gap-1.5 text-slate-400">
          <BookOpen className="w-3.5 h-3.5" />
          <span className="text-xs">{metadata.series}</span>
        </div>
      )}
    </div>
  );
};

interface ReadingProgressProps {
  bookId: string;
  className?: string;
}

export const ReadingProgress: React.FC<ReadingProgressProps> = ({ 
  bookId, 
  className = '' 
}) => {
  const storageKey = `reading-progress-${bookId}`;
  const [progress, setProgress] = useState(() => {
    if (typeof window === 'undefined') return 0;
    const saved = localStorage.getItem(storageKey);
    return saved ? parseInt(saved, 10) : 0;
  });

  const updateProgress = (newProgress: number) => {
    setProgress(newProgress);
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, newProgress.toString());
    }
  };

  const metadata = BOOK_METADATA[bookId as keyof typeof BOOK_METADATA];
  const pagesRead = metadata ? Math.floor((progress / 100) * metadata.pages) : 0;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center text-sm">
        <span className="text-slate-400">Reading Progress</span>
        <span className="text-slate-300 font-medium">{progress}%</span>
      </div>
      
      <div className="relative w-full h-2 bg-slate-700 rounded-full overflow-hidden">
        <div 
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {metadata && progress > 0 && (
        <p className="text-xs text-slate-500">
          {pagesRead} of {metadata.pages} pages • 
          {progress === 100 ? ' Completed! 🎉' : ` ${100 - progress}% remaining`}
        </p>
      )}
    </div>
  );
};

export default ReadingTime;
