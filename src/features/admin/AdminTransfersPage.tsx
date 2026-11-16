import { useEffect, useState } from 'react';
import { getTransfers } from './admin.api';
import type { AdminTransfer } from './admin.types';

const statusColor: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    COMPLETED: 'bg-green-100 text-green-700',
    FAILED: 'bg-red-100 text-red-700',
};

export function AdminTransfersPage() {
    const [transfers, setTransfers] = useState<AdminTransfer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                setTransfers(await getTransfers());
            } catch (e) {
                setError(e instanceof Error ? e.message : 'Error');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return <p className="text-slate-500">Cargando transferencias...</p>;
    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Transferencias</h1>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-left">
                        <tr>
                            <th className="px-4 py-3">ID</th>
                            <th className="px-4 py-3">Desde</th>
                            <th className="px-4 py-3">Hacia</th>
                            <th className="px-4 py-3">Monto</th>
                            <th className="px-4 py-3">Estado</th>
                            <th className="px-4 py-3">Referencia</th>
                            <th className="px-4 py-3">Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transfers.map((t) => (
                            <tr key={t.id} className="border-t border-slate-100">
                                <td className="px-4 py-3 font-mono text-xs">{t.id.slice(0, 8)}…</td>
                                <td className="px-4 py-3 font-mono">{t.fromAccount}</td>
                                <td className="px-4 py-3 font-mono">{t.toAccount}</td>
                                <td className="px-4 py-3">${t.amount.toFixed(2)}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor[t.status] ?? 'bg-slate-100 text-slate-700'}`}>
                                        {t.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-xs">{t.reference ?? '—'}</td>
                                <td className="px-4 py-3 text-xs text-slate-500">
                                    {new Date(t.createdAt).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}