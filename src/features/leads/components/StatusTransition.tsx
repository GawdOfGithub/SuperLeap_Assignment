import React from 'react';
import { useTransitionStatusMutation } from '../api/leadsApi';
import { VALID_TRANSITIONS, TRANSITION_LABELS, TRANSITION_COLORS } from '../constants';
import { StatusBadge } from './StatusBadge';
import { Loader2, Lock } from 'lucide-react';
import type { Lead, LeadStatus } from '../types';

interface StatusTransitionProps {
  lead: Lead;
}

export function StatusTransition({ lead }: StatusTransitionProps) {
  const [transitionStatus, { isLoading, originalArgs }] = useTransitionStatusMutation();
  const nextStatuses = VALID_TRANSITIONS[lead.status] ?? [];
  const isTerminal   = nextStatuses.length === 0;

  function handleTransition(status: LeadStatus) {
    transitionStatus({ id: lead.id, status });
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-500">Current status:</span>
        <StatusBadge status={lead.status} />
      </div>

      {isTerminal ? (
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded px-3 py-2">
          <Lock className="h-4 w-4" />
          <span>Status is finalized — no further transitions available.</span>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {nextStatuses.map((status) => {
            const isPending = isLoading && originalArgs?.status === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => handleTransition(status)}
                disabled={isLoading}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium border transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${TRANSITION_COLORS[status]}`}
              >
                {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {TRANSITION_LABELS[status]}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
