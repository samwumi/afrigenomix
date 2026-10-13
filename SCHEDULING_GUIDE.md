# 📅 Article Scheduling Guide

Complete guide to scheduling and auto-publishing articles on Afrigenomix.

---

## ✅ **What's Been Built:**

1. ✅ **Schedule UI** - Date/time picker in article editor
2. ✅ **API Endpoint** - `/api/ai/schedule-publish` (GET & POST)
3. ✅ **Database Field** - `scheduledPublishAt` in Article model
4. ✅ **Auto-publish Logic** - Backend ready to publish scheduled articles

---

## 🎯 **How to Schedule Articles:**

### **Step 1: Create/Edit Article**

1. Go to: `/admin/content/new` or edit existing article
2. Fill in article details (title, content, etc.)
3. Find **"📅 Schedule Publishing"** section in the sidebar
4. Select date and time for publishing
5. Click **"Save as Draft"** or **"Publish Article"**

### **Step 2: What Happens:**

- Article is saved as **DRAFT** status
- `scheduledPublishAt` field is set to your chosen time
- Article appears in the AI Moderation Dashboard under "Scheduled Articles"
- At the scheduled time, article changes to **PUBLISHED** status

---

## 🤖 **Setting Up Auto-Publishing:**

For scheduled articles to automatically publish, you need to trigger the API endpoint periodically.

### **Option 1: Cron Job (Recommended for Production)**

Add a cron job on your Hostinger server to call the API every hour:

```bash
# Edit crontab
crontab -e

# Add this line (runs every hour at :00)
0 * * * * curl -X GET https://afrigenomix.com/api/ai/schedule-publish \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  >> /var/log/afrigenomix-autopublish.log 2>&1
```

**Get your JWT token:**
1. Login to `/admin` in your browser
2. Open DevTools (F12) → Application → Local Storage
3. Copy the `auth_token` value
4. Replace `YOUR_ADMIN_JWT_TOKEN` in the cron command

### **Option 2: Task Scheduler (Windows Production)**

If hosting on Windows:

1. **Open Task Scheduler**
2. **Create Basic Task**
3. **Name:** "Afrigenomix Auto-Publish"
4. **Trigger:** Daily, repeat every 1 hour
5. **Action:** Start a program
6. **Program:** `powershell.exe`
7. **Arguments:**
```powershell
Invoke-RestMethod -Method GET -Uri "https://afrigenomix.com/api/ai/schedule-publish" -Headers @{"Authorization"="Bearer YOUR_TOKEN"}
```

### **Option 3: External Cron Service (Easiest)**

Use a free cron service like **cron-job.org**:

1. Go to: [cron-job.org](https://cron-job.org)
2. Sign up (free)
3. **Create new cron job:**
   - **Title:** Afrigenomix Auto-Publish
   - **URL:** `https://afrigenomix.com/api/ai/schedule-publish`
   - **Method:** GET
   - **Headers:** Add `Authorization: Bearer YOUR_TOKEN`
   - **Schedule:** Every hour (*/60 * * * *)
4. **Save and enable**

---

## 📊 **How It Works:**

```mermaid
1. User schedules article for "Oct 15, 2026 10:00 AM"
   ↓
2. Article saved as DRAFT with scheduledPublishAt = "2026-10-15T10:00:00Z"
   ↓
3. Cron job calls /api/ai/schedule-publish every hour
   ↓
4. API checks: Is current time >= scheduledPublishAt?
   ↓
5. YES → Change status to PUBLISHED, set publishedAt = now()
   ↓
6. Article now visible on blog!
```

---

## 🧪 **Testing Locally:**

### **Test 1: Schedule an Article**

1. Start dev server: `npm run dev`
2. Login at: http://localhost:3000/login
3. Go to: http://localhost:3000/admin/content/new
4. Create article and schedule for **5 minutes from now**
5. Save as Draft

### **Test 2: Manually Trigger Auto-Publish**

```bash
# Get your JWT token from browser localStorage
$token = "your-jwt-token-here"

# Call the API
curl -X GET http://localhost:3000/api/ai/schedule-publish \
  -H "Authorization: Bearer $token"
```

Or use PowerShell:
```powershell
$token = "your-jwt-token-here"
$headers = @{"Authorization"="Bearer $token"}
Invoke-RestMethod -Method GET -Uri "http://localhost:3000/api/ai/schedule-publish" -Headers $headers
```

### **Test 3: Check Results**

1. Go to: http://localhost:3000/admin/ai-moderation
2. Click **"Scheduled Articles"** tab
3. Your article should be gone (now published!)
4. Visit: http://localhost:3000/blog
5. Article should appear there!

---

## 📋 **API Reference:**

### **GET /api/ai/schedule-publish**
Auto-publishes articles whose scheduled time has passed.

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "published": 2,
    "scheduled": [
      {
        "id": "uuid",
        "title": "Article Title",
        "slug": "article-slug",
        "scheduledPublishAt": "2026-10-15T10:00:00Z",
        "author": { "name": "Author Name" }
      }
    ]
  },
  "message": "Published 2 article(s)"
}
```

### **POST /api/ai/schedule-publish**
Schedule a specific article for future publishing.

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json
```

**Body:**
```json
{
  "articleId": "uuid",
  "publishAt": "2026-10-15T10:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": { "article": {...} },
  "message": "Article scheduled to publish at ..."
}
```

---

## 🎨 **UI Features:**

### **In Article Editor:**
- 📅 **Schedule Publishing** card in sidebar
- Date/time picker (min = current time)
- Preview: "Will publish on Oct 15, 2026 10:00 AM"
- Automatically sets article as DRAFT if future date

### **In AI Moderation Dashboard:**
- **"Scheduled Articles"** tab
- Shows all articles with future `scheduledPublishAt`
- **"Publish Now"** button to override schedule
- **"Edit"** button to modify article

---

## 💡 **Tips & Best Practices:**

1. **Schedule Frequency:** Run cron every 15-60 minutes
   - Every 15 min = more precise timing
   - Every hour = lower server load

2. **Time Zones:** All times are in UTC
   - Convert local time to UTC before scheduling
   - Display shows local time in browser

3. **Bulk Scheduling:** Generate multiple articles and schedule them:
   - Monday 10 AM
   - Wednesday 10 AM
   - Friday 10 AM
   - = Consistent 3x/week publishing!

4. **Review Before Schedule:** Always save as DRAFT first
   - Review content
   - Set schedule
   - AI ensures quality

---

## 🚨 **Troubleshooting:**

### **Articles Not Auto-Publishing:**

1. ✅ Check cron job is running
2. ✅ Verify JWT token is valid (not expired)
3. ✅ Check server logs for errors
4. ✅ Manually call API to test: `curl ... /api/ai/schedule-publish`

### **Wrong Publish Time:**

1. ✅ Check time zone conversion
2. ✅ Verify server time is correct: `date` (Linux) or `Get-Date` (Windows)
3. ✅ Database stores times in UTC

### **Permission Denied:**

1. ✅ JWT token must be from ADMIN user
2. ✅ Token format: `Bearer <token>`
3. ✅ Check token hasn't expired

---

## 📈 **Workflow Example:**

### **Weekly Content Schedule:**

```bash
# Monday: Generate 3 articles for the week
1. Login to /admin/ai-content
2. Generate article on Topic A → Schedule for Wed 10 AM
3. Generate article on Topic B → Schedule for Fri 10 AM
4. Generate article on Topic C → Schedule for Sun 10 AM

# Cron job handles the rest automatically!
```

**Result:** Consistent publishing with zero manual work! 🎉

---

## ✅ **Summary:**

You now have:
- ✅ **UI to schedule** articles (date/time picker)
- ✅ **API to auto-publish** scheduled articles
- ✅ **Dashboard to view** scheduled articles
- ✅ **3 ways to trigger** auto-publishing (cron, task scheduler, external service)

**Next Steps:**
1. Set up cron job (Option 1, 2, or 3 above)
2. Test with an article scheduled 5 minutes from now
3. Enjoy automated publishing! 🚀

---

Made with ❤️ for Afrigenomix
