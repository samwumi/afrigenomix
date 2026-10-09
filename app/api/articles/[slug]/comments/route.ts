import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/articles/[slug]/comments
 * Get approved comments for an article
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Find article
    const article = await prisma.article.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      );
    }

    // Get approved comments
    const comments = await prisma.comment.findMany({
      where: {
        articleId: article.id,
        status: 'APPROVED',
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        content: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: { comments },
    });
  } catch (error) {
    console.error('Comments fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/articles/[slug]/comments
 * Submit a new comment (pending approval)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const body = await request.json();
    const { name, email, content } = body;

    // Validate input
    if (!name || !email || !content) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and comment are required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Find article
    const article = await prisma.article.findUnique({
      where: { slug },
      select: { id: true, title: true },
    });

    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      );
    }

    // Create comment (pending approval)
    const comment = await prisma.comment.create({
      data: {
        articleId: article.id,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        content: content.trim(),
        status: 'PENDING',
      },
    });

    // Auto-moderate comment with AI in background (don't wait)
    if (process.env.OPENAI_API_KEY) {
      fetch('/api/ai/moderate-comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commentId: comment.id,
          name: name.trim(),
          email: email.trim(),
          content: content.trim(),
        }),
      }).catch(err => console.error('AI moderation failed:', err));
    }

    return NextResponse.json({
      success: true,
      data: { comment: { id: comment.id } },
      message: 'Comment submitted successfully and is pending approval',
    });
  } catch (error) {
    console.error('Comment submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit comment' },
      { status: 500 }
    );
  }
}
