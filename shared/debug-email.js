#!/usr/bin/env node
/**
 * Email Configuration Debug Script
 * Run this on Render to test your email settings
 * Usage: node debug-email.js
 */

const nodemailer = require('nodemailer');

async function testEmailConfig() {
  console.log('🔍 Email Configuration Debugger\n');
  console.log('================================\n');
  
  // Check environment variables
  const emailUser = process.env.EMAIL_USER || 'readerlist@braintales.net';
  const emailPass = process.env.EMAIL_PASS;
  
  console.log('📧 Email User:', emailUser);
  console.log('🔑 Password Set:', emailPass ? `Yes (${emailPass.length} chars)` : '❌ NO - THIS IS THE PROBLEM!');
  
  if (!emailPass) {
    console.error('\n❌ ERROR: EMAIL_PASS environment variable is not set!');
    console.error('Fix: Go to Render Dashboard > Environment > Add EMAIL_PASS');
    process.exit(1);
  }
  
  // Test different configurations
  const configs = [
    {
      name: 'Namecheap Standard',
      host: 'mail.privateemail.com',
      port: 587,
      secure: false,
      tls: { rejectUnauthorized: false }
    },
    {
      name: 'Namecheap SSL',
      host: 'mail.privateemail.com',
      port: 465,
      secure: true,
      tls: { rejectUnauthorized: false }
    }
  ];
  
  for (const config of configs) {
    console.log(`\n🧪 Testing: ${config.name}`);
    console.log(`   Host: ${config.host}:${config.port}`);
    console.log(`   Secure: ${config.secure}`);
    
    const transporter = nodemailer.createTransporter({
      ...config,
      auth: {
        user: emailUser,
        pass: emailPass
      },
      debug: true,
      logger: true
    });
    
    try {
      await transporter.verify();
      console.log('✅ SUCCESS! This configuration works.');
      
      // Try sending a test email
      console.log('📬 Sending test email...');
      const result = await transporter.sendMail({
        from: `"Test" <${emailUser}>`,
        to: emailUser, // Send to self
        subject: 'Test Email from Braintales Debug',
        text: 'If you receive this, email is working!',
        html: '<p>If you receive this, <b>email is working!</b></p>'
      });
      
      console.log('✅ Test email sent! Message ID:', result.messageId);
      console.log('\n🎉 Use this configuration in your app!\n');
      break;
      
    } catch (error) {
      console.error('❌ Failed:', error.message);
      if (error.code === 'EAUTH') {
        console.error('   → Authentication failed. Check password.');
      } else if (error.code === 'ECONNREFUSED') {
        console.error('   → Connection refused. Check host/port.');
      }
    }
  }
  
  console.log('\n================================');
  console.log('Debug complete!\n');
}

testEmailConfig().catch(console.error);
