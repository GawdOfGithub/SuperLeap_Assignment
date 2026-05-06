import type { LeadStatus } from '../types';

export const STATUSES: LeadStatus[] = ['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST'];

export const VALID_TRANSITIONS: Record<LeadStatus, LeadStatus[]> = {
  NEW:       ['CONTACTED', 'LOST'],
  CONTACTED: ['QUALIFIED',  'LOST'],
  QUALIFIED: ['CONVERTED',  'LOST'],
  CONVERTED: [],
  LOST:      [],
};

export const SOURCES = [
  'website', 'referral', 'campaign', 'linkedin', 'cold-call',
  'email', 'trade-show', 'partner', 'event', 'cold-outreach',
] as const;

export const STATUS_PILL_CLASSES: Record<LeadStatus, string> = {
  NEW:       'bg-blue-100 text-blue-700 border-blue-300',
  CONTACTED: 'bg-amber-100 text-amber-700 border-amber-300',
  QUALIFIED: 'bg-purple-100 text-purple-700 border-purple-300',
  CONVERTED: 'bg-green-100 text-green-700 border-green-300',
  LOST:      'bg-red-100 text-red-600 border-red-300',
};

export const STATUS_RING_CLASSES: Record<LeadStatus, string> = {
  NEW:       'ring-2 ring-blue-400',
  CONTACTED: 'ring-2 ring-amber-400',
  QUALIFIED: 'ring-2 ring-purple-400',
  CONVERTED: 'ring-2 ring-green-400',
  LOST:      'ring-2 ring-red-400',
};

export const COL_COLORS: Record<LeadStatus, { bg: string; header: string; border: string; text: string }> = {
  NEW:       { bg: 'bg-blue-50',   header: 'bg-blue-100',   border: 'border-blue-200',   text: 'text-blue-700'   },
  CONTACTED: { bg: 'bg-amber-50',  header: 'bg-amber-100',  border: 'border-amber-200',  text: 'text-amber-700'  },
  QUALIFIED: { bg: 'bg-purple-50', header: 'bg-purple-100', border: 'border-purple-200', text: 'text-purple-700' },
  CONVERTED: { bg: 'bg-green-50',  header: 'bg-green-100',  border: 'border-green-200',  text: 'text-green-700'  },
  LOST:      { bg: 'bg-red-50',    header: 'bg-red-100',    border: 'border-red-200',    text: 'text-red-600'    },
};

export const STATUS_BADGE_CONFIG: Record<LeadStatus, { label: string; className: string }> = {
  NEW:       { label: 'New',       className: 'bg-blue-100 text-blue-700 border-blue-200' },
  CONTACTED: { label: 'Contacted', className: 'bg-amber-100 text-amber-700 border-amber-200' },
  QUALIFIED: { label: 'Qualified', className: 'bg-purple-100 text-purple-700 border-purple-200' },
  CONVERTED: { label: 'Converted', className: 'bg-green-100 text-green-700 border-green-200' },
  LOST:      { label: 'Lost',      className: 'bg-red-100 text-red-600 border-red-200' },
};

export const STATUS_ACTION_LABELS: Partial<Record<LeadStatus, string>> = {
  CONTACTED: 'Mark Contacted',
  QUALIFIED: 'Mark Qualified',
  CONVERTED: 'Mark Converted',
  LOST:      'Mark Lost',
};

export const STATUS_ACTION_COLORS: Partial<Record<LeadStatus, string>> = {
  CONTACTED: 'text-amber-700 hover:bg-amber-50',
  QUALIFIED: 'text-purple-700 hover:bg-purple-50',
  CONVERTED: 'text-green-700 hover:bg-green-50',
  LOST:      'text-red-600 hover:bg-red-50',
};

export const TRANSITION_LABELS: Partial<Record<LeadStatus, string>> = {
  CONTACTED: 'Mark as Contacted',
  QUALIFIED: 'Mark as Qualified',
  CONVERTED: 'Mark as Converted',
  LOST:      'Mark as Lost',
};

export const TRANSITION_COLORS: Partial<Record<LeadStatus, string>> = {
  CONTACTED: 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100',
  QUALIFIED: 'bg-purple-50 text-purple-700 border-purple-300 hover:bg-purple-100',
  CONVERTED: 'bg-green-50 text-green-700 border-green-300 hover:bg-green-100',
  LOST:      'bg-red-50 text-red-600 border-red-300 hover:bg-red-100',
};

export const PAGE_SIZE = 50;
