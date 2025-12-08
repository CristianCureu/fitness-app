import { inviteApi } from '@/lib/api/endpoints';
import { queryKeys } from '@/lib/api/query-keys';
import type { CreateInviteRequest } from '@/lib/types/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/**
 * Get invites
 */
export function useInvites() {
    return useQuery({
        queryKey: queryKeys.invites.all(),
        queryFn: () => inviteApi.getAll(),
    });
}

/**
 * Get Invite by Id
 */
export function useInvite(id: string) {
    return useQuery({
        queryKey: queryKeys.invites.detail(id),
        queryFn: () => inviteApi.getById(id),
    });
}

/**
 * Create Invite
 */
export function useCreateInvite() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateInviteRequest) => inviteApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.invites.all() });
        },
    });
}

/**
 * Create Invite
 */
export function useDeleteInvite(id: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => inviteApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.invites.all() });
        },
    });
}
