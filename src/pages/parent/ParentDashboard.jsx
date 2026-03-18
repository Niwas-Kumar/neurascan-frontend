import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brain, TrendingUp, AlertCircle, CheckCircle, ArrowRight, Calendar, Activity, Zap } from 'lucide-react'
import { optimizedAnalysisAPI } from '../../services/optimizedApi'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { format, formatDistanceToNow } from 'date-fns'

export default function ParentDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [report, setReport]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [noData, setNoData]   = useState(false)
  const [noStudentId, setNoStudentId] = useState(false)

  useEffect(() => {
    const sid = user?.studentId || localStorage.getItem('ns_studentId')
    
    // Check if student ID is missing
    if (!sid) { 
      setNoStudentId(true)
      setNoData(true)
      setLoading(false)
      return 
    }

    setNoStudentId(false)
    optimizedAnalysisAPI.getStudentReport(sid)
      .then(res => setReport(res.data.data))
      .catch(err => {
        // ✅ IMPROVED: Handle specific backend errors
        const errorMsg = err.response?.data?.message || err.message || 'Failed to load report'
        
        if (errorMsg.includes('Student ID not set')) {
          // Parent hasn't saved their child's student ID to Firestore yet
          setNoStudentId(true)
          setNoData(true)
        } else if (err.response?.status === 404 || err.response?.status === 403) {
          setNoData(true)
        } else if (err.response?.status === 401) {
          // Session expired - will be handled by global interceptor
          toast.error('Session expired. Please log in again.')
        } else {
          console.error('Dashboard error:', errorMsg)
          toast.error(errorMsg)
        }
      })
      .finally(() => setLoading(false))
  }, [user?.userId, user?.studentId])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  if (loading) return (
    <div>
      {/* Page Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
          {greeting} 👋
        </h1>
        <p style={{ fontSize: 16, color: 'var(--text-muted)' }}>Loading your child's report…</p>
      </motion.div>

      {/* Skeleton Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[1, 2, 3, 4].map(i => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{
              background: 'white',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: 16,
              minHeight: 100,
            }}
          >
            <div style={{ background: 'var(--bg-elevated)', height: 12, borderRadius: 4, marginBottom: 12, animation: 'pulse 2s infinite' }} />
            <div style={{ background: 'var(--bg-elevated)', height: 12, borderRadius: 4, animation: 'pulse 2s infinite' }} />
          </motion.div>
        ))}
      </div>
    </div>
  )

  const isAtRisk = report?.riskLevel === 'HIGH' || report?.riskLevel === 'MEDIUM'
  const riskColor = report?.riskLevel === 'HIGH' ? 'var(--danger)' : report?.riskLevel === 'MEDIUM' ? 'var(--warning)' : 'var(--success)'

  const StatCard = ({ icon: Icon, label, value, color, delay, sub }) => {
    const colorMap = {
      success: 'var(--success)',
      warning: 'var(--warning)',
      danger: 'var(--danger)',
      primary: 'var(--primary)',
      secondary: 'var(--secondary)'
    }
    const bgMap = {
      success: 'rgba(16, 185, 129, 0.08)',
      warning: 'rgba(245, 158, 11, 0.08)',
      danger: 'rgba(239, 68, 68, 0.06)',
      primary: 'rgba(26, 115, 232, 0.08)',
      secondary: 'rgba(8, 145, 178, 0.08)'
    }
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        style={{
          background: 'white',
          border: `1px solid ${colorMap[color]}`,
          borderRadius: 'var(--radius-lg)',
          padding: '16px 18px',
          cursor: 'default',
        }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.08)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
        style={{
          background: 'white',
          border: `1px solid ${colorMap[color]}`,
          borderRadius: 'var(--radius-lg)',
          padding: '16px 18px',
          transition: 'all 0.3s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: bgMap[color], border: `1px solid ${colorMap[color]}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={20} color={colorMap[color]} strokeWidth={2} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500, marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>{value}</div>
            {sub && <div style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 4 }}>{sub}</div>}
          </div>
        </div>
      </motion.div>
    )
  }

  const ScoreBar = ({ label, value }) => {
    const percentage = Math.min(Math.max(value || 0, 0), 100)
    const barColor = percentage <= 30 ? 'var(--success)' : percentage <= 60 ? 'var(--warning)' : 'var(--danger)'
    return (
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{percentage.toFixed(1)}%</span>
        </div>
        <div style={{ height: 8, background: 'var(--bg-elevated)', borderRadius: 'var(--radius-full)', overflow: 'hidden', border: '1px solid var(--border)' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{ height: '100%', background: barColor, borderRadius: 'var(--radius-full)' }}
          />
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Page Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
          {greeting}, <span style={{ color: 'var(--primary)' }}>{user?.name?.split(' ')[0]}</span> 👋
        </h1>
        {report && (
          <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>
            Latest analysis for {report.studentName} · {report.className}
          </p>
        )}
      </motion.div>

      {noData || !report ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ maxWidth: 560 }}
        >
          <div style={{
            background: 'white',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
          }}>
            <div style={{ height: 4, background: 'linear-gradient(90deg, var(--primary), var(--secondary))' }} />
            <div style={{ padding: '48px 40px', textAlign: 'center' }}>
              <div style={{
                width: 72, height: 72, borderRadius: 16,
                background: 'rgba(26, 115, 232, 0.08)',
                border: '1px solid rgba(26, 115, 232, 0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px'
              }}>
                <Brain size={32} color="var(--primary)" strokeWidth={1.5} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, marginBottom: 12, color: 'var(--text-primary)' }}>
                {noStudentId ? 'Set Up Your Child\'s Account' : 'No Reports Yet'}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.75, marginBottom: 28 }}>
                {noStudentId 
                  ? 'To view your child\'s progress and AI analysis reports, you need to link their student ID in your profile settings.'
                  : 'Your child\'s teacher hasn\'t uploaded a test paper yet. Once they do, the AI analysis results will appear here automatically.'
                }
              </p>
              {noStudentId && (
                <div style={{
                  background: 'rgba(26, 115, 232, 0.08)',
                  border: '1px solid rgba(26, 115, 232, 0.2)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px 16px',
                  marginBottom: 24,
                  fontSize: 14,
                  color: 'var(--text-secondary)',
                  textAlign: 'left'
                }}>
                  <div style={{ marginBottom: 8 }}>
                    <strong style={{ color: 'var(--primary)' }}>📝 How to get your child's Student ID:</strong>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 20, color: 'var(--text-muted)' }}>
                    <li>Ask your child's teacher directly</li>
                    <li>Check the welcome email or documents from school</li>
                    <li>Look in your child's assignment notebook</li>
                  </ul>
                </div>
              )}
              <button
                style={{
                  background: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.2, 0, 0, 1)',
                }}
                onClick={() => noStudentId ? navigate('/settings?tab=profile') : navigate('/parent/progress')}
                onMouseEnter={e => {
                  e.target.style.background = 'var(--primary-dark)'
                  e.target.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)'
                }}
                onMouseLeave={e => {
                  e.target.style.background = 'var(--primary)'
                  e.target.style.boxShadow = 'none'
                }}
              >
                {noStudentId ? 'Go to Settings →' : 'Check progress history →'}
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        <div>
          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 28 }}>
            <StatCard
              icon={isAtRisk ? AlertCircle : CheckCircle}
              label={isAtRisk ? 'Risk Level' : 'Status'}
              value={report.riskLevel}
              color={isAtRisk ? (report.riskLevel === 'HIGH' ? 'danger' : 'warning') : 'success'}
              delay={0}
            />
            <StatCard
              icon={Brain}
              label="Dyslexia Score"
              value={`${report.dyslexiaScore?.toFixed(1)}%`}
              color={report.dyslexiaScore <= 30 ? 'success' : report.dyslexiaScore <= 60 ? 'warning' : 'danger'}
              delay={0.1}
            />
            <StatCard
              icon={Zap}
              label="Dysgraphia Score"
              value={`${report.dysgraphiaScore?.toFixed(1)}%`}
              color={report.dysgraphiaScore <= 30 ? 'success' : report.dysgraphiaScore <= 60 ? 'warning' : 'danger'}
              delay={0.2}
            />
            <StatCard
              icon={Calendar}
              label="Last Analysis"
              value={report.createdAt ? format(new Date(report.createdAt), 'MMM d') : '—'}
              color="primary"
              delay={0.3}
              sub={report.createdAt ? formatDistanceToNow(new Date(report.createdAt), { addSuffix: true }) : ''}
            />
          </div>

          {/* Main cards row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>

            {/* Score card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                background: 'white',
                border: `1px solid ${isAtRisk ? 'rgba(239, 68, 68, 0.25)' : 'rgba(16, 185, 129, 0.25)'}`,
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
              }}
            >
              <div style={{
                padding: '20px 24px',
                borderBottom: '1px solid var(--border)',
                background: isAtRisk ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.06) 0%, transparent 60%)' : 'linear-gradient(135deg, rgba(16, 185, 129, 0.06) 0%, transparent 60%)',
                display: 'flex', alignItems: 'center', gap: 14,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: isAtRisk ? 'rgba(239, 68, 68, 0.08)' : 'rgba(16, 185, 129, 0.08)',
                  border: `1px solid ${isAtRisk ? 'rgba(239, 68, 68, 0.25)' : 'rgba(16, 185, 129, 0.25)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {isAtRisk ? <AlertCircle size={20} color="var(--danger)" /> : <CheckCircle size={20} color="var(--success)" />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>{report.studentName}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{report.className} · Paper #{report.paperId}</div>
                </div>
                <div style={{
                  background: riskColor,
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: 'uppercase'
                }}>
                  {report.riskLevel}
                </div>
              </div>

              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)', marginBottom: 22 }}>
                  <Calendar size={14} />
                  Analyzed {report.createdAt ? format(new Date(report.createdAt), 'MMMM d, yyyy \'at\' h:mm a') : '—'}
                </div>
                <ScoreBar label="Dyslexia Score" value={report.dyslexiaScore} />
                <ScoreBar label="Dysgraphia Score" value={report.dysgraphiaScore} />

                {isAtRisk && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    style={{
                      marginTop: 18,
                      padding: '14px 16px',
                      background: 'rgba(245, 158, 11, 0.08)',
                      border: '1px solid rgba(245, 158, 11, 0.2)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 13,
                      color: 'var(--text-secondary)',
                      lineHeight: 1.7
                    }}
                  >
                    <strong style={{ color: 'var(--warning)' }}>📋 Recommended action:</strong> Schedule a consultation with a learning specialist. Early intervention significantly improves outcomes.
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* AI Comment card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{
                background: 'white',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden'
              }}
            >
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: 'rgba(26, 115, 232, 0.08)',
                  border: '1px solid rgba(26, 115, 232, 0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Brain size={18} color="var(--primary)" strokeWidth={2} />
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>AI Assessment</div>
              </div>
              <div style={{ padding: '24px' }}>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 22 }}>
                  {report.aiComment}
                </p>
                <div style={{
                  padding: '14px 16px',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 13,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.7
                }}>
                  <strong style={{ color: 'var(--text-secondary)' }}>📌 Note:</strong> This AI assessment is a screening tool, not a clinical diagnosis. Always consult a qualified educational psychologist for a comprehensive evaluation.
                </div>
                <button
                  style={{
                    width: '100%',
                    marginTop: 16,
                    padding: '12px 16px',
                    background: 'white',
                    border: '1px solid var(--border)',
                    color: 'var(--primary)',
                    borderRadius: 'var(--radius-lg)',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.2, 0, 0, 1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8
                  }}
                  onClick={() => navigate('/parent/progress')}
                  onMouseEnter={e => {
                    e.target.style.background = 'var(--bg-elevated)'
                    e.target.style.borderColor = 'var(--primary)'
                  }}
                  onMouseLeave={e => {
                    e.target.style.background = 'white'
                    e.target.style.borderColor = 'var(--border)'
                  }}
                >
                  View full progress history
                  <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  )
}
