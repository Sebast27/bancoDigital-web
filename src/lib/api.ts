const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
    throw new Error('Falta VITE_API_URL en el .env. Copia .env.example a .env y reinicia.');
}

export class ApiError extends Error {
    status: number;
    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

export function authHeaders(isFormData = false): HeadersInit {
    const token = localStorage.getItem('accessToken');
    return {
        ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
    const isFormData = init.body instanceof FormData;

    const res = await fetch(`${API_URL}${path}`, {
        ...init,
        headers: {
            ...authHeaders(isFormData),
            ...(init.headers ?? {}),
        },
    });

    if (!res.ok) {
        // Si la sesión expiró (y no estamos ya en el endpoint de login)
        if (res.status === 401 && !path.includes('/auth/login')) {
            localStorage.removeItem('accessToken');
            window.location.href = '/login';
        }

        const body = await res.json().catch(() => ({}));
        const message =
            typeof body === 'object' && body && 'message' in body
                ? String((body as { message: unknown }).message)
                : `Error ${res.status}`;

        throw new ApiError(res.status, message);
    }

    if (res.status === 204) return undefined as T;

    return res.json();
}