import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import { Layout } from './components/Layout'
import { AuthLayout } from './components/AuthLayout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminRoute } from './components/AdminRoute'

// Auth pages
import { LoginPage } from './pages/auth/LoginPage'
import { RegisterPage } from './pages/auth/RegisterPage'
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage'
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage'

// Main pages
import { DashboardPage } from './pages/DashboardPage'
import { BrandsPage } from './pages/BrandsPage'
import { BrandDetailPage } from './pages/BrandDetailPage'
import { AnalysisPage } from './pages/AnalysisPage'
import { AnalysisResultPage } from './pages/AnalysisResultPage'
import { LogAnalysisPage } from './pages/LogAnalysisPage'
import { SettingsPage } from './pages/SettingsPage'

// Admin pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { AdminUsersPage } from './pages/admin/AdminUsersPage'
import { AdminSubscriptionsPage } from './pages/admin/AdminSubscriptionsPage'
import { AdminErrorLogsPage } from './pages/admin/AdminErrorLogsPage'
import { AdminActivityLogsPage } from './pages/admin/AdminActivityLogsPage'
import { AdminImprovementsPage } from './pages/admin/AdminImprovementsPage'

function App() {
  const { isAuthenticated, user } = useAuthStore()

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="brands" element={<BrandsPage />} />
        <Route path="brands/:brandId" element={<BrandDetailPage />} />
        <Route path="analysis" element={<AnalysisPage />} />
        <Route path="analysis/result/:analysisId" element={<AnalysisResultPage />} />
        <Route path="log-analysis" element={<LogAnalysisPage />} />
        <Route path="settings" element={<SettingsPage />} />

        {/* Admin routes */}
        <Route
          path="admin"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />
        <Route
          path="admin/users"
          element={
            <AdminRoute>
              <AdminUsersPage />
            </AdminRoute>
          }
        />
        <Route
          path="admin/subscriptions"
          element={
            <AdminRoute>
              <AdminSubscriptionsPage />
            </AdminRoute>
          }
        />
        <Route
          path="admin/errors"
          element={
            <AdminRoute>
              <AdminErrorLogsPage />
            </AdminRoute>
          }
        />
        <Route
          path="admin/activity"
          element={
            <AdminRoute>
              <AdminActivityLogsPage />
            </AdminRoute>
          }
        />
        <Route
          path="admin/improvements"
          element={
            <AdminRoute>
              <AdminImprovementsPage />
            </AdminRoute>
          }
        />
      </Route>

      {/* Redirects */}
      <Route
        path="*"
        element={
          isAuthenticated ? (
            <Navigate to="/" replace />
          ) : (
            <Navigate to="/auth/login" replace />
          )
        }
      />
    </Routes>
  )
}

export default App