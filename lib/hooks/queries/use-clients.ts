import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientApi } from '@/lib/api/endpoints';
import { queryKeys } from '@/lib/api/query-keys';
import type { CreateClientProfileDto } from '@/lib/types/api';

/**
 * Get all clients
 * TRAINER: all their clients
 * CLIENT: just themselves
 */
export function useClients(params?: { search?: string; status?: string; offset?: number; limit?: number }) {
  return useQuery({
    queryKey: queryKeys.clients.all(params),
    queryFn: () => clientApi.getAll(params),
  });
}

/**
 * Get a single client by ID
 */
export function useClient(id: string) {
  return useQuery({
    queryKey: queryKeys.clients.detail(id),
    queryFn: () => clientApi.getById(id),
    enabled: !!id,
  });
}

/**
 * Create a new client profile (TRAINER only)
 */
export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClientProfileDto) => clientApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all() });
    },
  });
}

/**
 * Update a client profile (TRAINER only)
 */
export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateClientProfileDto> }) =>
      clientApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.detail(variables.id) });
    },
  });
}

/**
 * Delete a client (TRAINER only)
 */
export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => clientApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all() });
    },
  });
}