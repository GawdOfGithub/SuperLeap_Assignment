import React from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/ui/dialog';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/ui/select';
import { useLeadForm } from '../hooks/useLeadForm';
import type { Lead } from '../types';

interface LeadFormProps {
  open: boolean;
  onClose: () => void;
  lead?: Lead | null;
}

export function LeadForm({ open, onClose, lead }: LeadFormProps) {
  const {
    isEdit, saving,
    form, touched, errors, isValid, serverError,
    sources,
    set, blur, handleSubmit,
    setForm,
  } = useLeadForm({ open, onClose, lead });

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Lead' : 'Create New Lead'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="space-y-4 mt-2">
          {serverError && (
            <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
              {serverError}
            </p>
          )}

          <div className="space-y-1">
            <label htmlFor="lead-name" className="text-sm font-medium">
              Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="lead-name"
              value={form.name}
              onChange={set('name')}
              onBlur={blur('name')}
              aria-invalid={touched.name && !!errors.name}
              placeholder="Full name"
            />
            {touched.name && errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="lead-email" className="text-sm font-medium">
              Email <span className="text-red-500">*</span>
            </label>
            <Input
              id="lead-email"
              type="email"
              value={form.email}
              onChange={set('email')}
              onBlur={blur('email')}
              aria-invalid={touched.email && !!errors.email}
              placeholder="email@example.com"
            />
            {touched.email && errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
          </div>

          <div className="space-y-1">
            <label htmlFor="lead-phone" className="text-sm font-medium">Phone</label>
            <Input
              id="lead-phone"
              type="tel"
              value={form.phone}
              onChange={set('phone')}
              placeholder="Optional"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Source</label>
            <Select value={form.source} onValueChange={(v) => setForm((f) => ({ ...f, source: v }))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select source…" />
              </SelectTrigger>
              <SelectContent>
                {sources.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid || saving} className="bg-black text-white">
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Lead'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
