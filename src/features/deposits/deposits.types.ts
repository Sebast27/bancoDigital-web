export type CreateDepositPayload = {
    accountNumber: string;
    amount: number;
    reference?: string;
};

export type CreateDepositResponse = {
    depositId: string;
    status: string;
    accountNumber: string;
    amount: number;
};

export type DepositStatus = 'PENDING' | 'APPROVED' | 'COMPLETED' | 'FAILED';

export type DepositStatusResponse = {
    id: string;
    accountId: string;
    amount: number;
    status: DepositStatus;
    requestedBy: string;
    approvedBy: string | null;
    reference: string | null;
    createdAt: string;
    approvedAt: string | null;
    completedAt: string | null;
};

export type PendingDeposit = {
    id: string;
    amount: number;
    accountNumber: string;
    requestedBy: string;
    reference: string | null;
    createdAt: string;
};