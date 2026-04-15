import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { NeuraScanLogo } from '../../components/shared/Logo.jsx'
import toast from 'react-hot-toast'
import { auth, googleProvider, signInWithPopup } from '../../firebase'

// ============================================================================
// DESIGN SYSTEM
// ============================================================================
const COLORS = {
  sidebar: '#312E81',
  primary: '#14B8A6',
  primaryDark: '#0D9488',
  primaryLight: '#5EEAD4',

  textPrimary: '#1E293B',
  textSecondary: '#475569',
  textMuted: '#64748B',

  bgBase: '#F8FAFC',
  bgSurface: '#FFFFFF',
  bgSubtle: '#F1F5F9',

  border: '#E2E8F0',
  borderLight: '#F1F5F9',

  success: '#047857',
  successBg: '#ECFDF5',
  error: '#DC2626',
  errorBg: '#FEF2F2',
}

const FONTS = {
  heading: "'Plus Jakarta Sans', sans-serif",
  body: "'Inter', sans-serif",
}

// ============================================================================
// STYLES
// ============================================================================
const styles = {
  pageContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: `linear-gradient(135deg, ${COLORS.bgBase} 0%, #E0E7FF 100%)`,
    padding: '24px',
    fontFamily: FONTS.body,
  },

  card: {
    width: '100%',
    maxWidth: '440px',
    background: COLORS.bgSurface,
    borderRadius: '16px',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
    overflow: 'hidden',
  },

  cardHeader: {
    padding: '32px 32px 24px',
    textAlign: 'center',
    borderBottom: `1px solid ${COLORS.borderLight}`,
  },

  logo: {
    marginBottom: '16px',
  },

  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: '8px',
    fontFamily: FONTS.heading,
  },

  subtitle: {
    fontSize: '14px',
    color: COLORS.textSecondary,
    lineHeight: '1.5',
  },

  cardBody: {
    padding: '24px 32px 32px',
  },

  tabContainer: {
    display: 'flex',
    background: COLORS.bgSubtle,
    borderRadius: '10px',
    padding: '4px',
    marginBottom: '24px',
  },

  tab: {
    flex: 1,
    padding: '12px 16px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: FONTS.body,
  },

  tabActive: {
    background: COLORS.bgSurface,
    color: COLORS.sidebar,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },

  tabInactive: {
    background: 'transparent',
    color: COLORS.textMuted,
  },

  formGroup: {
    marginBottom: '20px',
  },

  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: '8px',
    fontFamily: FONTS.body,
  },

  input: {
    width: '100%',
    padding: '14px 16px',
    border: `1px solid ${COLORS.border}`,
    borderRadius: '10px',
    fontSize: '14px',
    color: COLORS.textPrimary,
    background: COLORS.bgSurface,
    transition: 'all 0.2s ease',
    fontFamily: FONTS.body,
    boxSizing: 'border-box',
    outline: 'none',
  },

  inputFocus: {
    borderColor: COLORS.primary,
    boxShadow: `0 0 0 3px ${COLORS.primary}20`,
  },

  inputError: {
    borderColor: COLORS.error,
  },

  errorText: {
    fontSize: '12px',
    color: COLORS.error,
    marginTop: '6px',
  },

  hintText: {
    fontSize: '12px',
    color: COLORS.textMuted,
    marginTop: '6px',
  },

  button: {
    width: '100%',
    padding: '14px 24px',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: FONTS.heading,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },

  primaryButton: {
    background: COLORS.primary,
    color: '#FFFFFF',
  },

  primaryButtonHover: {
    background: COLORS.primaryDark,
  },

  secondaryButton: {
    background: COLORS.bgSubtle,
    color: COLORS.textSecondary,
    border: `1px solid ${COLORS.border}`,
  },

  googleButton: {
    background: COLORS.bgSurface,
    color: COLORS.textPrimary,
    border: `1px solid ${COLORS.border}`,
    marginBottom: '20px',
  },

  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '20px 0',
  },

  dividerLine: {
    flex: 1,
    height: '1px',
    background: COLORS.border,
  },

  dividerText: {
    padding: '0 16px',
    fontSize: '13px',
    color: COLORS.textMuted,
  },

  link: {
    color: COLORS.primary,
    textDecoration: 'none',
    fontWeight: '600',
  },

  footer: {
    textAlign: 'center',
    marginTop: '24px',
    fontSize: '14px',
    color: COLORS.textMuted,
  },

  alert: {
    padding: '14px 16px',
    borderRadius: '10px',
    fontSize: '14px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },

  alertError: {
    background: COLORS.errorBg,
    color: COLORS.error,
    border: `1px solid ${COLORS.error}30`,
  },

  alertSuccess: {
    background: COLORS.successBg,
    color: COLORS.success,
    border: `1px solid ${COLORS.success}30`,
  },

  progressContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '28px',
    gap: '8px',
  },

  progressStep: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '700',
    transition: 'all 0.3s ease',
  },

  progressStepActive: {
    background: COLORS.primary,
    color: '#FFFFFF',
  },

  progressStepCompleted: {
    background: COLORS.sidebar,
    color: '#FFFFFF',
  },

  progressStepInactive: {
    background: COLORS.bgSubtle,
    color: COLORS.textMuted,
  },

  progressLine: {
    width: '40px',
    height: '3px',
    borderRadius: '2px',
    transition: 'all 0.3s ease',
  },

  progressLineActive: {
    background: COLORS.primary,
  },

  progressLineInactive: {
    background: COLORS.borderLight,
  },

  otpInput: {
    width: '100%',
    padding: '18px 16px',
    border: `1px solid ${COLORS.border}`,
    borderRadius: '10px',
    fontSize: '28px',
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: '0.5em',
    fontFamily: 'monospace',
    color: COLORS.textPrimary,
    background: COLORS.bgSurface,
    outline: 'none',
    boxSizing: 'border-box',
  },

  iconCircle: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: `${COLORS.primary}15`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
  },

  backButton: {
    padding: '12px 20px',
    border: `1px solid ${COLORS.border}`,
    borderRadius: '10px',
    background: COLORS.bgSurface,
    color: COLORS.textSecondary,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    fontFamily: FONTS.body,
  },

  gridTwoCol: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },

  buttonRow: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
  },

  resendLink: {
    background: 'none',
    border: 'none',
    color: COLORS.primary,
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '20px',
    fontFamily: FONTS.body,
  },
}

// ============================================================================
// SVG ICONS (inline to avoid dependencies)
// ============================================================================
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

const ArrowRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
)

const ArrowLeftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
)

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
)

const KeyIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
  </svg>
)

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
)

const AlertIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
)

// ============================================================================
// REUSABLE COMPONENTS
// ============================================================================
function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  hint,
  inputRef,
  style: customStyle,
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false)

  const inputStyle = {
    ...styles.input,
    ...(isFocused ? styles.inputFocus : {}),
    ...(error ? styles.inputError : {}),
    ...customStyle,
  }

  return (
    <div style={styles.formGroup}>
      {label && <label style={styles.label}>{label}</label>}
      <input
        ref={inputRef}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={inputStyle}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {error && <div style={styles.errorText}>{error}</div>}
      {hint && !error && <div style={styles.hintText}>{hint}</div>}
    </div>
  )
}

function Button({
  children,
  onClick,
  loading,
  disabled,
  variant = 'primary',
  icon,
  iconRight,
  style: customStyle,
}) {
  const [isHovered, setIsHovered] = useState(false)

  const variantStyles = {
    primary: {
      ...styles.primaryButton,
      ...(isHovered && !disabled && !loading ? styles.primaryButtonHover : {}),
    },
    secondary: styles.secondaryButton,
    google: styles.googleButton,
  }

  const buttonStyle = {
    ...styles.button,
    ...variantStyles[variant],
    opacity: loading || disabled ? 0.6 : 1,
    cursor: loading || disabled ? 'not-allowed' : 'pointer',
    ...customStyle,
  }

  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      style={buttonStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {loading ? (
        <span>Loading...</span>
      ) : (
        <>
          {icon}
          {children}
          {iconRight}
        </>
      )}
    </button>
  )
}

function ProgressSteps({ steps, currentStep }) {
  return (
    <div style={styles.progressContainer}>
      {steps.map((label, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            ...styles.progressStep,
            ...(index < currentStep
              ? styles.progressStepCompleted
              : index === currentStep
                ? styles.progressStepActive
                : styles.progressStepInactive
            ),
          }}>
            {index < currentStep ? <CheckIcon /> : index + 1}
          </div>
          {index < steps.length - 1 && (
            <div style={{
              ...styles.progressLine,
              ...(index < currentStep ? styles.progressLineActive : styles.progressLineInactive),
            }} />
          )}
        </div>
      ))}
    </div>
  )
}

function Alert({ type = 'error', children }) {
  const alertStyle = {
    ...styles.alert,
    ...(type === 'error' ? styles.alertError : styles.alertSuccess),
  }

  return (
    <div style={alertStyle}>
      <AlertIcon />
      {children}
    </div>
  )
}

// ============================================================================
// MAIN REGISTER PAGE COMPONENT
// ============================================================================
export default function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  // State
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
    studentId: '',
  })

  const otpInputRef = useRef(null)

  const STEPS = ['Account', 'Verify', 'Profile']

  // Focus OTP input when step changes
  useEffect(() => {
    if (step === 1 && otpInputRef.current) {
      otpInputRef.current.focus()
    }
  }, [step])

  // Form change handler
  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  // Send OTP handler
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

  // Verify OTP handler
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

  // Resend OTP handler
  const handleResendOtp = async () => {
    setLoading(true)
    try {
      await authAPI.resendOtp({ email: form.email })
      toast.success('New verification code sent!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend code')
    } finally {
      setLoading(false)
    }
  }

  // Register handler
  const handleRegister = async () => {
    const newErrors = {}
    if (!form.name) newErrors.name = 'Full name is required'
    if (!form.password) newErrors.password = 'Password is required'
    else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    if (form.password !== form.confirmPw) newErrors.confirmPw = 'Passwords do not match'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      const payload = role === 'teacher'
        ? {
            name: form.name,
            email: form.email,
            password: form.password,
            otp: form.otp,
            school: form.school || 'My School'
          }
        : {
            name: form.name,
            email: form.email,
            password: form.password,
            otp: form.otp,
            studentId: form.studentId ? Number(form.studentId) : null
          }

      const registerFn = role === 'teacher' ? authAPI.teacherRegister : authAPI.parentRegister
      const response = await registerFn(payload)

      toast.success('Account created successfully!')

      if (response.data?.data?.jwtToken) {
        login(response.data.data)
        navigate(role === 'teacher' ? '/teacher/dashboard' : '/parent/dashboard')
      } else {
        navigate('/login')
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed'
      toast.error(message)
      setErrors({ general: message })
    } finally {
      setLoading(false)
    }
  }

  // Google OAuth handler
  const handleGoogleSignUp = async () => {
    setLoading(true)
    const id = toast.loading('Signing up with Google...')
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const idToken = await result.user.getIdToken(true)
      if (!idToken) throw new Error('Could not retrieve ID Token from Firebase.')
      const picture = result.user?.photoURL || null
      const res = await authAPI.firebaseLogin(idToken, role, picture)
      login(res.data.data)
      toast.success(`Welcome, ${res.data.data.userName}!`, { id })
      navigate(res.data.data.userRole === 'ROLE_TEACHER' ? '/teacher/dashboard' : '/parent/dashboard')
    } catch (err) {
      let msg = 'Google sign-up failed'
      if (err.code === 'auth/popup-closed-by-user') msg = 'Sign-in popup was closed'
      else if (err.code === 'auth/cancelled-popup-request') msg = 'Only one sign-in popup allowed at a time'
      else if (err.response?.data?.message) msg = err.response.data.message
      else if (err.message) msg = err.message
      toast.error(msg, { id })
    } finally {
      setLoading(false)
    }
  }

  // Go back handler
  const goBack = () => {
    setStep(prev => Math.max(0, prev - 1))
  }

  // OTP input handler
  const handleOtpChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 6)
    setForm(prev => ({ ...prev, otp: val }))
    setErrors(prev => ({ ...prev, otp: '' }))
  }

  // ============================================================================
  // RENDER STEP CONTENT
  // ============================================================================
  const renderStepContent = () => {
    switch (step) {
      // Step 0: Account Type & Email
      case 0:
        return (
          <div>
            {/* Role Tabs */}
            <div style={styles.tabContainer}>
              <button
                style={{
                  ...styles.tab,
                  ...(role === 'teacher' ? styles.tabActive : styles.tabInactive),
                }}
                onClick={() => setRole('teacher')}
              >
                Teacher
              </button>
              <button
                style={{
                  ...styles.tab,
                  ...(role === 'parent' ? styles.tabActive : styles.tabInactive),
                }}
                onClick={() => setRole('parent')}
              >
                Parent
              </button>
            </div>

            {/* Google OAuth Button */}
            <Button
              variant="google"
              onClick={handleGoogleSignUp}
              loading={loading}
              icon={<GoogleIcon />}
            >
              Continue with Google
            </Button>

            {/* Divider */}
            <div style={styles.divider}>
              <div style={styles.dividerLine}></div>
              <span style={styles.dividerText}>or continue with email</span>
              <div style={styles.dividerLine}></div>
            </div>

            {/* Email Input */}
            <Input
              label="Email address"
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              placeholder="you@school.edu"
              error={errors.email}
              hint="We will send a 6-digit verification code to this address."
            />

            {/* Submit Button */}
            <Button
              onClick={handleSendOtp}
              loading={loading}
              iconRight={<ArrowRightIcon />}
            >
              Send Verification Code
            </Button>

            {/* Login Link */}
            <div style={styles.footer}>
              Already have an account?{' '}
              <Link to="/login" style={styles.link}>Sign in</Link>
            </div>
          </div>
        )

      // Step 1: OTP Verification
      case 1:
        return (
          <div style={{ textAlign: 'center' }}>
            <div style={styles.iconCircle}>
              <KeyIcon />
            </div>

            <h2 style={{ ...styles.title, marginBottom: '12px' }}>
              Verify your email
            </h2>
            <p style={{ ...styles.subtitle, marginBottom: '28px' }}>
              We sent a 6-digit code to{' '}
              <strong style={{ color: COLORS.textPrimary }}>{form.email}</strong>
            </p>

            {errors.otp && <Alert type="error">{errors.otp}</Alert>}

            <div style={{ marginBottom: '24px' }}>
              <input
                ref={otpInputRef}
                type="text"
                value={form.otp}
                onChange={handleOtpChange}
                placeholder="000000"
                style={styles.otpInput}
                maxLength={6}
              />
            </div>

            <div style={styles.buttonRow}>
              <button
                style={styles.backButton}
                onClick={goBack}
              >
                <ArrowLeftIcon />
              </button>
              <Button
                onClick={handleVerifyOtp}
                loading={loading}
                iconRight={<ArrowRightIcon />}
                style={{ flex: 1 }}
              >
                Verify Code
              </Button>
            </div>

            <button
              style={styles.resendLink}
              onClick={handleResendOtp}
              disabled={loading}
            >
              Resend code
            </button>
          </div>
        )

      // Step 2: Profile Details
      case 2:
        return (
          <div>
            <h2 style={{ ...styles.title, marginBottom: '8px' }}>
              Complete your profile
            </h2>
            <p style={{ ...styles.subtitle, marginBottom: '24px' }}>
              Almost there! Set up your credentials to finish registration.
            </p>

            {errors.general && <Alert type="error">{errors.general}</Alert>}

            <Input
              label="Full name"
              value={form.name}
              onChange={handleChange('name')}
              placeholder="Jane Smith"
              error={errors.name}
            />

            <div style={styles.gridTwoCol}>
              <Input
                label="Password"
                type="password"
                value={form.password}
                onChange={handleChange('password')}
                placeholder="Min 6 characters"
                error={errors.password}
              />
              <Input
                label="Confirm password"
                type="password"
                value={form.confirmPw}
                onChange={handleChange('confirmPw')}
                placeholder="Repeat password"
                error={errors.confirmPw}
              />
            </div>

            {role === 'teacher' && (
              <Input
                label="School / Institution"
                value={form.school}
                onChange={handleChange('school')}
                placeholder="Springfield Elementary"
                hint="Optional"
              />
            )}

            {role === 'parent' && (
              <Input
                label="Student ID"
                type="number"
                value={form.studentId}
                onChange={handleChange('studentId')}
                placeholder="Your child's ID"
                hint="Optional, can be added later"
              />
            )}

            <div style={{ marginTop: '8px' }}>
              <Button
                onClick={handleRegister}
                loading={loading}
                icon={<UserIcon />}
              >
                Complete Registration
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  // ============================================================================
  // MAIN RENDER
  // ============================================================================
  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        {/* Card Header */}
        <div style={styles.cardHeader}>
          <div style={styles.logo}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <NeuraScanLogo size={40} />
            </Link>
          </div>
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.subtitle}>
            {step === 0 && 'Select your role and get started'}
            {step === 1 && 'Enter the verification code'}
            {step === 2 && 'Fill in your details'}
          </p>
        </div>

        {/* Card Body */}
        <div style={styles.cardBody}>
          {/* Progress Steps */}
          <ProgressSteps steps={STEPS} currentStep={step} />

          {/* Step Content */}
          {renderStepContent()}
        </div>
      </div>
    </div>
  )
}
