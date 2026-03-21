import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GraduationCap, Users, ArrowRight, Shield, Zap, BarChart3, CheckCircle } from 'lucide-react'
import { authAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { NeuraScanLogo } from '../../components/shared/Logo.jsx'
import toast from 'react-hot-toast'

import { auth, googleProvider, signInWithPopup } from '../../firebase'

// ════════════════════════════════════════════════════════════════
// DESIGN SYSTEM COLORS
// ════════════════════════════════════════════════════════════════
const COLORS = {
  // Primary: Deep Indigo
  primary: '#312E81',
  primaryLight: '#4338CA',
  primaryLighter: '#6366F1',
  primaryBg: '#EEF2FF',

  // Secondary: Soft Teal
  secondary: '#14B8A6',
  secondaryDark: '#0D9488',
  secondaryBg: '#CCFBF1',

  // Neutrals
  textPrimary: '#1E293B',
  textSecondary: '#475569',
  textMuted: '#64748B',
  textLight: '#94A3B8',

  // Backgrounds
  bgBase: '#F8FAFC',
  bgSurface: '#FFFFFF',
  bgSubtle: '#F1F5F9',

  // States
  error: '#B91C1C',
  errorBg: '#FEF2F2',

  // Borders
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
}

const TABS = [
  { id: 'teacher', label: 'Teacher', icon: GraduationCap },
  { id: 'parent', label: 'Parent', icon: Users },
]

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const expired = params.get('session') === 'expired'

  const [tab, setTab] = useState('teacher')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    if (!form.password) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const fn = tab === 'teacher' ? authAPI.teacherLogin : authAPI.parentLogin
      const res = await fn(form)
      login(res.data.data)
      toast.success(`Welcome back, ${res.data.data.userName}!`)
      navigate(tab === 'teacher' ? '/teacher/dashboard' : '/parent/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password'
      toast.error(msg)
      setErrors({ general: msg })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    const id = toast.loading('Authenticating with Google...')
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const idToken = await result.user.getIdToken()

      if (!idToken) {
        throw new Error('Could not retrieve ID Token from Firebase.')
      }

      const picture = result.user?.photoURL || null
      const res = await authAPI.firebaseLogin(idToken, tab, picture)
      login(res.data.data)
      toast.success(`Welcome back, ${res.data.data.userName}!`, { id })
      navigate(res.data.data.userRole === 'ROLE_TEACHER' ? '/teacher/dashboard' : '/parent/dashboard')
    } catch (err) {
      console.error('Login Error:', err)
      let msg = 'Google login failed'
      if (err.code === 'auth/popup-closed-by-user') {
        msg = 'Sign-in popup was closed'
      } else if (err.code === 'auth/cancelled-popup-request') {
        msg = 'Only one sign-in popup allowed at a time'
      } else if (err.response?.data?.message) {
        msg = err.response.data.message
      } else if (err.message) {
        msg = err.message
      }
      toast.error(msg, { id })
    }
  }

  const features = [
    { icon: Zap, text: 'Analysis in under 30 seconds' },
    { icon: Shield, text: 'FERPA compliant and secure' },
    { icon: BarChart3, text: 'Detailed progress tracking' },
    { icon: CheckCircle, text: 'Research-validated methods' },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: COLORS.bgBase,
    }}>
      {/* ─── LEFT PANEL: HERO SECTION ─── */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '64px 72px',
          background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 50%, ${COLORS.secondary} 100%)`,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
        className="hide-mobile"
      >
        {/* Decorative Background Elements */}
        <div style={{
          position: 'absolute',
          top: '-80px',
          right: '-80px',
          width: '280px',
          height: '280px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-60px',
          left: '-80px',
          width: '220px',
          height: '220px',
          background: 'rgba(255, 255, 255, 0.06)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '30%',
          width: '160px',
          height: '160px',
          background: 'rgba(255, 255, 255, 0.04)',
          borderRadius: '50%',
        }} />

        {/* Logo Section */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              marginBottom: 64,
              position: 'relative',
              zIndex: 1,
            }}
          >
            <NeuraScanLogo size={48} variant="light" />
          </motion.div>
        </Link>

        {/* Hero Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            fontSize: 44,
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: 24,
            letterSpacing: '-0.02em',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            position: 'relative',
            zIndex: 1,
          }}
        >
          Early Detection,
          <br />
          Better Outcomes
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          style={{
            fontSize: 17,
            lineHeight: 1.75,
            marginBottom: 48,
            opacity: 0.92,
            maxWidth: 480,
            fontWeight: 400,
            position: 'relative',
            zIndex: 1,
          }}
        >
          Our AI-powered handwriting analysis identifies learning disorders like dyslexia and dysgraphia, giving educators and parents the insights needed to support every student.
        </motion.p>

        {/* Feature Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
          position: 'relative',
          zIndex: 1,
        }}>
          {features.map((feature, i) => (
            <motion.div
              key={feature.text}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: 14,
                padding: '18px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
              }}
            >
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <feature.icon size={20} color="white" />
              </div>
              <div style={{
                fontSize: 14,
                fontWeight: 500,
                lineHeight: 1.4,
              }}>
                {feature.text}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ─── RIGHT PANEL: LOGIN FORM ─── */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          width: 520,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '48px 56px',
          background: COLORS.bgSurface,
          overflowY: 'auto',
        }}
      >
        {/* Mobile Logo */}
        <div className="show-mobile" style={{
          display: 'none',
          marginBottom: 40,
        }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <NeuraScanLogo size={40} />
          </Link>
        </div>

        {/* Form Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ marginBottom: 36 }}
        >
          <h2 style={{
            fontSize: 30,
            fontWeight: 800,
            color: COLORS.textPrimary,
            marginBottom: 10,
            letterSpacing: '-0.02em',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            Welcome Back
          </h2>
          <p style={{
            fontSize: 15,
            color: COLORS.textSecondary,
            lineHeight: 1.6,
          }}>
            Sign in to your account to continue. New here?{' '}
            <Link
              to="/register"
              style={{
                color: COLORS.primary,
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              Create an account
            </Link>
          </p>
        </motion.div>

        {/* Session Expired Alert */}
        {expired && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: COLORS.errorBg,
              border: `1px solid ${COLORS.error}30`,
              borderRadius: 12,
              padding: '14px 16px',
              marginBottom: 24,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: COLORS.error,
            }} />
            <div style={{
              color: COLORS.error,
              fontWeight: 600,
              fontSize: 14,
            }}>
              Your session has expired. Please sign in again.
            </div>
          </motion.div>
        )}

        {/* Role Selection Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{ marginBottom: 28 }}
        >
          <label style={{
            display: 'block',
            fontSize: 13,
            fontWeight: 600,
            color: COLORS.textMuted,
            marginBottom: 10,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            Login as
          </label>
          <div style={{ display: 'flex', gap: 12 }}>
            {TABS.map(t => (
              <motion.button
                key={t.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setTab(t.id)}
                style={{
                  flex: 1,
                  padding: '14px 20px',
                  border: tab === t.id ? `2px solid ${COLORS.primary}` : `1px solid ${COLORS.border}`,
                  background: tab === t.id ? COLORS.primaryBg : COLORS.bgSurface,
                  borderRadius: 12,
                  color: tab === t.id ? COLORS.primary : COLORS.textSecondary,
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                <t.icon size={18} />
                {t.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Google Sign In Button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={handleGoogleLogin}
          style={{
            width: '100%',
            padding: '14px 20px',
            border: `1px solid ${COLORS.border}`,
            background: COLORS.bgSurface,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            marginBottom: 24,
            fontWeight: 600,
            fontSize: 14,
            color: COLORS.textPrimary,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontFamily: "'Inter', sans-serif",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = COLORS.bgSubtle
            e.currentTarget.style.borderColor = COLORS.primary
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = COLORS.bgSurface
            e.currentTarget.style.borderColor = COLORS.border
          }}
        >
          {/* Google Logo */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </motion.button>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          margin: '20px 0',
        }}>
          <div style={{ flex: 1, height: 1, background: COLORS.border }} />
          <span style={{ fontSize: 13, color: COLORS.textMuted, fontWeight: 500 }}>
            OR
          </span>
          <div style={{ flex: 1, height: 1, background: COLORS.border }} />
        </div>

        {/* Login Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
        >
          {/* Email Input */}
          <div>
            <label style={{
              display: 'block',
              fontSize: 13,
              fontWeight: 600,
              color: COLORS.textPrimary,
              marginBottom: 8,
            }}>
              Email Address
            </label>
            <input
              type="email"
              value={form.email}
              onChange={e => {
                setForm(f => ({ ...f, email: e.target.value }))
                setErrors(er => ({ ...er, email: '' }))
              }}
              placeholder="you@school.edu"
              style={{
                width: '100%',
                padding: '14px 16px',
                border: errors.email ? `2px solid ${COLORS.error}` : `1px solid ${COLORS.border}`,
                borderRadius: 10,
                fontSize: 14,
                background: COLORS.bgSurface,
                color: COLORS.textPrimary,
                transition: 'all 0.2s ease',
                fontFamily: "'Inter', sans-serif",
                boxSizing: 'border-box',
              }}
              onFocus={e => {
                if (!errors.email) {
                  e.target.style.borderColor = COLORS.primary
                  e.target.style.boxShadow = `0 0 0 3px ${COLORS.primaryBg}`
                }
              }}
              onBlur={e => {
                e.target.style.boxShadow = 'none'
                if (!errors.email) e.target.style.borderColor = COLORS.border
              }}
            />
            {errors.email && (
              <div style={{ color: COLORS.error, fontSize: 13, marginTop: 6, fontWeight: 500 }}>
                {errors.email}
              </div>
            )}
          </div>

          {/* Password Input */}
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
            }}>
              <label style={{
                fontSize: 13,
                fontWeight: 600,
                color: COLORS.textPrimary,
              }}>
                Password
              </label>
              <Link
                to="/forgot-password"
                style={{
                  fontSize: 13,
                  color: COLORS.primary,
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              value={form.password}
              onChange={e => {
                setForm(f => ({ ...f, password: e.target.value }))
                setErrors(er => ({ ...er, password: '' }))
              }}
              placeholder="Enter your password"
              style={{
                width: '100%',
                padding: '14px 16px',
                border: errors.password ? `2px solid ${COLORS.error}` : `1px solid ${COLORS.border}`,
                borderRadius: 10,
                fontSize: 14,
                background: COLORS.bgSurface,
                color: COLORS.textPrimary,
                transition: 'all 0.2s ease',
                fontFamily: "'Inter', sans-serif",
                boxSizing: 'border-box',
              }}
              onFocus={e => {
                if (!errors.password) {
                  e.target.style.borderColor = COLORS.primary
                  e.target.style.boxShadow = `0 0 0 3px ${COLORS.primaryBg}`
                }
              }}
              onBlur={e => {
                e.target.style.boxShadow = 'none'
                if (!errors.password) e.target.style.borderColor = COLORS.border
              }}
            />
            {errors.password && (
              <div style={{ color: COLORS.error, fontSize: 13, marginTop: 6, fontWeight: 500 }}>
                {errors.password}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            type="submit"
            style={{
              width: '100%',
              padding: '16px 20px',
              background: loading ? COLORS.textMuted : `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
              color: 'white',
              border: 'none',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              marginTop: 8,
              boxShadow: '0 4px 14px rgba(49, 46, 129, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}
          >
            {loading ? 'Signing in...' : `Sign In as ${tab === 'teacher' ? 'Teacher' : 'Parent'}`}
            {!loading && <ArrowRight size={18} />}
          </motion.button>
        </motion.form>

        {/* Footer Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            marginTop: 32,
            textAlign: 'center',
            fontSize: 12,
            color: COLORS.textMuted,
            lineHeight: 1.8,
          }}
        >
          By signing in, you agree to our{' '}
          <Link to="/terms" style={{ color: COLORS.primary, textDecoration: 'none', fontWeight: 600 }}>
            Terms of Service
          </Link>
          {' '}and{' '}
          <Link to="/privacy" style={{ color: COLORS.primary, textDecoration: 'none', fontWeight: 600 }}>
            Privacy Policy
          </Link>
        </motion.div>
      </motion.div>

      {/* Mobile Responsive Styles */}
      <style>{`
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: block !important; }
        }
      `}</style>
    </div>
  )
}
