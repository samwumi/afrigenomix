import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * GET /api/admin/articles/[id]
 * Get single article for editing
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    try {
      jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            name: true,
            email: true,
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

    return NextResponse.json({
      success: true,
      data: { article },
    });
  } catch (error) {
    console.error('Article fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/articles/[id]
 * Update an article
 */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
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

    const { id } = await context.params;
    const body = await request.json();

    const {
      title,
      slug,
      excerpt,
      content,
      category,
      metaTitle,
      metaDescription,
      featuredImage,
      status,
      isFeatured,
      publishedAt,
    } = body;

    console.log('Update article - featuredImage received:', featuredImage);

    // Check if article exists
    const existingArticle = await prisma.article.findUnique({
      where: { id },
    });

    if (!existingArticle) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      );
    }

    // If slug is changing, check if new slug is available
    if (slug && slug !== existingArticle.slug) {
      const slugExists = await prisma.article.findUnique({
        where: { slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { success: false, error: 'Slug already in use' },
          { status: 400 }
        );
      }
    }

    // Update article
    const updateData = {
      ...(title && { title }),
      ...(slug && { slug }),
      ...(excerpt !== undefined && { excerpt: excerpt || null }),
      ...(content && { content }),
      ...(category && { category }),
      ...(metaTitle !== undefined && { metaTitle: metaTitle || null }),
      ...(metaDescription !== undefined && { metaDescription: metaDescription || null }),
      ...(featuredImage !== undefined && { featuredImage: featuredImage || null }),
      ...(status && { status }),
      ...(isFeatured !== undefined && { isFeatured }),
      ...(publishedAt !== undefined && {
        publishedAt: publishedAt ? new Date(publishedAt) : null,
      }),
    };

    console.log('Update article - data being saved:', JSON.stringify(updateData, null, 2));

    const article = await prisma.article.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: { article },
    });
  } catch (error) {
    console.error('Article update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update article' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/articles/[id]
 * Delete an article
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
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

    const { id } = await context.params;

    // Check if article exists
    const existingArticle = await prisma.article.findUnique({
      where: { id },
    });

    if (!existingArticle) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      );
    }

    // Delete article
    await prisma.article.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Article deleted successfully',
    });
  } catch (error) {
    console.error('Article deletion error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete article' },
      { status: 500 }
    );
  }
}
