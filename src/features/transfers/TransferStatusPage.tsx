import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useTransferStatus } from './transfers.hooks';

const statusStyles: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    COMPLETED: 'bg-green-100 text-green-700',
    FAILED: 'bg-red-100 text-red-700',
};

export function TransferStatusPage() {
    const { id } = useParams<{ id: string }>();
    const q = useTransferStatus(id);

    useEffect(() => {
        if (q.data?.status === 'COMPLETED') toast.success('Transferencia completada');
        if (q.data?.status === 'FAILED') toast.error('Transferencia fallida');
    }, [q.data?.status]);

    return (
        <div className="min-h-screen bg-slate-100 p-8">
            <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-slate-800 mb-4">Estado de transferencia</h1>

                {q.isLoading && <p className="text-slate-500">Consultando...</p>}
                {q.isError && <p className="text-red-600">Error al consultar estado</p>}

                {q.data && (
                    <dl className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <dt className="text-slate-500">ID</dt>
                            <dd className="font-mono text-xs">{q.data.id.slice(0, 12)}…</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-slate-500">Desde</dt>
                            <dd className="font-mono">{q.data.fromAccount}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-slate-500">Hacia</dt>
                            <dd className="font-mono">{q.data.toAccount}</dd>
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
                                    {q.data.status}
                                </span>
                            </dd>
                        </div>
                        {q.data.reference && (
                            <div className="flex justify-between">
                                <dt className="text-slate-500">Referencia</dt>
                                <dd>{q.data.reference}</dd>
                            </div>
                        )}
                    </dl>
                )}

                <div className="mt-6 flex gap-3">
                    <Link to="/transfers/new" className="text-blue-600 hover:underline text-sm">
                        Nueva transferencia
                    </Link>
                </div>
            </div>
        </div>
    );
}