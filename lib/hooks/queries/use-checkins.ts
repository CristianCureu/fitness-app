import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { checkinApi } from '@/lib/api/endpoints';
import { queryKeys } from '@/lib/api/query-keys';
import type { CreateCheckinDto, CheckinQueryParams } from '@/lib/types/api';

/**
 * Get all check-ins with optional filters
 */
export function useCheckins(params?: CheckinQueryParams) {
  return useQuery({
    queryKey: queryKeys.checkins.all(params),
    queryFn: () => checkinApi.getAll(params),
  });
}

/**
 * Get a single check-in by ID
 */
export function useCheckin(id: string) {
  return useQuery({
    queryKey: queryKeys.checkins.detail(id),
    queryFn: () => checkinApi.getById(id),
    enabled: !!id,
  });
}

/**
 * Upsert today's check-in (CLIENT only)
 * Creates or updates check-in for today
 */
export function useUpsertCheckin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCheckinDto) => checkinApi.upsertToday(data),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.checkins.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.today.all() });
    },
  });
}

/**
 * Update an existing check-in
 */
export function useUpdateCheckin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateCheckinDto> }) =>
      checkinApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.checkins.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.checkins.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.today.all() });
    },
  });
}

/**
 * Delete a check-in
 */
export function useDeleteCheckin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => checkinApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.checkins.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.today.all() });
    },
  });
}