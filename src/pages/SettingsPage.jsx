import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Lock, Save, Check, Eye, EyeOff, CreditCard } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { authAPI, billingAPI } from '../services/api'
import toast from 'react-hot-toast'

// ════════════════════════════════════════════════════════════════
// DESIGN SYSTEM COLORS
// ════════════════════════════════════════════════════════════════
const COLORS = {
  sidebar: '#312E81',
  primary: '#14B8A6',
  primaryDark: '#0D9488',
  primaryLight: '#2DD4BF',
  primaryBg: '#CCFBF1',
  accent: '#312E81',
  accentLight: '#4338CA',
  accentBg: '#EEF2FF',
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
  warning: '#D97706',
  warningBg: '#FFFBEB',
}

// ════════════════════════════════════════════════════════════════
// TAB CONFIGURATION
// ════════════════════════════════════════════════════════════════
const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'password', label: 'Password', icon: Lock },
]

// ════════════════════════════════════════════════════════════════
// REUSABLE COMPONENTS
// ════════════════════════════════════════════════════════════════

const PageHeader = ({ title, subtitle }) => (
  <div style={{ marginBottom: 32 }}>
    <h1 style={{
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: 28,
      fontWeight: 800,
      marginBottom: 8,
      color: COLORS.textPrimary,
      letterSpacing: '-0.02em',
    }}>
      {title}
    </h1>
    {subtitle && (
      <p style={{ fontSize: 15, color: COLORS.textSecondary, lineHeight: 1.6 }}>
        {subtitle}
      </p>
    )}
  </div>
)

const Button = ({ children, variant = 'primary', loading, disabled, onClick, icon, fullWidth, type = 'button', style = {} }) => {
  const variants = {
    primary: {
      background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
      color: 'white',
      border: 'none',
      boxShadow: '0 4px 14px rgba(20, 184, 166, 0.3)',
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
  const v = variants[variant] || variants.primary

  return (
    <motion.button
      type={type}
      whileHover={!loading && !disabled ? { y: -1, boxShadow: '0 6px 20px rgba(20, 184, 166, 0.35)' } : {}}
      whileTap={!loading && !disabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={loading || disabled}
      style={{
        ...v,
        padding: '12px 24px',
        borderRadius: 10,
        fontSize: 14,
        fontWeight: 600,
        cursor: loading || disabled ? 'not-allowed' : 'pointer',
        opacity: loading || disabled ? 0.6 : 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        transition: 'all 0.2s ease',
        fontFamily: "'Inter', sans-serif",
        width: fullWidth ? '100%' : 'auto',
        ...style,
      }}
    >
      {loading ? (
        <div style={{
          width: 16,
          height: 16,
          border: '2px solid rgba(255,255,255,0.3)',
          borderTopColor: 'white',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
      ) : icon}
      {loading ? 'Saving...' : children}
    </motion.button>
  )
}

const Input = ({ label, type = 'text', placeholder, value, onChange, error, hint, disabled, required, style = {} }) => {
  const [isFocused, setIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  return (
    <div style={{ marginBottom: 20, ...style }}>
      {label && (
        <label style={{
          display: 'block',
          fontSize: 13,
          fontWeight: 600,
          color: COLORS.textPrimary,
          marginBottom: 8,
        }}>
          {label}
          {required && <span style={{ color: COLORS.error, marginLeft: 4 }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          style={{
            width: '100%',
            padding: isPassword ? '12px 44px 12px 14px' : '12px 14px',
            fontSize: 14,
            border: error
              ? `2px solid ${COLORS.error}`
              : isFocused
                ? `2px solid ${COLORS.primary}`
                : `1px solid ${COLORS.border}`,
            borderRadius: 10,
            background: disabled ? COLORS.bgSubtle : COLORS.bgSurface,
            color: COLORS.textPrimary,
            transition: 'all 0.2s ease',
            boxSizing: 'border-box',
            fontFamily: "'Inter', sans-serif",
            boxShadow: isFocused ? `0 0 0 3px ${COLORS.primaryBg}` : 'none',
            opacity: disabled ? 0.7 : 1,
            cursor: disabled ? 'not-allowed' : 'text',
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: COLORS.textMuted,
            }}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && (
        <div style={{ color: COLORS.error, fontSize: 12, marginTop: 6, fontWeight: 500 }}>
          {error}
        </div>
      )}
      {hint && !error && (
        <div style={{ color: COLORS.textMuted, fontSize: 12, marginTop: 6 }}>
          {hint}
        </div>
      )}
    </div>
  )
}

const Badge = ({ children, color = 'primary' }) => {
  const colors = {
    primary: { bg: COLORS.primaryBg, text: COLORS.primaryDark },
    accent: { bg: COLORS.accentBg, text: COLORS.accent },
  }
  const c = colors[color] || colors.primary

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '5px 12px',
      borderRadius: 100,
      fontSize: 12,
      fontWeight: 600,
      background: c.bg,
      color: c.text,
    }}>
      {children}
    </span>
  )
}

const SectionTitle = ({ children }) => (
  <h3 style={{
    fontSize: 16,
    fontWeight: 700,
    color: COLORS.textPrimary,
    marginBottom: 20,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  }}>
    {children}
  </h3>
)

// ════════════════════════════════════════════════════════════════
// PROFILE TAB
// ════════════════════════════════════════════════════════════════

function ProfileTab({ user, isTeacher }) {
  const { updateUser } = useAuth()
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    school: user?.school || '',
  })
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return

    setLoading(true)
    try {
      const updateData = {
        name: form.name.trim(),
        school: form.school.trim() || undefined,
      }
      const res = await authAPI.updateProfile(updateData)

      if (res.data?.success) {
        const profileData = res.data.data || {}
        updateUser(profileData)
        setSaved(true)
        toast.success('Profile updated successfully!')
        setTimeout(() => setSaved(false), 2500)
      } else {
        toast.error(res.data?.message || 'Update failed')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'

  return (
    <div>
      <SectionTitle>Profile Information</SectionTitle>

      {/* Avatar Section */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        padding: '20px 24px',
        background: `linear-gradient(135deg, ${COLORS.primaryBg} 0%, ${COLORS.bgSubtle} 100%)`,
        borderRadius: 16,
        marginBottom: 28,
        border: `1px solid ${COLORS.border}`,
      }}>
        <div style={{
          width: 80,
          height: 80,
          borderRadius: 16,
          background: user?.picture ? 'transparent' : `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 800,
          fontSize: 26,
          color: 'white',
          overflow: 'hidden',
          boxShadow: '0 4px 14px rgba(20, 184, 166, 0.25)',
          flexShrink: 0,
        }}>
          {user?.picture ? (
            <img src={user.picture} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : initials}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 20,
            fontWeight: 700,
            color: COLORS.textPrimary,
            marginBottom: 4,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {user?.name || 'User'}
          </div>
          <div style={{
            fontSize: 14,
            color: COLORS.textMuted,
            marginBottom: 10,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {user?.email}
          </div>
          <Badge color={isTeacher ? 'accent' : 'primary'}>
            {isTeacher ? 'Teacher' : 'Parent'}
          </Badge>
        </div>
      </div>

      {/* Form Fields */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: 16,
      }}>
        <Input
          label="Full Name"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          placeholder="Enter your full name"
          error={errors.name}
          required
        />
        <Input
          label="Email Address"
          value={form.email}
          disabled
          hint="Email cannot be changed. Contact support for assistance."
        />
      </div>

      <Input
        label="School / Institution"
        value={form.school}
        onChange={e => setForm(f => ({ ...f, school: e.target.value }))}
        placeholder="Enter your school or institution name"
        style={{ marginBottom: 28 }}
      />

      <Button
        onClick={handleSave}
        loading={loading}
        variant={saved ? 'success' : 'primary'}
        icon={saved ? <Check size={18} /> : <Save size={18} />}
      >
        {saved ? 'Saved!' : 'Save Changes'}
      </Button>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// PASSWORD TAB
// ════════════════════════════════════════════════════════════════

function PasswordTab() {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.currentPassword) {
      e.currentPassword = 'Current password is required'
    }
    if (!form.newPassword) {
      e.newPassword = 'New password is required'
    } else if (form.newPassword.length < 6) {
      e.newPassword = 'Password must be at least 6 characters'
    }
    if (!form.confirmPassword) {
      e.confirmPassword = 'Please confirm your new password'
    } else if (form.newPassword !== form.confirmPassword) {
      e.confirmPassword = 'Passwords do not match'
    }
    if (form.currentPassword && form.newPassword && form.currentPassword === form.newPassword) {
      e.newPassword = 'New password must be different from current password'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      await authAPI.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      })
      toast.success('Password changed successfully!')
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setErrors({})
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to change password'
      if (errorMsg.toLowerCase().includes('current') || errorMsg.toLowerCase().includes('incorrect')) {
        setErrors({ currentPassword: errorMsg })
      } else {
        toast.error(errorMsg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <SectionTitle>Change Password</SectionTitle>

      {/* Info Box */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '14px 16px',
        background: COLORS.primaryBg,
        borderRadius: 12,
        marginBottom: 24,
        border: `1px solid ${COLORS.primary}20`,
      }}>
        <Lock size={18} style={{ color: COLORS.primary, flexShrink: 0, marginTop: 2 }} />
        <div style={{ fontSize: 13, color: COLORS.textSecondary, lineHeight: 1.6 }}>
          For your security, please enter your current password before setting a new one.
          If you forgot your password, use the <strong>Forgot Password</strong> link on the login page.
        </div>
      </div>

      <Input
        label="Current Password"
        type="password"
        value={form.currentPassword}
        onChange={e => setForm(f => ({ ...f, currentPassword: e.target.value }))}
        error={errors.currentPassword}
        placeholder="Enter your current password"
        required
      />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: 16,
      }}>
        <Input
          label="New Password"
          type="password"
          value={form.newPassword}
          onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))}
          error={errors.newPassword}
          placeholder="Min. 6 characters"
          hint={!errors.newPassword ? 'Use a strong password with letters, numbers, and symbols' : undefined}
          required
        />
        <Input
          label="Confirm New Password"
          type="password"
          value={form.confirmPassword}
          onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
          error={errors.confirmPassword}
          placeholder="Repeat your new password"
          required
        />
      </div>

      <div style={{ marginTop: 8 }}>
        <Button type="submit" loading={loading} icon={<Lock size={18} />}>
          Update Password
        </Button>
      </div>
    </form>
  )
}

// ════════════════════════════════════════════════════════════════
// MAIN SETTINGS PAGE
// ════════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════════
// BILLING TAB
// ════════════════════════════════════════════════════════════════
const PLAN_COLORS = { FREE: '#64748B', BASIC: '#3B82F6', PRO: '#8B5CF6', ENTERPRISE: '#F59E0B' }

function BillingTab() {
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState(null)

  useEffect(() => {
    billingAPI.getSubscription()
      .then(r => setSubscription(r.data.data))
      .catch(() => toast.error('Failed to load subscription'))
      .finally(() => setLoading(false))
  }, [])

  const handleUpgrade = async (plan) => {
    setUpgrading(plan)
    try {
      const res = await billingAPI.createCheckout(plan)
      window.location.href = res.data.data.checkoutUrl
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start checkout')
      setUpgrading(null)
    }
  }

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: COLORS.textMuted }}>Loading...</div>

  const currentPlan = subscription?.plan || 'FREE'
  const plans = [
    { id: 'FREE', name: 'Free', price: '$0/mo', features: ['2 teachers', '25 students', '50 analyses/mo'] },
    { id: 'BASIC', name: 'Basic', price: '$29/mo', features: ['10 teachers', '200 students', '500 analyses/mo', 'CSV Import', 'PDF Reports'] },
    { id: 'PRO', name: 'Pro', price: '$79/mo', features: ['50 teachers', '1,000 students', '5,000 analyses/mo', 'All features', 'Advanced Analytics'] },
    { id: 'ENTERPRISE', name: 'Enterprise', price: 'Custom', features: ['Unlimited', 'All features', 'Priority support', 'Custom integrations'] },
  ]

  return (
    <div>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: COLORS.textPrimary, marginBottom: 8 }}>
        Subscription & Billing
      </h2>
      <p style={{ color: COLORS.textMuted, fontSize: '0.85rem', marginBottom: 24 }}>
        Current plan: <span style={{ fontWeight: 700, color: PLAN_COLORS[currentPlan] }}>{currentPlan}</span>
        {subscription?.status && ` (${subscription.status})`}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
        {plans.map(plan => {
          const isCurrent = plan.id === currentPlan
          const planOrder = ['FREE', 'BASIC', 'PRO', 'ENTERPRISE']
          const isDowngrade = planOrder.indexOf(plan.id) < planOrder.indexOf(currentPlan)
          return (
            <div key={plan.id} style={{
              border: `2px solid ${isCurrent ? PLAN_COLORS[plan.id] : COLORS.border}`,
              borderRadius: 12, padding: 20,
              background: isCurrent ? `${PLAN_COLORS[plan.id]}08` : 'white',
            }}>
              <div style={{ fontWeight: 700, color: PLAN_COLORS[plan.id], marginBottom: 4 }}>{plan.name}</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: COLORS.textPrimary, marginBottom: 12 }}>{plan.price}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px', fontSize: '0.8rem', color: COLORS.textSecondary }}>
                {plan.features.map(f => <li key={f} style={{ marginBottom: 4 }}>&#10003; {f}</li>)}
              </ul>
              {isCurrent ? (
                <div style={{ textAlign: 'center', color: PLAN_COLORS[plan.id], fontWeight: 600, fontSize: '0.85rem' }}>Current Plan</div>
              ) : plan.id === 'FREE' || isDowngrade ? null : (
                <button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={upgrading !== null}
                  style={{
                    width: '100%', padding: '8px', borderRadius: 8, border: 'none',
                    background: PLAN_COLORS[plan.id], color: 'white', fontWeight: 600,
                    cursor: upgrading ? 'not-allowed' : 'pointer', fontSize: '0.85rem',
                  }}
                >
                  {upgrading === plan.id ? 'Redirecting...' : 'Upgrade'}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const { user, isTeacher } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')

  const tabs = isTeacher
    ? [...TABS, { id: 'billing', label: 'Billing', icon: CreditCard }]
    : TABS

  return (
    <div style={{ minHeight: '100%' }}>
      {/* CSS Animation for loading spinner */}
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>

      <PageHeader
        title="Settings"
        subtitle="Manage your account settings and preferences"
      />

      <div style={{
        display: 'flex',
        gap: 24,
        alignItems: 'flex-start',
        flexWrap: 'wrap',
      }}>
        {/* Tab Navigation - Side Panel */}
        <div style={{
          flex: '0 0 220px',
          background: COLORS.bgSurface,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 16,
          padding: 8,
          position: 'sticky',
          top: 24,
        }}>
          {tabs.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id
            return (
              <motion.button
                key={id}
                onClick={() => setActiveTab(id)}
                whileHover={{ x: isActive ? 0 : 2 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: 12,
                  border: 'none',
                  background: isActive
                    ? `linear-gradient(135deg, ${COLORS.primaryBg} 0%, ${COLORS.primary}15 100%)`
                    : 'transparent',
                  color: isActive ? COLORS.primary : COLORS.textMuted,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left',
                  marginBottom: 4,
                }}
              >
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: isActive ? COLORS.primary : COLORS.bgSubtle,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}>
                  <Icon
                    size={18}
                    color={isActive ? 'white' : COLORS.textMuted}
                    strokeWidth={isActive ? 2 : 1.5}
                  />
                </div>
                {label}
              </motion.button>
            )
          })}
        </div>

        {/* Content Panel */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          style={{
            flex: '1 1 500px',
            minWidth: 0,
            background: COLORS.bgSurface,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 16,
            padding: '28px 32px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          {activeTab === 'profile' && <ProfileTab user={user} isTeacher={isTeacher} />}
          {activeTab === 'password' && <PasswordTab />}
          {activeTab === 'billing' && <BillingTab />}
        </motion.div>
      </div>
    </div>
  )
}
