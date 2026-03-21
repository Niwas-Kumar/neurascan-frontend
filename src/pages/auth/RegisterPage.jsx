import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, Users, ArrowRight, ArrowLeft, Check, KeyRound, AlertCircle } from 'lucide-react'
import { authAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { NeuraScanLogo } from '../../components/shared/Logo.jsx'
import toast from 'react-hot-toast'

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
  success: '#047857',
  successBg: '#ECFDF5',
  error: '#B91C1C',
  errorBg: '#FEF2F2',

  // Borders
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
}

// ════════════════════════════════════════════════════════════════
// REUSABLE COMPONENTS
// ════════════════════════════════════════════════════════════════

function Input({ label, type = 'text', value, onChange, placeholder, error, hint, inputRef, style }) {
  const [isFocused, setIsFocused] = useState(false)
  return (
    <div style={{ marginBottom: 20 }}>
      {label && (
        <label style={{
          display: 'block',
          fontSize: 13,
          fontWeight: 600,
          color: COLORS.textPrimary,
          marginBottom: 8,
        }}>
          {label}
        </label>
      )}
      <input
        ref={inputRef}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '14px 16px',
          border: isFocused ? `2px solid ${COLORS.primary}` : `1px solid ${error ? COLORS.error : COLORS.border}`,
          borderRadius: 10,
          fontSize: 14,
          color: COLORS.textPrimary,
          background: COLORS.bgSurface,
          transition: 'all 0.2s ease',
          boxShadow: isFocused ? `0 0 0 3px ${COLORS.primaryBg}` : 'none',
          fontFamily: "'Inter', sans-serif",
          boxSizing: 'border-box',
          ...style
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {error && (
        <div style={{ marginTop: 6, fontSize: 13, color: COLORS.error, fontWeight: 500 }}>
          {error}
        </div>
      )}
      {hint && !error && (
        <div style={{ marginTop: 6, fontSize: 12, color: COLORS.textMuted }}>
          {hint}
        </div>
      )}
    </div>
  )
}

function Button({ fullWidth, size = 'md', loading, children, onClick, disabled, icon, iconRight, variant = 'primary', style }) {
  const sizeMap = {
    lg: { padding: '16px 24px', fontSize: 15 },
    md: { padding: '12px 18px', fontSize: 14 },
    sm: { padding: '10px 14px', fontSize: 13 },
  }
  const variantStyles = {
    primary: {
      background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
      color: 'white',
      border: 'none',
      boxShadow: '0 4px 14px rgba(49, 46, 129, 0.25)',
    },
    success: {
      background: `linear-gradient(135deg, ${COLORS.success} 0%, #059669 100%)`,
      color: 'white',
      border: 'none',
      boxShadow: '0 4px 14px rgba(4, 120, 87, 0.25)',
    },
    ghost: {
      background: COLORS.bgSubtle,
      color: COLORS.textSecondary,
      border: `1px solid ${COLORS.border}`,
      boxShadow: 'none',
    },
  }

  const sz = sizeMap[size]
  const vs = variantStyles[variant]

  return (
    <motion.button
      whileHover={!loading && !disabled ? { y: -2 } : {}}
      whileTap={!loading && !disabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={loading || disabled}
      style={{
        ...sz,
        ...vs,
        width: fullWidth ? '100%' : 'auto',
        borderRadius: 12,
        fontWeight: 600,
        cursor: loading || disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        opacity: loading || disabled ? 0.6 : 1,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        ...style
      }}
    >
      {icon}
      {children}
      {iconRight}
    </motion.button>
  )
}

function ProgressSteps({ steps, current }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 36 }}>
      {steps.map((label, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
          }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: i <= current
                ? `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`
                : COLORS.bgSubtle,
              color: i <= current ? 'white' : COLORS.textMuted,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 700,
              transition: 'all 0.3s ease',
              boxShadow: i <= current ? '0 4px 12px rgba(49, 46, 129, 0.2)' : 'none',
            }}>
              {i < current ? <Check size={16} /> : i + 1}
            </div>
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              color: i <= current ? COLORS.primary : COLORS.textMuted,
              whiteSpace: 'nowrap',
            }}>
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div style={{
              flex: 1,
              height: 2,
              background: i < current
                ? `linear-gradient(90deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`
                : COLORS.borderLight,
              marginLeft: 12,
              marginRight: 12,
              marginBottom: 24,
              borderRadius: 1,
              transition: 'all 0.3s ease',
            }} />
          )}
        </div>
      ))}
    </div>
  )
}

function Alert({ type, children }) {
  const styles = {
    danger: { bg: COLORS.errorBg, color: COLORS.error, border: `${COLORS.error}30` },
    success: { bg: COLORS.successBg, color: COLORS.success, border: `${COLORS.success}30` },
  }
  const s = styles[type] || styles.danger

  return (
    <div style={{
      padding: '14px 16px',
      background: s.bg,
      border: `1px solid ${s.border}`,
      borderRadius: 12,
      color: s.color,
      fontSize: 14,
      marginBottom: 20,
      lineHeight: 1.6,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
    }}>
      <AlertCircle size={18} />
      {children}
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// MAIN REGISTER PAGE
// ════════════════════════════════════════════════════════════════

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [role, setRole] = useState('teacher')
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const [form, setForm] = useState({
    email: '',
    otp: '',
    name: '',
    password: '',
    confirmPw: '',
    school: '',
    studentId: ''
  })

  const STEPS = ['Account', 'Verify', 'Profile']

  const change = (k) => (e) => {
    setForm(f => ({ ...f, [k]: e.target.value }))
    setErrors(err => ({ ...err, [k]: '' }))
  }

  const handleSendOtp = async () => {
    if (!form.email) {
      setErrors({ email: 'Email is required' })
      return
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setErrors({ email: 'Please enter a valid email address' })
      return
    }

    setLoading(true)
    try {
      await authAPI.sendOtp({ email: form.email })
      toast.success('Verification code sent! Check your inbox.')
      setStep(1)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send verification code')
      setErrors({ email: err.response?.data?.message || 'Could not send verification email.' })
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!form.otp || form.otp.length !== 6) {
      setErrors({ otp: 'Please enter the 6-digit code' })
      return
    }

    setLoading(true)
    try {
      await authAPI.verifyOtp({ email: form.email, otp: form.otp })
      toast.success('Email verified successfully!')
      setStep(2)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired code')
      setErrors({ otp: 'Code is invalid or has expired' })
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    const e = {}
    if (!form.name) e.name = 'Full name is required'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters'
    if (form.password !== form.confirmPw) e.confirmPw = 'Passwords do not match'

    if (Object.keys(e).length > 0) {
      setErrors(e)
      return
    }

    setLoading(true)
    try {
      const payload = role === 'teacher'
        ? { name: form.name, email: form.email, password: form.password, otp: form.otp, school: form.school || 'My School' }
        : { name: form.name, email: form.email, password: form.password, otp: form.otp, studentId: form.studentId ? Number(form.studentId) : null }

      const fn = role === 'teacher' ? authAPI.teacherRegister : authAPI.parentRegister
      const res = await fn(payload)

      toast.success('Account created successfully!')

      if (res.data?.data?.jwtToken) {
        login(res.data.data)
        navigate(role === 'teacher' ? '/teacher/dashboard' : '/parent/dashboard')
      } else {
        navigate('/login')
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed'
      toast.error(msg)
      setErrors({ general: msg })
    } finally {
      setLoading(false)
    }
  }

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 30 : -30, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -30 : 30, opacity: 0 }),
  }
  const [dir, setDir] = useState(1)

  const goBack = () => {
    setDir(-1)
    setStep(s => Math.max(0, s - 1))
  }

  const otpInputRef = useRef(null)
  useEffect(() => {
    if (step === 1 && otpInputRef.current) {
      otpInputRef.current.focus()
    }
  }, [step])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `linear-gradient(180deg, ${COLORS.bgBase} 0%, ${COLORS.primaryBg} 100%)`,
      padding: 24,
    }}>
      {/* Back to Home Link */}
      <Link
        to="/"
        className="hide-mobile"
        style={{
          position: 'absolute',
          top: 32,
          left: 40,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          color: COLORS.textMuted,
          textDecoration: 'none',
          fontSize: 14,
          fontWeight: 500,
          zIndex: 10,
          transition: 'color 0.2s ease',
        }}
        onMouseEnter={e => e.currentTarget.style.color = COLORS.primary}
        onMouseLeave={e => e.currentTarget.style.color = COLORS.textMuted}
      >
        <ArrowLeft size={18} /> Back to Home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
        style={{
          width: '100%',
          maxWidth: 480,
          background: COLORS.bgSurface,
          borderRadius: 20,
          border: `1px solid ${COLORS.border}`,
          boxShadow: '0 8px 40px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
        }}
      >
        {/* Top accent gradient bar */}
        <div style={{
          height: 4,
          background: `linear-gradient(90deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 50%, ${COLORS.secondary} 100%)`,
        }} />

        <div style={{ padding: '36px 40px' }}>
          {/* Header - Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex' }}>
            <div style={{
              marginBottom: 32,
              transition: 'opacity 0.2s ease',
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <NeuraScanLogo size={44} />
            </div>
          </Link>

          <ProgressSteps steps={STEPS} current={step} />

          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
            >
              {/* ── Step 0: Base Info & Send OTP ── */}
              {step === 0 && (
                <div>
                  <h2 style={{
                    fontSize: 24,
                    fontWeight: 800,
                    marginBottom: 8,
                    color: COLORS.textPrimary,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}>
                    Create your account
                  </h2>
                  <p style={{
                    color: COLORS.textSecondary,
                    fontSize: 14,
                    marginBottom: 28,
                    lineHeight: 1.6,
                  }}>
                    Select your role and provide your email to get started.
                  </p>

                  <div style={{ marginBottom: 24 }}>
                    <label style={{
                      display: 'block',
                      fontSize: 13,
                      fontWeight: 600,
                      color: COLORS.textPrimary,
                      marginBottom: 10,
                    }}>
                      I am a...
                    </label>
                    <div style={{ display: 'flex', gap: 12 }}>
                      {[
                        { id: 'teacher', icon: GraduationCap, title: 'Teacher' },
                        { id: 'parent', icon: Users, title: 'Parent' },
                      ].map(r => (
                        <motion.div
                          key={r.id}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setRole(r.id)}
                          style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 10,
                            padding: '16px',
                            borderRadius: 12,
                            cursor: 'pointer',
                            background: role === r.id ? COLORS.primaryBg : COLORS.bgSubtle,
                            border: role === r.id ? `2px solid ${COLORS.primary}` : `1px solid ${COLORS.border}`,
                            color: role === r.id ? COLORS.primary : COLORS.textSecondary,
                            transition: 'all 0.2s ease',
                            fontWeight: 600,
                            fontSize: 14,
                          }}
                        >
                          <r.icon size={20} />
                          {r.title}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <Input
                    label="Email address"
                    type="email"
                    value={form.email}
                    onChange={change('email')}
                    placeholder="you@school.edu"
                    error={errors.email}
                    hint="We will send a 6-digit verification code to this address."
                  />

                  <Button
                    fullWidth
                    size="lg"
                    loading={loading}
                    onClick={() => { setDir(1); handleSendOtp() }}
                    iconRight={<ArrowRight size={18} />}
                  >
                    Send Verification Code
                  </Button>
                </div>
              )}

              {/* ── Step 1: OTP Verification ── */}
              {step === 1 && (
                <div style={{ textAlign: 'center' }}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 18, stiffness: 300 }}
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: '50%',
                      background: COLORS.primaryBg,
                      border: `2px solid ${COLORS.primary}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 24px',
                    }}
                  >
                    <KeyRound size={32} color={COLORS.primary} />
                  </motion.div>

                  <h2 style={{
                    fontSize: 24,
                    fontWeight: 800,
                    marginBottom: 10,
                    color: COLORS.textPrimary,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}>
                    Verify your email
                  </h2>
                  <p style={{
                    color: COLORS.textSecondary,
                    fontSize: 14,
                    marginBottom: 28,
                    lineHeight: 1.6,
                  }}>
                    We sent a 6-digit code to <strong style={{ color: COLORS.textPrimary }}>{form.email}</strong>
                  </p>

                  <Input
                    inputRef={otpInputRef}
                    type="text"
                    value={form.otp}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 6)
                      setForm(f => ({ ...f, otp: val }))
                      setErrors(err => ({ ...err, otp: '' }))
                    }}
                    placeholder="000000"
                    error={errors.otp}
                    style={{
                      textAlign: 'center',
                      fontSize: 28,
                      letterSpacing: '0.4em',
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      height: 64,
                    }}
                  />

                  <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                    <Button
                      variant="ghost"
                      onClick={goBack}
                      style={{ padding: '14px 20px' }}
                      icon={<ArrowLeft size={18} />}
                    />
                    <Button
                      fullWidth
                      size="lg"
                      loading={loading}
                      onClick={() => { setDir(1); handleVerifyOtp() }}
                      iconRight={<ArrowRight size={18} />}
                    >
                      Verify Code
                    </Button>
                  </div>

                  <div style={{ marginTop: 24 }}>
                    <button
                      onClick={handleSendOtp}
                      disabled={loading}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: COLORS.primary,
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: loading ? 'default' : 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      Resend code
                    </button>
                  </div>
                </div>
              )}

              {/* ── Step 2: Full Details ── */}
              {step === 2 && (
                <div>
                  <h2 style={{
                    fontSize: 24,
                    fontWeight: 800,
                    marginBottom: 8,
                    color: COLORS.textPrimary,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}>
                    Complete your profile
                  </h2>
                  <p style={{
                    color: COLORS.textSecondary,
                    fontSize: 14,
                    marginBottom: 28,
                    lineHeight: 1.6,
                  }}>
                    Almost there! Set up your credentials to finish registration.
                  </p>

                  {errors.general && <Alert type="danger">{errors.general}</Alert>}

                  <Input
                    label="Full name"
                    value={form.name}
                    onChange={change('name')}
                    placeholder="Jane Smith"
                    error={errors.name}
                  />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <Input
                      label="Password"
                      type="password"
                      value={form.password}
                      onChange={change('password')}
                      placeholder="Min 6 characters"
                      error={errors.password}
                    />
                    <Input
                      label="Confirm password"
                      type="password"
                      value={form.confirmPw}
                      onChange={change('confirmPw')}
                      placeholder="Repeat password"
                      error={errors.confirmPw}
                    />
                  </div>

                  {role === 'teacher' && (
                    <Input
                      label="School / Institution"
                      value={form.school}
                      onChange={change('school')}
                      placeholder="Springfield Elementary"
                      hint="Optional"
                    />
                  )}
                  {role === 'parent' && (
                    <Input
                      label="Student ID"
                      type="number"
                      value={form.studentId}
                      onChange={change('studentId')}
                      placeholder="Your child's ID"
                      hint="Optional, can be added later"
                    />
                  )}

                  <Button
                    fullWidth
                    size="lg"
                    variant="success"
                    loading={loading}
                    onClick={handleRegister}
                    iconRight={<Check size={18} />}
                    style={{ marginTop: 8 }}
                  >
                    Complete Registration
                  </Button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {step === 0 && (
            <div style={{
              textAlign: 'center',
              marginTop: 28,
              fontSize: 14,
              color: COLORS.textMuted,
            }}>
              Already have an account?{' '}
              <Link
                to="/login"
                style={{
                  color: COLORS.primary,
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                Sign in
              </Link>
            </div>
          )}
        </div>
      </motion.div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
        }
      `}</style>
    </div>
  )
}
