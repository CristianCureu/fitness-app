import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { onboardingApi } from '@/lib/api/endpoints';
import type { CompleteOnboardingRequest, ValidateInviteRequest } from '@/lib/types/api';
import { queryKeys } from '@/lib/api/query-keys';

/**
 * Get onboarding status (CLIENT only)
 */
export function useOnboardingStatus() {
  return useQuery({
    queryKey: queryKeys.onboarding.status(),
    queryFn: () => onboardingApi.getStatus(),
  });
}

/**
 * Validate invite code (CLIENT only)
 */
export function useValidateInvite() {
  return useMutation({
    mutationFn: (data: ValidateInviteRequest) => onboardingApi.validateInvite(data),
  });
}

/**
 * Complete onboarding with invite code (CLIENT only)
 */
export function useCompleteOnboarding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CompleteOnboardingRequest) => onboardingApi.complete(data),
    onSuccess: () => {
      // Invalidate queries to refresh user data
      queryClient.invalidateQueries({ queryKey: queryKeys.onboarding.status() });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.me() });
    },
  });
}
