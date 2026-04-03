import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrendingDown, TrendingUp, AlertTriangle, CheckCircle2, FileText, Brain, Calendar } from 'lucide-react'
import { optimizedAnalysisAPI } from '../../services/optimizedApi'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

// ════════════════════════════════════════════════════════════════
// DESIGN SYSTEM - Matching reference exactly
// ════════════════════════════════════════════════════════════════
const COLORS = {
  sidebar: '#312E81',
  primary: '#14B8A6',
  primaryHover: '#0D9488',

  bgBase: '#F8FAFC',
  bgCard: '#FFFFFF',
  bgMuted: '#F1F5F9',

  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#64748B',

  border: '#E2E8F0',

  riskHigh: '#ef4444',
  riskHighBg: 'rgba(239, 68, 68, 0.1)',
  riskMedium: '#f59e0b',
  riskMediumBg: 'rgba(245, 158, 11, 0.1)',
  riskLow: '#22c55e',
  riskLowBg: 'rgba(34, 197, 94, 0.1)',
}

function RiskBadge({ risk }) {
  const styles = {
    LOW: { bg: COLORS.riskLowBg, color: COLORS.riskLow, border: 'rgba(34, 197, 94, 0.2)' },
    MEDIUM: { bg: COLORS.riskMediumBg, color: COLORS.riskMedium, border: 'rgba(245, 158, 11, 0.2)' },
    HIGH: { bg: COLORS.riskHighBg, color: COLORS.riskHigh, border: 'rgba(239, 68, 68, 0.2)' },
  }
  const labels = { LOW: 'Low Risk', MEDIUM: 'Medium Risk', HIGH: 'High Risk' }
  const s = styles[risk] || styles.LOW

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: 9999,
        fontSize: 12,
        fontWeight: 500,
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
      }}
    >
      {labels[risk] || risk}
    </span>
  )
}

function ProgressBar({ value, className }) {
  const percentage = Math.min(Math.max(value || 0, 0), 100)
  return (
    <div
      style={{
        height: 12,
        background: COLORS.bgMuted,
        borderRadius: 9999,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${percentage}%`,
          background: COLORS.primary,
          borderRadius: 9999,
          transition: 'width 0.5s ease',
        }}
      />
    </div>
  )
}

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function formatShort(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function scoreLabel(v) {
  if (v < 30) return 'Within normal range'
  if (v < 60) return 'Mild indicators present'
  return 'Significant indicators'
}

export default function ParentDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [report, setReport] = useState(null)
  const [previousReports, setPreviousReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [noData, setNoData] = useState(false)
  const [noStudentId, setNoStudentId] = useState(false)

  useEffect(() => {
    const sid = user?.studentId || localStorage.getItem('ns_studentId')
    if (!sid) {
      setNoStudentId(true)
      setNoData(true)
      setLoading(false)
      return
    }
    setNoStudentId(false)

    optimizedAnalysisAPI.getStudentReport(sid)
      .then(res => {
        const data = res.data.data
        if (Array.isArray(data) && data.length > 0) {
          // Sort by date descending
          const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          setReport(sorted[0])
          setPreviousReports(sorted.slice(1, 4))
        } else if (data && !Array.isArray(data)) {
          setReport(data)
        } else {
          setNoData(true)
        }
      })
      .catch(err => {
        const errorMsg = err.response?.data?.message || err.message || 'Failed to load report'
        if (errorMsg.includes('Student ID not set')) {
          setNoStudentId(true)
          setNoData(true)
        } else if (err.response?.status === 404 || err.response?.status === 403) {
          setNoData(true)
        } else if (err.response?.status === 401) {
          toast.error('Session expired. Please log in again.')
        } else {
          toast.error(errorMsg)
        }
      })
      .finally(() => setLoading(false))
  }, [user?.userId, user?.studentId])

  // Derive child info from report or user
  const child = report ? {
    name: report.studentName || 'Your Child',
    rollNumber: report.rollNumber || user?.studentId || 'N/A',
    className: report.className || 'N/A',
    teacherName: report.teacherName || 'Teacher',
    school: report.schoolName || 'School',
  } : null

  // Check if improving (mock - compare latest vs previous if available)
  const isImproving = previousReports.length > 0 && report &&
    (report.dyslexiaScore < previousReports[0]?.dyslexiaScore)

  if (loading) {
    return (
      <div style={{ padding: '16px 24px' }}>
        <div style={{ marginBottom: 32 }}>
          <div
            style={{
              height: 32,
              width: 240,
              background: COLORS.bgMuted,
              borderRadius: 8,
              marginBottom: 8,
            }}
          />
          <div style={{ height: 18, width: 200, background: COLORS.bgMuted, borderRadius: 6 }} />
        </div>
        <div
          style={{
            background: COLORS.bgCard,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 12,
            padding: 20,
            animation: 'pulse 1.5s infinite',
          }}
        >
          <div style={{ height: 64, background: COLORS.bgMuted, borderRadius: 8 }} />
        </div>
        <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
      </div>
    )
  }

  if (noData || !report) {
    return (
      <div style={{ padding: '16px 24px' }}>
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 28,
              fontWeight: 700,
              color: COLORS.textPrimary,
              marginBottom: 4,
            }}
          >
            Welcome
          </h1>
          <p style={{ color: COLORS.textMuted, fontSize: 14 }}>
            {noStudentId ? 'Set up your child\'s account to get started' : 'No assessments available yet'}
          </p>
        </div>

        <div
          style={{
            background: COLORS.bgCard,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 12,
            padding: 40,
            textAlign: 'center',
            maxWidth: 480,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: `rgba(20, 184, 166, 0.1)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <Brain size={28} color={COLORS.primary} />
          </div>
          <h2
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 20,
              fontWeight: 700,
              color: COLORS.textPrimary,
              marginBottom: 8,
            }}
          >
            {noStudentId ? "Set Up Your Child's Account" : 'No Assessments Yet'}
          </h2>
          <p
            style={{
              fontSize: 14,
              color: COLORS.textMuted,
              lineHeight: 1.6,
              marginBottom: 24,
            }}
          >
            {noStudentId
              ? "To view your child's progress, link their student ID in settings."
              : "Once your child's teacher uploads an assessment, results will appear here."}
          </p>
          <button
            onClick={() => navigate(noStudentId ? '/settings?tab=profile' : '/parent/progress')}
            style={{
              padding: '12px 24px',
              background: COLORS.primary,
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {noStudentId ? 'Go to Settings' : 'View Progress'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '16px 24px', maxWidth: 900 }}>
      {/* Page Header */}
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 28,
            fontWeight: 700,
            color: COLORS.textPrimary,
            marginBottom: 4,
          }}
        >
          {child.name}'s Overview
        </h1>
        <p style={{ color: COLORS.textMuted, fontSize: 14 }}>
          {child.className} · {child.school}
        </p>
      </div>

      {/* Child Info Card */}
      <div
        style={{
          background: COLORS.bgCard,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 12,
          padding: 20,
          marginBottom: 32,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: `rgba(20, 184, 166, 0.1)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 24,
              color: COLORS.primary,
              flexShrink: 0,
            }}
          >
            {child.name.charAt(0)}
          </div>

          {/* Info Grid */}
          <div style={{ display: 'flex', gap: 32, flex: 1, flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 2 }}>Roll Number</p>
              <p style={{ fontSize: 14, fontWeight: 500, fontFamily: 'monospace', color: COLORS.textPrimary }}>
                {child.rollNumber}
              </p>
            </div>
            <div>
              <p style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 2 }}>Class</p>
              <p style={{ fontSize: 14, fontWeight: 500, color: COLORS.textPrimary }}>{child.className}</p>
            </div>
            <div>
              <p style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 2 }}>Teacher</p>
              <p style={{ fontSize: 14, fontWeight: 500, color: COLORS.textPrimary }}>{child.teacherName}</p>
            </div>
          </div>

          {/* Trend Indicator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: isImproving ? COLORS.riskLow : COLORS.textMuted,
            }}
          >
            {isImproving ? <TrendingDown size={20} /> : <TrendingUp size={20} />}
            <span style={{ fontSize: 14, fontWeight: 500 }}>{isImproving ? 'Improving' : 'Stable'}</span>
          </div>
        </div>
      </div>

      {/* Latest Analysis Section */}
      <div style={{ marginBottom: 32 }}>
        <h2
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 20,
            fontWeight: 700,
            color: COLORS.textPrimary,
            marginBottom: 16,
          }}
        >
          Latest Analysis
        </h2>

        <div
          style={{
            background: COLORS.bgCard,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          {/* Card Header */}
          <div style={{ padding: '20px 24px', borderBottom: `1px solid ${COLORS.border}` }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12,
              }}
            >
              <div>
                <h3
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 18,
                    fontWeight: 600,
                    color: COLORS.textPrimary,
                    marginBottom: 4,
                  }}
                >
                  Handwriting Analysis Report
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: COLORS.textMuted,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Calendar size={14} />
                  {formatDate(report.createdAt)}
                </p>
              </div>
              <RiskBadge risk={report.riskLevel} />
            </div>
          </div>

          {/* Card Content */}
          <div style={{ padding: 24 }}>
            {/* Scores */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 24,
                marginBottom: 24,
              }}
            >
              {/* Dyslexia Score */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 8,
                  }}
                >
                  <p style={{ fontSize: 14, fontWeight: 500, color: COLORS.textMuted }}>Dyslexia Score</p>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 16 }}>
                    {(report.dyslexiaScore || 0).toFixed(0)}%
                  </span>
                </div>
                <ProgressBar value={report.dyslexiaScore} />
                <p style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 6 }}>
                  {scoreLabel(report.dyslexiaScore)}
                </p>
              </div>

              {/* Dysgraphia Score */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 8,
                  }}
                >
                  <p style={{ fontSize: 14, fontWeight: 500, color: COLORS.textMuted }}>Dysgraphia Score</p>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 16 }}>
                    {(report.dysgraphiaScore || 0).toFixed(0)}%
                  </span>
                </div>
                <ProgressBar value={report.dysgraphiaScore} />
                <p style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 6 }}>
                  {scoreLabel(report.dysgraphiaScore)}
                </p>
              </div>
            </div>

            {/* AI Analysis */}
            <div
              style={{
                background: `rgba(20, 184, 166, 0.05)`,
                border: `1px solid rgba(20, 184, 166, 0.15)`,
                borderRadius: 12,
                padding: 16,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <Brain size={16} color={COLORS.primary} />
                <p style={{ fontSize: 14, fontWeight: 600, color: COLORS.primary }}>AI Analysis</p>
              </div>
              <p style={{ fontSize: 14, color: COLORS.textPrimary, lineHeight: 1.6 }}>
                {report.aiComment || 'No AI commentary available for this assessment.'}
              </p>
            </div>

            {/* Recommendation Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 12,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  background: COLORS.bgMuted,
                  borderRadius: 8,
                  padding: 12,
                }}
              >
                <AlertTriangle size={16} color={COLORS.riskMedium} style={{ marginTop: 2, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: COLORS.textPrimary, marginBottom: 2 }}>
                    Watch for
                  </p>
                  <p style={{ fontSize: 12, color: COLORS.textMuted }}>
                    Difficulty reading aloud or confusing similar letters
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  background: COLORS.bgMuted,
                  borderRadius: 8,
                  padding: 12,
                }}
              >
                <CheckCircle2 size={16} color={COLORS.riskLow} style={{ marginTop: 2, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: COLORS.textPrimary, marginBottom: 2 }}>
                    What to do
                  </p>
                  <p style={{ fontSize: 12, color: COLORS.textMuted }}>
                    Practice phonics with games and read together daily
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  background: COLORS.bgMuted,
                  borderRadius: 8,
                  padding: 12,
                }}
              >
                <FileText size={16} color={COLORS.primary} style={{ marginTop: 2, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: COLORS.textPrimary, marginBottom: 2 }}>
                    Next step
                  </p>
                  <p style={{ fontSize: 12, color: COLORS.textMuted }}>
                    Follow-up assessment recommended in 4-6 weeks
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Previous Reports Section */}
      {previousReports.length > 0 && (
        <div>
          <h2
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 20,
              fontWeight: 700,
              color: COLORS.textPrimary,
              marginBottom: 16,
            }}
          >
            Previous Reports
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {previousReports.map((r, i) => (
              <div
                key={r.reportId || i}
                style={{
                  background: COLORS.bgCard,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 12,
                  padding: 16,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    flexWrap: 'wrap',
                  }}
                >
                  {/* File Icon */}
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: COLORS.bgMuted,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <FileText size={16} color={COLORS.textMuted} />
                  </div>

                  {/* Date & Label */}
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 500, color: COLORS.textPrimary }}>
                      {formatShort(r.createdAt)}
                    </p>
                    <p style={{ fontSize: 12, color: COLORS.textMuted }}>Analysis Report</p>
                  </div>

                  {/* Scores */}
                  <div style={{ display: 'flex', gap: 24 }}>
                    <div>
                      <p style={{ fontSize: 12, color: COLORS.textMuted }}>Dyslexia</p>
                      <p style={{ fontSize: 14, fontWeight: 500, fontFamily: 'monospace' }}>
                        {(r.dyslexiaScore || 0).toFixed(0)}%
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: 12, color: COLORS.textMuted }}>Dysgraphia</p>
                      <p style={{ fontSize: 14, fontWeight: 500, fontFamily: 'monospace' }}>
                        {(r.dysgraphiaScore || 0).toFixed(0)}%
                      </p>
                    </div>
                  </div>

                  {/* Risk Badge */}
                  <RiskBadge risk={r.riskLevel} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
