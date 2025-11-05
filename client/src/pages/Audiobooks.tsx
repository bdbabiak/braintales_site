import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ExternalLink, Headphones, Star } from "lucide-react";
import { Link } from "wouter";
import { useEffect, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Analytics } from "@/lib/analytics";

interface Audiobook {
  id: number;
  title: string;
  tagline: string;
  blurb: string[];
  audibleLink: string;
  asin: string;
  cinematicImage: string;
  coverImage: string;
  comingSoon?: boolean;
}

const audiobooks: Audiobook[] = [
  {
    id: 1,
    title: "The Momentum Wars",
    tagline: "Steal back luck itself from a world drained of chance",
    blurb: [
      "Detroit 2087: probability thieves must steal chance from a man who eliminated uncertainty",
      "Heist thriller meets philosophical adventure about random joy versus controlled safety",
      "Six broken raiders with reality-bending powers face the Inverse Tower",
      "Ocean's Eleven meets Cloud Atlas in a story about the jazz of the universe",
      "Why uncertainty is the engine of hope"
    ],
    audibleLink: "https://www.amazon.com/Audible-The-Momentum-Wars/dp/B0FNM5TB9Y",
    asin: "B0FNM5TB9Y",
    cinematicImage: "/momentumwarsaudiobookimage.png",
    coverImage: "/momentumwarscover.jpg",
  },
  {
    id: 2,
    title: "Everything Thinks",
    tagline: "What if consciousness lives in mountains, storms, and stars?",
    blurb: [
      "Berkeley researcher discovers awareness in ancient rock formations and weather systems",
      "Forbidden Hermetic rituals meet cutting-edge neuroscience and AI",
      "Government forces weaponize emergent god-like intelligences",
      "Ascend to infinite knowledge or embrace the beautiful error of mortality",
      "Perfect for fans of Ted Chiang and Jeff VanderMeer"
    ],
    audibleLink: "https://www.amazon.com/Audible-Everything-Thinks/dp/B0FNCPTGPS",
    asin: "B0FNCPTGPS",
    cinematicImage: "/everythingthinksaudiobookimage.png",
    coverImage: "/everythingthinkscover.jpg",
  },
  {
    id: 3,
    title: "The Sight Eater",
    tagline: "Love, bureaucracy, and the logistics of monstrosity",
    blurb: [
      "Justyna regains sight by consuming human eyes—then opens a spreadsheet",
      "Meets Tomasz, a gentle teacher who uncontrollably grows extra eyes",
      "Practical partnership becomes tender, darkly funny romance",
      "Department of Genetic Anomalies mandates 30-day abstinence challenge",
      "Kafka meets Cronenberg: body horror becomes bureaucracy, romance becomes rebellion"
    ],
    audibleLink: "https://www.amazon.com/Audible-The-Sight-Eater/dp/B0FN3M4DFZ",
    asin: "B0FN3M4DFZ",
    cinematicImage: "/sighteateraudiobookimage.png",
    coverImage: "/sighteatercover.jpg",
  },
  {
    id: 4,
    title: "The Familiar System",
    tagline: "The body keeps the score. This family keeps the script.",
    blurb: [
      "Four survivors discover their mother engineered them as a 'distributed anatomy'",
      "Each movement programmed through decades of behavioral conditioning",
      "Swimming, circling, fixing, recording: not trauma but systematic control",
      "Programming persists after the controller is gone",
      "Can consciousness choose to manufacture itself against all programming?"
    ],
    audibleLink: "https://www.amazon.com/Audible-The-Familiar-System/dp/B0FLT5SKPL",
    asin: "B0FLT5SKPL",
    cinematicImage: "/thefamiliarsystemaudiobookimage.png",
    coverImage: "/thefamiliarsystemcover.jpg",
  },
  {
    id: 5,
    title: "Chronophage",
    tagline: "In the last museum on Earth, the exhibits are hungry",
    blurb: [
      "A sentient museum preserves history by devouring it",
      "Security Officer Faye armed with a tuning fork against temporal distortions",
      "Fourteenth-century plague spills from murals, Victorian trains rewrite history",
      "Museum's immune system sees humans as part of the infection",
      "Choose: let the museum consume your memories or risk time's collapse"
    ],
    audibleLink: "https://www.amazon.com/Audible-Chronophage/dp/B0FMXKQ8BJ",
    asin: "B0FMXKQ8BJ",
    cinematicImage: "/chronophageaudiobookimage.png",
    coverImage: "/chronophagecover.jpg",
  },
];

const comingSoonAudiobooks = [
  "Grandma's Illegal Dragon Racing Circuit",
  "A Kind of Forgery",
  "Quantum Sock Mismatch Mayhem",
  "The Last Channel of Nana Quantum",
];

export default function Audiobooks() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch ratings for all audiobooks - memoize to prevent cache invalidation
  const asins = useMemo(() => audiobooks.map(book => book.asin), []);
  const { data: ratings } = trpc.books.getRatings.useQuery(
    { asins },
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
          <Link href="/series">
            <Button className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold px-6 py-3">
              View Series
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section with Video */}
      <section className="container py-20">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Headphones className="w-12 h-12 text-blue-400" />
            <h1 className="text-5xl md:text-6xl font-bold text-white">
              Audiobooks
            </h1>
          </div>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-8">
            Immerse yourself in Dr. Babiak's stories, narrated by professional voice actors
          </p>

          {/* Welcome Video */}
          <div className="max-w-2xl mx-auto mb-8">
            <Card className="bg-slate-800/50 border-slate-700 p-4">
              <video
                autoPlay
                muted
                loop
                controls
                className="w-full rounded-lg"
              >
                <source src="/videoofmewavingandsmilingatviewer.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <p className="text-slate-400 text-sm mt-4">
                A personal welcome from Dr. Babiak
              </p>
            </Card>
          </div>

          {/* Platform Availability */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <span className="text-slate-400">Available on</span>
            <span className="text-white font-semibold">Audible • Spotify • Chirp • Apple Books</span>
          </div>
        </div>

        {/* Available Now Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Available Now
          </h2>
          <div className="space-y-12 max-w-6xl mx-auto">
            {audiobooks.map((book) => {
              const rating = getRating(book.asin);
              return (
                <Card key={book.id} className="bg-slate-800/50 border-slate-700 overflow-hidden">
                  <div className="grid md:grid-cols-2 gap-6 p-6">
                    {/* Left: Cinematic Image with Cover Overlay */}
                    <div className="relative aspect-video overflow-hidden rounded-lg">
                      <img
                        src={book.cinematicImage}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                      {/* Cover Overlay in Lower Right */}
                      <div className="absolute bottom-4 right-4 w-24 h-32 shadow-2xl">
                        <img
                          src={book.coverImage}
                          alt={`${book.title} cover`}
                          className="w-full h-full object-cover rounded border-2 border-white"
                        />
                      </div>
                    </div>

                    {/* Right: Book Info */}
                    <div className="flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="text-3xl font-bold text-white mb-2">
                          {book.title}
                        </h3>
                        <p className="text-lg text-blue-400 italic mb-4">
                          {book.tagline}
                        </p>

                        {/* Rating */}
                        {rating && rating.reviews > 0 && (
                          <div className="flex items-center gap-2 mb-4">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              <span className="text-yellow-500 font-semibold">{rating.rating.toFixed(1)}</span>
                            </div>
                            <span className="text-slate-400 text-sm">({rating.reviews} reviews)</span>
                          </div>
                        )}

                        {/* Blurb */}
                        <ul className="space-y-2">
                          {book.blurb.map((point, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-slate-300 text-sm">
                              <span className="text-blue-400 mt-1">•</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Listen Button */}
                      <Button
                        asChild
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
                      >
                        <a 
                          href={book.audibleLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={() => {
                            Analytics.audibleClick(book.asin, book.title);
                            Analytics.amazonClick(book.asin, book.title);
                          }}
                        >
                          <Headphones className="w-4 h-4 mr-2" />
                          Listen on Audible
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700 p-8">
            <h2 className="text-3xl font-bold text-white text-center mb-4">
              Coming Soon
            </h2>
            <p className="text-slate-400 text-center mb-6">
              Releasing in approximately 2 weeks, pending final approval from Audible
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {comingSoonAudiobooks.map((title, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-4 bg-slate-900/50 rounded-lg border border-slate-700"
                >
                  <Headphones className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <span className="text-white font-medium">{title}</span>
                </div>
              ))}
            </div>
          </Card>
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
          <Link href="/series">
            <Button className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold px-8 py-6 text-lg">
              View Series
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

