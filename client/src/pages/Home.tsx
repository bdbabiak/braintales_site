import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ExternalLink, Play, Search, Star, Menu, Share2 } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { BookCover3D, AnimatedStarRating, GradientHeading, AnimatedCard } from "@/components/BookDisplay";
import { BookMetadata } from "@/components/ReadingTime";
import { StickyBuyBar } from "@/components/StickyBuyBar";

interface Book {
  id: number;
  title: string;
  subtitle: string;
  cover: string;
  type: "Fiction" | "Non-Fiction";
  amazonLink: string;
  asin: string;
  blurb: string[];
  videoId?: string;
  featured?: boolean;
}

const books: Book[] = [
  {
    id: 1,
    title: "The ADHD Brain",
    subtitle: "An Immersive Journey Through Science, Struggle and Strength",
    cover: "/adhdbrainkindlecover.jpg",
    type: "Non-Fiction",
    amazonLink: "https://www.amazon.com/dp/B0FWTY1VVS",
    asin: "B0FWTY1VVS",
    videoId: "a06lqBas4gE",
    featured: true,
    blurb: [
      "A clinician-led guide grounded in neuroscience and real-world experience",
      "Explains how ADHD unfolds across the lifespan—adults, women, late diagnosis",
      "Covers diagnosis, treatment options from medication to lifestyle strategies",
      "Deep dives into hormones, sleep, time management, work, relationships",
      "Connects science, struggle, and strength to help you understand, treat, and thrive"
    ]
  },
  {
    id: 2,
    title: "Trading Psychology & Neuroscience",
    subtitle: "The Rational Mind in an Irrational Market",
    cover: "/tradingpsychology&neurosciencecoverkindle.png",
    type: "Non-Fiction",
    amazonLink: "https://www.amazon.com/dp/B0FXT51Y14",
    asin: "B0FXT51Y14",
    videoId: "gxYWIPMO1aQ",
    blurb: [
      "Behavioral finance fused with neuroscience for traders",
      "Clinical protocols for emotion regulation and trader mindset",
      "HRV training, biofeedback, coherence breathing techniques",
      "Neutralize cognitive biases: loss aversion, FOMO, revenge trading",
      "A field manual for disciplined decisions under uncertainty"
    ]
  },
  {
    id: 3,
    title: "Epicurus 2.0",
    subtitle: "Why You Don't Matter (And Why That's The Best News You'll Get)",
    cover: "/epicurus2.0cover.jpg",
    type: "Non-Fiction",
    amazonLink: "https://www.amazon.com/dp/B0FVF3ZRJQ",
    asin: "B0FVF3ZRJQ",
    videoId: "6TkwcTsbonI",
    blurb: [
      "Ancient Epicurean philosophy meets modern neuroscience",
      "Freedom from realizing you don't have a fixed 'self' to perfect",
      "Science-backed protocols: Capability Reframing, Metric Fasting, 5-4-3-2-1 Audit",
      "Buddhism for skeptics—enlightenment without mysticism",
      "The last self-help book you'll ever need"
    ]
  },
  {
    id: 4,
    title: "The Doubles",
    subtitle: "Ghosts of the Podium",
    cover: "/thedoubles-ghostsofthepodiumaudiblecover.jpg",
    type: "Fiction",
    amazonLink: "https://www.amazon.com/dp/B0FSSW9XGX",
    asin: "B0FSSW9XGX",
    videoId: "HX76hcX2JJs",
    blurb: [
      "Political intrigue meets psychological thriller",
      "When body doubles become more real than their originals",
      "A gripping tale of identity, power, and deception",
      "Explores the blurred lines between authenticity and performance",
      "A mind-bending journey through the corridors of power"
    ]
  },
  {
    id: 5,
    title: "Grandma's Illegal Dragon Racing Circuit",
    subtitle: "",
    cover: "/grandma'sillegaldragonracingcircuitaudiblecover.png",
    type: "Fiction",
    amazonLink: "https://www.amazon.com/dp/B0FP9MRCJM",
    asin: "B0FP9MRCJM",
    videoId: "MmznNdNQIFs",
    blurb: [
      "Absurdist sci-fi satire where no one is expendable",
      "Your weirdness is your value—resistance wrapped in laughter",
      "Kurt Vonnegut meets Terry Pratchett in this cosmic comedy",
      "Dragons, spreadsheets, and cosmic nachos collide",
      "Funny, necessary, and defiantly optimistic"
    ]
  },
  {
    id: 6,
    title: "The Sight Eater",
    subtitle: "A Speculative Dark Comedy About Love, Bureaucracy, and the Logistics of Monstrosity",
    cover: "/the_sight_eater_book_cover.jpg",
    type: "Fiction",
    amazonLink: "https://www.amazon.com/dp/B0FN3M4DFZ",
    asin: "B0FN3M4DFZ",
    videoId: "rgL0ugCablw",
    blurb: [
      "A blind woman sees by eating eyes; a man grows them—love blooms in the grotesque",
      "Body horror meets tender romance in near-future Warsaw",
      "When love becomes regulated, intimacy becomes rebellion",
      "Kafka meets Cronenberg in this daring genre-defying masterpiece",
      "For fans of VanderMeer, Moshfegh—speculative horror that's hilarious and unexpectedly tender"
    ]
  }
];

export default function Home() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // CHANGED: single active trailer at a time
  const [activeVideoId, setActiveVideoId] = useState<number | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch ratings for all books - memoize to prevent cache invalidation
  const asins = useMemo(() => books.map(book => book.asin), []);
  const { data: ratingsData } = trpc.books.getRatings.useQuery(
    { asins },
    { 
      refetchOnWindowFocus: false, 
      refetchOnMount: false,
      staleTime: 6 * 60 * 60 * 1000, // 6 hours - matches backend cache
    }
  );

  // CHANGED: toggles single active id
  const toggleVideo = (bookId: number) => {
    setActiveVideoId(prev => (prev === bookId ? null : bookId));
  };

  const featuredBook = books.find(book => book.featured);
  const regularBooks = books.filter(book => !book.featured);

  // Filter books based on search query
  const filteredBooks = useMemo(() => {
    if (!searchQuery.trim()) return regularBooks;
    
    const query = searchQuery.toLowerCase();
    return regularBooks.filter(book => {
      const titleMatch = book.title.toLowerCase().includes(query);
      const subtitleMatch = book.subtitle.toLowerCase().includes(query);
      const typeMatch = book.type.toLowerCase().includes(query);
      const blurbMatch = book.blurb.some(point => point.toLowerCase().includes(query));
      
      return titleMatch || subtitleMatch || typeMatch || blurbMatch;
    });
  }, [searchQuery, regularBooks]);

  const BookCard = ({ book, large = false }: { book: Book; large?: boolean }) => {
    const rating = ratingsData?.find((r: { asin: string; rating: number; reviews: number }) => r.asin === book.asin);
    
    return (
      <Card
        className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20"
      >
        <div className={`p-6 space-y-4 ${large ? 'md:p-8' : ''}`}>
          {/* Book Cover or Video */}
          <div className="relative aspect-[2/3] overflow-hidden rounded-lg group">
            {activeVideoId === book.id && book.videoId ? (
              <iframe
                key={book.videoId} // ensure previous iframe unmounts (stops playback)
                src={`https://www.youtube.com/embed/${book.videoId}?autoplay=1`}
                title={book.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <>
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
                {book.videoId && (
                  <button
                    onClick={() => toggleVideo(book.id)}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <div className="bg-blue-600 rounded-full p-4 hover:bg-blue-700 transition-colors">
                      <Play className="w-8 h-8 text-white fill-white" />
                    </div>
                  </button>
                )}
              </>
            )}
            <div className="absolute top-2 right-2">
              <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
                {book.type}
              </span>
            </div>
            {book.featured && (
              <div className="absolute top-2 left-2">
                <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                  Featured
                </span>
              </div>
            )}
          </div>

          {/* Video Toggle Button */}
          {book.videoId && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleVideo(book.id)}
              className="w-full bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-slate-200"
            >
              {activeVideoId === book.id ? "Show Cover" : "Watch Video"}
            </Button>
          )}

          {/* Book Info */}
          <div className="space-y-2">
            <h3 className={`font-bold text-white leading-tight ${large ? 'text-3xl' : 'text-2xl'}`}>
              {book.title}
            </h3>
            {book.subtitle && (
              <p className="text-sm text-slate-400 leading-snug">
                {book.subtitle}
              </p>
            )}
            {/* Animated Rating */}
            {rating && (
              <AnimatedStarRating 
                rating={rating.rating}
                reviews={rating.reviews}
                animated={true}
              />
            )}
            {/* Book Metadata */}
            <BookMetadata asin={book.asin} showAll={false} />
          </div>

          {/* Blurb */}
          <ul className="space-y-2">
            {book.blurb.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2 text-slate-300 text-sm">
                <span className="text-blue-400 mt-1">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>

          {/* Social Share Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-400 text-sm flex items-center gap-1">
              <Share2 className="w-4 h-4" />
              Share:
            </span>
            {/* TikTok */}
            <Button
              size="sm"
              variant="outline"
              className="bg-slate-700/50 border-slate-600 hover:bg-black hover:border-black text-slate-200"
              onClick={() => {
                navigator.clipboard.writeText(`Check out ${book.title} by Dr. Brian Dale Babiak! ${book.amazonLink}`);
                const toast = document.createElement('div');
                toast.textContent = '✓ Link copied! Paste in TikTok';
                toast.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#000;color:#fff;padding:12px 24px;border-radius:8px;z-index:9999;font-size:14px';
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 2000);
              }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </Button>
            {/* X (Twitter) */}
            <Button
              size="sm"
              variant="outline"
              className="bg-slate-700/50 border-slate-600 hover:bg-slate-600 hover:border-slate-500 text-slate-200"
              onClick={() => {
                const shareUrl = `https://twitter.com/intent/tweet?text=Check%20out%20${encodeURIComponent(book.title)}%20by%20Dr.%20Brian%20Dale%20Babiak&url=${encodeURIComponent(book.amazonLink)}`;
                window.open(shareUrl, '_blank', 'width=600,height=400');
              }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </Button>
            {/* Facebook */}
            <Button
              size="sm"
              variant="outline"
              className="bg-slate-700/50 border-slate-600 hover:bg-blue-700 hover:border-blue-700 text-slate-200"
              onClick={() => {
                const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(book.amazonLink)}`;
                window.open(shareUrl, '_blank', 'width=600,height=400');
              }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </Button>
            {/* LinkedIn */}
            <Button
              size="sm"
              variant="outline"
              className="bg-slate-700/50 border-slate-600 hover:bg-blue-800 hover:border-blue-800 text-slate-200"
              onClick={() => {
                const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(book.amazonLink)}`;
                window.open(shareUrl, '_blank', 'width=600,height=400');
              }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </Button>
            {/* Bluesky */}
            <Button
              size="sm"
              variant="outline"
              className="bg-slate-700/50 border-slate-600 hover:bg-sky-600 hover:border-sky-600 text-slate-200"
              onClick={() => {
                const shareText = `Check out ${book.title} by Dr. Brian Dale Babiak! ${book.amazonLink}`;
                const shareUrl = `https://bsky.app/intent/compose?text=${encodeURIComponent(shareText)}`;
                window.open(shareUrl, '_blank', 'width=600,height=400');
              }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8z"/>
              </svg>
            </Button>
          </div>

          {/* Amazon Button */}
          <Button
            asChild
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
          >
            <a
              href={book.amazonLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              Get on Amazon
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="container py-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-white text-center md:text-left">Dr. Brian Dale Babiak</h1>
          
          {/* Navigation Buttons - Always Visible */}
          <div className="flex flex-col md:flex-row gap-3 md:justify-end flex-wrap">
            <Link href="/about">
              <Button className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 shadow-lg shadow-blue-500/30">
                About Dr. Babiak
              </Button>
            </Link>
            <Link href="/themes">
              <Button className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 shadow-lg shadow-purple-500/30">
                Explore Themes
              </Button>
            </Link>
            <Link href="/series">
              <Button className="w-full md:w-auto bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold px-6 shadow-lg shadow-green-500/30">
                Series
              </Button>
            </Link>
            <Link href="/audiobooks">
              <Button className="w-full md:w-auto bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold px-6 shadow-lg shadow-orange-500/30">
                Audiobooks
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 space-y-6">
            <GradientHeading as="h2" className="text-5xl md:text-7xl leading-tight">
              Dr. Brian Dale Babiak
            </GradientHeading>
            <p className="text-xl md:text-2xl text-slate-300 leading-relaxed">
              Physician, Author, Explorer of the Human Mind
            </p>
            <p className="text-lg text-slate-400 leading-relaxed">
              From neuroscience to fiction, discover books that challenge conventional thinking
              and illuminate the complexities of human consciousness, behavior, and imagination.
            </p>
          </div>
          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-3xl opacity-30"></div>
              <img
                src="/docauthorpic.png"
                alt="Dr. Brian Dale Babiak"
                className="relative rounded-full w-80 h-80 object-cover border-4 border-slate-700 shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Book Section */}
      {featuredBook && (
        <section className="container py-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Featured Book
            </h2>
            <p className="text-lg text-slate-400">
              Highly recommended by readers
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <BookCard book={featuredBook} large={true} />
          </div>
        </section>
      )}

      {/* All Books Section */}
      <section className="container py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Top Books
          </h2>
          <p className="text-xl text-slate-400 mb-8">
            Bestselling titles from Dr. Brian Dale Babiak
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search books by title or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            {searchQuery && (
              <p className="text-sm text-slate-400 mt-2">
                {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'} found
              </p>
            )}
          </div>
        </div>

        {/* Book Cards Grid */}
        <div className="relative max-w-6xl mx-auto">
          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-slate-400">
                No books found matching "{searchQuery}"
              </p>
              <Button
                variant="outline"
                onClick={() => setSearchQuery("")}
                className="mt-4 bg-slate-800/50 border-slate-700 text-slate-200 hover:bg-slate-700"
              >
                Clear Search
              </Button>
            </div>
          )}
        </div>
        
        {/* View All Books Link */}
        <div className="text-center mt-12 mb-8">
          <a
            href="https://www.amazon.com/author/babiak"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-lg text-blue-400 hover:text-blue-300 transition-colors"
          >
            View All Books on Amazon
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>

        {/* Bottom Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-12">
          <Link href="/about">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-6 text-lg">
              About Dr. Babiak
            </Button>
          </Link>
          <Link href="/themes">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-6 text-lg">
              Explore Themes
            </Button>
          </Link>
          <Link href="/series">
            <Button className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold px-8 py-6 text-lg">
              View Series
            </Button>
          </Link>
          <Link href="/audiobooks">
            <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold px-8 py-6 text-lg">
              Listen to Audiobooks
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container py-12 border-t border-slate-800">
        <div className="text-center text-slate-400">
          <p className="text-sm">
            © {new Date().getFullYear()} Dr. Brian Dale Babiak. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Sticky Buy Bar for Featured Book */}
      {featuredBook && (
        <StickyBuyBar 
          currentBook={{
            title: featuredBook.title,
            subtitle: featuredBook.subtitle,
            amazonLink: featuredBook.amazonLink,
            asin: featuredBook.asin
          }}
          threshold={600}
        />
      )}
    </div>
  );
}
