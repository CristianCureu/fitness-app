import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { nutritionApi } from '@/lib/api/endpoints';
import { queryKeys } from '@/lib/api/query-keys';
import type {
  CreateMealIdeaDto,
  CreateNutritionGoalDto,
  CreateNutritionSettingsDto,
  CreateNutritionTipDto,
  MealIdeaQueryParams,
  NutritionGoalQueryParams,
  NutritionSettingsQueryParams,
  NutritionTipQueryParams,
} from '@/lib/types/api';

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

/**
 * Get nutrition settings
 */
export function useNutritionSettings(params?: NutritionSettingsQueryParams) {
  return useQuery({
    queryKey: queryKeys.nutrition.settings(params),
    queryFn: () => nutritionApi.getSettings(params),
  });
}

/**
 * Upsert nutrition settings (TRAINER only)
 */
export function useUpsertNutritionSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNutritionSettingsDto) => nutritionApi.upsertSettings(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.nutrition.settings() });
      if (variables.clientId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.nutrition.settings({ clientId: variables.clientId }),
        });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.today.all() });
    },
  });
}

/**
 * Update nutrition settings (TRAINER only)
 */
export function useUpdateNutritionSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateNutritionSettingsDto> }) =>
      nutritionApi.updateSettings(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.nutrition.settings() });
      queryClient.invalidateQueries({ queryKey: queryKeys.today.all() });
    },
  });
}

/**
 * Get today's nutrition tip (CLIENT only)
 */
export function useTodayNutritionTip() {
  return useQuery({
    queryKey: queryKeys.nutrition.todayTip(),
    queryFn: () => nutritionApi.getTodayTip(),
  });
}

/**
 * List nutrition tips (TRAINER only)
 */
export function useNutritionTips(params?: NutritionTipQueryParams) {
  return useQuery({
    queryKey: queryKeys.nutrition.tips(params),
    queryFn: () => nutritionApi.getTips(params),
  });
}

/**
 * Create nutrition tip (TRAINER only)
 */
export function useCreateNutritionTip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNutritionTipDto) => nutritionApi.createTip(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.nutrition.tips() });
    },
  });
}

/**
 * Update nutrition tip (TRAINER only)
 */
export function useUpdateNutritionTip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateNutritionTipDto> }) =>
      nutritionApi.updateTip(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.nutrition.tips() });
    },
  });
}

/**
 * Delete nutrition tip (TRAINER only)
 */
export function useDeleteNutritionTip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => nutritionApi.deleteTip(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.nutrition.tips() });
    },
  });
}

/**
 * List meal ideas
 */
export function useMealIdeas(params?: MealIdeaQueryParams) {
  return useQuery({
    queryKey: queryKeys.nutrition.meals(params),
    queryFn: () => nutritionApi.getMealIdeas(params),
  });
}

/**
 * Create meal idea (TRAINER only)
 */
export function useCreateMealIdea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMealIdeaDto) => nutritionApi.createMealIdea(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.nutrition.meals() });
    },
  });
}

/**
 * Update meal idea (TRAINER only)
 */
export function useUpdateMealIdea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateMealIdeaDto> }) =>
      nutritionApi.updateMealIdea(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.nutrition.meals() });
    },
  });
}

/**
 * Delete meal idea (TRAINER only)
 */
export function useDeleteMealIdea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => nutritionApi.deleteMealIdea(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.nutrition.meals() });
    },
  });
}
