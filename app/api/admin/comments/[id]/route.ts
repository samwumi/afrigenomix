import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

/**
 * PATCH /api/admin/comments/[id]
 * Update comment status (approve/reject/spam)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAuth(request);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!['PENDING', 'APPROVED', 'REJECTED', 'SPAM'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      data: { comment },
      message: `Comment ${status.toLowerCase()}`,
    });
  } catch (error) {
    console.error('Update comment error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update comment',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/comments/[id]
 * Delete a comment
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAuth(request);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    await prisma.comment.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Comment deleted',
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete comment',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
