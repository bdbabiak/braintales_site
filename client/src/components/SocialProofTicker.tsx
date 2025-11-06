import { useState, useEffect } from 'react';
import { X, TrendingUp, Star, BookOpen } from 'lucide-react';

interface SocialProofNotification {
  id: string;
  message: string;
  icon: 'purchase' | 'review' | 'reading';
  timestamp: Date;
}

export const SocialProofTicker = () => {
  const [notification, setNotification] = useState<SocialProofNotification | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [queue, setQueue] = useState<SocialProofNotification[]>([]);

  // Book titles for realistic messages
  const bookTitles = [
    'The ADHD Brain',
    'Everything Thinks',
    'The Sight Eater',
    'Grandma\'s Illegal Dragon Racing Circuit',
    'The Momentum Wars',
    'Chronophage',
    'Trading Psychology & Neuroscience',
    'The Familiar System',
    'Epicurus 2.0',
    'The Doubles',
    'A Kind of Forgery',
    'The Last Beautiful Game',
    'Quantum Sock Mismatch Mayhem',
    'The Last Channel of Nana Quantum'
  ];

  // Locations for geographic variety
  const locations = [
    'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix',
    'London', 'Paris', 'Tokyo', 'Sydney', 'Toronto',
    'Berlin', 'Singapore', 'Dublin', 'Austin', 'Seattle',
    'Miami', 'Denver', 'Boston', 'Portland', 'San Francisco'
  ];

  // Generate realistic notifications
  const generateNotification = (): SocialProofNotification => {
    const types = [
      {
        type: 'purchase' as const,
        templates: [
          `Someone in ${locations[Math.floor(Math.random() * locations.length)]} just bought {book}`,
          `New reader started {book}`,
          `{book} was just downloaded`,
          `Reader from ${locations[Math.floor(Math.random() * locations.length)]} purchased {book}`
        ]
      },
      {
        type: 'review' as const,
        templates: [
          `New 5-star review for {book}`,
          `"{book}" just received another 5-star rating`,
          `Reader loved {book} - 5 stars!`,
          `Fresh review: {book} is "mind-blowing"`
        ]
      },
      {
        type: 'reading' as const,
        templates: [
          `${Math.floor(Math.random() * 5) + 2} people are reading {book} right now`,
          `{book} is trending today`,
          `Readers can't put down {book}`,
          `{book} climbing the charts`
        ]
      }
    ];

    const typeGroup = types[Math.floor(Math.random() * types.length)];
    const template = typeGroup.templates[Math.floor(Math.random() * typeGroup.templates.length)];
    const book = bookTitles[Math.floor(Math.random() * bookTitles.length)];
    const message = template.replace('{book}', `"${book}"`);

    return {
      id: Math.random().toString(36).substr(2, 9),
      message,
      icon: typeGroup.type,
      timestamp: new Date()
    };
  };

  // Initialize queue with some notifications
  useEffect(() => {
    const initialNotifications = Array.from({ length: 10 }, generateNotification);
    setQueue(initialNotifications);
  }, []);

  // Process queue and show notifications
  useEffect(() => {
    if (queue.length === 0) return;

    const showNextNotification = () => {
      if (queue.length > 0) {
        const [next, ...rest] = queue;
        setNotification(next);
        setIsVisible(true);
        setQueue(rest);

        // Add a new notification to the end of queue
        setTimeout(() => {
          setQueue(prev => [...prev, generateNotification()]);
        }, 2000);

        // Hide after 5 seconds
        setTimeout(() => {
          setIsVisible(false);
        }, 5000);
      }
    };

    // Wait before showing first notification (let user settle on page)
    const initialDelay = setTimeout(showNextNotification, 8000);

    // Then show notifications periodically
    const interval = setInterval(() => {
      if (!isVisible) {
        showNextNotification();
      }
    }, 12000); // Show every 12 seconds

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, [queue, isVisible]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'review':
        return <Star className="w-4 h-4 text-yellow-400" />;
      case 'reading':
        return <BookOpen className="w-4 h-4 text-blue-400" />;
      default:
        return <TrendingUp className="w-4 h-4 text-green-400" />;
    }
  };

  if (!notification || !isVisible) return null;

  return (
    <div 
      className={`
        fixed bottom-6 left-6 z-50
        bg-slate-800/95 backdrop-blur-sm
        border border-slate-700
        rounded-lg shadow-2xl
        p-4 pr-10
        max-w-sm
        transform transition-all duration-500 ease-out
        ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}
      `}
    >
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 text-slate-500 hover:text-slate-300 transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
      
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon(notification.icon)}
        </div>
        <div className="flex-1">
          <p className="text-sm text-slate-200 font-medium">
            {notification.message}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Just now
          </p>
        </div>
      </div>

      {/* Progress bar showing time remaining */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-700 rounded-b-lg overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
          style={{
            animation: 'shrink 5s linear forwards',
          }}
        />
      </div>
    </div>
  );
};

export default SocialProofTicker;
