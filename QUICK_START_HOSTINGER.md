# Quick Start Guide - Hostinger Deployment

This is a streamlined guide to get Afrigenomix running on Hostinger Cloud Startup as quickly as possible.

## Prerequisites

- Hostinger Cloud Startup account
- SSH access to your server
- Domain afrigenomix.com pointed to Hostinger
- Basic command line knowledge

---

## Step 1: Generate Secrets (Do This First!)

On your local machine, run these commands to generate secure secrets:

```bash
# Generate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate NEXTAUTH_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Save these secrets!** You'll need them in Step 3.

---

## Step 2: Set Up PostgreSQL Database

1. Log in to Hostinger control panel
2. Go to **Databases** → **PostgreSQL**
3. Click **Create Database**
   - Database name: `afrigenomix_prod`
   - Username: `afrigenomix_user`
   - Password: (generate a strong password and save it)
4. Note the database host (usually `localhost`)
5. Note the port (usually `5432`)

Your DATABASE_URL will be:
```
postgresql://afrigenomix_user:YOUR_DB_PASSWORD@localhost:5432/afrigenomix_prod
```

---

## Step 3: Deploy Code

SSH into your Hostinger server:

```bash
# Navigate to web root
cd /home/YOUR_USERNAME/public_html

# Clone the repository
git clone https://github.com/samwumi/afrigenomix.git
cd afrigenomix

# Install Node.js dependencies
npm install

# Create environment file
nano .env
```

Paste this configuration (replace placeholders with your actual values):

```env
# Database (from Step 2)
DATABASE_URL="postgresql://afrigenomix_user:YOUR_DB_PASSWORD@localhost:5432/afrigenomix_prod"

# Secrets (from Step 1)
JWT_SECRET="YOUR_GENERATED_JWT_SECRET"
NEXTAUTH_SECRET="YOUR_GENERATED_NEXTAUTH_SECRET"

# Application
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://afrigenomix.com"

# File Uploads
UPLOAD_DIR="/home/YOUR_USERNAME/uploads"
MAX_FILE_SIZE="10485760"

# Email (Optional - configure later if needed)
EMAIL_FROM="noreply@afrigenomix.com"
EMAIL_HOST="smtp.hostinger.com"
EMAIL_PORT="465"
EMAIL_USER="noreply@afrigenomix.com"
EMAIL_PASSWORD=""
EMAIL_SECURE="true"

# Payment (Optional - configure later)
PAYSTACK_SECRET_KEY=""
PAYSTACK_PUBLIC_KEY=""
```

Save the file (Ctrl+X, then Y, then Enter).

---

## Step 4: Initialize Database

```bash
# Run database migrations
npx prisma migrate deploy

# Seed the database with demo data
npx prisma db seed
```

This creates 5 demo accounts:
- **Admin**: admin@afrigenomix.com / Password123!
- **Customer 1**: john.doe@example.com / Password123!
- **Customer 2**: sarah.johnson@example.com / Password123!
- **Lab Partner**: lab@genetech.ng / Password123!
- **Collection Partner**: collection@medcenter.ng / Password123!

---

## Step 5: Build and Start Application

```bash
# Build the Next.js application
npm run build

# Install PM2 process manager (if not already installed)
npm install -g pm2

# Start the application
pm2 start npm --name "afrigenomix" -- start

# Save PM2 configuration
pm2 save

# Set PM2 to start on server reboot
pm2 startup
```

Verify the application is running:
```bash
pm2 status
```

You should see `afrigenomix` with status `online`.

---

## Step 6: Configure Web Server

1. In Hostinger control panel, go to **Website** settings
2. Configure **Reverse Proxy**:
   - Source: `afrigenomix.com`
   - Destination: `http://localhost:3000`
3. Enable **SSL Certificate** (free Let's Encrypt)
4. Enable **Force HTTPS**

---

## Step 7: Test Your Deployment

Visit **https://afrigenomix.com** and verify:

- ✅ Homepage loads correctly
- ✅ Login works (try admin@afrigenomix.com / Password123!)
- ✅ Dashboard displays correctly
- ✅ Blog and advocacy pages work
- ✅ SSL certificate is active (padlock icon)

---

## Important Post-Deployment Tasks

### 1. Change Default Passwords

**CRITICAL**: The seeded accounts use default passwords. Change them immediately!

1. Log in as admin: admin@afrigenomix.com / Password123!
2. Go to profile settings
3. Change password to something secure
4. Repeat for other accounts if you plan to use them

### 2. Verify Security

Test that role-based access control works:
- Regular customers cannot access `/admin`
- Customers can only see their own cases
- API endpoints require authentication

### 3. Configure Email (Optional)

To enable email notifications:
1. Create email account: noreply@afrigenomix.com (in Hostinger)
2. Update EMAIL_PASSWORD in `.env`
3. Restart application: `pm2 restart afrigenomix`

### 4. Configure Payments (Optional)

To enable Paystack payments (for Nigerian customers):
1. Create Paystack account: https://paystack.com
2. Get API keys (test keys to start)
3. Update PAYSTACK_SECRET_KEY and PAYSTACK_PUBLIC_KEY in `.env`
4. Restart application: `pm2 restart afrigenomix`

---

## Common PM2 Commands

```bash
# View application status
pm2 status

# View logs (useful for debugging)
pm2 logs afrigenomix

# Restart application (after code changes)
pm2 restart afrigenomix

# Stop application
pm2 stop afrigenomix

# Start application
pm2 start afrigenomix
```

---

## Troubleshooting

### Application won't start
```bash
# Check logs for errors
pm2 logs afrigenomix --lines 50

# Verify environment variables
cat .env

# Try rebuilding
npm run build
pm2 restart afrigenomix
```

### Database connection errors
```bash
# Test database connection
npx prisma db push

# Verify DATABASE_URL is correct in .env
cat .env | grep DATABASE_URL
```

### 502 Bad Gateway error
```bash
# Make sure application is running
pm2 status

# If stopped, start it
pm2 start afrigenomix

# Verify it's listening on port 3000
netstat -tuln | grep 3000
```

### Page loads but styles are broken
```bash
# Rebuild Next.js
npm run build
pm2 restart afrigenomix

# Clear browser cache and try again
```

---

## Updating the Application

When you make changes to the code:

```bash
# Pull latest changes from GitHub
cd /home/YOUR_USERNAME/public_html/afrigenomix
git pull origin main

# Install any new dependencies
npm install

# Run any new database migrations
npx prisma migrate deploy

# Rebuild application
npm run build

# Restart PM2
pm2 restart afrigenomix
```

---

## Need More Help?

- **Detailed Guide**: See `HOSTINGER_DEPLOYMENT.md`
- **Full Checklist**: See `DEPLOYMENT_CHECKLIST.md`
- **Hostinger Support**: https://www.hostinger.com/support
- **GitHub Issues**: https://github.com/samwumi/afrigenomix/issues

---

## Summary

You now have Afrigenomix running on Hostinger Cloud Startup with:

✅ PostgreSQL database  
✅ Production environment variables  
✅ SSL/HTTPS enabled  
✅ PM2 process management  
✅ Demo accounts for testing  
✅ Blog and advocacy features  
✅ SEO optimization  
✅ Complete DNA testing platform  

**Next Steps**: Change default passwords, configure email/payments, and start customizing content!
