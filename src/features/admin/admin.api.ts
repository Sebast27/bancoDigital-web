import type {
    AccountStatus,
    AdminAccount,
    AdminTransfer,
    AdminUser,
    CreateAccountPayload,
    UpdateUserPayload,
} from './admin.types';

const API_URL = import.meta.env.VITE_API_URL;

function authHeaders(): HeadersInit {
    const token = localStorage.getItem('accessToken');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

async function handle<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Error ${res.status}`);
    }
    return res.json();
}

export async function getUsers(): Promise<AdminUser[]> {
    const res = await fetch(`${API_URL}/admin/users`, { headers: authHeaders() });
    return handle<AdminUser[]>(res);
}

export async function getAccounts(): Promise<AdminAccount[]> {
    const res = await fetch(`${API_URL}/admin/accounts`, { headers: authHeaders() });
    return handle<AdminAccount[]>(res);
}

export async function getTransfers(): Promise<AdminTransfer[]> {
    const res = await fetch(`${API_URL}/admin/transfers`, { headers: authHeaders() });
    return handle<AdminTransfer[]>(res);
}

export async function updateUser(id: string, data: UpdateUserPayload): Promise<AdminUser> {
    const res = await fetch(`${API_URL}/admin/users/${id}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return handle<AdminUser>(res);
}

export async function updateAccountStatus(
    accountNumber: string,
    status: AccountStatus,
): Promise<AdminAccount> {
    const res = await fetch(`${API_URL}/admin/accounts/${accountNumber}/status`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ status }),
    });
    return handle<AdminAccount>(res);
}

export async function createAccount(data: CreateAccountPayload): Promise<AdminAccount> {
    const res = await fetch(`${API_URL}/admin/accounts`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return handle<AdminAccount>(res);
}