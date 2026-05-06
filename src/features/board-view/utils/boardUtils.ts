import { VALID_TRANSITIONS } from '@/features/leads/constants';
import type { Lead, LeadStatus } from '@/features/leads/types';

export type DropState = 'idle' | 'source' | 'valid' | 'valid-hover' | 'invalid' | 'invalid-hover';

export function getDropState(
  colStatus: LeadStatus,
  draggedLead: Lead | null,
  overColId: string | null,
): DropState {
  if (!draggedLead) return 'idle';
  if (colStatus === draggedLead.status) return 'source';
  const canDrop = VALID_TRANSITIONS[draggedLead.status]?.includes(colStatus);
  if (colStatus === overColId) return canDrop ? 'valid-hover' : 'invalid-hover';
  return canDrop ? 'valid' : 'invalid';
}

export function groupByStatus(
  leads: Lead[],
  statuses: LeadStatus[],
): Record<LeadStatus, Lead[]> {
  const groups = Object.fromEntries(statuses.map((s) => [s, [] as Lead[]])) as Record<LeadStatus, Lead[]>;
  leads.forEach((l) => { if (groups[l.status]) groups[l.status].push(l); });
  return groups;
}
