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
        if (user && !loading) {
            navigate(from, { replace: true });
        }
    }, [user, loading, navigate, from]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-slate-500">
                Cargando...
            </div>
        );
    }

    if (user) {
        return <Navigate to={from} replace />;
    }

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <LoginForm />
        </div>
    );
}