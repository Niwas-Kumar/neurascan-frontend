import { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'
import toast from 'react-hot-toast'

const COLORS = { sidebar: '#312E81', primary: '#14B8A6', primaryDark: '#0D9488' }

const Card = ({ title, value, color }) => (
  <div style={{
    background: 'white', borderRadius: '1rem', padding: '1.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)', flex: 1, minWidth: '200px',
    borderLeft: `4px solid ${color}`,
  }}>
    <div style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '0.5rem' }}>{title}</div>
    <div style={{ fontSize: '2rem', fontWeight: 700, color }}>{value}</div>
  </div>
)

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    adminAPI.getStats()
      .then(r => setStats(r.data.data))
      .catch(() => toast.error('Failed to load stats'))
  }, [])

  if (!stats) return <div style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>Loading...</div>

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: COLORS.sidebar, marginBottom: '1.5rem' }}>Admin Dashboard</h1>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Card title="Pending Teachers" value={stats.pendingTeachers} color="#F59E0B" />
        <Card title="Total Schools" value={stats.totalSchools} color={COLORS.primary} />
        <Card title="Active Schools" value={stats.activeSchools} color="#10B981" />
      </div>
    </div>
  )
}
