import type { MyAccount } from './accounts.types';

export function isAccountOperable(account: MyAccount): boolean {
    return account.status === 'ACTIVE';
}

export function filterOperableAccounts(accounts: MyAccount[]): MyAccount[] {
    return accounts.filter(isAccountOperable);
}

export function findAccount(accounts: MyAccount[], accountNumber: string): MyAccount | undefined {
    return accounts.find((a) => a.accountNumber === accountNumber);
}

export function getAccountStatusLabel(status: string): string {
    switch (status) {
        case 'ACTIVE': return 'Activa';
        case 'FROZEN': return 'Congelada';
        case 'CLOSED': return 'Cerrada';
        default: return status;
    }
}