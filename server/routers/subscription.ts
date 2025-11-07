import { z } from 'zod';
import { publicProcedure, router } from '../_core/trpc';
import nodemailer from 'nodemailer';
import { promises as fs } from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { getDb } from '../db';
import { subscribers } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

// Load environment variables
dotenv.config();

// Email validation schema
const subscribeSchema = z.object({
  email: z.string().email(),
  chapter: z.enum(['adhd', 'doubles', 'epicurus', 'sight-eater', 'grandma']),
  source: z.string().optional(),
});

// Email transporter setup - SIMPLE VERSION
const createTransporter = () => {
  const emailUser = process.env.EMAIL_USER || 'readerlist@braintales.net';
  const emailPass = process.env.EMAIL_PASS;
  
  if (!emailPass) {
    console.error('❌ EMAIL_PASS environment variable not set!');
    throw new Error('Email configuration missing');
  }
  
  console.log('📧 Creating email transporter for:', emailUser);
  console.log('📧 Email password length:', emailPass.length, 'characters');
  
  // Using Namecheap Private Email SMTP settings with port 465
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'mail.privateemail.com',
    port: Number(process.env.EMAIL_PORT || 465),
    secure: true, // true for 465
    auth: {
      user: emailUser,
      pass: emailPass
    },
    tls: {
      rejectUnauthorized: false,
      minVersion: 'TLSv1.2'
    },
    logger: true,
    debug: true
  });
  
  return transporter;
};

// Chapter content with your ACTUAL book descriptions
const chapterContent = {
  'adhd': {
    subject: 'Your Free Chapter: The ADHD Brain',
    text: `Thank you for your interest in The ADHD Brain: An Immersive Journey Through Science, Struggle and Strength!

Your free chapter is attached to this email. As a clinician-led guide grounded in neuroscience and real-world experience, this book explains how ADHD unfolds across the lifespan—adults, women, late diagnosis—and covers diagnosis, treatment options from medication to lifestyle strategies.

If you enjoy this chapter, the full book is available on Amazon: https://www.amazon.com/dp/B0FWTY1VVS

Best regards,
Dr. Brian Dale Babiak
https://braintales.net`,
    fileName: 'ADHD_Brain_Chapter_1.pdf'
  },
  'doubles': {
    subject: 'Your Free Chapter: The Doubles - Ghosts of the Podium',
    text: `Thank you for your interest in The Doubles: Ghosts of the Podium!

Your free chapter is attached. This political thriller explores identity, power, and deception—what happens when body doubles become more real than their originals.

If you enjoy this chapter, the full book is available on Amazon: https://www.amazon.com/dp/B0FSSW9XGX

Best regards,
Dr. Brian Dale Babiak
https://braintales.net`,
    fileName: 'Doubles_Chapter_1.pdf'
  },
  'epicurus': {
    subject: 'Your Free Chapter: Epicurus 2.0',
    text: `Thank you for your interest in Epicurus 2.0: Why You Don't Matter (And Why That's The Best News You'll Get)!

Your free chapter is attached. This book fuses ancient Epicurean philosophy with modern neuroscience, offering a path to freedom through understanding.

If you enjoy this chapter, the full book is available on Amazon: https://www.amazon.com/dp/B0FVF3ZRJQ

Best regards,
Dr. Brian Dale Babiak
https://braintales.net`,
    fileName: 'Epicurus_Chapter_1.pdf'
  },
  'sight-eater': {
    subject: 'Your Free Chapter: The Sight Eater',
    text: `Thank you for your interest in The Sight Eater!

Your free chapter is attached. This dark comedy explores love, bureaucracy, and monstrosity in unexpected ways.

If you enjoy this chapter, the full book is available on Amazon: https://www.amazon.com/dp/B0FXT51Y14

Best regards,
Dr. Brian Dale Babiak
https://braintales.net`,
    fileName: 'Sight_Eater_Chapter_1.pdf'
  },
  'grandma': {
    subject: "Your Free Chapter: Grandma's Illegal Dragon Racing Circuit",
    text: `Thank you for your interest in Grandma's Illegal Dragon Racing Circuit!

Your free chapter is attached. This absurdist sci-fi satire celebrates how your weirdness is your value.

If you enjoy this chapter, the full book is available on Amazon: https://www.amazon.com/dp/B0FS9Y48RX

Best regards,
Dr. Brian Dale Babiak
https://braintales.net`,
    fileName: 'Grandma_Chapter_1.pdf'
  }
};

export const subscriptionRouter = router({
  subscribe: publicProcedure
    .input(subscribeSchema)
    .mutation(async ({ input }) => {
      const db = await getDb();
      
      if (!db) {
        console.error('❌ Database connection failed');
        throw new Error('Database connection failed');
      }
      
      try {
        // Check if already subscribed
        const existing = await db
          .select()
          .from(subscribers)
          .where(eq(subscribers.email, input.email))
          .limit(1);
        
        if (existing.length > 0) {
          console.log('Subscriber already exists:', input.email);
          // Update their record if they want a different chapter
          if (existing[0].initialChapter !== input.chapter) {
            await db
              .update(subscribers)
              .set({ 
                initialChapter: input.chapter,
                chapterSentAt: new Date()
              })
              .where(eq(subscribers.email, input.email));
            
            console.log('✅ Updated subscriber chapter preference:', input.email);
          }
        } else {
          // Add new subscriber
          await db.insert(subscribers).values({
            email: input.email,
            initialChapter: input.chapter,
            source: input.source || 'chapter_download',
            isActive: 1,
            subscribedAt: new Date(),
            chapterSentAt: new Date()
          });
          
          console.log('✅ New subscriber added to database:', input.email);
        }
        
        // Create transporter and verify connection
        const transporter = createTransporter();
        await transporter.verify();
        console.log('✅ SMTP connection verified');
        
        const chapterInfo = chapterContent[input.chapter];
        
        // Path to PDF file
        const pdfPath = path.join(process.cwd(), 'chapters', chapterInfo.fileName);
        
        // Check if PDF exists
        let attachments = [];
        try {
          await fs.access(pdfPath);
          const pdfBuffer = await fs.readFile(pdfPath);
          console.log(`PDF found: ${chapterInfo.fileName}`);
          attachments = [{
            filename: chapterInfo.fileName,
            content: pdfBuffer
          }];
        } catch (err) {
          console.error(`❌ PDF not found: ${pdfPath}`);
          console.error('Please ensure the chapters folder exists with PDFs');
        }
        
        const mailOptions = {
          from: process.env.EMAIL_USER || 'readerlist@braintales.net',
          to: input.email,
          subject: chapterInfo.subject,
          text: chapterInfo.text,
          attachments: attachments
        };
        
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent:', info.messageId);
        
        return { 
          success: true, 
          message: 'Thanks for subscribing! Check your email for your free chapter.'
        };
        
      } catch (error: any) {
        console.error('❌ SUBSCRIPTION ERROR:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        
        if (error.code === 'EAUTH') {
          console.error('🔐 Authentication failed - check EMAIL_PASS in environment variables');
        } else if (error.code === 'ECONNECTION' || error.code === 'ECONNREFUSED') {
          console.error('🔌 Connection failed - check SMTP settings');
        } else if (error.code === 'ETIMEDOUT') {
          console.error('⏱️ Connection timeout - SMTP server may be blocking the port');
        }
        
        throw new Error('Failed to process subscription. Please try again.');
      }
    }),
  
  // Test email endpoint to verify SMTP works
  testEmail: publicProcedure
    .mutation(async () => {
      try {
        const transporter = createTransporter();
        await transporter.verify();
        console.log('✅ SMTP connection verified');
        
        const info = await transporter.sendMail({
          from: process.env.EMAIL_USER || 'readerlist@braintales.net',
          to: process.env.EMAIL_USER || 'readerlist@braintales.net',
          subject: 'Test Email - BrainTales Subscription System',
          text: 'If you receive this, your email configuration is working correctly!',
          html: '<p>If you receive this, your <strong>email configuration</strong> is working correctly!</p>'
        });
        
        console.log('Message sent:', info.messageId);
        console.log('Response:', info.response);
        
        return { 
          success: true, 
          message: 'Test email sent successfully',
          messageId: info.messageId 
        };
      } catch (error: any) {
        console.error('Test email error:', error);
        return { 
          success: false, 
          message: error.message,
          code: error.code 
        };
      }
    }),
});
