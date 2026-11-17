import { Link, useParams } from 'react-router-dom';
import { useStatementStatus, useDownloadStatement } from './statements.hooks';

const statusStyles: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    COMPLETED: 'bg-green-100 text-green-700',
    FAILED: 'bg-red-100 text-red-700',
};

export function StatementStatusPage() {
    const { id } = useParams<{ id: string }>();
    const q = useStatementStatus(id);
    const download = useDownloadStatement();

    return (
        <div className="min-h-screen bg-slate-100 p-8">
            <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-slate-800 mb-4">Estado de cuenta</h1>

                {q.isLoading && <p className="text-slate-500">Consultando...</p>}
                {q.isError && <p className="text-red-600">Error al consultar estado</p>}

                {q.data && (
                    <dl className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <dt className="text-slate-500">Cuenta</dt>
                            <dd className="font-mono">{q.data.accountNumber}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-slate-500">Período</dt>
                            <dd className="text-xs">
                                {new Date(q.data.periodStart).toLocaleDateString()} —{' '}
                                {new Date(q.data.periodEnd).toLocaleDateString()}
                            </dd>
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
                        {q.data.error && (
                            <div className="bg-red-50 border border-red-200 rounded p-2 text-red-700 text-xs">
                                {q.data.error}
                            </div>
                        )}
                        <div className="flex justify-between">
                            <dt className="text-slate-500">Creado</dt>
                            <dd className="text-xs">{new Date(q.data.createdAt).toLocaleString()}</dd>
                        </div>
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
                        Generando PDF... La página se actualizará automáticamente.
                    </p>
                )}

                {q.data?.status === 'COMPLETED' && (
                    <button
                        onClick={() => download.mutate(q.data!.id)}
                        disabled={download.isPending}
                        className="mt-4 w-full bg-green-600 text-white py-2 rounded-md font-medium hover:bg-green-700 disabled:opacity-50"
                    >
                        {download.isPending ? 'Descargando...' : '⬇ Descargar PDF'}
                    </button>
                )}

                <div className="mt-6 flex gap-3">
                    <Link to="/dashboard" className="text-blue-600 hover:underline text-sm">
                        ← Volver al dashboard
                    </Link>
                    <Link to="/statements/new" className="text-blue-600 hover:underline text-sm">
                        Nuevo estado
                    </Link>
                </div>
            </div>
        </div>
    );
}