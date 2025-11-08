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
  "
