import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brain, GraduationCap, Users, ArrowRight, LogIn } from 'lucide-react'
import { authAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { PremiumButton, Badge } from '../../components/shared/PremiumUI.jsx'
import PremiumAuthLayout from '../../components/auth/PremiumAuthLayout'
import toast from 'react-hot-toast'

import { auth, googleProvider, GoogleAuthProvider, signInWithPopup } from '../../firebase'

const TABS = [
  { id: 'teacher', label: '🎓 Teacher', icon: GraduationCap },
  { id: 'parent',  label: '👨‍👩‍👧 Parent',  icon: Users },
]

export default function LoginPage() {
  const { login }    = useAuth()
  const navigate     = useNavigate()
  const [params]     = useSearchParams()
  const expired      = params.get('session') === 'expired'

  const [tab, setTab]       = useState('teacher')
  const [loading, setLoading] = useState(false)
  const [form, setForm]     = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.email)    e.email    = 'Email is required'
    if (!form.password) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const fn  = tab === 'teacher' ? authAPI.teacherLogin : authAPI.parentLogin
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
    const id = toast.loading('🔐 Signing in with Google...')
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

  return (
    <PremiumAuthLayout
      title="Sign In"
      subtitle="Welcome back to NeuraScan. Sign in to continue."
    >
      {expired && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: '#fce8e6',
            border: '1px solid #f5b6b0',
            borderRadius: 'var(--radius-lg)',
            padding: '12px 16px',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div style={{ color: '#d93025', fontWeight: 600, fontSize: 'var(--text-sm)' }}>
            ⚠️ Session expired. Please sign in again.
          </div>
        </motion.div>
      )}

      {/* Role Selection */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ marginBottom: 24 }}
      >
        <label style={{
          display: 'block',
          fontSize: 'var(--text-xs)',
          fontWeight: 700,
          color: 'var(--color-text-muted)',
          marginBottom: 12,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
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
                padding: '12px 16px',
                border: tab === t.id ? '2px solid var(--color-primary)' : '2px solid var(--color-border)',
                background: tab === t.id ? 'var(--color-primary-background)' : 'transparent',
                borderRadius: 'var(--radius-md)',
                color: tab === t.id ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                fontWeight: 600,
                fontSize: 'var(--text-sm)',
                cursor: 'pointer',
                transition: 'all var(--duration-fast) var(--easing-out)',
              }}
            >
              {t.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Google Sign In */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onClick={handleGoogleLogin}
        style={{
          width: '100%',
          padding: '12px 16px',
          border: '1px solid var(--color-border)',
          background: 'white',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          marginBottom: 16,
          fontWeight: 600,
          fontSize: 'var(--text-sm)',
          color: 'var(--color-text-primary)',
          cursor: 'pointer',
          transition: 'all var(--duration-fast) var(--easing-out)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'var(--color-background)'
          e.currentTarget.style.borderColor = 'var(--color-primary)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'white'
          e.currentTarget.style.borderColor = 'var(--color-border)'
        }}
      >
        <img src="https://www.gstatic.com/images/branding/product/1x/googleg_40dp.png" alt="Google" style={{ width: 18, height: 18 }} />
        Continue with Google
      </motion.button>

      {/* Divider */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        margin: '20px 0',
      }}>
        <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 600 }}>OR</span>
        <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
      </div>

      {/* Login Form */}
      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
      >
        {/* Email Input */}
        <div>
          <label style={{
            display: 'block',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            marginBottom: 8,
            color: 'var(--color-text-primary)',
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
              padding: '12px 14px',
              border: errors.email ? '2px solid #d93025' : '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-sm)',
              background: 'var(--color-background)',
              color: 'var(--color-text-primary)',
              transition: 'all var(--duration-fast) var(--easing-out)',
              fontFamily: 'var(--font-body)',
            }}
            onFocus={e => {
              if (!errors.email) e.target.style.borderColor = 'var(--color-primary)'
            }}
            onBlur={e => {
              if (!errors.email) e.target.style.borderColor = 'var(--color-border)'
            }}
          />
          {errors.email && (
            <div style={{ color: '#d93025', fontSize: 'var(--text-xs)', marginTop: 4 }}>
              {errors.email}
            </div>
          )}
        </div>

        {/* Password Input */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <label style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
            }}>
              Password
            </label>
            <Link
              to="/forgot-password"
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--color-primary)',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              Forgot?
            </Link>
          </div>
          <input
            type="password"
            value={form.password}
            onChange={e => {
              setForm(f => ({ ...f, password: e.target.value }))
              setErrors(er => ({ ...er, password: '' }))
            }}
            placeholder="••••••••"
            style={{
              width: '100%',
              padding: '12px 14px',
              border: errors.password ? '2px solid #d93025' : '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-sm)',
              background: 'var(--color-background)',
              color: 'var(--color-text-primary)',
              transition: 'all var(--duration-fast) var(--easing-out)',
              fontFamily: 'var(--font-body)',
            }}
            onFocus={e => {
              if (!errors.password) e.target.style.borderColor = 'var(--color-primary)'
            }}
            onBlur={e => {
              if (!errors.password) e.target.style.borderColor = 'var(--color-border)'
            }}
          />
          {errors.password && (
            <div style={{ color: '#d93025', fontSize: 'var(--text-xs)', marginTop: 4 }}>
              {errors.password}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <PremiumButton
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            marginTop: 8,
          }}
        >
          {loading ? '🔐 Signing in...' : `Sign In as ${tab === 'teacher' ? 'Teacher' : 'Parent'}`}
        </PremiumButton>
      </motion.form>

      {/* Sign Up Link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          marginTop: 20,
          textAlign: 'center',
          fontSize: 'var(--text-sm)',
          color: 'var(--color-text-secondary)',
        }}
      >
        Don't have an account?{' '}
        <Link
          to="/register"
          style={{
            color: 'var(--color-primary)',
            textDecoration: 'none',
            fontWeight: 700,
          }}
        >
          Create one
        </Link>
      </motion.div>
    </PremiumAuthLayout>
  )
}
