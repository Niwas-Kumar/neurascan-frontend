import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { authAPI } from '../../services/api'
import toast from 'react-hot-toast'
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
  successBg: 'rgba(20, 184, 166, 0.1)',
}

export default function ResetPasswordPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const token = params.get('token')

  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)
  const [done, setDone] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')

  const mismatch = confirm.length > 0 && password !== confirm

  // Verify token on mount
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (mismatch) return
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    setError('')
    try {
      await authAPI.resetPassword({ token, newPassword: password })
      setDone(true)
      toast.success('Password reset successfully!')
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to reset password'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  // Loading state while verifying token
  if (verifying) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'rgba(241, 245, 249, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Loader2 size={32} color={COLORS.primary} style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: 16, color: COLORS.textMuted }}>Verifying your reset link...</p>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  // Invalid/expired token
  if (!token || !tokenValid) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'rgba(241, 245, 249, 0.3)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <NeuraScanLogo size={36} />
          </Link>
        </header>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div
            style={{
              width: '100%',
              maxWidth: 400,
              background: COLORS.bgCard,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 12,
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
              padding: 32,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: COLORS.errorBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <XCircle size={28} color={COLORS.error} />
            </div>
            <h2
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 20,
                fontWeight: 700,
                color: COLORS.textPrimary,
                marginBottom: 8,
              }}
            >
              Link expired
            </h2>
            <p style={{ fontSize: 14, color: COLORS.textMuted, marginBottom: 24 }}>
              This reset link is invalid or has expired. Please request a new one.
            </p>
            <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
              <button
                style={{
                  width: '100%',
                  height: 44,
                  background: COLORS.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Request new link
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

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
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <NeuraScanLogo size={36} />
        </Link>
      </header>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
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
              {done ? (
                <>
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      background: COLORS.successBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                    }}
                  >
                    <CheckCircle2 size={28} color={COLORS.primary} />
                  </div>
                  <h1
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: 24,
                      fontWeight: 700,
                      color: COLORS.textPrimary,
                      marginBottom: 8,
                    }}
                  >
                    Password reset!
                  </h1>
                  <p style={{ fontSize: 14, color: COLORS.textMuted }}>
                    Your password has been updated. You can now sign in.
                  </p>
                </>
              ) : (
                <>
                  <h1
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: 24,
                      fontWeight: 700,
                      color: COLORS.textPrimary,
                      marginBottom: 8,
                    }}
                  >
                    Reset your password
                  </h1>
                  <p style={{ fontSize: 14, color: COLORS.textMuted }}>Choose a new secure password</p>
                </>
              )}
            </div>

            {/* Card Content */}
            <div style={{ padding: '16px 24px 24px' }}>
              {done ? (
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <button
                    style={{
                      width: '100%',
                      height: 44,
                      background: COLORS.primary,
                      color: 'white',
                      border: 'none',
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 500,
                      cursor: 'pointer',
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Sign in
                  </button>
                </Link>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {error && (
                    <div
                      style={{
                        padding: '12px 16px',
                        background: COLORS.errorBg,
                        borderRadius: 8,
                        fontSize: 14,
                        color: COLORS.error,
                      }}
                    >
                      {error}
                    </div>
                  )}

                  {/* New Password */}
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
                      New password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showNew ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min. 8 characters"
                        required
                        minLength={8}
                        style={{
                          width: '100%',
                          height: 44,
                          padding: '0 40px 0 12px',
                          border: `1px solid ${COLORS.border}`,
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
                        onClick={() => setShowNew(!showNew)}
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
                        {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
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
                      Confirm password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        placeholder="Re-enter password"
                        required
                        style={{
                          width: '100%',
                          height: 44,
                          padding: '0 40px 0 12px',
                          border: `1px solid ${mismatch ? COLORS.error : COLORS.border}`,
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
                        onClick={() => setShowConfirm(!showConfirm)}
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
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {mismatch && (
                      <p style={{ marginTop: 4, fontSize: 12, color: COLORS.error }}>Passwords do not match</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || mismatch || password.length < 8}
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
                      cursor: loading || mismatch || password.length < 8 ? 'not-allowed' : 'pointer',
                      opacity: loading || mismatch || password.length < 8 ? 0.7 : 1,
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                        Updating...
                      </>
                    ) : (
                      'Reset password'
                    )}
                  </button>
                </form>
              )}
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
