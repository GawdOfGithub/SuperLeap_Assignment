import { useState } from 'react';
import { toast } from 'sonner';
import { useDeleteLeadMutation, useTransitionStatusMutation } from '@/features/leads/api/leadsApi';
import { STATUSES, VALID_TRANSITIONS } from '@/features/leads/constants';
import type { Lead, LeadStatus } from '@/features/leads/types';

export function useBulkActions(selectedLeads: Lead[], onClear: () => void) {
  const [deleteLead]       = useDeleteLeadMutation();
  const [transitionStatus] = useTransitionStatusMutation();
  const [busyAction, setBusyAction]         = useState<string | null>(null);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);

  const commonTransitions = STATUSES.filter((s) =>
    selectedLeads.every((lead) => VALID_TRANSITIONS[lead.status]?.includes(s)),
  );

  async function handleBulkDelete() {
    if (!window.confirm(`Delete ${selectedLeads.length} lead${selectedLeads.length > 1 ? 's' : ''}? This cannot be undone.`)) return;
    setBusyAction('delete');
    const results = await Promise.allSettled(
      selectedLeads.map((lead) => deleteLead(lead.id).unwrap()),
    );
    const ok   = results.filter((r) => r.status === 'fulfilled').length;
    const fail = results.length - ok;
    if (fail === 0) toast.success(`Deleted ${ok} lead${ok > 1 ? 's' : ''}.`);
    else            toast.warning(`${ok} deleted, ${fail} failed.`);
    setBusyAction(null);
    onClear();
  }

  async function handleBulkStatus(status: LeadStatus) {
    setStatusMenuOpen(false);
    setBusyAction(status);
    const results = await Promise.allSettled(
      selectedLeads.map((lead) => transitionStatus({ id: lead.id, status }).unwrap()),
    );
    const ok   = results.filter((r) => r.status === 'fulfilled').length;
    const fail = results.length - ok;
    if (fail === 0) toast.success(`Moved ${ok} lead${ok > 1 ? 's' : ''} to ${status}.`);
    else            toast.warning(`${ok} updated, ${fail} failed.`);
    setBusyAction(null);
    onClear();
  }

  return {
    busyAction,
    statusMenuOpen, setStatusMenuOpen,
    commonTransitions,
    isBusy: Boolean(busyAction),
    handleBulkDelete,
    handleBulkStatus,
  };
}
