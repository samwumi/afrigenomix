import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import prisma from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Pre-defined topic pool for automatic generation
const TOPIC_POOL = [
  // DNA Education
  { topic: 'Understanding DNA Testing: A Beginner\'s Guide', category: 'DNA_EDUCATION', tone: 'friendly' },
  { topic: 'How DNA Determines Your Ancestry', category: 'DNA_EDUCATION', tone: 'professional' },
  { topic: 'The Science Behind DNA Matching', category: 'DNA_EDUCATION', tone: 'technical' },
  { topic: 'DNA Testing vs Traditional Methods', category: 'DNA_EDUCATION', tone: 'conversational' },
  
  // Paternity Testing
  { topic: 'Complete Guide to Paternity Testing in Nigeria', category: 'PATERNITY_TESTING', tone: 'professional' },
  { topic: 'How Accurate is DNA Paternity Testing?', category: 'PATERNITY_TESTING', tone: 'friendly' },
  { topic: 'Legal Requirements for Paternity Tests in Africa', category: 'PATERNITY_TESTING', tone: 'professional' },
  { topic: 'Understanding Your Paternity Test Results', category: 'PATERNITY_TESTING', tone: 'conversational' },
  
  // Immigration DNA
  { topic: 'DNA Testing for UK Immigration: Complete Guide', category: 'IMMIGRATION_DNA', tone: 'professional' },
  { topic: 'US Immigration DNA Testing Requirements 2026', category: 'IMMIGRATION_DNA', tone: 'professional' },
  { topic: 'Canadian Immigration DNA Test Process', category: 'IMMIGRATION_DNA', tone: 'professional' },
  { topic: 'How to Prepare for Immigration DNA Testing', category: 'IMMIGRATION_DNA', tone: 'friendly' },
  
  // Legal DNA
  { topic: 'Chain of Custody in Legal DNA Testing', category: 'LEGAL_DNA', tone: 'technical' },
  { topic: 'Court-Admissible DNA Tests: What You Need to Know', category: 'LEGAL_DNA', tone: 'professional' },
  { topic: 'Legal DNA Testing for Child Support Cases', category: 'LEGAL_DNA', tone: 'professional' },
  
  // Paternity Fraud
  { topic: 'The Impact of Paternity Fraud on Families', category: 'PATERNITY_FRAUD', tone: 'professional' },
  { topic: 'Paternity Fraud Statistics in Africa', category: 'PATERNITY_FRAUD', tone: 'professional' },
  { topic: 'Legal Rights When Discovering Paternity Fraud', category: 'PATERNITY_FRAUD', tone: 'professional' },
  
  // Advocacy
  { topic: 'Why Paternity Fraud Should Be Criminalized', category: 'ADVOCACY', tone: 'professional' },
  { topic: 'DNA Testing Access Across Africa: Current State', category: 'ADVOCACY', tone: 'professional' },
  { topic: 'Advocating for Affordable DNA Testing', category: 'ADVOCACY', tone: 'conversational' },
];

/**
 * POST /api/ai/auto-content
 * Automatically generate and schedule multiple articles
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.authenticated || !auth.user || auth.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { 
      count = 3, // Number of articles to generate
      startDate, // When to start publishing (ISO string)
      frequency = 'weekly', // daily, weekly, biweekly
    } = body;

    if (count < 1 || count > 10) {
      return NextResponse.json(
        { success: false, error: 'Count must be between 1 and 10' },
        { status: 400 }
      );
    }

    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
    
    // Get or create AI author
    let aiAuthor = await prisma.contentAuthor.findFirst({
      where: { email: 'ai@afrigenomix.com' },
    });

    if (!aiAuthor) {
      aiAuthor = await prisma.contentAuthor.create({
        data: {
          name: 'Afrigenomix Editorial Team',
          email: 'ai@afrigenomix.com',
          title: 'AI Content Generator',
          bio: 'Automated content generation powered by AI',
          isActive: true,
        },
      });
    }

    // Check which topics have been used recently (last 30 days)
    const recentArticles = await prisma.article.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
      select: { title: true },
    });

    const usedTopics = new Set(recentArticles.map(a => a.title));
    
    // Filter out recently used topics
    const availableTopics = TOPIC_POOL.filter(t => !usedTopics.has(t.topic));
    
    if (availableTopics.length < count) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Only ${availableTopics.length} unused topics available. Try again later or reduce count.`,
        },
        { status: 400 }
      );
    }

    // Randomly select topics
    const selectedTopics = availableTopics
      .sort(() => Math.random() - 0.5)
      .slice(0, count);

    // Calculate publish dates
    const baseDate = startDate ? new Date(startDate) : new Date();
    const publishDates: Date[] = [];
    
    for (let i = 0; i < count; i++) {
      const date = new Date(baseDate);
      if (frequency === 'daily') {
        date.setDate(date.getDate() + i);
      } else if (frequency === 'weekly') {
        date.setDate(date.getDate() + (i * 7));
      } else if (frequency === 'biweekly') {
        date.setDate(date.getDate() + (i * 14));
      }
      publishDates.push(date);
    }

    // Generate articles
    const generatedArticles = [];
    let totalCost = 0;

    for (let i = 0; i < selectedTopics.length; i++) {
      const { topic, category, tone } = selectedTopics[i];
      const publishAt = publishDates[i];

      try {
        // Generate article content
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are a professional content writer for Afrigenomix, a DNA testing coordination platform in Africa.`,
            },
            {
              role: 'user',
              content: `Write a comprehensive, SEO-optimized blog article about: ${topic}

Requirements:
- Length: 1,200-1,500 words
- Tone: ${tone}
- Category: ${category}
- Format: Well-structured markdown with ## headings
- Include: Introduction, 3-5 main sections, practical examples, conclusion
- Focus: African context, accessibility, trust

Respond with ONLY valid JSON:
{
  "title": "Engaging article title",
  "content": "Full markdown content...",
  "excerpt": "Brief 2-3 sentence summary",
  "metaTitle": "SEO title 50-60 chars",
  "metaDescription": "SEO description 150-160 chars",
  "metaKeywords": "keyword1, keyword2, keyword3",
  "tags": ["tag1", "tag2", "tag3"]
}`,
            },
          ],
          temperature: 0.7,
          max_tokens: 2500,
        });

        const response = completion.choices[0]?.message?.content || '';
        const usage = completion.usage;
        const cost = ((usage?.prompt_tokens || 0) * 0.00000015 + (usage?.completion_tokens || 0) * 0.0000006);
        totalCost += cost;

        // Parse JSON response
        let articleData;
        try {
          const jsonMatch = response.match(/\{[\s\S]*\}/);
          if (!jsonMatch) throw new Error('No JSON found');
          articleData = JSON.parse(jsonMatch[0]);
        } catch (parseError) {
          console.error('Failed to parse AI response for topic:', topic);
          continue;
        }

        // Generate slug
        const slug = (articleData.title || topic)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');

        // Check if slug exists
        const existingArticle = await prisma.article.findUnique({
          where: { slug },
        });

        const finalSlug = existingArticle ? `${slug}-${Date.now()}` : slug;

        // Determine status
        const now = new Date();
        const status = publishAt > now ? 'DRAFT' : 'PUBLISHED';
        const publishedAt = publishAt <= now ? publishAt : null;
        const scheduledPublishAt = publishAt > now ? publishAt : null;

        // Create article
        const article = await prisma.article.create({
          data: {
            title: articleData.title || topic,
            slug: finalSlug,
            content: articleData.content,
            excerpt: articleData.excerpt,
            category: category,
            authorId: aiAuthor.id,
            metaTitle: articleData.metaTitle,
            metaDescription: articleData.metaDescription,
            metaKeywords: articleData.metaKeywords,
            status,
            publishedAt,
            scheduledPublishAt,
          },
        });

        // Add tags
        if (articleData.tags && Array.isArray(articleData.tags)) {
          await Promise.all(
            articleData.tags.slice(0, 5).map((tag: string) =>
              prisma.articleTag.create({
                data: {
                  articleId: article.id,
                  tag: tag,
                },
              })
            )
          );
        }

        generatedArticles.push({
          id: article.id,
          title: article.title,
          slug: article.slug,
          status: article.status,
          publishAt: publishAt.toISOString(),
          cost: `$${cost.toFixed(6)}`,
        });

      } catch (error) {
        console.error(`Failed to generate article for topic: ${topic}`, error);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        articles: generatedArticles,
        totalGenerated: generatedArticles.length,
        totalCost: `$${totalCost.toFixed(4)}`,
      },
      message: `Successfully generated ${generatedArticles.length} article(s)`,
    });

  } catch (error) {
    console.error('Auto-content generation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to auto-generate content',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ai/auto-content
 * Get available topics and stats
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.authenticated || !auth.user || auth.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    console.log('Fetching auto-content info...');
    console.log('Total topics in pool:', TOPIC_POOL.length);

    // Get recently used topics
    const recentArticles = await prisma.article.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
      select: { title: true, category: true },
    });

    console.log('Recent articles found:', recentArticles.length);

    const usedTopics = new Set(recentArticles.map(a => a.title));
    const availableTopics = TOPIC_POOL.filter(t => !usedTopics.has(t.topic));

    console.log('Used topics:', usedTopics.size);
    console.log('Available topics:', availableTopics.length);

    // Category distribution
    const categoryCount: Record<string, number> = {};
    TOPIC_POOL.forEach(t => {
      categoryCount[t.category] = (categoryCount[t.category] || 0) + 1;
    });

    return NextResponse.json({
      success: true,
      data: {
        totalTopics: TOPIC_POOL.length,
        availableTopics: availableTopics.length,
        usedTopics: usedTopics.size,
        categoryDistribution: categoryCount,
        availableTopicsList: availableTopics.map(t => ({
          topic: t.topic,
          category: t.category,
        })),
      },
    });

  } catch (error) {
    console.error('Get auto-content info error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get info',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
