import { useQuery } from '@tanstack/react-query';

import { getAccountBalance, getAccountTransactions, getMyAccounts } from './accounts.api';
import type { TransactionFilters } from './accounts.types';

export function useMyAccounts() {
    return useQuery({ queryKey: ['accounts', 'mine'], queryFn: getMyAccounts });
}

export function useAccountBalance(accountNumber: string | undefined) {
    return useQuery({
        queryKey: ['accounts', accountNumber, 'balance'],
        queryFn: () => getAccountBalance(accountNumber!),
        enabled: !!accountNumber,
    });
}

export function useAccountTransactions(
    accountNumber: string | undefined,
    filters: TransactionFilters = {},
) {
    return useQuery({
        queryKey: ['accounts', accountNumber, 'transactions', filters],
        queryFn: () => getAccountTransactions(accountNumber!, filters),
        enabled: !!accountNumber,
    });
}