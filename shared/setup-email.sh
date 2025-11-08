#!/bin/bash

# Post-deployment setup script
# Run this after deploying to install nodemailer

echo "Installing nodemailer for email functionality..."
pnpm add nodemailer

echo "✅ Nodemailer installed successfully!"
echo ""
echo "Next steps:"
echo "1. Make sure your .env file has EMAIL_USER and EMAIL_PASS set"
echo "2. Restart your server: pnpm dev or pnpm start"
echo "3. Test the email capture functionality"
