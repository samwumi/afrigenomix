import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');

    const where = {
      isActive: true,
      ...(category && { category: category as any }),
    };

    const tests = await prisma.testType.findMany({
      where,
      orderBy: [
        { category: 'asc' },
        { name: 'asc' },
      ],
    });

    return successResponse(tests);
  } catch (error) {
    console.error('Failed to fetch tests:', error);
    return errorResponse('Failed to fetch tests', 500);
  }
}
