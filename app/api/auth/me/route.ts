import { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/middleware';
import { successResponse, unauthorizedResponse } from '@/lib/api-response';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    
    if (!user) {
      return unauthorizedResponse();
    }

    // Fetch complete user data with profile
    const completeUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        customerProfile: true,
        labPartner: {
          include: {
            laboratory: true,
          },
        },
        collectionPartner: true,
      },
    });

    if (!completeUser) {
      return unauthorizedResponse();
    }

    // Prepare response based on role
    let profile = null;
    if (completeUser.role === 'CUSTOMER' && completeUser.customerProfile) {
      profile = completeUser.customerProfile;
    } else if (completeUser.role === 'LAB_PARTNER' && completeUser.labPartner) {
      profile = {
        ...completeUser.labPartner,
        laboratoryName: completeUser.labPartner.laboratory.name,
      };
    } else if (completeUser.role === 'COLLECTION_PARTNER' && completeUser.collectionPartner) {
      profile = completeUser.collectionPartner;
    }

    return successResponse({
      id: completeUser.id,
      email: completeUser.email,
      role: completeUser.role,
      emailVerified: completeUser.emailVerified,
      phone: completeUser.phone,
      isActive: completeUser.isActive,
      profile,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return unauthorizedResponse();
  }
}
