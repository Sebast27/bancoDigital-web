export type TransferStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export type CreateTransferPayload = {
    fromAccount: string;
    toAccount: string;
    amount: number;
    reference?: string;
};

export type CreateTransferResponse = {
    message: string;
    transactionId: string;
    status: string;
};

export type TransferStatusResponse = {
    id: string;
    fromAccount: string;
    toAccount: string;
    amount: number;
    status: TransferStatus;
    reference: string | null;
    createdAt: string;
    completedAt: string | null;
};