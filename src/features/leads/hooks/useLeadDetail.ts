import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetLeadQuery } from '../api/leadsApi';

export function useLeadDetail() {
  const { id }   = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: lead, isLoading, isError, error } = useGetLeadQuery(id!);

  const [editOpen, setEditOpen]     = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  function handleDeleteClose(deleted?: boolean) {
    setDeleteOpen(false);
    if (deleted) navigate(-1);
  }

  const apiError = error as { status?: number; data?: { error?: string } } | undefined;

  return {
    navigate,
    lead, isLoading, isError, apiError,
    editOpen, setEditOpen,
    deleteOpen, setDeleteOpen,
    handleDeleteClose,
  };
}
