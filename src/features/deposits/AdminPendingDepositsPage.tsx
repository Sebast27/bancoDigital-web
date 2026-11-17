import { usePendingDeposits, useApproveDeposit } from './deposits.hooks';

export function AdminPendingDepositsPage() {
    const q = usePendingDeposits();
    const approve = useApproveDeposit();

    if (q.isLoading) return <p className="text-slate-500">Cargando...</p>;
    if (q.isError) return <p className="text-red-600">Error al cargar</p>;

    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Depósitos pendientes</h1>

            {q.data && q.data.length === 0 && (
                <p className="text-slate-500">No hay depósitos pendientes</p>
            )}

            {q.data && q.data.length > 0 && (
                <div className="bg-white rounded-lg shadow overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-left">
                            <tr>
                                <th className="px-4 py-3">ID</th>
                                <th className="px-4 py-3">Cuenta</th>
                                <th className="px-4 py-3">Monto</th>
                                <th className="px-4 py-3">Ref</th>
                                <th className="px-4 py-3">Solicitado por</th>
                                <th className="px-4 py-3">Fecha</th>
                                <th className="px-4 py-3">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {q.data.map((d) => (
                                <tr key={d.id} className="border-t border-slate-100">
                                    <td className="px-4 py-3 font-mono text-xs">{d.id.slice(0, 8)}…</td>
                                    <td className="px-4 py-3 font-mono">{d.accountNumber}</td>
                                    <td className="px-4 py-3">${d.amount.toFixed(2)}</td>
                                    <td className="px-4 py-3 text-xs">{d.reference ?? '—'}</td>
                                    <td className="px-4 py-3 text-xs font-mono">{d.requestedBy.slice(0, 8)}…</td>
                                    <td className="px-4 py-3 text-xs text-slate-500">
                                        {new Date(d.createdAt).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => approve.mutate(d.id)}
                                            disabled={approve.isPending}
                                            className="text-green-600 hover:underline text-xs font-medium disabled:opacity-50"
                                        >
                                            Aprobar
                                        </button>
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