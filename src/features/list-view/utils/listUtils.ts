import type { Lead } from '@/features/leads/types';

export function paginateLeads(
  leads: Lead[],
  page: number,
  pageSize: number,
): { pageLeads: Lead[]; totalPages: number; safePage: number } {
  const totalPages = Math.max(1, Math.ceil(leads.length / pageSize));
  const safePage   = Math.min(page, totalPages);
  const pageLeads  = leads.slice((safePage - 1) * pageSize, safePage * pageSize);
  return { pageLeads, totalPages, safePage };
}
