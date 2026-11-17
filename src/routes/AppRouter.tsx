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
import { TransferForm } from '../features/transfers/TransferForm';
import { TransferStatusPage } from '../features/transfers/TransferStatusPage';
import { DepositForm } from '../features/deposits/DepositForm';
import { DepositStatusPage } from '../features/deposits/DepositStatusPage';
import { AdminPendingDepositsPage } from '../features/deposits/AdminPendingDepositsPage';
import { WithdrawalForm } from '../features/withdrawals/WithdrawalForm';
import { WithdrawalStatusPage } from '../features/withdrawals/WithdrawalStatusPage';
import { StatementForm } from '../features/statements/StatementForm';
import { StatementStatusPage } from '../features/statements/StatementStatusPage';

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
                    path="/transfers/new"
                    element={
                        <ProtectedRoute>
                            <TransferForm />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/transfers/:id"
                    element={
                        <ProtectedRoute>
                            <TransferStatusPage />
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
                    <Route path="deposits" element={<AdminPendingDepositsPage />} />
                </Route>

                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />

                <Route path="/deposits/new" element={<ProtectedRoute><DepositForm /></ProtectedRoute>} />
                <Route path="/deposits/:id" element={<ProtectedRoute><DepositStatusPage /></ProtectedRoute>} />

                <Route path="/withdrawals/new" element={<ProtectedRoute><WithdrawalForm /></ProtectedRoute>} />
                <Route path="/withdrawals/:id" element={<ProtectedRoute><WithdrawalStatusPage /></ProtectedRoute>} />
                <Route path="/statements/new" element={<ProtectedRoute><StatementForm /></ProtectedRoute>} />
                <Route path="/statements/:id" element={<ProtectedRoute><StatementStatusPage /></ProtectedRoute>} />
            </Routes>
        </BrowserRouter>
    );
}