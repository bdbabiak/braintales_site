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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BookOpen, X, ChevronRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

// Book samples - you can expand these with actual excerpts
const BOOK_SAMPLES: Record<string, { title: string; excerpt: string }> = {
  'B0FWTY1VVS': {
    title: 'The ADHD Brain',
    excerpt: `Chapter 1: Understanding the ADHD Mind

The ADHD brain is not broken—it's different. Like a Ferrari engine in a go-kart frame, it possesses tremendous power that often overwhelms its steering and braking systems. This fundamental mismatch between processing speed and executive control creates the daily challenges millions face.

Consider Sarah, a 34-year-old marketing executive who can devise brilliant campaigns in minutes but loses her car keys daily. Or Marcus, a teenager who absorbs complex physics concepts instantly yet cannot remember to turn in his homework. These aren't character flaws or intelligence deficits—they're manifestations of a neurological variation that affects 5-10% of the population.

The prefrontal cortex, our brain's CEO, operates differently in ADHD. Dopamine and norepinephrine, the neurotransmitters responsible for focus and impulse control, follow alternative patterns. Imagine a city where the traffic lights change at random intervals—that's the ADHD brain navigating daily life.

But here's what most people don't understand: this difference can be a superpower. The same brain that struggles with routine tasks excels at crisis management, creative problem-solving, and hyperfocus states that produce extraordinary results...`
  },
  'B0FXT51Y14': {
    title: 'Trading Psychology & Neuroscience',
    excerpt: `Introduction: Your Brain on the Markets

Every trader has two opponents: the market and their own mind. While you can't control the market, you can master your psychology—and neuroscience shows us how.

The amygdala, your brain's alarm system, fires 12 milliseconds before your conscious mind even registers a price movement. By the time you "decide" to panic sell, your primitive brain has already flooded your system with cortisol and adrenaline. This is why discipline alone fails: you're fighting biology with willpower, and biology usually wins.

But what if you could hack this system? What if you could train your neural pathways to respond to market volatility with the same calm a surgeon brings to the operating room?

This book merges cutting-edge neuroscience with practical trading strategies. You'll learn why loss aversion is literally wired into your brain (the pain of loss activates the same regions as physical pain), why revenge trading is a dopamine addiction cycle, and most importantly, how to rewire these patterns.

Through techniques borrowed from clinical psychology—cognitive behavioral therapy, mindfulness-based stress reduction, and biofeedback training—you'll develop what I call "neurological edge": the ability to maintain emotional equilibrium while others succumb to fear and greed...`
  },
  'B0FNCPTGPS': {
    title: 'Everything Thinks',
    excerpt: `Prologue: The Berkeley Incident

Dr. Elena Vasquez first noticed the anomaly at 3:47 AM on a Tuesday. The magnetometer in her Berkeley lab had been recording baseline readings of the granite formations beneath Mount Tamalpais for six months. Boring work, the kind given to postdocs who hadn't yet proven themselves worthy of real research.

But that night, the readings formed a pattern. Not random fluctuations or equipment malfunction—a pattern that looked suspiciously like the neural oscillations she'd studied in her previous life as a neuroscientist.

The mountain was thinking.

Not thinking like you or I think, with words and images and the endless chatter of consciousness. This was something older, deeper—thought without thought, awareness without self. The granite itself, two billion years old, was processing information in ways that shouldn't be possible.

Elena ran the data through every filter, checked every connection, recalibrated every sensor. The pattern remained. More disturbing: when she graphed the oscillations over time, they responded to her presence. The mountain knew she was watching.

She should have reported it immediately. Should have called her supervisor, alerted the department, followed protocol. Instead, she did what any curious scientist would do: she talked back...`
  },
  'B0FN3M4DFZ': {
    title: 'The Sight Eater',
    excerpt: `Chapter 1: Procurement

Justyna's spreadsheet had sixty-three columns and four thousand rows, each cell color-coded according to a system she'd refined over three years of eating human eyes. Column A: procurement date. Column B: donor age. Column C: cause of death (when available). Column D: preservation method.

She clicked "Sort by Freshness" and sighed. The supply was running low again.

It wasn't the eating that bothered her—she'd made peace with that necessity years ago. It was the logistics. The careful negotiations with morgue attendants. The bitcoin transfers. The refrigerated shipping containers marked "Medical Specimens." The endless paperwork that came with being a functional monster in a bureaucratic world.

Her phone buzzed. New message from Derek at the county hospital: "Package available. Motorcycle accident. Young. Fresh."

Justyna's dead eyes—her original ones, still technically in their sockets but useless as stones—turned toward the sound. The borrowed eyes she'd eaten last week were already beginning to cloud. She had maybe three days of sight left, four if she was careful.

She opened a new row in the spreadsheet: #4001.

The doorbell rang.

That was impossible. She lived seventeen miles from the nearest neighbor, at the end of a dirt road that Google Maps didn't even know existed. No one rang her doorbell.

She minimized Excel and opened her security camera app. A man stood on her porch, tall and thin, wearing a rumpled suit. He was looking directly at the camera.

He had too many eyes...`
  },
  'B0FP9MRCJM': {
    title: "Grandma's Illegal Dragon Racing Circuit",
    excerpt: `Chapter 1: The Actuarial Wizard

My grandmother ran an illegal dragon racing circuit out of her garage, and she'd just asked me to be her CFO.

"It's simple," Nana said, spreading blueprints across her kitchen table. They showed what looked like NASCAR tracks drawn by M.C. Escher during a fever dream. "We race dragons through eleven dimensions, taking bets in currencies that don't technically exist yet. The house takes 15%, except on Tuesdays when we run the loops backward through time."

I stared at the blueprints. A section labeled "Probability Manifold" seemed to be moving. "Nana, I'm an actuarial analyst. I calculate insurance premiums for a living."

"Exactly!" She beamed. "Do you know how hard it is to find someone who can calculate the odds of a dragon having an existential crisis mid-race? That happened last week. Cornelius—that's Mrs. Chen's dragon—suddenly realized he was finite in an infinite universe and just stopped flying. Hung there in Dimension Seven like a scaly balloon full of weltschmerz."

"Dragons have existential crises?"

"Only the smart ones. That's why we started adding philosophy courses to their training regimen. Can't have them discovering nihilism at Mach 3."

She pulled out another paper. This one was definitely moving. The numbers on it kept changing, calculating themselves. "This is our P&L statement. As you can see, we're profitable in six dimensions, breaking even in three, and taking massive losses in two."

"How can you take losses in specific dimensions?"

"Dimension Nine has brutal tax laws. Dimension Eleven doesn't technically believe in money, so everything there is bartered through interpretive dance..."

I looked at my 88-year-old grandmother, who was wearing a cardigan with "DRAGON MAMA" bedazzled across the front, and realized my life as a boring insurance analyst had just ended...`
  }
};

interface BookSampleReaderProps {
  bookAsin: string;
  bookTitle?: string;
  className?: string;
}

export const BookSampleReader: React.FC<BookSampleReaderProps> = ({ 
  bookAsin, 
  bookTitle,
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const sample = BOOK_SAMPLES[bookAsin];

  if (!sample) {
    return null; // No sample available for this book
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className={`border-slate-600 hover:bg-slate-700 ${className}`}
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Read Sample
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center justify-between">
            <span>{sample.title || bookTitle}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-slate-200 leading-relaxed">
              {sample.excerpt}
            </div>
          </div>
        </ScrollArea>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700">
          <p className="text-sm text-slate-400">
            This is a sample from "{sample.title}"
          </p>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            onClick={() => {
              // Could link to Amazon here
              setIsOpen(false);
            }}
          >
            Get Full Book
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookSampleReader;
