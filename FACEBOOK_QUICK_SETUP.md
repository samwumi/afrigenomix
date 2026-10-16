# 🚀 Facebook Quick Setup - Step by Step

Follow these exact steps to get your Facebook auto-posting working.

---

## ✅ **Prerequisites:**

- [ ] You have a Facebook account
- [ ] You have (or will create) a Facebook Page for Afrigenomix
- [ ] You have admin access to that page

---

## 📋 **Step-by-Step Instructions:**

### **STEP 1: Get Your Facebook Page ID** (2 minutes)

#### **Method A: From Facebook Page**

1. Go to your Facebook Page: [facebook.com/afrigenomix](https://facebook.com/afrigenomix)
2. Click **"About"** in the left menu
3. Scroll down to **"Page transparency"** section
4. Copy the **Page ID** (it's a long number)

#### **Method B: From URL**

1. Go to your Facebook Page
2. Look at the URL in browser
3. If it's like: `facebook.com/pg/123456789/` → Your Page ID is `123456789`
4. If it's like: `facebook.com/afrigenomix` → Use Method A or C

#### **Method C: Use Facebook's API**

1. Go to: [findmyfbid.com](https://findmyfbid.com)
2. Enter your page URL
3. Get your Page ID

**📝 Write down your Page ID:**
```
My Page ID: _________________
```

---

### **STEP 2: Create Facebook App** (5 minutes)

1. **Go to:** [developers.facebook.com/apps](https://developers.facebook.com/apps)

2. **Click:** Green **"Create App"** button

3. **Select:**
   - Type: **"Business"** (or "Other")
   - Click **"Next"**

4. **Fill in details:**
   - Display name: `Afrigenomix Blog`
   - App contact email: Your email
   - Click **"Create app"**

5. **Complete security check** (if asked)

6. **You're in!** You should see your app dashboard

**📝 Note your App ID (shown at top of page):**
```
My App ID: _________________
```

---

### **STEP 3: Add Facebook Login** (3 minutes)

1. In your app dashboard, scroll to **"Add products to your app"**

2. Find **"Facebook Login"** and click **"Set up"**

3. Choose **"Web"** platform

4. Enter your site URL:
   - Development: `http://localhost:3000`
   - Production: `https://afrigenomix.com`

5. Click **"Save"** and **"Continue"**

6. Skip the rest of the steps (we'll do it differently)

---

### **STEP 4: Get Access Token** (5 minutes)

This is the most important step!

1. **Go to:** [developers.facebook.com/tools/explorer](https://developers.facebook.com/tools/explorer)

2. **Select your app:**
   - Top right dropdown: Select `Afrigenomix Blog`

3. **Select your page:**
   - Click **"User or Page"** dropdown
   - Select your Afrigenomix page (not your personal profile!)

4. **Add permissions:**
   - Click **"Permissions"** (or "Add permission")
   - Search and select these permissions:
     - ✅ `pages_show_list`
     - ✅ `pages_read_engagement`
     - ✅ `pages_manage_posts`
     - ✅ `pages_manage_metadata`

5. **Generate token:**
   - Click **"Generate Access Token"** button
   - Login and approve permissions
   - **Copy the token** (starts with `EAAG...`)

**📝 Save this token temporarily:**
```
My Short-Lived Token: EAAG...
```

⚠️ **This token expires in 1 hour!** We need to make it long-lived next.

---

### **STEP 5: Make Token Long-Lived** (2 minutes)

#### **Method A: Use Graph API Explorer**

1. Open new tab, paste this URL (replace the values):

```
https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&fb_exchange_token=YOUR_SHORT_TOKEN
```

**Where to get these values:**

- `YOUR_APP_ID`: From Step 2 (or app dashboard → Settings → Basic)
- `YOUR_APP_SECRET`: App dashboard → Settings → Basic → **Show** button
- `YOUR_SHORT_TOKEN`: From Step 4

2. Press Enter, you'll get a response like:
```json
{
  "access_token": "EAAGLongTokenHere...",
  "token_type": "bearer",
  "expires_in": 5184000
}
```

3. **Copy the new `access_token`** - This lasts 60 days!

#### **Method B: Use PowerShell**

1. Open PowerShell
2. Run this command (replace values):

```powershell
Invoke-RestMethod "https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&fb_exchange_token=YOUR_SHORT_TOKEN"
```

**📝 Save your long-lived token:**
```
My Long-Lived Token: EAAG...
```

---

### **STEP 6: Add to .env File** (1 minute)

1. Open your project: `c:\Users\DELL\Documents\afrigenomix\afrigenomix`

2. Open file: `.env`

3. Add these lines (use your actual values):

```env
FACEBOOK_PAGE_ID="your-page-id-from-step-1"
FACEBOOK_PAGE_ACCESS_TOKEN="your-long-lived-token-from-step-5"
```

4. **Save the file**

---

### **STEP 7: Test the Connection** (2 minutes)

1. **Open PowerShell** in your project folder

2. **Run test script:**
```powershell
node test-facebook.js
```

3. **Expected output:**
```
✅ Successfully connected to Facebook!

📊 Page Information:
   Name: Afrigenomix
   Username: @afrigenomix
   Followers: 1234
   Page ID: 123456789

🎉 Facebook integration is working correctly!
```

4. **If you see errors:**
   - Check your token hasn't expired
   - Verify Page ID is correct
   - Make sure token has correct permissions

---

## 🎉 **YOU'RE DONE!**

Now when you publish an article, it will automatically post to Facebook!

---

## 🧪 **Test It:**

### **Test 1: Manual test (without publishing article)**

Visit in browser:
```
http://localhost:3000/api/social/facebook-post
```

You should see your page info if connected!

### **Test 2: Publish an article**

1. Start dev server: `npm run dev`
2. Visit: `http://localhost:3000/admin/content`
3. Create or edit an article
4. Change status to **"PUBLISHED"**
5. Click **"Save"**
6. **Check your Facebook page!** 🎉

---

## 🔧 **Troubleshooting:**

### **"Invalid OAuth 2.0 Access Token"**
- Token expired → Generate new long-lived token (Step 5)
- Token for wrong page → Repeat Step 4, select correct page

### **"Permissions error"**
- Token missing permissions → Repeat Step 4, add all 4 permissions

### **"Page not found"**
- Wrong Page ID → Verify Page ID from Step 1

### **"Facebook integration not configured"**
- .env file not updated → Complete Step 6
- Server not restarted → Restart with `npm run dev`

---

## 📞 **Need Help?**

If you get stuck at any step, tell me:
1. Which step you're on
2. What you see on screen
3. Any error messages

I'll help you through it! 🚀

---

**Next:** After this works, we'll set up the cron job for auto-publishing!
