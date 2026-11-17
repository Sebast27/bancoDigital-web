import { apiFetch } from '../../lib/api';
import type {
    CreateTransferPayload,
    CreateTransferResponse,
    TransferStatusResponse,
} from './transfers.types';

export async function createTransfer(
    payload: CreateTransferPayload,
): Promise<CreateTransferResponse> {
    return apiFetch<CreateTransferResponse>('/transfers', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}

export async function getTransferStatus(id: string): Promise<TransferStatusResponse> {
    return apiFetch<TransferStatusResponse>(`/transfers/${id}`);
}