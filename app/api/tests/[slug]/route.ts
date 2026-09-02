import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, notFoundResponse, errorResponse } from '@/lib/api-response';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    
    const test = await prisma.testType.findUnique({
      where: {
        slug: slug,
        isActive: true,
      },
    });

    if (!test) {
      return notFoundResponse('Test');
    }

    return successResponse(test);
  } catch (error) {
    console.error('Failed to fetch test:', error);
    return errorResponse('Failed to fetch test', 500);
  }
}
