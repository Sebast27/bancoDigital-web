import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from './AuthContext';
import { LoginForm } from './LoginForm';

export function LoginPage() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

    useEffect(() => {
        if (user && !loading) navigate(from, { replace: true });
    }, [user, loading, navigate, from]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-slate-500">
                Cargando...
            </div>
        );
    }

    if (user) return <Navigate to={from} replace />;

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                <div className="flex flex-col items-center mb-6">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-3">
                        <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                            <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18l6.95 3.48L12 11.14 5.05 7.66 12 4.18z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">Transfer Bank</h1>
                    <p className="text-sm text-slate-500">Inicia sesión en tu cuenta</p>
                </div>
                <LoginForm />
            </div>
        </div>
    );
}