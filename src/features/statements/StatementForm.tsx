import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../auth/components/Input';
import { Button } from '../auth/components/Button';
import { useCreateStatement } from './statements.hooks';
import { useMyAccounts } from '../accounts/accounts.hooks';

export function StatementForm() {
    const navigate = useNavigate();
    const { data: accounts = [] } = useMyAccounts();
    const create = useCreateStatement();

    const [accountNumber, setAccountNumber] = useState('');
    const [periodStart, setPeriodStart] = useState('');
    const [periodEnd, setPeriodEnd] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!accountNumber) {
            setError('Selecciona una cuenta');
            return;
        }
        if (!periodStart || !periodEnd) {
            setError('El rango de fechas es obligatorio');
            return;
        }
        if (periodStart > periodEnd) {
            setError('La fecha inicial debe ser anterior a la final');
            return;
        }

        try {
            const res = await create.mutateAsync({
                accountNumber: accountNumber.trim(),
                periodStart,
                periodEnd,
            });
            navigate(`/statements/${res.statementId}`);
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
                <h1 className="text-2xl font-bold text-slate-800 text-center">Estado de cuenta</h1>
                <p className="text-sm text-slate-500 text-center -mt-2">
                    Se generará un PDF del período seleccionado.
                </p>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-slate-700">Cuenta</label>
                    <select
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded-md"
                    >
                        <option value="">-- Selecciona --</option>
                        {accounts.map((a) => (
                            <option key={a.accountNumber} value={a.accountNumber}>
                                {a.accountNumber}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-slate-700">Desde</label>
                    <input
                        type="date"
                        value={periodStart}
                        onChange={(e) => setPeriodStart(e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded-md"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-slate-700">Hasta</label>
                    <input
                        type="date"
                        value={periodEnd}
                        onChange={(e) => setPeriodEnd(e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded-md"
                    />
                </div>

                {error && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{error}</p>
                )}

                <Button type="submit" disabled={create.isPending}>
                    {create.isPending ? 'Solicitando...' : 'Generar PDF'}
                </Button>
            </form>
        </div>
    );
}