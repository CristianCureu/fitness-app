import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { scheduleApi } from '@/lib/api/endpoints';
import { queryKeys } from '@/lib/api/query-keys';
import type { CreateSessionDto, SessionQueryParams } from '@/lib/types/api';

/**
 * Get all sessions with optional filters
 */
export function useSessions(params?: SessionQueryParams) {
  return useQuery({
    queryKey: queryKeys.sessions.all(params),
    queryFn: () => scheduleApi.getSessions(params),
  });
}

/**
 * Create a new session (TRAINER only)
 */
export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSessionDto) => scheduleApi.createSession(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.today.all() });
    },
  });
}

/**
 * Update an existing session (TRAINER only)
 */
export function useUpdateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateSessionDto> }) =>
      scheduleApi.updateSession(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.today.all() });
    },
  });
}

/**
 * Delete a session (TRAINER only)
 */
export function useDeleteSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => scheduleApi.deleteSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.today.all() });
    },
  });
}