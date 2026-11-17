import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
    approveDeposit,
    createDeposit,
    getDepositStatus,
    getPendingDeposits,
} from './deposits.api';
import type { CreateDepositPayload } from './deposits.types';

export function useCreateDeposit() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (p: CreateDepositPayload) => createDeposit(p),
        onSuccess: (d) => {
            toast.info(`Depósito ${d.depositId.slice(0, 8)}… pendiente de aprobación`);
            qc.invalidateQueries({ queryKey: ['deposits'] });
        },
        onError: (e) => toast.error(e instanceof Error ? e.message : 'Error'),
    });
}

export function useDepositStatus(id: string | undefined) {
    return useQuery({
        queryKey: ['deposits', id],
        queryFn: () => getDepositStatus(id!),
        enabled: !!id,
        refetchInterval: (q) => {
            const status = q.state.data?.status;
            return status === 'PENDING' ? 3000 : false;
        },
    });
}

export function usePendingDeposits() {
    return useQuery({
        queryKey: ['deposits', 'pending'],
        queryFn: getPendingDeposits,
        refetchInterval: 5000,
    });
}

export function useApproveDeposit() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => approveDeposit(id),
        onSuccess: () => {
            toast.success('Depósito aprobado');
            qc.invalidateQueries({ queryKey: ['deposits', 'pending'] });
            qc.invalidateQueries({ queryKey: ['accounts'] });
        },
        onError: (e) => toast.error(e instanceof Error ? e.message : 'Error'),
    });
}