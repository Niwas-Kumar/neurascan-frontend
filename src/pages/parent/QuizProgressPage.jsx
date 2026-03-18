import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Calendar, CheckCircle, XCircle } from 'lucide-react'
import { quizAPI } from '../../services/api'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

// ── Inline PageHeader Component ────────────────────────────
const PageHeader = ({ title, subtitle, breadcrumb }) => (
  <div style={{ marginBottom: 32 }}>
    {breadcrumb && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>{breadcrumb}</div>}
    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, marginBottom: 6, color: 'var(--text-primary)' }}>{title}</h1>
    {subtitle && <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{subtitle}</p>}
  </div>
)

// ── Inline EmptyState Component ────────────────────────────
const EmptyState = ({ icon: Icon, title, description }) => (
  <div style={{border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '48px 32px', textAlign: 'center' }}>
    {Icon && <Icon size={40} color="var(--text-muted)" strokeWidth={1.25} style={{ marginBottom: 16 }} />}
    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, marginBottom: 8 }}>{title}</h3>
    {description && <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.75 }}>{description}</p>}
  </div>
)

// ── Inline SkeletonCard Component ────────────────────────────
const SkeletonCard = ({ rows = 4 }) => (
  <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px 24px' }}>
    {Array(rows).fill(0).map((_, i) => (
      <div key={i} style={{
        height: i === 0 ? 24 : 14,
        background: 'linear-gradient(90deg, var(--bg-hover) 25%, var(--bg-elevated) 50%, var(--bg-hover) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        borderRadius: 6,
        marginBottom: i < rows - 1 ? 12 : 0,
      }} />
    ))}
    <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
  </div>
)

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

// ── Inline ScoreBar Component ────────────────────────────
const ScoreBar = ({ label, value }) => {
  const color = value >= 70 ? 'var(--danger)' : value >= 45 ? 'var(--warning)' : 'var(--success)'
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{label}</span>
        <span style={{ fontSize: 14, fontWeight: 700, color }}>{value?.toFixed(1)}%</span>
      </div>
      <div style={{ height: 6, background: 'var(--bg-elevated)', borderRadius: 3, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ height: '100%', background: color, borderRadius: 3 }}
        />
      </div>
    </div>
  )
}

export default function QuizProgressPage() {
  const { user } = useAuth()
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    if (!user?.studentId) {
      toast.error('No linked student assigned yet')
      setLoading(false)
      return
    }

    quizAPI.getStudentResponses(user.studentId)
      .then(r => setResponses(r.data.data || []))
      .catch(() => toast.error('Could not load quiz progress'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [user?.studentId])

  const average = responses.length > 0 ? (responses.reduce((sum, x) => sum + (x.score || 0), 0) / responses.length).toFixed(1) : 0

  return (
    <div>
      <PageHeader
        title="Student Quiz Progress"
        subtitle={responses.length > 0 ? `Latest ${responses.length} submissions` : 'No submissions yet'}
      />

      <div style={{ display: 'flex', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
        <Badge icon={Calendar}>Records: {responses.length}</Badge>
        <Badge icon={BarChart}>Average: {average}%</Badge>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gap: 10 }}>
          {[1,2].map(i => <SkeletonCard key={i} rows={2} />)}
        </div>
      ) : (responses.length === 0 ? (
        <EmptyState icon={BarChart} title="No quiz data available" description="Ask teacher to assign or submit a quiz first." />
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          {responses.map(r => (
            <div key={r.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontWeight: 700 }}>{r.quizId}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: r.score >= 70 ? 'var(--success)' : r.score >= 45 ? 'var(--warning)' : 'var(--danger)' }}>
                  {r.score >= 70 ? <CheckCircle size={14} /> : <XCircle size={14} />}
                  {r.score}%
                </div>
              </div>
              <ScoreBar value={r.score} />
              <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}>Submitted: {new Date(r.submittedAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
