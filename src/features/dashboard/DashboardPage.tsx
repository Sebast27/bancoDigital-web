import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Button } from '../auth/components/Button';
import { useMyAccounts } from '../accounts/accounts.hooks';

export function DashboardPage() {
    const { user, logout } = useAuth();
    const accounts = useMyAccounts();

    if (!user) return null;

    return (
        <div className="min-h-screen bg-slate-100 p-8">
            <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
                        <p className="text-slate-600">{user.name ?? user.email}</p>
                        <p className="text-sm text-slate-400">Rol: {user.role}</p>
                    </div>
                    <Button onClick={logout}>Cerrar sesión</Button>
                </div>

                {user.role === 'ADMIN' && (
                    <Link
                        to="/admin"
                        className="inline-block mb-4 text-blue-600 hover:underline text-sm font-medium"
                    >
                        Ir al panel de administración →
                    </Link>
                )}

                {user.role === 'USER' && (
                    <Link
                        to="/transfers/new"
                        className="inline-block mb-4 mr-4 text-blue-600 hover:underline text-sm font-medium"
                    >
                        + Nueva transferencia
                    </Link>

                ) && (
                        <Link to="/deposits/new" className="text-blue-600 hover:underline text-sm font-medium">
                            + Depósito
                        </Link>
                    ) && (
                        <Link to="/withdrawals/new" className="text-blue-600 hover:underline text-sm font-medium">
                            + Retiro
                        </Link>
                    ) && (
                        <Link to="/statements/new" className="text-blue-600 hover:underline text-sm font-medium">
                            + Estado de cuenta
                        </Link>
                    )}

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
                                        className="flex justify-between hover:bg-slate-50 px-2 py-1 rounded"
                                    >
                                        <span className="font-mono">{a.accountNumber}</span>
                                        <span>${a.balance.toFixed(2)}</span>
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