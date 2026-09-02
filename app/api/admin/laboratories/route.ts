import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';

/**
 * GET /api/admin/laboratories
 * Get all laboratories (admin only)
 */
export async function GET(request: NextRequest) {
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
        { success: false, error: 'Access denied. Admin privileges required.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const country = searchParams.get('country');
    const search = searchParams.get('search');

    // Build query
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (country) {
      where.country = country;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { city: { contains: search } },
        { email: { contains: search } },
      ];
    }

    // Fetch laboratories with accreditations
    const laboratories = await prisma.laboratory.findMany({
      where,
      include: {
        accreditations: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            cases: true,
            labPartners: true,
          },
        },
      },
      orderBy: [
        { status: 'asc' },
        { name: 'asc' },
      ],
    });

    // Get statistics
    const stats = {
      total: await prisma.laboratory.count(),
      active: await prisma.laboratory.count({ where: { status: 'ACTIVE' } }),
      pending: await prisma.laboratory.count({ where: { status: 'PENDING_VERIFICATION' } }),
      inactive: await prisma.laboratory.count({ where: { status: 'INACTIVE' } }),
    };

    return NextResponse.json({
      success: true,
      data: {
        laboratories,
        stats,
      },
    });
  } catch (error) {
    console.error('Laboratories fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch laboratories' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/laboratories
 * Create a new laboratory (admin only)
 */
export async function POST(request: NextRequest) {
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
        { success: false, error: 'Access denied. Admin privileges required.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      name,
      country,
      city,
      address,
      phone,
      email,
      website,
      capabilities,
      description,
    } = body;

    // Validate required fields
    if (!name || !country) {
      return NextResponse.json(
        { success: false, error: 'Name and country are required' },
        { status: 400 }
      );
    }

    // Create laboratory
    const laboratory = await prisma.laboratory.create({
      data: {
        name,
        country,
        city: city || null,
        address: address || null,
        phone: phone || null,
        email: email || null,
        website: website || null,
        capabilities: capabilities ? JSON.stringify(capabilities) : null,
        description: description || null,
        status: 'PENDING_VERIFICATION',
      },
      include: {
        accreditations: true,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'LABORATORY_CREATED',
        resourceType: 'Laboratory',
        resourceId: laboratory.id,
        newValue: JSON.stringify({ name, country, city }),
      },
    });

    return NextResponse.json({
      success: true,
      data: laboratory,
      message: 'Laboratory created successfully',
    });
  } catch (error) {
    console.error('Laboratory creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create laboratory' },
      { status: 500 }
    );
  }
}
