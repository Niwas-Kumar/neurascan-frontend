import { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'
import toast from 'react-hot-toast'

const COLORS = { sidebar: '#312E81', primary: '#14B8A6', primaryDark: '#0D9488' }

export default function SchoolManagement() {
  const [schools, setSchools] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', address: '' })
  const [loading, setLoading] = useState(false)

  const load = () => {
    adminAPI.getSchools()
      .then(r => setSchools(r.data.data || []))
      .catch(() => toast.error('Failed to load schools'))
  }

  useEffect(load, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return toast.error('School name is required')
    setLoading(true)
    try {
      await adminAPI.createSchool(form.name, form.address)
      toast.success('School created!')
      setForm({ name: '', address: '' })
      setShowForm(false)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create school')
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = async (school) => {
    try {
      await adminAPI.toggleSchool(school.id, !school.active)
      toast.success(`School ${school.active ? 'deactivated' : 'activated'}`)
      load()
    } catch { toast.error('Failed to update school') }
  }

  const handleRegenerate = async (school) => {
    try {
      await adminAPI.regenerateCode(school.id)
      toast.success('Code regenerated!')
      load()
    } catch { toast.error('Failed to regenerate code') }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: COLORS.sidebar }}>School Management</h1>
        <button onClick={() => setShowForm(!showForm)} style={{
          padding: '0.6rem 1.2rem', background: COLORS.primary, color: 'white',
          border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer',
        }}>
          {showForm ? 'Cancel' : '+ Add School'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} style={{
          background: 'white', borderRadius: '1rem', padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '1.5rem',
          display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end',
        }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.25rem' }}>School Name *</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              style={{ width: '100%', padding: '0.6rem', border: '1px solid #D1D5DB', borderRadius: '0.5rem', boxSizing: 'border-box' }} />
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.25rem' }}>Address</label>
            <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
              style={{ width: '100%', padding: '0.6rem', border: '1px solid #D1D5DB', borderRadius: '0.5rem', boxSizing: 'border-box' }} />
          </div>
          <button type="submit" disabled={loading} style={{
            padding: '0.6rem 1.5rem', background: COLORS.primary, color: 'white',
            border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer',
          }}>
            {loading ? 'Creating...' : 'Create'}
          </button>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {schools.length === 0 && (
          <div style={{ textAlign: 'center', color: '#94A3B8', padding: '3rem' }}>No schools yet. Add one above.</div>
        )}
        {schools.map(s => (
          <div key={s.id} style={{
            background: 'white', borderRadius: '1rem', padding: '1.25rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
            opacity: s.active ? 1 : 0.6,
          }}>
            <div>
              <div style={{ fontWeight: 700, color: COLORS.sidebar, fontSize: '1.05rem' }}>{s.name}</div>
              {s.address && <div style={{ fontSize: '0.85rem', color: '#64748B' }}>{s.address}</div>}
              <div style={{
                marginTop: '0.5rem', fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 700,
                color: COLORS.primary, background: '#F0FDF4', padding: '0.25rem 0.75rem',
                borderRadius: '0.5rem', display: 'inline-block',
              }}>
                {s.code}
              </div>
              <span style={{ marginLeft: '0.75rem', fontSize: '0.8rem', color: s.active ? '#10B981' : '#EF4444' }}>
                {s.active ? '● Active' : '● Inactive'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => handleRegenerate(s)} style={{
                padding: '0.4rem 0.8rem', background: '#F1F5F9', border: '1px solid #E2E8F0',
                borderRadius: '0.4rem', cursor: 'pointer', fontSize: '0.8rem', color: '#475569',
              }}>
                Regenerate Code
              </button>
              <button onClick={() => handleToggle(s)} style={{
                padding: '0.4rem 0.8rem', background: s.active ? '#FEF2F2' : '#F0FDF4',
                border: `1px solid ${s.active ? '#FECACA' : '#BBF7D0'}`,
                borderRadius: '0.4rem', cursor: 'pointer', fontSize: '0.8rem',
                color: s.active ? '#DC2626' : '#16A34A',
              }}>
                {s.active ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
