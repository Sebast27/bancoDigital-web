import { useEffect, useState } from 'react';
import { getUsers, updateUser } from './admin.api';
import type { AdminUser, UserRole } from './admin.types';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../auth/components/Input';
import { Button } from '../auth/components/Button';
import { DataTable } from '../../components/ui/DataTable';

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

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Gestión de Usuarios</h1>
                <p className="text-slate-500 text-sm mt-1">Administra los accesos y roles del sistema</p>
            </div>

            {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>}

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <DataTable
                    data={users}
                    isLoading={loading}
                    keyExtractor={(u) => u.id}
                    columns={[
                        {
                            header: 'Usuario',
                            accessor: (u) => (
                                <div>
                                    <p className="font-medium text-slate-800">{u.name}</p>
                                    <p className="text-xs text-slate-500">{u.email}</p>
                                </div>
                            ),
                        },
                        {
                            header: 'Rol',
                            accessor: (u) => (
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {u.role}
                                </span>
                            ),
                        },
                        {
                            header: 'Estado',
                            accessor: (u) => (
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${u.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                    {u.isActive ? 'Activo' : 'Inactivo'}
                                </span>
                            ),
                        },
                        {
                            header: 'Cuentas',
                            accessor: (u) => (
                                <div className="flex flex-col gap-1 text-xs">
                                    {u.accounts.length === 0 ? (
                                        <span className="text-slate-400 italic">Sin cuentas</span>
                                    ) : (
                                        u.accounts.map(a => (
                                            <span key={a.accountNumber} className="bg-slate-100 px-2 py-1 rounded inline-block w-fit font-mono">
                                                {a.accountNumber} (${a.balance.toFixed(2)})
                                            </span>
                                        ))
                                    )}
                                </div>
                            ),
                        },
                        {
                            header: 'Acciones',
                            className: 'text-right',
                            accessor: (u) => (
                                <div className="flex justify-end gap-3">
                                    <button onClick={() => openEdit(u)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Editar</button>
                                    <button onClick={() => toggleActive(u)} className="text-slate-500 hover:text-slate-800 text-sm font-medium">
                                        {u.isActive ? 'Suspender' : 'Activar'}
                                    </button>
                                </div>
                            ),
                        },
                    ]}
                />
            </div>

            {/* MODAL DE EDITAR USUARIO */}
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
                        <Button type="button" onClick={() => setEditing(null)} variant="secondary">Cancelar</Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? 'Guardando...' : 'Guardar'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}