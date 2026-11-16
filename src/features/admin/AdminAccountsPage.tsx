import { useEffect, useState } from 'react';
import { getAccounts, updateAccountStatus } from './admin.api';
import type { AdminAccount, AccountStatus } from './admin.types';

export function AdminAccountsPage() {
    const [accounts, setAccounts] = useState<AdminAccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    if (loading) return <p className="text-slate-500">Cargando cuentas...</p>;
    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Cuentas</h1>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-left">
                        <tr>
                            <th className="px-4 py-3">Cuenta</th>
                            <th className="px-4 py-3">Dueño</th>
                            <th className="px-4 py-3">Saldo</th>
                            <th className="px-4 py-3">Estado</th>
                            <th className="px-4 py-3">Acciones</th>
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
        </div>
    );
}