import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { useNavigate } from 'react-router-dom';
import { COL_COLORS } from '@/features/leads/constants';
import { LeadCard } from './LeadCard';
import type { DropState } from '../utils/boardUtils';
import type { Lead, LeadStatus } from '@/features/leads/types';

const DROP_STATE_STYLES: Record<DropState, string> = {
  idle:           '',
  source:         'opacity-50',
  valid:          'ring-1 ring-green-300',
  'valid-hover':  'ring-2 ring-green-400 bg-green-50/70',
  invalid:        'ring-1 ring-red-200 opacity-70',
  'invalid-hover':'ring-2 ring-red-400 bg-red-50/70',
};

interface BoardColumnProps {
  status: LeadStatus;
  leads: Lead[];
  draggedLead: Lead | null;
  overColId: string | null;
  navigate: ReturnType<typeof useNavigate>;
  getDropState: (colStatus: LeadStatus, draggedLead: Lead | null, overColId: string | null) => DropState;
}

export function BoardColumn({ status, leads, draggedLead, overColId, navigate, getDropState }: BoardColumnProps) {
  const col       = COL_COLORS[status];
  const dropState = getDropState(status, draggedLead, overColId);

  return (
    <div className={`flex flex-col rounded-xl border ${col.border} ${col.bg} w-72 shrink-0 transition-all ${DROP_STATE_STYLES[dropState]}`}>
      <div className={`${col.header} rounded-t-xl px-3 py-2.5 flex items-center justify-between border-b ${col.border}`}>
        <span className={`font-semibold text-sm ${col.text}`}>{status}</span>
        <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full bg-white/60 ${col.text}`}>
          {leads.length}
        </span>
      </div>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 overflow-y-auto p-2 min-h-[120px] max-h-[calc(100vh-220px)] transition-colors
              ${snapshot.isDraggingOver && dropState === 'valid-hover' ? 'bg-green-50' : ''}
              ${snapshot.isDraggingOver && dropState === 'invalid-hover' ? 'bg-red-50' : ''}`}
          >
            {leads.length === 0 && !snapshot.isDraggingOver && (
              <p className="text-xs text-center text-gray-300 pt-4">No leads</p>
            )}
            {leads.map((lead, i) => (
              <LeadCard key={lead.id} lead={lead} index={i} navigate={navigate} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}


