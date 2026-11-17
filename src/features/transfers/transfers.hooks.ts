import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createTransfer, getTransferStatus } from './transfers.api';
import type { CreateTransferPayload } from './transfers.types';

export function useTransferStatus(id: string | undefined) {
    return useQuery({
        queryKey: ['transfers', id],
        queryFn: () => getTransferStatus(id!),
        enabled: !!id,
        refetchInterval: (query) => {
            const status = query.state.data?.status;
            return status === 'PENDING' ? 2000 : false;
        },
    });
}

export function useCreateTransfer() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateTransferPayload) => createTransfer(payload),
        onSuccess: (data) => {
            toast.info(`Transferencia ${data.transactionId.slice(0, 8)}… en proceso`);
            qc.invalidateQueries({ queryKey: ['accounts'] });
        },
        onError: (err) => {
            toast.error(err instanceof Error ? err.message : 'Error al transferir');
        },
    });
}