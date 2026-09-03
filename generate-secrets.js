#!/usr/bin/env node

/**
 * Generate Secure Secrets for Afrigenomix
 * Run: node generate-secrets.js
 */

const crypto = require('crypto');

console.log('\n🔐 Afrigenomix Secure Secret Generator\n');
console.log('=====================================\n');

const jwtSecret = crypto.randomBytes(32).toString('hex');
const nextAuthSecret = crypto.randomBytes(32).toString('hex');

console.log('✅ Generated JWT_SECRET:');
console.log(jwtSecret);
console.log('\n✅ Generated NEXTAUTH_SECRET:');
console.log(nextAuthSecret);

console.log('\n📋 Add these to your .env file:\n');
console.log('JWT_SECRET="' + jwtSecret + '"');
console.log('NEXTAUTH_SECRET="' + nextAuthSecret + '"');

console.log('\n✅ Complete .env template:\n');
console.log('# Replace YOUR_MYSQL_PASSWORD with your actual database password');
console.log('DATABASE_URL="mysql://u215495167_afrigenomix:YOUR_MYSQL_PASSWORD@localhost:3306/u215495167_afrigenomix"');
console.log('JWT_SECRET="' + jwtSecret + '"');
console.log('NEXTAUTH_SECRET="' + nextAuthSecret + '"');
console.log('NODE_ENV="production"');
console.log('NEXT_PUBLIC_APP_URL="https://afrigenomix.com"');
console.log('UPLOAD_DIR="/home/u215495167/uploads"');
console.log('MAX_FILE_SIZE="10485760"');
console.log('EMAIL_FROM="noreply@afrigenomix.com"');
console.log('EMAIL_HOST="smtp.hostinger.com"');
console.log('EMAIL_PORT="465"');
console.log('EMAIL_USER="noreply@afrigenomix.com"');
console.log('EMAIL_PASSWORD=""');
console.log('EMAIL_SECURE="true"');
console.log('PAYSTACK_SECRET_KEY=""');
console.log('PAYSTACK_PUBLIC_KEY=""');

console.log('\n📝 Save this to .env file on your server\n');
console.log('⚠️  IMPORTANT: Replace YOUR_MYSQL_PASSWORD with your actual password!\n');
