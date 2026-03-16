import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brain, TrendingUp, AlertCircle, CheckCircle, ArrowRight, Calendar, Activity, User } from 'lucide-react'
import { analysisAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { PageHeader, RiskBadge, ScoreBar, Button, SkeletonCard, StatCard, Alert } from '../../components/shared/UI'
import toast from 'react-hot-toast'
import { format, formatDistanceToNow } from 'date-fns'

export default function ParentDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [report, setReport]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [noData, setNoData]   = useState(false)

  useEffect(() => {
    const sid = user?.studentId || localStorage.getItem('ns_studentId')
    if (!sid) { setNoData(true); setLoading(false); return }

    analysisAPI.getStudentReport(sid)
      .then(res => setReport(res.data.data))
      .catch(err => {
        if (err.response?.status === 404 || err.response?.status === 403) setNoData(true)
        else toast.error('Failed to load report')
      })
      .finally(() => setLoading(false))
  }, [])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  if (loading) return (
    <div>
      <PageHeader title={greeting} subtitle="Loading your child's report…" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <SkeletonCard rows={6} /><SkeletonCard rows={5} />
      </div>
    </div>
  )

  const isAtRisk = report?.riskLevel === 'HIGH' || report?.riskLevel === 'MEDIUM'

  return (
    <div>
      <PageHeader
        title={<>{greeting}, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋</>}
        subtitle={report ? `Latest analysis for ${report.studentName} · ${report.className}` : 'Your child\'s learning health at a glance.'}
        action={
          <Button variant="secondary" icon={<TrendingUp size={14} />} onClick={() => navigate('/parent/progress')}>
            View Progress
          </Button>
        }
      />

      {noData || !report ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ maxWidth: 560 }}
        >
          <div className="glass-panel" style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
            <div style={{ height: 4, background: 'linear-gradient(90deg, var(--violet), var(--cyan))' }} />
            <div style={{ padding: '48px 40px', textAlign: 'center' }}>
              <div style={{ width: 72, height: 72, borderRadius: 18, background: 'var(--violet-dim)', border: '1px solid rgba(139,92,246,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <Brain size={32} color="var(--violet-soft)" strokeWidth={1.5} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, marginBottom: 10 }}>No Reports Yet</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.75, marginBottom: 24 }}>
                Your child's teacher hasn't uploaded a test paper yet. Once they do, the AI analysis results will appear here automatically.
              </p>
              {!user?.studentId && (
                <Alert type="warning">
                  Your account doesn't have a linked student ID. Go to <strong>Settings → Profile</strong> to link your child's account.
                </Alert>
              )}
              <Button variant="ghost" icon={<ArrowRight size={14} />} onClick={() => navigate('/parent/progress')}>
                Check progress history
              </Button>
            </div>
          </div>
        </motion.div>
      ) : (
        <div>
          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
            <StatCard icon={isAtRisk ? AlertCircle : CheckCircle}
              label={isAtRisk ? 'Needs Attention' : 'All Good'}
              value={report.riskLevel}
              color={isAtRisk ? (report.riskLevel === 'HIGH' ? 'danger' : 'warning') : 'success'}
              delay={0}
            />
            <StatCard icon={Activity} label="Dyslexia Score"   value={`${report.dyslexiaScore?.toFixed(1)}%`}   color="violet"  delay={1} />
            <StatCard icon={Brain}    label="Dysgraphia Score" value={`${report.dysgraphiaScore?.toFixed(1)}%`} color="cyan"    delay={2} />
            <StatCard icon={Calendar} label="Last Analysis"    value={report.createdAt ? format(new Date(report.createdAt), 'MMM d') : '—'} color="success" delay={3} sub={report.createdAt ? formatDistanceToNow(new Date(report.createdAt), { addSuffix: true }) : ''} />
          </div>

          {/* Main cards row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>

            {/* Score card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="glass-panel"
              style={{
                border: `1px solid ${isAtRisk ? 'rgba(239,68,68,0.25)' : 'rgba(16,185,129,0.2)'}`,
                overflow: 'hidden',
              }}
            >
              <div style={{
                padding: '18px 24px', borderBottom: '1px solid var(--border)',
                background: isAtRisk ? 'linear-gradient(135deg, rgba(239,68,68,0.06) 0%, transparent 60%)' : 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, transparent 60%)',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: isAtRisk ? 'var(--danger-dim)' : 'var(--success-dim)', border: `1px solid ${isAtRisk ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {isAtRisk ? <AlertCircle size={20} color="var(--danger)" /> : <CheckCircle size={20} color="var(--success)" />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>{report.studentName}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{report.className} · Paper #{report.paperId}</div>
                </div>
                <RiskBadge level={report.riskLevel} />
              </div>

              <div style={{ padding: '22px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>
                  <Calendar size={12} />
                  Analyzed {report.createdAt ? format(new Date(report.createdAt), 'MMMM d, yyyy \'at\' h:mm a') : '—'}
                </div>
                <ScoreBar label="Dyslexia Score"   value={report.dyslexiaScore} />
                <ScoreBar label="Dysgraphia Score" value={report.dysgraphiaScore} />

                {isAtRisk && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                    style={{ marginTop: 16, padding: '12px 14px', background: 'var(--warning-dim)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 'var(--radius)', fontSize: 13, color: 'var(--warning)', lineHeight: 1.65 }}
                  >
                    <strong>Recommended action:</strong> Schedule a consultation with a learning specialist. Early intervention significantly improves outcomes.
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* AI Comment card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="glass-panel"
            >
              <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--violet-dim)', border: '1px solid rgba(139,92,246,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Brain size={15} color="var(--violet-soft)" />
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>AI Assessment</div>
              </div>
              <div style={{ padding: '22px 24px' }}>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 24 }}>
                  {report.aiComment}
                </p>
                <div style={{ padding: '14px 16px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  <strong style={{ color: 'var(--text-secondary)' }}>Note:</strong> This AI assessment is a screening tool, not a clinical diagnosis. Always consult a qualified educational psychologist for a comprehensive evaluation.
                </div>
                <Button
                  variant="ghost" fullWidth
                  iconRight={<ArrowRight size={14} />}
                  style={{ marginTop: 16 }}
                  onClick={() => navigate('/parent/progress')}
                >
                  View full progress history
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  )
}
