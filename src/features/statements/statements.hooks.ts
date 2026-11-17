import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
    createStatement,
    downloadStatement,
    getStatementStatus,
} from './statements.api';
import type { CreateStatementPayload } from './statements.types';

export function useCreateStatement() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (p: CreateStatementPayload) => createStatement(p),
        onSuccess: (d) => {
            toast.info(`Estado de cuenta ${d.statementId.slice(0, 8)}… en generación`);
            qc.invalidateQueries({ queryKey: ['statements'] });
        },
        onError: (e) => toast.error(e instanceof Error ? e.message : 'Error'),
    });
}

export function useStatementStatus(id: string | undefined) {
    return useQuery({
        queryKey: ['statements', id],
        queryFn: () => getStatementStatus(id!),
        enabled: !!id,
        refetchInterval: (q) => (q.state.data?.status === 'PENDING' ? 2000 : false),
    });
}

export function useDownloadStatement() {
    return useMutation({
        mutationFn: (id: string) => downloadStatement(id),
        onSuccess: () => toast.success('Descarga iniciada'),
        onError: (e) => toast.error(e instanceof Error ? e.message : 'Error al descargar'),
    });
}