import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/admin/articles/debug
 * Debug endpoint to see all articles in database
 */
export async function GET(request: NextRequest) {
  try {
    // Get all articles without any filters
    const articles = await prisma.article.findMany({
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Get all content authors
    const authors = await prisma.contentAuthor.findMany();

    return NextResponse.json({
      success: true,
      data: {
        articlesCount: articles.length,
        articles,
        authorsCount: authors.length,
        authors,
      },
    });
  } catch (error) {
    console.error('Debug articles fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch articles', details: String(error) },
      { status: 500 }
    );
  }
}
