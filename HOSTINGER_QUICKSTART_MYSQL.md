# 🚀 Hostinger MySQL Quick Start

**Your Hostinger Database Info:**
- Database: `u215495167_afrigenomix`
- User: `u215495167_afrigenomix`
- Host: `localhost`
- Port: `3306`
- Website: `afrigenomix.com`

---

## Step 1: Generate Secrets (2 minutes)

On your **local machine**, run these commands:

```bash
# Generate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate NEXTAUTH_SECRET  
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Save these two strings!** You'll need them in Step 3.

---

## Step 2: SSH into Hostinger & Clone Code (5 minutes)

```bash
# SSH into your Hostinger server
ssh u215495167@your-server-ip

# Navigate to web root
cd /home/u215495167/public_html

# Clone repository
git clone https://github.com/samwumi/afrigenomix.git
cd afrigenomix

# Install dependencies
npm install
```

---

## Step 3: Configure Database (5 minutes)

### Update Prisma Schema

```bash
nano prisma/schema.prisma
```

**Find this line:**
```prisma
provider = "sqlite"
```

**Change to:**
```prisma
provider = "mysql"
```

Save (Ctrl+X, Y, Enter)

### Create Environment File

```bash
nano .env
```

**Paste this configuration:**

```env
# Database - Replace YOUR_MYSQL_PASSWORD with your actual password
DATABASE_URL="mysql://u215495167_afrigenomix:YOUR_MYSQL_PASSWORD@localhost:3306/u215495167_afrigenomix"

# Secrets - Replace with the strings from Step 1
JWT_SECRET="paste-first-generated-string-here"
NEXTAUTH_SECRET="paste-second-generated-string-here"

# Application
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://afrigenomix.com"

# File Uploads
UPLOAD_DIR="/home/u215495167/uploads"
MAX_FILE_SIZE="10485760"

# Email (configure later)
EMAIL_FROM="noreply@afrigenomix.com"
EMAIL_HOST="smtp.hostinger.com"
EMAIL_PORT="465"
EMAIL_USER="noreply@afrigenomix.com"
EMAIL_PASSWORD=""
EMAIL_SECURE="true"

# Payment (configure later)
PAYSTACK_SECRET_KEY=""
PAYSTACK_PUBLIC_KEY=""
```

**Important:** Replace these placeholders:
- `YOUR_MYSQL_PASSWORD` = Your MySQL database password
- `JWT_SECRET` = First generated string from Step 1
- `NEXTAUTH_SECRET` = Second generated string from Step 1

Save (Ctrl+X, Y, Enter)

---

## Step 4: Initialize Database (5 minutes)

```bash
# Generate Prisma Client
npx prisma generate

# Create all database tables
npx prisma db push

# Seed with demo data (creates test accounts)
npx prisma db seed
```

**Demo Accounts Created:**
- Admin: `admin@afrigenomix.com` / `Password123!`
- Customer: `john.doe@example.com` / `Password123!`
- Lab Partner: `lab@genetech.ng` / `Password123!`
- Collection Partner: `collection@medcenter.ng` / `Password123!`

---

## Step 5: Build & Start Application (5 minutes)

```bash
# Build Next.js application
npm run build

# Install PM2 (if not already installed)
npm install -g pm2

# Start application
pm2 start npm --name "afrigenomix" -- start

# Save PM2 configuration
pm2 save

# Set PM2 to auto-start on reboot
pm2 startup
```

**Verify it's running:**
```bash
pm2 status
```

You should see `afrigenomix` with status `online`.

---

## Step 6: Configure Web Server (5 minutes)

1. Log in to **Hostinger Control Panel**
2. Go to **Website** → **Advanced** → **Reverse Proxy** (or similar)
3. Configure:
   - **Source:** `afrigenomix.com`
   - **Destination:** `http://localhost:3000`
4. Go to **SSL/TLS**
5. Enable **SSL Certificate** (Let's Encrypt - free)
6. Enable **Force HTTPS**

---

## Step 7: Test Your Site (2 minutes)

Visit **https://afrigenomix.com**

✅ Homepage loads  
✅ Login works (try: `admin@afrigenomix.com` / `Password123!`)  
✅ Dashboard displays  
✅ Blog articles show  
✅ Advocacy page works  
✅ SSL padlock appears  

---

## ⚠️ IMPORTANT: Change Passwords Immediately!

The seeded accounts use default passwords. Change them now:

1. Log in as admin: `admin@afrigenomix.com` / `Password123!`
2. Go to profile/settings
3. Change password to something secure
4. Log out and test new password

---

## 🔧 Useful PM2 Commands

```bash
# View status
pm2 status

# View logs (helpful for debugging)
pm2 logs afrigenomix

# Restart application
pm2 restart afrigenomix

# Stop application
pm2 stop afrigenomix

# Start application
pm2 start afrigenomix
```

---

## 🐛 Troubleshooting

### Application won't start
```bash
pm2 logs afrigenomix --lines 50
```
Check for errors in the logs.

### Database connection failed
```bash
# Verify DATABASE_URL
cat .env | grep DATABASE_URL

# Test connection
npx prisma db push
```

### 502 Bad Gateway
```bash
# Check if app is running
pm2 status

# If stopped, restart it
pm2 restart afrigenomix

# Check if port 3000 is in use
netstat -tuln | grep 3000
```

### Wrong database provider error
```bash
# Make sure schema uses mysql
cat prisma/schema.prisma | grep provider

# Should show: provider = "mysql"
# If not, edit: nano prisma/schema.prisma
```

---

## 📧 Configure Email (Optional)

To enable email notifications:

1. Create email in Hostinger: `noreply@afrigenomix.com`
2. Get the password
3. Update `.env`:
   ```bash
   nano .env
   ```
4. Add password to `EMAIL_PASSWORD="your-password"`
5. Restart: `pm2 restart afrigenomix`

---

## 💳 Configure Payments (Optional)

To enable Paystack payments:

1. Sign up: https://paystack.com
2. Get test API keys from dashboard
3. Update `.env`:
   ```bash
   nano .env
   ```
4. Add keys:
   ```env
   PAYSTACK_SECRET_KEY="sk_test_xxxxx"
   PAYSTACK_PUBLIC_KEY="pk_test_xxxxx"
   ```
5. Restart: `pm2 restart afrigenomix`

---

## 🔄 Updating the App

When you make changes to the code:

```bash
cd /home/u215495167/public_html/afrigenomix
git pull origin main
npm install
npx prisma generate
npx prisma db push
npm run build
pm2 restart afrigenomix
```

---

## ✅ Your DATABASE_URL String

Based on your Hostinger setup, your DATABASE_URL should be:

```
mysql://u215495167_afrigenomix:YOUR_PASSWORD@localhost:3306/u215495167_afrigenomix
```

**Replace `YOUR_PASSWORD` with your actual MySQL database password.**

---

## 📚 Need More Help?

- **Detailed MySQL Guide:** `MYSQL_MIGRATION_GUIDE.md`
- **Full Deployment Guide:** `HOSTINGER_DEPLOYMENT.md`
- **Deployment Checklist:** `DEPLOYMENT_CHECKLIST.md`
- **Hostinger Support:** https://www.hostinger.com/support

---

**Total Time: ~30 minutes**

You're all set! 🎉
