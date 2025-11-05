// client/src/pages/Home.tsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { ExternalLink, Star, Menu, Share2, Play, Search } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { trpc } from "@/lib/trpc";
import { Analytics } from "@/lib/analytics";

interface Book {
  id: number;
  title: string;
  subtitle?: string;
  type?: string;
  cover: string;
  amazonLink: string;
  asin: string;
  videoId?: string;
  blurb: string[];
  featured?: boolean;
}

// === Your books (fixed: one array, not commented, no duplicate) ===
const books: Book[] = [
  {
    id: 1,
    title: "The ADHD Brain",
    subtitle:
      "An Immersive Journey Through Science, Struggle and Strength",
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
      "Connects science, struggle, and strength to help you understand, treat, and thrive",
    ],
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
      "A field manual for disciplined decisions under uncertainty",
    ],
  },
  {
    id: 3,
    title:
      "Epicurus 2.0",
    subtitle:
      "Why You Don't Matter (And Why That's The Best News You'll Get)",
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
      "The last self-help book you'll ever need",
    ],
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
      "A mind-bending journey through the corridors of power",
    ],
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
      "Funny, necessary, and defiantly optimistic",
    ],
  },
  {
    id: 6,
    title: "The Sight Eater",
    subtitle:
      "A Speculative Dark Comedy About Love, Bureaucracy, and the Logistics of Monstrosity",
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
      "Speculative horror that's hilarious and unexpectedly tender",
    ],
  },
];

export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Only one active trailer at a time
  const [activeVideoId, setActiveVideoId] = useState<number | null>(null);
  const toggleVideo = (bookId: number) =>
    setActiveVideoId((prev) => (prev === bookId ? null : bookId));

  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Ratings (memoized ASINs)
  const asins = useMemo(() => books.map((b) => b.asin), []);
  const { data: ratingsData } = trpc.books.getRatings.useQuery(
    { asins },
    { refetchOnWindowFocus: false, refetchOnMount: false }
  );
  const getRating = (asin: string) => ratingsData?.find((r) => r.asin === asin);

  const featuredBook = books.find((b) => b.featured);
  const regularBooks = books.filter((b) => !b.featured);

  const filteredBooks = useMemo(() => {
    if (!searchQuery.trim()) return regularBooks;
    const q = searchQuery.toLowerCase();
    return regularBooks.filter((b) => {
      const t = b.title.toLowerCase().includes(q);
      const s = (b.subtitle ?? "").toLowerCase().includes(q);
      const blurbs = b.blurb.some((x) => x.toLowerCase().includes(q));
      return t || s || blurbs;
    });
  }, [searchQuery, regularBooks]);

  const shareBook = (book: Book) => {
    try {
      navigator.clipboard.writeText(
        `Check out ${book.title} by Dr. Brian Dale Babiak! ${book.amazonLink}`
      );
      const toast = document.createElement("div");
      toast.textContent = "✓ Link copied! Paste in TikTok";
      toast.style.cssText =
        "position:fixed;bottom:20px;left:50%;transform:translateX(-50%);" +
        "background:#111;color:#fff;padding:12px 24px;border-radius:8px;z-index:9999;font-size:14px";
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2000);
    } catch {}
  };

  const renderBookCard = (book: Book, large = false) => {
    const rating = getRating(book.asin);
    const isActive = activeVideoId === book.id;

    return (
      <Card
        key={book.id}
        className={`bg-slate-800/50 border-slate-700 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 ${
          large ? "col-span-2" : ""
        }`}
      >
        <div className={`p-6 space-y-4 ${large ? "md:p-8" : ""}`}>
          {/* Cover or trailer */}
          <div className="relative aspect-[2/3] overflow-hidden rounded-lg group">
            {isActive && book.videoId ? (
              <iframe
                key={book.videoId}
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
                  alt={`${book.title} cover`}
                  className="w-full h-full object-cover rounded-lg group-hover:opacity-90 transition-opacity"
                />
                {book.videoId && (
                  <button
                    type="button"
                    aria-label="Play trailer"
                    onClick={() => toggleVideo(book.id)}
                    className="absolute inset-0 grid place-content-center bg-black/0 hover:bg-black/20 transition-colors"
                  >
                    <div className="p-3 rounded-full bg-white/90 text-black shadow-lg">
                      <Play className="w-6 h-6" />
                    </div>
                  </button>
                )}
              </>
            )}
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2">
            {book.videoId && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleVideo(book.id)}
                className="w-full bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-slate-200"
              >
                {isActive ? "Show Cover" : "Watch Video"}
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => shareBook(book)}
              className="w-full bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-slate-200"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <a
              href={book.amazonLink}
              target="_blank"
              rel="noreferrer"
              onClick={() => Analytics.amazonClick(book.asin, book.title)}
              className="col-span-2"
            >
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <ExternalLink className="w-4 h-4 mr-2" />
                View on Amazon
              </Button>
            </a>
          </div>

          {/* Info */}
          <div className="space-y-2">
            <h3
              className={`font-bold text-white leading-tight ${
                large ? "text-3xl" : "text-2xl"
              }`}
            >
              {book.title}
            </h3>
            {book.subtitle && (
              <p className="text-sm text-slate-400 leading-snug">
                {book.subtitle}
              </p>
            )}
            {book.type && (
              <p className="text-xs uppercase tracking-wide text-slate-500">
                {book.type}
              </p>
            )}
            {rating && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-yellow-500 font-semibold">
                    {rating.rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-slate-400 text-sm">
                  ({rating.reviews} reviews)
                </span>
              </div>
            )}
          </div>

          {/* Blurb */}
          <ul className="space-y-2">
            {book.blurb.map((point, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-slate-300 text-sm"
              >
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-500" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6">
      {/* Top bar */}
      <div className="flex items-center justify-between py-4">
        <button
          className="p-2 text-slate-300 hover:text-white md:hidden"
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link href="/">
          <a className="text-white font-bold text-lg">Braintales</a>
        </Link>

        <div className="hidden md:block">
          <Link href="/series">
            <a className="text-slate-300 hover:text-white">Series</a>
          </Link>
          <span className="mx-3 text-slate-600">•</span>
          <Link href="/audiobooks">
            <a className="text-slate-300 hover:text-white">Audiobooks</a>
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="my-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search titles, taglines, or blurbs…"
            className="pl-9 bg-slate-900/60 border-slate-700 text-slate-100 placeholder:text-slate-500"
          />
        </div>
        {searchQuery && (
          <div className="text-right">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery("")}
              className="mt-4 bg-slate-800/50 border-slate-700 text-slate-200 hover:bg-slate-700"
            >
              Clear Search
            </Button>
          </div>
        )}
      </div>

      {/* Featured (if any) */}
      {featuredBook && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {renderBookCard(featuredBook, true)}
        </div>
      )}

      {/* Grid of regular books */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredBooks.map((b) => renderBookCard(b))}
      </div>

      {/* View all on Amazon */}
      <div className="text-center mt-12 mb-8">
        <a
          href="https://www.amazon.com/author/briandalebabiak"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-slate-300 hover:text-white"
        >
          <ExternalLink className="w-4 h-4" />
          See all books on Amazon
        </a>
      </div>
    </div>
  );
}
