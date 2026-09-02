// API Middleware utilities

import { NextRequest } from 'next/server';
import { verifyToken, extractToken, TokenPayload } from './auth';
import { unauthorizedResponse, forbiddenResponse } from './api-response';
import prisma from './prisma';
import { User, Role } from './types';

/**
 * Get authenticated user from request
 */
export async function getAuthUser(request: NextRequest): Promise<User | null> {
  const authHeader = request.headers.get('authorization');
  const token = extractToken(authHeader || undefined);
  
  if (!token) {
    return null;
  }
  
  const payload = verifyToken(token);
  if (!payload) {
    return null;
  }
  
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  });
  
  if (!user || !user.isActive) {
    return null;
  }
  
  return user as User;
}

/**
 * Require authentication
 */
export async function requireAuth(request: NextRequest): Promise<User | Response> {
  const user = await getAuthUser(request);
  
  if (!user) {
    return unauthorizedResponse('Authentication required');
  }
  
  return user;
}

/**
 * Require specific roles
 */
export async function requireRoles(
  request: NextRequest,
  allowedRoles: Role[]
): Promise<User | Response> {
  const userOrResponse = await requireAuth(request);
  
  if (userOrResponse instanceof Response) {
    return userOrResponse;
  }
  
  if (!allowedRoles.includes(userOrResponse.role as Role)) {
    return forbiddenResponse('Insufficient permissions');
  }
  
  return userOrResponse;
}

/**
 * Require admin role
 */
export async function requireAdmin(request: NextRequest): Promise<User | Response> {
  return requireRoles(request, ['ADMIN', 'SUPER_ADMIN']);
}

/**
 * Require customer role
 */
export async function requireCustomer(request: NextRequest): Promise<User | Response> {
  return requireRoles(request, ['CUSTOMER']);
}

/**
 * Check if user owns resource
 */
export async function requireOwnership(
  request: NextRequest,
  resourceUserId: string
): Promise<User | Response> {
  const userOrResponse = await requireAuth(request);
  
  if (userOrResponse instanceof Response) {
    return userOrResponse;
  }
  
  // Admins can access any resource
  if (['ADMIN', 'SUPER_ADMIN'].includes(userOrResponse.role)) {
    return userOrResponse;
  }
  
  // Check ownership
  if (userOrResponse.id !== resourceUserId) {
    return forbiddenResponse('Access denied');
  }
  
  return userOrResponse;
}

/**
 * Parse pagination params from request
 */
export function getPaginationParams(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');
  
  // Limit page size to prevent abuse
  const sanitizedPageSize = Math.min(Math.max(pageSize, 1), 100);
  const sanitizedPage = Math.max(page, 1);
  
  return {
    page: sanitizedPage,
    pageSize: sanitizedPageSize,
    skip: (sanitizedPage - 1) * sanitizedPageSize,
    take: sanitizedPageSize,
  };
}

/**
 * Validate request body
 */
export async function parseRequestBody<T>(request: NextRequest): Promise<T | null> {
  try {
    return await request.json();
  } catch (error) {
    return null;
  }
}
