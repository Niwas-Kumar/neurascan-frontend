import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider, useAuth } from './context/AuthContext'

// Auth pages
import LoginPage         from './pages/auth/LoginPage'
import RegisterPage      from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage  from './pages/auth/ResetPasswordPage'
import VerifyEmailPage    from './pages/auth/VerifyEmailPage'
import OAuth2RedirectHandler from './components/auth/OAuth2RedirectHandler'

// Teacher pages
import TeacherDashboard from './pages/teacher/TeacherDashboard'
import StudentsPage     from './pages/teacher/StudentsPage'
import UploadPage       from './pages/teacher/UploadPage'
import { ReportsPage }  from './pages/teacher/ReportsPage'
import AnalyticsPage    from './pages/teacher/AnalyticsPage'
import QuizPage         from './pages/teacher/QuizPage'

// Parent pages
import ParentDashboard  from './pages/parent/ParentDashboard'
import ProgressPage     from './pages/parent/ProgressPage'
import QuizProgressPage from './pages/parent/QuizProgressPage'

// Shared
import SettingsPage from './pages/SettingsPage'

// Layout
import AppLayout from './components/layout/AppLayout'
import { FullPageLoader } from './components/shared/UI'

// ── Protected route wrapper ───────────────────────────────────
function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth()
  if (loading) return <FullPageLoader />
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/unauthorized" replace />
  return children
}

// ── Root redirect based on auth state ────────────────────────
function RootRedirect() {
  const { user, loading } = useAuth()
  if (loading) return <FullPageLoader />
  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'ROLE_TEACHER') return <Navigate to="/teacher/dashboard" replace />
  if (user.role === 'ROLE_PARENT')  return <Navigate to="/parent/dashboard"  replace />
  return <Navigate to="/login" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/"               element={<RootRedirect />} />
      <Route path="/login"          element={<LoginPage />} />
      <Route path="/register"       element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password"  element={<ResetPasswordPage />} />
      <Route path="/verify-email"    element={<VerifyEmailPage />} />
      <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

      {/* ── Teacher routes ── */}
      <Route path="/teacher" element={
        <ProtectedRoute role="ROLE_TEACHER">
          <AppLayout />
        </ProtectedRoute>
      }>
        <Route index          element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<TeacherDashboard />} />
        <Route path="students"  element={<StudentsPage />} />
        <Route path="upload"    element={<UploadPage />} />
        <Route path="reports"   element={<ReportsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="quizzes"   element={<QuizPage />} />
        <Route path="settings"  element={<SettingsPage />} />
      </Route>

      {/* ── Parent routes ── */}
      <Route path="/parent" element={
        <ProtectedRoute role="ROLE_PARENT">
          <AppLayout />
        </ProtectedRoute>
      }>
        <Route index          element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<ParentDashboard />} />
        <Route path="progress"  element={<ProgressPage />} />
        <Route path="quiz-progress" element={<QuizProgressPage />} />
        <Route path="settings"  element={<SettingsPage />} />
      </Route>

      {/* ── Fallback ── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <Toaster
        position="top-right"
        gutter={8}
        containerStyle={{ top: 16, right: 16 }}
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            fontWeight: 500,
            borderRadius: 10,
            padding: '12px 16px',
            boxShadow: 'var(--shadow-lg)',
            maxWidth: 360,
          },
          success: {
            iconTheme: { primary: 'var(--success)', secondary: 'var(--bg-elevated)' },
            style: { borderColor: 'rgba(16,185,129,0.25)' },
          },
          error: {
            iconTheme: { primary: 'var(--danger)', secondary: 'var(--bg-elevated)' },
            style: { borderColor: 'rgba(239,68,68,0.25)' },
          },
        }}
      />
    </AuthProvider>
  )
}
