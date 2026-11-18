import { Link, useParams } from 'react-router-dom';
import { useDepositStatus } from './deposits.hooks';

const statusStyles: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    APPROVED: 'bg-blue-100 text-blue-700',
    COMPLETED: 'bg-green-100 text-green-700',
    FAILED: 'bg-red-100 text-red-700',
};

const statusLabels: Record<string, string> = {
    PENDING: 'Pendiente de aprobación',
    APPROVED: 'Aprobado, procesando',
    COMPLETED: 'Completado',
    FAILED: 'Fallido',
};

export function DepositStatusPage() {
    const { id } = useParams<{ id: string }>();
    const q = useDepositStatus(id);

    return (
        <div className="min-h-screen bg-slate-100 p-8">
            <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-slate-800 mb-4">Estado del depósito</h1>

                {q.isLoading && <p className="text-slate-500">Consultando...</p>}
                {q.isError && <p className="text-red-600">Error al consultar estado</p>}

                {q.data && (
                    <dl className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <dt className="text-slate-500">ID</dt>
                            <dd className="font-mono text-xs">{q.data.id.slice(0, 12)}…</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-slate-500">Monto</dt>
                            <dd className="font-medium">${q.data.amount.toFixed(2)}</dd>
                        </div>
                        <div className="flex justify-between items-center">
                            <dt className="text-slate-500">Estado</dt>
                            <dd>
                                <span
                                    className={`px-2 py-1 rounded text-xs font-medium ${statusStyles[q.data.status] ?? 'bg-slate-100 text-slate-700'
                                        }`}
                                >
                                    {statusLabels[q.data.status] ?? q.data.status}
                                </span>
                            </dd>
                        </div>
                        {q.data.reference && (
                            <div className="flex justify-between">
                                <dt className="text-slate-500">Referencia</dt>
                                <dd>{q.data.reference}</dd>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <dt className="text-slate-500">Creado</dt>
                            <dd className="text-xs">{new Date(q.data.createdAt).toLocaleString()}</dd>
                        </div>
                        {q.data.approvedAt && (
                            <div className="flex justify-between">
                                <dt className="text-slate-500">Aprobado</dt>
                                <dd className="text-xs">{new Date(q.data.approvedAt).toLocaleString()}</dd>
                            </div>
                        )}
                        {q.data.completedAt && (
                            <div className="flex justify-between">
                                <dt className="text-slate-500">Completado</dt>
                                <dd className="text-xs">{new Date(q.data.completedAt).toLocaleString()}</dd>
                            </div>
                        )}
                    </dl>
                )}

                {q.data?.status === 'PENDING' && (
                    <p className="mt-4 text-sm text-slate-500 bg-yellow-50 border border-yellow-200 rounded p-3">
                        Un administrador debe aprobar este depósito. La página se actualizará automáticamente.
                    </p>
                )}

                <div className="mt-6 flex gap-3">
                    <Link to="/deposits/new" className="text-blue-600 hover:underline text-sm">
                        Nuevo depósito
                    </Link>
                </div>
            </div>
        </div>
    );
}