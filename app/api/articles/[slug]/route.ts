import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/articles/[slug]
 * Get a single article by slug and increment view count (once per user session)
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    // Fetch article
    const article = await prisma.article.findUnique({
      where: {
        slug,
        status: 'PUBLISHED',
      },
      include: {
        author: {
          select: {
            name: true,
            title: true,
            bio: true,
            avatar: true,
          },
        },
      },
    });

    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      );
    }

    // Check if user has already viewed this article (cookie tracking)
    const viewCookieName = `viewed_${article.id}`;
    const hasViewed = request.cookies.get(viewCookieName);

    // Only increment view count if user hasn't viewed before
    if (!hasViewed) {
      await prisma.article.update({
        where: { id: article.id },
        data: {
          viewCount: {
            increment: 1,
          },
        },
      });
    }

    // Calculate read time
    const wordCount = article.content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);

    // Get related articles (same category, exclude current)
    const relatedArticles = await prisma.article.findMany({
      where: {
        status: 'PUBLISHED',
        category: article.category,
        id: {
          not: article.id,
        },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        category: true,
        featuredImage: true,
        publishedAt: true,
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: 3,
    });

    const response = NextResponse.json({
      success: true,
      data: {
        article: {
          ...article,
          readTime,
        },
        related: relatedArticles,
      },
    });

    // Set cookie to track this view (expires in 24 hours)
    if (!hasViewed) {
      response.cookies.set(viewCookieName, 'true', {
        maxAge: 60 * 60 * 24, // 24 hours in seconds
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
      });
    }

    return response;
  } catch (error) {
    console.error('Article fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}
