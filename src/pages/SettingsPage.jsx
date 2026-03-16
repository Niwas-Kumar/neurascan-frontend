import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Lock, Bell, Palette, Shield, Save, Check, Moon, Sun, Monitor } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'
import { PageHeader, Button, Input, Alert, Badge, Tabs } from '../components/shared/UI'
import toast from 'react-hot-toast'

function ProfileSection({ user, isTeacher }) {
  const { updateUser } = useAuth()
  const [form, setForm]     = useState({ name: user?.name || '', email: user?.email || '', school: user?.school || '' })
  const [loading, setLoading] = useState(false)
  const [saved, setSaved]   = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      // NOTE: calls PUT /api/auth/profile (new backend endpoint)
      const res = await authAPI.updateProfile({ name: form.name, school: form.school })
      if (res.data?.success) {
        updateUser(res.data.data)
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
