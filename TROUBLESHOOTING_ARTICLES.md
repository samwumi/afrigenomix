# Article "Not Found" Troubleshooting

## Issue
Articles show "Article not found" after being published, but older articles work fine.

## Possible Causes

### 1. Duplicate Slug
**Symptom:** Article saves successfully but can't be viewed
**Cause:** Two articles with the same slug (URL)
**Check:** Are you using similar titles? The slug is auto-generated from the title.

Example:
- Title: "DNA Testing Guide" → Slug: `dna-testing-guide`
- Title: "DNA Testing Guide 2" → Slug: `dna-testing-guide-2`

**Solution:** Use unique titles or manually edit the slug field.

### 2. Status Not Set to PUBLISHED
**Symptom:** Article exists but shows "not found"
**Cause:** Article status is DRAFT, not PUBLISHED
**Check:** Public blog only shows PUBLISHED articles

### 3. Database Schema Not Updated
**Symptom:** Articles truncated or not saving properly
**Cause:** Schema change (LongText) not applied to database
**Solution:** Run `npx prisma db push` in production

### 4. Cache Issue
**Symptom:** Old data showing, new articles not appearing
**Cause:** Browser or server cache
**Solution:** Hard refresh (Ctrl+Shift+R) or clear cache

## Debug Steps

### Step 1: Check Database
Visit: `https://afrigenomix.com/api/admin/articles/debug`

Look for:
- Total article count
- Your new article in the list
- The article's `status` field (should be "PUBLISHED")
- The article's `slug` field

### Step 2: Check Admin List
Go to: `https://afrigenomix.com/admin/content`

Can you see your new article?
- If YES: Note the slug
- If NO: Check status filter (set to "All Status")

### Step 3: Manual URL Test
Try accessing directly:
```
https://afrigenomix.com/blog/YOUR-ARTICLE-SLUG
```

Replace `YOUR-ARTICLE-SLUG` with your actual slug.

### Step 4: Check API Response
Open browser dev tools (F12), go to Network tab, then visit the article.

Look at the API request to `/api/articles/[slug]`:
- Status code 404? Article doesn't exist or isn't PUBLISHED
- Status code 200? Article exists, frontend issue

## Common Mistakes

### ❌ Using Same Title
```
Title: "DNA Testing"
Title: "DNA Testing"  ← This will fail (duplicate slug)
```

### ✅ Unique Titles
```
Title: "DNA Testing Guide"
Title: "DNA Testing for Immigration"
Title: "Legal DNA Testing in Nigeria"
```

### ❌ Saving as Draft
Clicking "Save as Draft" then expecting it on public blog
Public blog = PUBLISHED only

### ✅ Publishing
Click "Publish Article" button (not "Save as Draft")

## Quick Fixes

### Fix 1: Check Your Article Status
1. Go to `/admin/content`
2. Find your article
3. Look at the status badge
4. If it says "Draft", click Edit and publish it

### Fix 2: Use Unique Slugs
When creating articles:
1. Write a unique title
2. Check the "URL Slug" field below
3. If needed, manually edit it to be unique
4. Example: `dna-testing-1`, `dna-testing-2`, etc.

### Fix 3: Verify Slug
After saving, note the slug from admin list, then try:
```
/blog/exact-slug-from-admin
```

## Need More Help?

If articles are still not showing:

1. Share the debug output from `/api/admin/articles/debug`
2. Share the exact title and slug of the missing article
3. Share any error messages from browser console (F12)

Then we can diagnose the exact issue!
