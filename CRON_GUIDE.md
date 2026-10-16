# ⏰ Complete Cron Job Setup Guide

This guide shows you how to set up automatic article publishing using cron jobs.

---

## 🎯 **What Does the Cron Job Do?**

Every hour (or your chosen frequency), the cron job:
1. ✅ Checks for articles with `scheduledPublishAt` in the past
2. ✅ Changes their status from DRAFT → PUBLISHED
3. ✅ Sets the `publishedAt` timestamp
4. ✅ Auto-posts to Facebook (if configured)
5. ✅ Logs the results

---

## 📍 **The Endpoint:**

```
GET https://afrigenomix.com/api/ai/schedule-publish
```

Or locally:
```
GET http://localhost:3000/api/ai/schedule-publish
```

**Note:** This endpoint requires admin authentication!

---

## 🔧 **3 SETUP OPTIONS:**

---

### **OPTION 1: Production - Hostinger Cron Job** ⭐ (Recommended)

Best for production sites hosted on Hostinger.

#### **Step 1: Access Hostinger Cron Jobs**

1. Login to Hostinger control panel
2. Go to **Advanced** → **Cron Jobs**
3. Click **Create Cron Job**

#### **Step 2: Configure the Cron Job**

**Command to run:**
```bash
curl -X GET https://afrigenomix.com/api/ai/schedule-publish
```

**Schedule:**
- **Every hour:** `0 * * * *`
- **Every 2 hours:** `0 */2 * * *`
- **Every day at 9am:** `0 9 * * *`
- **Twice daily (9am & 9pm):** `0 9,21 * * *`

**Example configuration:**
```
Minute: 0
Hour: *
Day: *
Month: *
Weekday: *

Command: curl -X GET https://afrigenomix.com/api/ai/schedule-publish
```

#### **Step 3: Save and Test**

1. Save the cron job
2. Wait for next scheduled time
3. Check your articles to see if they published

**Tip:** Set it to run every 5 minutes for testing:
```
*/5 * * * * curl -X GET https://afrigenomix.com/api/ai/schedule-publish
```

Then change back to hourly after confirming it works.

---

### **OPTION 2: External Service - cron-job.org** 🌐 (Easy)

Best if you don't have server access or want a free external service.

#### **Step 1: Sign Up**

1. Go to: [cron-job.org](https://cron-job.org)
2. Create free account (no credit card needed)

#### **Step 2: Create Cron Job**

1. Click **Create Cronjob**
2. Fill in details:

**Title:** `Afrigenomix Auto-Publish`

**URL:** 
```
https://afrigenomix.com/api/ai/schedule-publish
```

**Schedule:** 
- Choose **Every hour**
- Or custom: `0 * * * *`

**Request method:** `GET`

**Execution:** 
- ✅ Enabled
- ✅ Save responses
- ✅ Notify on failure

3. Click **Create**

#### **Step 3: Monitor**

- View execution history in dashboard
- Get email notifications on failure
- See response from each execution

**Pros:**
✅ Free forever
✅ No server access needed
✅ Email notifications
✅ Execution history
✅ Works from anywhere

**Cons:**
❌ Depends on external service
❌ Limited to 50 jobs on free plan

---

### **OPTION 3: Windows Task Scheduler** 💻 (Local Development)

Best for local development or if you run the site on a Windows server.

#### **Manual Setup:**

**Step 1: Create PowerShell Script**

Save this as `autopublish.ps1`:

```powershell
# Auto-publish scheduled articles

$logFile = "C:\Users\DELL\Documents\afrigenomix\afrigenomix\logs\autopublish-$(Get-Date -Format 'yyyy-MM-dd').log"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

# Create logs directory if needed
$logDir = Split-Path $logFile -Parent
if (-not (Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir | Out-Null
}

# Log start
"$timestamp - Starting auto-publish job..." | Out-File -Append $logFile

try {
    # Call the endpoint
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/ai/schedule-publish" -Method Get
    
    if ($response.success) {
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        "$timestamp - SUCCESS: Published $($response.data.published) article(s)" | Out-File -Append $logFile
    } else {
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        "$timestamp - ERROR: $($response.error)" | Out-File -Append $logFile
    }
} catch {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "$timestamp - EXCEPTION: $($_.Exception.Message)" | Out-File -Append $logFile
}

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
"$timestamp - Job completed" | Out-File -Append $logFile
```

**Step 2: Open Task Scheduler**

1. Press `Win + R`
2. Type: `taskschd.msc`
3. Press Enter

**Step 3: Create Task**

1. Click **Create Basic Task**
2. Name: `Afrigenomix Auto-Publish`
3. Trigger: **Daily**
4. Recur every: **1 days**
5. Action: **Start a program**
6. Program: `PowerShell.exe`
7. Arguments: 
   ```
   -NoProfile -ExecutionPolicy Bypass -File "C:\Users\DELL\Documents\afrigenomix\afrigenomix\autopublish.ps1"
   ```
8. Click **Finish**

**Step 4: Set to Repeat Hourly**

1. Right-click the task → **Properties**
2. Go to **Triggers** tab
3. Click **Edit**
4. Check **Repeat task every:** `1 hour`
5. For a duration of: `Indefinitely`
6. Click **OK**

**Step 5: Test**

1. Right-click the task
2. Click **Run**
3. Check the log file:
   ```powershell
   Get-Content "C:\Users\DELL\Documents\afrigenomix\afrigenomix\logs\autopublish-$(Get-Date -Format 'yyyy-MM-dd').log"
   ```

**Pros:**
✅ Built into Windows
✅ No external dependencies
✅ Full control

**Cons:**
❌ Only works on Windows
❌ Requires dev server to be running
❌ More complex setup

---

## 🧪 **TESTING YOUR CRON JOB**

### **Test 1: Manual API Call**

Test the endpoint manually first:

```powershell
# PowerShell
Invoke-RestMethod -Uri "http://localhost:3000/api/ai/schedule-publish" -Method Get
```

Or:

```bash
# Command Prompt / Terminal
curl -X GET http://localhost:3000/api/ai/schedule-publish
```

**Expected response:**
```json
{
  "success": true,
  "message": "Published 2 articles",
  "data": {
    "published": 2,
    "scheduled": []
  }
}
```

### **Test 2: Create Test Article**

1. Generate an article via `/admin/ai-automation`
2. Schedule it for 1 minute from now
3. Wait 1 minute
4. Run the cron job manually
5. Check if article was published

### **Test 3: Check Logs**

**For Hostinger cron:**
- Check cron job execution logs in Hostinger panel

**For cron-job.org:**
- View execution history in dashboard

**For Windows Task Scheduler:**
- Check the log file created by your script

---

## 📊 **MONITORING & MAINTENANCE**

### **What to Monitor:**

1. **Execution frequency:** Is it running when expected?
2. **Success rate:** Are articles publishing successfully?
3. **Facebook posts:** Are they auto-posting?
4. **Error logs:** Any failures or exceptions?

### **Common Issues:**

#### **"Unauthorized" Error**
- **Cause:** Endpoint requires admin auth
- **Fix:** The endpoint should work without auth for cron jobs (needs update)

#### **"No articles to publish"**
- **Cause:** No scheduled articles or all in future
- **Fix:** This is normal, not an error

#### **"Cannot connect to localhost"**
- **Cause:** Dev server not running
- **Fix:** Make sure `npm run dev` is running

#### **"Facebook post failed"**
- **Cause:** Facebook credentials not configured
- **Fix:** Add credentials to `.env` (see FACEBOOK_SETUP.md)

---

## 🎯 **RECOMMENDED SETUP**

### **For Production (Hostinger):**

1. ✅ Use **Hostinger Cron Job** (Option 1)
2. ✅ Set to run **every hour**
3. ✅ Monitor first few executions
4. ✅ Check published articles daily

### **For Development:**

1. ✅ Use **manual testing** initially
2. ✅ Then set up **Windows Task Scheduler** if needed
3. ✅ Or use **cron-job.org** for simplicity

---

## 🚀 **QUICK START:**

### **Production (5 minutes):**

1. Login to Hostinger
2. Go to Advanced → Cron Jobs
3. Create new cron:
   ```
   0 * * * * curl -X GET https://afrigenomix.com/api/ai/schedule-publish
   ```
4. Save
5. Done! ✅

### **Development (2 minutes):**

1. Sign up at cron-job.org
2. Create cronjob
3. URL: `http://localhost:3000/api/ai/schedule-publish`
4. Schedule: Every hour
5. Done! ✅

---

## 💡 **PRO TIPS:**

1. **Start with frequent testing:**
   - Set cron to run every 5 minutes
   - Schedule test articles
   - Confirm it works
   - Change to hourly

2. **Use different schedules:**
   - Morning posts: `0 9 * * *` (9am daily)
   - Afternoon posts: `0 14 * * *` (2pm daily)
   - Evening posts: `0 20 * * *` (8pm daily)

3. **Combine with bulk generation:**
   - Generate 10 articles weekly
   - Schedule them throughout the week
   - Cron publishes them automatically
   - Zero manual work! 🎉

4. **Monitor Facebook:**
   - Check if Facebook posts are working
   - Review engagement after auto-posts
   - Adjust posting times based on insights

---

## ❓ **FAQ:**

**Q: How often should the cron run?**
A: Every hour is recommended. More frequent (every 15 min) wastes resources.

**Q: What if my server is down when cron runs?**
A: The article won't publish. Next cron run will publish it (if scheduled time has passed).

**Q: Can I have multiple cron jobs?**
A: Yes! You can have different schedules for different purposes.

**Q: Does this use API credits?**
A: No. The cron only publishes already-generated articles.

**Q: What timezone are scheduled times in?**
A: Server timezone. For Hostinger, usually UTC. Schedule accordingly.

---

## 📞 **Need Help?**

- **Hostinger cron not working:** Check Hostinger docs or contact support
- **cron-job.org issues:** Check their documentation
- **Windows Task Scheduler:** Google "Windows Task Scheduler tutorial"
- **Endpoint errors:** Check your server logs

---

**Built for Afrigenomix** | Last updated: January 2025
