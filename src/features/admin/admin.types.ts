export type UserRole = 'USER' | 'ADMIN';
export type AccountStatus = 'ACTIVE' | 'FROZEN' | 'CLOSED';
export type TransferStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export type AdminUser = {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    isActive: boolean;
    createdAt: string;
    accounts: Array<{ accountNumber: string; balance: number }>;
};

export type AdminAccount = {
    accountNumber: string;
    balance: number;
    status: AccountStatus;
    owner: { email: string; name: string };
    updatedAt: string;
};

export type AdminTransfer = {
    id: string;
    fromAccount: string;
    toAccount: string;
    amount: number;
    status: TransferStatus;
    reference: string | null;
    createdAt: string;
    completedAt: string | null;
};

export type CreateAccountPayload = {
    userEmail: string;
    accountNumber: string;
    initialBalance?: number;
};

export type UpdateUserPayload = {
    name?: string;
    password?: string;
    role?: UserRole;
    isActive?: boolean;
};