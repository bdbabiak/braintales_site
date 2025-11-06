import { z } from 'zod';
import { publicProcedure, router } from '@server/trpc';

// For now, we'll use simple keyword-based responses
// In production, you could integrate with OpenAI API, Claude API, etc.

const chatSchema = z.object({
  message: z.string(),
  context: z.string().optional(),
});

// Enhanced response database - USING ONLY REAL INFORMATION FROM THE WEBSITE
const responseDatabase = {
  books: {
    'adhd brain': `"The ADHD Brain: An Immersive Journey Through Science, Struggle and Strength" is my clinician-led guide grounded in neuroscience and real-world experience. It explains how ADHD unfolds across the lifespan—adults, women, late diagnosis. Covers diagnosis, treatment options from medication to lifestyle strategies. Deep dives into hormones, sleep, time management, work, relationships. It connects science, struggle, and strength to help you understand, treat, and thrive.`,
    
    'doubles': `"The Doubles: Ghosts of the Podium" is a political thriller that explores what happens when body doubles become more real than their originals. It's a gripping tale of identity, power, and deception that explores the blurred lines between authenticity and performance. A mind-bending journey through the corridors of power.`,
    
    'sight eater': `"The Sight Eater: A Speculative Dark Comedy About Love, Bureaucracy, and the Logistics of Monstrosity" - A blind woman sees by eating eyes; a man grows them—love blooms in the grotesque. Body horror meets tender romance in near-future Warsaw. When love becomes regulated, intimacy becomes rebellion. Kafka meets Cronenberg in this daring genre-defying masterpiece. For fans of VanderMeer and Moshfegh.`,
    
    'grandma': `"Grandma's Illegal Dragon Racing Circuit" is an absurdist sci-fi satire where no one is expendable. Your weirdness is your value—resistance wrapped in laughter. Kurt Vonnegut meets Terry Pratchett in this cosmic comedy. Dragons, spreadsheets, and cosmic nachos collide. It's funny, necessary, and defiantly optimistic.`,
    
    'epicurus': `"Epicurus 2.0: Why You Don't Matter (And Why That's The Best News You'll Get)" fuses ancient Epicurean philosophy with modern neuroscience. Freedom from realizing you don't have a fixed 'self' to perfect. Science-backed protocols: Capability Reframing, Metric Fasting, 5-4-3-2-1 Audit. Buddhism for skeptics—enlightenment without mysticism. The last self-help book you'll ever need.`,
    
    'trading psychology': `"Trading Psychology & Neuroscience: The Rational Mind in an Irrational Market" - Behavioral finance fused with neuroscience for traders. Clinical protocols for emotion regulation and trader mindset. HRV training, biofeedback, coherence breathing techniques. Neutralize cognitive biases: loss aversion, FOMO, revenge trading. A field manual for disciplined decisions under uncertainty.`
  },
  
  author: {
    'background': `I'm Dr. Brian Dale Babiak, a psychiatrist and author. I combine clinical expertise with creative writing to explore consciousness, neurodiversity, and the human experience through both scientific and literary works.`,
    
    'writing process': `My writing bridges clinical observation with creative exploration. For non-fiction like "The ADHD Brain," I draw on neuroscience and clinical experience. For fiction like "The Sight Eater" or "Grandma's Illegal Dragon Racing Circuit," I explore consciousness through absurdist and speculative lenses.`,
    
    'inspiration': `My work is influenced by clinical practice and literature. You can see Kurt Vonnegut and Terry Pratchett's influence in "Grandma's Illegal Dragon Racing Circuit," while Kafka and Cronenberg inspire "The Sight Eater." The non-fiction draws from neuroscience research and clinical experience.`
  },
  
  adhd: {
    'tips': `From "The ADHD Brain": The book provides science-backed strategies including medication options, lifestyle modifications, and practical tools for time management, work, and relationships. It specifically addresses adult ADHD, women with ADHD, and late diagnosis cases, connecting science with real-world application.`,
    
    'diagnosis': `"The ADHD Brain" covers how ADHD unfolds across the lifespan, including adults, women, and late diagnosis. The book explains the diagnostic process and treatment options from both medication and lifestyle perspectives.`,
    
    'medication': `In "The ADHD Brain," I cover treatment options from medication to lifestyle strategies, with deep dives into how different approaches work with hormones, sleep, and daily functioning.`
  }
};

function generateSmartResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Check for specific book mentions
  for (const [key, response] of Object.entries(responseDatabase.books)) {
    if (lowerMessage.includes(key)) {
      return response;
    }
  }
  
  // Check for book title mentions
  if (lowerMessage.includes('grandma') || lowerMessage.includes('dragon racing')) {
    return responseDatabase.books['grandma'];
  }
  if (lowerMessage.includes('sight eater')) {
    return responseDatabase.books['sight eater'];
  }
  if (lowerMessage.includes('doubles') || lowerMessage.includes('podium')) {
    return responseDatabase.books['doubles'];
  }
  if (lowerMessage.includes('epicurus')) {
    return responseDatabase.books['epicurus'];
  }
  if (lowerMessage.includes('trading') && lowerMessage.includes('psychology')) {
    return responseDatabase.books['trading psychology'];
  }
  
  // Check for author-related queries
  if (lowerMessage.includes('background') || lowerMessage.includes('who are you')) {
    return responseDatabase.author.background;
  }
  if (lowerMessage.includes('writing') || lowerMessage.includes('process')) {
    return responseDatabase.author.writing_process;
  }
  if (lowerMessage.includes('inspiration') || lowerMessage.includes('influence')) {
    return responseDatabase.author.inspiration;
  }
  
  // ADHD specific responses
  if (lowerMessage.includes('adhd')) {
    if (lowerMessage.includes('tip') || lowerMessage.includes('strateg') || lowerMessage.includes('manage')) {
      return responseDatabase.adhd.tips;
    }
    if (lowerMessage.includes('diagnos') || lowerMessage.includes('test')) {
      return responseDatabase.adhd.diagnosis;
    }
    if (lowerMessage.includes('medicat') || lowerMessage.includes('drug') || lowerMessage.includes('pill')) {
      return responseDatabase.adhd.medication;
    }
    // Default ADHD response
    return responseDatabase.books['adhd brain'];
  }
  
  // Philosophy queries
  if (lowerMessage.includes('philosophy') || lowerMessage.includes('meaning') || lowerMessage.includes('epicur')) {
    return responseDatabase.books['epicurus'];
  }
  
  // Fiction queries
  if (lowerMessage.includes('fiction')) {
    return `My fiction includes "The Doubles: Ghosts of the Podium" (political thriller), "The Sight Eater" (dark comedy body horror romance), and "Grandma's Illegal Dragon Racing Circuit" (absurdist sci-fi satire). Each explores different aspects of consciousness and human experience. Which interests you?`;
  }
  
  // Non-fiction queries
  if (lowerMessage.includes('non-fiction') || lowerMessage.includes('nonfiction')) {
    return `My non-fiction includes "The ADHD Brain" (comprehensive ADHD guide), "Trading Psychology & Neuroscience" (behavioral finance), and "Epicurus 2.0" (philosophy meets neuroscience). Which topic interests you?`;
  }
  
  // General book query
  if (lowerMessage.includes('book') || lowerMessage.includes('read') || lowerMessage.includes('recommend')) {
    return `I write both fiction and non-fiction. Non-fiction: "The ADHD Brain," "Trading Psychology & Neuroscience," and "Epicurus 2.0." Fiction: "The Doubles," "The Sight Eater," and "Grandma's Illegal Dragon Racing Circuit." What interests you - clinical guides, philosophy, political thrillers, or absurdist comedy?`;
  }
  
  // Default response
  return `I can discuss any of my books: "The ADHD Brain," "Trading Psychology & Neuroscience," "Epicurus 2.0," "The Doubles," "The Sight Eater," or "Grandma's Illegal Dragon Racing Circuit." I can also answer questions about ADHD, neuroscience, trading psychology, or my writing. What would you like to know?`;
}

export const chatRouter = router({
  sendMessage: publicProcedure
    .input(chatSchema)
    .mutation(async ({ input }) => {
      try {
        // For production, you could integrate with OpenAI here:
        // const response = await openai.createChatCompletion({...})
        
        // For now, use our smart keyword-based system
        const response = generateSmartResponse(input.message);
        
        // Log for analytics
        console.log('Chat message:', input.message);
        console.log('Response:', response.substring(0, 100) + '...');
        
        return { 
          success: true,
          response: response
        };
      } catch (error) {
        console.error('Chat error:', error);
        
        // Fallback response
        return {
          success: true,
          response: `I appreciate your question! While I'm having trouble processing that specific query, feel free to ask about my books, ADHD, neuroscience, or the writing process. You can also email me directly through the contact form.`
        };
      }
    }),
});
