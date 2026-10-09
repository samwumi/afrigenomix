import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

/**
 * POST /api/ai/generate-article
 * Generate an article using Google Gemini AI
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

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'Gemini API key not configured' },
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

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Create comprehensive prompt
    const prompt = `You are a professional content writer for Afrigenomix, a DNA testing coordination platform in Africa.

Generate a comprehensive, SEO-optimized blog article about: ${topic}

Requirements:
- Length: 1,200-1,500 words
- Tone: ${tone}
- Category: ${category}
- Target Audience: African readers interested in DNA testing
- Format: Well-structured markdown with headings (##, ###), bullet points, and clear sections
- Include: Introduction, 3-5 main sections with detailed content, practical examples, conclusion
- Focus on: African context, accessibility, trust, scientific accuracy
- SEO: Naturally incorporate keywords related to the topic

Article Structure:
1. Compelling introduction (2-3 paragraphs)
2. Main content sections with subheadings
3. Practical examples or case studies
4. Actionable advice or key takeaways
5. Strong conclusion with call-to-action

Also generate SEO metadata:
- Meta title (50-60 characters, include main keyword)
- Meta description (150-160 characters, compelling summary)
- Meta keywords (5-8 relevant keywords, comma-separated)
- Suggested tags (3-5 tags for categorization)
- Brief excerpt (2-3 sentences for article preview)

Respond ONLY with valid JSON in this exact format:
{
  "title": "Article title here",
  "content": "Full markdown content here...",
  "excerpt": "Brief 2-3 sentence summary",
  "metaTitle": "SEO title 50-60 chars",
  "metaDescription": "SEO description 150-160 chars",
  "metaKeywords": "keyword1, keyword2, keyword3",
  "tags": ["tag1", "tag2", "tag3"]
}`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse JSON response
    let articleData;
    try {
      // Extract JSON from response (Gemini sometimes wraps it in markdown)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      articleData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', text);
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
          title: 'AI Content Generator',
          bio: 'Automated content generation powered by AI',
          isActive: true,
        },
      });
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
