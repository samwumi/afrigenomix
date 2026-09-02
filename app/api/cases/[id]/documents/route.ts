import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';

/**
 * GET /api/cases/:id/documents
 * Get all documents for a case
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

    // Fetch documents with participant info
    const documents = await prisma.document.findMany({
      where: { caseId },
      include: {
        participant: {
          select: {
            id: true,
            fullName: true,
            relationship: true,
          },
        },
      },
      orderBy: {
        uploadedAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: documents,
    });
  } catch (error) {
    console.error('Documents fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cases/:id/documents
 * Upload a new document (metadata only - file upload handled separately)
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
    const { type, fileName, fileSize, filePath, participantId } = body;

    // Validate required fields
    if (!type || !fileName || !fileSize || !filePath) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate participant if provided
    if (participantId) {
      const participant = await prisma.participant.findFirst({
        where: {
          id: participantId,
          caseId: caseId,
        },
      });

      if (!participant) {
        return NextResponse.json(
          { success: false, error: 'Invalid participant' },
          { status: 400 }
        );
      }
    }

    // Create document record
    const document = await prisma.document.create({
      data: {
        caseId,
        participantId: participantId || null,
        type,
        fileName,
        fileSize,
        filePath,
        mimeType: 'application/octet-stream', // Default mime type, should be determined by actual file
        status: 'PENDING',
      },
      include: {
        participant: {
          select: {
            id: true,
            fullName: true,
            relationship: true,
          },
        },
      },
    });

    // Update case status if this is the first document
    const documentCount = await prisma.document.count({
      where: { caseId },
    });

    if (documentCount === 1 && caseData.status === 'PENDING') {
      await prisma.case.update({
        where: { id: caseId },
        data: { status: 'DOCUMENTS_SUBMITTED' },
      });

      // Create timeline entry
      await prisma.caseTimeline.create({
        data: {
          caseId,
          event: 'Documents Submitted',
          description: 'Customer uploaded required documents',
        },
      });
    }

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'DOCUMENT_UPLOADED',
        resourceType: 'Document',
        resourceId: document.id,
        newValue: JSON.stringify({ fileName, caseNumber: caseData.caseNumber, type }),
      },
    });

    return NextResponse.json({
      success: true,
      data: document,
      message: 'Document uploaded successfully',
    });
  } catch (error) {
    console.error('Document upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload document' },
      { status: 500 }
    );
  }
}
