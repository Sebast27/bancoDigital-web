import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useStatementStatus, useDownloadStatement } from './statements.hooks';
import { getStatementPdfBlobUrl } from './statements.api';
import { Button } from '../auth/components/Button';

export function StatementStatusPage() {
    const { id } = useParams<{ id: string }>();
    const q = useStatementStatus(id);
    const download = useDownloadStatement();

    // Estados locales para la vista previa
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [loadingPreview, setLoadingPreview] = useState(false);
    const [previewError, setPreviewError] = useState<string | null>(null);

    // Limpiamos la memoria cuando el componente se desmonta
    useEffect(() => {
        return () => {
            if (pdfUrl) URL.revokeObjectURL(pdfUrl);
        };
    }, [pdfUrl]);

    const handlePreview = async () => {
        if (!q.data) return;
        setLoadingPreview(true);
        setPreviewError(null);
        try {
            const url = await getStatementPdfBlobUrl(q.data.id);
            setPdfUrl(url);
        } catch (err) {
            setPreviewError('No se pudo cargar la vista previa.');
        } finally {
            setLoadingPreview(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Estado de Cuenta</h1>
                    <p className="text-slate-500 text-sm mt-1">Detalle del documento solicitado</p>
                </div>
                <Link to="/statements/new" className="text-sm text-blue-600 hover:underline font-medium">
                    + Nuevo documento
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-700 font-medium text-sm">
                        <span className="text-xl">📄</span> Detalles del Documento
                    </div>
                    {q.data && (
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${q.data.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                                q.data.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                            }`}>
                            {q.data.status === 'PENDING' ? 'Generando...' : q.data.status}
                        </span>
                    )}
                </div>

                <div className="p-6 md:p-8">
                    {q.isLoading && <p className="text-slate-500">Cargando información...</p>}

                    {q.data && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Cuenta</p>
                                    <p className="font-mono text-slate-800 text-lg">{q.data.accountNumber}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Período</p>
                                    <p className="text-slate-800">
                                        {new Date(q.data.periodStart).toLocaleDateString()} al {new Date(q.data.periodEnd).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            {q.data.status === 'PENDING' && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3 text-yellow-800 text-sm items-center">
                                    <span className="animate-spin w-5 h-5 border-2 border-yellow-600 border-t-transparent rounded-full flex-shrink-0" />
                                    <p>Estamos generando tu PDF. Esta página se actualizará automáticamente cuando esté listo.</p>
                                </div>
                            )}

                            {q.data.status === 'FAILED' && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm">
                                    <p className="font-bold mb-1">Error al generar el documento</p>
                                    <p>{q.data.error || 'Intenta solicitarlo nuevamente.'}</p>
                                </div>
                            )}

                            {q.data.status === 'COMPLETED' && (
                                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 flex flex-col items-center justify-center text-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl">
                                        ✅
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-emerald-900">¡Tu documento está listo!</h3>
                                        <p className="text-emerald-700 text-sm">Puedes consultarlo aquí mismo o descargarlo en PDF.</p>
                                    </div>

                                    {/* Botones de acción */}
                                    <div className="flex gap-3 mt-2">
                                        <Button
                                            onClick={handlePreview}
                                            disabled={loadingPreview || !!pdfUrl}
                                            variant="secondary"
                                            className="w-auto"
                                        >
                                            {loadingPreview ? 'Cargando...' : pdfUrl ? 'Documento Abierto' : '👁 Ver en Pantalla'}
                                        </Button>

                                        <Button
                                            onClick={() => download.mutate(q.data!.id)}
                                            disabled={download.isPending}
                                            className="w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-8"
                                        >
                                            {download.isPending ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                                                    Descargando...
                                                </span>
                                            ) : '⬇ Descargar PDF'}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* ÁREA DE VISTA PREVIA (PDF IFRAME) */}
                            {previewError && (
                                <p className="text-sm text-red-600 text-center">{previewError}</p>
                            )}

                            {pdfUrl && (
                                <div className="mt-6 border border-slate-300 rounded-lg overflow-hidden bg-slate-100 shadow-inner">
                                    <div className="bg-slate-200 px-4 py-2 flex justify-between items-center text-xs font-semibold text-slate-600 border-b border-slate-300">
                                        <span>Vista Previa del Documento</span>
                                        <button onClick={() => setPdfUrl(null)} className="hover:text-red-600">✕ Cerrar</button>
                                    </div>
                                    <iframe
                                        src={pdfUrl}
                                        className="w-full h-[600px]"
                                        title="Vista previa del estado de cuenta"
                                    />
                                </div>
                            )}

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}