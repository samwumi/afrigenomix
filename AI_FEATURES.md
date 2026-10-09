# 🤖 AI Content Automation System

Complete AI-powered content management system for Afrigenomix blog using OpenAI GPT-4o-mini.

## 🎯 Features Built

### 1. **AI Article Generator** 
✅ **Location:** `/admin/ai-content`
- Generate 1,200-1,500 word SEO-optimized articles
- Topic suggestions in 8 categories (DNA Education, Paternity Testing, etc.)
- Adjustable tone (Professional, Friendly, Technical, Conversational)
- Automatic SEO metadata generation (title, description, keywords)
- Automatic featured image generation (base64 placeholder)
- Cost tracking (~$0.01 per article)
- Articles saved as DRAFT for review before publishing

### 2. **AI Comment Moderation**
✅ **Location:** Auto-runs on comment submission
- Automatically detects spam comments
- Flags inappropriate content
- Identifies hate speech, promotional content, gibberish
- Non-blocking (runs in background)
- Manual review dashboard at `/admin/ai-moderation`

### 3. **Auto-Publishing Scheduler**
✅ **Location:** `/api/ai/schedule-publish`
- Schedule articles to publish at specific times
- Automatic publishing when scheduled time arrives
- View scheduled articles in AI Moderation dashboard
- Manual "Publish Now" override option

### 4. **AI Moderation Dashboard**
✅ **Location:** `/admin/ai-moderation`
- Review pending comments (approve/reject/mark as spam)
- View scheduled articles
- Publish scheduled articles immediately
- Real-time updates

---

## 🚀 Getting Started

### Step 1: Get OpenAI API Key

1. Go to [platform.openai.com](https://platform.openai.com)
2. Create account or sign in
3. Navigate to **API Keys** section
4. Click **"Create new secret key"**
5. Copy the key (starts with `sk-...`)

### Step 2: Add API Key to Environment

Add to your production `.env` file:

```env
OPENAI_API_KEY="sk-your-actual-api-key-here"
```

⚠️ **IMPORTANT:** Never commit this key to GitHub!

### Step 3: Test the System

1. **Login as Admin:** Visit `/login`
2. **Generate Article:** Visit `/admin/ai-content`
   - Select a topic or enter custom topic
   - Choose category and tone
   - Click "Generate Article"
   - Article appears as DRAFT in content manager

3. **Test Comment Moderation:**
   - Visit any blog post
   - Submit a test comment
   - AI automatically moderates in background
   - Check `/admin/ai-moderation` to review

---

## 💰 Cost Information

### OpenAI Pricing (GPT-4o-mini)
- **Input:** $0.15 per 1M tokens
- **Output:** $0.60 per 1M tokens

### Your Costs
- **Article Generation:** ~$0.01 per article
- **Comment Moderation:** ~$0.0001 per comment
- **Your $5 Credit:** ~500 articles OR ~50,000 comments

### Monthly Estimate
- 12 articles/month = **$0.12/month**
- 100 comments/month = **$0.01/month**
- **Total: ~$0.13/month** 🎉

Your $5 credit will last **~40 months** at this rate!

---

## 📁 API Endpoints Created

### Article Generation
```http
POST /api/ai/generate-article
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json

{
  "topic": "Understanding DNA Paternity Testing",
  "category": "PATERNITY_TESTING",
  "tone": "professional"
}

Response:
{
  "success": true,
  "data": { "article": {...} },
  "cost": "$0.0089"
}
```

### Comment Moderation
```http
POST /api/ai/moderate-comment
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json

{
  "commentId": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "content": "Great article! Very informative."
}

Response:
{
  "success": true,
  "decision": "APPROVED",
  "confidence": 0.95,
  "reason": "Genuine positive feedback",
  "cost": "$0.000089"
}
```

### Schedule Publishing
```http
POST /api/ai/schedule-publish
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json

{
  "articleId": "uuid",
  "publishAt": "2026-10-15T10:00:00Z"
}

GET /api/ai/schedule-publish
Authorization: Bearer <admin-jwt-token>

Response:
{
  "success": true,
  "data": {
    "published": 2,
    "scheduled": [...]
  }
}
```

---

## 🎨 Admin UI Pages

### 1. AI Content Generator (`/admin/ai-content`)
- **Topic Suggestions:** Pre-defined topics in 8 categories
- **Custom Topics:** Enter any DNA-related topic
- **Category Selection:** Choose article category for proper tagging
- **Tone Control:** Professional, Friendly, Technical, Conversational
- **Real-time Cost:** Shows estimated cost before generation
- **Generation Status:** Loading indicator with progress

### 2. AI Moderation Dashboard (`/admin/ai-moderation`)
- **Pending Comments Tab:** Review AI-moderated comments
  - Approve/Reject/Mark as Spam buttons
  - Shows comment content, author, article
  - Direct link to article
- **Scheduled Articles Tab:** Manage scheduled posts
  - View scheduled publish time
  - "Publish Now" override button
  - Edit article button

### 3. Admin Dashboard Updates
- **Quick Actions Section:**
  - 🤖 AI Content Generator
  - 🛡️ AI Moderation
  - (Existing actions...)

---

## 🔧 Technical Details

### Models Used
- **Article Generation:** `gpt-4o-mini` (cheapest, sufficient quality)
- **Comment Moderation:** `gpt-4o-mini` (consistent results)

### Temperature Settings
- **Content Generation:** 0.7 (creative, varied writing)
- **Comment Moderation:** 0.3 (consistent, reliable decisions)

### Security
- ✅ JWT authentication required (admin only)
- ✅ Input validation (Zod schemas)
- ✅ Rate limiting ready (add if needed)
- ✅ API key stored in environment variables
- ✅ Error handling with fallbacks

### Database Schema Updates
```prisma
model Article {
  // ... existing fields
  scheduledPublishAt DateTime? // NEW: Schedule auto-publishing
}

model Comment {
  status CommentStatus @default(PENDING)
  // PENDING | APPROVED | REJECTED | SPAM
}
```

---

## 🎯 Usage Examples

### Example 1: Bulk Generate Articles
```typescript
const topics = [
  "Understanding DNA Paternity Testing",
  "How Immigration DNA Tests Work",
  "The Science Behind DNA Matching",
];

for (const topic of topics) {
  await fetch('/api/ai/generate-article', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      topic,
      category: 'DNA_EDUCATION',
      tone: 'professional',
    }),
  });
}
// Cost: ~$0.03 total
```

### Example 2: Auto-Publish on Schedule
```typescript
// Generate article
const { data } = await generateArticle({
  topic: "Weekly DNA Testing Tips",
  category: "DNA_EDUCATION",
});

// Schedule for next Monday 10 AM
const nextMonday = new Date();
nextMonday.setDate(nextMonday.getDate() + (1 + 7 - nextMonday.getDay()) % 7);
nextMonday.setHours(10, 0, 0, 0);

await fetch('/api/ai/schedule-publish', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    articleId: data.article.id,
    publishAt: nextMonday.toISOString(),
  }),
});
```

---

## 🔄 Automation Workflow

### Content Publishing Workflow
1. **Generate Articles:** Use AI generator or write manually
2. **Schedule Publishing:** Set future publish date/time
3. **Auto-Publish:** Call GET `/api/ai/schedule-publish` periodically
4. **Result:** Articles automatically published at scheduled time

### Comment Moderation Workflow
1. **User Submits Comment:** Via blog post comment form
2. **Auto-Moderate:** AI runs in background (non-blocking)
3. **Admin Reviews:** Check `/admin/ai-moderation` dashboard
4. **Approve/Reject:** Manual override of AI decisions

---

## 🎓 AI Prompts Used

### Article Generation Prompt
```
You are a professional content writer for Afrigenomix, a DNA testing coordination platform in Africa.

Generate a comprehensive, SEO-optimized blog article about: {topic}

Requirements:
- Length: 1,200-1,500 words
- Tone: {tone}
- Include: Introduction, main sections, conclusion
- SEO: Meta title, description, keywords
- Format: Markdown with headings, bullet points
- Focus: African context, accessibility, trust

Respond with JSON:
{
  "title": "...",
  "content": "... (markdown)",
  "excerpt": "...",
  "metaTitle": "...",
  "metaDescription": "...",
  "metaKeywords": "keyword1, keyword2, ...",
  "tags": ["tag1", "tag2", ...]
}
```

### Comment Moderation Prompt
```
Analyze this comment and determine if it should be APPROVED, REJECTED, or SPAM:

Name: {name}
Email: {email}
Content: {content}

Criteria:
SPAM if: URLs, promotional, gibberish, offensive
REJECT if: Medical advice, hate speech, misinformation
APPROVE if: Genuine question, experience, feedback

Respond with JSON:
{
  "decision": "APPROVED|REJECTED|SPAM",
  "confidence": 0.0-1.0,
  "reason": "brief explanation"
}
```

---

## 🚨 Troubleshooting

### "Unauthorized" Error
- ✅ Check you're logged in as admin
- ✅ Verify JWT token in localStorage
- ✅ Check token expiration

### "OpenAI API Key Not Found"
- ✅ Add `OPENAI_API_KEY` to `.env` file
- ✅ Restart server after adding key
- ✅ Verify key starts with `sk-`

### "Rate Limit Exceeded"
- ✅ OpenAI free tier: 3 requests/minute
- ✅ Wait 1 minute between bulk operations
- ✅ Upgrade to paid tier for higher limits

### Articles Not Auto-Publishing
- ✅ Call GET `/api/ai/schedule-publish` periodically
- ✅ Set up cron job or scheduled task
- ✅ Check `scheduledPublishAt` field is set

---

## 🎯 Next Steps (Optional)

### Enhance AI Features
- [ ] Bulk article generation (multiple topics at once)
- [ ] AI-powered article editing/improvement
- [ ] Automatic social media post generation
- [ ] AI-powered SEO optimization suggestions
- [ ] Sentiment analysis for comments
- [ ] Auto-generate article images (DALL-E)

### Add Automation
- [ ] Cron job for auto-publishing (every hour)
- [ ] Email notifications for AI decisions
- [ ] Weekly AI content suggestions
- [ ] Analytics dashboard (views, engagement)

### Cost Optimization
- [ ] Cache frequently used prompts
- [ ] Batch processing for multiple operations
- [ ] Switch to free alternatives (Ollama, Llama)

---

## 📞 Support

### Questions?
- **Email:** service@afrigenomix.com
- **Phone:** 08111180192

### Documentation
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Prisma Schema](https://www.prisma.io/docs/concepts/components/prisma-schema)

---

## ✅ Summary

You now have a complete AI content automation system:

✅ **Article Generator** - Generate blog posts with AI  
✅ **Comment Moderation** - Auto-detect spam/inappropriate content  
✅ **Auto-Publishing** - Schedule articles for future release  
✅ **Moderation Dashboard** - Review AI decisions manually  

**Total Cost:** ~$0.13/month (your $5 credit lasts 40 months!)

**Next Action:** Get your OpenAI API key and add it to `.env` file!

---

Made with ❤️ by Afrigenomix Team
