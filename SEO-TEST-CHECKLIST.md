# Afrigenomix SEO Testing Checklist

## 🧪 Quick SEO Tests (Before Launch)

### 1. Meta Tags Test
Visit any page and view page source (Ctrl+U or Cmd+U):

```html
<!-- Should see: -->
<title>Your Page Title | Afrigenomix</title>
<meta name="description" content="Your page description...">
<meta name="keywords" content="DNA testing, Nigeria, ...">

<!-- Open Graph -->
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="/og-image.jpg">
<meta property="og:url" content="https://afrigenomix.com/...">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="...">
```

### 2. Structured Data Test
For blog articles, check for JSON-LD:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "...",
  "author": {...}
}
</script>
```

**Test URL**: https://search.google.com/test/rich-results
- Enter: https://afrigenomix.com/blog/your-article-slug
- Check for Article schema validation

### 3. Social Media Preview Test

**Facebook Debugger**: https://developers.facebook.com/tools/debug/
- Enter: https://afrigenomix.com
- Click "Scrape Again"
- Verify image, title, description appear correctly

**Twitter Card Validator**: https://cards-dev.twitter.com/validator
- Enter: https://afrigenomix.com
- Verify card preview

**LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/
- Enter: https://afrigenomix.com
- Check preview

### 4. robots.txt Test
Visit: https://afrigenomix.com/robots.txt

Should see:
```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /dashboard/
Disallow: /api/

Sitemap: https://afrigenomix.com/sitemap.xml
```

### 5. Sitemap Test
Visit: https://afrigenomix.com/sitemap.xml

Should see XML with:
- Homepage URL
- Blog URL
- Test Finder URL
- Advocacy URL
- All other static pages

### 6. Mobile-Friendly Test
**Google Mobile-Friendly Test**: https://search.google.com/test/mobile-friendly
- Enter: https://afrigenomix.com
- Should pass all checks

### 7. Page Speed Test
**Google PageSpeed Insights**: https://pagespeed.web.dev/
- Enter: https://afrigenomix.com
- Target: 90+ score for both mobile and desktop

### 8. Core Web Vitals
Check in PageSpeed Insights:
- ✅ LCP (Largest Contentful Paint): < 2.5s
- ✅ FID (First Input Delay): < 100ms
- ✅ CLS (Cumulative Layout Shift): < 0.1

### 9. Manual Tests

#### Homepage (/)
- [ ] Title includes "Afrigenomix"
- [ ] Description mentions DNA testing
- [ ] Keywords include "Nigeria", "Africa"
- [ ] OG image loads

#### Blog Listing (/blog)
- [ ] Title: "DNA Testing Education & Advocacy Blog"
- [ ] Description mentions education and advocacy
- [ ] Keywords include "blog", "education"

#### Blog Article (/blog/[slug])
- [ ] Title matches article title
- [ ] Description from article excerpt
- [ ] Author name in meta tags
- [ ] Published date visible
- [ ] View counter works (refresh and check increment)
- [ ] Share buttons open correct URLs

#### Advocacy Page (/advocacy)
- [ ] Campaign title in page title
- [ ] Description mentions paternity fraud
- [ ] Social share includes #EndPaternityFraudNG hashtag
- [ ] Progress bar shows correct percentage

### 10. Search Console Verification

After domain is live:

1. **Add Property**
   - Google Search Console
   - Add afrigenomix.com
   - Verify ownership (DNS or HTML file)

2. **Submit Sitemap**
   - Go to Sitemaps section
   - Submit: https://afrigenomix.com/sitemap.xml
   - Wait for Google to crawl

3. **Check Coverage**
   - After 3-7 days, check Coverage report
   - All important pages should be indexed
   - Fix any errors

4. **Monitor Performance**
   - Check which queries drive traffic
   - Optimize low-performing pages
   - Add more content for top queries

## 🎯 Success Metrics

### Week 1
- [ ] Site indexed by Google
- [ ] Sitemap processed
- [ ] No crawling errors
- [ ] Rich results eligible

### Month 1
- [ ] Ranking for brand name
- [ ] Appearing in "DNA test Nigeria" searches (position 20-50)
- [ ] 100+ organic sessions
- [ ] 5+ pages indexed

### Month 3
- [ ] Multiple keyword rankings (position 10-30)
- [ ] 500+ organic sessions
- [ ] Blog articles appearing in search
- [ ] Growing backlinks

### Month 6
- [ ] Top 10 rankings for target keywords
- [ ] 2,000+ organic sessions
- [ ] Featured snippets for some queries
- [ ] Strong domain authority

## 🔧 Troubleshooting

### Issue: Pages not indexed
**Solution**: 
- Check robots.txt doesn't block
- Submit URL in Search Console
- Ensure proper internal linking
- Add more quality content

### Issue: Low rankings
**Solution**:
- Add more content (aim for 1,500+ words)
- Improve keyword density
- Get quality backlinks
- Improve page speed

### Issue: High bounce rate
**Solution**:
- Improve page load speed
- Make content more engaging
- Add internal links
- Improve mobile experience

### Issue: Social previews not showing
**Solution**:
- Check OG image is accessible
- Image must be < 8MB
- Use absolute URLs
- Clear social media cache

## 📊 Tools to Use

### Free Tools:
1. **Google Search Console** - Indexing and performance
2. **Google Analytics 4** - Traffic analysis
3. **Google PageSpeed Insights** - Performance
4. **Mobile-Friendly Test** - Mobile optimization
5. **Rich Results Test** - Structured data
6. **Facebook Debugger** - OG tags
7. **Screaming Frog** - Site crawl (500 URLs free)

### Paid Tools (Optional):
1. **Ahrefs** - Keyword research, backlinks
2. **SEMrush** - Comprehensive SEO suite
3. **Moz Pro** - Ranking tracking
4. **Surfer SEO** - Content optimization

## ✅ Launch Day Checklist

- [ ] All meta tags confirmed on live site
- [ ] robots.txt accessible
- [ ] sitemap.xml accessible
- [ ] OG images uploaded
- [ ] HTTPS enabled and forced
- [ ] Social share buttons work
- [ ] View counter incrementing
- [ ] No console errors
- [ ] Mobile fully responsive
- [ ] Page load < 3 seconds
- [ ] Submit to Google Search Console
- [ ] Submit to Bing Webmaster Tools
- [ ] Set up Google Analytics
- [ ] Test all share buttons
- [ ] Check all canonical URLs

---

**Note**: SEO is a long-term strategy. Results typically take 3-6 months. Focus on creating quality content and building authority.

**Domain**: afrigenomix.com
**Status**: Ready for Launch 🚀
