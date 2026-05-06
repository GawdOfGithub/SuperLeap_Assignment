import { useState, useEffect } from 'react';
import { useCreateLeadMutation, useUpdateLeadMutation } from '../api/leadsApi';
import { SOURCES } from '../constants';
import type { Lead } from '../types';

interface FormState {
  name: string;
  email: string;
  phone: string;
  source: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMPTY: FormState = { name: '', email: '', phone: '', source: '' };

interface UseLeadFormProps {
  open: boolean;
  onClose: () => void;
  lead?: Lead | null;
}

export function useLeadForm({ open, onClose, lead }: UseLeadFormProps) {
  const isEdit = Boolean(lead);
  const [createLead, { isLoading: creating }] = useCreateLeadMutation();
  const [updateLead, { isLoading: updating }] = useUpdateLeadMutation();
  const saving = creating || updating;

  const [form, setForm]       = useState<FormState>(EMPTY);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setForm(lead
        ? { name: lead.name, email: lead.email, phone: lead.phone || '', source: lead.source || '' }
        : EMPTY,
      );
      setTouched({});
      setServerError(null);
    }
  }, [open, lead]);

  const errors: Record<string, string | null> = {
    name:  !form.name.trim()          ? 'Name is required'              : null,
    email: !form.email.trim()         ? 'Email is required'
         : !EMAIL_RE.test(form.email) ? 'Must be a valid email address' : null,
  };
  const isValid = !errors.name && !errors.email;

  const set  = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const blur = (field: keyof FormState) => () =>
    setTouched((t) => ({ ...t, [field]: true }));

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTouched({ name: true, email: true });
    if (!isValid) return;
    setServerError(null);
    try {
      if (isEdit && lead) {
        await updateLead({ id: lead.id, ...form, source: form.source as Lead['source'] || null }).unwrap();
      } else {
        await createLead({ ...form, source: form.source as Lead['source'] || null }).unwrap();
      }
      onClose();
    } catch (err: unknown) {
      const apiErr = err as { data?: { error?: string } };
      setServerError(apiErr?.data?.error ?? 'Something went wrong. Please try again.');
    }
  }

  return {
    isEdit, saving,
    form, touched, errors, isValid, serverError,
    sources: SOURCES,
    set, blur, handleSubmit,
    setForm,
  };
}
