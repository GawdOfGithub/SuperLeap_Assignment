import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { type DragStart, type DragUpdate, type DropResult } from '@hello-pangea/dnd';
import { useGetLeadsQuery, useTransitionStatusMutation } from '@/features/leads/api/leadsApi';
import { useLeadFilters } from '@/features/leads/hooks/useLeadFilters';
import { STATUSES, VALID_TRANSITIONS } from '@/features/leads/constants';
import { filterLeads } from '@/features/leads/utils/leadUtils';
import { getDropState, groupByStatus } from '../utils/boardUtils';
import type { Lead, LeadStatus } from '@/features/leads/types';

export function useBoardView() {
  const navigate = useNavigate();
  const { data: leads = [], isLoading, isError, error, refetch } = useGetLeadsQuery();
  const [transitionStatus] = useTransitionStatusMutation();
  const { search, activeStatuses, setSearch, toggleStatus, clearStatuses } = useLeadFilters();

  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [overColId, setOverColId]         = useState<string | null>(null);

  const draggedLead = useMemo(
    () => leads.find((l) => l.id === draggedLeadId) ?? null,
    [leads, draggedLeadId],
  );

  const filtered = useMemo(
    () => filterLeads(leads, search, activeStatuses),
    [leads, search, activeStatuses],
  );

  const byStatus = useMemo(
    () => groupByStatus(filtered, STATUSES),
    [filtered],
  );

  function onDragStart(start: DragStart) {
    setDraggedLeadId(start.draggableId);
  }

  function onDragUpdate(update: DragUpdate) {
    setOverColId(update.destination?.droppableId ?? null);
  }

  async function onDragEnd(result: DropResult) {
    setDraggedLeadId(null);
    setOverColId(null);

    const { source, destination, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    const toStatus = destination.droppableId as LeadStatus;
    const lead     = leads.find((l) => l.id === draggableId);
    if (!lead) return;

    if (!VALID_TRANSITIONS[lead.status]?.includes(toStatus)) {
      toast.error(`Cannot move "${lead.name}" from ${lead.status} to ${toStatus} — invalid transition.`);
      return;
    }

    try {
      await transitionStatus({ id: lead.id, status: toStatus }).unwrap();
    } catch (err: unknown) {
      const apiErr = err as { data?: { error?: string } };
      toast.error(apiErr?.data?.error ?? `Failed to update "${lead.name}" — change reverted.`);
    }
  }

  const apiError = error as { data?: { error?: string } } | undefined;

  return {
    navigate,
    leads, isLoading, isError, apiError, refetch,
    search, activeStatuses, setSearch, toggleStatus, clearStatuses,
    filtered,
    draggedLead, overColId, byStatus,
    getDropState,
    onDragStart, onDragUpdate, onDragEnd,
  };
}
