import { useEffect, useState } from 'react';
import { getAccounts, updateAccountStatus, createAccount } from './admin.api';
import type { AdminAccount, AccountStatus } from './admin.types';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../auth/components/Input';
import { Button } from '../auth/components/Button';
import { DataTable } from '../../components/ui/DataTable'; // El componente nuevo

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
                prev.map((a) => (a.accountNumber === accountNumber ? { ...a, ...updated } : a))
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

            const newAccount: AdminAccount = {
                ...created,
                status: 'ACTIVE',
                updatedAt: new Date().toISOString(),
            };

            setAccounts((prev) => [...prev, newAccount]);
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
    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Cuentas Bancarias</h1>
                    <p className="text-slate-500 text-sm mt-1">Supervisa los saldos y congela cuentas sospechosas</p>
                </div>
                <Button onClick={() => setOpenCreate(true)} className="w-auto bg-slate-900 text-white hover:bg-slate-800">
                    + Nueva Cuenta
                </Button>
            </div>

            {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>}

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <DataTable
                    data={accounts}
                    isLoading={loading}
                    keyExtractor={(a) => a.accountNumber}
                    columns={[
                        {
                            header: 'Cuenta',
                            accessor: (a) => <span className="font-mono font-medium text-slate-800">{a.accountNumber}</span>,
                        },
                        {
                            header: 'Dueño',
                            accessor: (a) => (
                                <div>
                                    <p className="font-medium text-slate-700">{a.owner.name}</p>
                                    <p className="text-xs text-slate-500">{a.owner.email}</p>
                                </div>
                            ),
                        },
                        {
                            header: 'Saldo',
                            accessor: (a) => <span className="font-bold text-emerald-600">${a.balance.toFixed(2)}</span>,
                        },
                        {
                            header: 'Estado de Cuenta',
                            accessor: (a) => (
                                <select
                                    value={a.status}
                                    onChange={(e) => changeStatus(a.accountNumber, e.target.value as AccountStatus)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold appearance-none cursor-pointer outline-none border-2 transition-colors ${a.status === 'ACTIVE' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' :
                                        a.status === 'FROZEN' ? 'border-yellow-200 bg-yellow-50 text-yellow-700' :
                                            'border-red-200 bg-red-50 text-red-700'
                                        }`}
                                >
                                    <option value="ACTIVE">ACTIVA</option>
                                    <option value="FROZEN">CONGELADA</option>
                                    <option value="CLOSED">CERRADA</option>
                                </select>
                            ),
                        },
                        {
                            header: 'Últ. Actualización',
                            accessor: (a) => <span className="text-xs text-slate-400">{new Date(a.updatedAt).toLocaleString()}</span>,
                        },
                    ]}
                />
            </div>

            {/* MODAL DE CREAR CUENTA - Aquí estaba el error, faltaban los children */}
            <Modal open={openCreate} onClose={() => setOpenCreate(false)} title="Crear cuenta">
                <form onSubmit={handleCreate} className="flex flex-col gap-3">
                    <Input label="Email del dueño" type="email" value={formEmail} onChange={setFormEmail} placeholder="user@test.com" />
                    <Input label="Número de cuenta" type="text" value={formNumber} onChange={setFormNumber} placeholder="ACC-004" />
                    <Input label="Saldo inicial" type="number" value={formBalance} onChange={setFormBalance} placeholder="0" />

                    {formError && (
                        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{formError}</p>
                    )}

                    <div className="flex gap-2 justify-end mt-2">
                        <Button type="button" onClick={() => setOpenCreate(false)} variant="secondary">Cancelar</Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? 'Creando...' : 'Crear'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}