import { useQuery } from '@tanstack/react-query';
import { getDeposits, getWithdrawals } from './admin.api';

export function useAdminDeposits() {
    return useQuery({
        queryKey: ['admin', 'deposits'],
        queryFn: getDeposits,
        refetchInterval: 5000,
    });
}

export function useAdminWithdrawals() {
    return useQuery({
        queryKey: ['admin', 'withdrawals'],
        queryFn: getWithdrawals,
        refetchInterval: 5000,
    });
}