# Blog Quick Start Guide

Get your Afrigenomix blog up and running in 5 minutes!

## Step 1: Install Dependencies ✅

Already done! The following packages are installed:
- `react-markdown`
- `remark-gfm`
- `rehype-raw`
- `rehype-sanitize`

## Step 2: Seed Sample Articles

Run this command to populate your blog with sample articles:

```bash
npm run db:seed:blog
```

This creates:
- 1 admin user (Dr. Sarah Okonkwo)
- 5 sample articles across different categories
- 1 featured article

**Default Admin Credentials:**
- Email: admin@afrigenomix.com
- Password: Admin@123

## Step 3: Start Development Server

```bash
npm run dev
```

## Step 4: View Your Blog

Visit these URLs:

- **Blog listing:** http://localhost:3000/blog
- **Sample article:** http://localhost:3000/blog/understanding-dna-paternity-testing-africa
- **Admin content:** http://localhost:3000/admin/content

## Step 5: Test Features

### Test Search
1. Go to /blog
2. Type "DNA" in search box
3. See filtered results

### Test Category Filter
1. Click on category badges
2. See articles filtered by category

### Test Article Features
1. Click any article
2. Scroll to see Table of Contents update
3. Click "Share" button
4. Try "Copy Link" feature
5. View Related Articles section

## Creating Your First Article

### Option 1: Via Admin Interface
1. Login to /admin/content
2. Click "Create New Article"
3. Fill in the form with markdown content
4. Click "Publish"

### Option 2: Via Database

```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

await prisma.article.create({
  data: {
    title: 'My First Article',
    slug: 'my-first-article',
    excerpt: 'This is my first blog article',
    content: `# Welcome to My Blog

This is a **markdown** article with:
- Lists
- Links
- Code blocks

And much more!`,
    category: 'DNA_EDUCATION',
    authorId: 'your-admin-user-id',
    status: 'PUBLISHED',
    publishedAt: new Date(),
  },
});
```

## Markdown Quick Reference

```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*

- Bullet point
- Another point

1. Numbered list
2. Second item

[Link text](https://example.com)

> This is a quote

```code
Code block
```

| Table | Header |
|-------|--------|
| Data  | Data   |
```

## Customization

### Change Colors
Edit `/app/globals.css`:
```css
.article-content a {
  color: your-color; /* Change link color */
}
```

### Modify Categories
Edit category colors in `/app/blog/page.tsx`:
```typescript
const CATEGORIES = [
  { value: 'DNA_EDUCATION', label: 'DNA Education', color: 'bg-blue-100...' },
  // Add or modify categories
];
```

### Update TOC Styling
Edit `/components/TableOfContents.tsx` to customize appearance.

## Common Tasks

### Make an Article Featured
```typescript
await prisma.article.update({
  where: { slug: 'article-slug' },
  data: { isFeatured: true },
});
```

### Check Article View Count
```typescript
const article = await prisma.article.findUnique({
  where: { slug: 'article-slug' },
  select: { viewCount: true },
});
console.log(`Views: ${article.viewCount}`);
```

### Delete All Articles (be careful!)
```typescript
await prisma.article.deleteMany();
```

## Production Deployment

Before deploying:

1. **Update Domain** in article pages:
   - Change `https://afrigenomix.com` to your actual domain
   - Located in SEO tags and structured data

2. **Environment Variables**:
   - Ensure DATABASE_URL is set
   - Add analytics tracking IDs if needed

3. **Build Test**:
   ```bash
   npm run build
   ```

4. **Seed Production Data**:
   ```bash
   npm run db:seed:blog
   ```

## Troubleshooting

**Issue:** Articles not showing
- **Fix:** Check status is PUBLISHED and publishedAt is set

**Issue:** Search not working
- **Fix:** Verify API route at /api/articles is accessible

**Issue:** Markdown not rendering
- **Fix:** Check react-markdown is installed: `npm list react-markdown`

**Issue:** TOC not appearing
- **Fix:** Ensure article has markdown headings (# ## ###)

## Next Steps

1. ✅ Test all features on /blog
2. ✅ Create your first article
3. ✅ Customize colors and styling
4. ✅ Add your own content
5. ✅ Deploy to production

## Resources

- **Full Documentation:** BLOG_README.md
- **Sample Article:** BLOG_SAMPLE_ARTICLE.md
- **Completion Summary:** BLOG_COMPLETION_SUMMARY.md

## Need Help?

The blog is fully functional with:
- ✅ Markdown rendering
- ✅ Search & filters
- ✅ Table of contents
- ✅ Social sharing
- ✅ SEO optimization
- ✅ Mobile responsive
- ✅ View tracking
- ✅ Related articles

Everything is ready to use! 🎉
