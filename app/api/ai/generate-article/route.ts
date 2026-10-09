import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/**
 * POST /api/ai/generate-article
 * Generate an article using AI based on topic/keywords
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
    const { topic, category, keywords, tone } = body;

    if (!topic) {
      return NextResponse.json(
        { success: false, error: 'Topic is required' },
        { status: 400 }
      );
    }

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
    });

    // Generate article content
    const prompt = `You are an expert content writer for Afrigenomix, a DNA testing coordination platform in Africa.

Write a comprehensive, SEO-optimized blog article about: "${topic}"

Category: ${category || 'DNA Education'}
Keywords to include: ${keywords || 'DNA testing, Africa, paternity testing'}
Tone: ${tone || 'Professional, informative, accessible'}

Requirements:
- Write 1,200-1,500 words
- Use markdown formatting
- Include an engaging introduction (2-3 paragraphs)
- Use clear section headings (##)
- Provide accurate, science-based information
- Include practical examples relevant to African context
- End with a clear call-to-action
- Be accessible to non-scientists
- Avoid medical advice claims
- Remember: Afrigenomix is a PLATFORM, not a laboratory

Focus areas for DNA testing content:
- Accuracy and reliability
- Legal and immigration applications
- Process and procedures
- Privacy and data security
- Choosing the right test
- Understanding results
- Cost and accessibility in Africa

Write the complete article now:`;

    console.log('Generating article with OpenAI...');

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert content writer specializing in DNA testing and genomics in Africa. Write clear, accurate, SEO-optimized articles.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 3000,
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Failed to generate content' },
        { status: 500 }
      );
    }

    // Generate SEO metadata
    const metaPrompt = `Based on this article topic: "${topic}"

Generate:
1. SEO-optimized title (max 60 characters)
2. Meta description (max 155 characters)
3. Slug (URL-friendly)
4. 5 keywords
5. Brief excerpt (2 sentences, max 160 characters)

Format as JSON:
{
  "title": "...",
  "metaDescription": "...",
  "slug": "...",
  "keywords": ["...", "...", "...", "...", "..."],
  "excerpt": "..."
}`;

    const metaCompletion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: metaPrompt,
        },
      ],
      temperature: 0.5,
      max_tokens: 300,
      response_format: { type: 'json_object' },
    });

    const metaContent = metaCompletion.choices[0]?.message?.content;
    let metadata;
    try {
      metadata = JSON.parse(metaContent || '{}');
    } catch (e) {
      metadata = {
        title: topic,
        metaDescription: `Learn about ${topic} and DNA testing in Africa.`,
        slug: topic.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        keywords: [topic],
        excerpt: `Comprehensive guide to ${topic}.`,
      };
    }

    // Get or create default author
    let author = await prisma.contentAuthor.findFirst({
      where: { email: 'ai@afrigenomix.com' },
    });

    if (!author) {
      author = await prisma.contentAuthor.create({
        data: {
          name: 'Afrigenomix Editorial Team',
          title: 'Content Team',
          bio: 'The Afrigenomix editorial team is dedicated to providing accurate, science-based information about DNA testing and genomics in Africa.',
          email: 'ai@afrigenomix.com',
        },
      });
    }

    // Create article as DRAFT
    const article = await prisma.article.create({
      data: {
        title: metadata.title || topic,
        slug: metadata.slug || topic.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        content: content,
        excerpt: metadata.excerpt || content.substring(0, 160),
        category: category || 'DNA_EDUCATION',
        metaTitle: metadata.title,
        metaDescription: metadata.metaDescription,
        metaKeywords: metadata.keywords?.join(', ') || topic,
        status: 'DRAFT',
        authorId: author.id,
      },
    });

    console.log('Article generated and saved as draft:', article.id);

    return NextResponse.json({
      success: true,
      data: {
        article: {
          id: article.id,
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          content: article.content,
          category: article.category,
          status: article.status,
        },
        metadata,
        usage: {
          promptTokens: completion.usage?.prompt_tokens || 0,
          completionTokens: completion.usage?.completion_tokens || 0,
          totalTokens: completion.usage?.total_tokens || 0,
          estimatedCost: ((completion.usage?.total_tokens || 0) * 0.00001).toFixed(4),
        },
      },
      message: 'Article generated successfully and saved as draft',
    });
  } catch (error) {
    console.error('AI article generation error:', error);
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
