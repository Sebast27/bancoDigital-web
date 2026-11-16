import { Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import type { ReactNode } from 'react';

export function AdminRoute({ children }: { children: ReactNode }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-slate-500">
                Cargando...
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== 'ADMIN') {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
}