import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../features/auth/LoginPage';
import { RegisterPage } from '../features/auth/RegisterPage';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';
import { AdminLayout } from '../features/admin/AdminLayout';
import { AdminUsersPage } from '../features/admin/AdminUsersPage';
import { AdminAccountsPage } from '../features/admin/AdminAccountsPage';
import { AdminTransfersPage } from '../features/admin/AdminTransfersPage';

export function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <AdminLayout />
                        </AdminRoute>
                    }
                >
                    <Route index element={<Navigate to="/admin/users" replace />} />
                    <Route path="users" element={<AdminUsersPage />} />
                    <Route path="accounts" element={<AdminAccountsPage />} />
                    <Route path="transfers" element={<AdminTransfersPage />} />
                </Route>

                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>
    );
}