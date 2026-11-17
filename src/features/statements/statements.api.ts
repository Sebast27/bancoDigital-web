import { apiFetch, authHeaders } from '../../lib/api';
import type {
    CreateStatementPayload,
    CreateStatementResponse,
    StatementStatusResponse,
} from './statements.types';

export async function createStatement(
    p: CreateStatementPayload,
): Promise<CreateStatementResponse> {
    return apiFetch<CreateStatementResponse>('/statements', {
        method: 'POST',
        body: JSON.stringify(p),
    });
}

export async function getStatementStatus(id: string): Promise<StatementStatusResponse> {
    return apiFetch<StatementStatusResponse>(`/statements/${id}`);
}

export async function downloadStatement(id: string): Promise<void> {
    const API_URL = import.meta.env.VITE_API_URL;
    const res = await fetch(`${API_URL}/statements/${id}/download`, {
        headers: authHeaders(),
    });

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const message =
            typeof body === 'object' && body && 'message' in body
                ? String((body as { message: unknown }).message)
                : `Error ${res.status}`;
        throw new Error(message);
    }

    const blob = await res.blob();

    // Intentar leer el filename del header Content-Disposition
    const cd = res.headers.get('Content-Disposition') ?? '';
    const match = /filename="?([^"]+)"?/.exec(cd);
    const fileName = match?.[1] ?? `statement-${id}.pdf`;

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}