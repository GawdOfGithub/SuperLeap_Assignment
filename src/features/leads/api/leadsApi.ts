import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Lead, LeadStatus, LeadSource } from '../types';

export interface CreateLeadBody {
  name: string;
  email: string;
  phone?: string | null;
  status?: LeadStatus;
  source?: LeadSource | null;
}

export interface UpdateLeadBody {
  id: string;
  name?: string;
  email?: string;
  phone?: string | null;
  status?: LeadStatus;
  source?: LeadSource | null;
}

export const leadsApi = createApi({
  reducerPath: 'leadsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  tagTypes: ['Lead'],
  endpoints: (builder) => ({

    getLeads: builder.query<Lead[], void>({
      query: () => 'leads',
      providesTags: (result = []) => [
        'Lead',
        ...result.map(({ id }) => ({ type: 'Lead' as const, id })),
      ],
    }),

    getLead: builder.query<Lead, string>({
      query: (id) => `leads/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Lead', id }],
    }),

    createLead: builder.mutation<Lead, CreateLeadBody>({
      query: (body) => ({ url: 'leads', method: 'POST', body }),
      invalidatesTags: ['Lead'],
    }),

    updateLead: builder.mutation<Lead, UpdateLeadBody>({
      query: ({ id, ...body }) => ({ url: `leads/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Lead', id }, 'Lead'],
    }),

    deleteLead: builder.mutation<void, string>({
      query: (id) => ({ url: `leads/${id}`, method: 'DELETE' }),
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
        const patch = dispatch(
          leadsApi.util.updateQueryData('getLeads', undefined, (draft) => {
            const idx = draft.findIndex((l) => l.id === id);
            if (idx !== -1) draft.splice(idx, 1);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: ['Lead'],
    }),

    transitionStatus: builder.mutation<Lead, { id: string; status: LeadStatus }>({
      query: ({ id, status }) => ({
        url: `leads/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      onQueryStarted: async ({ id, status }, { dispatch, queryFulfilled }) => {
        const now = new Date().toISOString();
        const patchList = dispatch(
          leadsApi.util.updateQueryData('getLeads', undefined, (draft) => {
            const lead = draft.find((l) => l.id === id);
            if (lead) { lead.status = status; lead.updated_at = now; }
          })
        );
        const patchOne = dispatch(
          leadsApi.util.updateQueryData('getLead', id, (draft) => {
            draft.status = status; draft.updated_at = now;
          })
        );
        try { await queryFulfilled; }
        catch { patchList.undo(); patchOne.undo(); }
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Lead', id }, 'Lead'],
    }),

  }),
});

export const {
  useGetLeadsQuery,
  useGetLeadQuery,
  useCreateLeadMutation,
  useUpdateLeadMutation,
  useDeleteLeadMutation,
  useTransitionStatusMutation,
} = leadsApi;
