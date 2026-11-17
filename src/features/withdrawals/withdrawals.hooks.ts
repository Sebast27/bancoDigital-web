import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createWithdrawal, getWithdrawalStatus } from './withdrawals.api';
import type { CreateWithdrawalPayload } from './withdrawals.types';

export function useCreateWithdrawal() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (p: CreateWithdrawalPayload) => createWithdrawal(p),
        onSuccess: (d) => {
            toast.info(`Retiro ${d.withdrawalId.slice(0, 8)}… en proceso`);
            qc.invalidateQueries({ queryKey: ['accounts'] });
        },
        onError: (e) => toast.error(e instanceof Error ? e.message : 'Error'),
    });
}

export function useWithdrawalStatus(id: string | undefined) {
    return useQuery({
        queryKey: ['withdrawals', id],
        queryFn: () => getWithdrawalStatus(id!),
        enabled: !!id,
        refetchInterval: (q) => (q.state.data?.status === 'PENDING' ? 2000 : false),
    });
}