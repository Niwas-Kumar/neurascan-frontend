import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../../services/api'
import toast from 'react-hot-toast'
import { NeuraScanLogo } from '../../components/shared/Logo'

// Color constants
const COLORS = {
  primary: '#14B8A6',
  primaryDark: '#0D9488',
  sidebar: '#312E81',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  bgBase: '#F9FAFB',
  bgSurface: '#FFFFFF',
  danger: '#EF4444',
  success: '#10B981',
}

// Font constants
const FONTS = {
  display: "'Plus Jakarta Sans', sans-serif",
  body: "'Inter', sans-serif",
}

// Input component
const Input = ({ label, type = 'text', value, onChange, placeholder, error, required }) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div style={{ marginBottom: 20 }}>
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: 14,
            fontWeight: 500,
            fontFamily: FONTS.body,
            color: COLORS.textSecondary,
            marginBottom: 8,
          }}
        >
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={{
          width: '100%',
          padding: '12px 16px',
          border: isFocused
            ? `2px solid ${COLORS.primary}`
            : `1px solid ${error ? COLORS.danger : COLORS.border}`,
          borderRadius: 8,
          fontSize: 14,
          fontFamily: FONTS.body,
          color: COLORS.textPrimary,
          backgroundColor: COLORS.bgSurface,
          outline: 'none',
          transition: 'all 0.2s ease',
          boxSizing: 'border-box',
          boxShadow: isFocused ? `0 0 0 3px ${COLORS.primary}20` : 'none',
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {error && (
        <div
          style={{
            marginTop: 6,
            fontSize: 12,
            fontFamily: FONTS.body,
            color: COLORS.danger,
          }}
        >
          {error}
        </div>
      )}
    </div>
  )
}

// Button component
const Button = ({ children, onClick, type = 'button', loading, disabled, fullWidth }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      style={{
        width: fullWidth ? '100%' : 'auto',
        padding: '14px 24px',
        backgroundColor: isHovered && !loading && !disabled ? COLORS.primaryDark : COLORS.primary,
        color: '#FFFFFF',
        border: 'none',
        borderRadius: 8,
        fontSize: 15,
        fontWeight: 600,
        fontFamily: FONTS.body,
        cursor: loading || disabled ? 'not-allowed' : 'pointer',
        opacity: loading || disabled ? 0.6 : 1,
        transition: 'all 0.2s ease',
        transform: isHovered && !loading && !disabled ? 'translateY(-1px)' : 'translateY(0)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {loading ? 'Sending...' : children}
    </button>
  )
}

// Alert component
const Alert = ({ type, children, onClose }) => {
  const bgColor = type === 'danger' ? `${COLORS.danger}10` : `${COLORS.success}10`
  const borderColor = type === 'danger' ? `${COLORS.danger}40` : `${COLORS.success}40`
  const textColor = type === 'danger' ? COLORS.danger : COLORS.success

  return (
    <div
      style={{
        padding: '12px 16px',
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: 8,
        color: textColor,
        fontSize: 13,
        fontFamily: FONTS.body,
        marginBottom: 20,
        lineHeight: 1.6,
      }}
    >
      {children}
    </div>
  )
}

// Mail Icon component
const MailIcon = ({ size = 24, color = COLORS.primary }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

// Check Circle Icon component
const CheckCircleIcon = ({ size = 32, color = COLORS.success }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
)

// Arrow Left Icon component
const ArrowLeftIcon = ({ size = 14, color = COLORS.textSecondary }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
)

// Brain Icon component
const BrainIcon = ({ size = 18, color = '#FFFFFF' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
  </svg>
)

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Form validation
    if (!email) {
      setError('Email is required')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)
    setError('')

    try {
      await authAPI.forgotPassword({ email })
      setSent(true)
      toast.success('Reset link sent!')
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send reset email'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleResend = () => {
    setSent(false)
    setError('')
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.bgBase,
        padding: 20,
        fontFamily: FONTS.body,
      }}
    >
      {/* Card Container */}
      <div
        style={{
          width: '100%',
          maxWidth: 440,
          backgroundColor: COLORS.bgSurface,
          borderRadius: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)',
          border: `1px solid ${COLORS.border}`,
          overflow: 'hidden',
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            height: 4,
            backgroundColor: COLORS.primary,
          }}
        />

        {/* Card Content */}
        <div style={{ padding: '36px 40px' }}>
          {/* Logo */}
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              display: 'block',
              marginBottom: 40,
            }}
          >
            <NeuraScanLogo size={34} />
          </Link>

          {!sent ? (
            <>
              {/* Header Section */}
              <div style={{ marginBottom: 28 }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 13,
                    backgroundColor: `${COLORS.primary}15`,
                    border: `1px solid ${COLORS.primary}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 18,
                  }}
                >
                  <MailIcon size={24} color={COLORS.primary} />
                </div>
                <h1
                  style={{
                    fontFamily: FONTS.display,
                    fontSize: 24,
                    fontWeight: 700,
                    letterSpacing: '-0.5px',
                    marginBottom: 8,
                    marginTop: 0,
                    color: COLORS.textPrimary,
                  }}
                >
                  Forgot password?
                </h1>
                <p
                  style={{
                    color: COLORS.textSecondary,
                    fontSize: 14,
                    lineHeight: 1.7,
                    margin: 0,
                    fontFamily: FONTS.body,
                  }}
                >
                  No worries - enter your email and we'll send you a reset link.
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert type="danger" onClose={() => setError('')}>
                  {error}
                </Alert>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <Input
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError('')
                  }}
                  placeholder="you@school.edu"
                  required
                  error={error && !email ? 'Email is required' : ''}
                />
                <div style={{ marginTop: 8 }}>
                  <Button type="submit" fullWidth loading={loading}>
                    Send reset link
                  </Button>
                </div>
              </form>
            </>
          ) : (
            /* Success State */
            <div style={{ textAlign: 'center', paddingTop: 8 }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  backgroundColor: `${COLORS.success}10`,
                  border: `2px solid ${COLORS.success}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                }}
              >
                <CheckCircleIcon size={32} color={COLORS.success} />
              </div>
              <h2
                style={{
                  fontFamily: FONTS.display,
                  fontSize: 22,
                  fontWeight: 700,
                  marginBottom: 8,
                  marginTop: 0,
                  color: COLORS.textPrimary,
                }}
              >
                Check your email
              </h2>
              <p
                style={{
                  color: COLORS.textSecondary,
                  fontSize: 14,
                  fontFamily: FONTS.body,
                  lineHeight: 1.7,
                  marginBottom: 24,
                }}
              >
                We've sent a password reset link to{' '}
                <strong style={{ color: COLORS.textPrimary }}>{email}</strong>.
                Check your inbox and follow the instructions.
              </p>
              <p
                style={{
                  fontSize: 12,
                  fontFamily: FONTS.body,
                  color: COLORS.textMuted,
                  marginBottom: 20,
                }}
              >
                Didn't receive it?{' '}
                <button
                  onClick={handleResend}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: COLORS.primary,
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 600,
                    fontFamily: FONTS.body,
                    padding: 0,
                  }}
                >
                  Resend
                </button>
              </p>
            </div>
          )}

          {/* Back to Home Link */}
          <div
            style={{
              marginTop: 24,
              paddingTop: 20,
              borderTop: `1px solid ${COLORS.border}`,
              textAlign: 'center',
            }}
          >
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 13,
                fontFamily: FONTS.body,
                color: COLORS.textSecondary,
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              <ArrowLeftIcon size={14} color={COLORS.textSecondary} />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
