import React from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { Search, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { BoardColumn } from './BoardColumn';
import { STATUSES, STATUS_PILL_CLASSES, STATUS_RING_CLASSES } from '@/features/leads/constants';
import { useBoardView } from '../hooks/useBoardView';

export default function BoardPage() {
  const {
    leads, isLoading, isError, apiError, refetch,
    search, activeStatuses, setSearch, toggleStatus, clearStatuses,
    filtered,
    navigate, draggedLead, overColId, byStatus,
    getDropState,
    onDragStart, onDragUpdate, onDragEnd,
  } = useBoardView();

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      <div className="bg-white border-b px-6 py-3 space-y-2 shrink-0">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-9 h-8 text-sm"
              placeholder="Search leads…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search leads"
            />
          </div>
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-xs text-gray-400">Filter:</span>
            {STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggleStatus(s)}
                aria-pressed={activeStatuses.has(s)}
                className={`px-2 py-0.5 rounded-full text-xs font-medium border transition-all ${STATUS_PILL_CLASSES[s]} ${activeStatuses.has(s) ? STATUS_RING_CLASSES[s] : 'opacity-60 hover:opacity-100'}`}
              >
                {s.charAt(0) + s.slice(1).toLowerCase()}
              </button>
            ))}
            {activeStatuses.size > 0 && (
              <button type="button" onClick={clearStatuses} className="text-xs text-gray-400 hover:text-gray-600 underline">
                Clear
              </button>
            )}
          </div>
          <p className="text-xs text-gray-400 ml-auto">{filtered.length} of {leads.length} leads shown</p>
        </div>
      </div>

      {isLoading && (
        <div className="flex-1 flex items-center justify-center gap-3 text-gray-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading leads…
        </div>
      )}

      {isError && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">Failed to load leads</span>
          </div>
          <p className="text-sm text-gray-500">{apiError?.data?.error ?? 'Could not connect to the mock server.'}</p>
          <Button variant="outline" size="sm" onClick={refetch} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" /> Retry
          </Button>
        </div>
      )}

      {!isLoading && !isError && (
        <DragDropContext onDragStart={onDragStart} onDragUpdate={onDragUpdate} onDragEnd={onDragEnd}>
          <div className="flex-1 overflow-x-auto overflow-y-hidden">
            <div className="flex gap-4 p-4 h-full items-start min-w-max">
              {STATUSES.map((status) => (
                <BoardColumn
                  key={status}
                  status={status}
                  leads={byStatus[status]}
                  draggedLead={draggedLead}
                  overColId={overColId}
                  navigate={navigate}
                  getDropState={getDropState}
                />
              ))}
            </div>
          </div>
        </DragDropContext>
      )}
    </div>
  );
}
