import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { formatDistanceToNow } from 'date-fns';
import { Lock, GripVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { VALID_TRANSITIONS } from '@/features/leads/constants';
import type { Lead } from '@/features/leads/types';

interface LeadCardProps {
  lead: Lead;
  index: number;
  navigate: ReturnType<typeof useNavigate>;
  style?: React.CSSProperties;
}

export const LeadCard = React.memo(function LeadCard({ lead, index, navigate, style }: LeadCardProps) {
  const isTerminal = VALID_TRANSITIONS[lead.status].length === 0;

  return (
    <Draggable draggableId={lead.id} index={index} isDragDisabled={isTerminal}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => navigate(`/leads/${lead.id}`)}
          className={[
            'bg-white border rounded-lg p-3 mb-2 select-none transition-shadow group',
            snapshot.isDragging
              ? 'shadow-xl ring-2 ring-indigo-400 rotate-1 cursor-grabbing'
              : isTerminal
              ? 'cursor-default opacity-75'
              : 'shadow-sm hover:shadow-md cursor-grab',
          ].join(' ')}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="font-medium text-gray-900 text-sm truncate">{lead.name}</p>
              <p className="text-xs text-gray-400 truncate">{lead.email}</p>
              {lead.source && (
                <p className="text-xs text-gray-300 capitalize mt-0.5">{lead.source.replace(/-/g, ' ')}</p>
              )}
              <p className="text-xs text-gray-300 mt-1">
                {formatDistanceToNow(new Date(lead.updated_at), { addSuffix: true })}
              </p>
            </div>
            <div className="shrink-0 mt-0.5">
              {isTerminal
                ? <Lock className="h-3.5 w-3.5 text-gray-300" />
                : <GripVertical className="h-4 w-4 text-gray-200 group-hover:text-gray-400 transition-colors" />}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
});
