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

        if (!from || !to) {
            setError('Origen y destino son obligatorios');
            return;
        }
        if (from === to) {
            setError('Las cuentas deben ser distintas');
            return;
        }

        const fromAcc = findAccount(accounts, from);
        if (!fromAcc) {
            setError('La cuenta origen no existe');
            return;
        }
        if (!isAccountOperable(fromAcc)) {
            setError(`La cuenta origen está ${getAccountStatusLabel(fromAcc.status).toLowerCase()}. No puedes transferir desde ella.`);
            return;
        }

        const amountNum = Number(amount);
        if (Number.isNaN(amountNum) || amountNum <= 0) {
            setError('Monto inválido');
            return;
        }
        if (amountNum > fromAcc.balance) {
            setError(`Saldo insuficiente. Disponible: $${fromAcc.balance.toFixed(2)}`);
            return;
        }
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
        <div className="max-w-3xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Transferencias a Terceros</h1>
                <p className="text-slate-500 text-sm mt-1">Ingresa los datos para realizar la transferencia.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Barra superior de pasos (simulada) */}
                <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-4">
                    <div className="flex items-center gap-2 text-emerald-600 font-medium text-sm">
                        <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs">1</span>
                        Datos de la Transferencia
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-8 flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Cuenta Origen */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-slate-700">Cuenta a debitar</label>
                            <select
                                value={fromAccount}
                                onChange={(e) => setFromAccount(e.target.value)}
                                className="px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                            >
                                <option value="">Seleccione una Cuenta</option>
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

                        {/* Cuenta Destino */}
                        <Input
                            label="Cuenta destino (Beneficiario)"
                            value={toAccount}
                            onChange={setToAccount}
                            placeholder="Ej. 0172-1234-56-1234567890"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Monto */}
                        <Input
                            label="Monto a transferir"
                            type="number"
                            value={amount}
                            onChange={setAmount}
                            placeholder="0.00"
                        />
                        {/* Referencia */}
                        <Input
                            label="Concepto o Referencia (Opcional)"
                            value={reference}
                            onChange={setReference}
                            placeholder="Ej. Pago de servicios"
                        />
                    </div>

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
                            ) : (
                                'Confirmar Transferencia'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}