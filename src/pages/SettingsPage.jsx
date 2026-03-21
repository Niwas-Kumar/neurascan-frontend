import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Lock, Bell, Palette, Save, Check, Moon, Sun, Monitor, Info } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

// ════════════════════════════════════════════════════════════════
// DESIGN SYSTEM COLORS
// ════════════════════════════════════════════════════════════════
const COLORS = {
  primary: '#312E81',
  primaryLight: '#4338CA',
  primaryLighter: '#6366F1',
  primaryBg: '#EEF2FF',
  secondary: '#14B8A6',
  secondaryDark: '#0D9488',
  secondaryBg: '#CCFBF1',
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
  error: '#B91C1C',
  errorBg: '#FEF2F2',
  warning: '#B45309',
  warningBg: '#FFFBEB',
}

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
  const v = variants[variant] || variants.primary

  return (
    <motion.button
      type={type}
      whileHover={!loading && !disabled ? { y: -1 } : {}}
      whileTap={!loading && !disabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={loading || disabled}
      style={{
        ...v,
        padding: '12px 20px',
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
      {icon}
      {loading ? 'Saving...' : children}
    </motion.button>
  )
}

const Input = ({ label, type = 'text', placeholder, value, onChange, error, hint, disabled, style = {} }) => {
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
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        style={{
          width: '100%',
          padding: '12px 14px',
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
          opacity: disabled ? 0.6 : 1,
          ...style,
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
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

const Alert = ({ type = 'info', children, style = {} }) => {
  const styles = {
    info: { bg: COLORS.primaryBg, border: `${COLORS.primary}30`, text: COLORS.primary, icon: Info },
    success: { bg: COLORS.successBg, border: `${COLORS.success}30`, text: COLORS.success, icon: Check },
    warning: { bg: COLORS.warningBg, border: `${COLORS.warning}30`, text: COLORS.warning, icon: Info },
    error: { bg: COLORS.errorBg, border: `${COLORS.error}30`, text: COLORS.error, icon: Info },
  }
  const s = styles[type] || styles.info
  const Icon = s.icon

  return (
    <div style={{
      background: s.bg,
      border: `1px solid ${s.border}`,
      borderRadius: 12,
      padding: '14px 16px',
      fontSize: 14,
      color: s.text,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      lineHeight: 1.6,
      ...style,
    }}>
      <Icon size={18} style={{ flexShrink: 0 }} />
      <span>{children}</span>
    </div>
  )
}

const Badge = ({ children, color = 'primary' }) => {
  const colors = {
    primary: { bg: COLORS.primaryBg, text: COLORS.primary },
    secondary: { bg: COLORS.secondaryBg, text: COLORS.secondaryDark },
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

// ════════════════════════════════════════════════════════════════
// SECTION COMPONENTS
// ════════════════════════════════════════════════════════════════

function ProfileSection({ user, isTeacher }) {
  const { updateUser } = useAuth()
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    school: user?.school || '',
    studentId: localStorage.getItem('ns_studentId') || ''
  })
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      const updateData = {
        name: form.name,
        school: isTeacher ? form.school : undefined,
        studentId: !isTeacher ? form.studentId : undefined
      }
      const res = await authAPI.updateProfile(updateData)

      if (res.data?.success) {
        const profileData = res.data.data || {}
        if (!isTeacher && form.studentId) {
          localStorage.setItem('ns_studentId', form.studentId)
          profileData.studentId = profileData.studentId || form.studentId
        }
        updateUser(profileData)
      }
      setSaved(true)
      toast.success('Profile updated!')
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'

  return (
    <div>
      {/* Avatar Section */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        padding: '20px 24px',
        background: COLORS.bgSubtle,
        borderRadius: 14,
        marginBottom: 28,
        border: `1px solid ${COLORS.border}`,
      }}>
        <div style={{
          width: 72,
          height: 72,
          borderRadius: 16,
          background: user?.picture ? 'transparent' : `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 800,
          fontSize: 24,
          color: 'white',
          overflow: 'hidden',
          boxShadow: '0 4px 14px rgba(49, 46, 129, 0.2)',
        }}>
          {user?.picture ? (
            <img src={user.picture} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : initials}
        </div>
        <div>
          <div style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 20,
            fontWeight: 700,
            color: COLORS.textPrimary,
            marginBottom: 4,
          }}>
            {user?.name}
          </div>
          <div style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 8 }}>
            {user?.email}
          </div>
          <Badge color={isTeacher ? 'primary' : 'secondary'}>
            {isTeacher ? 'Teacher' : 'Parent'}
          </Badge>
        </div>
      </div>

      {/* Form Fields */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <Input
          label="Full Name"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          placeholder="Your name"
        />
        <Input
          label="Email"
          value={form.email}
          disabled
          hint="Contact support to change email"
        />
      </div>

      {isTeacher && (
        <Input
          label="School / Institution"
          value={form.school}
          onChange={e => setForm(f => ({ ...f, school: e.target.value }))}
          placeholder="Springfield Elementary"
        />
      )}

      {!isTeacher && (
        <div style={{
          marginBottom: 20,
          padding: 20,
          background: COLORS.primaryBg,
          borderRadius: 14,
          border: `1px solid ${COLORS.primary}20`,
        }}>
          <Input
            label="Child's Student ID"
            value={form.studentId}
            onChange={e => setForm(f => ({ ...f, studentId: e.target.value }))}
            placeholder="Enter your child's student ID"
          />
          <div style={{ fontSize: 13, color: COLORS.textSecondary, lineHeight: 1.6 }}>
            <strong>How to find Student ID:</strong> Ask the teacher or check the documents from school. It's a unique identifier assigned to each student.
          </div>
        </div>
      )}

      <Button
        onClick={handleSave}
        loading={loading}
        variant={saved ? 'success' : 'primary'}
        icon={saved ? <Check size={16} /> : <Save size={16} />}
      >
        {saved ? 'Saved!' : 'Save changes'}
      </Button>
    </div>
  )
}

function PasswordSection() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.currentPassword) e.currentPassword = 'Current password is required'
    if (!form.newPassword || form.newPassword.length < 6) e.newPassword = 'Minimum 6 characters required'
    if (form.newPassword !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await authAPI.changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword })
      toast.success('Password changed successfully!')
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Alert type="info" style={{ marginBottom: 24 }}>
        For password reset via email, use the <strong>Forgot Password</strong> link on the login page.
      </Alert>

      <Input
        label="Current Password"
        type="password"
        value={form.currentPassword}
        onChange={e => setForm(f => ({ ...f, currentPassword: e.target.value }))}
        error={errors.currentPassword}
        placeholder="Enter current password"
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Input
          label="New Password"
          type="password"
          value={form.newPassword}
          onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))}
          error={errors.newPassword}
          placeholder="Min. 6 characters"
        />
        <Input
          label="Confirm Password"
          type="password"
          value={form.confirmPassword}
          onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
          error={errors.confirmPassword}
          placeholder="Repeat password"
        />
      </div>

      <Button type="submit" loading={loading} icon={<Lock size={16} />}>
        Update Password
      </Button>
    </form>
  )
}

function NotificationsSection() {
  const [prefs, setPrefs] = useState({
    emailReports: true,
    emailAtRisk: true,
    inAppAll: true,
    weeklyDigest: false,
  })
  const [saved, setSaved] = useState(false)

  const toggle = (key) => setPrefs(p => ({ ...p, [key]: !p[key] }))

  const save = () => {
    setSaved(true)
    toast.success('Notification preferences saved')
    setTimeout(() => setSaved(false), 2000)
  }

  const items = [
    { key: 'emailReports', label: 'New analysis report', desc: 'Get emailed when an analysis is completed' },
    { key: 'emailAtRisk', label: 'At-risk student alert', desc: 'Immediate alert when a high-risk result is found' },
    { key: 'inAppAll', label: 'In-app notifications', desc: 'Show notifications inside the dashboard' },
    { key: 'weeklyDigest', label: 'Weekly summary digest', desc: 'Receive a weekly email summarizing activity' },
  ]

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
        {items.map(({ key, label, desc }) => (
          <div
            key={key}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '18px 20px',
              background: COLORS.bgSubtle,
              borderRadius: 12,
              border: `1px solid ${COLORS.border}`,
              gap: 16,
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: COLORS.textPrimary, marginBottom: 4 }}>
                {label}
              </div>
              <div style={{ fontSize: 13, color: COLORS.textMuted }}>
                {desc}
              </div>
            </div>
            <button
              onClick={() => toggle(key)}
              style={{
                width: 48,
                height: 26,
                borderRadius: 13,
                border: 'none',
                cursor: 'pointer',
                flexShrink: 0,
                background: prefs[key] ? COLORS.primary : COLORS.bgSurface,
                transition: 'background 0.2s ease',
                position: 'relative',
                boxShadow: prefs[key] ? '0 2px 8px rgba(49, 46, 129, 0.25)' : `inset 0 0 0 1px ${COLORS.border}`,
              }}
            >
              <div style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: '#fff',
                position: 'absolute',
                top: 3,
                left: prefs[key] ? 25 : 3,
                transition: 'left 0.2s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              }} />
            </button>
          </div>
        ))}
      </div>

      <Button
        onClick={save}
        variant={saved ? 'success' : 'primary'}
        icon={saved ? <Check size={16} /> : <Bell size={16} />}
      >
        {saved ? 'Saved!' : 'Save preferences'}
      </Button>
    </div>
  )
}

function AppearanceSection() {
  const { theme, toggleTheme } = useAuth()
  const options = [
    { id: 'dark', icon: Moon, label: 'Dark', desc: 'Easy on the eyes' },
    { id: 'light', icon: Sun, label: 'Light', desc: 'Bright and clean' },
    { id: 'system', icon: Monitor, label: 'System', desc: 'Follows OS setting' },
  ]

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h3 style={{
          fontSize: 15,
          fontWeight: 700,
          color: COLORS.textPrimary,
          marginBottom: 6,
        }}>
          Color Theme
        </h3>
        <p style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 20 }}>
          Choose how NeuraScan looks to you.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {options.map(({ id, icon: Icon, label, desc }) => (
            <motion.div
              key={id}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => (id === 'dark' || id === 'light') && theme !== id && toggleTheme?.()}
              style={{
                padding: '24px 16px',
                textAlign: 'center',
                cursor: 'pointer',
                background: theme === id ? COLORS.primaryBg : COLORS.bgSubtle,
                border: theme === id ? `2px solid ${COLORS.primary}` : `1px solid ${COLORS.border}`,
                borderRadius: 14,
                transition: 'all 0.2s ease',
                boxShadow: theme === id ? '0 4px 14px rgba(49, 46, 129, 0.15)' : 'none',
              }}
            >
              <Icon
                size={24}
                color={theme === id ? COLORS.primary : COLORS.textMuted}
                style={{ marginBottom: 12 }}
              />
              <div style={{
                fontWeight: 600,
                fontSize: 14,
                color: theme === id ? COLORS.textPrimary : COLORS.textSecondary,
                marginBottom: 4,
              }}>
                {label}
              </div>
              <div style={{ fontSize: 12, color: COLORS.textMuted }}>
                {desc}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Alert type="info">
        The current design is optimized for light mode. Dark mode support is coming soon.
      </Alert>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// MAIN SETTINGS PAGE
// ════════════════════════════════════════════════════════════════

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'password', label: 'Password', icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
]

export default function SettingsPage() {
  const { user, isTeacher } = useAuth()
  const [tab, setTab] = useState('profile')

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Manage your account, preferences, and security."
      />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start' }}>
        {/* Side Navigation */}
        <div style={{
          flex: '1 1 220px',
          maxWidth: 240,
          background: COLORS.bgSurface,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 14,
          padding: 8,
          position: 'sticky',
          top: 80,
        }}>
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                padding: '12px 14px',
                borderRadius: 10,
                border: 'none',
                background: tab === id ? COLORS.primaryBg : 'transparent',
                color: tab === id ? COLORS.primary : COLORS.textMuted,
                fontFamily: "'Inter', sans-serif",
                fontSize: 14,
                fontWeight: tab === id ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left',
              }}
            >
              <Icon size={18} strokeWidth={tab === id ? 2 : 1.5} />
              {label}
            </button>
          ))}
        </div>

        {/* Content Panel */}
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            flex: '3 1 500px',
            minWidth: 0,
            background: COLORS.bgSurface,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 14,
            padding: '28px 32px',
          }}
        >
          {tab === 'profile' && <ProfileSection user={user} isTeacher={isTeacher} />}
          {tab === 'password' && <PasswordSection />}
          {tab === 'notifications' && <NotificationsSection />}
          {tab === 'appearance' && <AppearanceSection />}
        </motion.div>
      </div>
    </div>
  )
}
