import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAccountBalance, useAccountTransactions, useMyAccounts } from './accounts.hooks';
import { TypeBadge, StatusBadge } from './components/TransactionBadge';
import { AccountCardSkeleton, TransactionsTableSkeleton } from './components/AccountSkeleton';
import { AccountStatusBadge } from './components/AccountStatusBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import type { TransactionType } from './accounts.types';

export function AccountPage() {
    const { accountNumber } = useParams<{ accountNumber: string }>();
    const [type, setType] = useState<TransactionType>('ALL');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const balance = useAccountBalance(accountNumber);
    const transactions = useAccountTransactions(accountNumber, {
        type,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
    });
    const myAccounts = useMyAccounts();

    const status = myAccounts.data?.find((a) => a.accountNumber === accountNumber)?.status;

    return (
        <div className="min-h-screen bg-slate-100 p-4 md:p-8">
            <div className="max-w-4xl mx-auto flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <Link
                        to={`/transfers/new?from=${accountNumber}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                    >
                        Transferir desde esta cuenta
                    </Link>
                </div>

                {/* Card de saldo (una sola vez) */}
                {balance.isLoading && <AccountCardSkeleton />}
                {balance.isError && <p className="text-red-600">Error al cargar saldo</p>}
                {balance.data && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h1 className="text-sm text-slate-500 mb-1">Cuenta</h1>
                                <p className="text-xl font-mono text-slate-800">{accountNumber}</p>
                            </div>
                            {status && <AccountStatusBadge status={status} />}
                        </div>
                        <p className="text-sm text-slate-500 mb-1">Saldo disponible</p>
                        <p className="text-3xl font-bold text-slate-900">
                            ${balance.data.balance.toFixed(2)}
                        </p>
                        <p className="text-xs text-slate-400 mt-2">
                            Actualizado: {new Date(balance.data.updatedAt).toLocaleString()}
                        </p>
                    </div>
                )}

                {/* Filtros */}
                <div className="bg-white p-4 rounded-lg shadow-md flex flex-wrap gap-3 items-end">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-slate-600">Tipo</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value as TransactionType)}
                            className="border border-slate-300 rounded px-3 py-2 text-sm"
                        >
                            <option value="ALL">Todos</option>
                            <option value="TRANSFER">Transferencias</option>
                            <option value="DEPOSIT">Depósitos</option>
                            <option value="WITHDRAWAL">Retiros</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-slate-600">Desde</label>
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="border border-slate-300 rounded px-3 py-2 text-sm"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-slate-600">Hasta</label>
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="border border-slate-300 rounded px-3 py-2 text-sm"
                        />
                    </div>
                    {(type !== 'ALL' || fromDate || toDate) && (
                        <button
                            onClick={() => { setType('ALL'); setFromDate(''); setToDate(''); }}
                            className="text-sm text-slate-500 hover:text-slate-800"
                        >
                            Limpiar
                        </button>
                    )}
                </div>

                {/* Transacciones */}
                {transactions.isLoading && <TransactionsTableSkeleton />}
                {transactions.isError && <p className="text-red-600">Error al cargar transacciones</p>}

                {transactions.data && transactions.data.length === 0 && (
                    <div className="bg-white rounded-lg shadow-md">
                        <EmptyState
                            title="No hay transacciones"
                            description="Las operaciones aparecerán aquí."
                        />
                    </div>
                )}

                {transactions.data && transactions.data.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <h2 className="px-4 py-3 bg-slate-50 font-medium text-slate-700">Historial</h2>

                        {/* Desktop: tabla */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 text-left">
                                    <tr>
                                        <th className="px-4 py-2">Fecha</th>
                                        <th className="px-4 py-2">Tipo</th>
                                        <th className="px-4 py-2">Contraparte</th>
                                        <th className="px-4 py-2">Monto</th>
                                        <th className="px-4 py-2">Estado</th>
                                        <th className="px-4 py-2">Ref</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.data.map((t) => (
                                        <tr key={t.id} className="border-t border-slate-100">
                                            <td className="px-4 py-2 text-xs text-slate-500">
                                                {new Date(t.date).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-2"><TypeBadge type={t.type} /></td>
                                            <td className="px-4 py-2 text-xs">{t.counterparty ?? '—'}</td>
                                            <td className={`px-4 py-2 font-medium ${t.direction === 'DEBIT' ? 'text-red-600' : 'text-green-600'}`}>
                                                {t.direction === 'DEBIT' ? '-' : '+'}${t.amount.toFixed(2)}
                                            </td>
                                            <td className="px-4 py-2"><StatusBadge status={t.status} /></td>
                                            <td className="px-4 py-2 text-xs text-slate-500">{t.reference ?? '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Móvil: cards */}
                        <div className="md:hidden p-3 space-y-2 bg-slate-50">
                            {transactions.data.map((t) => (
                                <div key={t.id} className="bg-white p-3 rounded-lg shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <TypeBadge type={t.type} />
                                        <span className={`font-medium ${t.direction === 'DEBIT' ? 'text-red-600' : 'text-green-600'}`}>
                                            {t.direction === 'DEBIT' ? '-' : '+'}${t.amount.toFixed(2)}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 mb-1">{t.counterparty ?? '—'}</p>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-400">{new Date(t.date).toLocaleDateString()}</span>
                                        <StatusBadge status={t.status} />
                                    </div>
                                    {t.reference && (
                                        <p className="text-xs text-slate-400 mt-1">Ref: {t.reference}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}