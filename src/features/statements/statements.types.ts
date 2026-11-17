export type CreateStatementPayload = {
    accountNumber: string;
    periodStart: string; // YYYY-MM-DD
    periodEnd: string;   // YYYY-MM-DD
};

export type CreateStatementResponse = {
    statementId: string;
    status: string;
    accountNumber: string;
};

export type StatementStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export type StatementStatusResponse = {
    id: string;
    accountNumber: string;
    periodStart: string;
    periodEnd: string;
    status: StatementStatus;
    filePath: string | null;
    error: string | null;
    createdAt: string;
    completedAt: string | null;
};