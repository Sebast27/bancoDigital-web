export type CreateWithdrawalPayload = {
    accountNumber: string;
    amount: number;
    reference?: string;
};

export type CreateWithdrawalResponse = {
    withdrawalId: string;
    status: string;
    accountNumber: string;
    amount: number;
};

export type WithdrawalStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export type WithdrawalStatusResponse = {
    id: string;
    accountId: string;
    amount: number;
    status: WithdrawalStatus;
    reference: string | null;
    createdAt: string;
    completedAt: string | null;
};