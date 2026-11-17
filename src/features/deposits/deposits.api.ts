import { apiFetch } from '../../lib/api';
import type {
    CreateDepositPayload,
    CreateDepositResponse,
    DepositStatusResponse,
    PendingDeposit,
} from './deposits.types';

export async function createDeposit(payload: CreateDepositPayload): Promise<CreateDepositResponse> {
    return apiFetch<CreateDepositResponse>('/deposits', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}

export async function getDepositStatus(id: string): Promise<DepositStatusResponse> {
    return apiFetch<DepositStatusResponse>(`/deposits/${id}`);
}

export async function getPendingDeposits(): Promise<PendingDeposit[]> {
    return apiFetch<PendingDeposit[]>('/deposits/admin/pending');
}

export async function approveDeposit(id: string): Promise<{ depositId: string; status: string }> {
    return apiFetch<{ depositId: string; status: string }>(`/deposits/${id}/approve`, {
        method: 'POST',
    });
}