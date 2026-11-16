import { useState } from 'react';
import { Input } from './components/Input';
import { Button } from './components/Button';
import { register } from './auth.api';
import { useNavigate, Link } from 'react-router-dom';

export function RegisterForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!name.trim()) {
            setError('El nombre es obligatorio');
            return;
        }
        if (!email || !password || !confirm) {
            setError('Todos los campos son obligatorios');
            return;
        }
        if (!email.includes('@')) {
            setError('El email no es válido');
            return;
        }
        if (password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres');
            return;
        }
        if (password !== confirm) {
            setError('Las contraseñas no coinciden');
            return;
        }

        setSubmitting(true);
        try {
            await register(email, password, name.trim());
            navigate('/login', { replace: true });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md flex flex-col gap-4"
        >
            <h1 className="text-2xl font-bold text-slate-800 text-center">Crear cuenta</h1>

            <Input label="Nombre" type="text" value={name} onChange={setName} placeholder="Tu nombre completo" />
            <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="tu@email.com" />
            <Input label="Contraseña" type="password" value={password} onChange={setPassword} placeholder="Mín. 8 caracteres" />
            <Input label="Confirmar contraseña" type="password" value={confirm} onChange={setConfirm} placeholder="Repite la contraseña" />

            {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{error}</p>
            )}

            <Button type="submit" disabled={submitting}>
                {submitting ? 'Creando...' : 'Crear cuenta'}
            </Button>

            <p className="text-sm text-center text-slate-600">
                ¿Ya tienes cuenta? <Link to="/login" className="text-blue-600 hover:underline">Inicia sesión</Link>
            </p>
        </form>
    );
}