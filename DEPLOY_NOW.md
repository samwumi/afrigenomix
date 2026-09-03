# 🚀 Deploy Afrigenomix NOW - Copy & Paste Commands

Your database password: `Afrigenomix@2026`

---

## Step 1: Generate Secrets (Run on Your Local Machine)

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Copy both strings and keep them handy!**

---

## Step 2: SSH into Hostinger

```bash
ssh u215495167@your-hostinger-ip
```

---

## Step 3: Clone & Setup (Copy & Paste)

```bash
cd /home/u215495167/public_html
git clone https://github.com/samwumi/afrigenomix.git
cd afrigenomix
npm install
```

---

## Step 4: Update Prisma Schema

```bash
nano prisma/schema.prisma
```

**Find this line (around line 8):**
```prisma
provider = "sqlite"
```

**Change to:**
```prisma
provider = "mysql"
```

**Save:** Press `Ctrl+X`, then `Y`, then `Enter`

---

## Step 5: Create Environment File

```bash
nano .env
```

**Paste this (replace JWT_SECRET and NEXTAUTH_SECRET with the strings from Step 1):**

```env
DATABASE_URL="mysql://u215495167_afrigenomix:Afrigenomix@2026@localhost:3306/u215495167_afrigenomix"

JWT_SECRET="paste-first-string-here"
NEXTAUTH_SECRET="paste-second-string-here"

NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://afrigenomix.com"

UPLOAD_DIR="/home/u215495167/uploads"
MAX_FILE_SIZE="10485760"

EMAIL_FROM="noreply@afrigenomix.com"
EMAIL_HOST="smtp.hostinger.com"
EMAIL_PORT="465"
EMAIL_USER="noreply@afrigenomix.com"
EMAIL_PASSWORD=""
EMAIL_SECURE="true"

PAYSTACK_SECRET_KEY=""
PAYSTACK_PUBLIC_KEY=""
```

**Save:** Press `Ctrl+X`, then `Y`, then `Enter`

---

## Step 6: Initialize Database (Copy & Paste)

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

**This creates demo accounts:**
- admin@afrigenomix.com / Password123!
- john.doe@example.com / Password123!
- lab@genetech.ng / Password123!
- collection@medcenter.ng / Password123!

---

## Step 7: Build & Start (Copy & Paste)

```bash
npm run build
npm install -g pm2
pm2 start npm --name "afrigenomix" -- start
pm2 save
pm2 startup
```

**Check status:**
```bash
pm2 status
```

Should show `afrigenomix` as `online` ✅

---

## Step 8: Configure Hostinger Panel

1. Log in to **Hostinger Control Panel**
2. Go to **Website** settings
3. Find **Reverse Proxy** or **Application** settings
4. Configure:
   - **Domain:** afrigenomix.com
   - **Port:** 3000
   - **Protocol:** http://localhost:3000
5. Go to **SSL/TLS**
6. Enable **SSL Certificate** (Let's Encrypt)
7. Enable **Force HTTPS**

---

## Step 9: Test Your Site

Visit: **https://afrigenomix.com**

Try logging in:
- **Email:** admin@afrigenomix.com
- **Password:** Password123!

---

## Step 10: CRITICAL - Change Passwords!

1. Log in as admin
2. Go to profile/settings
3. Change password immediately
4. Repeat for other demo accounts

---

## 🎉 You're Live!

Your site is now running at **https://afrigenomix.com**

---

## Useful Commands

```bash
# View logs
pm2 logs afrigenomix

# Restart app
pm2 restart afrigenomix

# Stop app
pm2 stop afrigenomix

# Check status
pm2 status

# View recent logs
pm2 logs afrigenomix --lines 100
```

---

## Troubleshooting

### Can't connect to database
```bash
# Check DATABASE_URL
cat .env | grep DATABASE_URL

# Should show: mysql://u215495167_afrigenomix:Afrigenomix@2026@localhost:3306/u215495167_afrigenomix
```

### App won't start
```bash
# View logs
pm2 logs afrigenomix --lines 50

# Check if port 3000 is available
netstat -tuln | grep 3000
```

### 502 Error
```bash
# Restart app
pm2 restart afrigenomix

# Check PM2 status
pm2 status
```

---

## Your Database Connection String

```
mysql://u215495167_afrigenomix:Afrigenomix@2026@localhost:3306/u215495167_afrigenomix
```

**Database:** u215495167_afrigenomix  
**User:** u215495167_afrigenomix  
**Password:** Afrigenomix@2026  
**Host:** localhost  
**Port:** 3306  

---

## 🔐 Security Reminder

- ✅ Change all demo account passwords
- ✅ Keep .env file secure (never commit to Git)
- ✅ Use strong passwords for email accounts
- ✅ Start with Paystack test keys, then switch to live

---

**Total deployment time: ~30 minutes**

Go live now! 🚀
