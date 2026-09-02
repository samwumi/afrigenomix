// Utility functions for Afrigenomix

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CaseStatus } from './types';

/**
 * Merge Tailwind CSS classes efficiently
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format case number (AFG-YYYY-XXXXXX)
 */
export function generateCaseNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 900000) + 100000;
  return `AFG-${year}-${random}`;
}

/**
 * Format currency
 */
export function formatCurrency(amount: number, currency: string = 'NGN'): string {
  const formatter = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  
  return formatter.format(amount);
}

/**
 * Format date
 */
export function formatDate(date: Date | string, format: 'short' | 'long' | 'relative' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (format === 'relative') {
    return getRelativeTime(d);
  }
  
  if (format === 'long') {
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Get relative time (e.g., "2 days ago")
 */
export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  
  if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Get case status display text
 */
export function getCaseStatusText(status: CaseStatus): string {
  const statusMap: Record<CaseStatus, string> = {
    PENDING: 'Pending',
    DOCUMENTS_SUBMITTED: 'Documents Submitted',
    DOCUMENTS_VERIFIED: 'Documents Verified',
    AWAITING_COLLECTION: 'Awaiting Collection',
    COLLECTION_SCHEDULED: 'Collection Scheduled',
    COLLECTION_COMPLETED: 'Collection Completed',
    SAMPLE_IN_TRANSIT: 'Sample in Transit',
    SAMPLE_RECEIVED: 'Sample Received by Lab',
    TESTING_IN_PROGRESS: 'Testing in Progress',
    QUALITY_REVIEW: 'Quality Review',
    RESULT_READY: 'Result Ready',
    RESULT_RELEASED: 'Result Released',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
  };
  
  return statusMap[status] || status;
}

/**
 * Get case status color
 */
export function getCaseStatusColor(status: CaseStatus): string {
  const colorMap: Record<CaseStatus, string> = {
    PENDING: 'bg-gray-100 text-gray-700',
    DOCUMENTS_SUBMITTED: 'bg-blue-100 text-blue-700',
    DOCUMENTS_VERIFIED: 'bg-green-100 text-green-700',
    AWAITING_COLLECTION: 'bg-yellow-100 text-yellow-700',
    COLLECTION_SCHEDULED: 'bg-blue-100 text-blue-700',
    COLLECTION_COMPLETED: 'bg-green-100 text-green-700',
    SAMPLE_IN_TRANSIT: 'bg-teal-100 text-teal-700',
    SAMPLE_RECEIVED: 'bg-green-100 text-green-700',
    TESTING_IN_PROGRESS: 'bg-teal-100 text-teal-700',
    QUALITY_REVIEW: 'bg-yellow-100 text-yellow-700',
    RESULT_READY: 'bg-green-100 text-green-700',
    RESULT_RELEASED: 'bg-green-600 text-white',
    COMPLETED: 'bg-green-700 text-white',
    CANCELLED: 'bg-red-100 text-red-700',
  };
  
  return colorMap[status] || 'bg-gray-100 text-gray-700';
}

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (basic international format)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ''));
}

/**
 * Sanitize filename
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .substring(0, 255);
}

/**
 * Generate secure random string
 */
export function generateRandomString(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Truncate text
 */
export function truncate(text: string, length: number = 100): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

/**
 * Sleep/delay function
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Group array by key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

/**
 * Get country flag emoji
 */
export function getCountryFlag(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

/**
 * Nigerian states
 */
export const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi',
  'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
  'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT',
];

/**
 * Common countries for Africa-focused platform
 */
export const COUNTRIES = [
  { code: 'NG', name: 'Nigeria' },
  { code: 'GH', name: 'Ghana' },
  { code: 'KE', name: 'Kenya' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'RW', name: 'Rwanda' },
  { code: 'UG', name: 'Uganda' },
  { code: 'TZ', name: 'Tanzania' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
];
