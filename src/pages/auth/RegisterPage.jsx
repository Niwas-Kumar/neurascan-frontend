import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, GraduationCap, Users, ArrowRight, ArrowLeft, Check, KeyRound, Mail, AlertCircle } from 'lucide-react'
import { authAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

// ── Input Component ────────────────────────────
const Input = ({ label, type = 'text', value, onChange, placeholder, error, hint, ref, style }) => {
  const [isFocused, setIsFocused] = useState(false)
  return (
    <div style={{ marginBottom: 18 }}>
      {label && <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>{label}</label>}
      <input
        ref={ref}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '12px 14px',
          border: isFocused ? '2px solid var(--primary)' : `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-lg)',
          fontSize: 14,
          color: 'var(--text-primary)',
          background: 'var(--bg-surface)',
          transition: 'all 0.3s ease',
          boxShadow: isFocused ? '0 0 0 3px rgba(26, 115, 232, 0.15)' : 'none',
          ...style
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {error && <div style={{ marginTop: 4, fontSize: 12, color: 'var(--danger)' }}>{error}</div>}
      {hint && <div style={{ marginTop: 4, fontSize: 12, color: 'var(--text-muted)' }}>{hint}</div>}
    </div>
  )
}

// ── Button Component ────────────────────────────
const Button = ({ fullWidth, size = 'md', loading, children, onClick, disabled, icon, iconRight, variant = 'primary', style }) => {
  const sizeMap = { lg: { padding: '14px 20px', fontSize: 15, height: 'auto' }, md: { padding: '10px 16px', fontSize: 14 }, sm: { padding: '8px 12px', fontSize: 13 } }
  const bgMap = { primary: 'var(--primary)', ghost: 'transparent', secondary: 'var(--secondary)' }
  const textMap = { primary: 'white', ghost: 'var(--primary)', secondary: 'white' }
  const borderMap = { ghost: '1px solid var(--border)', primary: 'none', secondary: 'none' }
  const sz = sizeMap[size]
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      style={{
        ...sz,
        width: fullWidth ? '100%' : 'auto',
        background: bgMap[variant],
        color: textMap[variant],
        border: borderMap[variant],
        borderRadius: 'var(--radius-lg)',
        fontWeight: 600,
        cursor: loading || disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s cubic-bezier(0.2, 0, 0, 1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        opacity: loading || disabled ? 0.6 : 1,
        ...style
      }}
      onMouseEnter={e => {
        if (!loading && !disabled) {
          if (variant === 'primary') e.target.style.background = 'var(--primary-dark)'
          if (variant === 'secondary') e.target.style.background = '#0679a0'
          if (variant === 'ghost') e.target.style.background = 'var(--bg-elevated)'
          e.target.style.transform = 'translateY(-1px)'
        }
      }}
      onMouseLeave={e => {
        e.target.style.background = bgMap[variant]
        e.target.style.transform = 'translateY(0)'
      }}
    >
      {icon}{children}{iconRight}
    </button>
  )
}

// ── ProgressSteps Component ────────────────────────────
const ProgressSteps = ({ steps, current }) => (
  <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
    {steps.map((s, i) => (
      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: i <= current ? 'var(--primary)' : 'var(--bg-elevated)',
          color: i <= current ? 'white' : 'var(--text-muted)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700, transition: 'all 0.3s ease'
        }}>{i + 1}</div>
        {i < steps.length - 1 && <div style={{ flex: 1, height: 2, background: i < current ? 'var(--primary)' : 'var(--border)' }} />}
      </div>
    ))}
  </div>
)

// ── Alert Component ────────────────────────────
const Alert = ({ type, children }) => {
  const colorMap = { danger: 'var(--danger)', warning: 'var(--warning)', success: 'var(--success)' }
  const bgMap = { danger: 'rgba(239, 68, 68, 0.08)', warning: 'rgba(245, 158, 11, 0.08)', success: 'rgba(16, 185, 129, 0.08)' }
  return (
    <div style={{
      padding: '12px 14px',
      background: bgMap[type],
      border: `1px solid ${colorMap[type]}40`,
      borderRadius: 'var(--radius-md)',
      color: colorMap[type],
      fontSize: 13,
      marginBottom: 18,
      lineHeight: 1.6
    }}>
      {children}
    </div>
  )
}

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

  const STEPS = ['Account setup', 'Verify email', 'Complete profile']

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
      setErrors({ email: 'Valid email required' })
      return
    }

    setLoading(true)
    try {
      await authAPI.sendOtp({ email: form.email })
      toast.success('Verification code sent! Check your inbox.')
      setStep(1)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send verification code')
      setErrors({ email: err.response?.data?.message || 'Could not dispatch email.' })
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
      toast.success('Email verified!')
      setStep(2)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired OTP')
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
    enter: (dir) => ({ x: dir > 0 ? 24 : -24, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -24 : 24, opacity: 0 }),
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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-page)', padding: 20 }}>

      {/* ── Return Home Link ── */}
      <Link to="/" style={{
        position: 'absolute', top: 28, left: 36, display: 'flex', alignItems: 'center', gap: 8,
        color: 'var(--text-muted)', textDecoration: 'none', fontSize: 13, fontWeight: 500, zIndex: 10, transition: 'all 0.3s ease'
      }}
      onMouseEnter={e => e.target.style.color = 'var(--primary)'}
      onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
      className="hide-mobile">
        <ArrowLeft size={16} /> Back to Home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
        style={{
          width: '100%', maxWidth: 500,
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: `1px solid var(--border)`,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
        }}
      >
        {/* Top accent bar */}
        <div style={{ height: 4, background: 'var(--primary)' }} />

        <div style={{ padding: '36px 44px' }}>
          {/* Header - Logo clickable to go home */}
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28, transition: 'all 0.3s ease' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Brain size={22} color="#fff" strokeWidth={2.5} />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'var(--text-primary)' }}>NeuraScan</div>
                <div style={{ fontSize: 11, color: 'var(--text-light)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>Create Account</div>
              </div>
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
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, marginBottom: 6, color: 'var(--text-primary)' }}>Let's get started</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>
                    Select your role and provide your email to begin.
                  </p>

                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>I am a...</label>
                    <div style={{ display: 'flex', gap: 12 }}>
                      {[
                        { id: 'teacher', icon: GraduationCap, title: 'Teacher' },
                        { id: 'parent', icon: Users, title: 'Parent' },
                      ].map(r => (
                        <div
                          key={r.id}
                          onClick={() => setRole(r.id)}
                          style={{
                            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            padding: '14px', borderRadius: 'var(--radius-lg)', cursor: 'pointer',
                            background: role === r.id ? 'rgba(26, 115, 232, 0.08)' : 'var(--bg-elevated)',
                            border: `2px solid ${role === r.id ? 'var(--primary)' : 'var(--border)'}`,
                            color: role === r.id ? 'var(--primary)' : 'var(--text-muted)',
                            transition: 'all 0.3s ease',
                            fontWeight: 600, fontSize: 14,
                          }}
                        >
                          <r.icon size={18} color={role === r.id ? 'var(--primary)' : 'var(--text-light)'} />
                          {r.title}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Input
                    label="Email address" type="email" value={form.email} onChange={change('email')}
                    placeholder="you@school.edu" required error={errors.email}
                    hint="We will send a 6-digit verification code to this address."
                  />

                  <Button fullWidth size="lg" loading={loading} onClick={() => { setDir(1); handleSendOtp() }} iconRight={<ArrowRight size={16} />}>
                    Send Verification Code
                  </Button>
                </div>
              )}

              {/* ── Step 1: OTP Verification ── */}
              {step === 1 && (
                <div style={{ textAlign: 'center' }}>
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 18, stiffness: 300 }}
                    style={{
                      width: 64, height: 64, borderRadius: '50%',
                      background: 'rgba(26, 115, 232, 0.08)', border: '2px solid var(--primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
                    }}
                  >
                    <KeyRound size={28} color="var(--primary)" />
                  </motion.div>

                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>Verify your email</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 28 }}>
                    We sent a 6-digit code to <strong style={{ color: 'var(--text-primary)' }}>{form.email}</strong>.
                  </p>

                  <Input
                    ref={otpInputRef}
                    type="text"
                    value={form.otp}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                      setForm(f => ({ ...f, otp: val }));
                      setErrors(err => ({ ...err, otp: '' }));
                    }}
                    placeholder="000000"
                    error={errors.otp}
                    style={{
                      textAlign: 'center', fontSize: 28, letterSpacing: '0.5em',
                      fontFamily: 'monospace', fontWeight: 700, height: 64
                    }}
                  />

                  <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                    <Button variant="ghost" onClick={goBack} style={{ padding: '0 16px' }} icon={<ArrowLeft size={16} />} />
                    <Button fullWidth size="lg" loading={loading} onClick={() => { setDir(1); handleVerifyOtp() }} iconRight={<ArrowRight size={16} />}>
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
                        color: 'var(--primary)', 
                        fontSize: 13, 
                        fontWeight: 600, 
                        cursor: loading ? 'default' : 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={e => !loading && (e.target.style.textDecoration = 'underline')}
                      onMouseLeave={e => (e.target.style.textDecoration = 'none')}
                    >
                      Resend code
                    </button>
                  </div>
                </div>
              )}

              {/* ── Step 2: Full Details ── */}
              {step === 2 && (
                <div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, marginBottom: 6, color: 'var(--text-primary)' }}>Complete Profile</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>Almost there! Set up your credentials.</p>

                  {errors.general && <Alert type="danger">{errors.general}</Alert>}

                  <Input label="Full name" value={form.name} onChange={change('name')} placeholder="Jane Smith" required error={errors.name} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <Input label="Password" type="password" value={form.password} onChange={change('password')} placeholder="Min 6 chars" required error={errors.password} />
                    <Input label="Confirm pass" type="password" value={form.confirmPw} onChange={change('confirmPw')} placeholder="Repeat" required error={errors.confirmPw} />
                  </div>

                  {role === 'teacher' && (
                    <Input label="School / Institution" value={form.school} onChange={change('school')} placeholder="Springfield Elementary" hint="Optional" />
                  )}
                  {role === 'parent' && (
                    <Input label="Student ID" type="number" value={form.studentId} onChange={change('studentId')} placeholder="Your child's ID" hint="Optional, can be added later" />
                  )}

                  <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                    <Button fullWidth size="lg" loading={loading} onClick={handleRegister} iconRight={<Check size={18} />}
                      style={{ background: 'var(--success)' }}
                    >
                      Complete Registration
                    </Button>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

          {step === 0 && (
            <div style={{ textAlign: 'center', marginTop: 28, fontSize: 13, color: 'var(--text-light)' }}>
              Already registered?{' '}
              <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600, transition: 'all 0.3s ease' }}
              onMouseEnter={e => e.target.style.textDecoration = 'underline'}
              onMouseLeave={e => e.target.style.textDecoration = 'none'}
              >Sign in instead</Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
