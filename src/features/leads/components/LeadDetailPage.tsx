import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Pencil, Trash2, Mail, Phone, Globe, Calendar, Loader2, AlertCircle, LucideProps } from 'lucide-react';
import { Button } from '@/ui/button';
import { StatusBadge } from './StatusBadge';
import { StatusTransition } from './StatusTransition';
import { LeadForm } from './LeadForm';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { useLeadDetail } from '../hooks/useLeadDetail';

interface FieldProps {
  icon: React.ComponentType<LucideProps>;
  label: string;
  value?: string | null;
}

function Field({ icon: Icon, label, value }: FieldProps) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
      <div>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-sm text-gray-800">{value}</p>
      </div>
    </div>
  );
}

export default function LeadDetailPage() {
  const {
    navigate,
    lead, isLoading, isError, apiError,
    editOpen, setEditOpen,
    deleteOpen, setDeleteOpen,
    handleDeleteClose,
  } = useLeadDetail();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Loading lead…</span>
      </div>
    );
  }

  if (isError || !lead) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-3">
        <div className="flex items-center justify-center gap-2 text-red-600">
          <AlertCircle className="h-5 w-5" />
          <span className="font-medium">
            {apiError?.status === 404 ? 'Lead not found.' : 'Failed to load lead.'}
          </span>
        </div>
        <Link to="/leads" className="text-sm text-blue-600 hover:underline inline-block">
          ← Back to Leads
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditOpen(true)} className="flex items-center gap-1.5">
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)} className="flex items-center gap-1.5">
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </Button>
        </div>
      </div>

      <div className="bg-white border rounded-xl shadow-sm p-6 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
            {lead.source && (
              <p className="text-sm text-gray-400 mt-0.5 capitalize">
                via {lead.source.replace('-', ' ')}
              </p>
            )}
          </div>
          <StatusBadge status={lead.status} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field icon={Mail}     label="Email"   value={lead.email} />
          <Field icon={Phone}    label="Phone"   value={lead.phone} />
          <Field icon={Globe}    label="Source"  value={lead.source} />
          <Field icon={Calendar} label="Created" value={format(new Date(lead.created_at), 'MMM d, yyyy')} />
        </div>

        <hr />

        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-700">Status Transition</h2>
          <StatusTransition lead={lead} />
        </div>

        <div className="text-xs text-gray-400 flex gap-4">
          <span>Created: {format(new Date(lead.created_at), 'MMM d, yyyy HH:mm')}</span>
          <span>Updated: {format(new Date(lead.updated_at), 'MMM d, yyyy HH:mm')}</span>
        </div>
      </div>

      <LeadForm open={editOpen} onClose={() => setEditOpen(false)} lead={lead} />
      <DeleteConfirmDialog open={deleteOpen} onClose={handleDeleteClose} lead={lead} />
    </div>
  );
}
