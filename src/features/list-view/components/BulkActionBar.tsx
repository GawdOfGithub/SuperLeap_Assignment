import React from 'react';
import { Trash2, ChevronDown, X, Loader2 } from 'lucide-react';
import { Button } from '@/ui/button';
import { STATUS_ACTION_LABELS, STATUS_ACTION_COLORS } from '@/features/leads/constants';
import { useBulkActions } from '../hooks/useBulkActions';
import type { Lead } from '@/features/leads/types';

interface BulkActionBarProps {
  selectedLeads: Lead[];
  onClear: () => void;
}

export function BulkActionBar({ selectedLeads, onClear }: BulkActionBarProps) {
  const {
    busyAction,
    statusMenuOpen, setStatusMenuOpen,
    commonTransitions,
    isBusy,
    handleBulkDelete,
    handleBulkStatus,
  } = useBulkActions(selectedLeads, onClear);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 text-white px-6 py-3 flex items-center gap-3 shadow-2xl">
      <span className="font-medium text-sm">{selectedLeads.length} selected</span>
      <button
        type="button"
        onClick={onClear}
        disabled={isBusy}
        className="p-1 rounded hover:bg-white/10 transition-colors disabled:opacity-40"
        aria-label="Clear selection"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="h-4 border-l border-white/20" />

      <Button
        size="sm"
        variant="destructive"
        onClick={handleBulkDelete}
        disabled={isBusy}
        className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700"
      >
        {busyAction === 'delete'
          ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
          : <Trash2 className="h-3.5 w-3.5" />}
        Delete
      </Button>

      <div className="relative">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setStatusMenuOpen((o) => !o)}
          disabled={isBusy}
          className="flex items-center gap-1.5 border-white/30 text-white hover:bg-white/10 bg-transparent"
        >
          {busyAction && busyAction !== 'delete' && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Change Status
          <ChevronDown className="h-3.5 w-3.5" />
        </Button>

        {statusMenuOpen && (
          <div className="absolute bottom-full mb-1 left-0 bg-white border rounded-lg shadow-lg py-1 min-w-[180px] z-10">
            {commonTransitions.length === 0 ? (
              <p className="text-xs text-gray-400 px-3 py-2">
                No common transitions available for this selection.
              </p>
            ) : (
              commonTransitions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleBulkStatus(s)}
                  className={`w-full text-left text-sm px-3 py-1.5 transition-colors ${STATUS_ACTION_COLORS[s] ?? ''}`}
                >
                  {STATUS_ACTION_LABELS[s]}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {commonTransitions.length === 0 && selectedLeads.length > 0 && (
        <span className="text-xs text-gray-400 ml-1">
          Selection includes terminal or incompatible statuses.
        </span>
      )}
    </div>
  );
}
