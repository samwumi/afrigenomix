import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/**
 * POST /api/ai/generate-article
 * Generate an article using OpenAI GPT-4o-mini
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    let userId: string;
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      userId = decoded.userId;
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Verify user is admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { topic, category, tone = 'professional' } = body;

    if (!topic || !category) {
      return NextResponse.json(
        { success: false, error: 'Topic and category are required' },
        { status: 400 }
      );
    }

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
    });

    // Generate article content using OpenAI
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

    // Parse JSON response
    let articleData;
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON found');
      articleData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Failed to parse AI response:', response);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to parse AI response',
          details: 'AI returned invalid format',
        },
        { status: 500 }
      );
    }

    // Generate slug from title
    const slug = articleData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Check if slug already exists
    const existingArticle = await prisma.article.findUnique({
      where: { slug },
    });

    if (existingArticle) {
      // Append timestamp to make unique
      const timestamp = Date.now();
      articleData.slug = `${slug}-${timestamp}`;
    } else {
      articleData.slug = slug;
    }

    // Get or create AI author
    let aiAuthor = await prisma.contentAuthor.findFirst({
      where: { email: 'ai@afrigenomix.com' },
    });

    if (!aiAuthor) {
      aiAuthor = await prisma.contentAuthor.create({
        data: {
          name: 'Afrigenomix Editorial Team',
          email: 'ai@afrigenomix.com',
          title: '',
          bio: 'The Afrigenomix editorial team brings you the latest insights in African genomics and personalized medicine.',
          isActive: true,
        },
      });
    }

    // Fetch a relevant image from Unsplash (FREE!)
    let featuredImage = null;
    try {
      const searchQuery = topic || category.toLowerCase().replace(/_/g, ' ') + ' science health';
      
      const unsplashResponse = await fetch(
        `https://api.unsplash.com/photos/random?query=${encodeURIComponent(searchQuery)}&orientation=landscape`,
        {
          headers: {
            'Authorization': 'Client-ID 8-YfFQGP0zCy2Dj7OHQZXyOq6KVEJv6hVYsZ0MKvXJ8'
          }
        }
      );

      if (unsplashResponse.ok) {
        const imageData = await unsplashResponse.json();
        featuredImage = imageData.urls.regular;
        console.log(`✅ Found image for "${topic}"`);
      }
    } catch (imageError) {
      console.log(`⚠️ Could not fetch image, continuing without image`);
    }

    // Create article in database
    const article = await prisma.article.create({
      data: {
        title: articleData.title,
        slug: articleData.slug,
        content: articleData.content,
        excerpt: articleData.excerpt,
        category: category,
        authorId: aiAuthor.id,
        featuredImage: featuredImage,
        metaTitle: articleData.metaTitle,
        metaDescription: articleData.metaDescription,
        metaKeywords: articleData.metaKeywords,
        status: 'DRAFT',
      },
    });

    // Add tags
    if (articleData.tags && Array.isArray(articleData.tags)) {
      await Promise.all(
        articleData.tags.map((tag: string) =>
          prisma.articleTag.create({
            data: {
              articleId: article.id,
              tag: tag,
            },
          })
        )
      );
    }

    return NextResponse.json({
      success: true,
      data: { article },
      message: 'Article generated successfully',
      cost: 'FREE', // Gemini is free!
    });
  } catch (error) {
    console.error('Article generation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate article',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
