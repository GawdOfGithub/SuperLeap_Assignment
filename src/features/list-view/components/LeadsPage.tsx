import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Plus, Search, Eye, Pencil, Trash2, Loader2, AlertCircle, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { StatusBadge } from '@/features/leads/components/StatusBadge';
import { LeadForm } from '@/features/leads/components/LeadForm';
import { DeleteConfirmDialog } from '@/features/leads/components/DeleteConfirmDialog';
import { StatusTransition } from '@/features/leads/components/StatusTransition';
import { BulkActionBar } from './BulkActionBar';
import { STATUSES, STATUS_PILL_CLASSES, STATUS_RING_CLASSES, PAGE_SIZE } from '@/features/leads/constants';
import { useListView } from '../hooks/useListView';
import type { LeadStatus } from '@/features/leads/types';

export default function LeadsPage() {
  const {
    navigate,
    leads, isLoading, isError, apiError, refetch,
    search, activeStatuses, setSearch, toggleStatus, clearStatuses,
    filtered, pageLeads, totalPages, safePage, setPage,
    formOpen, setFormOpen, editLead, deleteLead, expandedRow,
    selectedIds, allPageSelected, someSelected, selectedLeads,
    toggleSelectAll, toggleSelect, clearSelection,
    openCreate, openEdit, openDelete, handleDeleteClose, toggleExpand,
  } = useListView();

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 py-8 ${someSelected ? 'pb-24' : ''}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          {!isLoading && !isError && (
            <p className="text-sm text-gray-500 mt-0.5">{leads.length} total leads</p>
          )}
        </div>
        <Button onClick={openCreate} className="bg-black text-white hover:bg-gray-800 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Lead
        </Button>
      </div>

      <div className="space-y-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-9"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search leads"
          />
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-500 font-medium">Filter by status:</span>
          {STATUSES.map((s: LeadStatus) => (
            <button
              key={s}
              type="button"
              onClick={() => toggleStatus(s)}
              aria-pressed={activeStatuses.has(s)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${STATUS_PILL_CLASSES[s]} ${activeStatuses.has(s) ? STATUS_RING_CLASSES[s] : 'opacity-60 hover:opacity-100'}`}
            >
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
          {activeStatuses.size > 0 && (
            <button type="button" onClick={clearStatuses} className="text-xs text-gray-500 hover:text-gray-700 underline">
              Clear
            </button>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading leads…</span>
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">Failed to load leads</span>
          </div>
          <p className="text-sm text-gray-500">
            {apiError?.data?.error ?? 'Could not connect to the mock server. Make sure it is running on port 4000.'}
          </p>
          <Button variant="outline" size="sm" onClick={refetch} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" /> Retry
          </Button>
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <div className="border rounded-lg overflow-hidden shadow-sm bg-white">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-3 py-3 w-10">
                    <input
                      type="checkbox"
                      aria-label="Select all on this page"
                      checked={allPageSelected}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Email</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Source</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Updated</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageLeads.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-gray-400">
                      {leads.length === 0 ? (
                        <div className="space-y-2">
                          <p className="font-medium text-gray-500">No leads yet</p>
                          <p className="text-xs">Click <strong>New Lead</strong> to add your first one.</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="font-medium text-gray-500">No leads match your filters</p>
                          <p className="text-xs">Try adjusting your search or status filter.</p>
                        </div>
                      )}
                    </td>
                  </tr>
                )}

                {pageLeads.map((lead) => (
                  <React.Fragment key={lead.id}>
                    <tr
                      className={`border-b last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer ${selectedIds.has(lead.id) ? 'bg-indigo-50/40' : ''}`}
                      onClick={() => toggleExpand(lead.id)}
                    >
                      <td className="px-3 py-3 w-10" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          aria-label={`Select ${lead.name}`}
                          checked={selectedIds.has(lead.id)}
                          onChange={() => toggleSelect(lead.id)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">{lead.name}</td>
                      <td className="px-4 py-3 text-gray-600">{lead.email}</td>
                      <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
                      <td className="px-4 py-3 text-gray-500 capitalize hidden sm:table-cell">
                        {lead.source?.replace('-', ' ') || <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                        {formatDistanceToNow(new Date(lead.updated_at), { addSuffix: true })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button type="button" title="View" aria-label={`View ${lead.name}`}
                            onClick={(e) => { e.stopPropagation(); navigate(`/leads/${lead.id}`); }}
                            className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button type="button" title="Edit" aria-label={`Edit ${lead.name}`}
                            onClick={(e) => openEdit(lead, e)}
                            className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button type="button" title="Delete" aria-label={`Delete ${lead.name}`}
                            onClick={(e) => openDelete(lead, e)}
                            className="p-1.5 rounded hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {expandedRow === lead.id && (
                      <tr className="bg-blue-50 border-b">
                        <td colSpan={7} className="px-6 py-3">
                          <StatusTransition lead={lead} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-gray-400">
              {filtered.length === 0 ? 'No results' : (
                `Showing ${(safePage - 1) * PAGE_SIZE + 1}–${Math.min(safePage * PAGE_SIZE, filtered.length)} of ${filtered.length} leads`
              )}
              {activeStatuses.size > 0 && ` · filtered by ${[...activeStatuses].join(', ')}`}
            </p>

            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled={safePage === 1}
                  onClick={() => setPage(safePage - 1)} className="flex items-center gap-1">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-xs text-gray-500">Page {safePage} / {totalPages}</span>
                <Button variant="outline" size="sm" disabled={safePage === totalPages}
                  onClick={() => setPage(safePage + 1)} className="flex items-center gap-1">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </>
      )}

      <LeadForm open={formOpen} onClose={() => setFormOpen(false)} lead={editLead} />
      {deleteLead && (
        <DeleteConfirmDialog open={Boolean(deleteLead)} onClose={handleDeleteClose} lead={deleteLead} />
      )}

      {someSelected && (
        <BulkActionBar selectedLeads={selectedLeads} onClear={clearSelection} />
      )}
    </div>
  );
}
