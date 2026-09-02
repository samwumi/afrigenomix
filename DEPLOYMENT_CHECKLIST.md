# Afrigenomix Deployment Checklist for Hostinger

Use this checklist to deploy Afrigenomix to Hostinger Cloud Startup.

## Pre-Deployment

- [ ] **Hostinger Account Setup**
  - [ ] Log in to Hostinger control panel
  - [ ] Navigate to Cloud Startup hosting panel
  - [ ] Note your server IP address

- [ ] **Domain Configuration**
  - [ ] Point afrigenomix.com DNS to Hostinger IP
  - [ ] Wait for DNS propagation (can take 24-48 hours)
  - [ ] Verify domain is accessible

## Database Setup

- [ ] **Create PostgreSQL Database**
  - [ ] In Hostinger panel, go to Databases → PostgreSQL
  - [ ] Create new database: `afrigenomix_prod`
  - [ ] Create database user: `afrigenomix_user`
  - [ ] Generate strong password (save securely)
  - [ ] Grant all privileges to user
  - [ ] Note the database host (usually `localhost` or IP address)
  - [ ] Note the port (usually `5432`)

- [ ] **Construct DATABASE_URL**
  ```
  postgresql://afrigenomix_user:YOUR_PASSWORD@HOST:5432/afrigenomix_prod
  ```

## Environment Variables

- [ ] **Generate Secure Secrets**
  
  Run these commands locally to generate secure secrets:
  ```bash
  # For JWT_SECRET
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  
  # For NEXTAUTH_SECRET
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

- [ ] **Create .env File on Server**
  
  Create `/home/YOUR_USERNAME/public_html/.env` with:
  
  ```env
  # Database
  DATABASE_URL="postgresql://afrigenomix_user:YOUR_DB_PASSWORD@localhost:5432/afrigenomix_prod"
  
  # Authentication (use the generated secrets above)
  JWT_SECRET="YOUR_GENERATED_JWT_SECRET_HERE"
  NEXTAUTH_SECRET="YOUR_GENERATED_NEXTAUTH_SECRET_HERE"
  
  # Application
  NODE_ENV="production"
  NEXT_PUBLIC_APP_URL="https://afrigenomix.com"
  
  # File Uploads
  UPLOAD_DIR="/home/YOUR_USERNAME/uploads"
  MAX_FILE_SIZE="10485760"
  
  # Email (Hostinger SMTP)
  EMAIL_FROM="noreply@afrigenomix.com"
  EMAIL_HOST="smtp.hostinger.com"
  EMAIL_PORT="465"
  EMAIL_USER="noreply@afrigenomix.com"
  EMAIL_PASSWORD="YOUR_EMAIL_PASSWORD"
  EMAIL_SECURE="true"
  
  # Payment (Paystack for Nigeria)
  PAYSTACK_SECRET_KEY="sk_test_YOUR_KEY_HERE"
  PAYSTACK_PUBLIC_KEY="pk_test_YOUR_KEY_HERE"
  ```

- [ ] **Verify Environment Variables**
  - [ ] All secrets are unique and secure
  - [ ] DATABASE_URL matches your PostgreSQL credentials
  - [ ] NEXT_PUBLIC_APP_URL is correct domain
  - [ ] Email credentials are valid

## Code Deployment

- [ ] **Deploy Code to Server**
  
  Choose one method:
  
  ### Method 1: Git Clone (Recommended)
  ```bash
  cd /home/YOUR_USERNAME/public_html
  git clone https://github.com/samwumi/afrigenomix.git
  cd afrigenomix
  ```
  
  ### Method 2: File Manager Upload
  - Download ZIP from GitHub
  - Upload via Hostinger File Manager
  - Extract to public_html

- [ ] **Install Dependencies**
  ```bash
  cd /home/YOUR_USERNAME/public_html/afrigenomix
  npm install
  ```

## Database Migration

- [ ] **Run Prisma Migrations**
  ```bash
  npx prisma migrate deploy
  ```

- [ ] **Seed Database**
  ```bash
  npx prisma db seed
  ```

- [ ] **Verify Database**
  ```bash
  npx prisma studio
  ```
  Open Prisma Studio to verify data was seeded correctly

## Build Application

- [ ] **Build Next.js**
  ```bash
  npm run build
  ```

- [ ] **Verify Build Success**
  - [ ] No build errors
  - [ ] `.next` folder created
  - [ ] All pages compiled successfully

## Start Application

- [ ] **Install PM2 (if not installed)**
  ```bash
  npm install -g pm2
  ```

- [ ] **Start Application**
  ```bash
  pm2 start npm --name "afrigenomix" -- start
  pm2 save
  pm2 startup
  ```

- [ ] **Verify PM2 Status**
  ```bash
  pm2 status
  ```
  Should show `afrigenomix` with status `online`

## Web Server Configuration

- [ ] **Configure Nginx/Apache**
  
  In Hostinger panel, configure reverse proxy:
  - Source: afrigenomix.com
  - Destination: http://localhost:3000
  - Enable SSL certificate

- [ ] **Enable HTTPS**
  - [ ] Install SSL certificate (Hostinger provides free Let's Encrypt)
  - [ ] Force HTTPS redirect
  - [ ] Verify HTTPS works

## Post-Deployment Testing

- [ ] **Test Homepage**
  - [ ] Visit https://afrigenomix.com
  - [ ] Verify homepage loads correctly
  - [ ] Check responsive design on mobile

- [ ] **Test Authentication**
  - [ ] Try logging in with admin account:
    - Email: `admin@afrigenomix.com`
    - Password: `Password123!`
  - [ ] Verify JWT token is generated
  - [ ] Check dashboard loads

- [ ] **Test All Demo Accounts**
  - [ ] Admin: admin@afrigenomix.com
  - [ ] Customer 1: john.doe@example.com
  - [ ] Customer 2: sarah.johnson@example.com
  - [ ] Lab Partner: lab@genetech.ng
  - [ ] Collection Partner: collection@medcenter.ng
  - Password for all: `Password123!`

- [ ] **Test Core Features**
  - [ ] Customer Dashboard
  - [ ] Case Management
  - [ ] Document Upload
  - [ ] Appointment Booking
  - [ ] Admin Dashboard
  - [ ] Laboratory Management
  - [ ] Blog/Content
  - [ ] Advocacy Hub

- [ ] **Test Security**
  - [ ] Verify RBAC (customers can't access admin)
  - [ ] Verify customers can only see their own cases
  - [ ] Verify API authentication works
  - [ ] Check audit logs are being created

## SEO Configuration

- [ ] **Verify SEO Elements**
  - [ ] View page source and check meta tags
  - [ ] Verify Open Graph tags
  - [ ] Test social sharing links
  - [ ] Check robots.txt: https://afrigenomix.com/robots.txt
  - [ ] Check sitemap: https://afrigenomix.com/sitemap.xml

- [ ] **Submit to Search Engines**
  - [ ] Google Search Console
  - [ ] Bing Webmaster Tools
  - [ ] Submit sitemap.xml

## Monitoring & Maintenance

- [ ] **Set Up Monitoring**
  - [ ] Configure PM2 monitoring
  - [ ] Set up error logging
  - [ ] Configure email alerts for errors

- [ ] **Regular Tasks**
  - [ ] Monitor PM2 logs: `pm2 logs afrigenomix`
  - [ ] Check disk space
  - [ ] Monitor database size
  - [ ] Review audit logs
  - [ ] Update dependencies regularly

## Troubleshooting

If something goes wrong:

1. **Check PM2 Logs**
   ```bash
   pm2 logs afrigenomix --lines 100
   ```

2. **Check Environment Variables**
   ```bash
   cat .env
   ```

3. **Restart Application**
   ```bash
   pm2 restart afrigenomix
   ```

4. **Check Database Connection**
   ```bash
   npx prisma db push
   ```

5. **Rebuild Application**
   ```bash
   npm run build
   pm2 restart afrigenomix
   ```

## Important Security Notes

- [ ] **Change Default Passwords**
  - [ ] Log in to admin account
  - [ ] Change admin password immediately
  - [ ] Update all demo account passwords

- [ ] **Secure File Permissions**
  ```bash
  chmod 600 .env
  chmod 755 uploads
  ```

- [ ] **Review Security Settings**
  - [ ] Verify JWT_SECRET is secure (32+ characters)
  - [ ] Verify rate limiting is working
  - [ ] Test CORS configuration
  - [ ] Review audit logs regularly

## Production Optimization

- [ ] **Performance**
  - [ ] Enable Gzip compression
  - [ ] Configure caching headers
  - [ ] Optimize images
  - [ ] Enable CDN if needed

- [ ] **Backup**
  - [ ] Set up automated database backups
  - [ ] Configure file upload backups
  - [ ] Document restore procedures

## Support Contacts

- **Hostinger Support**: https://www.hostinger.com/support
- **GitHub Repository**: https://github.com/samwumi/afrigenomix
- **Documentation**: See HOSTINGER_DEPLOYMENT.md

---

## Quick Reference

**Start Application**: `pm2 start npm --name "afrigenomix" -- start`  
**Stop Application**: `pm2 stop afrigenomix`  
**Restart Application**: `pm2 restart afrigenomix`  
**View Logs**: `pm2 logs afrigenomix`  
**View Status**: `pm2 status`  
**Database Migrations**: `npx prisma migrate deploy`  
**View Database**: `npx prisma studio`

---

**Deployment Date**: _________________  
**Deployed By**: _________________  
**Production URL**: https://afrigenomix.com  
**Server IP**: _________________
