import { useQuery } from '@tanstack/react-query';
import { todayApi } from '@/lib/api/endpoints';
import { queryKeys } from '@/lib/api/query-keys';

/**
 * Get today's aggregated view (CLIENT only)
 * Returns next session, daily recommendation, check-in, nutrition goal, and client info
 */
export function useTodayView() {
  return useQuery({
    queryKey: queryKeys.today.all(),
    queryFn: () => todayApi.getToday(),
  });
}
