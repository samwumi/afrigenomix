# Afrigenomix Deployment on Hostinger Cloud Startup

## 🌐 Environment Variables for Production

### Required Variables (Must Configure)

```bash
# Database - PostgreSQL (Hostinger provides this)
DATABASE_URL="postgresql://username:password@host:5432/afrigenomix_db"

# Authentication - CRITICAL: Generate secure secrets!
JWT_SECRET="your-very-secure-jwt-secret-min-32-characters-long"
NEXTAUTH_SECRET="your-very-secure-nextauth-secret-min-32-characters"

# Application URLs
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://afrigenomix.com"
NEXTAUTH_URL="https://afrigenomix.com"

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR="/home/your-username/uploads"
```

### Optional Variables (Configure When Ready)

```bash
# Email Configuration (Use Hostinger email or SMTP)
EMAIL_FROM="noreply@afrigenomix.com"
EMAIL_HOST="smtp.hostinger.com"
EMAIL_PORT="587"
EMAIL_USER="noreply@afrigenomix.com"
EMAIL_PASSWORD="your-email-password"

# Payment Provider (Paystack recommended for Nigeria)
PAYMENT_PUBLIC_KEY="pk_live_xxxxxxxxxxxxx"
PAYMENT_SECRET_KEY="sk_live_xxxxxxxxxxxxx"

# SMS/WhatsApp (Optional - for notifications)
WHATSAPP_API_KEY=""
SMS_API_KEY=""
```

---

## 🔐 How to Generate Secure Secrets

### For JWT_SECRET and NEXTAUTH_SECRET:

Run these commands on your local machine:

```bash
# Option 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 2: Using OpenSSL
openssl rand -hex 32

# Option 3: Online generator
# Visit: https://generate-secret.vercel.app/32
```

**Example output:**
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

Use two different secrets - one for JWT_SECRET and one for NEXTAUTH_SECRET!

---

## 📋 Step-by-Step Hostinger Deployment

### Step 1: Setup PostgreSQL Database

1. **Login to Hostinger Panel** (hPanel)
2. **Go to Databases → PostgreSQL Databases**
3. **Create New Database**:
   - Database Name: `afrigenomix_db`
   - Username: Create or use existing
   - Password: Generate strong password
   - Save credentials!

4. **Get Connection Details**:
   ```
   Host: Usually something like: postgres.hostinger.com or localhost
   Port: 5432 (default)
   Database: afrigenomix_db
   Username: your_username
   Password: your_password
   ```

5. **Create DATABASE_URL**:
   ```
   postgresql://username:password@host:5432/afrigenomix_db
   ```

### Step 2: Deploy Application Files

#### Option A: Git Deployment (Recommended)

1. **SSH into your Hostinger server**:
   ```bash
   ssh u123456789@your-server.hostinger.com
   ```

2. **Navigate to public_html or domains folder**:
   ```bash
   cd ~/domains/afrigenomix.com/public_html
   # or
   cd ~/public_html
   ```

3. **Clone your repository**:
   ```bash
   git clone https://github.com/samwumi/afrigenomix.git .
   ```

4. **Install dependencies**:
   ```bash
   npm install
   ```

#### Option B: File Manager Upload

1. **Build locally first**:
   ```bash
   npm run build
   ```

2. **Upload via Hostinger File Manager**:
   - Upload all files except `node_modules` and `.next`
   - Upload `.env` separately (see Step 3)

3. **SSH in and install**:
   ```bash
   npm install
   npm run build
   ```

### Step 3: Configure Environment Variables

**Create `.env` file on the server**:

```bash
nano .env
```

**Paste your production variables**:

```bash
# Database (Replace with your actual Hostinger PostgreSQL details)
DATABASE_URL="postgresql://afrigenomix_user:YOUR_PASSWORD@localhost:5432/afrigenomix_db"

# Authentication (Use the secrets you generated)
JWT_SECRET="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2"
NEXTAUTH_SECRET="f2e1d0c9b8a7z6y5x4w3v2u1t0s9r8q7p6o5n4m3l2k1j0i9h8g7f6e5d4c3b2a1"

# Application
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://afrigenomix.com"
NEXTAUTH_URL="https://afrigenomix.com"

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR="/home/u123456789/uploads"

# Email (Hostinger SMTP)
EMAIL_FROM="noreply@afrigenomix.com"
EMAIL_HOST="smtp.hostinger.com"
EMAIL_PORT="587"
EMAIL_USER="noreply@afrigenomix.com"
EMAIL_PASSWORD="your-email-password"

# Payment (Add when ready)
PAYMENT_PUBLIC_KEY=""
PAYMENT_SECRET_KEY=""

# SMS/WhatsApp (Add when ready)
WHATSAPP_API_KEY=""
SMS_API_KEY=""
```

**Save and exit**: Ctrl+X, then Y, then Enter

**Set proper permissions**:
```bash
chmod 600 .env
```

### Step 4: Setup Database Schema

Run Prisma migrations to create database tables:

```bash
# Generate Prisma client
npx prisma generate

# Run migrations to create tables
npx prisma migrate deploy

# Seed the database with demo data
npx prisma db seed
```

### Step 5: Build and Start Application

```bash
# Build the Next.js application
npm run build

# Start with PM2 (recommended for production)
npm install -g pm2
pm2 start npm --name "afrigenomix" -- start
pm2 save
pm2 startup
```

### Step 6: Configure Node.js Application

In Hostinger hPanel:

1. **Go to: Advanced → Node.js**
2. **Create Application**:
   - Node.js version: 18.x or 20.x
   - Application mode: Production
   - Application root: `/domains/afrigenomix.com/public_html` (or your path)
   - Application URL: `afrigenomix.com`
   - Application startup file: `server.js` or use PM2

3. **Set Environment Variables** (in Hostinger panel):
   - Add each variable from your .env file
   - Or point to .env file location

### Step 7: Setup SSL Certificate

1. **In hPanel → SSL**
2. **Install SSL for afrigenomix.com**
3. **Force HTTPS**:
   - Go to Domains
   - Click "Manage"
   - Enable "Force HTTPS"

### Step 8: Create Upload Directory

```bash
mkdir -p ~/uploads
chmod 755 ~/uploads
```

---

## 🔄 Update Process (After Initial Deployment)

When you push updates to GitHub:

```bash
# SSH into server
ssh u123456789@your-server.hostinger.com

# Navigate to application
cd ~/domains/afrigenomix.com/public_html

# Pull latest changes
git pull origin main

# Install any new dependencies
npm install

# Rebuild
npm run build

# Restart application
pm2 restart afrigenomix
```

---

## 📊 Monitor Application

```bash
# View logs
pm2 logs afrigenomix

# Check status
pm2 status

# Monitor resources
pm2 monit
```

---

## ⚙️ Hostinger-Specific Configuration

### Database Connection Pooling

Update `prisma/schema.prisma` for production:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // Add connection pooling for better performance
  relationMode = "prisma"
}
```

### Node.js Version

Ensure you're using Node 18+ or 20+:

```bash
node --version
```

If you need to change versions, use nvm:

```bash
nvm install 20
nvm use 20
```

---

## 🔍 Troubleshooting

### Issue: Database Connection Failed

**Solution**: Check your DATABASE_URL format:
```
postgresql://username:password@host:5432/database?schema=public
```

Ensure:
- Username is correct
- Password has no special characters (URL encode if needed)
- Host is correct (might be `localhost` or Hostinger's server)
- Port is 5432
- Database exists

### Issue: Build Fails

**Solution**: Check Node.js version:
```bash
node --version  # Should be 18.x or 20.x
npm --version
```

Clear cache and rebuild:
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Issue: Permission Denied

**Solution**: Fix file permissions:
```bash
chmod -R 755 ~/domains/afrigenomix.com/public_html
chmod 600 .env
```

### Issue: 502 Bad Gateway

**Solution**: Check if application is running:
```bash
pm2 status
pm2 restart afrigenomix
```

Check logs:
```bash
pm2 logs afrigenomix --lines 100
```

---

## 🚀 Production Checklist

Before going live, verify:

- [ ] PostgreSQL database created and accessible
- [ ] All environment variables set (especially JWT secrets)
- [ ] DATABASE_URL points to production database
- [ ] Prisma migrations run successfully
- [ ] Database seeded with initial data
- [ ] Application builds without errors
- [ ] PM2 process running
- [ ] SSL certificate installed and HTTPS forced
- [ ] Domain points to correct server
- [ ] Upload directory created with proper permissions
- [ ] Admin account created and accessible
- [ ] Email configuration tested
- [ ] All demo accounts work

---

## 📧 Email Configuration (Hostinger)

Hostinger provides email hosting. Configure it:

1. **Create email account**: noreply@afrigenomix.com
2. **Get SMTP details** from Hostinger email settings
3. **Update .env**:
   ```
   EMAIL_HOST="smtp.hostinger.com"
   EMAIL_PORT="587"
   EMAIL_USER="noreply@afrigenomix.com"
   EMAIL_PASSWORD="your-password"
   ```

---

## 💳 Payment Integration (Nigeria)

### Paystack (Recommended for Nigeria)

1. **Sign up**: https://paystack.com
2. **Get API keys** from Dashboard → Settings → API Keys
3. **Add to .env**:
   ```
   PAYMENT_PUBLIC_KEY="pk_live_xxxxx"
   PAYMENT_SECRET_KEY="sk_live_xxxxx"
   ```

### Flutterwave (Alternative)

Similar process at https://flutterwave.com

---

## 📱 Domain Configuration

If using afrigenomix.com:

1. **Point DNS to Hostinger**:
   - A Record: @ → Your Hostinger IP
   - CNAME Record: www → afrigenomix.com

2. **Wait for DNS propagation** (up to 24-48 hours)

3. **Verify**:
   ```bash
   ping afrigenomix.com
   ```

---

## 🔒 Security Best Practices

1. **Never commit .env to git**
2. **Use strong, unique secrets** for production
3. **Enable Hostinger firewall**
4. **Set up regular backups**
5. **Monitor logs regularly**
6. **Keep dependencies updated**
7. **Use PM2 for process management**
8. **Enable rate limiting** (already configured in app)

---

## 📞 Support

- **Hostinger Support**: Live chat in hPanel
- **GitHub Issues**: https://github.com/samwumi/afrigenomix/issues
- **Documentation**: Check all .md files in project root

---

**Ready to deploy!** 🚀

Save your environment variables securely and follow the steps above.
