
import { apiFetch } from '../../lib/api';

import type {
    AccountBalance,
    MyAccount,
    TransactionFilters,
    TransactionHistoryItem,
} from './accounts.types';

export async function getMyAccounts(): Promise<MyAccount[]> {
    return apiFetch<MyAccount[]>('/accounts');
}

export async function getAccountBalance(accountNumber: string): Promise<AccountBalance> {
    return apiFetch<AccountBalance>(`/accounts/${accountNumber}`);
}

export async function getAccountTransactions(
    accountNumber: string,
    filters: TransactionFilters = {},
): Promise<TransactionHistoryItem[]> {
    const params = new URLSearchParams();
    if (filters.type && filters.type !== 'ALL') params.set('type', filters.type);
    if (filters.fromDate) params.set('fromDate', filters.fromDate);
    if (filters.toDate) params.set('toDate', filters.toDate);
    const qs = params.toString();
    return apiFetch<TransactionHistoryItem[]>(
        `/accounts/${accountNumber}/transactions${qs ? `?${qs}` : ''}`,
    );
}