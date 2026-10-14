# 📘 Facebook Auto-Posting Setup Guide

Complete guide to set up automatic Facebook posting for Afrigenomix blog articles.

---

## ✨ **What This Does:**

When you publish an article (manually or automatically), it will:
- ✅ **Auto-post to your Facebook Page**
- ✅ Include title, excerpt, and link
- ✅ Include featured image (if available)
- ✅ Add relevant hashtags
- ✅ Work with scheduled articles too!

---

## 🎯 **Setup Steps (15 minutes):**

### **Step 1: Create Facebook App** (5 minutes)

1. **Go to:** [developers.facebook.com/apps](https://developers.facebook.com/apps)
2. **Click:** "Create App"
3. **Select:** "Business" as app type
4. **App Name:** "Afrigenomix Blog"
5. **App Purpose:** "Yourself or your own business"
6. **Click:** "Create App"

### **Step 2: Add Pages Permission** (2 minutes)

1. In your app dashboard, go to **"Add Products"**
2. Find **"Facebook Login"** and click **"Set Up"**
3. On the left menu, click **"Facebook Login" → "Settings"**
4. Add to **"Valid OAuth Redirect URIs":**
   ```
   https://afrigenomix.com/
   ```
5. **Save Changes**

### **Step 3: Get Page Access Token** (5 minutes)

1. In left sidebar, go to **"Tools" → "Graph API Explorer"**
2. **User or Page:** Select your page dropdown → Choose your Afrigenomix page
3. **Permissions:** Click "Add Permission" and add:
   - `pages_show_list`
   - `pages_read_engagement`
   - `pages_manage_posts`
   - `pages_read_user_content`
4. **Click:** "Generate Access Token"
5. **Login** and approve permissions
6. **Copy the Access Token** (starts with `EAAG...`)

⚠️ **Important:** This is a **short-lived token**. We'll make it long-lived next!

### **Step 4: Convert to Long-Lived Token** (3 minutes)

**Option A: Use Graph API Explorer**

Run this URL in your browser (replace values):
```
https://graph.facebook.com/v18.0/oauth/access_token?
  grant_type=fb_exchange_token&
  client_id=YOUR_APP_ID&
  client_secret=YOUR_APP_SECRET&
  fb_exchange_token=YOUR_SHORT_LIVED_TOKEN
```

Get `YOUR_APP_ID` and `YOUR_APP_SECRET` from:
- App Dashboard → Settings → Basic

**Option B: Use Terminal/PowerShell**

```bash
curl "https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&fb_exchange_token=YOUR_SHORT_LIVED_TOKEN"
```

**Response will contain:**
```json
{
  "access_token": "EAAG...long-token...",
  "token_type": "bearer",
  "expires_in": 5184000
}
```

Copy this new **long-lived token** (lasts 60 days).

### **Step 5: Get Page ID** (1 minute)

**Option 1: From Page Settings**
- Go to your Facebook Page
- Click "About"
- Scroll to "Page ID" or "Page Transparency"

**Option 2: From Graph API Explorer**
```
https://graph.facebook.com/v18.0/me/accounts?access_token=YOUR_LONG_LIVED_TOKEN
```

Look for your page in the response and copy the `id` field.

### **Step 6: Add to Environment Variables**

**Local (.env file):**
```env
FACEBOOK_PAGE_ID="your-page-id-here"
FACEBOOK_PAGE_ACCESS_TOKEN="EAAGlong-lived-token-here"
```

**Production (Hostinger):**
1. Login to Hostinger control panel
2. Go to: **Website → Advanced → Environment Variables**
3. Add both variables:
   - `FACEBOOK_PAGE_ID` = your page ID
   - `FACEBOOK_PAGE_ACCESS_TOKEN` = your long token

---

## 🧪 **Test the Integration:**

### **Test 1: Check Connection**

Visit: `http://localhost:3000/api/social/facebook-post`

You should see:
```json
{
  "success": true,
  "configured": true,
  "page": {
    "name": "Afrigenomix",
    "username": "afrigenomix",
    "followers": 1234
  }
}
```

### **Test 2: Manual Post**

1. **Publish an article** (or change a DRAFT to PUBLISHED)
2. **Check your Facebook Page**
3. **You should see the post!** 🎉

### **Test 3: Automated Post**

1. **Generate 3 articles** with AI automation
2. **Schedule them** for future dates
3. **When scheduled time arrives**, articles auto-publish to both:
   - Your blog
   - Your Facebook page

---

## 📝 **Post Format:**

When auto-posting, Facebook will show:

```
[Article Title]

[Article Excerpt]

Read more: https://afrigenomix.com/blog/[slug]

#DNATesting #Afrigenomix #GeneticTesting #Africa
```

If article has featured image, it will be included!

---

## 🔄 **Token Expiration:**

Facebook Page tokens expire after **60 days**. You'll need to:

1. **Set a reminder** for 60 days from now
2. **Repeat Step 3-4** to get a new token
3. **Update environment variables**

Or, you can apply for **"Page Public Content Access"** feature for never-expiring tokens (requires business verification).

---

## ⚙️ **Advanced: Never-Expiring Token**

For production, get a permanent token:

1. **Go to:** App Dashboard → App Review
2. **Request:** "pages_manage_posts" permission
3. **Submit for review** (requires business verification)
4. **Once approved:** Generate new token (will never expire!)

---

## 🎨 **Customization:**

### **Change Post Message:**

Edit: `app/api/social/facebook-post/route.ts`

Find the `message` variable and customize:
```typescript
const message = `🧬 ${article.title}

${article.excerpt || ''}

Read the full article: ${articleUrl}

#YourHashtags #Here`;
```

### **Add More Platforms:**

You can add similar auto-posting for:
- Twitter/X
- LinkedIn
- Instagram
- WhatsApp

Just create similar endpoints like `/api/social/twitter-post`

---

## 📊 **What Gets Posted:**

✅ **Posts to Facebook When:**
- Article status changes from DRAFT → PUBLISHED
- Scheduled article auto-publishes (cron job)
- Manual "Publish" button clicked

❌ **Does NOT Post When:**
- Article is saved as DRAFT
- Article is edited (already published)
- Article is deleted

---

## 🚨 **Troubleshooting:**

### **"Facebook integration not configured"**

- ✅ Check `.env` has `FACEBOOK_PAGE_ID` and `FACEBOOK_PAGE_ACCESS_TOKEN`
- ✅ Restart dev server
- ✅ On production, restart Node.js app

### **"Invalid OAuth 2.0 Access Token"**

- ✅ Token expired (regenerate long-lived token)
- ✅ Token doesn't have required permissions
- ✅ Wrong page selected when generating token

### **"(#200) Permissions error"**

- ✅ Page token doesn't have `pages_manage_posts` permission
- ✅ Regenerate token with correct permissions
- ✅ Make sure you selected the PAGE (not user) in Graph API Explorer

### **Post appears but no image**

- ✅ Featured image URL must be publicly accessible
- ✅ Image must be hosted on https:// (not http://)
- ✅ Base64 images don't work (need real URL)

---

## 🎯 **Best Practices:**

1. **Token Security:**
   - Never commit tokens to git
   - Use environment variables only
   - Rotate tokens every 60 days

2. **Post Timing:**
   - Schedule posts for peak engagement times
   - Use Facebook Insights to find best times
   - Spread posts throughout the week

3. **Content:**
   - Write engaging excerpts (they appear on Facebook)
   - Use good featured images (get more clicks)
   - Include relevant hashtags

---

## 📈 **Analytics:**

To track Facebook post performance:

1. **Go to:** [business.facebook.com](https://business.facebook.com)
2. **Select:** Your page
3. **View:** Post insights (reach, engagement, clicks)

---

## ✅ **Summary:**

Once set up, your workflow is:

```
Generate Article with AI
    ↓
Schedule for future date
    ↓
Cron job auto-publishes article
    ↓
Article appears on blog
    ↓
AUTOMATICALLY posts to Facebook
    ↓
Done! Zero manual work! 🎉
```

---

## 📞 **Need Help?**

- **Facebook Developer Docs:** [developers.facebook.com/docs](https://developers.facebook.com/docs)
- **Graph API Explorer:** [developers.facebook.com/tools/explorer](https://developers.facebook.com/tools/explorer)
- **Support:** service@afrigenomix.com

---

Made with ❤️ for Afrigenomix
