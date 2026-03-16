import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brain, ArrowLeft, CheckCircle, AlertTriangle, Mail } from 'lucide-react'
import { authAPI } from '../../services/api'
import { Button } from '../../components/shared/UI'

export default function VerifyEmailPage() {
  const [params]    = useSearchParams()
  const token       = params.get('token')

  const [loading, setLoading]   = useState(true)
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    authAPI.verifyEmail(token)
      .then(() => setVerified(true))
      .catch(() => setVerified(false))
      .finally(() => setLoading(false))
  }, [token])

  const renderContent = () => {
    if (loading) {
      return (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Verifying your email…</p>
        </div>
      )
    }

    if (!token || !verified) {
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
            Verification Failed
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
            This verification link is invalid or has expired. Try logging in — a new verification email will be sent automatically.
          </p>
          <Link to="/login">
            <Button variant="primary" size="md">Go to Login</Button>
          </Link>
        </div>
      )
    }

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
          Email Verified!
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
          Your email has been verified successfully. You can now sign in to your account.
        </p>
        <Link to="/login">
          <Button variant="primary" size="lg" fullWidth>
            Sign in
          </Button>
        </Link>
      </motion.div>
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
