import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle, AlertTriangle, Mail } from 'lucide-react'
import { authAPI } from '../../services/api'
import { NeuraScanLogo } from '../../components/shared/Logo'

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
          background: 'white', border: '1px solid var(--border)',
          borderRadius: 16, overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ height: 4, background: 'var(--primary)' }} />
        <div style={{ padding: '36px 40px' }}>
          {/* Logo */}
          <div style={{ marginBottom: 40 }}>
            <NeuraScanLogo size={34} />
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
