import { NavLink, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const links = [
    { to: '/admin/users', label: 'Usuarios' },
    { to: '/admin/accounts', label: 'Cuentas' },
    { to: '/admin/transfers', label: 'Transferencias' },
    { to: '/admin/deposits', label: 'Depósitos pendientes' },
];

export function AdminLayout() {
    const { logout } = useAuth();

    return (
        <div className="min-h-screen bg-slate-100 flex">
            <aside className="w-64 bg-white border-r border-slate-200 p-4 flex flex-col">
                <Link to="/dashboard" className="text-sm text-blue-600 hover:underline mb-4">
                    ← Volver al dashboard
                </Link>
                <h2 className="text-lg font-bold text-slate-800 mb-4">Admin</h2>
                <nav className="flex flex-col gap-1">
                    {links.map((l) => (
                        <NavLink
                            key={l.to}
                            to={l.to}
                            className={({ isActive }) =>
                                `px-3 py-2 rounded-md text-sm ${isActive ? 'bg-blue-100 text-blue-700 font-medium' : 'text-slate-700 hover:bg-slate-100'
                                }`
                            }
                        >
                            {l.label}
                        </NavLink>
                    ))}
                </nav>
                <button
                    onClick={logout}
                    className="mt-auto text-sm text-red-600 hover:underline text-left"
                >
                    Cerrar sesión
                </button>
            </aside>
            <main className="flex-1 p-8">
                <Outlet />
            </main>
        </div>
    );
}