import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Pre-defined responses using REAL information from the website
const quickResponses = {
  greetings: [
    "Hello! I'm Dr. Babiak's AI assistant. I can answer questions about his books - both fiction and non-fiction. What would you like to know about The ADHD Brain, Trading Psychology, Epicurus 2.0, The Doubles, The Sight Eater, or Grandma's Illegal Dragon Racing Circuit?"
  ],
  books: [
    "I've written both fiction and non-fiction. Non-fiction includes 'The ADHD Brain' (a clinician-led guide on ADHD), 'Trading Psychology & Neuroscience' (behavioral finance), and 'Epicurus 2.0' (ancient philosophy meets neuroscience). Fiction includes 'The Doubles' (political thriller), 'The Sight Eater' (dark comedy body horror romance), and 'Grandma's Illegal Dragon Racing Circuit' (absurdist sci-fi satire).",
    "Each book explores different aspects of consciousness and human experience. Which specific book would you like to know more about?"
  ],
  adhd: [
    "'The ADHD Brain' is an immersive journey through science, struggle and strength. It's a clinician-led guide grounded in neuroscience and real-world experience, explaining how ADHD unfolds across the lifespan—adults, women, late diagnosis. It covers diagnosis, treatment options from medication to lifestyle strategies, with deep dives into hormones, sleep, time management, work, and relationships.",
    "The book connects science, struggle, and strength to help you understand, treat, and thrive with ADHD."
  ],
  author: [
    "Dr. Brian Dale Babiak is a psychiatrist and author who combines clinical expertise with creative writing to explore consciousness, neurodiversity, and human experience through both scientific and literary lenses.",
    "My work spans from clinical guides on ADHD and trading psychology to absurdist fiction and dark comedy, always exploring what makes us human."
  ],
  philosophy: [
    "'Epicurus 2.0: Why You Don't Matter (And Why That's The Best News You'll Get)' fuses ancient Epicurean philosophy with modern neuroscience. It offers freedom from realizing you don't have a fixed 'self' to perfect—Buddhism for skeptics, enlightenment without mysticism. The book includes science-backed protocols: Capability Reframing, Metric Fasting, and the 5-4-3-2-1 Audit."
  ]
};

const suggestedQuestions = [
  "Tell me about The ADHD Brain",
  "What's Grandma's Illegal Dragon Racing Circuit about?",
  "How does Trading Psychology help traders?",
  "What inspired The Sight Eater?",
  "What is Epicurus 2.0?"
];

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hasGreeted, setHasGreeted] = useState(false);
  
  const chatMutation = trpc.chat.sendMessage.useMutation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !hasGreeted) {
      // Add welcome message when chat opens
      setMessages([{
        id: '1',
        role: 'assistant',
        content: quickResponses.greetings[0],
        timestamp: new Date()
      }]);
      setHasGreeted(true);
    }
  }, [isOpen, hasGreeted]);

  const generateResponse = async (userMessage: string): Promise<string> => {
    // Try API first
    try {
      const result = await chatMutation.mutateAsync({
        message: userMessage,
        context: 'author_chatbot'
      });
      
      if (result.response) {
        return result.response;
      }
    } catch (error) {
      // Fall back to local responses if API fails
      console.log('Using local response fallback');
    }
    
    // Local keyword-based responses as fallback
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('adhd')) {
      return quickResponses.adhd[Math.floor(Math.random() * quickResponses.adhd.length)];
    } else if (lowerMessage.includes('book') || lowerMessage.includes('fiction') || lowerMessage.includes('novel')) {
      return quickResponses.books[Math.floor(Math.random() * quickResponses.books.length)];
    } else if (lowerMessage.includes('who are you') || lowerMessage.includes('about') || lowerMessage.includes('author') || lowerMessage.includes('brian')) {
      return quickResponses.author[Math.floor(Math.random() * quickResponses.author.length)];
    } else if (lowerMessage.includes('philosophy') || lowerMessage.includes('epicurus') || lowerMessage.includes('absurd')) {
      return quickResponses.philosophy[Math.floor(Math.random() * quickResponses.philosophy.length)];
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! What would you like to know about Dr. Babiak's work?";
    } else if (lowerMessage.includes('thank')) {
      return "You're welcome! Feel free to ask anything else about the books or Dr. Babiak's work.";
    }
    
    // Default response
    return "That's an interesting question! While I'm still learning, you might find answers in Dr. Babiak's books. The ADHD Brain covers neuroscience topics, while his fiction explores consciousness and identity. What specific aspect would you like to explore?";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(async () => {
      const response = await generateResponse(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // 1-2 second delay
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    handleSend();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-56 sm:bottom-44 md:bottom-24 left-3 sm:left-5 z-10 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200 group"
        aria-label="Ask Dr. Babiak AI"
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6" />
          <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-yellow-300 animate-pulse" />
        </div>
      </button>
    );
  }

  return (
    <Card className="fixed bottom-56 sm:bottom-44 md:bottom-24 left-3 sm:left-5 z-10 w-[calc(100vw-3rem)] md:w-96 h-[calc(100vh-10rem)] md:h-[600px] bg-slate-900 border-slate-700 shadow-2xl flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-gradient-to-r from-purple-600/20 to-pink-600/20">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bot className="w-8 h-8 text-purple-400" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
          </div>
          <div>
            <h3 className="font-semibold text-white">Ask Dr. Babiak</h3>
            <p className="text-xs text-slate-400">AI Assistant</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-100'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs opacity-60 mt-1">
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-slate-800 rounded-lg px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested questions (only show at start) */}
      {messages.length === 1 && (
        <div className="px-4 py-2 border-t border-slate-800">
          <p className="text-xs text-slate-500 mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.slice(0, 3).map((q, i) => (
              <button
                key={i}
                onClick={() => {
                  setInput(q);
                  handleSend();
                }}
                className="text-xs px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-slate-700">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about books, ADHD, writing..."
            className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm"
            disabled={isTyping}
          />
          <Button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}
