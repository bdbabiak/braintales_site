import { z } from 'zod';
import { publicProcedure, router } from '../_core/trpc';
import nodemailer from 'nodemailer';
import { promises as fs } from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { getDb } from '../db';
import { subscribers } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

dotenv.config();

// ───────────────────────────────────────────────────────────
// Input validation
// ───────────────────────────────────────────────────────────
const subscribeSchema = z.object({
  email: z.string().email(),
  chapter: z.enum(['adhd', 'doubles', 'epicurus', 'sight-eater', 'grandma']),
  source: z.string().optional(),
});

// ───────────────────────────────────────────────────────────
// Mail transport with 465 (SSL) → 587 (STARTTLS) fallback
// ───────────────────────────────────────────────────────────
const buildTransport = (opts: { host: string; port: number; user: string; pass: string }) => {
  const is465 = opts.port === 465;
  return nodemailer.createTransport({
    host: opts.host,
    port: opts.port,
    secure: is465,                 // 465 = implicit SSL
    requireTLS: !is465,            // 587 = STARTTLS
    authMethod: 'LOGIN',           // Namecheap prefers LOGIN
    auth: { user: opts.user, pass: opts.pass },
    tls: {
      servername: opts.host,       // explicit SNI
      minVersion: 'TLSv1.2',
      rejectUnauthorized: false,   // shared hosts sometimes require this
    },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
    logger: true,
    debug: true,
  });
};

const createTransporter = async () => {
  const host = process.env.EMAIL_HOST || 'mail.privateemail.com';
  const user = process.env.EMAIL_USER || 'readerlist@braintales.net'; // keep this aligned with SMTP auth user/domain for DMARC
  const pass = process.env.EMAIL_PASS;
  if (!pass) {
    console.error('❌ EMAIL_PASS environment variable not set!');
    throw new Error('Email configuration missing');
  }

  // Try 465 first (SSL)
  const port465 = Number(process.env.EMAIL_PORT || 465);
  let transporter = buildTransport({ host, port: port465, user, pass });
  try {
    await transporter.verify();
    return transporter;
  } catch (e) {
    console.warn('[Mailer] 465 verify failed, falling back to 587 STARTTLS...', (e as any)?.code || e);
  }

  // Fallback to 587 (STARTTLS)
  transporter = buildTransport({ host, port: 587, user, pass });
  await transporter.verify(); // will throw if invalid
  return transporter;
};

// ───────────────────────────────────────────────────────────
// Content for chapter emails (unchanged from your original)
// ───────────────────────────────────────────────────────────
const chapterContent = {
  adhd: {
    subject: 'Your Free Chapter: The ADHD Brain',
    text: `Thank you for your interest in The ADHD Brain: An Immersive Journey Through Science, Struggle and Strength!

Your free chapter is attached to this email. As a clinician-led guide grounded in neuroscience and real-world experience, this book explains how ADHD unfolds across the lifespan—adults, women, late diagnosis—and covers diagnosis, treatment options from medication to lifestyle strategies.

If you enjoy this chapter, the full book is available on Amazon: https://www.amazon.com/dp/B0FWTY1VVS

Best regards,
Dr. Brian Dale Babiak
https://braintales.net`,
    fileName: 'ADHD_Brain_Chapter_1.pdf',
  },
  doubles: {
    subject: 'Your Free Chapter: The Doubles - Ghosts of the Podium',
    text: `Thank you for your interest in The Doubles: Ghosts of the Podium!

Your free chapter is attached. This political thriller explores identity, power, and deception—what happens when body doubles become more real than their originals.

If you enjoy this chapter, the full book is available on Amazon: https://www.amazon.com/dp/B0FSSW9XGX

Best regards,
Dr. Brian Dale Babiak
https://braintales.net`,
    fileName: 'Doubles_Chapter_1.pdf',
  },
  epicurus: {
    subject: 'Your Free Chapter: Epicurus 2.0',
    text: `Thank you for your interest in Epicurus 2.0: Why You Don't Matter (And Why That's The Best News You'll Get)!

Your free chapter is attached. This book fuses ancient Epicurean philosophy with modern neuroscience, offering a path to freedom through understanding.

If you enjoy this chapter, the full book is available on Amazon: https://www.amazon.com/dp/B0FVF3ZRJQ

Best regards,
Dr. Brian Dale Babiak
https://braintales.net`,
    fileName: 'Epicurus_Chapter_1.pdf',
  },
  'sight-eater': {
    subject: 'Your Free Chapter: The Sight Eater',
    text: `Thank you for your interest in The Sight Eater!

Your free chapter is attached. This dark comedy explores love, bureaucracy, and monstrosity in unexpected ways.

If you enjoy this chapter, the full book is available on Amazon: https://www.amazon.com/dp/B0FXT51Y14

Best regards,
Dr. Brian Dale Babiak
https://braintales.net`,
    fileName: 'Sight_Eater_Chapter_1.pdf',
  },
  grandma: {
    subject: "Your Free Chapter: Grandma's Illegal Dragon Racing Circuit",
    text: `Thank you for your interest in Grandma's Illegal Dragon Racing Circuit!

Your free chapter is attached. This absurdist sci-fi satire celebrates how your weirdness is your value.

If you enjoy this chapter, the full book is available on Amazon: https://www.amazon.com/dp/B0FS9Y48RX

Best regards,
Dr. Brian Dale Babiak
https://braintales.net`,
    fileName: 'Grandma_Chapter_1.pdf',
  },
};

// ───────────────────────────────────────────────────────────
// Router
// ───────────────────────────────────────────────────────────
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
        // Upsert-ish subscriber
        const existing = await db
          .select()
          .from(subscribers)
          .where(eq(subscribers.email, input.email))
          .limit(1);

        if (existing.length > 0) {
          console.log('Subscriber already exists:', input.email);
          if (existing[0].initialChapter !== input.chapter) {
            await db
              .update(subscribers)
              .set({ initialChapter: input.chapter, chapterSentAt: new Date() })
              .where(eq(subscribers.email, input.email));
            console.log('✅ Updated subscriber chapter preference:', input.email);
          }
        } else {
          await db.insert(subscribers).values({
            email: input.email,
            initialChapter: input.chapter,
            source: input.source || 'chapter_download',
            isActive: 1,
            subscribedAt: new Date(),
            chapterSentAt: new Date(),
          });
          console.log('✅ New subscriber added to database:', input.email);
        }

        // Create transporter (with 465→587 fallback) & verify
        const transporter = await createTransporter();
        console.log('✅ SMTP connection verified');

        const chapterInfo = chapterContent[input.chapter];

        // Original file path behavior preserved
        const pdfPath = path.join(process.cwd(), 'chapters', chapterInfo.fileName);

        // Attach PDF if present
        let attachments: Array<{ filename: string; content: Buffer }> = [];
        try {
          await fs.access(pdfPath);
          const pdfBuffer = await fs.readFile(pdfPath);
          console.log(`PDF found: ${chapterInfo.fileName}`);
          attachments = [{ filename: chapterInfo.fileName, content: pdfBuffer }];
        } catch (err) {
          console.error(`❌ PDF not found: ${pdfPath}`);
          console.error('Please ensure the chapters folder exists with PDFs');
        }

        const fromAddress =
          process.env.EMAIL_USER || 'readerlist@braintales.net'; // keep this aligned with SMTP auth user/domain for DMARC // must match AUTH user

        
        const htmlBody = `
          <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.5;font-size:16px">
            <p>Thank you for your interest!</p>
            <p>${chapterInfo.text.replace(/
/g, '<br/>')}</p>
            <p>If the attachment is blocked, you can download your chapter securely here:</p>
            <p><a href="https://braintales.net/chapters/${chapterInfo.fileName}" target="_blank" rel="noopener">Direct download</a></p>
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0"/>
            <p style="font-size:12px;color:#6b7280">You received this email because you requested a sample chapter on braintales.net. Unsubscribe anytime.</p>
          </div>`;

        const info = await transporter.sendMail({
          from: fromAddress,
          to: input.email,
          subject: chapterInfo.subject,
          text: chapterInfo.text,
          attachments,
          html: htmlBody,
          headers: {
            'List-Unsubscribe': '<mailto:unsubscribe@braintales.net>, <https://braintales.net/unsubscribe?email=' + encodeURIComponent(input.email) + '>',
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
            'X-Entity-Ref-ID': 'sample_chapter'
          },
          envelope: {
            from: fromAddress,
            to: input.email
          }
        });

        console.log('✅ Email sent:', info.messageId);

        return {
          success: true,
          message: 'Thanks for subscribing! Check your email for your free chapter.',
        };
      } catch (error: any) {
        console.error('❌ SUBSCRIPTION ERROR:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);

        if (error.code === 'EAUTH') {
          console.error('🔐 Authentication failed - check EMAIL_PASS / mailbox credentials');
        } else if (error.code === 'ECONNECTION' || error.code === 'ECONNREFUSED') {
          console.error('🔌 Connection failed - check SMTP host/port');
        } else if (error.code === 'ETIMEDOUT' || error.code === 'ESOCKET') {
          console.error('⏱️ / 🔌 Timeout or socket reset - often rate-limit or port/secure mismatch');
        }

        throw new Error('Failed to process subscription. Please try again.');
      }
    }),

  testEmail: publicProcedure.mutation(async () => {
    try {
      const transporter = await createTransporter();
      console.log('✅ SMTP connection verified');

      const fromAddress =
        process.env.EMAIL_USER || 'readerlist@braintales.net'; // keep this aligned with SMTP auth user/domain for DMARC // match AUTH user

      
        const htmlBody = `
          <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.5;font-size:16px">
            <p>Thank you for your interest!</p>
            <p>${chapterInfo.text.replace(/
/g, '<br/>')}</p>
            <p>If the attachment is blocked, you can download your chapter securely here:</p>
            <p><a href="https://braintales.net/chapters/${chapterInfo.fileName}" target="_blank" rel="noopener">Direct download</a></p>
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0"/>
            <p style="font-size:12px;color:#6b7280">You received this email because you requested a sample chapter on braintales.net. Unsubscribe anytime.</p>
          </div>`;

        const info = await transporter.sendMail({
        from: fromAddress,
        to: fromAddress,
        subject: 'Test Email - BrainTales Subscription System',
        text: 'If you receive this, your email configuration is working correctly!',
        html: '<p>If you receive this, your <strong>email configuration</strong> is working correctly!</p>',
      });

      console.log('Message sent:', info.messageId);
      console.log('Response:', info.response);

      return { success: true, message: 'Test email sent successfully', messageId: info.messageId };
    } catch (error: any) {
      console.error('Test email error:', error);
      return { success: false, message: error.message, code: error.code };
    }
  }),
});
