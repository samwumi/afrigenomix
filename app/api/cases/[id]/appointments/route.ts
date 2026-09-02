import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';

/**
 * GET /api/cases/:id/appointments
 * Get all appointments for a case
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: caseId } = await context.params;

    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { user } = authResult;

    // Get case to verify ownership
    const caseData = await prisma.case.findUnique({
      where: { id: caseId },
      include: {
        customer: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!caseData) {
      return NextResponse.json(
        { success: false, error: 'Case not found' },
        { status: 404 }
      );
    }

    // Authorization check
    if (user.role === 'CUSTOMER' && caseData.customer.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    // Fetch appointments
    const appointments = await prisma.appointment.findMany({
      where: { caseId },
      include: {
        collectionLocation: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            country: true,
            phone: true,
            operatingHours: true,
          },
        },
        collectionPartner: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
      },
      orderBy: {
        appointmentDate: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.error('Appointments fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cases/:id/appointments
 * Create a new appointment
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: caseId } = await context.params;

    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { user } = authResult;

    // Get case to verify ownership
    const caseData = await prisma.case.findUnique({
      where: { id: caseId },
      include: {
        customer: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!caseData) {
      return NextResponse.json(
        { success: false, error: 'Case not found' },
        { status: 404 }
      );
    }

    // Authorization check
    if (user.role === 'CUSTOMER' && caseData.customer.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { collectionLocationId, appointmentDate, appointmentTime, notes } = body;

    // Validate required fields
    if (!collectionLocationId || !appointmentDate || !appointmentTime) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate location exists
    const location = await prisma.collectionLocation.findUnique({
      where: { id: collectionLocationId },
      include: {
        collectionPartner: true,
      },
    });

    if (!location || !location.isActive) {
      return NextResponse.json(
        { success: false, error: 'Invalid or inactive collection location' },
        { status: 400 }
      );
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        caseId,
        collectionLocationId,
        collectionPartnerId: location.collectionPartnerId,
        appointmentDate: new Date(appointmentDate),
        appointmentTime,
        status: 'REQUESTED',
        notes: notes || null,
      },
      include: {
        collectionLocation: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            country: true,
            phone: true,
          },
        },
        collectionPartner: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
      },
    });

    // Update case status if this is the first appointment
    if (caseData.status === 'DOCUMENTS_VERIFIED' || caseData.status === 'AWAITING_COLLECTION') {
      await prisma.case.update({
        where: { id: caseId },
        data: { status: 'COLLECTION_SCHEDULED' },
      });

      // Create timeline entry
      await prisma.caseTimeline.create({
        data: {
          caseId,
          event: 'Collection Scheduled',
          description: `Appointment scheduled at ${location.name} on ${new Date(appointmentDate).toLocaleDateString()}`,
        },
      });
    }

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'APPOINTMENT_CREATED',
        resourceType: 'Appointment',
        resourceId: appointment.id,
        newValue: JSON.stringify({ caseNumber: caseData.caseNumber, appointmentDate, appointmentTime }),
      },
    });

    return NextResponse.json({
      success: true,
      data: appointment,
      message: 'Appointment scheduled successfully',
    });
  } catch (error) {
    console.error('Appointment creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}
