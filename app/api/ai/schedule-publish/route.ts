import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

/**
 * POST /api/ai/schedule-publish
 * Schedule an article to be published at a specific time
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { articleId, publishAt } = body;

    if (!articleId || !publishAt) {
      return NextResponse.json(
        { success: false, error: 'Article ID and publish time required' },
        { status: 400 }
      );
    }

    const publishDate = new Date(publishAt);
    if (isNaN(publishDate.getTime())) {
      return NextResponse.json(
        { success: false, error: 'Invalid date format' },
        { status: 400 }
      );
    }

    // Update article with scheduled publish time
    const article = await prisma.article.update({
      where: { id: articleId },
      data: {
        scheduledPublishAt: publishDate,
        status: 'DRAFT', // Keep as draft until scheduled time
      },
    });

    return NextResponse.json({
      success: true,
      data: { article },
      message: `Article scheduled to publish at ${publishDate.toLocaleString()}`,
    });
  } catch (error) {
    console.error('Schedule publish error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to schedule article',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ai/schedule-publish
 * Get all scheduled articles and publish those whose time has come
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const now = new Date();

    // Find articles scheduled to publish now or in the past
    const articlesToPublish = await prisma.article.findMany({
      where: {
        scheduledPublishAt: {
          lte: now,
        },
        status: 'DRAFT',
      },
    });

    // Publish them
    const published = [];
    for (const article of articlesToPublish) {
      const updated = await prisma.article.update({
        where: { id: article.id },
        data: {
          status: 'PUBLISHED',
          publishedAt: now,
          scheduledPublishAt: null,
        },
      });
      published.push(updated);
    }

    // Get all remaining scheduled articles
    const scheduled = await prisma.article.findMany({
      where: {
        scheduledPublishAt: {
          gt: now,
        },
      },
      orderBy: {
        scheduledPublishAt: 'asc',
      },
      select: {
        id: true,
        title: true,
        slug: true,
        scheduledPublishAt: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        published: published.length,
        scheduled: scheduled,
      },
      message: `Published ${published.length} article(s)`,
    });
  } catch (error) {
    console.error('Auto-publish error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Auto-publish failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
