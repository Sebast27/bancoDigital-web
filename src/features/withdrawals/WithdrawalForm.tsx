import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../auth/components/Input';
import { Button } from '../auth/components/Button';
import { useCreateWithdrawal } from './withdrawals.hooks';
import { useMyAccounts } from '../accounts/accounts.hooks';
import { findAccount, isAccountOperable, getAccountStatusLabel } from '../accounts/accounts.utils';

export function WithdrawalForm() {
    const navigate = useNavigate();
    const { data: accounts = [] } = useMyAccounts();
    const create = useCreateWithdrawal();

    const [accountNumber, setAccountNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [reference, setReference] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const acc = accountNumber.trim();
        if (!acc) return setError('Selecciona una cuenta');

        const account = findAccount(accounts, acc);
        if (!account) return setError('Cuenta no encontrada');
        if (!isAccountOperable(account)) return setError(`La cuenta está ${getAccountStatusLabel(account.status).toLowerCase()}.`);

        const n = Number(amount);
        if (Number.isNaN(n) || n <= 0) return setError('Monto inválido');
        if (n > account.balance) return setError(`Saldo insuficiente. Disponible: $${account.balance.toFixed(2)}`);

        try {
            const res = await create.mutateAsync({ accountNumber: acc, amount: n, reference: reference.trim() || undefined });
            navigate(`/withdrawals/${res.withdrawalId}`);
        } catch { }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Retiros</h1>
                <p className="text-slate-500 text-sm mt-1">Solicita un retiro de tus fondos disponibles.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-4">
                    <div className="flex items-center gap-2 text-emerald-600 font-medium text-sm">
                        <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs">1</span>
                        Datos del Retiro
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-8 flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-slate-700">Cuenta a debitar</label>
                            <select
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value)}
                                className="px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="">Seleccione una Cuenta</option>
                                {accounts.map((a) => (
                                    <option key={a.accountNumber} value={a.accountNumber} disabled={!isAccountOperable(a)}>
                                        {a.accountNumber} (${a.balance.toFixed(2)})
                                        {!isAccountOperable(a) && ` — ${getAccountStatusLabel(a.status)}`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <Input label="Monto a retirar" type="number" value={amount} onChange={setAmount} placeholder="0.00" />
                    </div>

                    <Input label="Concepto o Referencia (Opcional)" value={reference} onChange={setReference} placeholder="Ej. Retiro en cajero" />

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                            <p className="text-sm text-red-700 font-medium">{error}</p>
                        </div>
                    )}

                    <div className="border-t border-slate-200 pt-6 flex justify-end gap-3">
                        <Button type="button" onClick={() => navigate('/dashboard')} variant="secondary" className="w-auto">Cancelar</Button>
                        <Button type="submit" disabled={create.isPending} className="w-auto bg-emerald-600 hover:bg-emerald-700 text-white min-w-[150px]">
                            {create.isPending ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                                    Procesando...
                                </span>
                            ) : 'Solicitar Retiro'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}