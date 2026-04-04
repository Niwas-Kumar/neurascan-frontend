import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Users, FileText, AlertTriangle, TrendingUp, Upload,
  Brain, Clock, ChevronRight, BarChart3, PieChart as PieChartIcon
} from 'lucide-react'
import { optimizedAnalysisAPI } from '../../services/optimizedApi'
import { useAuth } from '../../context/AuthContext'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip as ReTooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import { format, formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'

// ════════════════════════════════════════════════════════════════
// DESIGN SYSTEM - Matching reference exactly
// ════════════════════════════════════════════════════════════════
const COLORS = {
  sidebar: '#312E81',
  primary: '#14B8A6',
  primaryHover: '#0D9488',
  primaryBg: 'rgba(20, 184, 166, 0.1)',

  bgBase: '#F8FAFC',
  bgCard: '#FFFFFF',
  bgMuted: '#F1F5F9',

  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#64748B',
  textLight: '#94A3B8',

  border: '#E2E8F0',

  // Chart colors
  chartDyslexia: '#14B8A6',
  chartDysgraphia: '#6366F1',

  // Risk colors
  riskHigh: '#ef4444',
  riskHighBg: 'rgba(239, 68, 68, 0.1)',
  riskMedium: '#f59e0b',
  riskMediumBg: 'rgba(245, 158, 11, 0.1)',
  riskLow: '#22c55e',
  riskLowBg: 'rgba(34, 197, 94, 0.1)',
}

// ════════════════════════════════════════════════════════════════
// RISK BADGE COMPONENT
// ════════════════════════════════════════════════════════════════
function RiskBadge({ level }) {
  const styles = {
    LOW: { bg: COLORS.riskLowBg, color: COLORS.riskLow, border: 'rgba(34, 197, 94, 0.2)' },
    MEDIUM: { bg: COLORS.riskMediumBg, color: COLORS.riskMedium, border: 'rgba(245, 158, 11, 0.2)' },
    HIGH: { bg: COLORS.riskHighBg, color: COLORS.riskHigh, border: 'rgba(239, 68, 68, 0.2)' },
  }
  const labels = { LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High' }
  const s = styles[level] || styles.LOW

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
      {labels[level] || level}
    </span>
  )
}

// ════════════════════════════════════════════════════════════════
// CUSTOM TOOLTIP
// ════════════════════════════════════════════════════════════════
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div
      style={{
        background: COLORS.bgCard,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 8,
        padding: '12px 16px',
        fontSize: 13,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      }}
    >
      {label && <p style={{ color: COLORS.textMuted, marginBottom: 8, fontWeight: 500 }}>{label}</p>}
      {payload.map((p) => (
        <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <div style={{ width: 10, height: 10, borderRadius: 3, background: p.color }} />
          <span style={{ color: COLORS.textSecondary }}>{p.name}:</span>
          <span style={{ fontWeight: 600, color: COLORS.textPrimary }}>{p.value?.toFixed(1)}%</span>
        </div>
      ))}
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// STAT CARD COMPONENT
// ════════════════════════════════════════════════════════════════
function StatCard({ icon: Icon, label, value, color = 'primary', subtitle }) {
  const colorMap = {
    primary: { icon: COLORS.primary, bg: COLORS.primaryBg },
    danger: { icon: COLORS.riskHigh, bg: COLORS.riskHighBg },
    warning: { icon: COLORS.riskMedium, bg: COLORS.riskMediumBg },
    success: { icon: COLORS.riskLow, bg: COLORS.riskLowBg },
  }
  const c = colorMap[color] || colorMap.primary

  return (
    <div
      style={{
        background: COLORS.bgCard,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 12,
        padding: 20,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          background: c.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}
      >
        <Icon size={22} color={c.icon} />
      </div>
      <p
        style={{
          fontSize: 12,
          color: COLORS.textMuted,
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: 6,
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: COLORS.textPrimary,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          lineHeight: 1,
        }}
      >
        {value}
      </p>
      {subtitle && (
        <p style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 6 }}>{subtitle}</p>
      )}
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// CARD COMPONENT
// ════════════════════════════════════════════════════════════════
function Card({ children, style = {} }) {
  return (
    <div
      style={{
        background: COLORS.bgCard,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 12,
        overflow: 'hidden',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

function CardHeader({ title, description, icon: Icon, iconBg }) {
  return (
    <div style={{ padding: '20px 24px', borderBottom: `1px solid ${COLORS.border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {Icon && (
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: iconBg || COLORS.primaryBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size={18} color={COLORS.primary} />
          </div>
        )}
        <div>
          <h3
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 16,
              fontWeight: 600,
              color: COLORS.textPrimary,
              marginBottom: description ? 2 : 0,
            }}
          >
            {title}
          </h3>
          {description && <p style={{ fontSize: 13, color: COLORS.textMuted }}>{description}</p>}
        </div>
      </div>
    </div>
  )
}

function CardContent({ children, style = {} }) {
  return <div style={{ padding: 24, ...style }}>{children}</div>
}

// ════════════════════════════════════════════════════════════════
// MAIN DASHBOARD COMPONENT
// ════════════════════════════════════════════════════════════════
export default function TeacherDashboard() {
  const { user, addNotification } = useAuth()
  const navigate = useNavigate()
  const [dash, setDash] = useState(null)
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.userId) return

    let isCancelled = false
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

    const loadDashboard = async () => {
      setLoading(true)

      for (let attempt = 0; attempt < 2; attempt++) {
        const [d, r] = await Promise.allSettled([
          optimizedAnalysisAPI.getDashboard(),
          optimizedAnalysisAPI.getReports(),
        ])

        if (isCancelled) return

        const dashData = d.status === 'fulfilled' ? d.value.data.data : null
        const reportsData = r.status === 'fulfilled' ? (r.value.data.data || []) : []
        const hasFailure = d.status !== 'fulfilled' || r.status !== 'fulfilled'
        const looksTransientlyEmpty = !dashData && reportsData.length === 0

        setDash(dashData)
        setReports(reportsData)

        if (!hasFailure && !looksTransientlyEmpty) {
          if ((dashData?.studentsAtRisk || 0) > 0) {
            addNotification({
              type: 'warning',
              title: 'Attention Required',
              body: `${dashData.studentsAtRisk} student(s) flagged for follow-up assessment.`,
            })
          }

          setLoading(false)
          return
        }

        if (attempt < 1) {
          await wait(1200)
          if (isCancelled) return
          continue
        }

        if (hasFailure) {
          toast.error('Dashboard data is delayed. Showing available data.')
        }

        if ((dashData?.studentsAtRisk || 0) > 0) {
          addNotification({
            type: 'warning',
            title: 'Attention Required',
            body: `${dashData.studentsAtRisk} student(s) flagged for follow-up assessment.`,
          })
        }

        setLoading(false)
        return
      }
    }

    loadDashboard()
      .catch(() => {
        if (!isCancelled) {
          toast.error('Unable to load dashboard')
          setLoading(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [user?.userId])

  const greeting = (() => {
    const h = new Date().getHours()
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
  })()

  // Chart data — last 8 reports reversed for chronological order
  const chartData = [...reports]
    .reverse()
    .slice(-8)
    .map((r) => ({
      date: format(new Date(r.uploadDate || r.createdAt), 'MMM d'),
      Dyslexia: +(r.dyslexiaScore || 0).toFixed(1),
      Dysgraphia: +(r.dysgraphiaScore || 0).toFixed(1),
    }))

  // Pie: risk distribution
  const riskCounts = reports.reduce((acc, r) => {
    acc[r.riskLevel] = (acc[r.riskLevel] || 0) + 1
    return acc
  }, {})
  const totalReports = reports.length

  const pieData = [
    {
      name: 'Low Risk',
      value: riskCounts.LOW || 0,
      color: COLORS.riskLow,
      percentage: totalReports ? (((riskCounts.LOW || 0) / totalReports) * 100).toFixed(1) : 0,
    },
    {
      name: 'Medium Risk',
      value: riskCounts.MEDIUM || 0,
      color: COLORS.riskMedium,
      percentage: totalReports ? (((riskCounts.MEDIUM || 0) / totalReports) * 100).toFixed(1) : 0,
    },
    {
      name: 'High Risk',
      value: riskCounts.HIGH || 0,
      color: COLORS.riskHigh,
      percentage: totalReports ? (((riskCounts.HIGH || 0) / totalReports) * 100).toFixed(1) : 0,
    },
  ].filter((d) => d.value > 0)

  // Loading State
  if (loading || !user?.userId) {
    return (
      <div style={{ padding: '16px 24px' }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ height: 32, width: 280, background: COLORS.bgMuted, borderRadius: 8, marginBottom: 8 }} />
          <div style={{ height: 18, width: 200, background: COLORS.bgMuted, borderRadius: 6 }} />
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
            marginBottom: 24,
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                background: COLORS.bgCard,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 12,
                padding: 20,
                height: 140,
              }}
            />
          ))}
        </div>
        <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ padding: '16px 24px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 32,
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 28,
              fontWeight: 700,
              color: COLORS.textPrimary,
              marginBottom: 4,
            }}
          >
            {greeting}, <span style={{ color: COLORS.primary }}>{user?.name?.split(' ')[0] || 'Teacher'}</span>
          </h1>
          <p style={{ color: COLORS.textMuted, fontSize: 14 }}>
            Classroom overview for {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>

        <Link to="/teacher/upload" style={{ textDecoration: 'none' }}>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 20px',
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
            <Upload size={18} />
            Upload Sample
          </button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
          marginBottom: 32,
        }}
      >
        <StatCard
          icon={Users}
          label="Total Students"
          value={dash?.totalStudents ?? 0}
          color="primary"
          subtitle="Active in classroom"
        />
        <StatCard
          icon={FileText}
          label="Samples Analyzed"
          value={dash?.totalPapersUploaded ?? 0}
          color="primary"
          subtitle="Handwriting assessments"
        />
        <StatCard
          icon={AlertTriangle}
          label="Requires Attention"
          value={dash?.studentsAtRisk ?? 0}
          color="danger"
          subtitle="Flagged for follow-up"
        />
        <StatCard
          icon={Brain}
          label="Avg. Dyslexia Score"
          value={`${(dash?.averageDyslexiaScore || 0).toFixed(1)}%`}
          color="primary"
          subtitle="Classroom average"
        />
      </div>

      {/* Charts Section */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: 24,
          marginBottom: 32,
        }}
      >
        {/* Trend Chart */}
        <Card>
          <CardHeader title="Analysis Trend" description="Recent assessment scores" icon={TrendingUp} />
          <CardContent>
            {chartData.length === 0 ? (
              <div
                style={{
                  height: 256,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: COLORS.textMuted,
                  background: COLORS.bgMuted,
                  borderRadius: 8,
                }}
              >
                <BarChart3 size={40} style={{ marginBottom: 12, opacity: 0.5 }} />
                <p style={{ fontSize: 14, fontWeight: 500 }}>No data yet</p>
                <p style={{ fontSize: 13 }}>Upload samples to see trends</p>
              </div>
            ) : (
              <>
                <div style={{ height: 256 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="dyslexiaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={COLORS.chartDyslexia} stopOpacity={0.25} />
                          <stop offset="100%" stopColor={COLORS.chartDyslexia} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="dysgraphiaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={COLORS.chartDysgraphia} stopOpacity={0.25} />
                          <stop offset="100%" stopColor={COLORS.chartDysgraphia} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} vertical={false} />
                      <XAxis
                        dataKey="date"
                        stroke={COLORS.border}
                        tick={{ fontSize: 12, fill: COLORS.textMuted }}
                        tickLine={false}
                      />
                      <YAxis
                        stroke={COLORS.border}
                        tick={{ fontSize: 12, fill: COLORS.textMuted }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => `${v}%`}
                      />
                      <ReTooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        name="Dyslexia"
                        dataKey="Dyslexia"
                        stroke={COLORS.chartDyslexia}
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#dyslexiaGrad)"
                        dot={{ fill: COLORS.chartDyslexia, strokeWidth: 0, r: 4 }}
                        activeDot={{ r: 6, stroke: COLORS.bgCard, strokeWidth: 2 }}
                      />
                      <Area
                        type="monotone"
                        name="Dysgraphia"
                        dataKey="Dysgraphia"
                        stroke={COLORS.chartDysgraphia}
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#dysgraphiaGrad)"
                        dot={{ fill: COLORS.chartDysgraphia, strokeWidth: 0, r: 4 }}
                        activeDot={{ r: 6, stroke: COLORS.bgCard, strokeWidth: 2 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: COLORS.chartDyslexia }} />
                    <span style={{ fontSize: 13, color: COLORS.textMuted, fontWeight: 500 }}>Dyslexia</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: COLORS.chartDysgraphia }} />
                    <span style={{ fontSize: 13, color: COLORS.textMuted, fontWeight: 500 }}>Dysgraphia</span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Risk Distribution */}
        <Card>
          <CardHeader
            title="Risk Distribution"
            description="Classroom breakdown"
            icon={PieChartIcon}
            iconBg={COLORS.riskLowBg}
          />
          <CardContent>
            {pieData.length === 0 ? (
              <div
                style={{
                  height: 256,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: COLORS.textMuted,
                  background: COLORS.bgMuted,
                  borderRadius: 8,
                }}
              >
                <PieChartIcon size={40} style={{ marginBottom: 12, opacity: 0.5 }} />
                <p style={{ fontSize: 14, fontWeight: 500 }}>No assessments</p>
                <p style={{ fontSize: 13 }}>Data will appear here</p>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
                <div style={{ width: '45%', height: 220 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Custom Legend */}
                <div style={{ flex: 1 }}>
                  {pieData.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 0',
                        borderBottom: i < pieData.length - 1 ? `1px solid ${COLORS.border}` : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 12, height: 12, borderRadius: 3, background: item.color }} />
                        <span style={{ fontSize: 14, color: COLORS.textSecondary, fontWeight: 500 }}>{item.name}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span
                          style={{
                            fontSize: 16,
                            fontWeight: 700,
                            color: COLORS.textPrimary,
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                          }}
                        >
                          {item.value}
                        </span>
                        <span style={{ fontSize: 12, color: COLORS.textMuted, marginLeft: 6 }}>
                          ({item.percentage}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports Section */}
      {reports.length > 0 && (
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <h2
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 20,
                fontWeight: 700,
                color: COLORS.textPrimary,
              }}
            >
              Recent Assessments
            </h2>
            <button
              onClick={() => navigate('/teacher/reports')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                border: `1px solid ${COLORS.border}`,
                borderRadius: 8,
                background: COLORS.bgCard,
                color: COLORS.textPrimary,
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              View All
              <ChevronRight size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {reports.slice(0, 5).map((r) => (
              <div
                key={r.reportId}
                onClick={() => navigate(`/teacher/reports?id=${r.reportId}`)}
                style={{
                  background: COLORS.bgCard,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 12,
                  padding: 16,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = COLORS.primary
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = COLORS.border
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: COLORS.primaryBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 600,
                      fontSize: 16,
                      color: COLORS.primary,
                    }}
                  >
                    {r.studentName?.charAt(0) || '?'}
                  </div>
                  <div>
                    <p style={{ fontWeight: 500, fontSize: 14, color: COLORS.textPrimary }}>{r.studentName}</p>
                    <p
                      style={{
                        fontSize: 12,
                        color: COLORS.textMuted,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <Clock size={12} />
                      {formatDistanceToNow(new Date(r.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span
                      style={{
                        background: COLORS.primaryBg,
                        color: COLORS.primary,
                        padding: '4px 10px',
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        fontFamily: 'monospace',
                      }}
                    >
                      D: {(r.dyslexiaScore || 0).toFixed(1)}%
                    </span>
                    <span
                      style={{
                        background: 'rgba(99, 102, 241, 0.1)',
                        color: COLORS.chartDysgraphia,
                        padding: '4px 10px',
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        fontFamily: 'monospace',
                      }}
                    >
                      G: {(r.dysgraphiaScore || 0).toFixed(1)}%
                    </span>
                  </div>
                  <RiskBadge level={r.riskLevel} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
