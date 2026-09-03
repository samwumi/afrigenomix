#!/usr/bin/env node

/**
 * Database Connection Checker
 * Tests database connection and provides configuration help
 */

console.log('🔍 Afrigenomix Database Configuration Helper\n');
console.log('============================================\n');

// Check if DATABASE_URL exists
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ DATABASE_URL not found in environment variables\n');
  console.log('Please set DATABASE_URL in your .env file:\n');
  console.log('For PostgreSQL (recommended):');
  console.log('DATABASE_URL="postgresql://username:password@localhost:5432/database_name"\n');
  console.log('For MySQL (if PostgreSQL unavailable):');
  console.log('DATABASE_URL="mysql://username:password@localhost:3306/database_name"\n');
  process.exit(1);
}

console.log('✅ DATABASE_URL found in environment\n');

// Parse database type
let dbType = 'unknown';
if (databaseUrl.startsWith('postgresql://') || databaseUrl.startsWith('postgres://')) {
  dbType = 'PostgreSQL';
} else if (databaseUrl.startsWith('mysql://')) {
  dbType = 'MySQL';
}

console.log(`📊 Database Type: ${dbType}`);
console.log(`🔗 Connection String: ${databaseUrl.replace(/:[^:@]+@/, ':****@')}\n`);

// Check Prisma schema
const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
if (fs.existsSync(schemaPath)) {
  const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
  const providerMatch = schemaContent.match(/provider\s*=\s*"(\w+)"/);
  
  if (providerMatch) {
    const schemaProvider = providerMatch[1];
    console.log(`📝 Prisma Schema Provider: ${schemaProvider}\n`);
    
    // Check for mismatch
    if (dbType === 'PostgreSQL' && schemaProvider !== 'postgresql') {
      console.warn('⚠️  WARNING: Mismatch detected!');
      console.warn(`   DATABASE_URL uses PostgreSQL but schema uses "${schemaProvider}"\n`);
      console.log('🔧 To fix, update prisma/schema.prisma:');
      console.log('   datasource db {');
      console.log('     provider = "postgresql"');
      console.log('     url      = env("DATABASE_URL")');
      console.log('   }\n');
    } else if (dbType === 'MySQL' && schemaProvider !== 'mysql') {
      console.warn('⚠️  WARNING: Mismatch detected!');
      console.warn(`   DATABASE_URL uses MySQL but schema uses "${schemaProvider}"\n`);
      console.log('🔧 To fix, update prisma/schema.prisma:');
      console.log('   datasource db {');
      console.log('     provider = "mysql"');
      console.log('     url      = env("DATABASE_URL")');
      console.log('   }\n');
    } else {
      console.log('✅ Database type matches Prisma schema configuration\n');
    }
  }
}

console.log('📋 Next Steps:');
console.log('1. Verify database credentials are correct');
console.log('2. Test connection: npx prisma db push --preview-feature');
console.log('3. If successful, run migrations: npx prisma migrate deploy');
console.log('4. Seed database: npx prisma db seed\n');

console.log('💡 For Hostinger MySQL setup:');
console.log('   Database: u215495167_afrigenomix');
console.log('   User: u215495167_afrigenomix');
console.log('   Host: localhost');
console.log('   Port: 3306\n');

console.log('   Your DATABASE_URL should be:');
console.log('   DATABASE_URL="mysql://u215495167_afrigenomix:YOUR_PASSWORD@localhost:3306/u215495167_afrigenomix"\n');
