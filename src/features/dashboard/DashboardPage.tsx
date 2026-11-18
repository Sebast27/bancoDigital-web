import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Button } from '../auth/components/Button';
import { useMyAccounts } from '../accounts/accounts.hooks';
import { getAccountStatusLabel } from '../accounts/accounts.utils';

export function DashboardPage() {
    const { user, logout } = useAuth();
    const accounts = useMyAccounts();

    if (!user) return null;

    return (
        <div className="min-h-screen bg-slate-100 p-8">
            <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
                        <p className="text-slate-600">{user.name ?? user.email}</p>
                        <p className="text-sm text-slate-400">Rol: {user.role}</p>
                    </div>
                    <Button onClick={logout}>Cerrar sesión</Button>
                </div>

                {/* Acciones por rol */}
                {user.role === 'ADMIN' ? (
                    <div className="mb-6">
                        <h2 className="text-sm font-medium text-slate-700 mb-2">Administración</h2>
                        <Link
                            to="/admin"
                            className="inline-block bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700"
                        >
                            Panel de administración →
                        </Link>
                    </div>
                ) : (
                    <div className="mb-6">
                        <h2 className="text-sm font-medium text-slate-700 mb-2">Acciones rápidas</h2>
                        <div className="grid grid-cols-2 gap-2">
                            <Link
                                to="/transfers/new"
                                className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 text-center"
                            >
                                + Transferencia
                            </Link>
                            <Link
                                to="/deposits/new"
                                className="bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 text-center"
                            >
                                + Depósito
                            </Link>
                            <Link
                                to="/withdrawals/new"
                                className="bg-orange-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-orange-700 text-center"
                            >
                                + Retiro
                            </Link>
                            <Link
                                to="/statements/new"
                                className="bg-slate-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-700 text-center"
                            >
                                + Estado de cuenta
                            </Link>
                        </div>
                    </div>
                )}

                {/* Mis cuentas */}
                <div className="border-t border-slate-200 pt-4 mt-4">
                    <h2 className="text-sm font-medium text-slate-700 mb-2">Mis cuentas</h2>
                    {accounts.isLoading && <p className="text-sm text-slate-500">Cargando...</p>}
                    {accounts.isError && <p className="text-sm text-red-600">Error al cargar cuentas</p>}
                    {accounts.data && accounts.data.length === 0 && (
                        <p className="text-sm text-slate-500">No tienes cuentas asignadas</p>
                    )}
                    {accounts.data && accounts.data.length > 0 && (
                        <ul className="space-y-1 text-sm">
                            {accounts.data.map((a) => (
                                <li key={a.accountNumber}>
                                    <Link
                                        to={`/accounts/${a.accountNumber}`}
                                        className="flex justify-between items-center hover:bg-slate-50 px-2 py-2 rounded"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono">{a.accountNumber}</span>
                                            {a.status !== 'ACTIVE' && (
                                                <span className="px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-700">
                                                    {getAccountStatusLabel(a.status)}
                                                </span>
                                            )}
                                        </div>
                                        <span className="font-medium">${a.balance.toFixed(2)}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}