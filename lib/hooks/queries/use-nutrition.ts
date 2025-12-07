import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { nutritionApi } from '@/lib/api/endpoints';
import { queryKeys } from '@/lib/api/query-keys';
import type { CreateNutritionGoalDto, NutritionGoalQueryParams } from '@/lib/types/api';

/**
 * Get current week's nutrition goal (CLIENT only)
 */
export function useCurrentNutritionGoal() {
  return useQuery({
    queryKey: queryKeys.nutrition.current(),
    queryFn: () => nutritionApi.getCurrentGoal(),
  });
}

/**
 * Get all nutrition goals with optional filters
 */
export function useNutritionGoals(params?: NutritionGoalQueryParams) {
  return useQuery({
    queryKey: queryKeys.nutrition.all(params),
    queryFn: () => nutritionApi.getAll(params),
  });
}

/**
 * Create a nutrition goal (TRAINER only)
 */
export function useCreateNutritionGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNutritionGoalDto) => nutritionApi.createGoal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.nutrition.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.today.all() });
    },
  });
}

/**
 * Update a nutrition goal (TRAINER only)
 */
export function useUpdateNutritionGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateNutritionGoalDto> }) =>
      nutritionApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.nutrition.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.nutrition.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.today.all() });
    },
  });
}

/**
 * Delete a nutrition goal (TRAINER only)
 */
export function useDeleteNutritionGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => nutritionApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.nutrition.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.today.all() });
    },
  });
}