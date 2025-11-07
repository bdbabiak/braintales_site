import { useState } from 'react';
import { Mail, BookOpen, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';

const chapters = [
  { 
    id: 'adhd', 
    title: 'The ADHD Brain', 
    description: 'An Immersive Journey Through Science, Struggle and Strength'
  },
  { 
    id: 'doubles', 
    title: 'The Doubles: Ghosts of the Podium', 
    description: 'Political thriller about identity, power, and deception'
  },
  { 
    id: 'epicurus', 
    title: 'Epicurus 2.0', 
    description: "Why You Don't Matter (And Why That's The Best News You'll Get)"
  },
  { 
    id: 'sight-eater', 
    title: 'The Sight Eater', 
    description: 'Dark comedy about love, bureaucracy, and monstrosity'
  },
  { 
    id: 'grandma', 
    title: "Grandma's Illegal Dragon Racing Circuit", 
    description: 'Absurdist sci-fi satire where your weirdness is your value'
  }
];

export function EmailCapture() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const subscribe = trpc.subscription.subscribe.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !selectedChapter) {
      setError('Please enter your email and select a chapter');
      return;
    }

    setError('');

    try {
      await subscribe.mutateAsync({ 
        email, 
        chapter: selectedChapter as any,
        source: 'chapter_download'
      });

      setSubmitted(true);
      
      // Track conversion
      if (typeof window !== 'undefined' && (window as any).plausible) {
        (window as any).plausible('Email Signup', { 
          props: { chapter: selectedChapter } 
        });
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 md:bottom-6 right-6 z-40 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2 group"
      >
        <BookOpen className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        <span className="font-semibold">Get Free Chapter</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className="relative w-full max-w-2xl bg-slate-900 border-slate-700 p-8 shadow-2xl">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Success!</h3>
            <p className="text-slate-300 mb-4">
              Check your email at <span className="text-blue-400 font-mono">{email}</span>
            </p>
            <p className="text-slate-400 text-sm mb-6">
              Your free chapter should arrive within 5 minutes. Check spam if you don't see it.
            </p>
            <Button onClick={() => setIsOpen(false)}>
              Continue Browsing
            </Button>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Try Before You Buy
              </h2>
              <p className="text-slate-300">
                Choose a free chapter from any of my books. No spam, ever.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Select Your Free Chapter
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {chapters.map((chapter) => (
                    <button
                      key={chapter.id}
                      type="button"
                      onClick={() => setSelectedChapter(chapter.id)}
                      className={`text-left p-4 rounded-lg border-2 transition-all ${
                        selectedChapter === chapter.id
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-slate-700 hover:border-slate-600 bg-slate-800/50'
                      }`}
                    >
                      <div className="font-semibold text-white mb-1">
                        {chapter.title}
                      </div>
                      <div className="text-sm text-slate-400">
                        {chapter.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Your Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="reader@example.com"
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>

              {error && (
                <div className="text-red-400 text-sm">{error}</div>
              )}

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={subscribe.isLoading || !email || !selectedChapter}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {subscribe.isLoading ? 'Sending...' : 'Send My Free Chapter'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="border-slate-700 hover:bg-slate-800"
                >
                  Maybe Later
                </Button>
              </div>

              <p className="text-xs text-slate-500 text-center">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </form>
          </>
        )}
      </Card>
    </div>
  );
}
