import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, Brain, Heart, Lightbulb, Scale, Sparkles, Users } from "lucide-react";
import { useEffect } from "react";

interface Theme {
  icon: React.ReactNode;
  title: string;
  description: string;
  books: string[];
}

const themes: Theme[] = [
  {
    icon: <Brain className="w-8 h-8" />,
    title: "Neuroscience & The Brain",
    description: "Exploring the biological foundations of thought, behavior, and mental health through cutting-edge brain science.",
    books: ["The ADHD Brain", "Trading Psychology & Neuroscience", "Epicurus 2.0", "Everything Thinks", "The Last Beautiful Game"]
  },
  {
    icon: <Lightbulb className="w-8 h-8" />,
    title: "Identity & Self",
    description: "Questioning who we are, what makes us authentic, and whether the 'self' is fixed or fluid.",
    books: ["Epicurus 2.0", "The Doubles", "The Sight Eater", "The Familiar System", "A Kind of Forgery"]
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Love & Connection",
    description: "Examining intimacy, need, and what it means to love freely in a world that seeks to control.",
    books: ["The Sight Eater", "Epicurus 2.0", "A Kind of Forgery", "The Last Beautiful Game"]
  },
  {
    icon: <Scale className="w-8 h-8" />,
    title: "Control & Freedom",
    description: "The tension between systems of power and individual autonomy—from bureaucracy to markets to the state.",
    books: ["The Sight Eater", "Trading Psychology & Neuroscience", "The Doubles", "The Momentum Wars", "The Familiar System"]
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Marginalization & Value",
    description: "Stories of those deemed 'glitches' or 'errors' by society, and the radical act of claiming your worth.",
    books: ["Grandma's Illegal Dragon Racing Circuit", "The ADHD Brain", "The Sight Eater", "Quantum Sock Mismatch Mayhem", "The Last Channel of Nana Quantum"]
  },
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: "The Absurd & The Grotesque",
    description: "Finding humor, meaning, and humanity in the bizarre, the monstrous, and the surreal.",
    books: ["Grandma's Illegal Dragon Racing Circuit", "The Sight Eater", "The Doubles", "Chronophage", "Quantum Sock Mismatch Mayhem", "The Last Channel of Nana Quantum"]
  }
];

export default function Themes() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
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
          <Link href="/series">
            <Button className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold px-6 py-3">
              View Series
            </Button>
          </Link>
          <Link href="/audiobooks">
            <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold px-6 py-3">
              Listen to Audiobooks
            </Button>
          </Link>
        </div>
      </nav>

      {/* Themes Section */}
      <section className="container py-12 md:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Themes & Ideas
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              From neuroscience to fiction, Dr. Babiak's work explores recurring themes that challenge conventional thinking and illuminate the human condition.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {themes.map((theme, index) => (
              <Card
                key={index}
                className="bg-slate-800/50 border-slate-700 backdrop-blur-sm p-8 hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-lg text-white">
                    {theme.icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {theme.title}
                    </h2>
                  </div>
                </div>
                
                <p className="text-slate-300 mb-4 leading-relaxed">
                  {theme.description}
                </p>

                <div className="border-t border-slate-700 pt-4">
                  <p className="text-sm text-slate-400 mb-2 font-semibold">Featured in:</p>
                  <div className="flex flex-wrap gap-2">
                    {theme.books.map((book, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-slate-700/50 text-slate-300 px-3 py-1 rounded-full"
                      >
                        {book}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-16 space-y-4">
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
          </div>
        </div>
      </section>
    </div>
  );
}

