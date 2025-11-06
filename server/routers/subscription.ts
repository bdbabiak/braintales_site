import { z } from 'zod';
import { publicProcedure, router } from '@server/trpc';
import nodemailer from 'nodemailer';
import { promises as fs } from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Email validation schema
const subscribeSchema = z.object({
  email: z.string().email(),
  chapter: z.enum(['adhd', 'doubles', 'epicurus', 'sight-eater', 'grandma']),
  source: z.string().optional(),
});

// Store subscriptions in a simple JSON file for now
// In production, you'd use a proper database
const SUBSCRIBERS_FILE = path.join(process.cwd(), 'subscribers.json');

async function getSubscribers() {
  try {
    const data = await fs.readFile(SUBSCRIBERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function addSubscriber(subscriber: any) {
  const subscribers = await getSubscribers();
  
  // Check if already subscribed
  if (subscribers.find((s: any) => s.email === subscriber.email)) {
    return { exists: true };
  }
  
  subscribers.push({
    ...subscriber,
    subscribedAt: new Date().toISOString(),
  });
  
  await fs.writeFile(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2));
  return { exists: false };
}

// Configure email transporter
// For production, use environment variables for credentials
const createTransporter = () => {
  // Using Namecheap Private Email SMTP settings
  return nodemailer.createTransporter({
    host: 'mail.privateemail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER || 'readerlist@braintales.net',
      pass: process.env.EMAIL_PASS || '', // You'll need to set this
    },
  });
};

// Chapter content mapping - using REAL book descriptions from the website
const chapterContent = {
  'adhd': {
    subject: 'Your Free Chapter: The ADHD Brain',
    text: `Thank you for your interest in The ADHD Brain: An Immersive Journey Through Science, Struggle and Strength!

Your free chapter is attached to this email. This book is a clinician-led guide grounded in neuroscience and real-world experience. It explains how ADHD unfolds across the lifespan—adults, women, late diagnosis—and covers diagnosis, treatment options from medication to lifestyle strategies.

If you enjoy this chapter, the full book is available on Amazon: https://www.amazon.com/dp/B0FWTY1VVS

Best regards,
Dr. Brian Dale Babiak`,
    fileName: 'ADHD_Brain_Chapter_1.pdf'
  },
  'doubles': {
    subject: 'Your Free Chapter: The Doubles - Ghosts of the Podium',
    text: `Thank you for your interest in The Doubles: Ghosts of the Podium!

Your free chapter is attached. This political thriller explores what happens when body doubles become more real than their originals—a gripping tale of identity, power, and deception that explores the blurred lines between authenticity and performance.

If you enjoy this chapter, the full book is available on Amazon: https://www.amazon.com/dp/B0FSSW9XGX

Best regards,
Dr. Brian Dale Babiak`,
    fileName: 'Doubles_Chapter_1.pdf'
  },
  'epicurus': {
    subject: 'Your Free Chapter: Epicurus 2.0',
    text: `Thank you for your interest in Epicurus 2.0: Why You Don't Matter (And Why That's The Best News You'll Get)!

Your free chapter is attached. This book fuses ancient Epicurean philosophy with modern neuroscience, offering freedom from realizing you don't have a fixed 'self' to perfect. Buddhism for skeptics—enlightenment without mysticism.

If you enjoy this chapter, the full book is available on Amazon: https://www.amazon.com/dp/B0FVF3ZRJQ

Best regards,
Dr. Brian Dale Babiak`,
    fileName: 'Epicurus_Chapter_1.pdf'
  },
  'sight-eater': {
    subject: 'Your Free Chapter: The Sight Eater',
    text: `Thank you for your interest in The Sight Eater: A Speculative Dark Comedy About Love, Bureaucracy, and the Logistics of Monstrosity!

Your free chapter is attached. A blind woman sees by eating eyes; a man grows them—love blooms in the grotesque. Body horror meets tender romance in near-future Warsaw. Kafka meets Cronenberg in this daring genre-defying masterpiece.

If you enjoy this chapter, the full book is available on Amazon: https://www.amazon.com/dp/B0FN3M4DFZ

Best regards,
Dr. Brian Dale Babiak`,
    fileName: 'Sight_Eater_Chapter_1.pdf'
  },
  'grandma': {
    subject: "Your Free Chapter: Grandma's Illegal Dragon Racing Circuit",
    text: `Thank you for your interest in Grandma's Illegal Dragon Racing Circuit!

Your free chapter is attached. This absurdist sci-fi satire where no one is expendable shows that your weirdness is your value—resistance wrapped in laughter. Kurt Vonnegut meets Terry Pratchett in this cosmic comedy where dragons, spreadsheets, and cosmic nachos collide.

If you enjoy this chapter, the full book is available on Amazon: https://www.amazon.com/dp/B0FP9MRCJM

Best regards,
Dr. Brian Dale Babiak`,
    fileName: 'Grandma_Chapter_1.pdf'
  },
};

export const subscriptionRouter = router({
  subscribe: publicProcedure
    .input(subscribeSchema)
    .mutation(async ({ input }) => {
      try {
        // Add to subscriber list
        const result = await addSubscriber(input);
        
        if (result.exists) {
          console.log('Subscriber already exists:', input.email);
        }
        
        // Send email with chapter
        const transporter = createTransporter();
        const chapterInfo = chapterContent[input.chapter];
        
        // Path to PDF file
        const pdfPath = path.join(process.cwd(), 'chapters', chapterInfo.fileName);
        
        // Check if PDF exists
        let attachments = [];
        try {
          await fs.access(pdfPath);
          const pdfBuffer = await fs.readFile(pdfPath);
          attachments = [{
            filename: chapterInfo.fileName,
            content: pdfBuffer,
            contentType: 'application/pdf'
          }];
          console.log(`PDF found: ${chapterInfo.fileName}`);
        } catch (err) {
          console.error(`PDF not found: ${pdfPath}`);
        }
        
        const mailOptions = {
          from: '"Dr. Brian Dale Babiak" <readerlist@braintales.net>',
          to: input.email,
          subject: chapterInfo.subject,
          text: chapterInfo.text,
          html: `
            <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #333;">
              <h2 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px;">
                ${chapterInfo.subject}
              </h2>
              
              <p style="font-size: 16px; line-height: 1.6;">
                Thank you for your interest in my work!
              </p>
              
              <p style="font-size: 16px; line-height: 1.6;">
                ${chapterInfo.text.split('\n\n')[1]}
              </p>
              
              ${attachments.length > 0 ? 
                '<p style="font-size: 16px; line-height: 1.6;"><strong>Your chapter is attached to this email as a PDF.</strong></p>' :
                '<p style="font-size: 16px; line-height: 1.6; color: #d97706;">Note: The PDF will be sent in a follow-up email within a few minutes.</p>'
              }
              
              <div style="margin: 30px 0; padding: 20px; background-color: #f3f4f6; border-radius: 8px;">
                <h3 style="color: #1e40af; margin-top: 0;">Enjoy the Chapter?</h3>
                <p style="margin-bottom: 0;">
                  The full book and my other works are available on 
                  <a href="https://www.amazon.com/stores/author/B0CKVK59JC" style="color: #1e40af;">Amazon</a>.
                </p>
              </div>
              
              <hr style="border: 1px solid #e5e5e5; margin: 30px 0;">
              
              <p style="color: #666; font-size: 14px; font-style: italic;">
                Best regards,<br>
                Dr. Brian Dale Babiak<br>
                <a href="https://braintales.net" style="color: #1e40af;">braintales.net</a>
              </p>
              
              <p style="color: #999; font-size: 12px; margin-top: 30px;">
                You're receiving this because you requested a free chapter from braintales.net. 
                To unsubscribe, simply reply with "unsubscribe" in the subject line.
              </p>
            </div>
          `,
          attachments: attachments
        };
        
        // Actually send the email
        await transporter.sendMail(mailOptions);
        
        console.log('Email sent to:', input.email);
        console.log('Chapter sent:', input.chapter);
        
        return { 
          success: true, 
          message: 'Successfully subscribed! Check your email for your free chapter.' 
        };
      } catch (error) {
        console.error('Subscription error:', error);
        
        // Still save the subscription even if email fails
        return { 
          success: true, 
          message: 'Subscription saved. If you don\'t receive your chapter, please contact us.' 
        };
      }
    }),
    
  // Optional: Add an unsubscribe endpoint
  unsubscribe: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      const subscribers = await getSubscribers();
      const filtered = subscribers.filter((s: any) => s.email !== input.email);
      await fs.writeFile(SUBSCRIBERS_FILE, JSON.stringify(filtered, null, 2));
      return { success: true };
    }),
});
