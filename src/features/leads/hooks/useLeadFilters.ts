import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import type { LeadStatus } from '../types';

interface UseLeadFiltersReturn {
  search: string;
  activeStatuses: Set<string>;
  setSearch: (q: string) => void;
  toggleStatus: (s: LeadStatus) => void;
  clearStatuses: () => void;
}

export function useLeadFilters(): UseLeadFiltersReturn {
  const [searchParams, setSearchParams] = useSearchParams();

  const search      = searchParams.get('q') ?? '';
  const statusParam = searchParams.get('status') ?? '';

  const activeStatuses = useMemo(
    () => (statusParam ? new Set(statusParam.split(',').filter(Boolean)) : new Set<string>()),
    [statusParam]
  );

  const setSearch = useCallback(
    (q: string) =>
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (q) next.set('q', q); else next.delete('q');
          next.delete('page');
          return next;
        },
        { replace: true }
      ),
    [setSearchParams]
  );

  const toggleStatus = useCallback(
    (s: LeadStatus) =>
      setSearchParams(
        (prev) => {
          const next    = new URLSearchParams(prev);
          const current = new Set((next.get('status') ?? '').split(',').filter(Boolean));
          current.has(s) ? current.delete(s) : current.add(s);
          if (current.size) next.set('status', [...current].join(','));
          else next.delete('status');
          next.delete('page');
          return next;
        },
        { replace: true }
      ),
    [setSearchParams]
  );

  const clearStatuses = useCallback(
    () =>
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete('status');
          next.delete('page');
          return next;
        },
        { replace: true }
      ),
    [setSearchParams]
  );

  return { search, activeStatuses, setSearch, toggleStatus, clearStatuses };
}
