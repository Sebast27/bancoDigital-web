import { useEffect, useState } from 'react';
import { getUsers, updateUser } from './admin.api';
import type { AdminUser } from './admin.types';

export function AdminUsersPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            setUsers(await getUsers());
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const toggleActive = async (u: AdminUser) => {
        try {
            const updated = await updateUser(u.id, { isActive: !u.isActive });
            setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, ...updated } : x)));
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Error');
        }
    };

    if (loading) return <p className="text-slate-500">Cargando usuarios...</p>;
    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Usuarios</h1>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-left">
                        <tr>
                            <th className="px-4 py-3">Nombre</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Rol</th>
                            <th className="px-4 py-3">Activo</th>
                            <th className="px-4 py-3">Cuentas</th>
                            <th className="px-4 py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id} className="border-t border-slate-100">
                                <td className="px-4 py-3">{u.name}</td>
                                <td className="px-4 py-3">{u.email}</td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-medium ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'
                                            }`}
                                    >
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-medium ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}
                                    >
                                        {u.isActive ? 'Sí' : 'No'}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    {u.accounts.length === 0 ? (
                                        <span className="text-slate-400">—</span>
                                    ) : (
                                        <ul className="text-xs">
                                            {u.accounts.map((a) => (
                                                <li key={a.accountNumber}>
                                                    {a.accountNumber} · ${a.balance.toFixed(2)}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <button
                                        onClick={() => toggleActive(u)}
                                        className="text-blue-600 hover:underline text-xs"
                                    >
                                        {u.isActive ? 'Desactivar' : 'Activar'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}