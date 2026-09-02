import React from 'react';
import { CaseStatus } from '@/lib/types';
import { getCaseStatusColor, getCaseStatusText } from '@/lib/utils';

interface StatusBadgeProps {
  status: CaseStatus;
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${getCaseStatusColor(status)} ${sizes[size]}`}>
      {getCaseStatusText(status)}
    </span>
  );
}
