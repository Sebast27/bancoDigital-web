import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Button } from '../auth/components/Button';

export function DashboardPage() {
    const { user, logout } = useAuth();

    if (!user) return null; // nunca debería pasar (ProtectedRoute lo previene)

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

                <div className="border-t border-slate-200 pt-4">
                    <p className="text-slate-500">Aquí irán las transferencias, depósitos, etc.</p>
                </div>
            </div>
        </div>
    );
}