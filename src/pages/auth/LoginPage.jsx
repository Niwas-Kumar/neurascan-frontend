import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, Loader2, GraduationCap, Users } from 'lucide-react'
import { authAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { auth, googleProvider, signInWithPopup } from '../../firebase'
import { NeuraScanLogo } from '../../components/shared/Logo'

// ════════════════════════════════════════════════════════════════
// DESIGN SYSTEM - Matching reference exactly
// ════════════════════════════════════════════════════════════════
const COLORS = {
  sidebar: '#312E81',
  primary: '#14B8A6',
  primaryHover: '#0D9488',

  bgBase: '#F8FAFC',
  bgCard: '#FFFFFF',
  bgMuted: '#F1F5F9',

  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#64748B',

  border: '#E2E8F0',
  error: '#DC2626',
  errorBg: '#FEF2F2',
}

// ════════════════════════════════════════════════════════════════
// GOOGLE ICON COMPONENT
// ════════════════════════════════════════════════════════════════
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" style={{ width: 20, height: 20 }}>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

// ════════════════════════════════════════════════════════════════
// LOGIN FORM COMPONENT
// ════════════════════════════════════════════════════════════════
function LoginForm({ role, login, navigate }) {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const fn = role === 'teacher' ? authAPI.teacherLogin : authAPI.parentLogin
      const res = await fn(form)
      if (res.data?.data?.message === 'ACCOUNT_PENDING_APPROVAL') {
        toast('Your account is pending admin approval.', { icon: '⏳' })
        navigate('/pending-approval')
        return
      }
      login(res.data.data)
      toast.success(`Welcome back, ${res.data.data.userName}!`)
      navigate(role === 'teacher' ? '/teacher/dashboard' : '/parent/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password'
      toast.error(msg)
      setErrors({ general: msg })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    const id = toast.loading('Authenticating with Google...')
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const idToken = await result.user.getIdToken(true) // force-refresh to avoid stale cached token
      if (!idToken) throw new Error('Could not retrieve ID Token from Firebase.')
      const picture = result.user?.photoURL || null
      const res = await authAPI.firebaseLogin(idToken, role, picture)
      if (res.data?.data?.message === 'ACCOUNT_PENDING_APPROVAL') {
        toast('Your account is pending admin approval.', { id, icon: '⏳' })
        navigate('/pending-approval')
        return
      }
      login(res.data.data)
      toast.success(`Welcome back, ${res.data.data.userName}!`, { id })
      navigate(res.data.data.userRole === 'ROLE_TEACHER' ? '/teacher/dashboard' : '/parent/dashboard')
    } catch (err) {
      let msg = 'Google login failed'
      if (err.code === 'auth/popup-closed-by-user') msg = 'Sign-in popup was closed'
      else if (err.code === 'auth/cancelled-popup-request') msg = 'Only one sign-in popup allowed at a time'
      else if (err.response?.data?.message) msg = err.response.data.message
      else if (err.message) msg = err.message
      toast.error(msg, { id })
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Google OAuth Button */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={googleLoading}
        style={{
          width: '100%',
          height: 44,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 8,
          background: COLORS.bgCard,
          fontSize: 14,
          fontWeight: 500,
          color: COLORS.textPrimary,
          cursor: googleLoading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {googleLoading ? (
          <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
        ) : (
          <GoogleIcon />
        )}
        Continue with Google
      </button>

      {/* Divider */}
      <div style={{ position: 'relative', margin: '8px 0' }}>
        <div style={{ height: 1, background: COLORS.border }} />
        <span
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            background: COLORS.bgCard,
            padding: '0 8px',
            fontSize: 12,
            color: COLORS.textMuted,
          }}
        >
          OR
        </span>
      </div>

      {/* Email/Password Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Email Field */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: 14,
              fontWeight: 500,
              color: COLORS.textPrimary,
              marginBottom: 8,
            }}
          >
            Email address
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => {
              setForm((f) => ({ ...f, email: e.target.value }))
              setErrors((er) => ({ ...er, email: '' }))
            }}
            placeholder={role === 'teacher' ? 'john@school.edu' : 'parent@gmail.com'}
            style={{
              width: '100%',
              height: 44,
              padding: '0 12px',
              border: `1px solid ${errors.email ? COLORS.error : COLORS.border}`,
              borderRadius: 8,
              fontSize: 14,
              color: COLORS.textPrimary,
              background: COLORS.bgCard,
              boxSizing: 'border-box',
              fontFamily: "'Inter', sans-serif",
            }}
          />
          {errors.email && (
            <p style={{ marginTop: 4, fontSize: 13, color: COLORS.error }}>{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <label style={{ fontSize: 14, fontWeight: 500, color: COLORS.textPrimary }}>
              Password
            </label>
            <Link
              to="/forgot-password"
              style={{
                fontSize: 12,
                color: COLORS.primary,
                textDecoration: 'none',
              }}
            >
              Forgot password?
            </Link>
          </div>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => {
                setForm((f) => ({ ...f, password: e.target.value }))
                setErrors((er) => ({ ...er, password: '' }))
              }}
              placeholder="••••••••"
              style={{
                width: '100%',
                height: 44,
                padding: '0 40px 0 12px',
                border: `1px solid ${errors.password ? COLORS.error : COLORS.border}`,
                borderRadius: 8,
                fontSize: 14,
                color: COLORS.textPrimary,
                background: COLORS.bgCard,
                boxSizing: 'border-box',
                fontFamily: "'Inter', sans-serif",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: COLORS.textMuted,
                padding: 0,
              }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p style={{ marginTop: 4, fontSize: 13, color: COLORS.error }}>{errors.password}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            height: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            background: COLORS.primary,
            color: 'white',
            border: 'none',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 500,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {loading ? (
            <>
              <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </button>
      </form>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// MAIN LOGIN PAGE - Exact reference design
// ════════════════════════════════════════════════════════════════
export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const expired = params.get('session') === 'expired'
  const [activeTab, setActiveTab] = useState('teacher')

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'rgba(241, 245, 249, 0.3)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <NeuraScanLogo size={36} />
        </Link>
      </header>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 16px',
        }}
      >
        <div style={{ width: '100%', maxWidth: 400 }}>
          {/* Card */}
          <div
            style={{
              background: COLORS.bgCard,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 12,
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
              overflow: 'hidden',
            }}
          >
            {/* Card Header */}
            <div style={{ padding: '24px 24px 8px', textAlign: 'center' }}>
              <h1
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 24,
                  fontWeight: 700,
                  color: COLORS.textPrimary,
                  marginBottom: 8,
                }}
              >
                Welcome back
              </h1>
              <p style={{ fontSize: 14, color: COLORS.textMuted }}>
                Sign in to your NeuraScan account
              </p>
            </div>

            {/* Session Expired Alert */}
            {expired && (
              <div
                style={{
                  margin: '0 24px 16px',
                  padding: '12px 16px',
                  background: COLORS.errorBg,
                  borderRadius: 8,
                  fontSize: 14,
                  color: COLORS.error,
                }}
              >
                Your session has expired. Please sign in again.
              </div>
            )}

            {/* Card Content */}
            <div style={{ padding: '16px 24px 24px' }}>
              {/* Tabs */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 4,
                  background: COLORS.bgMuted,
                  borderRadius: 8,
                  padding: 4,
                  marginBottom: 24,
                }}
              >
                {['teacher', 'parent'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: '10px 16px',
                      border: 'none',
                      borderRadius: 6,
                      background: activeTab === tab ? COLORS.bgCard : 'transparent',
                      boxShadow: activeTab === tab ? '0 1px 2px rgba(0, 0, 0, 0.05)' : 'none',
                      fontSize: 14,
                      fontWeight: 500,
                      color: activeTab === tab ? COLORS.textPrimary : COLORS.textMuted,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {tab === 'teacher' ? <GraduationCap size={16} /> : <Users size={16} />}
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Login Form */}
              <LoginForm role={activeTab} login={login} navigate={navigate} />

              {/* Footer Link */}
              <p
                style={{
                  marginTop: 24,
                  textAlign: 'center',
                  fontSize: 14,
                  color: COLORS.textMuted,
                }}
              >
                Don't have an account?{' '}
                <Link
                  to="/register"
                  style={{
                    color: COLORS.primary,
                    fontWeight: 500,
                    textDecoration: 'none',
                  }}
                >
                  Create one
                </Link>
              </p>
              <div
                style={{
                  textAlign: 'center',
                  marginTop: 16,
                }}
              >
                <Link
                  to="/admin/login"
                  style={{
                    display: 'inline-block',
                    padding: '10px 28px',
                    background: COLORS.sidebar,
                    color: '#FFFFFF',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: 14,
                    borderRadius: 8,
                    letterSpacing: '0.02em',
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  🔐 Admin Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spinner Animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
