import { useAdminWithdrawals } from './admin.hooks';

const statusStyles: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    COMPLETED: 'bg-green-100 text-green-700',
    FAILED: 'bg-red-100 text-red-700',
};

export function AdminWithdrawalsPage() {
    const q = useAdminWithdrawals();

    if (q.isLoading) return <p className="text-slate-500">Cargando...</p>;
    if (q.isError) return <p className="text-red-600">Error al cargar retiros</p>;

    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Retiros</h1>
            {q.data && q.data.length === 0 && <p className="text-slate-500">No hay retiros registrados</p>}
            {q.data && q.data.length > 0 && (
                <div className="bg-white rounded-lg shadow overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-left">
                            <tr>
                                <th className="px-4 py-3">ID</th>
                                <th className="px-4 py-3">Cuenta</th>
                                <th className="px-4 py-3">Monto</th>
                                <th className="px-4 py-3">Estado</th>
                                <th className="px-4 py-3">Ref</th>
                                <th className="px-4 py-3">Fecha</th>
                                <th className="px-4 py-3">Completado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {q.data.map((w) => (
                                <tr key={w.id} className="border-t border-slate-100">
                                    <td className="px-4 py-3 font-mono text-xs">{w.id.slice(0, 8)}…</td>
                                    <td className="px-4 py-3 font-mono">{w.accountNumber}</td>
                                    <td className="px-4 py-3">${w.amount.toFixed(2)}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${statusStyles[w.status] ?? 'bg-slate-100 text-slate-700'}`}>
                                            {w.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-xs">{w.reference ?? '—'}</td>
                                    <td className="px-4 py-3 text-xs text-slate-500">{new Date(w.createdAt).toLocaleString()}</td>
                                    <td className="px-4 py-3 text-xs text-slate-500">
                                        {w.completedAt ? new Date(w.completedAt).toLocaleString() : '—'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}