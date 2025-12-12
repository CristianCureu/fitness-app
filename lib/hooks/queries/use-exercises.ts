import { exerciseApi } from '@/lib/api/endpoints';
import { queryKeys } from '@/lib/api/query-keys';
import type {
  ExerciseSearchParams,
  ExerciseRecommendedParams,
} from '@/lib/types/api';
import { useQuery } from '@tanstack/react-query';

export function useExerciseSearch(params?: ExerciseSearchParams) {
  return useQuery({
    queryKey: queryKeys.exercises.search(params),
    queryFn: () => exerciseApi.search(params),
    enabled: !!params,
  });
}

export function useRecommendedExercises(params?: ExerciseRecommendedParams) {
  return useQuery({
    queryKey: queryKeys.exercises.recommended(params),
    queryFn: () => exerciseApi.recommended(params),
    enabled: !!params?.categories && params.categories.length > 0,
  });
}

export function useExercise(id?: string) {
  return useQuery({
    queryKey: id ? queryKeys.exercises.detail(id) : ['exercise', 'disabled'],
    queryFn: () => exerciseApi.getById(id as string),
    enabled: !!id,
  });
}
