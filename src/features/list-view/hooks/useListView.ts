import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGetLeadsQuery } from '@/features/leads/api/leadsApi';
import { useLeadFilters } from '@/features/leads/hooks/useLeadFilters';
import { PAGE_SIZE } from '@/features/leads/constants';
import { filterLeads } from '@/features/leads/utils/leadUtils';
import { paginateLeads } from '../utils/listUtils';
import type { Lead } from '@/features/leads/types';

export function useListView() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: leads = [], isLoading, isError, error, refetch } = useGetLeadsQuery();
  const { search, activeStatuses, setSearch, toggleStatus, clearStatuses } = useLeadFilters();

  const page    = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const setPage = (p: number) =>
    setSearchParams((prev) => { const n = new URLSearchParams(prev); n.set('page', String(p)); return n; }, { replace: true });

  const [formOpen, setFormOpen]       = useState(false);
  const [editLead, setEditLead]       = useState<Lead | null>(null);
  const [deleteLead, setDeleteLead]   = useState<Lead | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filtered = useMemo(
    () => filterLeads(leads, search, activeStatuses),
    [leads, search, activeStatuses],
  );

  const { pageLeads, totalPages, safePage } = useMemo(
    () => paginateLeads(filtered, page, PAGE_SIZE),
    [filtered, page],
  );

  const allPageSelected = pageLeads.length > 0 && pageLeads.every((l) => selectedIds.has(l.id));
  const someSelected    = selectedIds.size > 0;
  const selectedLeads   = useMemo(() => leads.filter((l) => selectedIds.has(l.id)), [leads, selectedIds]);

  function toggleSelectAll() {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allPageSelected) pageLeads.forEach((l) => next.delete(l.id));
      else                  pageLeads.forEach((l) => next.add(l.id));
      return next;
    });
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function openCreate() { setEditLead(null); setFormOpen(true); }

  function openEdit(lead: Lead, e: React.MouseEvent) {
    e.stopPropagation();
    setEditLead(lead);
    setFormOpen(true);
  }

  function openDelete(lead: Lead, e: React.MouseEvent) {
    e.stopPropagation();
    setDeleteLead(lead);
  }

  function handleDeleteClose(deleted?: boolean) {
    setDeleteLead(null);
    if (deleted && expandedRow === deleteLead?.id) setExpandedRow(null);
  }

  function toggleExpand(id: string) {
    setExpandedRow((prev) => (prev === id ? null : id));
  }

  function clearSelection() {
    setSelectedIds(new Set());
  }

  const apiError = error as { data?: { error?: string } } | undefined;

  return {
    navigate,
    leads, isLoading, isError, apiError, refetch,
    search, activeStatuses, setSearch, toggleStatus, clearStatuses,
    page, setPage,
    filtered, pageLeads, totalPages, safePage,
    formOpen, setFormOpen, editLead, deleteLead, expandedRow,
    selectedIds, allPageSelected, someSelected, selectedLeads,
    toggleSelectAll, toggleSelect,
    openCreate, openEdit, openDelete, handleDeleteClose, toggleExpand,
    clearSelection,
  };
}
