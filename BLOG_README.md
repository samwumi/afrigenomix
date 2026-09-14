# Afrigenomix Blog System

A professional, feature-rich blog system built with Next.js 16, React 19, and Prisma, featuring full markdown support, SEO optimization, and advanced navigation.

## 🚀 Features

### Content Features
- ✅ **Full Markdown Support** - GitHub Flavored Markdown with tables, task lists, code blocks
- ✅ **Rich Text Rendering** - Professional typography and styling
- ✅ **Table of Contents** - Auto-generated navigation from headings
- ✅ **Code Syntax Highlighting** - Beautiful code blocks with proper formatting
- ✅ **Image Support** - Lazy loading and responsive images
- ✅ **Category System** - 8 predefined categories for content organization
- ✅ **Featured Articles** - Highlight important content
- ✅ **Related Articles** - Automatic suggestions based on category

### User Experience
- ✅ **Search Functionality** - Real-time search across titles, excerpts, and content
- ✅ **Category Filtering** - Filter articles by category
- ✅ **Social Sharing** - Facebook, Twitter, LinkedIn, Email
- ✅ **Copy Link** - One-click link copying with feedback
- ✅ **View Count Tracking** - Automatic view counting
- ✅ **Read Time Estimation** - Calculated based on word count
- ✅ **Responsive Design** - Mobile-first, fully responsive
- ✅ **Smooth Scrolling** - Enhanced navigation experience

### Technical Features
- ✅ **SEO Optimized** - Meta tags, Open Graph, Twitter Cards, Structured Data
- ✅ **Performance** - Lazy loading, efficient queries, optimized rendering
- ✅ **Security** - HTML sanitization, XSS protection, SQL injection prevention
- ✅ **Accessibility** - Semantic HTML, ARIA labels, keyboard navigation
- ✅ **TypeScript** - Full type safety throughout

## 📁 Project Structure

```
app/
├── blog/
│   ├── page.tsx                    # Blog listing page
│   └── [slug]/
│       └── page.tsx                # Individual article page
│
├── api/
│   └── articles/
│       ├── route.ts                # List articles endpoint
│       └── [slug]/
│           └── route.ts            # Single article endpoint
│
└── globals.css                     # Global styles including article styling

components/
├── MarkdownContent.tsx             # Markdown renderer component
└── TableOfContents.tsx             # Auto-generated TOC component

prisma/
├── schema.prisma                   # Database schema
├── seed-blog.ts                    # Blog seed script
└── ...

public/
└── ... (images, assets)
```

## 🗄️ Database Schema

```prisma
model Article {
  id              String   @id @default(cuid())
  title           String
  slug            String   @unique
  excerpt         String?  @db.Text
  content         String   @db.LongText
  category        ArticleCategory
  featuredImage   String?
  status          ArticleStatus @default(DRAFT)
  isFeatured      Boolean  @default(false)
  viewCount       Int      @default(0)
  metaTitle       String?
  metaDescription String?  @db.Text
  authorId        String
  author          User     @relation(fields: [authorId], references: [id])
  publishedAt     DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

enum ArticleCategory {
  DNA_EDUCATION
  PATERNITY_TESTING
  IMMIGRATION_DNA
  LEGAL_DNA
  PATERNITY_FRAUD
  ADVOCACY
  LEGISLATION
}

enum ArticleStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}
```

## 🎨 Categories

| Category | Description | Color Scheme |
|----------|-------------|--------------|
| DNA_EDUCATION | General DNA testing education | Blue |
| PATERNITY_TESTING | Paternity testing information | Purple |
| IMMIGRATION_DNA | Immigration DNA requirements | Teal |
| LEGAL_DNA | Legal DNA testing guides | Indigo |
| PATERNITY_FRAUD | Paternity fraud awareness | Red |
| ADVOCACY | Campaign and advocacy updates | Orange |
| LEGISLATION | Legislative news and updates | Yellow |

## 🛠️ Setup & Installation

### 1. Install Dependencies

```bash
npm install react-markdown remark-gfm rehype-raw rehype-sanitize
```

These are already included in package.json:
- `react-markdown` - Core markdown rendering
- `remark-gfm` - GitHub Flavored Markdown support
- `rehype-raw` - Allow HTML in markdown
- `rehype-sanitize` - Security sanitization

### 2. Database Setup

Make sure your Prisma schema includes the Article model (already in schema.prisma).

Run migrations:
```bash
npm run prisma:generate
npm run prisma:push
```

### 3. Seed Sample Articles

```bash
npm run db:seed:blog
```

This will:
- Create an admin user (if not exists)
- Add 5 sample articles covering different categories
- Set realistic view counts
- Mark one article as featured

### 4. Start Development Server

```bash
npm run dev
```

Visit:
- Blog listing: http://localhost:3000/blog
- Sample article: http://localhost:3000/blog/understanding-dna-paternity-testing-africa

## 📝 Creating Articles

### Via Admin Interface

1. Navigate to `/admin/content`
2. Click "Create New Article"
3. Fill in the form:
   - Title (required)
   - Slug (auto-generated from title)
   - Category (select from dropdown)
   - Excerpt (short description)
   - Content (markdown)
   - Meta title & description for SEO
   - Featured checkbox
   - Status (Draft/Published)

### Via Database/Seed Script

```typescript
await prisma.article.create({
  data: {
    title: 'Your Article Title',
    slug: 'your-article-slug',
    excerpt: 'Brief description of the article',
    content: `# Your Markdown Content
    
    Write your article in markdown format...
    `,
    category: 'DNA_EDUCATION',
    authorId: adminUser.id,
    status: 'PUBLISHED',
    publishedAt: new Date(),
    isFeatured: false,
  },
});
```

## ✍️ Markdown Writing Guide

### Headings
```markdown
# H1 Heading
## H2 Heading
### H3 Heading
```

### Text Formatting
```markdown
**Bold text**
*Italic text*
~~Strikethrough~~
`Inline code`
```

### Lists
```markdown
- Unordered list item
- Another item

1. Ordered list item
2. Another item
```

### Links and Images
```markdown
[Link text](https://example.com)
![Alt text](https://example.com/image.jpg)
```

### Code Blocks
````markdown
```javascript
const greeting = 'Hello World';
console.log(greeting);
```
````

### Tables
```markdown
| Column 1 | Column 2 |
|----------|----------|
| Data 1   | Data 2   |
```

### Blockquotes
```markdown
> This is a quote
> It can span multiple lines
```

### Task Lists
```markdown
- [ ] Unchecked task
- [x] Checked task
```

## 🎯 API Endpoints

### GET /api/articles

Fetch all published articles with optional filtering.

**Query Parameters:**
- `category` - Filter by category (e.g., DNA_EDUCATION)
- `search` - Search in title, excerpt, content
- `limit` - Number of articles to return (default: 50)

**Response:**
```json
{
  "success": true,
  "data": {
    "articles": [...],
    "featured": {...},
    "total": 25
  }
}
```

### GET /api/articles/[slug]

Fetch single article by slug and increment view count.

**Response:**
```json
{
  "success": true,
  "data": {
    "article": {
      "id": "...",
      "title": "...",
      "content": "...",
      "author": {...},
      "readTime": 5,
      ...
    },
    "related": [...]
  }
}
```

## 🎨 Styling & Customization

### Article Content Styles

Located in `app/globals.css` under `.article-content` class:

```css
.article-content {
  /* Base text styling */
  font-size: 1.125rem;
  line-height: 1.75rem;
  color: #1f2937;
}

.article-content h2 {
  /* Customize headings */
  font-size: 2rem;
  border-bottom: 2px solid var(--color-teal-200);
  padding-bottom: 0.5rem;
}

/* Customize code blocks, blockquotes, tables, etc. */
```

### Component Customization

**MarkdownContent.tsx** - Customize markdown rendering:
```typescript
components={{
  h1: ({ node, children, ...props }) => (
    <h1 id={generateId(String(children))} {...props}>
      {children}
    </h1>
  ),
  // Customize other elements...
}}
```

**TableOfContents.tsx** - Customize TOC appearance and behavior

## 🔍 SEO Best Practices

### Meta Tags
- Set unique `metaTitle` and `metaDescription` for each article
- Include relevant keywords naturally
- Keep titles under 60 characters
- Keep descriptions under 160 characters

### Structured Data
Articles automatically include Schema.org Article structured data:
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "...",
  "description": "...",
  "image": "...",
  "datePublished": "...",
  "author": {...}
}
```

### Open Graph Tags
Automatically generated for social sharing:
- `og:title`
- `og:description`
- `og:image`
- `og:type` (article)
- `article:published_time`
- `article:author`

## 📊 Analytics & Tracking

### View Count
View counts are automatically incremented when an article is viewed:
```typescript
await prisma.article.update({
  where: { id: article.id },
  data: { viewCount: { increment: 1 } },
});
```

### Custom Analytics
Add Google Analytics, Plausible, or other analytics by:
1. Adding tracking scripts to `app/layout.tsx`
2. Tracking page views in `app/blog/[slug]/page.tsx`
3. Tracking social shares and link copies

## 🚀 Performance Optimization

### Image Optimization
- Use lazy loading: `<img loading="lazy" />`
- Compress images before upload
- Consider Next.js Image component for featured images

### Code Splitting
- React components are automatically code-split
- Markdown renderer only loads on blog pages

### Caching
- Implement Redis caching for frequently accessed articles
- Use Next.js ISR (Incremental Static Regeneration) for static articles

### Database Optimization
- Index on `slug` for fast lookups (already implemented)
- Index on `status` and `publishedAt` for listing queries
- Use `select` to fetch only needed fields

## 🔒 Security

### HTML Sanitization
All markdown content is sanitized using `rehype-sanitize` to prevent XSS attacks.

### SQL Injection Prevention
Prisma uses parameterized queries, preventing SQL injection.

### Content Security Policy
Consider adding CSP headers to prevent inline script execution.

### Authentication
Blog viewing is public, but content management should require authentication:
- Admin routes protected with middleware
- API routes check user roles
- Only ADMIN and SUPER_ADMIN can create/edit articles

## 🐛 Troubleshooting

### Articles not showing
- Check article status is `PUBLISHED`
- Verify `publishedAt` date is not in future
- Check database connection

### Markdown not rendering
- Verify react-markdown is installed
- Check for syntax errors in markdown
- Ensure content field is populated

### TOC not showing
- Verify article has headings (h1-h6)
- Check TableOfContents component is imported
- Ensure content has valid markdown headings

### Images not loading
- Check image URLs are correct
- Verify images are publicly accessible
- Consider using absolute URLs for external images

## 📱 Mobile Optimization

- Responsive grid: 3 columns → 2 → 1
- Touch-friendly buttons (min 44x44px)
- Collapsible category filters on mobile
- TOC hidden on mobile (desktop only)
- Optimized font sizes for readability

## 🌐 Internationalization (Future)

To add multi-language support:

1. Add `locale` field to Article model
2. Create language switcher component
3. Filter articles by locale
4. Translate UI strings
5. Consider using i18n library

## 📈 Future Enhancements

Recommended features to add:

- [ ] Comments system (Disqus/custom)
- [ ] Article reactions (like/helpful)
- [ ] Reading progress bar
- [ ] Print-friendly stylesheet
- [ ] Bookmark/save for later
- [ ] Newsletter subscription (functional)
- [ ] RSS feed generation
- [ ] Advanced search with filters
- [ ] Infinite scroll pagination
- [ ] Article series/collections
- [ ] Audio version (text-to-speech)
- [ ] Multi-language support
- [ ] Featured image uploads
- [ ] Tag system beyond categories
- [ ] Draft preview mode
- [ ] Scheduled publishing
- [ ] Article versioning

## 🤝 Contributing

When contributing blog articles:

1. Write in clear, accessible language
2. Use proper markdown formatting
3. Include relevant headings for TOC
4. Add alt text to all images
5. Cite sources when appropriate
6. Proofread for spelling/grammar
7. Set appropriate category
8. Write compelling excerpts
9. Optimize for SEO
10. Test on mobile devices

## 📄 License

This blog system is part of the Afrigenomix platform. All rights reserved.

## 🆘 Support

For questions or issues:
- Email: dev@afrigenomix.com
- Documentation: /docs
- Issue tracker: GitHub Issues

---

**Built with ❤️ for Afrigenomix**  
*Making DNA testing accessible across Africa*
