import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { verifyPassword, generateToken } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import { logAuth } from '@/lib/audit';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return errorResponse('Invalid email or password', 401);
    }

    const { email, password } = validation.data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
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

    if (!user) {
      return errorResponse('Invalid email or password', 401);
    }

    // Check if user is active
    if (!user.isActive) {
      return errorResponse('Account has been deactivated', 403);
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return errorResponse('Invalid email or password', 401);
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Log successful login
    await logAuth('LOGIN', user.id, request);

    // Prepare user data based on role
    let profile = null;
    if (user.role === 'CUSTOMER' && user.customerProfile) {
      profile = user.customerProfile;
    } else if (user.role === 'LAB_PARTNER' && user.labPartner) {
      profile = {
        ...user.labPartner,
        laboratoryName: user.labPartner.laboratory.name,
      };
    } else if (user.role === 'COLLECTION_PARTNER' && user.collectionPartner) {
      profile = user.collectionPartner;
    }

    return successResponse({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        profile,
      },
    }, 'Login successful');
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse('Login failed', 500);
  }
}
