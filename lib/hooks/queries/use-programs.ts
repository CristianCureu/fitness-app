import { clientProgramApi, programApi, programInsightsApi } from '@/lib/api/endpoints';
import { queryKeys } from '@/lib/api/query-keys';
import type {
  AssignProgramRequest,
  CreateProgramRequest,
  UpdateProgramRequest,
} from '@/lib/types/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function usePrograms() {
  return useQuery({
    queryKey: queryKeys.programs.all(),
    queryFn: () => programApi.getAll(),
  });
}

export function useProgram(id?: string) {
  return useQuery({
    queryKey: id ? queryKeys.programs.detail(id) : ['program', 'disabled'],
    queryFn: () => programApi.getById(id as string),
    enabled: !!id,
  });
}

export function useCreateProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProgramRequest) => programApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.programs.all() });
    },
  });
}

export function useUpdateProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProgramRequest }) =>
      programApi.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidate all program-related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.programs.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.programs.detail(variables.id) });
      // Force refetch all client programs since they might have this program assigned
      queryClient.invalidateQueries({
        queryKey: ['clients'],
        refetchType: 'active',
        predicate: (query) => {
          // Match any query that includes 'program' (covers active programs, recommendations, history)
          return query.queryKey.includes('program');
        }
      });
    },
  });
}

export function useDeleteProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => programApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.programs.all() });
    },
  });
}

export function useCloneProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => programApi.clone(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.programs.all() });
    },
  });
}

export function useActiveClientProgram(clientId?: string) {
  return useQuery({
    queryKey: clientId ? queryKeys.clientPrograms.active(clientId) : ['client-program', 'disabled'],
    queryFn: () => clientProgramApi.getActive(clientId as string),
    enabled: !!clientId,
  });
}

export function useAssignProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ clientId, data }: { clientId: string; data: AssignProgramRequest }) =>
      clientProgramApi.assign(clientId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clientPrograms.active(variables.clientId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.programInsights.recommendations(variables.clientId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.programInsights.history(variables.clientId) });
      // Invalidate programs list in case a personalized program was created
      queryClient.invalidateQueries({ queryKey: queryKeys.programs.all() });
    },
  });
}

export function useUpdateTrainingDays() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ clientId, data }: { clientId: string; data: { trainingDays: AssignProgramRequest['trainingDays'] } }) =>
      clientProgramApi.updateTrainingDays(clientId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clientPrograms.active(variables.clientId) });
    },
  });
}

export function useRemoveProgramAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (clientId: string) => clientProgramApi.remove(clientId),
    onSuccess: (_, clientId) => {
      queryClient.removeQueries({ queryKey: queryKeys.clientPrograms.active(clientId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.programInsights.recommendations(clientId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.programInsights.history(clientId) });
    },
  });
}

export function useProgramRecommendations(clientId?: string) {
  return useQuery({
    queryKey: clientId ? queryKeys.programInsights.recommendations(clientId) : ['program', 'recommendations', 'disabled'],
    queryFn: () => programInsightsApi.getRecommendations(clientId as string),
    enabled: !!clientId,
  });
}

export function useProgramHistory(clientId?: string) {
  return useQuery({
    queryKey: clientId ? queryKeys.programInsights.history(clientId) : ['program', 'history', 'disabled'],
    queryFn: () => programInsightsApi.getHistory(clientId as string),
    enabled: !!clientId,
  });
}
