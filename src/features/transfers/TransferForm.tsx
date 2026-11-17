import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Input } from '../auth/components/Input';
import { Button } from '../auth/components/Button';
import { useCreateTransfer } from './transfers.hooks';
import { useMyAccounts } from '../accounts/accounts.hooks';
import { findAccount, isAccountOperable, getAccountStatusLabel } from '../accounts/accounts.utils';

export function TransferForm() {
    const [search] = useSearchParams();
    const navigate = useNavigate();
    const { data: accounts = [] } = useMyAccounts();
    const create = useCreateTransfer();

    const [fromAccount, setFromAccount] = useState((search.get('from') ?? '').trim());
    const [toAccount, setToAccount] = useState('');
    const [amount, setAmount] = useState('');
    const [reference, setReference] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const from = fromAccount.trim();
        const to = toAccount.trim();

        // 1. Campos obligatorios
        if (!from || !to) {
            setError('Origen y destino son obligatorios');
            return;
        }

        // 2. Cuentas distintas
        if (from === to) {
            setError('Las cuentas deben ser distintas');
            return;
        }

        // 3. Cuenta origen existe y está activa
        const fromAcc = findAccount(accounts, from);
        if (!fromAcc) {
            setError('La cuenta origen no existe');
            return;
        }
        if (!isAccountOperable(fromAcc)) {
            setError(`La cuenta origen está ${getAccountStatusLabel(fromAcc.status).toLowerCase()}. No puedes transferir desde ella.`);
            return;
        }

        // 4. Monto válido
        const amountNum = Number(amount);
        if (Number.isNaN(amountNum) || amountNum <= 0) {
            setError('Monto inválido');
            return;
        }

        // 5. Saldo suficiente
        if (amountNum > fromAcc.balance) {
            setError(`Saldo insuficiente. Disponible: $${fromAcc.balance.toFixed(2)}`);
            return;
        }

        // 6. Monto con máximo 2 decimales
        if (Math.round(amountNum * 100) !== amountNum * 100) {
            setError('El monto solo puede tener 2 decimales');
            return;
        }

        try {
            const res = await create.mutateAsync({
                fromAccount: from,
                toAccount: to,
                amount: amountNum,
                reference: reference.trim() || undefined,
            });
            navigate(`/transfers/${res.transactionId}`);
        } catch {
            // toast ya se muestra
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white p-6 rounded-lg shadow-md flex flex-col gap-4"
            >
                <h1 className="text-2xl font-bold text-slate-800 text-center">Nueva transferencia</h1>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-slate-700">Cuenta origen</label>
                    <select
                        value={fromAccount}
                        onChange={(e) => setFromAccount(e.target.value)}
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

                <Input label="Cuenta destino" value={toAccount} onChange={setToAccount} placeholder="ACC-002" />
                <Input label="Monto" type="number" value={amount} onChange={setAmount} placeholder="100" />
                <Input label="Referencia (opcional)" value={reference} onChange={setReference} />

                {error && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{error}</p>
                )}

                <Button type="submit" disabled={create.isPending}>
                    {create.isPending ? 'Procesando...' : 'Transferir'}
                </Button>
            </form>
        </div>
    );
}