import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brain, Lock, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react'
import { authAPI } from '../../services/api'
import { Button, Input, Alert } from '../../components/shared/UI'
import toast from 'react-hot-toast'

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
            background: '#e8f0fe', border: '1px solid rgba(26,115,232,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18,
          }}>
            <Lock size={24} color="var(--violet-soft)" />
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
          background: '#fff', border: '1px solid #e8eaed',
          borderRadius: 16, overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ height: 4, background: '#1a73e8' }} />
        <div style={{ padding: '36px 40px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: '#1a73e8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Brain size={18} color="#fff" strokeWidth={2.5} />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: '#202124' }}>NeuraScan</span>
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
