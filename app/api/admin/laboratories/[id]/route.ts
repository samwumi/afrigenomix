import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';

/**
 * GET /api/admin/laboratories/:id
 * Get laboratory details (admin only)
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: labId } = await context.params;

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

    // Fetch laboratory with all details
    const laboratory = await prisma.laboratory.findUnique({
      where: { id: labId },
      include: {
        accreditations: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        labPartners: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                phone: true,
                isActive: true,
              },
            },
          },
        },
        cases: {
          take: 10,
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            id: true,
            caseNumber: true,
            status: true,
            createdAt: true,
            customer: {
              select: {
                fullName: true,
              },
            },
            testType: {
              select: {
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            cases: true,
            labPartners: true,
          },
        },
      },
    });

    if (!laboratory) {
      return NextResponse.json(
        { success: false, error: 'Laboratory not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: laboratory,
    });
  } catch (error) {
    console.error('Laboratory fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch laboratory' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/laboratories/:id
 * Update laboratory (admin only)
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: labId } = await context.params;

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

    // Check if laboratory exists
    const existingLab = await prisma.laboratory.findUnique({
      where: { id: labId },
    });

    if (!existingLab) {
      return NextResponse.json(
        { success: false, error: 'Laboratory not found' },
        { status: 404 }
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
      status,
      capabilities,
      description,
    } = body;

    // Build update data
    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (country !== undefined) updateData.country = country;
    if (city !== undefined) updateData.city = city;
    if (address !== undefined) updateData.address = address;
    if (phone !== undefined) updateData.phone = phone;
    if (email !== undefined) updateData.email = email;
    if (website !== undefined) updateData.website = website;
    if (status !== undefined) updateData.status = status;
    if (capabilities !== undefined) {
      updateData.capabilities = capabilities ? JSON.stringify(capabilities) : null;
    }
    if (description !== undefined) updateData.description = description;

    // Update laboratory
    const laboratory = await prisma.laboratory.update({
      where: { id: labId },
      data: updateData,
      include: {
        accreditations: true,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'LABORATORY_UPDATED',
        resourceType: 'Laboratory',
        resourceId: laboratory.id,
        previousValue: JSON.stringify(existingLab),
        newValue: JSON.stringify(updateData),
      },
    });

    return NextResponse.json({
      success: true,
      data: laboratory,
      message: 'Laboratory updated successfully',
    });
  } catch (error) {
    console.error('Laboratory update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update laboratory' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/laboratories/:id
 * Delete laboratory (super admin only)
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: labId } = await context.params;

    // Verify authentication and super admin role
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { user } = authResult;

    if (user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Access denied. Super admin privileges required.' },
        { status: 403 }
      );
    }

    // Check if laboratory exists
    const laboratory = await prisma.laboratory.findUnique({
      where: { id: labId },
      include: {
        _count: {
          select: {
            cases: true,
          },
        },
      },
    });

    if (!laboratory) {
      return NextResponse.json(
        { success: false, error: 'Laboratory not found' },
        { status: 404 }
      );
    }

    // Check if laboratory has active cases
    if (laboratory._count.cases > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete laboratory with existing cases. Set to inactive instead.' },
        { status: 400 }
      );
    }

    // Delete laboratory
    await prisma.laboratory.delete({
      where: { id: labId },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'LABORATORY_DELETED',
        resourceType: 'Laboratory',
        resourceId: labId,
        previousValue: JSON.stringify(laboratory),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Laboratory deleted successfully',
    });
  } catch (error) {
    console.error('Laboratory deletion error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete laboratory' },
      { status: 500 }
    );
  }
}
