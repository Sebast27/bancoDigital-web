import { Input } from './components/Input';
import { Button } from './components/Button';
import { useLoginForm } from './hooks/useLoginForm';
import { Link } from 'react-router-dom';

export function LoginForm() {
    const { email, password, setEmail, setPassword, error, submitting, handleSubmit } =
        useLoginForm();

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full bg-white p-6 rounded-lg shadow-md flex flex-col gap-4"
        >
            <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="tu@email.com" />
            <Input label="Contraseña" type="password" value={password} onChange={setPassword} placeholder="••••••••" />

            {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{error}</p>
            )}

            <Button type="submit" disabled={submitting}>
                {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        Entrando...
                    </span>
                ) : (
                    'Entrar'
                )}
            </Button>

            <p className="text-sm text-center text-slate-600">
                ¿No tienes cuenta? <Link to="/register" className="text-blue-600 hover:underline">Regístrate</Link>
            </p>
        </form>
    );
}