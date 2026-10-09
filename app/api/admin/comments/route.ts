import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

/**
 * GET /api/admin/comments
 * Get all comments with optional filtering
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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const comments = await prisma.comment.findMany({
      where,
      include: {
        article: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: { comments },
    });
  } catch (error) {
    console.error('Get comments error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch comments',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
