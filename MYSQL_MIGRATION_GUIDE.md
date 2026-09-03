# MySQL Migration Guide for Hostinger

Your Hostinger account has MySQL database support. This guide will help you convert Afrigenomix from PostgreSQL/SQLite to MySQL.

## Your Hostinger Database Info

```
Database Name: u215495167_afrigenomix
Username: u215495167_afrigenomix
Host: localhost
Port: 3306
Website: afrigenomix.com
```

---

## Step 1: Update Prisma Schema

Edit `prisma/schema.prisma` and change the datasource:

**Find this:**
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

**Replace with:**
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

---

## Step 2: Update Environment Variables

Create/update your `.env` file on the server:

```env
# Database (MySQL on Hostinger)
DATABASE_URL="mysql://u215495167_afrigenomix:YOUR_DB_PASSWORD@localhost:3306/u215495167_afrigenomix"

# Authentication (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET="your-secure-32-char-jwt-secret"
NEXTAUTH_SECRET="your-secure-32-char-nextauth-secret"

# Application
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://afrigenomix.com"

# File Uploads
UPLOAD_DIR="/home/u215495167/uploads"
MAX_FILE_SIZE="10485760"

# Email (Hostinger SMTP)
EMAIL_FROM="noreply@afrigenomix.com"
EMAIL_HOST="smtp.hostinger.com"
EMAIL_PORT="465"
EMAIL_USER="noreply@afrigenomix.com"
EMAIL_PASSWORD=""
EMAIL_SECURE="true"

# Payment (Paystack - Optional)
PAYSTACK_SECRET_KEY=""
PAYSTACK_PUBLIC_KEY=""
```

**Replace `YOUR_DB_PASSWORD` with your actual MySQL password!**

---

## Step 3: Handle MySQL-Specific Differences

MySQL has some differences from PostgreSQL/SQLite. Update these field types:

### DateTime with Precision

In `prisma/schema.prisma`, MySQL doesn't support `@default(now())` on all DateTime fields the same way. The schema should work, but if you encounter issues, note:

- `@default(now())` works fine
- `@updatedAt` works fine
- MySQL uses `DATETIME` type (not `TIMESTAMP` with timezone)

### JSON Fields

MySQL 5.7+ supports JSON natively. The existing JSON fields should work:
```prisma
metadata      Json?
```

### Text Fields

For large text fields, MySQL uses these types:
- `String` → `VARCHAR(191)` (default)
- `String @db.Text` → `TEXT` (up to 64KB)
- `String @db.MediumText` → `MEDIUMTEXT` (up to 16MB)
- `String @db.LongText` → `LONGTEXT` (up to 4GB)

If you need longer text fields, add `@db.Text`:
```prisma
content String @db.Text
```

---

## Step 4: Deploy to Hostinger

### SSH into your server:

```bash
# Navigate to your project
cd /home/u215495167/public_html/afrigenomix

# Pull latest changes (if you committed the schema update)
git pull origin main

# Or manually edit prisma/schema.prisma
nano prisma/schema.prisma
# Change provider from "sqlite" to "mysql"

# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Create database tables (this will create all tables)
npx prisma db push

# Seed the database with demo data
npx prisma db seed

# Build the application
npm run build

# Start with PM2
pm2 start npm --name "afrigenomix" -- start
pm2 save
```

---

## Step 5: Verify Database

Check if tables were created successfully:

```bash
# Using Prisma Studio (opens web interface)
npx prisma studio

# Or check in Hostinger phpMyAdmin
# Go to Databases → phpMyAdmin
# Select u215495167_afrigenomix
# You should see all tables created
```

Expected tables:
- users
- customer_profiles
- laboratories
- test_types
- cases
- documents
- appointments
- samples
- quotes
- payments
- results
- articles
- advocacy_campaigns
- audit_logs
- notifications
- And more...

---

## Step 6: Test the Application

1. Visit https://afrigenomix.com
2. Try logging in with demo accounts:
   - admin@afrigenomix.com / Password123!
   - john.doe@example.com / Password123!
3. Test creating a new case
4. Test uploading documents
5. Check admin dashboard

---

## Common MySQL Issues & Solutions

### Issue 1: "Row size too large"

**Error:** `Row size too large. The maximum row size for the used table type...`

**Solution:** Some text fields might be too long. Update schema:
```prisma
// Change large text fields
description String @db.Text
content     String @db.LongText
```

Then run: `npx prisma db push --force-reset`

### Issue 2: "Specified key was too long"

**Error:** `Specified key was too long; max key length is 767 bytes`

**Solution:** This happens with unique indexes on long strings. Update schema:
```prisma
email String @unique @db.VarChar(191)
slug  String @unique @db.VarChar(191)
```

### Issue 3: Charset Issues

**Solution:** Ensure MySQL database uses UTF-8:
```sql
ALTER DATABASE u215495167_afrigenomix CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Issue 4: Connection Timeout

**Error:** `Can't reach database server at localhost:3306`

**Solution:** 
1. Check MySQL is running: `systemctl status mysql`
2. Verify credentials in .env
3. Test connection: `npx prisma db pull`

---

## MySQL Performance Optimization

After deployment, optimize MySQL:

### Add Indexes (if needed)

```sql
-- Add indexes for frequently queried fields
ALTER TABLE cases ADD INDEX idx_customer_id (customerId);
ALTER TABLE cases ADD INDEX idx_status (status);
ALTER TABLE articles ADD INDEX idx_published (publishedAt);
ALTER TABLE articles ADD INDEX idx_category (category);
```

### Configure MySQL

In Hostinger, MySQL is pre-configured, but you can request optimization for:
- `innodb_buffer_pool_size` (for better performance)
- `max_connections` (if you have many concurrent users)

---

## Backup Strategy

### Automated Backups

Hostinger usually provides automated daily backups. Verify in your control panel:
- **Databases** → **Backups**

### Manual Backup

```bash
# Export database
mysqldump -u u215495167_afrigenomix -p u215495167_afrigenomix > backup.sql

# Import database (if needed)
mysql -u u215495167_afrigenomix -p u215495167_afrigenomix < backup.sql
```

---

## Alternative: Check for PostgreSQL Support

**Before converting to MySQL, verify if Hostinger supports PostgreSQL:**

1. Log in to Hostinger control panel
2. Go to **Databases**
3. Look for **PostgreSQL** option
4. If available, create PostgreSQL database instead

**PostgreSQL is preferred because:**
- Better JSON support
- More advanced features
- Original development database
- No schema conversion needed

**If PostgreSQL is available:**
```env
DATABASE_URL="postgresql://u215495167_afrigenomix:PASSWORD@localhost:5432/u215495167_afrigenomix"
```

And update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

---

## Summary

**For MySQL deployment:**

1. ✅ Update schema provider to "mysql"
2. ✅ Set DATABASE_URL with mysql:// connection string
3. ✅ Run `npx prisma generate`
4. ✅ Run `npx prisma db push`
5. ✅ Run `npx prisma db seed`
6. ✅ Build and start application
7. ✅ Test thoroughly

**Your MySQL DATABASE_URL:**
```
mysql://u215495167_afrigenomix:YOUR_PASSWORD@localhost:3306/u215495167_afrigenomix
```

---

Need help? Check troubleshooting section or contact Hostinger support to confirm database options.
