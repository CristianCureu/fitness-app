import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recommendationApi } from '@/lib/api/endpoints';
import { queryKeys } from '@/lib/api/query-keys';
import type { CreateRecommendationDto, RecommendationQueryParams } from '@/lib/types/api';

/**
 * Get today's recommendation (CLIENT only)
 */
export function useTodayRecommendation() {
  return useQuery({
    queryKey: queryKeys.recommendations.today(),
    queryFn: () => recommendationApi.getToday(),
  });
}

/**
 * Get all recommendations with optional filters
 */
export function useRecommendations(params?: RecommendationQueryParams) {
  return useQuery({
    queryKey: queryKeys.recommendations.all(params),
    queryFn: () => recommendationApi.getAll(params),
  });
}

/**
 * Create a daily recommendation (TRAINER only)
 */
export function useCreateRecommendation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRecommendationDto) => recommendationApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recommendations.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.today.all() });
    },
  });
}

/**
 * Update a recommendation (TRAINER only)
 */
export function useUpdateRecommendation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateRecommendationDto> }) =>
      recommendationApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recommendations.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.recommendations.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.today.all() });
    },
  });
}

/**
 * Delete a recommendation (TRAINER only)
 */
export function useDeleteRecommendation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => recommendationApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recommendations.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.today.all() });
    },
  });
}