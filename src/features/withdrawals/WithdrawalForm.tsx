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
        if (!acc) {
            setError('Selecciona una cuenta');
            return;
        }

        const account = findAccount(accounts, acc);
        if (!account) {
            setError('Cuenta no encontrada');
            return;
        }
        if (!isAccountOperable(account)) {
            setError(
                `La cuenta está ${getAccountStatusLabel(account.status).toLowerCase()}. No puedes retirar.`,
            );
            return;
        }

        const n = Number(amount);
        if (Number.isNaN(n) || n <= 0) {
            setError('Monto inválido');
            return;
        }
        if (n > account.balance) {
            setError(`Saldo insuficiente. Disponible: $${account.balance.toFixed(2)}`);
            return;
        }
        if (Math.round(n * 100) !== n * 100) {
            setError('El monto solo puede tener 2 decimales');
            return;
        }

        try {
            const res = await create.mutateAsync({
                accountNumber: acc,
                amount: n,
                reference: reference.trim() || undefined,
            });
            navigate(`/withdrawals/${res.withdrawalId}`);
        } catch {
            // toast lo maneja el hook
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white p-6 rounded-lg shadow-md flex flex-col gap-4"
            >
                <h1 className="text-2xl font-bold text-slate-800 text-center">Solicitar retiro</h1>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-slate-700">Cuenta</label>
                    <select
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded-md"
                    >
                        <option value="">-- Selecciona --</option>
                        {accounts.map((a) => (
                            <option
                                key={a.accountNumber}
                                value={a.accountNumber}
                                disabled={!isAccountOperable(a)}
                            >
                                {a.accountNumber} (${a.balance.toFixed(2)})
                                {!isAccountOperable(a) && ` — ${getAccountStatusLabel(a.status)}`}
                            </option>
                        ))}
                    </select>
                </div>

                <Input label="Monto" type="number" value={amount} onChange={setAmount} placeholder="200" />
                <Input label="Referencia (opcional)" value={reference} onChange={setReference} />

                {error && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{error}</p>
                )}

                <Button type="submit" disabled={create.isPending}>
                    {create.isPending ? 'Enviando...' : 'Solicitar retiro'}
                </Button>
            </form>
        </div>
    );
}