import { scheduleApi } from '@/lib/api/endpoints';
import { queryKeys } from '@/lib/api/query-keys';
import type {
  ClientSessionRecommendation,
  CompleteSessionRequest,
  CreateClientSessionDto,
  CreateSessionDto,
  SessionQueryParams,
  SessionStatus,
} from '@/lib/types/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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
 * Create a new session as client (CLIENT only)
 */
export function useCreateClientSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClientSessionDto) => scheduleApi.createClientSession(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.upcoming() });
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.weekCalendar(new Date().toISOString()) });
      queryClient.invalidateQueries({ queryKey: queryKeys.today.all() });
    },
  });
}

/**
 * Get recommended session for client (CLIENT only)
 */
export function useClientSessionRecommendation() {
  return useMutation<ClientSessionRecommendation, Error, void>({
    mutationFn: () => scheduleApi.getClientRecommendation(),
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
 * Update session status only (TRAINER and CLIENT)
 * Lightweight mutation for status-only updates
 */
export function useUpdateSessionStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: SessionStatus }) => {
      return scheduleApi.updateSessionStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.today.all() });
      queryClient.invalidateQueries({ queryKey: ['sessions', 'calendar'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.upcoming() });
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

// ============================================================================
// CLIENT SESSION HOOKS
// ============================================================================

/**
 * Get upcoming sessions (CLIENT)
 */
export function useUpcomingSessions(limit: number = 5) {
  return useQuery({
    queryKey: queryKeys.sessions.upcoming(limit),
    queryFn: () => scheduleApi.getUpcomingSessions(limit),
  });
}

/**
 * Get session details with exercises (CLIENT)
 */
export function useSessionDetails(id: string) {
  return useQuery({
    queryKey: queryKeys.sessions.detail(id),
    queryFn: () => scheduleApi.getSessionDetails(id),
    enabled: !!id,
  });
}

/**
 * Get week calendar (CLIENT)
 */
export function useWeekCalendar(date: string) {
  return useQuery({
    queryKey: queryKeys.sessions.weekCalendar(date),
    queryFn: () => scheduleApi.getWeekCalendar(date),
  });
}

/**
 * Get session history with pagination (CLIENT)
 */
export function useSessionHistory(limit: number = 20, offset: number = 0) {
  return useQuery({
    queryKey: queryKeys.sessions.history(limit, offset),
    queryFn: () => scheduleApi.getSessionHistory(limit, offset),
  });
}

/**
 * Complete a session (CLIENT)
 */
export function useCompleteSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CompleteSessionRequest }) =>
      scheduleApi.completeSession(id, data),
    onSuccess: (_, variables) => {
      console.log('[Sessions][complete] success', { id: variables.id });
      // Invalidate all session-related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.upcoming() });
      queryClient.invalidateQueries({ queryKey: ['sessions', 'history'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.today.all() });
    },
    onError: (error, variables) => {
      console.error('[Sessions][complete] error', {
        id: variables.id,
        message: error instanceof Error ? error.message : String(error),
      });
    },
  });
}
