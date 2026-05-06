import type { Lead } from '../types';

export function filterLeads(
  leads: Lead[],
  search: string,
  activeStatuses: Set<string>,
): Lead[] {
  const q = search.toLowerCase();
  return leads.filter((l) => {
    const matchSearch = !q || l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q);
    const matchStatus = activeStatuses.size === 0 || activeStatuses.has(l.status);
    return matchSearch && matchStatus;
  });
}
