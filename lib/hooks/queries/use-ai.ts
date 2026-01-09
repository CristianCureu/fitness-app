import { useMutation, useQuery } from '@tanstack/react-query';
import { aiApi } from '@/lib/api/endpoints';
import { queryKeys } from '@/lib/api/query-keys';

export function useAskTodayAi() {
  return useMutation({
    mutationFn: (question: string) => aiApi.askToday(question),
  });
}

export function useMealIdeasAi() {
  return useMutation({
    mutationFn: (data?: { preferences?: string[]; mealsPerDay?: number }) =>
      aiApi.mealIdeas(data),
  });
}

export function useWeeklyFeedbackAi() {
  return useQuery({
    queryKey: queryKeys.ai.weeklyFeedback(),
    queryFn: () => aiApi.weeklyFeedback(),
    staleTime: 0,
    refetchOnMount: 'always',
  });
}
