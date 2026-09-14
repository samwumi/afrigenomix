import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * GET /api/admin/articles
 * Get all articles for admin (including drafts)
 */
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Build where clause
    const where: any = {};

    if (category && category !== 'ALL') {
      where.category = category;
    }

    if (status && status !== 'ALL') {
      where.status = status;
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
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate stats
    const stats = {
      total: await prisma.article.count(),
      published: await prisma.article.count({ where: { status: 'PUBLISHED' } }),
      drafts: await prisma.article.count({ where: { status: 'DRAFT' } }),
      totalViews: (await prisma.article.aggregate({
        _sum: { viewCount: true },
      }))._sum.viewCount || 0,
    };

    return NextResponse.json({
      success: true,
      data: {
        articles,
        stats,
      },
    });
  } catch (error) {
    console.error('Admin articles fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/articles
 * Create a new article
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

    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      category,
      metaTitle,
      metaDescription,
      status,
      isFeatured,
      publishedAt,
      authorId,
      authorName,
      authorTitle,
      authorBio,
      authorEmail,
    } = body;

    // Validate required fields
    if (!title || !slug || !content || !category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingArticle = await prisma.article.findUnique({
      where: { slug },
    });

    if (existingArticle) {
      return NextResponse.json(
        { success: false, error: 'Article with this slug already exists' },
        { status: 400 }
      );
    }

    // If no authorId provided, find or create a default ContentAuthor
    let finalAuthorId = authorId;
    if (!finalAuthorId) {
      // If author details provided, create or find author by email
      if (authorName && authorEmail) {
        let contentAuthor = await prisma.contentAuthor.findFirst({
          where: { email: authorEmail },
        });

        if (!contentAuthor) {
          contentAuthor = await prisma.contentAuthor.create({
            data: {
              name: authorName,
              title: authorTitle || 'Content Writer',
              bio: authorBio || `${authorName} is a contributor to Afrigenomix.`,
              email: authorEmail,
            },
          });
        }

        finalAuthorId = contentAuthor.id;
      } else {
        // No author info provided, use default
        let contentAuthor = await prisma.contentAuthor.findFirst({
          where: { email: 'admin@afrigenomix.com' },
        });

        // If no default content author exists, create one
        if (!contentAuthor) {
          contentAuthor = await prisma.contentAuthor.create({
            data: {
              name: 'Afrigenomix Editorial Team',
              title: 'Content Editor',
              bio: 'The Afrigenomix editorial team is dedicated to providing accurate, science-based information about DNA testing and genomics in Africa.',
              email: 'admin@afrigenomix.com',
            },
          });
        }

        finalAuthorId = contentAuthor.id;
      }
    }

    // Create article
    const article = await prisma.article.create({
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        category,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        status: status || 'DRAFT',
        isFeatured: isFeatured || false,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        authorId: finalAuthorId,
      },
    });

    return NextResponse.json({
      success: true,
      data: { article },
    });
  } catch (error) {
    console.error('Article creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create article' },
      { status: 500 }
    );
  }
}
