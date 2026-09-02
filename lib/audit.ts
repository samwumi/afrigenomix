// Audit logging utilities

import prisma from './prisma';
import { NextRequest } from 'next/server';

export interface AuditLogData {
  userId?: string;
  action: string;
  resourceType?: string;
  resourceId?: string;
  previousValue?: string;
  newValue?: string;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Create audit log entry
 */
export async function createAuditLog(data: AuditLogData) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        resourceType: data.resourceType,
        resourceId: data.resourceId,
        previousValue: data.previousValue,
        newValue: data.newValue,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
    // Don't throw - audit log failures shouldn't break the application
  }
}

/**
 * Log authentication event
 */
export async function logAuth(
  action: 'LOGIN' | 'LOGOUT' | 'REGISTER' | 'PASSWORD_RESET' | 'EMAIL_VERIFIED',
  userId: string,
  request?: NextRequest
) {
  const ipAddress = request?.headers.get('x-forwarded-for') || 
                    request?.headers.get('x-real-ip') || 
                    'unknown';
  const userAgent = request?.headers.get('user-agent') || 'unknown';
  
  await createAuditLog({
    userId,
    action,
    ipAddress,
    userAgent,
  });
}

/**
 * Log document event
 */
export async function logDocument(
  action: 'DOCUMENT_UPLOADED' | 'DOCUMENT_VIEWED' | 'DOCUMENT_VERIFIED' | 'DOCUMENT_REJECTED',
  userId: string,
  documentId: string,
  details?: string
) {
  await createAuditLog({
    userId,
    action,
    resourceType: 'Document',
    resourceId: documentId,
    newValue: details,
  });
}

/**
 * Log case event
 */
export async function logCase(
  action: 'CASE_CREATED' | 'CASE_UPDATED' | 'CASE_STATUS_CHANGED' | 'CASE_ASSIGNED',
  userId: string,
  caseId: string,
  previousValue?: string,
  newValue?: string
) {
  await createAuditLog({
    userId,
    action,
    resourceType: 'Case',
    resourceId: caseId,
    previousValue,
    newValue,
  });
}

/**
 * Log result event
 */
export async function logResult(
  action: 'RESULT_UPLOADED' | 'RESULT_VIEWED' | 'RESULT_RELEASED',
  userId: string,
  resultId: string
) {
  await createAuditLog({
    userId,
    action,
    resourceType: 'Result',
    resourceId: resultId,
  });
}

/**
 * Log payment event
 */
export async function logPayment(
  action: 'PAYMENT_CREATED' | 'PAYMENT_SUCCESSFUL' | 'PAYMENT_FAILED' | 'PAYMENT_REFUNDED',
  userId: string,
  paymentId: string,
  amount?: number
) {
  await createAuditLog({
    userId,
    action,
    resourceType: 'Payment',
    resourceId: paymentId,
    newValue: amount ? `Amount: ${amount}` : undefined,
  });
}

/**
 * Log user role change
 */
export async function logRoleChange(
  adminUserId: string,
  targetUserId: string,
  previousRole: string,
  newRole: string
) {
  await createAuditLog({
    userId: adminUserId,
    action: 'USER_ROLE_CHANGED',
    resourceType: 'User',
    resourceId: targetUserId,
    previousValue: previousRole,
    newValue: newRole,
  });
}

/**
 * Log laboratory assignment
 */
export async function logLaboratoryAssignment(
  userId: string,
  caseId: string,
  laboratoryId: string
) {
  await createAuditLog({
    userId,
    action: 'LABORATORY_ASSIGNED',
    resourceType: 'Case',
    resourceId: caseId,
    newValue: `Laboratory: ${laboratoryId}`,
  });
}
