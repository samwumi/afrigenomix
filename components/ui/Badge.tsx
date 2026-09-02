import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'gray';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Badge({ 
  children, 
  variant = 'gray', 
  size = 'md',
  className 
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center font-medium rounded-full';
  
  const variants = {
    success: 'bg-white text-green-700 border-2 border-green-300',
    warning: 'bg-white text-yellow-700 border-2 border-yellow-400',
    error: 'bg-white text-red-700 border-2 border-red-300',
    info: 'bg-white text-blue-700 border-2 border-blue-300',
    gray: 'bg-white text-gray-700 border-2 border-gray-300',
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };
  
  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
}
