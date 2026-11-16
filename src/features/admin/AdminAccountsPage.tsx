import { useEffect, useState } from 'react';
import { getAccounts, updateAccountStatus, createAccount } from './admin.api';
import type { AdminAccount, AccountStatus } from './admin.types';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../auth/components/Input';
import { Button } from '../auth/components/Button';

export function AdminAccountsPage() {
    const [accounts, setAccounts] = useState<AdminAccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [openCreate, setOpenCreate] = useState(false);
    const [formEmail, setFormEmail] = useState('');
    const [formNumber, setFormNumber] = useState('');
    const [formBalance, setFormBalance] = useState('0');
    const [formError, setFormError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            setAccounts(await getAccounts());
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const changeStatus = async (accountNumber: string, status: AccountStatus) => {
        try {
            const updated = await updateAccountStatus(accountNumber, status);
            setAccounts((prev) =>
                prev.map((a) => (a.accountNumber === accountNumber ? { ...a, ...updated } : a)),
            );
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Error');
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        if (!formEmail.trim() || !formNumber.trim()) {
            setFormError('Email y número de cuenta son obligatorios');
            return;
        }
        const balanceNum = Number(formBalance);
        if (Number.isNaN(balanceNum) || balanceNum < 0) {
            setFormError('El saldo inicial debe ser un número >= 0');
            return;
        }

        setSubmitting(true);
        try {
            const created = await createAccount({
                userEmail: formEmail.trim(),
                accountNumber: formNumber.trim(),
                initialBalance: balanceNum,
            });
            setAccounts((prev) => [...prev, created as AdminAccount]);
            setOpenCreate(false);
            setFormEmail('');
            setFormNumber('');
            setFormBalance('0');
        } catch (e) {
            setFormError(e instanceof Error ? e.message : 'Error');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <p className="text-slate-500">Cargando cuentas...</p>;
    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-slate-800">Cuentas</h1>
                <Button onClick={() => setOpenCreate(true)}>+ Crear cuenta</Button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-left">
                        <tr>
                            <th className="px-4 py-3">Cuenta</th>
                            <th className="px-4 py-3">Dueño</th>
                            <th className="px-4 py-3">Saldo</th>
                            <th className="px-4 py-3">Estado</th>
                            <th className="px-4 py-3">Actualizado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accounts.map((a) => (
                            <tr key={a.accountNumber} className="border-t border-slate-100">
                                <td className="px-4 py-3 font-mono">{a.accountNumber}</td>
                                <td className="px-4 py-3">
                                    <div>{a.owner.name}</div>
                                    <div className="text-xs text-slate-500">{a.owner.email}</div>
                                </td>
                                <td className="px-4 py-3">${a.balance.toFixed(2)}</td>
                                <td className="px-4 py-3">
                                    <select
                                        value={a.status}
                                        onChange={(e) => changeStatus(a.accountNumber, e.target.value as AccountStatus)}
                                        className="border border-slate-300 rounded px-2 py-1 text-xs"
                                    >
                                        <option value="ACTIVE">ACTIVE</option>
                                        <option value="FROZEN">FROZEN</option>
                                        <option value="CLOSED">CLOSED</option>
                                    </select>
                                </td>
                                <td className="px-4 py-3 text-xs text-slate-400">
                                    {new Date(a.updatedAt).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal open={openCreate} onClose={() => setOpenCreate(false)} title="Crear cuenta">
                <form onSubmit={handleCreate} className="flex flex-col gap-3">
                    <Input label="Email del dueño" type="email" value={formEmail} onChange={setFormEmail} placeholder="user@test.com" />
                    <Input label="Número de cuenta" type="text" value={formNumber} onChange={setFormNumber} placeholder="ACC-004" />
                    <Input label="Saldo inicial" type="number" value={formBalance} onChange={setFormBalance} placeholder="0" />

                    {formError && (
                        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{formError}</p>
                    )}

                    <div className="flex gap-2 justify-end mt-2">
                        <Button type="button" onClick={() => setOpenCreate(false)}>Cancelar</Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? 'Creando...' : 'Crear'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}