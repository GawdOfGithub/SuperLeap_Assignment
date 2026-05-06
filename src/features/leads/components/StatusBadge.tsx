import React from 'react';
import { cn } from '@/lib/utils';
import { STATUS_BADGE_CONFIG } from '../constants';
import type { LeadStatus } from '../types';

interface StatusBadgeProps {
  status: LeadStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const cfg = STATUS_BADGE_CONFIG[status] ?? { label: status, className: 'bg-gray-100 text-gray-600 border-gray-200' };
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border', cfg.className)}>
      {cfg.label}
    </span>
  );
}
