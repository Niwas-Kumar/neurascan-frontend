import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brain, GraduationCap, Users, ArrowRight, Zap, Shield, BarChart3 } from 'lucide-react'
import { authAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { Button, Input, Divider, Alert, Tabs } from '../../components/shared/UI'
import toast from 'react-hot-toast'

import { auth, googleProvider, GoogleAuthProvider, signInWithPopup } from '../../firebase'

const TABS = [
  { id: 'teacher', label: 'Teacher', icon: GraduationCap },
  { id: 'parent',  label: 'Parent',  icon: Users },
]

const FEATURES = [
  { icon: Zap,       title: 'Instant AI Analysis',     desc: 'Results in under 30 seconds per paper.' },
  { icon: Shield,    title: 'FERPA Compliant',          desc: 'Student data is encrypted and protected.' },
  { icon: BarChart3, title: 'Progress Tracking',        desc: 'Monitor improvements over time.' },
]

export default function LoginPage() {
  const { login }    = useAuth()
  const navigate     = useNavigate()
  const [params]     = useSearchParams()
  const expired      = params.get('session') === 'expired'

  const [tab, setTab]       = useState('teacher')
  const [loading, setLoading] = useState(false)
  const [form, setForm]     = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.email)    e.email    = 'Email is required'
    if (!form.password) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const fn  = tab === 'teacher' ? authAPI.teacherLogin : authAPI.parentLogin
      const res = await fn(form)
      login(res.data.data)
      toast.success(`Welcome back, ${res.data.data.userName}!`)
      navigate(tab === 'teacher' ? '/teacher/dashboard' : '/parent/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password'
      toast.error(msg)
      setErrors({ general: msg })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    const id = toast.loading('Signing in with Google...')
    try {
        const result = await signInWithPopup(auth, googleProvider)
        // result.user.getIdToken() returns the Firebase ID token (audience: neurascan-8ada2)
        // credential.idToken returns the Google ID token (audience: client-id)
        const idToken = await result.user.getIdToken()
        
        if (!idToken) {
            throw new Error('Could not retrieve ID Token from Firebase.')
        }
        
        const picture = result.user?.photoURL || null
        const res = await authAPI.firebaseLogin(idToken, tab, picture)
        login(res.data.data)
        toast.success(`Welcome back, ${res.data.data.userName}!`, { id })
        navigate(res.data.data.userRole === 'ROLE_TEACHER' ? '/teacher/dashboard' : '/parent/dashboard')
    } catch (err) {
        console.error('Login Error:', err)
        let msg = 'Google login failed'
        if (err.code === 'auth/popup-closed-by-user') {
            msg = 'Sign-in popup was closed'
        } else if (err.code === 'auth/cancelled-popup-request') {
            msg = 'Only one sign-in popup allowed at a time'
        } else if (err.response?.data?.message) {
            msg = err.response.data.message
        } else if (err.message) {
            msg = err.message
        }
        toast.error(msg, { id })
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: '#f8f9fa',
    }}>

      {/* ── Left panel — branding ── */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.2,0,0,1] }}
        style={{
          flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '60px 64px', background: '#fff',
          borderRight: '1px solid #e8eaed',
        }}
        className="hide-mobile"
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 64 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: '#1a73e8',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Brain size={24} color="#fff" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: '#202124', letterSpacing: '-0.3px' }}>NeuraScan</div>
            <div style={{ fontSize: 11, color: '#80868b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>AI Learning Platform</div>
          </div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          style={{ fontFamily: 'var(--font-display)', fontSize: 44, fontWeight: 700, letterSpacing: '-1px', lineHeight: 1.15, marginBottom: 16, color: '#202124' }}
        >
          Detect learning{' '}
          <span style={{ color: '#1a73e8' }}>disorders early.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ color: '#5f6368', fontSize: 16, lineHeight: 1.75, marginBottom: 48, maxWidth: 440 }}
        >
          AI-powered handwriting analysis that identifies dyslexia and dysgraphia from student test papers — giving teachers and parents actionable insights within seconds.
        </motion.p>

        {/* Feature highlights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {FEATURES.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                background: '#e8f0fe', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={18} color="#1a73e8" strokeWidth={1.75} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2, color: '#202124' }}>{title}</div>
                <div style={{ fontSize: 13, color: '#5f6368' }}>{desc}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ display: 'flex', gap: 40, marginTop: 56 }}
        >
          {[['12K+', 'Students analyzed'], ['340+', 'Schools onboard'], ['94%', 'Detection accuracy']].map(([v, l]) => (
            <div key={l}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: '#1a73e8' }}>{v}</div>
              <div style={{ fontSize: 12, color: '#80868b', marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── Right panel — form ── */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: [0.2,0,0,1] }}
        style={{
          width: 480,
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '48px 48px', background: '#fff',
          overflowY: 'auto',
        }}
      >
        {/* Mobile logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36 }} className="show-mobile hide-desktop">
          <div style={{ width: 36, height: 36, borderRadius: 9, background: '#1a73e8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Brain size={18} color="#fff" strokeWidth={2.5} />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: '#202124' }}>NeuraScan</span>
        </div>

        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 6, color: '#202124' }}>
            Sign in
          </h2>
          <p style={{ color: '#5f6368', fontSize: 14 }}>
            New here?{' '}
            <Link to="/register" style={{ color: '#1a73e8', textDecoration: 'none', fontWeight: 600 }}>
              Create an account
            </Link>
          </p>
        </div>

        {expired && (
          <Alert type="warning" title="Session expired">
            Your session has expired. Please sign in again.
          </Alert>
        )}

        {/* Role tabs */}
        <div style={{ marginBottom: 24 }}>
          <Tabs tabs={TABS} active={tab} onChange={setTab} />
        </div>

        {/* OAuth buttons */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            <Button type="button" variant="ghost" fullWidth size="md"
              style={{ 
                background: '#fff', color: '#3c4043', fontWeight: 500, gap: 10,
                border: '1px solid #dadce0', borderRadius: 8,
              }}
              onClick={handleGoogleLogin}
            >
              <img src="https://www.google.com/favicon.ico" alt="G" style={{ width: 18, height: 18 }} />
              Continue with Google
            </Button>
        </div>

        <Divider label="or continue with email" />
        <div style={{ height: 16 }} />

        {errors.general && <Alert type="danger">{errors.general}</Alert>}

        <form onSubmit={handleSubmit}>
          <Input
            label="Email address" type="email" name="email"
            value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            placeholder="you@school.edu" required
            error={errors.email}
          />
          <Input
            label="Password" type="password" name="password"
            value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            placeholder="Enter your password" required
            error={errors.password}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20, marginTop: -8 }}>
            <Link to="/forgot-password" style={{ fontSize: 13, color: '#1a73e8', textDecoration: 'none', fontWeight: 500 }}>
              Forgot password?
            </Link>
          </div>

          <Button type="submit" fullWidth size="lg" loading={loading} iconRight={!loading && <ArrowRight size={16} />}>
            Sign in as {tab === 'teacher' ? 'Teacher' : 'Parent'}
          </Button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 28, fontSize: 12, color: '#80868b', lineHeight: 1.6 }}>
          By signing in you agree to our{' '}
          <a href="#" style={{ color: '#1a73e8', textDecoration: 'none' }}>Terms of Service</a>
          {' '}and{' '}
          <a href="#" style={{ color: '#1a73e8', textDecoration: 'none' }}>Privacy Policy</a>
        </p>
      </motion.div>
    </div>
  )
}
