import { useState } from 'react';
import { useAdminDeposits } from './admin.hooks';
import { usePendingDeposits, useApproveDeposit } from '../deposits/deposits.hooks';

const statusStyles: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    APPROVED: 'bg-blue-100 text-blue-700',
    COMPLETED: 'bg-green-100 text-green-700',
    FAILED: 'bg-red-100 text-red-700',
};

type Tab = 'all' | 'pending';

export function AdminDepositsPage() {
    const [tab, setTab] = useState<Tab>('all');

    const all = useAdminDeposits();
    const pending = usePendingDeposits();
    const approve = useApproveDeposit();

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-slate-800">Depósitos</h1>
                <span className="text-sm text-slate-500">
                    {pending.data && pending.data.length > 0 && (
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-medium">
                            {pending.data.length} pendiente{pending.data.length !== 1 ? 's' : ''}
                        </span>
                    )}
                </span>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 mb-4">
                <button
                    onClick={() => setTab('all')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition ${tab === 'all'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                >
                    Todos
                </button>
                <button
                    onClick={() => setTab('pending')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition flex items-center gap-2 ${tab === 'pending'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                >
                    Pendientes
                    {pending.data && pending.data.length > 0 && (
                        <span className="bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded text-xs">
                            {pending.data.length}
                        </span>
                    )}
                </button>
            </div>

            {tab === 'all' && <AllDepositsTable q={all} />}
            {tab === 'pending' && <PendingDepositsTable q={pending} approve={approve} />}
        </div>
    );
}

function AllDepositsTable({ q }: { q: ReturnType<typeof useAdminDeposits> }) {
    if (q.isLoading) return <p className="text-slate-500">Cargando...</p>;
    if (q.isError) return <p className="text-red-600">Error al cargar depósitos</p>;
    if (!q.data || q.data.length === 0) {
        return <p className="text-slate-500">No hay depósitos registrados</p>;
    }

    return (
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
                    {q.data.map((d) => (
                        <tr key={d.id} className="border-t border-slate-100">
                            <td className="px-4 py-3 font-mono text-xs">{d.id.slice(0, 8)}…</td>
                            <td className="px-4 py-3 font-mono">{d.accountNumber}</td>
                            <td className="px-4 py-3">${d.amount.toFixed(2)}</td>
                            <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${statusStyles[d.status] ?? 'bg-slate-100 text-slate-700'}`}>
                                    {d.status}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-xs">{d.reference ?? '—'}</td>
                            <td className="px-4 py-3 text-xs text-slate-500">
                                {new Date(d.createdAt).toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-xs text-slate-500">
                                {d.completedAt ? new Date(d.completedAt).toLocaleString() : '—'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function PendingDepositsTable({
    q,
    approve,
}: {
    q: ReturnType<typeof usePendingDeposits>;
    approve: ReturnType<typeof useApproveDeposit>;
}) {
    if (q.isLoading) return <p className="text-slate-500">Cargando...</p>;
    if (q.isError) return <p className="text-red-600">Error al cargar pendientes</p>;
    if (!q.data || q.data.length === 0) {
        return <p className="text-slate-500">No hay depósitos pendientes 🎉</p>;
    }

    return (
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
                                    className="bg-green-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-green-700 disabled:opacity-50"
                                >
                                    Aprobar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}