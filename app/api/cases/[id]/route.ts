import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';

/**
 * GET /api/cases/:id
 * Get detailed case information with timeline
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

    // Get customer profile
    const customerProfile = await prisma.customerProfile.findUnique({
      where: { userId: user.id },
    });

    if (!customerProfile && user.role === 'CUSTOMER') {
      return NextResponse.json(
        { success: false, error: 'Customer profile not found' },
        { status: 404 }
      );
    }

    // Fetch case with all related data
    const caseData = await prisma.case.findUnique({
      where: { id: caseId },
      include: {
        testType: {
          select: {
            id: true,
            name: true,
            slug: true,
            category: true,
            description: true,
            requirements: true,
            sampleType: true,
            isLegal: true,
            chainOfCustody: true,
            turnaroundDays: true,
            price: true,
            currency: true,
          },
        },
        laboratory: {
          select: {
            id: true,
            name: true,
            country: true,
            city: true,
            address: true,
            phone: true,
            email: true,
            website: true,
            status: true,
          },
        },
        customer: {
          select: {
            id: true,
            fullName: true,
            country: true,
            city: true,
            user: {
              select: {
                email: true,
                phone: true,
              },
            },
          },
        },
        participants: {
          select: {
            id: true,
            fullName: true,
            relationship: true,
            dateOfBirth: true,
            country: true,
            city: true,
            phone: true,
            email: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        documents: {
          select: {
            id: true,
            type: true,
            fileName: true,
            fileSize: true,
            status: true,
            participantId: true,
            uploadedAt: true,
            verifiedAt: true,
            verifiedBy: true,
          },
          orderBy: {
            uploadedAt: 'desc',
          },
        },
        appointments: {
          select: {
            id: true,
            appointmentDate: true,
            appointmentTime: true,
            status: true,
            notes: true,
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
            createdAt: true,
          },
          orderBy: {
            appointmentDate: 'desc',
          },
        },
        samples: {
          select: {
            id: true,
            sampleId: true,
            sampleType: true,
            status: true,
            collectedAt: true,
            receivedAt: true,
            participantId: true,
          },
          orderBy: {
            collectedAt: 'desc',
          },
        },
        quotes: {
          select: {
            id: true,
            amount: true,
            currency: true,
            status: true,
            validUntil: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
        payments: {
          select: {
            id: true,
            amount: true,
            currency: true,
            status: true,
            paymentReference: true,
            transactionDate: true,
          },
          orderBy: {
            transactionDate: 'desc',
          },
        },
        results: {
          select: {
            id: true,
            status: true,
            fileName: true,
            releasedAt: true,
          },
          where: {
            status: 'RELEASED',
          },
        },
        timeline: {
          select: {
            id: true,
            event: true,
            description: true,
            performedBy: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
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

    // Authorization check - customers can only view their own cases
    if (user.role === 'CUSTOMER' && caseData.customerId !== customerProfile?.id) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    // Build status timeline for visualization
    const statusSteps = [
      { key: 'PENDING', label: 'Case Created', icon: 'file' },
      { key: 'DOCUMENTS_SUBMITTED', label: 'Documents Submitted', icon: 'upload' },
      { key: 'DOCUMENTS_VERIFIED', label: 'Documents Verified', icon: 'check' },
      { key: 'COLLECTION_SCHEDULED', label: 'Collection Scheduled', icon: 'calendar' },
      { key: 'COLLECTION_COMPLETED', label: 'Sample Collected', icon: 'droplet' },
      { key: 'SAMPLE_RECEIVED', label: 'Sample at Laboratory', icon: 'building' },
      { key: 'TESTING_IN_PROGRESS', label: 'Testing in Progress', icon: 'beaker' },
      { key: 'QUALITY_REVIEW', label: 'Quality Review', icon: 'shield' },
      { key: 'RESULT_RELEASED', label: 'Result Available', icon: 'check-circle' },
    ];

    const currentStatusIndex = statusSteps.findIndex(s => s.key === caseData.status);
    const progressPercentage = currentStatusIndex >= 0 
      ? ((currentStatusIndex + 1) / statusSteps.length) * 100 
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        ...caseData,
        statusTimeline: {
          steps: statusSteps,
          currentStep: currentStatusIndex + 1,
          progress: progressPercentage,
        },
      },
    });
  } catch (error) {
    console.error('Case fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch case details' },
      { status: 500 }
    );
  }
}
