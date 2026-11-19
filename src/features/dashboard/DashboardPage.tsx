import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useMyAccounts } from '../accounts/accounts.hooks';
import { AccountStatusBadge } from '../accounts/components/AccountStatusBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import { AccountsListSkeleton } from '../accounts/components/AccountSkeleton';
import { usePendingDeposits } from '../deposits/deposits.hooks';

export function DashboardPage() {
    const { user } = useAuth();
    const accounts = useMyAccounts();

    // Hooks de admin (se ejecutan siempre, pero solo usamos los datos si es admin)
    const pendingDeposits = usePendingDeposits();

    if (!user) return null;

    // ==========================================
    // VISTA DE ADMINISTRADOR (AUDITOR)
    // ==========================================
    if (user.role === 'ADMIN') {
        return (
            <div className="space-y-6 max-w-5xl mx-auto">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Panel de Control</h1>
                    <p className="text-slate-500 text-sm mt-1">Resumen operativo y tareas pendientes</p>
                </div>

                {/* Tarjetas de Métricas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <p className="text-sm font-medium text-slate-500 mb-1">Depósitos por Aprobar</p>
                        <p className="text-3xl font-bold text-yellow-600">
                            {pendingDeposits.data?.length ?? 0}
                        </p>
                        <Link to="/admin/deposits" className="text-sm text-yellow-600 hover:underline mt-2 inline-block">
                            Revisar depósitos →
                        </Link>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <p className="text-sm font-medium text-slate-500 mb-1">Estado del Sistema</p>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
                            <p className="text-lg font-semibold text-slate-800">Operativo</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <p className="text-sm font-medium text-slate-500 mb-1">Tu Rol</p>
                        <p className="text-lg font-semibold text-purple-600">Auditor / Administrador</p>
                    </div>
                </div>

                {/* Accesos directos de gestión */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
                        <h2 className="font-semibold text-slate-800">Acciones de Gestión</h2>
                    </div>
                    <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link to="/admin/users" className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50 transition-all text-purple-700 gap-2">
                            <span className="text-2xl">👥</span>
                            <span className="text-sm font-medium">Usuarios</span>
                        </Link>
                        <Link to="/admin/accounts" className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-blue-700 gap-2">
                            <span className="text-2xl">💳</span>
                            <span className="text-sm font-medium">Cuentas</span>
                        </Link>
                        <Link to="/admin/transfers" className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all text-slate-700 gap-2">
                            <span className="text-2xl">🔍</span>
                            <span className="text-sm font-medium">Auditoría</span>
                        </Link>
                        <Link to="/admin/withdrawals" className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 hover:border-orange-400 hover:bg-orange-50 transition-all text-orange-700 gap-2">
                            <span className="text-2xl">📊</span>
                            <span className="text-sm font-medium">Retiros</span>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // ==========================================
    // VISTA DE USUARIO NORMAL
    // ==========================================
    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Posición Global</h1>
                <p className="text-slate-500 text-sm mt-1">Resumen de tus productos financieros</p>
            </div>

            <div>
                <h2 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">Acciones Rápidas</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link to="/transfers/new" className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all text-blue-600 gap-2">
                        <span className="text-2xl">💸</span>
                        <span className="text-sm font-medium">Transferir</span>
                    </Link>
                    <Link to="/deposits/new" className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all text-emerald-600 gap-2">
                        <span className="text-2xl">💰</span>
                        <span className="text-sm font-medium">Depositar</span>
                    </Link>
                    <Link to="/withdrawals/new" className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-slate-200 hover:border-orange-400 hover:shadow-md transition-all text-orange-600 gap-2">
                        <span className="text-2xl">💵</span>
                        <span className="text-sm font-medium">Retirar</span>
                    </Link>
                    <Link to="/statements/new" className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all text-slate-600 gap-2">
                        <span className="text-2xl">📄</span>
                        <span className="text-sm font-medium">Estados</span>
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
                    <h2 className="font-semibold text-slate-800">Mis Cuentas</h2>
                </div>
                <div className="p-6">
                    {accounts.isLoading && <AccountsListSkeleton />}
                    {accounts.isError && <p className="text-sm text-red-600">Error al cargar cuentas</p>}
                    {accounts.data && accounts.data.length === 0 && (
                        <EmptyState title="No tienes cuentas asignadas" description="Contacta al administrador." />
                    )}
                    {accounts.data && accounts.data.length > 0 && (
                        <div className="divide-y divide-slate-100">
                            {accounts.data.map((a) => (
                                <Link key={a.accountNumber} to={`/accounts/${a.accountNumber}`} className="flex flex-col sm:flex-row justify-between sm:items-center py-4 hover:bg-slate-50 px-4 -mx-4 transition-colors group">
                                    <div className="flex items-center gap-4 mb-2 sm:mb-0">
                                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">🏦</div>
                                        <div>
                                            <p className="font-mono font-medium text-slate-800 group-hover:text-blue-600 transition-colors">{a.accountNumber}</p>
                                            <div className="flex gap-2 items-center mt-1">
                                                <span className="text-xs text-slate-500">Cuenta de Ahorros</span>
                                                <AccountStatusBadge status={a.status} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-left sm:text-right">
                                        <p className="text-xs text-slate-500 mb-0.5">Saldo Disponible</p>
                                        <p className="text-lg font-bold text-slate-800">${a.balance.toFixed(2)}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}