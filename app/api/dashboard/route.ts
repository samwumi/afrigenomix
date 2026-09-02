import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';

/**
 * GET /api/dashboard
 * Get customer dashboard data with active cases and summary
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

    const { user } = authResult;

    // Get customer profile
    const customerProfile = await prisma.customerProfile.findUnique({
      where: { userId: user.id },
      include: {
        user: {
          select: {
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!customerProfile) {
      return NextResponse.json(
        { success: false, error: 'Customer profile not found' },
        { status: 404 }
      );
    }

    // Get active cases with details
    const cases = await prisma.case.findMany({
      where: {
        customerId: customerProfile.id,
        status: {
          not: 'CANCELLED',
        },
      },
      include: {
        testType: {
          select: {
            id: true,
            name: true,
            category: true,
            slug: true,
            isLegal: true,
            chainOfCustody: true,
          },
        },
        laboratory: {
          select: {
            id: true,
            name: true,
            country: true,
            city: true,
          },
        },
        participants: {
          select: {
            id: true,
            fullName: true,
            relationship: true,
          },
        },
        documents: {
          select: {
            id: true,
            status: true,
          },
        },
        appointments: {
          where: {
            status: {
              in: ['CONFIRMED', 'REQUESTED'],
            },
          },
          orderBy: {
            appointmentDate: 'asc',
          },
          take: 1,
          select: {
            id: true,
            appointmentDate: true,
            appointmentTime: true,
            status: true,
          },
        },
        results: {
          where: {
            status: 'RELEASED',
          },
          select: {
            id: true,
            status: true,
            releasedAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate summary statistics
    const summary = {
      totalCases: cases.length,
      activeCases: cases.filter(c => 
        !['COMPLETED', 'RESULT_RELEASED'].includes(c.status)
      ).length,
      pendingDocuments: cases.filter(c => 
        c.status === 'PENDING' || c.status === 'DOCUMENTS_SUBMITTED'
      ).length,
      upcomingAppointments: cases.filter(c => 
        c.appointments.length > 0
      ).length,
      resultsAvailable: cases.filter(c => 
        c.results.length > 0
      ).length,
    };

    // Format cases for frontend
    const formattedCases = cases.map(caseItem => ({
      id: caseItem.id,
      caseNumber: caseItem.caseNumber,
      status: caseItem.status,
      testType: caseItem.testType,
      laboratory: caseItem.laboratory,
      purpose: caseItem.purpose,
      country: caseItem.country,
      participants: caseItem.participants,
      documentCount: caseItem.documents.length,
      nextAppointment: caseItem.appointments[0] || null,
      hasResult: caseItem.results.length > 0,
      createdAt: caseItem.createdAt,
      updatedAt: caseItem.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      data: {
        customer: {
          id: customerProfile.id,
          fullName: customerProfile.fullName,
          email: customerProfile.user.email,
          phone: customerProfile.user.phone,
          country: customerProfile.country,
          city: customerProfile.city,
        },
        summary,
        cases: formattedCases,
      },
    });
  } catch (error) {
    console.error('Dashboard fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
