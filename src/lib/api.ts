const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
    throw new Error('Falta VITE_API_URL en el .env. Copia .env.example a .env y reinicia.');
}

export function authHeaders(): HeadersInit {
    const token = localStorage.getItem('accessToken');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, {
        ...init,
        headers: {
            ...authHeaders(),
            ...(init.headers ?? {}),
        },
    });

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const message =
            typeof body === 'object' && body && 'message' in body
                ? String((body as { message: unknown }).message)
                : `Error ${res.status}`;
        throw new Error(message);
    }

    if (res.status === 204) return undefined as T;

    return res.json();
}