import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { NeuraScanLogo } from '../../components/shared/Logo.jsx'
import toast from 'react-hot-toast'

const COLORS = {
  sidebar: '#312E81',
  primary: '#14B8A6',
  primaryDark: '#0D9488',
}

export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await adminAPI.login(form.email, form.password)
      login(res.data.data)
      toast.success('Welcome, Admin!')
      navigate('/admin/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${COLORS.sidebar} 0%, #1E1B4B 100%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem',
    }}>
      <form onSubmit={handleSubmit} style={{
        background: 'white', borderRadius: '1.5rem', padding: '2.5rem',
        maxWidth: '420px', width: '100%', boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <NeuraScanLogo size="md" />
          <h2 style={{ color: COLORS.sidebar, marginTop: '0.5rem', fontSize: '1.25rem' }}>Admin Panel</h2>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.25rem' }}>Email</label>
          <input
            type="email" required value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #D1D5DB', borderRadius: '0.5rem', fontSize: '0.95rem', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.25rem' }}>Password</label>
          <input
            type="password" required value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #D1D5DB', borderRadius: '0.5rem', fontSize: '0.95rem', boxSizing: 'border-box' }}
          />
        </div>

        <button type="submit" disabled={loading} style={{
          width: '100%', padding: '0.85rem', background: COLORS.primary, color: 'white',
          border: 'none', borderRadius: '0.75rem', fontWeight: 700, fontSize: '1rem',
          cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
        }}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}
