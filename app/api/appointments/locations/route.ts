import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';

/**
 * GET /api/appointments/locations
 * Get available collection locations
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country');
    const city = searchParams.get('city');

    // Build query
    const where: any = {
      isActive: true,
    };

    if (country) {
      where.country = country;
    }

    if (city) {
      where.city = city;
    }

    // Fetch active collection locations
    const locations = await prisma.collectionLocation.findMany({
      where,
      include: {
        collectionPartner: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
      },
      orderBy: [
        { country: 'asc' },
        { city: 'asc' },
        { name: 'asc' },
      ],
    });

    // Group by country and city
    const grouped = locations.reduce((acc, location) => {
      const country = location.country;
      if (!acc[country]) {
        acc[country] = {};
      }
      const city = location.city;
      if (!acc[country][city]) {
        acc[country][city] = [];
      }
      acc[country][city].push(location);
      return acc;
    }, {} as Record<string, Record<string, typeof locations>>);

    return NextResponse.json({
      success: true,
      data: {
        locations,
        grouped,
      },
    });
  } catch (error) {
    console.error('Locations fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch locations' },
      { status: 500 }
    );
  }
}
