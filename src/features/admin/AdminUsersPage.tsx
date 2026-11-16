import { useEffect, useState } from 'react';
import { getUsers, updateUser } from './admin.api';
import type { AdminUser, UserRole } from './admin.types';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../auth/components/Input';
import { Button } from '../auth/components/Button';

export function AdminUsersPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [editing, setEditing] = useState<AdminUser | null>(null);
    const [formName, setFormName] = useState('');
    const [formRole, setFormRole] = useState<UserRole>('USER');
    const [formPassword, setFormPassword] = useState('');
    const [formError, setFormError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

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

    const openEdit = (u: AdminUser) => {
        setEditing(u);
        setFormName(u.name);
        setFormRole(u.role);
        setFormPassword('');
        setFormError(null);
    };

    const toggleActive = async (u: AdminUser) => {
        try {
            const updated = await updateUser(u.id, { isActive: !u.isActive });
            setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, ...updated } : x)));
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Error');
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editing) return;
        setFormError(null);

        if (!formName.trim()) {
            setFormError('El nombre es obligatorio');
            return;
        }
        if (formPassword && formPassword.length < 8) {
            setFormError('La contraseña debe tener al menos 8 caracteres');
            return;
        }

        const payload: Record<string, unknown> = { name: formName.trim(), role: formRole };
        if (formPassword) payload.password = formPassword;

        setSubmitting(true);
        try {
            const updated = await updateUser(editing.id, payload);
            setUsers((prev) => prev.map((x) => (x.id === editing.id ? { ...x, ...updated } : x)));
            setEditing(null);
        } catch (e) {
            setFormError(e instanceof Error ? e.message : 'Error');
        } finally {
            setSubmitting(false);
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
                                <td className="px-4 py-3 flex gap-3">
                                    <button
                                        onClick={() => openEdit(u)}
                                        className="text-blue-600 hover:underline text-xs"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => toggleActive(u)}
                                        className="text-slate-600 hover:underline text-xs"
                                    >
                                        {u.isActive ? 'Desactivar' : 'Activar'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal open={!!editing} onClose={() => setEditing(null)} title="Editar usuario">
                <form onSubmit={handleSave} className="flex flex-col gap-3">
                    <div className="text-sm text-slate-600">
                        <div className="font-medium">{editing?.email}</div>
                    </div>

                    <Input label="Nombre" type="text" value={formName} onChange={setFormName} />

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-slate-700">Rol</label>
                        <select
                            value={formRole}
                            onChange={(e) => setFormRole(e.target.value as UserRole)}
                            className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="USER">USER</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                    </div>

                    <Input
                        label="Nueva contraseña (opcional)"
                        type="password"
                        value={formPassword}
                        onChange={setFormPassword}
                        placeholder="Dejar vacío para no cambiar"
                    />

                    {formError && (
                        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{formError}</p>
                    )}

                    <div className="flex gap-2 justify-end mt-2">
                        <Button type="button" onClick={() => setEditing(null)}>Cancelar</Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? 'Guardando...' : 'Guardar'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}