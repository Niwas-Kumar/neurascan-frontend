import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brain, Lock, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react'
import { authAPI } from '../../services/api'
import toast from 'react-hot-toast'

// ── Inline Button Component ────────────────────────────
const Button = ({ children, type = 'button', fullWidth = false, size = 'md', loading = false, style = {}, ...props }) => {
  const heights = { sm: 36, md: 40, lg: 44 }
  const paddings = { sm: '8px 16px', md: '12px 20px', lg: '14px 24px' }
  const [isHovering, setIsHovering] = useState(false)

  return (
    <button
      type={type}
      disabled={loading}
      style={{
        width: fullWidth ? '100%' : 'auto',
        height: heights[size],
        padding: paddings[size],
        background: isHovering ? 'var(--primary-hover)' : 'var(--primary)',
        color: 'white',
        border: 'none',
        borderRadius: 'var(--radius-lg)',
        fontSize: size === 'sm' ? 13 : size === 'lg' ? 15 : 14,
        fontWeight: 600,
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.7 : 1,
        transition: 'all 0.3s cubic-bezier(0.2, 0, 0, 1)',
        boxShadow: isHovering ? '0 4px 16px rgba(26, 115, 232, 0.3)' : 'none',
        ...style,
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      {...props}
    >
      {loading ? '...' : children}
    </button>
  )
}

// ── Inline Input Component ────────────────────────────
const Input = ({ label, type = 'text', placeholder, value, onChange, required = false, style = {} }) => {
  const [isFocused, setIsFocused] = useState(false)
  
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label style={{
          display: 'block',
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--text-primary)',
          marginBottom: 8,
        }}>
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        style={{
          width: '100%',
          padding: '12px 14px',
          fontSize: 14,
          border: isFocused ? '2px solid var(--primary)' : '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          background: 'white',
          color: 'var(--text-primary)',
          transition: 'all 0.2s ease',
          boxSizing: 'border-box',
          fontFamily: 'inherit',
          ...style,
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  )
}

// ── Inline Alert Component ────────────────────────────
const Alert = ({ type = 'info', children, onClose }) => {
  const colors = {
    danger: { bg: 'var(--danger-dim)', border: 'var(--danger-glow)', text: 'var(--danger)' },
    warning: { bg: 'var(--warning-dim)', border: 'var(--warning-glow)', text: 'var(--warning)' },
    success: { bg: 'var(--success-dim)', border: 'var(--success-glow)', text: 'var(--success)' },
    info: { bg: 'var(--primary-dim)', border: 'var(--primary-glow)', text: 'var(--primary)' },
  }
  const color = colors[type] || colors.info

  return (
    <div style={{
      background: color.bg,
      border: `1px solid ${color.border}`,
      borderRadius: 'var(--radius)',
      padding: '12px 14px',
      marginBottom: 16,
      fontSize: 13,
      color: color.text,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <span>{children}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: color.text, cursor: 'pointer', fontSize: 18, padding: 0 }}
        >
          ×
        </button>
      )}
    </div>
  )
}

export default function ResetPasswordPage() {
  const [params]    = useSearchParams()
  const navigate    = useNavigate()
  const token       = params.get('token')

  const [loading, setLoading]       = useState(false)
  const [verifying, setVerifying]   = useState(true)
  const [tokenValid, setTokenValid] = useState(false)
  const [done, setDone]             = useState(false)
  const [error, setError]           = useState('')

  const [password, setPassword]         = useState('')
  const [confirmPassword, setConfirm]   = useState('')

  // ── Verify token on mount ──────────────────────────────────
  useEffect(() => {
    if (!token) {
      setVerifying(false)
      return
    }
    authAPI.verifyResetToken(token)
      .then(() => setTokenValid(true))
      .catch(() => setTokenValid(false))
      .finally(() => setVerifying(false))
  }, [token])

  // ── Submit new password ────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      await authAPI.resetPassword({ token, newPassword: password })
      setDone(true)
      toast.success('Password reset successfully!')
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to reset password'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  // ── Render ──────────────────────────────────────────────────
  const renderContent = () => {
    // Still checking token
    if (verifying) {
      return (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Verifying your reset link…</p>
        </div>
      )
    }

    // No token or invalid token
    if (!token || !tokenValid) {
      return (
        <div style={{ textAlign: 'center', paddingTop: 8 }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'rgba(239,68,68,0.1)', border: '2px solid var(--danger)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <AlertTriangle size={32} color="var(--danger)" />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
            Invalid or Expired Link
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
            This password reset link is no longer valid. It may have expired or already been used.
          </p>
          <Link to="/forgot-password">
            <Button variant="primary" size="md">Request a new link</Button>
          </Link>
        </div>
      )
    }

    // Success state
    if (done) {
      return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', paddingTop: 8 }}>
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 18, stiffness: 300, delay: 0.1 }}
            style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'var(--success-dim)', border: '2px solid var(--success)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px', boxShadow: '0 0 24px var(--success-glow)',
            }}
          >
            <CheckCircle size={32} color="var(--success)" />
          </motion.div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
            Password Updated!
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
            Your password has been reset successfully. You can now sign in with your new password.
          </p>
          <Button variant="primary" size="lg" fullWidth onClick={() => navigate('/login')}>
            Sign in
          </Button>
        </motion.div>
      )
    }

    // Reset form
    return (
      <>
        <div style={{ marginBottom: 28 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 13,
            background: 'var(--primary-dim)', border: `1px solid var(--primary-glow)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18,
          }}>
            <Lock size={24} color="var(--primary)" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 8 }}>
            Set new password
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7 }}>
            Your new password must be at least 6 characters long.
          </p>
        </div>

        {error && <Alert type="danger" onClose={() => setError('')}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <Input
            label="New password"
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError('') }}
            placeholder="Enter new password"
            required
          />
          <Input
            label="Confirm password"
            type="password"
            value={confirmPassword}
            onChange={e => { setConfirm(e.target.value); setError('') }}
            placeholder="Confirm new password"
            required
          />
          <Button type="submit" fullWidth size="lg" loading={loading} style={{ marginTop: 8 }}>
            Reset password
          </Button>
        </form>
      </>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)', padding: 20, position: 'relative' }}>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          width: '100%', maxWidth: 440,
          background: 'white', border: '1px solid var(--border)',
          borderRadius: 16, overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ height: 4, background: 'var(--primary)' }} />
        <div style={{ padding: '36px 40px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Brain size={18} color="#fff" strokeWidth={2.5} />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'var(--text-primary)' }}>NeuraScan</span>
          </div>

          {renderContent()}

          <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border)', textAlign: 'center' }}>
            <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 }}>
              <ArrowLeft size={14} /> Back to sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
