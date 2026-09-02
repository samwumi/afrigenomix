import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';

/**
 * GET /api/admin/dashboard
 * Get admin dashboard metrics and data
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

    // Get date ranges
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Fetch metrics in parallel
    const [
      totalCases,
      activeCases,
      pendingDocuments,
      upcomingAppointments,
      resultsReady,
      totalCustomers,
      totalLaboratories,
      activeLaboratories,
      recentCases,
      casesByStatus,
      recentPayments,
      monthlyRevenue,
    ] = await Promise.all([
      // Total cases
      prisma.case.count(),

      // Active cases
      prisma.case.count({
        where: {
          status: {
            notIn: ['COMPLETED', 'CANCELLED'],
          },
        },
      }),

      // Pending documents
      prisma.case.count({
        where: {
          status: {
            in: ['PENDING', 'DOCUMENTS_SUBMITTED'],
          },
        },
      }),

      // Upcoming appointments
      prisma.appointment.count({
        where: {
          appointmentDate: {
            gte: today,
          },
          status: {
            in: ['CONFIRMED', 'REQUESTED'],
          },
        },
      }),

      // Results ready
      prisma.result.count({
        where: {
          status: 'RELEASED',
        },
      }),

      // Total customers
      prisma.customerProfile.count(),

      // Total laboratories
      prisma.laboratory.count(),

      // Active laboratories
      prisma.laboratory.count({
        where: {
          status: 'ACTIVE',
        },
      }),

      // Recent cases (last 10)
      prisma.case.findMany({
        take: 10,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          customer: {
            select: {
              fullName: true,
              country: true,
            },
          },
          testType: {
            select: {
              name: true,
              category: true,
            },
          },
          laboratory: {
            select: {
              name: true,
            },
          },
        },
      }),

      // Cases by status
      prisma.case.groupBy({
        by: ['status'],
        _count: {
          status: true,
        },
      }),

      // Recent payments
      prisma.payment.findMany({
        take: 10,
        where: {
          status: 'SUCCESSFUL',
        },
        orderBy: {
          transactionDate: 'desc',
        },
        include: {
          case: {
            select: {
              caseNumber: true,
              customer: {
                select: {
                  fullName: true,
                },
              },
            },
          },
        },
      }),

      // Monthly revenue (last 30 days)
      prisma.payment.aggregate({
        where: {
          status: 'SUCCESSFUL',
          transactionDate: {
            gte: thirtyDaysAgo,
          },
        },
        _sum: {
          amount: true,
        },
      }),
    ]);

    // Calculate growth metrics
    const casesThisWeek = await prisma.case.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
    });

    const casesLastWeek = await prisma.case.count({
      where: {
        createdAt: {
          gte: new Date(sevenDaysAgo.getTime() - 7 * 24 * 60 * 60 * 1000),
          lt: sevenDaysAgo,
        },
      },
    });

    const caseGrowth = casesLastWeek > 0 
      ? ((casesThisWeek - casesLastWeek) / casesLastWeek) * 100 
      : 0;

    // Calculate revenue breakdown
    const totalRevenue = Number(monthlyRevenue._sum.amount || 0);

    // Format case status distribution
    const statusDistribution = casesByStatus.reduce((acc, item) => {
      acc[item.status] = item._count.status;
      return acc;
    }, {} as Record<string, number>);

    // Get pending actions count
    const pendingActions = {
      documentsToVerify: await prisma.document.count({
        where: { status: 'PENDING' },
      }),
      appointmentsToConfirm: await prisma.appointment.count({
        where: { status: 'REQUESTED' },
      }),
      laboratoriesPending: await prisma.laboratory.count({
        where: { status: 'PENDING_VERIFICATION' },
      }),
    };

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalCases,
          activeCases,
          pendingDocuments,
          upcomingAppointments,
          resultsReady,
          totalCustomers,
          totalLaboratories,
          activeLaboratories,
          totalRevenue,
          caseGrowth: Math.round(caseGrowth),
        },
        recentCases,
        statusDistribution,
        recentPayments,
        pendingActions,
      },
    });
  } catch (error) {
    console.error('Admin dashboard fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
