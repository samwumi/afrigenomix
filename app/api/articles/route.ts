import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/articles
 * Get published articles with optional filtering and search
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Build where clause
    const where: any = {
      status: 'PUBLISHED',
    };

    if (category && category !== 'ALL') {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Fetch articles
    const articles = await prisma.article.findMany({
      where,
      include: {
        author: {
          select: {
            name: true,
            title: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: limit,
    });

    // Get featured article (if no filters)
    let featured = null;
    if (!category && !search) {
      featured = await prisma.article.findFirst({
        where: {
          status: 'PUBLISHED',
          isFeatured: true,
        },
        include: {
          author: {
            select: {
              name: true,
              title: true,
              avatar: true,
            },
          },
        },
        orderBy: {
          publishedAt: 'desc',
        },
      });
    }

    // Calculate read time (average 200 words per minute)
    const articlesWithReadTime = articles.map(article => {
      const wordCount = article.content.split(/\s+/).length;
      const readTime = Math.ceil(wordCount / 200);
      return {
        ...article,
        readTime,
      };
    });

    const featuredWithReadTime = featured ? {
      ...featured,
      readTime: Math.ceil(featured.content.split(/\s+/).length / 200),
    } : null;

    return NextResponse.json({
      success: true,
      data: {
        articles: articlesWithReadTime,
        featured: featuredWithReadTime,
        total: articles.length,
      },
    });
  } catch (error) {
    console.error('Articles fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}
