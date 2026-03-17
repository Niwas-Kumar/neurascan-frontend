import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brain, Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { authAPI } from '../../services/api'
import { Button, Input, Alert } from '../../components/shared/UI'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) { setError('Email is required'); return }
    setLoading(true)
    try {
      await authAPI.forgotPassword({ email })
      setSent(true)
      toast.success('Reset link sent!')
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send reset email'
      setError(msg)
    } finally {
      setLoading(false)
    }
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

          {!sent ? (
            <>
              <div style={{ marginBottom: 28 }}>
                <div style={{ width: 52, height: 52, borderRadius: 13, background: '#e8f0fe', border: '1px solid rgba(26,115,232,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  <Mail size={24} color="#1a73e8" />
                </div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 8 }}>
                  Forgot password?
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7 }}>
                  No worries — enter your email and we'll send you a reset link.
                </p>
              </div>

              {error && <Alert type="danger" onClose={() => setError('')}>{error}</Alert>}

              <form onSubmit={handleSubmit}>
                <Input
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError('') }}
                  placeholder="you@school.edu"
                  required
                  error={error && !email ? 'Email is required' : ''}
                />
                <Button type="submit" fullWidth size="lg" loading={loading} style={{ marginTop: 8 }}>
                  Send reset link
                </Button>
              </form>

              {/* Calls POST /api/auth/forgot-password → backend generates token and sends email (or logs link to console) */}
            </>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', paddingTop: 8 }}>
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 18, stiffness: 300, delay: 0.1 }}
                style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--success-dim)', border: '2px solid var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 0 24px var(--success-glow)' }}
              >
                <CheckCircle size={32} color="var(--success)" />
              </motion.div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Check your email</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
                We've sent a password reset link to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>. Check your inbox and follow the instructions.
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>
                Didn't receive it?{' '}
                <button onClick={() => setSent(false)} style={{ background: 'none', border: 'none', color: 'var(--violet-soft)', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                  Resend
                </button>
              </p>
            </motion.div>
          )}

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
