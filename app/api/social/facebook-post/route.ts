import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const FACEBOOK_PAGE_ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
const FACEBOOK_PAGE_ID = process.env.FACEBOOK_PAGE_ID;

/**
 * POST /api/social/facebook-post
 * Post an article to Facebook Page
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { articleId } = body;

    if (!articleId) {
      return NextResponse.json(
        { success: false, error: 'Article ID required' },
        { status: 400 }
      );
    }

    if (!FACEBOOK_PAGE_ACCESS_TOKEN || !FACEBOOK_PAGE_ID) {
      return NextResponse.json(
        {
          success: false,
          error: 'Facebook integration not configured',
          message: 'Add FACEBOOK_PAGE_ACCESS_TOKEN and FACEBOOK_PAGE_ID to .env',
        },
        { status: 500 }
      );
    }

    // Get article from database
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      include: {
        author: {
          select: { name: true },
        },
      },
    });

    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      );
    }

    // Build post content
    const websiteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://afrigenomix.com';
    const articleUrl = `${websiteUrl}/blog/${article.slug}`;
    
    // Create engaging Facebook post message
    const message = `${article.title}

${article.excerpt || ''}

Read more: ${articleUrl}

#DNATesting #Afrigenomix #GeneticTesting #Africa`;

    // Post to Facebook
    const fbApiUrl = `https://graph.facebook.com/v18.0/${FACEBOOK_PAGE_ID}/feed`;
    
    const postData: any = {
      message: message,
      link: articleUrl,
      access_token: FACEBOOK_PAGE_ACCESS_TOKEN,
    };

    // If article has featured image, include it
    if (article.featuredImage) {
      // For images, we use /photos endpoint instead of /feed
      const photoUrl = `https://graph.facebook.com/v18.0/${FACEBOOK_PAGE_ID}/photos`;
      
      const photoData = {
        url: article.featuredImage.startsWith('http') 
          ? article.featuredImage 
          : `${websiteUrl}${article.featuredImage}`,
        caption: message,
        access_token: FACEBOOK_PAGE_ACCESS_TOKEN,
      };

      const response = await fetch(photoUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(photoData),
      });

      const result = await response.json();

      if (result.error) {
        console.error('Facebook API Error:', result.error);
        return NextResponse.json(
          {
            success: false,
            error: 'Failed to post to Facebook',
            details: result.error.message,
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          postId: result.id,
          postUrl: `https://facebook.com/${result.id}`,
        },
        message: 'Successfully posted to Facebook with image',
      });
    } else {
      // Post without image
      const response = await fetch(fbApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      const result = await response.json();

      if (result.error) {
        console.error('Facebook API Error:', result.error);
        return NextResponse.json(
          {
            success: false,
            error: 'Failed to post to Facebook',
            details: result.error.message,
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          postId: result.id,
          postUrl: `https://facebook.com/${result.id}`,
        },
        message: 'Successfully posted to Facebook',
      });
    }
  } catch (error) {
    console.error('Facebook post error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to post to Facebook',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/social/facebook-post
 * Test Facebook connection
 */
export async function GET(request: NextRequest) {
  try {
    if (!FACEBOOK_PAGE_ACCESS_TOKEN || !FACEBOOK_PAGE_ID) {
      return NextResponse.json({
        success: false,
        configured: false,
        message: 'Facebook integration not configured',
      });
    }

    // Test the connection by fetching page info
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${FACEBOOK_PAGE_ID}?fields=name,username,followers_count,access_token=${FACEBOOK_PAGE_ACCESS_TOKEN}`
    );

    const result = await response.json();

    if (result.error) {
      return NextResponse.json({
        success: false,
        configured: true,
        error: result.error.message,
      });
    }

    return NextResponse.json({
      success: true,
      configured: true,
      page: {
        name: result.name,
        username: result.username,
        followers: result.followers_count,
      },
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
