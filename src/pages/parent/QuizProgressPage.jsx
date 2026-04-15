import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BarChart, Calendar, CheckCircle, XCircle, ArrowRight, Clock,
  Target, TrendingUp, TrendingDown, Brain, BookOpen, Loader2
} from 'lucide-react'
import { parentStudentAPI, quizAPI } from '../../services/api'
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
  const colors = {
    primary: 'var(--color-primary-bg)',
    secondary: 'var(--color-bg-subtle)',
    success: 'var(--risk-low-bg)',
    warning: 'var(--risk-medium-bg)',
    danger: 'var(--risk-high-bg)'
  }
  const textColors = {
    primary: 'var(--color-primary)',
    secondary: 'var(--color-text-secondary)',
    success: 'var(--risk-low)',
    warning: 'var(--risk-medium)',
    danger: 'var(--risk-high)'
  }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '6px 12px',
      borderRadius: 100,
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

// ── Score Circle Component ────────────────────────────
const ScoreCircle = ({ score, size = 80 }) => {
  const color = score >= 70 ? 'var(--success)' : score >= 50 ? 'var(--warning)' : 'var(--danger)'
  const circumference = 2 * Math.PI * 35
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r="35" fill="none" stroke="var(--border)" strokeWidth="6" />
        <motion.circle
          cx={size/2} cy={size/2} r="35" fill="none" stroke={color} strokeWidth="6"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        fontSize: 18, fontWeight: 800, color
      }}>
        {Math.round(score)}%
      </div>
    </div>
  )
}

// ── Format time helper ────────────────────────────
const formatTime = (ms) => {
  if (!ms) return '0s'
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  if (minutes > 0) return `${minutes}m ${remainingSeconds}s`
  return `${remainingSeconds}s`
}

// ── Quiz Attempt Card Component ────────────────────────────
const QuizAttemptCard = ({ attempt, expanded, onToggle }) => {
  const score = attempt.score || 0
  const scoreColor = score >= 70 ? 'var(--success)' : score >= 50 ? 'var(--warning)' : 'var(--danger)'

  return (
    <motion.div
      layout
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        overflow: 'hidden',
        marginBottom: 12
      }}
    >
      {/* Header - Always visible */}
      <div
        onClick={onToggle}
        style={{
          padding: '16px 20px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <ScoreCircle score={score} size={64} />
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
              {attempt.topic || attempt.quizId?.slice(0, 8) || 'Quiz'}
            </h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Badge icon={CheckCircle} variant="success">
                {attempt.correctAnswers}/{attempt.totalQuestions} Correct
              </Badge>
              <Badge icon={Clock} variant="secondary">
                {formatTime(attempt.totalTimeSpentMs)}
              </Badge>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>
            {attempt.completedAt ? new Date(attempt.completedAt).toLocaleDateString() : 'In Progress'}
          </div>
          <ArrowRight
            size={18}
            color="var(--text-muted)"
            style={{
              transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s'
            }}
          />
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          style={{ borderTop: '1px solid var(--border)' }}
        >
          {/* Learning Insights */}
          {attempt.learningGapSummary && (
            <div style={{ padding: '16px 20px', background: 'var(--color-primary-dim)' }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--primary)' }}>
                <Brain size={16} /> Learning Insights
              </h4>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>
                {attempt.learningGapSummary}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {attempt.strongAreas?.length > 0 && (
                  <div style={{ background: 'var(--bg-card)', borderRadius: 10, padding: 12 }}>
                    <h5 style={{ fontSize: 12, fontWeight: 600, color: 'var(--success)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <TrendingUp size={14} /> Strong Areas
                    </h5>
                    <ul style={{ margin: 0, paddingLeft: 16, fontSize: 13, color: 'var(--text-secondary)' }}>
                      {attempt.strongAreas.map((area, i) => <li key={i}>{area}</li>)}
                    </ul>
                  </div>
                )}
                {attempt.weakAreas?.length > 0 && (
                  <div style={{ background: 'var(--bg-card)', borderRadius: 10, padding: 12 }}>
                    <h5 style={{ fontSize: 12, fontWeight: 600, color: 'var(--warning)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <TrendingDown size={14} /> Needs Practice
                    </h5>
                    <ul style={{ margin: 0, paddingLeft: 16, fontSize: 13, color: 'var(--text-secondary)' }}>
                      {attempt.weakAreas.map((area, i) => <li key={i}>{area}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Question Details */}
          {attempt.questionResponses?.length > 0 && (
            <div style={{ padding: '16px 20px' }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <BookOpen size={16} /> Question Breakdown
              </h4>
              <div style={{ display: 'grid', gap: 8 }}>
                {attempt.questionResponses.map((qr, idx) => (
                  <div
                    key={qr.id || idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 12,
                      padding: 12,
                      background: qr.isCorrect ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)',
                      borderRadius: 10,
                      border: `1px solid ${qr.isCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                    }}
                  >
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: qr.isCorrect ? 'var(--success)' : 'var(--danger)',
                      color: 'white', flexShrink: 0
                    }}>
                      {qr.isCorrect ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                        Q{idx + 1}: {qr.questionText || 'Question'}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                        <span>Answer: <strong style={{ color: qr.isCorrect ? 'var(--success)' : 'var(--danger)' }}>{qr.studentAnswer || 'No answer'}</strong></span>
                        {!qr.isCorrect && qr.correctAnswer && (
                          <span>Correct: <strong style={{ color: 'var(--success)' }}>{qr.correctAnswer}</strong></span>
                        )}
                        <span>Time: {formatTime(qr.responseTimeMs)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}

export default function QuizProgressPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [attempts, setAttempts] = useState([])
  const [loading, setLoading] = useState(true)
  const [noStudentId, setNoStudentId] = useState(false)
  const [expandedId, setExpandedId] = useState(null)

  // Track the selected student ID so useEffect re-runs when parent switches students
  const selectedStudentId = localStorage.getItem('ns_studentId') || user?.studentId || null

  const resolveStudentId = async () => {
    // Check localStorage FIRST — parent dashboard writes selected student here
    const fromLocal = localStorage.getItem('ns_studentId')
    const fromSession = sessionStorage.getItem('ns_studentId')
    const fromUser = user?.studentId
    const existing = fromLocal || fromSession || fromUser

    if (existing) return String(existing)

    try {
      const res = await parentStudentAPI.getPrimaryStudent()
      const payload = res?.data?.data
      const primaryStudent = payload?.student || payload
      const sid = primaryStudent?.studentId || primaryStudent?.id

      if (sid) {
        localStorage.setItem('ns_studentId', String(sid))
        return String(sid)
      }
    } catch (err) {
    }

    return null
  }

  const load = async () => {
    setLoading(true)
    setNoStudentId(false)

    const sid = await resolveStudentId()

    if (!sid) {
      setNoStudentId(true)
      setLoading(false)
      return
    }

    // Use the new endpoint that fetches quiz attempts (with per-question data)
    quizAPI.getStudentQuizAttempts(sid)
      .then(r => {
        const data = r.data.data || []
        // Sort by date, most recent first
        data.sort((a, b) => new Date(b.completedAt || b.startedAt) - new Date(a.completedAt || a.startedAt))
        setAttempts(data)
      })
      .catch(err => {
        const errorMsg = err.response?.data?.message || err.message || 'Could not load quiz progress'

        if (errorMsg.includes('Student ID not set') || errorMsg.includes('STUDENT_ID_NOT_SET')) {
          setNoStudentId(true)
        }

        toast.error(errorMsg.replace('STUDENT_ID_NOT_SET|', ''))
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [selectedStudentId])

  // Calculate summary stats
  const completedAttempts = attempts.filter(a => a.isCompleted)
  const averageScore = completedAttempts.length > 0
    ? completedAttempts.reduce((sum, a) => sum + (a.score || 0), 0) / completedAttempts.length
    : 0
  const totalCorrect = completedAttempts.reduce((sum, a) => sum + (a.correctAnswers || 0), 0)
  const totalQuestions = completedAttempts.reduce((sum, a) => sum + (a.totalQuestions || 0), 0)

  // Determine trend
  const getTrend = () => {
    if (completedAttempts.length < 2) return null
    const recent = completedAttempts.slice(0, 3)
    const older = completedAttempts.slice(3, 6)
    if (older.length === 0) return null
    const recentAvg = recent.reduce((s, a) => s + a.score, 0) / recent.length
    const olderAvg = older.reduce((s, a) => s + a.score, 0) / older.length
    if (recentAvg > olderAvg + 5) return 'improving'
    if (recentAvg < olderAvg - 5) return 'declining'
    return 'stable'
  }
  const trend = getTrend()

  return (
    <div>
      <PageHeader
        title="Quiz Progress"
        subtitle="Track your child's quiz performance and learning progress"
      />

      {loading ? (
        <div style={{ display: 'grid', gap: 12 }}>
          {[1, 2, 3].map(i => <SkeletonCard key={i} rows={3} />)}
        </div>
      ) : noStudentId ? (
        <div style={{ border: '1px solid var(--warning)', backgroundColor: 'rgba(251, 191, 36, 0.1)', borderRadius: 14, padding: '32px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📝</div>
          <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8, color: 'var(--warning)' }}>Student ID Required</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
            To view your child's quiz progress, please add your child's Student ID in your profile settings. Ask the teacher for your child's unique student ID.
          </p>
          <button
            onClick={() => navigate('/parent/settings')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 20px',
              background: 'var(--warning)', color: 'white', border: 'none', borderRadius: 10,
              fontWeight: 600, cursor: 'pointer', fontSize: 14,
            }}
          >
            Go to Settings <ArrowRight size={16} />
          </button>
        </div>
      ) : attempts.length === 0 ? (
        <EmptyState
          icon={BarChart}
          title="No quiz attempts yet"
          description="Once your child completes quizzes assigned by the teacher, their progress will appear here."
        />
      ) : (
        <>
          {/* Summary Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 12,
            marginBottom: 24
          }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--primary)' }}>{completedAttempts.length}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Quizzes Taken</div>
            </div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
              <div style={{
                fontSize: 28, fontWeight: 800,
                color: averageScore >= 70 ? 'var(--success)' : averageScore >= 50 ? 'var(--warning)' : 'var(--danger)'
              }}>
                {averageScore.toFixed(0)}%
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Average Score</div>
            </div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--success)' }}>{totalCorrect}/{totalQuestions}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Total Correct</div>
            </div>
            {trend && (
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                <div style={{
                  fontSize: 28, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  color: trend === 'improving' ? 'var(--success)' : trend === 'declining' ? 'var(--danger)' : 'var(--text-muted)'
                }}>
                  {trend === 'improving' ? <TrendingUp size={24} /> : trend === 'declining' ? <TrendingDown size={24} /> : <Target size={24} />}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                  {trend === 'improving' ? 'Improving' : trend === 'declining' ? 'Needs Focus' : 'Stable'}
                </div>
              </div>
            )}
          </div>

          {/* Quiz Attempts List */}
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Calendar size={18} /> Recent Quizzes
          </h3>
          {attempts.map(attempt => (
            <QuizAttemptCard
              key={attempt.id}
              attempt={attempt}
              expanded={expandedId === attempt.id}
              onToggle={() => setExpandedId(expandedId === attempt.id ? null : attempt.id)}
            />
          ))}
        </>
      )}
    </div>
  )
}
