import { useAuth } from '../../features/auth/AuthContext';

export function Header() {
    const { user, logout } = useAuth();

    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
            <div>
                <h2 className="text-lg font-semibold text-slate-800">
                    Bienvenido, {user?.name ?? user?.email}
                </h2>
            </div>

            <div className="flex items-center gap-4">
                <div className="text-sm text-slate-500 hidden md:block">
                    Última conexión: {new Date().toLocaleDateString()}
                </div>
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600">
                    {user?.email.charAt(0).toUpperCase()}
                </div>
                <button
                    onClick={logout}
                    className="text-sm font-medium text-red-600 hover:text-red-700 hover:underline"
                >
                    Cerrar Sesión
                </button>
            </div>
        </header>
    );
}