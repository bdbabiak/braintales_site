import { Button } from '@/components/ui/button';
import { BookOpen, ExternalLink } from 'lucide-react';

interface AmazonLookInsideProps {
  amazonLink: string;
  bookTitle: string;
  className?: string;
  variant?: 'button' | 'link';
}

// This component creates a button/link to Amazon's "Look Inside" feature
// Amazon automatically shows their preview if available for the book
export const AmazonLookInside: React.FC<AmazonLookInsideProps> = ({ 
  amazonLink, 
  bookTitle,
  className = '',
  variant = 'button'
}) => {
  const handleClick = () => {
    // Open Amazon link in new tab - Amazon will show their "Look Inside" feature if available
    window.open(amazonLink, '_blank', 'noopener,noreferrer');
  };

  if (variant === 'link') {
    return (
      <button 
        onClick={handleClick}
        className={`text-blue-400 hover:text-blue-300 underline text-sm inline-flex items-center gap-1 ${className}`}
      >
        <BookOpen className="w-3 h-3" />
        Look Inside
        <ExternalLink className="w-3 h-3" />
      </button>
    );
  }

  return (
    <Button 
      variant="outline" 
      onClick={handleClick}
      className={`border-slate-600 hover:bg-slate-700 ${className}`}
    >
      <BookOpen className="w-4 h-4 mr-2" />
      Look Inside
      <ExternalLink className="w-3 h-3 ml-1" />
    </Button>
  );
};

// For backwards compatibility
export const BookSampleReader = AmazonLookInside;
export default AmazonLookInside;
