# 🚀 Quick Start: AI Content Automation

Get your AI content system running in 5 minutes!

## Step 1: Get OpenAI API Key (2 minutes)

1. Visit: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Click **"Create new secret key"**
3. Name it: "Afrigenomix Blog"
4. Copy the key (starts with `sk-...`)

⚠️ **Save it now** - you can't see it again!

---

## Step 2: Add to Production Environment (1 minute)

### On Hostinger:

1. **Login to Hostinger Control Panel**
2. **Go to:** Website → Advanced → Environment Variables
3. **Add New Variable:**
   - Name: `OPENAI_API_KEY`
   - Value: `sk-your-key-here`
4. **Save Changes**
5. **Restart your Node.js app**

### Locally (for testing):

Add to `.env` file:
```env
OPENAI_API_KEY="sk-your-actual-key-here"
```

---

## Step 3: Test AI Features (2 minutes)

### Test 1: Generate Your First Article

1. **Login:** Visit `https://afrigenomix.com/login`
   - Use your admin credentials

2. **Navigate:** Go to `https://afrigenomix.com/admin/ai-content`

3. **Generate Article:**
   - Click a topic suggestion OR enter custom topic
   - Select category: "DNA_EDUCATION"
   - Select tone: "Professional"
   - Click **"Generate Article"**

4. **Wait 10-15 seconds** ⏳

5. **Success!** Article created as DRAFT
   - View at: `/admin/content`

**Cost:** ~$0.01 ✅

### Test 2: Comment Moderation

1. **Visit any blog post** on your site
2. **Submit a test comment:**
   - Name: "Test User"
   - Email: "test@example.com"
   - Comment: "Great article! Very helpful."
3. **AI auto-moderates in background**
4. **Check:** `/admin/ai-moderation`
   - See your comment (likely APPROVED)
   - You can override if needed

**Cost:** ~$0.0001 ✅

---

## ✅ You're Done!

Your AI content system is live! 🎉

### What You Can Do Now:

✅ **Generate Blog Posts** → `/admin/ai-content`  
✅ **Auto-Moderate Comments** → Automatic on submission  
✅ **Schedule Publishing** → Set future publish dates  
✅ **Review AI Decisions** → `/admin/ai-moderation`  

### Your Costs:

- **$5 OpenAI Credit** = ~500 articles
- **Monthly Usage:** ~$0.13/month (12 articles + 100 comments)
- **Credit Lasts:** ~40 months 🎉

---

## 🎯 Next Actions

### Daily/Weekly:
- Check `/admin/ai-moderation` for pending comments
- Review AI-generated articles before publishing
- Generate new content as needed

### Monthly:
- Check OpenAI usage: [platform.openai.com/usage](https://platform.openai.com/usage)
- Review AI moderation accuracy
- Adjust prompts if needed

---

## 🚨 Troubleshooting

### "OpenAI API Key Not Found"
1. ✅ Verify key added to environment variables
2. ✅ Restart Node.js application
3. ✅ Check key format: starts with `sk-`

### "Unauthorized" Error
1. ✅ Login as admin at `/login`
2. ✅ Check JWT token in browser (F12 → Application → localStorage)
3. ✅ Token might be expired - login again

### "Rate Limit Exceeded"
1. ✅ Free tier: 3 requests/minute
2. ✅ Wait 60 seconds between bulk operations
3. ✅ Consider upgrading OpenAI plan

---

## 📚 Full Documentation

For detailed information, see: **AI_FEATURES.md**

Topics covered:
- Complete API reference
- Technical architecture
- Advanced features
- Cost optimization
- Troubleshooting guide

---

## 📞 Need Help?

- **Email:** service@afrigenomix.com
- **Phone:** 08111180192
- **GitHub Issues:** [github.com/samwumi/afrigenomix](https://github.com/samwumi/afrigenomix)

---

Made with ❤️ by Afrigenomix Team
