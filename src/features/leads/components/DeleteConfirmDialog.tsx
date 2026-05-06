import React from 'react';
import { useDeleteLeadMutation } from '../api/leadsApi';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/ui/dialog';
import { Button } from '@/ui/button';
import type { Lead } from '../types';

interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: (deleted?: boolean) => void;
  lead: Lead;
}

export function DeleteConfirmDialog({ open, onClose, lead }: DeleteConfirmDialogProps) {
  const [deleteLead, { isLoading }] = useDeleteLeadMutation();

  async function handleDelete() {
    try {
      await deleteLead(lead.id).unwrap();
      onClose(true);
    } catch {
      onClose(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete Lead</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{lead?.name}</strong>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onClose()} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? 'Deleting…' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
