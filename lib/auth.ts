// Authentication utilities

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from './types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

/**
 * Hash password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate JWT token
 */
export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Extract token from Authorization header
 */
export function extractToken(authHeader?: string): string | null {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1];
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  
  return { valid: true };
}

/**
 * Check if user has required role
 */
export function hasRole(user: User | null, allowedRoles: string[]): boolean {
  if (!user) return false;
  return allowedRoles.includes(user.role);
}

/**
 * Check if user is admin
 */
export function isAdmin(user: User | null): boolean {
  return hasRole(user, ['ADMIN', 'SUPER_ADMIN']);
}

/**
 * Check if user is customer
 */
export function isCustomer(user: User | null): boolean {
  return hasRole(user, ['CUSTOMER']);
}

/**
 * Verify authentication from request
 * Extracts and verifies JWT token from Authorization header
 * Returns user data from database if authenticated
 */
export async function verifyAuth(request: Request): Promise<{ authenticated: boolean; user: any | null }> {
  const authHeader = request.headers.get('authorization');
  const token = extractToken(authHeader || '');
  
  if (!token) {
    return { authenticated: false, user: null };
  }
  
  const payload = verifyToken(token);
  if (!payload) {
    return { authenticated: false, user: null };
  }
  
  // Return user data from token payload
  return {
    authenticated: true,
    user: {
      id: payload.userId,
      email: payload.email,
      role: payload.role,
    },
  };
}
