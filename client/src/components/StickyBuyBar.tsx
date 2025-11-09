import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, ShoppingCart, X } from 'lucide-react';
import { Analytics } from '@/lib/analytics';

interface StickyBuyBarProps {
  currentBook?: {
    title: string;
    subtitle?: string;
    amazonLink: string;
    asin: string;
    price?: string;
  };
  threshold?: number; // Scroll threshold to show the bar
  className?: string;
}

export const StickyBuyBar: React.FC<StickyBuyBarProps> = ({ 
  currentBook,
  threshold = 400,
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!isDismissed) {
        setIsVisible(window.scrollY > threshold);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold, isDismissed]);

  const handleBuyClick = () => {
    if (currentBook) {
      // MODIFIED: Report conversion on click
      if (typeof (window as any).gtag === 'function') {
        (window as any).gtag('event', 'conversion', {
            'send_to': 'AW-17609588022/AtoCCI22g70bELb688xB',
        });
      }

      Analytics.amazonClick(currentBook.asin, currentBook.title);
      window.open(currentBook.amazonLink, '_blank');
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
    // Remember dismissal for this session
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(`sticky-bar-dismissed-${currentBook?.asin}`, 'true');
    }
  };

  // Check if already dismissed in this session
  useEffect(() => {
    if (currentBook && typeof window !== 'undefined') {
      const dismissed = sessionStorage.getItem(`sticky-bar-dismissed-${currentBook.asin}`);
      if (dismissed) {
        setIsDismissed(true);
      }
    }
  }, [currentBook]);

  if (!currentBook || !isVisible || isDismissed) return null;

  return (
    <div 
      className={`
        fixed bottom-0 left-0 right-0 z-40
        bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900
        backdrop-blur-lg
        border-t-2 border-blue-500/50
        shadow-2xl shadow-blue-500/20
        transform transition-all duration-500 ease-out
        ${isVisible ? 'translate-y-0' : 'translate-y-full'}
        ${className}
      `}
      style={{ 
        animation: isVisible ? 'slide-up-sticky 0.5s ease-out, pulse-glow 3s ease-in-out infinite' : '',
      }}
    >
      <div className="container">
        <div className="flex items-center justify-between py-3 md:py-4">
          {/* Book Info */}
          <div className="flex-1 mr-4">
            <h3 className="text-sm md:text-base font-semibold text-white truncate">
              {currentBook.title}
            </h3>
            {currentBook.subtitle && (
              <p className="text-xs text-slate-400 truncate hidden md:block">
                {currentBook.subtitle}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {currentBook.price && (
              <span className="text-lg font-bold text-green-400 mr-2">
                {currentBook.price}
              </span>
            )}
            
            <Button
              onClick={handleBuyClick}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-4 md:px-6 py-2 shadow-lg"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Get on</span> Amazon
              <ExternalLink className="w-3 h-3 ml-1" />
            </Button>

            <button
              onClick={handleDismiss}
              className="text-slate-500 hover:text-slate-300 p-2 transition-colors"
              aria-label="Dismiss buy bar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Multi-book variant for pages with multiple books
interface MultiBooksBarProps {
  books: Array<{
    title: string;
    amazonLink: string;
    asin: string;
  }>;
  threshold?: number;
}

export const MultiBooksBar: React.FC<MultiBooksBarProps> = ({ 
  books, 
  threshold = 600 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  // Rotate through books every 5 seconds
  useEffect(() => {
    if (isVisible && books.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % books.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isVisible, books.length]);

  if (!books.length || !isVisible) return null;

  const currentBook = books[currentIndex];

  return (
    <StickyBuyBar 
      currentBook={currentBook}
      threshold={0} // Already handled visibility
    />
  );
};

export default StickyBuyBar;
