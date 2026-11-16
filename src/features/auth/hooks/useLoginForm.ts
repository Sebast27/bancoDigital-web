import { useState } from 'react';
import { useAuth } from '../AuthContext';

export function useLoginForm() {
    const { login } = useAuth();
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
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setSubmitting(false);
        }
    };

    return { email, password, setEmail, setPassword, error, submitting, handleSubmit };
}