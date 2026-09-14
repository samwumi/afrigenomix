# 📝 How to Access and Create Blog Posts

## ✅ All Routes Now Created!

I've just created all the necessary API routes and pages for blog management.

---

## 🔐 Step 1: Login to Admin

First, you need to be logged in as an admin user.

### Option A: Use Existing Admin (if seeded)
```bash
npm run db:seed:blog
```

This creates:
- **Email**: admin@afrigenomix.com
- **Password**: Admin@123

### Option B: Login with Your Admin Account
If you already have an admin account, just login at:
```
http://localhost:3000/login
```

---

## 📊 Step 2: Access Admin Content Dashboard

After logging in, navigate to:
```
http://localhost:3000/admin/content
```

You should see:
- **Stats cards** (Total, Published, Drafts, Views)
- **Search and filters**
- **List of articles** (if any exist)
- **"New Article" button** (top right)

---

## ✍️ Step 3: Create Your First Article

### Click "New Article" Button

Or go directly to:
```
http://localhost:3000/admin/content/new
```

### Fill in the Form:

1. **Title** (required)
   - Example: "Understanding DNA Testing in Nigeria"
   - Slug auto-generates as you type

2. **URL Slug** (required)
   - Auto-filled from title
   - Can customize if needed
   - Preview shows: afrigenomix.com/blog/your-slug

3. **Excerpt** (optional)
   - Brief description
   - Shows in article listings
   - ~150 characters recommended

4. **Content** (required - MARKDOWN)
   ```markdown
   # Your Article Title
   
   Opening paragraph...
   
   :::tip Pro Tip
   Use custom callouts for engagement!
   :::
   
   ## Section 1
   
   Content here...
   
   ### Subsection
   
   More content...
   ```

5. **Category** (required)
   - DNA_EDUCATION
   - PATERNITY_TESTING
   - IMMIGRATION_DNA
   - LEGAL_DNA
   - PATERNITY_FRAUD
   - ADVOCACY
   - LEGISLATION

6. **SEO Settings** (optional but recommended)
   - **Meta Title**: Under 60 characters
   - **Meta Description**: Under 160 characters

7. **Featured** (checkbox)
   - Check to display on homepage

### Save Options:

- **"Publish Article"** - Makes it live immediately
- **"Save as Draft"** - Saves for later

---

## 🎯 Quick Example Article

Here's a quick article you can copy/paste to test:

```markdown
# Welcome to Afrigenomix Blog

This is your first blog post! Let's explore what you can do.

:::info Getting Started
This article shows you all the features available in our blog system.
:::

## What is DNA Testing?

DNA testing helps determine biological relationships between individuals.

### Types of Tests Available

1. **Legal DNA Testing**
   - Court-admissible
   - Strict chain of custody
   - Required for legal proceedings

2. **Peace of Mind Testing**
   - Personal knowledge
   - Same accuracy
   - More affordable

:::tip Pro Tip
Always choose legal testing if there's ANY chance of court involvement!
:::

## How It Works

| Step | Description | Timeline |
|------|-------------|----------|
| 1 | Sample Collection | 1 hour |
| 2 | Lab Analysis | 3-5 days |
| 3 | Results | Email delivery |

### Code Example

```javascript
// Book your test
const bookTest = async () => {
  const response = await fetch('/api/appointments', {
    method: 'POST',
    body: JSON.stringify({ testType: 'PATERNITY' })
  });
};
```

## Take Action Today

Ready to get your DNA test? [Find your test](/test-finder) or [contact us](/contact).

:::success You're Ready!
Start your DNA testing journey today!
:::

---

*Questions? Email us at info@afrigenomix.com*
```

---

## 👀 Step 4: View Your Published Article

After publishing, you can:

### View in Blog Listing
```
http://localhost:3000/blog
```

### View Individual Article
```
http://localhost:3000/blog/your-article-slug
```

### Manage from Admin
```
http://localhost:3000/admin/content
```

From admin, you can:
- ✏️ Edit article
- 👁️ View published article
- 🌟 Toggle featured status
- 🗑️ Delete article

---

## 🎨 Using Engagement Features

When writing your articles, use these features:

### Custom Callouts
```markdown
:::info Title
Information here
:::

:::warning Title
Warning here
:::

:::success Title
Success message
:::

:::tip Title
Helpful tip
:::

:::question Title
Answer to FAQ
:::
```

### Rich Content
- Use **bold** and *italic*
- Add `inline code`
- Create lists
- Add tables
- Include links
- Use blockquotes

### Structure
- H1 for main title
- H2 for major sections
- H3 for subsections
- Generates Table of Contents automatically!

---

## 🐛 Troubleshooting

### "Can't see New Article button"
- **Solution**: Make sure you're logged in as ADMIN
- Check: `/login` → use admin credentials

### "Can't access /admin/content"
- **Solution**: Your user role must be ADMIN or SUPER_ADMIN
- Check your user in database

### "Create page not loading"
- **Solution**: Clear browser cache and refresh
- Or try: `http://localhost:3000/admin/content/new`

### "API error when creating"
- **Solution**: Check that server is running
- Verify you're logged in (check localStorage for 'auth_token')

---

## 🔑 Quick Access URLs

After starting server (`npm run dev`):

| Page | URL |
|------|-----|
| Login | `http://localhost:3000/login` |
| Admin Dashboard | `http://localhost:3000/admin` |
| Content Manager | `http://localhost:3000/admin/content` |
| **Create Article** | `http://localhost:3000/admin/content/new` |
| Blog Listing | `http://localhost:3000/blog` |

---

## ✅ Complete Checklist

- [ ] Server running (`npm run dev`)
- [ ] Admin user exists (run seed if needed)
- [ ] Logged in as admin
- [ ] Can access `/admin/content`
- [ ] Can see "New Article" button
- [ ] Can access `/admin/content/new`
- [ ] Form loads correctly
- [ ] Can type in all fields
- [ ] Can publish/save article
- [ ] Article appears in listing
- [ ] Can view published article

---

## 🎉 You're Ready!

Everything is now set up for you to create engaging blog posts!

**Next Steps:**
1. Login to admin
2. Click "New Article"
3. Write your first post
4. Use custom callouts for engagement
5. Publish and share!

---

## 📚 Additional Resources

- **ENGAGEMENT_FEATURES_GUIDE.md** - How to use engagement features
- **ENGAGING_ARTICLE_TEMPLATE.md** - Full article example
- **BLOG_README.md** - Complete documentation
- **BLOG_QUICK_START.md** - Setup guide

---

**Need Help?** All API routes and pages are now created and ready to use! 🚀
