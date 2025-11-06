import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronRight, RefreshCw, BookOpen } from 'lucide-react';
import { Link } from 'wouter';

interface QuizOption {
  text: string;
  points: {
    fiction?: number;
    nonfiction?: number;
    absurd?: number;
    psychological?: number;
    scifi?: number;
    selfhelp?: number;
  };
}

interface Question {
  id: number;
  question: string;
  options: QuizOption[];
}

const questions: Question[] = [
  {
    id: 1,
    question: "What draws you to a book?",
    options: [
      { text: "Mind-bending concepts that challenge reality", points: { fiction: 2, scifi: 3 } },
      { text: "Practical insights I can apply to my life", points: { nonfiction: 3, selfhelp: 2 } },
      { text: "Weird, funny stories that surprise me", points: { absurd: 3, fiction: 1 } },
      { text: "Deep psychological exploration", points: { psychological: 3, fiction: 1 } }
    ]
  },
  {
    id: 2,
    question: "Your ideal reading experience?",
    options: [
      { text: "Learning something that changes how I think", points: { nonfiction: 2, selfhelp: 1 } },
      { text: "Escaping into impossible worlds", points: { fiction: 3, scifi: 2 } },
      { text: "Laughing at the absurdity of existence", points: { absurd: 3 } },
      { text: "Understanding the human mind better", points: { psychological: 3, nonfiction: 1 } }
    ]
  },
  {
    id: 3,
    question: "What topic interests you most?",
    options: [
      { text: "Consciousness and the nature of reality", points: { scifi: 2, psychological: 2 } },
      { text: "Mental health and neuroscience", points: { nonfiction: 3, psychological: 1 } },
      { text: "Time, luck, and probability", points: { scifi: 3, fiction: 1 } },
      { text: "The beautifully bizarre and unexpected", points: { absurd: 3, fiction: 1 } }
    ]
  },
  {
    id: 4,
    question: "How do you prefer your complexity?",
    options: [
      { text: "Scientific depth with practical applications", points: { nonfiction: 3, selfhelp: 1 } },
      { text: "Philosophical puzzles wrapped in stories", points: { fiction: 2, psychological: 2 } },
      { text: "Chaos that somehow makes perfect sense", points: { absurd: 3 } },
      { text: "Layered narratives with hidden meanings", points: { fiction: 3, scifi: 1 } }
    ]
  },
  {
    id: 5,
    question: "What mood are you in?",
    options: [
      { text: "Ready to question everything", points: { scifi: 2, psychological: 1 } },
      { text: "Need something to help me grow", points: { selfhelp: 3, nonfiction: 1 } },
      { text: "Want to laugh and think simultaneously", points: { absurd: 3 } },
      { text: "Craving an intellectual adventure", points: { fiction: 2, scifi: 2 } }
    ]
  }
];

const bookRecommendations = {
  scifi: {
    primary: "Everything Thinks",
    backup: "The Momentum Wars",
    description: "You're drawn to reality-bending concepts and consciousness exploration."
  },
  absurd: {
    primary: "Grandma's Illegal Dragon Racing Circuit",
    backup: "Quantum Sock Mismatch Mayhem",
    description: "You appreciate the beautiful chaos where humor meets philosophy."
  },
  psychological: {
    primary: "The Familiar System",
    backup: "The Last Beautiful Game",
    description: "You're fascinated by the depths of human psychology and behavior."
  },
  selfhelp: {
    primary: "The ADHD Brain",
    backup: "Epicurus 2.0",
    description: "You're looking for insights that can transform your daily life."
  },
  nonfiction: {
    primary: "Trading Psychology & Neuroscience",
    backup: "The ADHD Brain",
    description: "You value scientific understanding and practical knowledge."
  },
  fiction: {
    primary: "The Sight Eater",
    backup: "The Doubles",
    description: "You love immersive stories that explore human nature."
  }
};

export const BookQuiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

  const handleAnswer = (optionIndex: number) => {
    const option = questions[currentQuestion].options[optionIndex];
    const newScores = { ...scores };
    
    Object.entries(option.points).forEach(([key, value]) => {
      newScores[key] = (newScores[key] || 0) + value;
    });
    
    setScores(newScores);
    setSelectedOptions([...selectedOptions, optionIndex]);
    
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    } else {
      setShowResult(true);
    }
  };

  const getRecommendation = () => {
    const topCategory = Object.entries(scores).reduce((a, b) => 
      scores[a[0]] > scores[b[0]] ? a : b
    )[0];
    
    return bookRecommendations[topCategory as keyof typeof bookRecommendations] || bookRecommendations.fiction;
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScores({});
    setShowResult(false);
    setSelectedOptions([]);
  };

  if (showResult) {
    const recommendation = getRecommendation();
    
    return (
      <Card className="bg-slate-800/50 border-slate-700 p-8 max-w-2xl mx-auto">
        <div className="text-center space-y-6">
          <BookOpen className="w-16 h-16 mx-auto text-purple-400" />
          
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Your Perfect Book Match!</h3>
            <p className="text-slate-400">{recommendation.description}</p>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-lg">
              <p className="text-sm text-white/80 mb-1">We recommend starting with:</p>
              <h4 className="text-2xl font-bold text-white">{recommendation.primary}</h4>
            </div>
            
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <p className="text-sm text-slate-400 mb-1">Also perfect for you:</p>
              <p className="text-lg font-semibold text-white">{recommendation.backup}</p>
            </div>
          </div>
          
          <div className="flex gap-4 justify-center">
            <Link href="/">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Browse All Books
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              onClick={resetQuiz}
              className="border-slate-600 hover:bg-slate-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Take Again
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 p-8 max-w-2xl mx-auto">
      <div className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Question {currentQuestion + 1} of {questions.length}</span>
            <span className="text-slate-400">{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
        
        {/* Question */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-2">
            {questions[currentQuestion].question}
          </h3>
        </div>
        
        {/* Options */}
        <div className="space-y-3">
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className="w-full text-left p-4 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 hover:border-purple-500 transition-all group"
            >
              <span className="text-white group-hover:text-purple-300 transition-colors">
                {option.text}
              </span>
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default BookQuiz;
