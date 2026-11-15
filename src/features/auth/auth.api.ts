const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
    throw new Error(
        'Falta VITE_API_URL en el .env. Copia .env.example a .env y reinicia el servidor.'
    );
}

console.log('API_URL cargada:', API_URL);

export type LoginResponse = {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        role: string;
    };
};

export async function login(email: string, password: string): Promise<LoginResponse> {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const message = body.message || `Error ${res.status}`;
        throw new Error(message);
    }

    return res.json();
}