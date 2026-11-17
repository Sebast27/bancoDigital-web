import { apiFetch } from '../../lib/api';
import type {
    CreateWithdrawalPayload,
    CreateWithdrawalResponse,
    WithdrawalStatusResponse,
} from './withdrawals.types';

export async function createWithdrawal(
    p: CreateWithdrawalPayload,
): Promise<CreateWithdrawalResponse> {
    return apiFetch<CreateWithdrawalResponse>('/withdrawals', {
        method: 'POST',
        body: JSON.stringify(p),
    });
}

export async function getWithdrawalStatus(id: string): Promise<WithdrawalStatusResponse> {
    return apiFetch<WithdrawalStatusResponse>(`/withdrawals/${id}`);
}