import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';

/**
 * PATCH /api/admin/articles/[id]/featured
 * Toggle article featured status
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication and admin role
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { user } = authResult;
    if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const body = await request.json();
    const { isFeatured } = body;

    // If setting as featured, unfeatured other articles in same category
    if (isFeatured) {
      const article = await prisma.article.findUnique({
        where: { id },
        select: { category: true },
      });

      if (article) {
        await prisma.article.updateMany({
          where: {
            category: article.category,
            isFeatured: true,
            id: { not: id },
          },
          data: {
            isFeatured: false,
          },
        });
      }
    }

    // Update article
    const updatedArticle = await prisma.article.update({
      where: { id },
      data: {
        isFeatured,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedArticle,
    });
  } catch (error) {
    console.error('Article update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update article' },
      { status: 500 }
    );
  }
}
