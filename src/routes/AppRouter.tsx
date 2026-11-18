import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../features/auth/LoginPage';
import { RegisterPage } from '../features/auth/RegisterPage';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { AccountPage } from '../features/accounts/AccountPage';
import { TransferForm } from '../features/transfers/TransferForm';
import { TransferStatusPage } from '../features/transfers/TransferStatusPage';
import { DepositForm } from '../features/deposits/DepositForm';
import { DepositStatusPage } from '../features/deposits/DepositStatusPage';
import { WithdrawalForm } from '../features/withdrawals/WithdrawalForm';
import { WithdrawalStatusPage } from '../features/withdrawals/WithdrawalStatusPage';
import { StatementForm } from '../features/statements/StatementForm';
import { StatementStatusPage } from '../features/statements/StatementStatusPage';
import { AdminUsersPage } from '../features/admin/AdminUsersPage';
import { AdminAccountsPage } from '../features/admin/AdminAccountsPage';
import { AdminTransfersPage } from '../features/admin/AdminTransfersPage';
import { AdminDepositsPage } from '../features/admin/AdminDepositsPage';
import { AdminWithdrawalsPage } from '../features/admin/AdminWithdrawalsPage';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';
import { AppLayout } from '../components/layout/AppLayout';

export function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* TODAS las rutas de la app (User y Admin) viven dentro del AppLayout */}
                <Route
                    element={
                        <ProtectedRoute>
                            <AppLayout />
                        </ProtectedRoute>
                    }
                >
                    {/* Dashboard principal (sirve para User y Admin) */}
                    <Route path="/dashboard" element={<DashboardPage />} />

                    {/* Rutas de Usuario */}
                    <Route path="/accounts/:accountNumber" element={<AccountPage />} />
                    <Route path="/transfers/new" element={<TransferForm />} />
                    <Route path="/transfers/:id" element={<TransferStatusPage />} />
                    <Route path="/deposits/new" element={<DepositForm />} />
                    <Route path="/deposits/:id" element={<DepositStatusPage />} />
                    <Route path="/withdrawals/new" element={<WithdrawalForm />} />
                    <Route path="/withdrawals/:id" element={<WithdrawalStatusPage />} />
                    <Route path="/statements/new" element={<StatementForm />} />
                    <Route path="/statements/:id" element={<StatementStatusPage />} />

                    {/* Rutas de Admin (Protegidas por el AdminRoute) */}
                    <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
                    <Route path="/admin/accounts" element={<AdminRoute><AdminAccountsPage /></AdminRoute>} />
                    <Route path="/admin/transfers" element={<AdminRoute><AdminTransfersPage /></AdminRoute>} />
                    <Route path="/admin/deposits" element={<AdminRoute><AdminDepositsPage /></AdminRoute>} />
                    <Route path="/admin/withdrawals" element={<AdminRoute><AdminWithdrawalsPage /></AdminRoute>} />
                </Route>

                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>
    );
}