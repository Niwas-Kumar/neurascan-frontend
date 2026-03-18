import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brain, Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { authAPI } from '../../services/api'
import toast from 'react-hot-toast'

const Input = ({ label, type = 'text', value, onChange, placeholder, error, required }) => {
  const [isFocused, setIsFocused] = useState(false)
  return (
    <div style={{ marginBottom: 18 }}>
      {label && <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>{label}</label>}
      <input 
        type={type} 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder} 
        required={required} 
        style={{ 
          width: '100%', 
          padding: '12px 14px', 
          border: isFocused ? '2px solid var(--primary)' : `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`, 
          borderRadius: 'var(--radius-lg)', 
          fontSize: 14, 
          color: 'var(--text-primary)', 
          background: 'var(--bg-surface)', 
          transition: 'all 0.3s ease',
          boxShadow: isFocused ? '0 0 0 3px rgba(26, 115, 232, 0.15)' : 'none'
        }} 
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {error && <div style={{ marginTop: 4, fontSize: 12, color: 'var(--danger)' }}>{error}</div>}
    </div>
  )
}

const Button = ({ fullWidth, size = 'md', loading, children, onClick, disabled, type = 'button' }) => {
  const sizeMap = { lg: { padding: '14px 20px', fontSize: 15 }, md: { padding: '10px 16px', fontSize: 14 } }
  const sz = sizeMap[size]
  return (<button type={type} onClick={onClick} disabled={loading || disabled} style={{ ...sz, width: fullWidth ? '100%' : 'auto', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-lg)', fontWeight: 600, cursor: loading || disabled ? 'not-allowed' : 'pointer', transition: 'all 0.3s cubic-bezier(0.2, 0, 0, 1)', opacity: loading || disabled ? 0.6 : 1 }} onMouseEnter={e => { if (!loading && !disabled) { e.target.style.background = 'var(--primary-dark)'; e.target.style.transform = 'translateY(-1px)' } }} onMouseLeave={e => { e.target.style.background = 'var(--primary)'; e.target.style.transform = 'translateY(0)' }}>{children}</button>)
}

const Alert = ({ type, children }) => {
  const colorMap = { danger: 'var(--danger)', warning: 'var(--warning)' }
  const bgMap = { danger: 'rgba(239, 68, 68, 0.08)', warning: 'rgba(245, 158, 11, 0.08)' }
  return (<div style={{ padding: '12px 14px', background: bgMap[type], border: `1px solid ${colorMap[type]}40`, borderRadius: 'var(--radius-md)', color: colorMap[type], fontSize: 13, marginBottom: 18, lineHeight: 1.6 }}>{children}</div>)
}

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
        <div style={{ height: 4, background: 'var(--primary)' }} />
        <div style={{ padding: '36px 40px' }}>
          {/* Logo - Clickable to go home */}
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40, transition: 'all 0.3s ease' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <div style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Brain size={18} color="#fff" strokeWidth={2.5} />
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'var(--text-primary)' }}>NeuraScan</span>
            </div>
          </Link>

          {!sent ? (
            <>
              <div style={{ marginBottom: 28 }}>
                <div style={{ width: 52, height: 52, borderRadius: 13, background: 'rgba(26, 115, 232, 0.08)', border: '1px solid rgba(26, 115, 232, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  <Mail size={24} color="var(--primary)" />
                </div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 8, color: 'var(--text-primary)' }}>
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
                style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.08)', border: '2px solid var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}
              >
                <CheckCircle size={32} color="var(--success)" />
              </motion.div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>Check your email</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
                We've sent a password reset link to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>. Check your inbox and follow the instructions.
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>
                Didn't receive it?{' '}
                <button onClick={() => setSent(false)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'all 0.3s ease' }} onMouseEnter={e => e.target.style.textDecoration = 'underline'} onMouseLeave={e => e.target.style.textDecoration = 'none'}>
                  Resend
                </button>
              </p>
            </motion.div>
          )}

          <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border)', textAlign: 'center' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 }}>
              <ArrowLeft size={14} /> Back to Home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
