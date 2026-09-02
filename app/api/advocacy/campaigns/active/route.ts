import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/advocacy/campaigns/active
 * Get the active advocacy campaign with milestones and updates
 */
export async function GET() {
  try {
    // Fetch the active campaign with highest priority
    const campaign = await prisma.advocacyCampaign.findFirst({
      where: {
        status: 'ACTIVE',
      },
      include: {
        milestones: {
          orderBy: {
            order: 'asc',
          },
        },
        updates: {
          orderBy: {
            publishedAt: 'desc',
          },
          take: 5,
        },
      },
      orderBy: {
        priority: 'desc',
      },
    });

    if (!campaign) {
      return NextResponse.json(
        { success: false, error: 'No active campaign found' },
        { status: 404 }
      );
    }

    // Parse JSON fields
    const formattedCampaign = {
      ...campaign,
      targetCountries: JSON.parse(campaign.targetCountries),
    };

    return NextResponse.json({
      success: true,
      data: formattedCampaign,
    });
  } catch (error) {
    console.error('Campaign fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch campaign' },
      { status: 500 }
    );
  }
}
