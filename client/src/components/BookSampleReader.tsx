import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BookOpen, X, ExternalLink } from 'lucide-react';

interface AmazonLookInsideProps {
  amazonLink: string;
  bookTitle: string;
  asin: string;
  className?: string;
  variant?: 'button' | 'link';
}

// Amazon embed URLs for each book's Kindle preview
// You'll need to get these from Amazon by clicking "Embed" on each book's Kindle page
const AMAZON_EMBED_URLS: Record<string, string> = {
  // The ADHD Brain
  'B0FWTY1VVS': 'https://read.amazon.com/kp/embed?asin=B0FWTY1VVS&preview=inline&linkCode=kpe&ref_=cm_sw_r_kb_dp',
  
  // Everything Thinks
  'B0FNCPTGPS': 'https://read.amazon.com/kp/embed?asin=B0FNCPTGPS&preview=inline&linkCode=kpe&ref_=cm_sw_r_kb_dp',
  
  // The Sight Eater
  'B0FN3M4DFZ': 'https://read.amazon.com/kp/embed?asin=B0FN3M4DFZ&preview=inline&linkCode=kpe&ref_=cm_sw_r_kb_dp',
  
  // Grandma's Illegal Dragon Racing Circuit
  'B0FP9MRCJM': 'https://read.amazon.com/kp/embed?asin=B0FP9MRCJM&preview=inline&linkCode=kpe&ref_=cm_sw_r_kb_dp',
  
  // Trading Psychology & Neuroscience
  'B0FXT51Y14': 'https://read.amazon.com/kp/embed?asin=B0FXT51Y14&preview=inline&linkCode=kpe&ref_=cm_sw_r_kb_dp',
  
  // The Familiar System
  'B0FLT5SKPL': 'https://read.amazon.com/kp/embed?asin=B0FLT5SKPL&preview=inline&linkCode=kpe&ref_=cm_sw_r_kb_dp',
  
  // The Doubles
  'B0FSSW9XGX': 'https://read.amazon.com/kp/embed?asin=B0FSSW9XGX&preview=inline&linkCode=kpe&ref_=cm_sw_r_kb_dp',
  
  // The Last Beautiful Game
  'B0FN3M4DFZ': 'https://read.amazon.com/kp/embed?asin=B0FN3M4DFZ&preview=inline&linkCode=kpe&ref_=cm_sw_r_kb_dp',
  
  // A Kind of Forgery
  'B0FS9Y48RX': 'https://read.amazon.com/kp/embed?asin=B0FS9Y48RX&preview=inline&linkCode=kpe&ref_=cm_sw_r_kb_dp',
  
  // The Momentum Wars
  'B0FMPYTC8H': 'https://read.amazon.com/kp/embed?asin=B0FMPYTC8H&preview=inline&linkCode=kpe&ref_=cm_sw_r_kb_dp',
  
  // Chronophage
  'B0FNM5TB9Y': 'https://read.amazon.com/kp/embed?asin=B0FNM5TB9Y&preview=inline&linkCode=kpe&ref_=cm_sw_r_kb_dp',
  
  // Quantum Sock Mismatch Mayhem
  'B0FR32348P': 'https://read.amazon.com/kp/embed?asin=B0FR32348P&preview=inline&linkCode=kpe&ref_=cm_sw_r_kb_dp',
  
  // The Last Channel of Nana Quantum
  'B0FQTGSFJG': 'https://read.amazon.com/kp/embed?asin=B0FQTGSFJG&preview=inline&linkCode=kpe&ref_=cm_sw_r_kb_dp',
  
  // Epicurus 2.0
  'B0FVF3ZRJQ': 'https://read.amazon.com/kp/embed?asin=B0FVF3ZRJQ&preview=inline&linkCode=kpe&ref_=cm_sw_r_kb_dp',
};

export const AmazonLookInside: React.FC<AmazonLookInsideProps> = ({ 
  amazonLink, 
  bookTitle,
  asin,
  className = '',
  variant = 'button'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const embedUrl = AMAZON_EMBED_URLS[asin];
  
  // If no embed URL is configured for this book, link to Amazon
  if (!embedUrl) {
    const handleClick = () => {
      window.open(amazonLink, '_blank', 'noopener,noreferrer');
    };
    
    if (variant === 'link') {
      return (
        <button 
          onClick={handleClick}
          className={`text-blue-400 hover:text-blue-300 underline text-sm inline-flex items-center gap-1 ${className}`}
        >
          <BookOpen className="w-3 h-3" />
          View on Amazon
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
        View on Amazon
        <ExternalLink className="w-3 h-3 ml-1" />
      </Button>
    );
  }

  // Render button/link that opens modal with embedded preview
  const TriggerComponent = variant === 'link' ? (
    <button 
      onClick={() => setIsOpen(true)}
      className={`text-blue-400 hover:text-blue-300 underline text-sm inline-flex items-center gap-1 ${className}`}
    >
      <BookOpen className="w-3 h-3" />
      Read Sample
    </button>
  ) : (
    <Button 
      variant="outline" 
      onClick={() => setIsOpen(true)}
      className={`border-slate-600 hover:bg-slate-700 ${className}`}
    >
      <BookOpen className="w-4 h-4 mr-2" />
      Read Sample
    </Button>
  );

  return (
    <>
      {TriggerComponent}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-5xl w-[90vw] max-h-[85vh] h-[85vh] bg-slate-900 border-slate-700 p-0">
          <DialogHeader className="border-b border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold text-white">
                {bookTitle} - Sample Preview
              </DialogTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsOpen(false)}
                className="hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </DialogHeader>
          
          {/* Amazon Kindle Embed Widget */}
          <div className="flex-1 w-full h-full p-4">
            <iframe 
              src={embedUrl}
              width="100%" 
              height="100%"
              style={{ 
                border: '1px solid #334155',
                borderRadius: '8px',
                backgroundColor: '#1e293b',
                minHeight: '600px'
              }}
              allowFullScreen
              title={`${bookTitle} Preview`}
            />
          </div>
          
          <div className="border-t border-slate-700 p-4 flex justify-between items-center">
            <p className="text-sm text-slate-400">
              Interactive preview powered by Amazon Kindle
            </p>
            <div className="flex gap-2">
              <Button 
                onClick={() => setIsOpen(false)}
                variant="outline"
                className="border-slate-600 hover:bg-slate-700"
              >
                Close
              </Button>
              <Button 
                onClick={() => window.open(amazonLink, '_blank')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Buy on Amazon <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

// For backwards compatibility
export const BookSampleReader = AmazonLookInside;
export default AmazonLookInside;
