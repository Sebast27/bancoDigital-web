import { NavLink } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';

export function Sidebar() {
    const { user } = useAuth();

    // Links para el usuario normal
    const userLinks = [
        { to: '/dashboard', label: 'Posición Global', icon: '🏦' },
        { to: '/transfers/new', label: 'Transferencias', icon: '💸' },
        { to: '/deposits/new', label: 'Depósitos', icon: '💰' },
        { to: '/withdrawals/new', label: 'Retiros', icon: '💵' },
        { to: '/statements/new', label: 'Estados de Cuenta', icon: '📄' },
    ];

    // Links para el administrador (Auditor / Operador)
    const adminLinks = [
        { to: '/dashboard', label: 'Panel de Control', icon: '📊' },
        { to: '/admin/users', label: 'Gestión de Usuarios', icon: '👥' },
        { to: '/admin/accounts', label: 'Cuentas Bancarias', icon: '💳' },
        { to: '/admin/deposits', label: 'Aprobar Depósitos', icon: '✅' },
        { to: '/admin/transfers', label: 'Auditoría Transf.', icon: '🔍' },
        { to: '/admin/withdrawals', label: 'Historial Retiros', icon: '📊' },
    ];

    const links = user?.role === 'ADMIN' ? adminLinks : userLinks;

    return (
        <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col">
            <div className="p-6 flex items-center gap-2 border-b border-slate-800">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-white">
                    B
                </div>
                <span className="text-xl font-bold tracking-wide">Banco Digital</span>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                ? 'bg-slate-800 text-emerald-400'
                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                            }`
                        }
                    >
                        <span className="text-lg">{link.icon}</span>
                        {link.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}