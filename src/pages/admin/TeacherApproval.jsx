import { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'
import toast from 'react-hot-toast'

const COLORS = { sidebar: '#312E81', primary: '#14B8A6' }

const STATUS_STYLES = {
  PENDING: { bg: '#FEF3C7', color: '#92400E', label: 'Pending' },
  APPROVED: { bg: '#D1FAE5', color: '#065F46', label: 'Approved' },
  REJECTED: { bg: '#FEE2E2', color: '#991B1B', label: 'Rejected' },
}

export default function TeacherApproval() {
  const [teachers, setTeachers] = useState([])
  const [filter, setFilter] = useState('PENDING')
  const [rejectModal, setRejectModal] = useState(null)
  const [reason, setReason] = useState('')

  const load = () => {
    adminAPI.getTeachers(filter || undefined)
      .then(r => setTeachers(r.data.data || []))
      .catch(() => toast.error('Failed to load teachers'))
  }

  useEffect(load, [filter])

  const handleApprove = async (id) => {
    try {
      await adminAPI.approveTeacher(id)
      toast.success('Teacher approved!')
      load()
    } catch { toast.error('Failed to approve') }
  }

  const handleReject = async () => {
    if (!rejectModal) return
    try {
      await adminAPI.rejectTeacher(rejectModal, reason)
      toast.success('Teacher rejected')
      setRejectModal(null)
      setReason('')
      load()
    } catch { toast.error('Failed to reject') }
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: COLORS.sidebar, marginBottom: '1rem' }}>Teacher Approval</h1>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {['PENDING', 'APPROVED', 'REJECTED', ''].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0',
            background: filter === f ? COLORS.primary : 'white',
            color: filter === f ? 'white' : '#475569',
            fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem',
          }}>
            {f || 'All'}
          </button>
        ))}
      </div>

      {teachers.length === 0 && (
        <div style={{ textAlign: 'center', color: '#94A3B8', padding: '3rem' }}>No teachers found.</div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {teachers.map(t => {
          const st = STATUS_STYLES[t.verificationStatus] || STATUS_STYLES.PENDING
          return (
            <div key={t.id} style={{
              background: 'white', borderRadius: '1rem', padding: '1.25rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
            }}>
              <div>
                <div style={{ fontWeight: 700, color: COLORS.sidebar }}>{t.name}</div>
                <div style={{ fontSize: '0.85rem', color: '#64748B' }}>{t.email}</div>
                {t.school && <div style={{ fontSize: '0.85rem', color: '#64748B' }}>School: {t.school}</div>}
                <span style={{
                  display: 'inline-block', marginTop: '0.4rem', padding: '0.2rem 0.6rem',
                  borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600,
                  background: st.bg, color: st.color,
                }}>
                  {st.label}
                </span>
              </div>
              {t.verificationStatus === 'PENDING' && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleApprove(t.id)} style={{
                    padding: '0.5rem 1rem', background: '#10B981', color: 'white',
                    border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer',
                  }}>Approve</button>
                  <button onClick={() => setRejectModal(t.id)} style={{
                    padding: '0.5rem 1rem', background: '#EF4444', color: 'white',
                    border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer',
                  }}>Reject</button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {rejectModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }} onClick={() => setRejectModal(null)}>
          <div style={{
            background: 'white', borderRadius: '1rem', padding: '2rem', maxWidth: '400px', width: '90%',
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ color: COLORS.sidebar, marginBottom: '1rem' }}>Rejection Reason</h3>
            <textarea value={reason} onChange={e => setReason(e.target.value)}
              rows={3} placeholder="Optional reason for rejection"
              style={{ width: '100%', padding: '0.6rem', border: '1px solid #D1D5DB', borderRadius: '0.5rem', resize: 'vertical', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setRejectModal(null)} style={{
                padding: '0.5rem 1rem', background: '#F1F5F9', border: '1px solid #E2E8F0',
                borderRadius: '0.5rem', cursor: 'pointer',
              }}>Cancel</button>
              <button onClick={handleReject} style={{
                padding: '0.5rem 1rem', background: '#EF4444', color: 'white',
                border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer',
              }}>Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
