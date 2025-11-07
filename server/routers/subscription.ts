import { z } from 'zod';
import { publicProcedure, router } from '../_core/trpc';
import * as nodemailer from 'nodemailer';  // ← FIXED: Changed from 'import nodemailer'
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

// Email transporter setup
const createTransporter = () => {
  const emailUser = process.env.EMAIL_USER || 'readerlist@braintales.net';
  const emailPass = process.env.EMAIL_PASS || '';  // ← USES EMAIL_PASS
  
  if (!emailPass) {
    console.error('❌ EMAIL_PASS environment variable not set!');
    console.error('Please set EMAIL_PASS in your environment variables');
    throw new Error('Email configuration missing');
  }
  
  console.log('📧 Creating email transporter for:', emailUser);
  console.log('📧 Email password length:', emailPass.length, 'characters');
  
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
      rejectUnauthorized: false, // Sometimes needed for Namecheap
      minVersion: 'TLSv1.2'
    },
    debug: true, // Enable debug output
    logger: true // Log to console
  });
  
  return transporter;
};

// Rest of the file continues unchanged...
