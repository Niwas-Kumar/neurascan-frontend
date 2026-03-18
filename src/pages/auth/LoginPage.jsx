import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brain, GraduationCap, Users, ArrowRight, LogIn } from 'lucide-react'
import { authAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

import { auth, googleProvider, GoogleAuthProvider, signInWithPopup } from '../../firebase'

// Add placeholder color styling
const placeholderStyle = `
  input::placeholder {
    color: #9aa0a6 !important;
    opacity: 1 !important;
  }
  input::-ms-input-placeholder {
    color: #9aa0a6 !important;
  }
  input::-webkit-input-placeholder {
    color: #9aa0a6 !important;
  }
`

const TABS = [
  { id: 'teacher', label: '🎓 Teacher', icon: GraduationCap },
  { id: 'parent',  label: '👨‍👩‍👧 Parent',  icon: Users },
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
    const id = toast.loading('🔐 Signing in with Google...')
    try {
        const result = await signInWithPopup(auth, googleProvider)
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
    <>
      <style>{placeholderStyle}</style>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        background: 'linear-gradient(135deg, #f8fafb 0%, #f3f7fc 100%)',
      }}>
        {/* ─── LEFT PANEL: HERO SECTION ─── */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '64px 72px',
          background: `linear-gradient(135deg, #1e3a8a 0%, #1a73e8 100%)`,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
        className="hide-mobile"
      >
        {/* Decorative Background Elements */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '300px',
          height: '300px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-80px',
          left: '-100px',
          width: '250px',
          height: '250px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '50%',
        }} />

        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 80,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: 'rgba(255, 255, 255, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          }}>
            <Brain size={32} color="#1a73e8" strokeWidth={2} />
          </div>
          <div>
            <div style={{
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: '-0.5px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}>
              NeuraScan
            </div>
            <div style={{
              fontSize: 12,
              opacity: 0.95,
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.95)',
            }}>
              AI Learning Platform
            </div>
          </div>
        </motion.div>

        {/* Hero Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            fontSize: 48,
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: 24,
            letterSpacing: '-1.5px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          Early Detection,
          <br />
          Better Outcomes
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          style={{
            fontSize: 18,
            lineHeight: 1.7,
            marginBottom: 56,
            opacity: 1,
            maxWidth: 520,
            fontWeight: 400,
            color: 'rgba(255, 255, 255, 0.98)',
          }}
        >
          Our AI-powered handwriting analysis identifies learning disorders like dyslexia and dysgraphia in seconds, giving educators and parents the insights they need to support every student's success.
        </motion.p>

        {/* Feature Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 24,
          position: 'relative',
          zIndex: 1,
        }}>
          {[
            { icon: 'lightning', title: 'Lightning Fast', desc: 'Analysis in seconds' },
            { icon: 'shield', title: 'Enterprise Secure', desc: 'SOC 2 Type II certified' },
            { icon: 'chart', title: '94% Accurate', desc: 'Peer-reviewed AI' },
            { icon: 'users', title: '12K+ Students', desc: 'Supported globally' },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 12,
                padding: 20,
              }}
            >
              <div style={{
                fontSize: 32,
                marginBottom: 8,
              }}>
                {feature.icon === 'lightning' && '⚡'}
                {feature.icon === 'shield' && '🛡️'}
                {feature.icon === 'chart' && '📊'}
                {feature.icon === 'users' && '👥'}
              </div>
              <div style={{
                fontSize: 14,
                fontWeight: 700,
                marginBottom: 4,
              }}>
                {feature.title}
              </div>
              <div style={{
                fontSize: 13,
                opacity: 0.95,
                color: 'rgba(255, 255, 255, 0.95)',
              }}>
                {feature.desc}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ─── RIGHT PANEL: LOGIN FORM ─── */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          width: 520,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '48px 64px',
          background: 'white',
          overflowY: 'auto',
        }}
      >
        {/* Mobile Logo */}
        <div style={{
          display: 'none',
          alignItems: 'center',
          gap: 12,
          marginBottom: 40,
        }} className="show-mobile">
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: '#1a73e8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Brain size={24} color="white" strokeWidth={2} />
          </div>
          <span style={{
            fontSize: 20,
            fontWeight: 800,
            color: '#202124',
          }}>
            NeuraScan
          </span>
        </div>

        {/* Form Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            marginBottom: 40,
          }}
        >
          <h2 style={{
            fontSize: 32,
            fontWeight: 800,
            color: '#202124',
            marginBottom: 8,
            letterSpacing: '-0.5px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}>
            Welcome Back
          </h2>
          <p style={{
            fontSize: 15,
            color: '#3c4043',
            lineHeight: 1.6,
          }}>
            Sign in to your account to continue. New here?{' '}
            <Link
              to="/register"
              style={{
                color: '#1a73e8',
                textDecoration: 'none',
                fontWeight: 700,
              }}
            >
              Create an account
            </Link>
          </p>
        </motion.div>

        {/* Session Expired Alert */}
        {expired && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: '#fce8e6',
              border: '1px solid #f5b6b0',
              borderRadius: 12,
              padding: '14px 16px',
              marginBottom: 28,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <span style={{ fontSize: 20 }}>⚠️</span>
            <div style={{
              color: '#d93025',
              fontWeight: 600,
              fontSize: 14,
            }}>
              Your session has expired. Please sign in again.
            </div>
          </motion.div>
        )}

        {/* Role Selection Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{
            marginBottom: 32,
          }}
        >
          <label style={{
            display: 'block',
            fontSize: 12,
            fontWeight: 700,
            color: '#3c4043',
            marginBottom: 12,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Login as
          </label>
          <div style={{
            display: 'flex',
            gap: 12,
          }}>
            {TABS.map(t => (
              <motion.button
                key={t.id}
                whileTap={{ scale: 0.96 }}
                onClick={() => setTab(t.id)}
                style={{
                  flex: 1,
                  padding: '14px 20px',
                  border: tab === t.id ? '2px solid #1a73e8' : '2px solid #e8eaed',
                  background: tab === t.id ? '#e8f0fe' : 'transparent',
                  borderRadius: 10,
                  color: tab === t.id ? '#1a73e8' : '#202124',
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.2, 0, 0, 1)',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                }}
              >
                {t.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Google Sign In Button - ENTERPRISE SIZE */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={handleGoogleLogin}
          style={{
            width: '100%',
            padding: '16px 20px',
            border: '1px solid #dadce0',
            background: 'white',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            marginBottom: 24,
            fontWeight: 600,
            fontSize: 15,
            color: '#202124',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.2, 0, 0, 1)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#f8f9fa'
            e.currentTarget.style.borderColor = '#1a73e8'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(26, 115, 232, 0.15)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'white'
            e.currentTarget.style.borderColor = '#dadce0'
            e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)'
          }}
        >
          {/* Professional Google Logo */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </motion.button>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          margin: '28px 0',
        }}>
          <div style={{
            flex: 1,
            height: '1px',
            background: '#dadce0',
          }} />
          <span style={{
            fontSize: 13,
            color: '#3c4043',
            fontWeight: 600,
          }}>
            OR
          </span>
          <div style={{
            flex: 1,
            height: '1px',
            background: '#dadce0',
          }} />
        </div>

        {/* Login Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          {/* Email Input */}
          <div>
            <label style={{
              display: 'block',
              fontSize: 13,
              fontWeight: 700,
              color: '#202124',
              marginBottom: 9,
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}>
              Email Address
            </label>
            <input
              type="email"
              value={form.email}
              onChange={e => {
                setForm(f => ({ ...f, email: e.target.value }))
                setErrors(er => ({ ...er, email: '' }))
              }}
              placeholder="you@school.com"
              style={{
                width: '100%',
                padding: '14px 16px',
                border: errors.email ? '2px solid #d33b27' : '1px solid #dadce0',
                borderRadius: 8,
                fontSize: 14,
                background: 'white',
                color: '#202124',
                transition: 'all 0.2s ease-out',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                boxSizing: 'border-box',
              }}
              onFocus={e => {
                if (!errors.email) {
                  e.target.style.borderColor = '#1a73e8'
                  e.target.style.boxShadow = '0 0 0 3px rgba(26, 115, 232, 0.1)'
                }
              }}
              onBlur={e => {
                e.target.style.boxShadow = 'none'
                if (!errors.email) e.target.style.borderColor = '#dadce0'
              }}
            />
            {errors.email && (
              <div style={{
                color: '#d33b27',
                fontSize: 13,
                marginTop: 6,
                fontWeight: 500,
              }}>
                {errors.email}
              </div>
            )}
          </div>

          {/* Password Input */}
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 9,
            }}>
              <label style={{
                fontSize: 13,
                fontWeight: 700,
                color: '#202124',
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}>
                Password
              </label>
              <Link
                to="/forgot-password"
                style={{
                  fontSize: 13,
                  color: '#1a73e8',
                  textDecoration: 'none',
                  fontWeight: 600,
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => (e.target.style.opacity = '0.8')}
                onMouseLeave={e => (e.target.style.opacity = '1')}
              >
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              value={form.password}
              onChange={e => {
                setForm(f => ({ ...f, password: e.target.value }))
                setErrors(er => ({ ...er, password: '' }))
              }}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '14px 16px',
                border: errors.password ? '2px solid #d33b27' : '1px solid #dadce0',
                borderRadius: 8,
                fontSize: 14,
                background: 'white',
                color: '#202124',
                transition: 'all 0.2s ease-out',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                boxSizing: 'border-box',
              }}
              onFocus={e => {
                if (!errors.password) {
                  e.target.style.borderColor = '#1a73e8'
                  e.target.style.boxShadow = '0 0 0 3px rgba(26, 115, 232, 0.1)'
                }
              }}
              onBlur={e => {
                e.target.style.boxShadow = 'none'
                if (!errors.password) e.target.style.borderColor = '#dadce0'
              }}
            />
            {errors.password && (
              <div style={{
                color: '#d33b27',
                fontSize: 13,
                marginTop: 6,
                fontWeight: 500,
              }}>
                {errors.password}
              </div>
            )}
          </div>

          {/* Submit Button - ENTERPRISE SIZE & STYLING */}
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            type="submit"
            style={{
              width: '100%',
              padding: '16px 20px',
              background: loading ? '#9aa0a6' : '#1a73e8',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s cubic-bezier(0.2, 0, 0, 1)',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              marginTop: 8,
              boxShadow: '0 2px 8px rgba(26, 115, 232, 0.3)',
            }}
            onMouseEnter={e => {
              if (!loading) {
                e.currentTarget.style.background = '#1557b0'
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(26, 115, 232, 0.4)'
              }
            }}
            onMouseLeave={e => {
              if (!loading) {
                e.currentTarget.style.background = '#1a73e8'
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(26, 115, 232, 0.3)'
              }
            }}
          >
            {loading ? '🔐 Signing in...' : `Sign In as ${tab === 'teacher' ? 'Teacher' : 'Parent'}`}
          </motion.button>
        </motion.form>

        {/* Footer Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            marginTop: 32,
            textAlign: 'center',
            fontSize: 12,
            color: '#3c4043',
            lineHeight: 1.8,
          }}
        >
          By signing in, you agree to our{' '}
          <a href="#" style={{
            color: '#1a73e8',
            textDecoration: 'none',
            fontWeight: 600,
          }}>
            Terms of Service
          </a>
          {' '}and{' '}
          <a href="#" style={{
            color: '#1a73e8',
            textDecoration: 'none',
            fontWeight: 600,
          }}>
            Privacy Policy
          </a>
        </motion.div>
      </motion.div>
    </div>
    </>
  )
}
