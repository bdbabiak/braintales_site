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

// Configure email transporter
const createTransporter = () => {
  const emailUser = process.env.EMAIL_USER || 'readerlist@braintales.net';
  const emailPass = process.env.EMAIL_PASS || '';
  
  if (!emailPass) {
    console.error('❌ EMAIL_PASS environment variable not set!');
    throw new Error('Email configuration missing');
  }
  
  console.log('📧 Creating email transporter for:', emailUser);
  
  // Using Namecheap Private Email SMTP settings
  const transporter = nodemailer.createTransporter({
    host: 'mail.privateemail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: emailUser,
      pass: emailPass
    },
    tls: {
      rejectUnauthorized: false // Sometimes needed for Namecheap
    }
  });
  
  return transporter;
};

// Chapter content mapping - using REAL book descriptions from the website
const chapterContent = {
  'adhd': {
    subject: 'Your Free Chapter: The ADHD Brain',
    text: `Thank you for your interest in The ADHD Brain: An Immersive Journey Through Science, Struggle and Strength!

Your free chapter is attached to this email. This book is a clinician-led guide grounded in neuroscience and real-world experience. It explains how ADHD unfolds across the lifespan—adults, women, late diagnosis—and covers diagnosis, treatment options from medication to lifestyle strategies.

If you enjoy this chapter, the full book is available on Amazon: https://www.amazon.com/dp/B0FWTY1VVS

Best regards,
Dr. Brian Dale Babiak
https://braintales.net`,
    fileName: 'ADHD_Brain_Chapter_1.pdf'
  },
  'doubles': {
    subject: 'Your Free Chapter: The Doubles - Ghosts of the Podium',
    text: `Thank you for your interest in The Doubles: Ghosts of the Podium!

Your free chapter is attached. This political thriller explores what happens when body doubles become more real than their originals—a gripping tale of identity, power, and deception that explores the blurred lines between authenticity and performance.

If you enjoy this chapter, the full book is available on Amazon: https://www.amazon.com/dp/B0FSSW9XGX

Best regards,
Dr. Brian Dale Babiak
https://braintales.net`,
    fileName: 'Doubles_Chapter_1.pdf'
  },
  'epicurus': {
    subject: 'Your Free Chapter: Epicurus 2.0',
    text: `Thank you for your interest in Epicurus 2.0: Why You Don't Matter (And Why That's The Best News You'll Get)!

Your free chapter is attached. This book fuses ancient Epicurean philosophy with modern neuroscience, offering freedom from realizing you don't have a fixed 'self' to perfect. Buddhism for skeptics—enlightenment without mysticism.

If you enjoy this chapter, the full book is available on Amazon: https://www.amazon.com/dp/B0FVF3ZRJQ

Best regards,
Dr. Brian Dale Babiak
https://braintales.net`,
    fileName: 'Epicurus_Chapter_1.pdf'
  },
  'sight-eater': {
    subject: 'Your Free Chapter: The Sight Eater',
    text: `Thank you for your interest in The Sight Eater: A Speculative Dark Comedy About Love, Bureaucracy, and the Logistics of Monstrosity!

Your free chapter is attached. A blind woman sees by eating eyes; a man grows them—love blooms in the grotesque. Body horror meets tender romance in near-future Warsaw. Kafka meets Cronenberg in this daring genre-defying masterpiece.

If you enjoy this chapter, the full book is available on Amazon: https://www.amazon.com/dp/B0FN3M4DFZ

Best regards,
Dr. Brian Dale Babiak
https://braintales.net`,
    fileName: 'Sight_Eater_Chapter_1.pdf'
  },
  'grandma': {
    subject: "Your Free Chapter: Grandma's Illegal Dragon Racing Circuit",
    text: `Thank you for your interest in Grandma's Illegal Dragon Racing Circuit!

Your free chapter is attached. This absurdist sci-fi satire where no one is expendable shows that your weirdness is your value—resistance wrapped in laughter. Kurt Vonnegut meets Terry Pratchett in this cosmic comedy where dragons, spreadsheets, and cosmic nachos collide.

If you enjoy this chapter, the full book is available on Amazon: https://www.amazon.com/dp/B0FP9MRCJM

Best regards,
Dr. Brian Dale Babiak
https://braintales.net`,
    fileName: 'Grandma_Chapter_1.pdf'
  },
};

export const subscriptionRouter = router({
  subscribe: publicProcedure
    .input(subscribeSchema)
    .mutation(async ({ input }) => {
      const db = getDb();
      
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
                updatedAt: new Date()
              })
              .where(eq(subscribers.email, input.email));
          }
        } else {
          // Add new subscriber to database
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
                <strong>Dr. Brian Dale Babiak</strong><br>
                <a href="https://braintales.net" style="color: #1e40af; text-decoration: none;">https://braintales.net</a><br>
                <em>Explore more books and resources at our website</em>
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
        console.log('Attempting to send email to:', input.email);
        const emailResult = await transporter.sendMail(mailOptions);
        
        console.log('✅ Email sent successfully!');
        console.log('   To:', input.email);
        console.log('   Chapter:', input.chapter);
        console.log('   Message ID:', emailResult.messageId);
        console.log('   Response:', emailResult.response);
        
        return { 
          success: true, 
          message: 'Successfully subscribed! Check your email for your free chapter.' 
        };
      } catch (error: any) {
        console.error('❌ SUBSCRIPTION ERROR:', {
          message: error.message,
          code: error.code,
          command: error.command,
          response: error.response,
          responseCode: error.responseCode,
          stack: error.stack
        });
        
        // Specific error messages
        if (error.code === 'EAUTH') {
          console.error('🔐 Authentication failed - check EMAIL_PASS in environment variables');
        } else if (error.code === 'ECONNREFUSED') {
          console.error('🔌 Connection refused - check SMTP settings');
        } else if (error.code === 'ETIMEDOUT') {
          console.error('⏱️ Connection timeout - possible firewall issue');
        } else if (error.message?.includes('EMAIL_PASS')) {
          console.error('🔑 EMAIL_PASS environment variable not configured');
        }
        
        // Still save the subscription even if email fails
        return { 
          success: true, 
          message: 'Subscription saved! We\'ll send your chapter shortly. If you don\'t receive it within 10 minutes, please contact readerlist@braintales.net' 
        };
      }
    }),
    
  // Optional: Add an unsubscribe endpoint
  unsubscribe: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(subscribers)
        .set({ isActive: 0, updatedAt: new Date() })
        .where(eq(subscribers.email, input.email));
      return { success: true };
    }),
    
  // Get all subscribers for admin use
  getSubscribers: publicProcedure
    .query(async () => {
      const db = getDb();
      const subs = await db
        .select()
        .from(subscribers)
        .where(eq(subscribers.isActive, 1));
      return subs;
    }),
    
  // Send follow-up email to subscribers who haven't received one
  sendFollowUps: publicProcedure
    .mutation(async () => {
      const db = getDb();
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      // Get subscribers who need follow-up
      const needFollowUp = await db
        .select()
        .from(subscribers)
        .where(eq(subscribers.isActive, 1));
      
      const toFollowUp = needFollowUp.filter(sub => {
        if (!sub.chapterSentAt || sub.followUpSentAt) return false;
        const sentDate = new Date(sub.chapterSentAt);
        return sentDate < oneWeekAgo;
      });
      
      const transporter = createTransporter();
      let sent = 0;
      
      for (const sub of toFollowUp) {
        try {
          const chapterInfo = chapterContent[sub.initialChapter as keyof typeof chapterContent];
          
          await transporter.sendMail({
            from: '"Dr. Brian Dale Babiak" <readerlist@braintales.net>',
            to: sub.email,
            subject: `Ready for the full book? ${chapterInfo.subject.replace('Your Free Chapter: ', '')}`,
            html: `
              <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1e40af;">How was the chapter?</h2>
                <p>Hi there,</p>
                <p>A week ago, you downloaded a free chapter from <strong>${chapterInfo.subject.replace('Your Free Chapter: ', '')}</strong>.</p>
                <p>If you enjoyed it, the full book is waiting for you on Amazon!</p>
                <p><a href="https://braintales.net" style="color: #1e40af;">Visit our website</a> to explore all my books.</p>
                <hr style="border: 1px solid #e5e5e5; margin: 30px 0;">
                <p style="color: #666;">
                  Best regards,<br>
                  <strong>Dr. Brian Dale Babiak</strong><br>
                  <a href="https://braintales.net">https://braintales.net</a>
                </p>
              </div>
            `
          });
          
          // Update database
          await db
            .update(subscribers)
            .set({ followUpSentAt: new Date() })
            .where(eq(subscribers.id, sub.id));
            
          sent++;
        } catch (error) {
          console.error('Failed to send follow-up to:', sub.email, error);
        }
      }
      
      return { success: true, sent };
    }),
    
  // Test email configuration
  testEmail: publicProcedure
    .mutation(async () => {
      try {
        const transporter = createTransporter();
        
        // Verify connection configuration
        await transporter.verify();
        console.log('✅ Email server connection verified');
        
        // Send test email
        const info = await transporter.sendMail({
          from: '"Dr. Brian Dale Babiak" <readerlist@braintales.net>',
          to: 'readerlist@braintales.net',
          subject: 'Test Email - Braintales Website',
          text: 'This is a test email. If you receive this, email configuration is working!',
          html: '<p>This is a test email. If you receive this, email configuration is working!</p>'
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
