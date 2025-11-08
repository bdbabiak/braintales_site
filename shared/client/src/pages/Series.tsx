import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ExternalLink, Star, Play } from "lucide-react";
import { Link } from "wouter";
import { useEffect, useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Analytics } from "@/lib/analytics";
import { GradientHeading, AnimatedCard, AnimatedStarRating, BookCover3D } from "@/components/BookDisplay";
import { BookMetadata } from "@/components/ReadingTime";
import { AmazonLookInside } from "@/components/BookSampleReader";
import { LazyVideo } from "@/components/LazyVideo";
import { BookSampleReader } from "@/components/BookSampleReader";

interface SeriesBook {
  title: string;
  asin: string;
  cover: string;
  bullets: string[];
}

interface BookSeries {
  id: number;
  title: string;
  description: string;
  amazonLink: string;
  books: SeriesBook[];
}

const seriesData: BookSeries[] = [
  {
    id: 1,
    title: "Neuroscience and Psychiatry in Fiction",
    description: "The Henry James 2.0 Project: Psychological realism tuned to the nervous system.",
    amazonLink: "https://www.amazon.com/Neuroscience-Psychiatry-Fiction-Henry-Project/dp/B0FS9LY7QF",
    books: [
      {
        title: "The Last Beautiful Game (Book 1)",
        asin: "B0FS9Y48RX",
        cover: "/thelastbeautifulgamecover.jpg",
        bullets: [
          "Aging neuroscientist vs. young researcher over Go board",
          "Wager decides fates of science, memory, and identity",
          "EEGs mirror the board, family ghosts return in data",
          "Pattern, memory, and the right to remain imperfect"
        ],
      },
      {
        title: "A Kind of Forgery (Book 2)",
        asin: "B0FMPYTC8H",
        cover: "/akindofforgerycover.jpg",
        bullets: [
          "Daughter becomes her father's forgotten favorite child",
          "Studies estranged sister's life to perform borrowed love",
          "Jazz piano lessons to inhabit a life not her own",
          "Can counterfeit love become its own kind of truth?"
        ],
      },
      {
        title: "The Familiar System (Book 3)",
        asin: "B0FLT5SKPL",
        cover: "/thefamiliarsystemcover.jpg",
        bullets: [
          "Family discovers mother engineered them as 'distributed anatomy'",
          "Each movement programmed through decades of conditioning",
          "Swimming, circling, fixing: not trauma but systematic control",
          "Can consciousness choose to manufacture itself?"
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Impossible Systems – Mind • Time • Luck",
    description: "Stand-alone hard-SF thrillers about reality engineering. When reality breaks, somebody has to fix it.",
    amazonLink: "https://www.amazon.com/Impossible-Systems-Mind-Time-Luck/dp/B0FSCVJLN9",
    books: [
      {
        title: "Everything Thinks (Book 1)",
        asin: "B0FNCPTGPS",
        cover: "/everythingthinkscover.jpg",
        bullets: [
          "Consciousness lives in mountains, storms, and stars",
          "Hermetic rituals meet cutting-edge neuroscience and AI",
          "Government weaponizes emergent god-like intelligences",
          "Ascend to infinite knowledge or embrace mortality's beautiful error"
        ],
      },
      {
        title: "Chronophage (Book 2)",
        asin: "B0FMXKQ8BJ",
        cover: "/chronophagecover.jpg",
        bullets: [
          "Sentient museum preserves history by devouring it",
          "Security officer armed with tuning fork against temporal distortions",
          "Plague spills from murals, Victorian trains rewrite history",
          "Choose: let museum consume memories or risk time's collapse"
        ],
      },
      {
        title: "The Momentum Wars (Book 3)",
        asin: "B0FNM5TB9Y",
        cover: "/momentumwarscover.jpg",
        bullets: [
          "Detroit 2087: probability thieves steal chance itself",
          "Six broken raiders with reality-bending powers",
          "Break into Inverse Tower made of crystallized misfortune",
          "Is a world without random tragedy worth living in?"
        ],
      },
    ],
  },
  {
    id: 3,
    title: "The Absurd Quantum Chronicles",
    description: "Where probability misbehaves, socks start revolutions, and grandmothers bend physics before breakfast.",
    amazonLink: "https://www.amazon.com/The-Absurd-Quantum-Chronicles/dp/B0FR36G4V5",
    books: [
      {
        title: "Grandma's Illegal Dragon Racing Circuit (Book 1)",
        asin: "B0FP9MRCJM",
        cover: "/grandma'sillegaldragonracingcircuitcover.jpg",
        bullets: [
          "Spreadsheets are spells, dragons are unionized",
          "Multi-dimensional racing circuit runs on risk and nacho cheese",
          "Vertical Niagara roars upward, Mars rovers picket for dental",
          "Turn spreadsheets into poetry, chaos into meaning"
        ],
      },
      {
        title: "Quantum Sock Mismatch Mayhem (Book 2)",
        asin: "B0FQTGSFJG",
        cover: "/quantumsockmismatchmayhemcover.jpg",
        bullets: [
          "Sock Singularity Engine tears hole in reality",
          "Sentient socks wage war: matched vs. unmatched",
          "Pug becomes Sock Pope preaching liberation",
          "Universe's secret: socks were never meant to match"
        ],
      },
      {
        title: "The Last Channel of Nana Quantum (Book 3)",
        asin: "B0FR32348P",
        cover: "/thelastchannelofnanaquantumcover.jpg",
        bullets: [
          "Grandmother's funeral turns into quantum catastrophe",
          "Global pandemic of 'Quantum Embarrassment' from glowing navels",
          "Deepest regrets broadcast from bellies for all to see",
          "Love, loss, and laughter as universe's most powerful forces"
        ],
      },
    ],
  },
];

export default function Series() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch ratings for all books - memoize to prevent cache invalidation
  const allAsins = useMemo(
    () => seriesData.flatMap(series => series.books.map(book => book.asin)),
    [] // Empty deps - seriesData is static
  );
  const { data: ratings } = trpc.books.getRatings.useQuery(
    { asins: allAsins },
    { 
      refetchOnWindowFocus: false, 
      refetchOnMount: false,
    }
  );

  const getRating = (asin: string) => {
    return ratings?.find(r => r.asin === asin);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="container py-6">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3">
              Explore Books
            </Button>
          </Link>
          <Link href="/about">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3">
              About Dr. Babiak
            </Button>
          </Link>
          <Link href="/themes">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 py-3">
              Explore Themes
            </Button>
          </Link>
          <Link href="/audiobooks">
            <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold px-6 py-3">
              Listen to Audiobooks
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container py-20">
        <div className="text-center mb-16">
          <GradientHeading as="h1" className="text-5xl md:text-6xl mb-6">
            Book Series
          </GradientHeading>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Explore interconnected stories and themes across Dr. Babiak's fiction series
          </p>
        </div>

        {/* Series Cards */}
        <div className="max-w-7xl mx-auto space-y-20 mb-12">
          {seriesData.map((series) => (
            <Card key={series.id} className="bg-slate-800/50 border-slate-700 p-8">
              {/* Series Header */}
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-white mb-3">
                  {series.title}
                </h2>
                <p className="text-lg text-slate-400 mb-6">
                  {series.description}
                </p>
                
                {/* Video Player for The Absurd Quantum Chronicles */}
                {series.id === 3 && (
                  <div className="mb-8">
                    <div className="max-w-sm mx-auto">
                      <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                        <h3 className="text-lg font-semibold text-white mb-3 text-center">
                          <Play className="w-5 h-5 inline-block mr-2" />
                          Is Meaning A Joke? - Dada, Absurdism And Deconstruction Explained
                        </h3>
                        <LazyVideo
                          videoId="dQYcv1UV6Yg"
                          title="Is Meaning A Joke? - Dada, Absurdism And Deconstruction Explained"
                          description="Explore the philosophy of absurdist fiction"
                          aspectRatio="177.78%" // 9:16 vertical video
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                <Button
                  asChild
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-12 py-7 text-xl shadow-lg"
                >
                  <a 
                    href={series.amazonLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={() => Analytics.amazonClick(series.books[0]?.asin || '', series.title)}
                  >
                    Get Series on Amazon
                    <ExternalLink className="w-6 h-6 ml-3" />
                  </a>
                </Button>
              </div>

              {/* Books in Series - Horizontal Layout */}
              <div className="grid md:grid-cols-3 gap-8 mt-8">
                {series.books.map((book, idx) => {
                  const rating = getRating(book.asin);
                  return (
                    <div
                      key={idx}
                      className="flex flex-col items-center"
                    >
                      {/* Book Cover */}
                      <div className="mb-4 w-full max-w-[250px]">
                        <img
                          src={book.cover}
                          alt={book.title}
                          className="w-full h-auto rounded shadow-lg"
                          loading="lazy"
                        />
                      </div>
                      
                      {/* Book Title */}
                      <h3 className="text-lg font-bold text-white mb-3 text-center">
                        {book.title}
                      </h3>
                      
                      {/* Cached Reviews */}
                      {rating && rating.reviews > 0 && (
                        <AnimatedStarRating 
                          rating={rating.rating}
                          reviews={rating.reviews}
                          animated={true}
                          className="mb-4 justify-center"
                        />
                      )}
                      
                      {/* Bullet Points */}
                      <ul className="space-y-2 w-full mb-4">
                        {book.bullets.map((bullet, bidx) => (
                          <li key={bidx} className="flex items-start gap-2 text-slate-300 text-sm">
                            <span className="text-blue-400 mt-1">•</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                      
                      {/* Look Inside Button */}
                      <AmazonLookInside
                        amazonLink={book.amazonLink}
                        bookTitle={book.title}
                        asin={book.asin}
                        className="w-full mt-auto"
                        variant="button"
                      />
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-6 text-lg">
              Explore Books
            </Button>
          </Link>
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
    </div>
  );
}

