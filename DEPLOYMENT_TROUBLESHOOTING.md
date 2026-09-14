# 503 Service Unavailable - Troubleshooting Guide

## Issue
Your server is running but returning 503 errors, which means it's temporarily unable to handle requests.

## Common Causes & Solutions

### 1. Server Memory Issues
**Symptom:** Server starts but crashes or becomes unresponsive
**Solution:**
- Check your hosting plan memory limits
- Increase memory allocation if available
- Optimize your application

### 2. Database Connection Issues
**Symptom:** Can't connect to MySQL database
**Solution:**
```bash
# Test database connection
node test-db-connection.js
```

Check your `.env` file:
```env
DATABASE_URL="mysql://user:password@host:3306/database"
```

### 3. Port/Network Configuration
**Symptom:** Server binds to wrong address
**Solution:**
Your Next.js is binding to `0.0.0.0:3000` which is correct for Docker/hosting.

### 4. Build/Start Issues
**Symptom:** Build succeeded but start fails

**Check these:**
```bash
# 1. Verify build completed
ls -la .next/

# 2. Check start command in package.json
cat package.json | grep "start"

# 3. Try starting manually
npm run start
```

### 5. Environment Variables Missing
**Symptom:** Server starts but fails on first request

**Required variables:**
```env
DATABASE_URL=mysql://...
JWT_SECRET=your-secret-key
NODE_ENV=production
```

### 6. Hostinger-Specific Issues

#### Check Node.js Version
Hostinger might be using an incompatible Node version.

**Solution:** Add to `.htaccess` or configure in Hostinger panel:
```
Node.js version: 18.x or higher (Next.js 16 requires Node 18+)
```

#### Memory Limits
Hostinger shared hosting has memory limits.

**Solutions:**
1. Upgrade to higher tier
2. Optimize your app:
   - Reduce bundle size
   - Enable caching
   - Use CDN for static assets

#### Database Connection Limits
MySQL connection pool might be exhausted.

**Solution:** Update `lib/prisma.ts`:
```typescript
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // Add connection pool settings
  log: ['error'],
}).$extends({
  // Optimize connections
})
```

### 7. Prisma Client Issues
**Symptom:** "PrismaClient is not configured" errors

**Solution:**
```bash
# Regenerate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push
```

## Quick Diagnostic Steps

### Step 1: Check Deployment Logs
Look for errors in your Hostinger deployment logs:
- Application logs
- Error logs
- Access logs

### Step 2: Test Database Connection
```bash
node test-db-connection.js
```

Expected output:
```
✓ Database connected successfully
```

### Step 3: Check Environment Variables
```bash
# In Hostinger, verify all env vars are set
echo $DATABASE_URL
echo $JWT_SECRET
echo $NODE_ENV
```

### Step 4: Restart Application
Sometimes a simple restart fixes it:
1. Go to Hostinger panel
2. Stop application
3. Wait 10 seconds
4. Start application

### Step 5: Check Application Health
Try accessing these endpoints:
```
https://your-domain.com/api/health     # If you have one
https://your-domain.com/                # Homepage
https://your-domain.com/login          # Login page
```

## Specific to Your Blog

### Check Blog Routes
After deployment, test these URLs:
```
https://afrigenomix.com/blog           # Should work
https://afrigenomix.com/api/articles   # Should return JSON
```

### If Blog Pages 503
The issue might be with:
1. Missing `react-markdown` package in production
2. Prisma Client not generated
3. Database schema not pushed

**Fix:**
```bash
# In production, run:
npm install
npx prisma generate
npx prisma db push
```

## Hostinger Specific Commands

### Via SSH (if available):
```bash
# Navigate to your app
cd ~/domains/afrigenomix.com/hbuilds/source/repository

# Check if build exists
ls -la .next/

# Check node version
node --version  # Should be 18+

# Try starting manually
npm run start

# Check for errors
tail -f ~/logs/afrigenomix.com_error.log
```

### Via Hostinger Panel:
1. **Application Manager**
   - Stop/Start application
   - Check logs
   - Verify Node.js version

2. **File Manager**
   - Check `.next` folder exists
   - Verify `node_modules` installed

3. **Database**
   - Test connection
   - Check tables exist
   - Verify user permissions

## Common 503 Fix for Hostinger

**Most likely cause:** Memory limit exceeded or wrong Node.js version

**Solution:**
1. Go to Hostinger panel
2. Website → Manage
3. Advanced → Select Application
4. Change Node.js version to 18.x or 20.x
5. Increase memory limit (if available)
6. Restart application

## Testing Locally

If production is having issues, test locally first:

```bash
# 1. Clean install
rm -rf node_modules .next
npm install

# 2. Generate Prisma Client
npx prisma generate

# 3. Build for production
npm run build

# 4. Start production server
npm run start

# 5. Test
curl http://localhost:3000
curl http://localhost:3000/blog
curl http://localhost:3000/api/articles
```

## Emergency Rollback

If all else fails, rollback to previous version:

```bash
# Find last working commit
git log --oneline -10

# Rollback (example)
git reset --hard <commit-hash>
git push origin main --force

# Or revert specific commits
git revert <commit-hash>
git push origin main
```

## Contact Hostinger Support

If nothing works, contact Hostinger with:
1. Error logs
2. Steps you've tried
3. Application requirements:
   - Node.js 18+
   - MySQL database
   - Memory requirements
   - Port configuration

## Prevention

### Add Health Check Endpoint

Create `app/api/health/route.ts`:
```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test database connection
    // await prisma.$queryRaw`SELECT 1`
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      error: 'Database connection failed',
    }, { status: 503 });
  }
}
```

### Add Error Logging

Implement proper error logging to catch issues early.

### Monitor Application

Use monitoring tools to track:
- Response times
- Error rates
- Memory usage
- Database connections

## Summary

**Most Common Fixes:**
1. ✅ Restart application in Hostinger panel
2. ✅ Verify Node.js version (18+)
3. ✅ Check database connection
4. ✅ Regenerate Prisma Client
5. ✅ Increase memory limit
6. ✅ Check environment variables

**Next Steps:**
1. Try restarting the application
2. Check deployment logs
3. Test database connection
4. Verify environment variables
5. Contact Hostinger support if needed

---

**Need immediate help?** Check the logs in Hostinger panel under your application's error logs.
