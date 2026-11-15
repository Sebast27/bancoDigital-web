import { useState } from 'react';
import { Input } from './components/Input';
import { Button } from './components/Button';
import { useAuth } from './AuthContext';

export function LoginForm() {
    const { user, loading: authLoading, login, logout } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email || !password) {
            setError('Email y contraseña son obligatorios');
            return;
        }

        if (!email.includes('@')) {
            setError('El email no es válido');
            return;
        }

        setSubmitting(true);
        try {
            await login(email, password);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error desconocido';
            setError(message);
        } finally {
            setSubmitting(false);
        }
    };

    if (authLoading) {
        return <p className="text-slate-500">Cargando...</p>;
    }

    if (user) {
        return (
            <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md flex flex-col gap-4 text-center">
                <h1 className="text-2xl font-bold text-slate-800">Bienvenido</h1>
                <p className="text-slate-600">{user.email}</p>
                <Button onClick={logout}>Cerrar sesión</Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-slate-800 text-center">Iniciar sesión</h1>

            <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="tu@email.com" />
            <Input label="Contraseña" type="password" value={password} onChange={setPassword} placeholder="••••••••" />

            {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{error}</p>}

            <Button type="submit" disabled={submitting}>
                {submitting ? 'Entrando...' : 'Entrar'}
            </Button>
        </form>
    );
}