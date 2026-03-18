import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Lock, Bell, Palette, Shield, Save, Check, Moon, Sun, Monitor } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

// ── Inline PageHeader Component ────────────────────────────
const PageHeader = ({ title, subtitle, breadcrumb }) => (
  <div style={{ marginBottom: 32 }}>
    {breadcrumb && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>{breadcrumb}</div>}
    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, marginBottom: 6, color: 'var(--text-primary)' }}>{title}</h1>
    {subtitle && <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{subtitle}</p>}
  </div>
)

// ── Inline Button Component ────────────────────────────
const Button = ({ children, type = 'button', fullWidth = false, size = 'md', loading = false, disabled = false, variant = 'primary', onClick, icon, style = {}, ...props }) => {
  const heights = { sm: 36, md: 40, lg: 44 }
  const paddings = { sm: '8px 16px', md: '12px 20px', lg: '14px 24px' }
  const [isHovering, setIsHovering] = useState(false)

  const bgColor = variant === 'ghost' ? 'transparent' : isHovering && !disabled ? 'var(--primary-hover)' : 'var(--primary)'
  const textColor = variant === 'ghost' ? 'var(--primary)' : 'white'

  return (
    <button
      type={type}
      disabled={loading || disabled}
      onClick={onClick}
      style={{
        width: fullWidth ? '100%' : 'auto',
        height: heights[size],
        padding: paddings[size],
        background: bgColor,
        color: textColor,
        border: variant === 'ghost' ? '1px solid var(--border)' : 'none',
        borderRadius: 'var(--radius-lg)',
        fontSize: size === 'sm' ? 13 : size === 'lg' ? 15 : 14,
        fontWeight: 600,
        cursor: loading || disabled ? 'not-allowed' : 'pointer',
        opacity: loading || disabled ? 0.6 : 1,
        transition: 'all 0.3s cubic-bezier(0.2, 0, 0, 1)',
        boxShadow: isHovering && variant !== 'ghost' && !disabled ? '0 4px 16px rgba(26, 115, 232, 0.3)' : 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: icon ? 8 : 0,
        ...style,
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {loading ? '...' : children}
    </button>
  )
}

// ── Inline Input Component ────────────────────────────
const Input = ({ label, type = 'text', placeholder, value, onChange, required = false, error, style = {} }) => {
  const [isFocused, setIsFocused] = useState(false)
  
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label style={{
          display: 'block',
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--text-primary)',
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
        required={required}
        style={{
          width: '100%',
          padding: '12px 14px',
          fontSize: 14,
          border: error ? '1.5px solid var(--danger)' : isFocused ? '2px solid var(--primary)' : '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          background: 'white',
          color: 'var(--text-primary)',
          transition: 'all 0.2s ease',
          boxSizing: 'border-box',
          fontFamily: 'inherit',
          ...style,
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {error && <div style={{ color: 'var(--danger)', fontSize: 12, marginTop: 6 }}>{error}</div>}
    </div>
  )
}

// ── Inline Alert Component ────────────────────────────
const Alert = ({ type = 'info', children, onClose, style = {} }) => {
  const colors = {
    danger: { bg: 'var(--danger-dim)', border: 'var(--danger-glow)', text: 'var(--danger)' },
    warning: { bg: 'var(--warning-dim)', border: 'var(--warning-glow)', text: 'var(--warning)' },
    success: { bg: 'var(--success-dim)', border: 'var(--success-glow)', text: 'var(--success)' },
    info: { bg: 'var(--primary-dim)', border: 'var(--primary-glow)', text: 'var(--primary)' },
  }
  const color = colors[type] || colors.info

  return (
    <div style={{
      background: color.bg,
      border: `1px solid ${color.border}`,
      borderRadius: 'var(--radius)',
      padding: '12px 14px',
      fontSize: 13,
      color: color.text,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      ...style,
    }}>
      <span>{children}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: color.text, cursor: 'pointer', fontSize: 18, padding: 0, marginLeft: 12 }}
        >
          ×
        </button>
      )}
    </div>
  )
}

// ── Inline Badge Component ────────────────────────────
const Badge = ({ children, icon: Icon, variant = 'primary' }) => {
  const colors = { primary: '#e8f0fe', secondary: '#f3f4f6', success: '#d1fae5' }
  const textColors = { primary: '#1a73e8', secondary: '#374151', success: '#10b981' }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '6px 12px',
      borderRadius: '12px',
      fontSize: 12,
      fontWeight: 600,
      background: colors[variant],
      color: textColors[variant],
    }}>
      {Icon && <Icon size={14} />}
      {children}
    </span>
  )
}

// ── Inline Tabs Component ────────────────────────────
const Tabs = ({ tabs, defaultTab = 0, children }) => {
  const [active, setActive] = useState(defaultTab)
  return (
    <>
      <div style={{ display: 'flex', gap: 24, borderBottom: '1px solid var(--border)', marginBottom: 28 }}>
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              padding: '16px 0',
              fontSize: 14,
              fontWeight: active === i ? 700 : 600,
              color: active === i ? 'var(--primary)' : 'var(--text-secondary)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              borderBottom: active === i ? '2px solid var(--primary)' : 'none',
              transition: 'all 0.3s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>{typeof children === 'function' ? children(active) : children[active]}</div>
    </>
  )
}

function ProfileSection({ user, isTeacher }) {
  const { updateUser } = useAuth()
  const [form, setForm]     = useState({ name: user?.name || '', email: user?.email || '', school: user?.school || '', studentId: localStorage.getItem('ns_studentId') || '' })
  const [loading, setLoading] = useState(false)
  const [saved, setSaved]   = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      const updateData = { name: form.name, school: isTeacher ? form.school : undefined }
      // NOTE: calls PUT /api/auth/profile (new backend endpoint)
      const res = await authAPI.updateProfile(updateData)
      if (res.data?.success) {
        updateUser(res.data.data)
      }
      // Save student ID to localStorage for parents
      if (!isTeacher && form.studentId) {
        localStorage.setItem('ns_studentId', form.studentId)
      }
      setSaved(true)
      toast.success('Profile updated!')
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally { setLoading(false) }
  }

  const hue = (user?.name?.charCodeAt(0) || 0) * 137 % 360

  return (
    <div>
      {/* Avatar */}
      <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 20, marginBottom: 32, padding: '20px 24px' }}>
        <div style={{
          width: 72, height: 72, borderRadius: 18,
          background: user?.picture ? 'transparent' : `hsl(${hue}, 40%, 18%)`,
          border: `2px solid hsl(${hue}, 50%, 35%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 28,
          color: `hsl(${hue}, 70%, 75%)`,
          boxShadow: `0 8px 24px hsl(${hue}, 50%, 20%)`,
          overflow: 'hidden'
        }}>
          {user?.picture ? (
            <img src={user.picture} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            user?.name?.charAt(0).toUpperCase() || '?'
          )}
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{user?.name}</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>{user?.email}</div>
          <Badge color="violet" dot>{isTeacher ? 'Teacher' : 'Parent'}</Badge>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <Input label="Full Name" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="Your name" />
        <Input label="Email" value={form.email} disabled hint="Contact support to change email" style={{ opacity: 0.6 }} />
      </div>
      {isTeacher && (
        <Input label="School / Institution" value={form.school} onChange={e => setForm(f => ({...f, school: e.target.value}))} placeholder="Springfield Elementary" />
      )}
      
      {/* Parent-specific: Student ID field */}
      {!isTeacher && (
        <div style={{ marginBottom: 16, padding: 16, background: 'rgba(99, 102, 241, 0.05)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
          <Input 
            label="Child's Student ID" 
            value={form.studentId} 
            onChange={e => setForm(f => ({...f, studentId: e.target.value}))} 
            placeholder="Enter your child's student ID to view their progress"
            required={false}
          />
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 8 }}>
            📝 <strong>How to find Student ID:</strong> Ask the teacher or check the handwritten notes that came home. It's usually a unique identifier assigned to each student.
          </div>
        </div>
      )}

      <Button
        onClick={handleSave}
        loading={loading}
        icon={saved ? <Check size={15} /> : <Save size={15} />}
        variant={saved ? 'success' : 'primary'}
      >
        {saved ? 'Saved!' : 'Save changes'}
      </Button>
    </div>
  )
}

function PasswordSection() {
  const [form, setForm]     = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.currentPassword) e.currentPassword = 'Required'
    if (!form.newPassword || form.newPassword.length < 6) e.newPassword = 'Min 6 characters'
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
    } finally { setLoading(false) }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Alert type="info" style={{ marginBottom: 24 }}>
        For password reset via email, use the <strong>Forgot Password</strong> link on the login page.
      </Alert>
      <Input label="Current Password" type="password" value={form.currentPassword} onChange={e => setForm(f => ({...f, currentPassword: e.target.value}))} error={errors.currentPassword} required />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Input label="New Password"     type="password" value={form.newPassword}     onChange={e => setForm(f => ({...f, newPassword: e.target.value}))}     error={errors.newPassword}     required hint="Min. 6 characters" />
        <Input label="Confirm Password" type="password" value={form.confirmPassword} onChange={e => setForm(f => ({...f, confirmPassword: e.target.value}))} error={errors.confirmPassword} required />
      </div>
      <Button type="submit" loading={loading} icon={<Lock size={15} />}>Update Password</Button>
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

  const toggle = (key) => setPrefs(p => ({...p, [key]: !p[key]}))

  const save = () => {
    setSaved(true)
    toast.success('Notification preferences saved')
    setTimeout(() => setSaved(false), 2000)
  }

  const items = [
    { key: 'emailReports', label: 'Email — New analysis report', desc: 'Get emailed when an analysis is completed' },
    { key: 'emailAtRisk',  label: 'Email — At-risk student alert', desc: 'Immediate alert when a high-risk result is found' },
    { key: 'inAppAll',     label: 'In-app notifications', desc: 'Show notifications inside the dashboard' },
    { key: 'weeklyDigest', label: 'Weekly summary digest', desc: 'Receive a weekly email summarizing activity' },
  ]

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
        {items.map(({ key, label, desc }) => (
          <div key={key} className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', gap: 16 }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{desc}</div>
            </div>
            <button
              onClick={() => toggle(key)}
              style={{
                width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', flexShrink: 0,
                background: prefs[key] ? 'var(--violet)' : 'var(--bg-elevated)',
                transition: 'background var(--duration)',
                position: 'relative',
                boxShadow: prefs[key] ? '0 2px 8px var(--violet-glow)' : 'inset 0 0 0 1px var(--border)',
              }}
            >
              <div style={{
                width: 18, height: 18, borderRadius: '50%', background: '#fff',
                position: 'absolute', top: 3, left: prefs[key] ? 23 : 3,
                transition: 'left var(--duration) var(--ease-spring)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
              }} />
            </button>
          </div>
        ))}
      </div>
      <Button onClick={save} variant={saved ? 'success' : 'primary'} icon={saved ? <Check size={14} /> : <Bell size={14} />}>
        {saved ? 'Saved!' : 'Save preferences'}
      </Button>
    </div>
  )
}

function AppearanceSection() {
  const { theme, toggleTheme } = useAuth()
  const options = [
    { id: 'dark',   icon: Moon,    label: 'Dark',   desc: 'Easy on the eyes' },
    { id: 'light',  icon: Sun,     label: 'Light',  desc: 'Bright and clean' },
    { id: 'system', icon: Monitor, label: 'System', desc: 'Follows OS setting' },
  ]
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Color theme</h3>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>Choose how NeuraScan looks to you.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {options.map(({ id, icon: Icon, label, desc }) => (
            <motion.div key={id} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
              onClick={() => id === 'dark' || id === 'light' ? (theme !== id && toggleTheme()) : null}
              style={{
                padding: '20px 16px', textAlign: 'center', cursor: 'pointer',
                background: theme === id ? 'var(--violet-dim)' : 'var(--bg-card)',
                border: `2px solid ${theme === id ? 'var(--violet)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-lg)', transition: 'all var(--duration)',
                boxShadow: theme === id ? '0 4px 16px var(--violet-glow)' : 'none',
              }}
            >
              <Icon size={22} color={theme === id ? 'var(--violet-soft)' : 'var(--text-muted)'} style={{ marginBottom: 10 }} />
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
      <Alert type="info">
        Light mode coming soon. The current design is optimized for dark mode.
      </Alert>
    </div>
  )
}

const TABS = [
  { id: 'profile',      label: 'Profile',       icon: User },
  { id: 'password',     label: 'Password',      icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance',   label: 'Appearance',    icon: Palette },
]

export default function SettingsPage() {
  const { user, isTeacher } = useAuth()
  const [tab, setTab] = useState('profile')

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your account, preferences, and security." breadcrumb="NeuraScan / Settings" />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start' }}>
        {/* Side nav */}
        <div className="glass-panel" style={{ flex: '1 1 220px', maxWidth: '100%', padding: '8px', display: 'flex', flexDirection: 'column', gap: 2, position: 'sticky', top: 80 }}>
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px', borderRadius: 'var(--radius)', border: 'none',
              background: tab === id ? 'var(--bg-elevated)' : 'transparent',
              color: tab === id ? 'var(--text-primary)' : 'var(--text-muted)',
              fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: tab === id ? 600 : 400,
              cursor: 'pointer', transition: 'all var(--duration)', textAlign: 'left',
              boxShadow: tab === id ? '0 1px 4px rgba(0,0,0,0.2)' : 'none',
            }}>
              <Icon size={15} color={tab === id ? 'var(--violet-soft)' : 'var(--text-muted)'} strokeWidth={1.75} />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="glass-panel"
          style={{ flex: '3 1 500px', minWidth: 0, padding: '28px 32px' }}
        >
          {tab === 'profile'       && <ProfileSection user={user} isTeacher={isTeacher} />}
          {tab === 'password'      && <PasswordSection />}
          {tab === 'notifications' && <NotificationsSection />}
          {tab === 'appearance'    && <AppearanceSection />}
        </motion.div>
      </div>
    </div>
  )
}
