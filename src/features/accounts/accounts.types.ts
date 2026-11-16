export type AccountStatus = 'ACTIVE' | 'FROZEN' | 'CLOSED';

export type MyAccount = {
    accountNumber: string;
    balance: number;
    status: AccountStatus;
    updatedAt: string;
};

export type AccountBalance = {
    accountNumber: string;
    balance: number;
    updatedAt: string;
};

export type TransactionType = 'ALL' | 'TRANSFER' | 'DEPOSIT' | 'WITHDRAWAL';

export type TransactionHistoryItem = {
    id: string;
    type: 'TRANSFER' | 'DEPOSIT' | 'WITHDRAWAL';
    amount: number;
    direction: 'DEBIT' | 'CREDIT';
    status: string;
    reference: string | null;
    date: string;
    counterparty?: string;
};

export type TransactionFilters = {
    type?: TransactionType;
    fromDate?: string;
    toDate?: string;
};