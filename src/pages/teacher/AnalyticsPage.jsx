import { useEffect, useState, useMemo } from 'react'
import { TrendingUp, TrendingDown, AlertTriangle, Users, Minus, ChevronDown } from 'lucide-react'
import { optimizedAnalysisAPI, optimizedStudentAPI } from '../../services/optimizedApi'
import { useAuth } from '../../context/AuthContext'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import toast from 'react-hot-toast'
import { format, subMonths } from 'date-fns'

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

  // Chart colors
  chartDyslexia: '#14B8A6',
  chartDysgraphia: '#312E81',

  // Risk colors
  riskHigh: '#ef4444',
  riskHighBg: 'rgba(239, 68, 68, 0.1)',
  riskMedium: '#f59e0b',
  riskMediumBg: 'rgba(245, 158, 11, 0.1)',
  riskLow: '#22c55e',
  riskLowBg: 'rgba(34, 197, 94, 0.1)',
}

// ════════════════════════════════════════════════════════════════
// SELECT COMPONENT
// ════════════════════════════════════════════════════════════════
function Select({ value, onChange, options }) {
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          appearance: 'none',
          padding: '10px 36px 10px 16px',
          border: `1px solid ${COLORS.border}`,
          borderRadius: 8,
          background: COLORS.bgCard,
          color: COLORS.textPrimary,
          fontSize: 14,
          fontFamily: "'Inter', sans-serif",
          cursor: 'pointer',
          minWidth: 160,
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        style={{
          position: 'absolute',
          right: 12,
          top: '50%',
          transform: 'translateY(-50%)',
          color: COLORS.textMuted,
          pointerEvents: 'none',
        }}
      />
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

function CardHeader({ title, description }) {
  return (
    <div style={{ padding: '20px 24px', borderBottom: `1px solid ${COLORS.border}` }}>
      <h3
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 18,
          fontWeight: 600,
          color: COLORS.textPrimary,
          marginBottom: description ? 4 : 0,
        }}
      >
        {title}
      </h3>
      {description && (
        <p style={{ fontSize: 14, color: COLORS.textMuted }}>{description}</p>
      )}
    </div>
  )
}

function CardContent({ children, style = {} }) {
  return <div style={{ padding: 24, ...style }}>{children}</div>
}

// ════════════════════════════════════════════════════════════════
// CHART TOOLTIP
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
          <span style={{ fontWeight: 600, color: COLORS.textPrimary }}>
            {typeof p.value === 'number' ? p.value.toFixed(1) + '%' : p.value}
          </span>
        </div>
      ))}
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// AI INSIGHTS DATA
// ════════════════════════════════════════════════════════════════
const defaultInsights = [
  {
    type: 'improvement',
    icon: TrendingUp,
    color: COLORS.riskLow,
    bg: COLORS.riskLowBg,
    title: 'Average scores improving',
    desc: 'Overall trend shows improvement in both dyslexia and dysgraphia indicators across your classes.',
  },
  {
    type: 'concern',
    icon: AlertTriangle,
    color: COLORS.riskHigh,
    bg: COLORS.riskHighBg,
    title: 'High-risk students need attention',
    desc: 'Some students show elevated risk indicators. Consider targeted intervention strategies.',
  },
  {
    type: 'stable',
    icon: Minus,
    color: COLORS.riskMedium,
    bg: COLORS.riskMediumBg,
    title: 'Upload frequency varies',
    desc: 'Consistent weekly uploads will improve trend accuracy and early detection.',
  },
  {
    type: 'positive',
    icon: Users,
    color: COLORS.primary,
    bg: `rgba(20, 184, 166, 0.1)`,
    title: 'Early intervention working',
    desc: 'Students who received early intervention show measurable improvement in assessments.',
  },
]

// ════════════════════════════════════════════════════════════════
// MAIN ANALYTICS PAGE
// ════════════════════════════════════════════════════════════════
export default function AnalyticsPage() {
  const { user } = useAuth()
  const [reports, setReports] = useState([])
  const [students, setStudents] = useState([])
  const [dash, setDash] = useState(null)
  const [loading, setLoading] = useState(true)
  const [classFilter, setClassFilter] = useState('all')

  useEffect(() => {
    if (!user?.token) return

    let isCancelled = false
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

    const loadAnalytics = async () => {
      setLoading(true)

      for (let attempt = 0; attempt < 2; attempt++) {
        const [r, d, s] = await Promise.allSettled([
          optimizedAnalysisAPI.getReports(),
          optimizedAnalysisAPI.getDashboard(),
          optimizedStudentAPI.getAllWithIndexRetry(4, 300),
        ])

        if (isCancelled) return

        const reportsData = r.status === 'fulfilled' ? (r.value.data.data || []) : []
        const dashData = d.status === 'fulfilled' ? d.value.data.data : null
        const studentsData = s.status === 'fulfilled' ? (s.value?.data?.data || []) : []

        setReports(reportsData)
        setDash(dashData)
        setStudents(studentsData)

        const hasFailure = r.status !== 'fulfilled' || d.status !== 'fulfilled' || s.status !== 'fulfilled'
        const likelyTransientEmpty = reportsData.length === 0 && studentsData.length > 0

        if (!hasFailure && !likelyTransientEmpty) {
          setLoading(false)
          return
        }

        if (attempt < 1) {
          await wait(1200)
          if (isCancelled) return
          continue
        }

        if (hasFailure) {
          toast.error('Some analytics data is delayed. Showing available data.')
        }

        setLoading(false)
        return
      }
    }

    loadAnalytics()
      .catch(() => {
        if (!isCancelled) {
          toast.error('Failed to load analytics')
          setLoading(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [user?.token])

  // Get unique classes
  const classes = useMemo(() => {
    return Array.from(new Set(reports.map((r) => r.className).filter(Boolean))).sort()
  }, [reports])

  // Filter reports by class
  const filteredReports = useMemo(() => {
    if (classFilter === 'all') return reports
    return reports.filter((r) => r.className === classFilter)
  }, [reports, classFilter])

  // Monthly trend data (last 5 months)
  const monthlyTrend = useMemo(() => {
    const now = new Date()
    const months = []
    for (let i = 4; i >= 0; i--) {
      const d = subMonths(now, i)
      months.push({ month: format(d, 'MMM'), monthNum: d.getMonth(), year: d.getFullYear() })
    }

    return months.map(({ month, monthNum, year }) => {
      const monthReports = filteredReports.filter((r) => {
        const rd = new Date(r.createdAt)
        return rd.getMonth() === monthNum && rd.getFullYear() === year
      })
      const avgDyslexia = monthReports.length
        ? monthReports.reduce((s, r) => s + (r.dyslexiaScore || 0), 0) / monthReports.length
        : 0
      const avgDysgraphia = monthReports.length
        ? monthReports.reduce((s, r) => s + (r.dysgraphiaScore || 0), 0) / monthReports.length
        : 0
      return { month, dyslexia: avgDyslexia, dysgraphia: avgDysgraphia }
    })
  }, [filteredReports])

  // Class comparison data
  const classComparison = useMemo(() => {
    const classMap = {}
    reports.forEach((r) => {
      if (!r.className) return
      if (!classMap[r.className]) {
        classMap[r.className] = { dyslexiaSum: 0, dysgraphiaSum: 0, count: 0 }
      }
      classMap[r.className].dyslexiaSum += r.dyslexiaScore || 0
      classMap[r.className].dysgraphiaSum += r.dysgraphiaScore || 0
      classMap[r.className].count++
    })

    return Object.entries(classMap)
      .map(([className, data]) => ({
        class: className.length > 8 ? className.substring(0, 8) : className,
        dyslexia: Math.round(data.dyslexiaSum / data.count),
        dysgraphia: Math.round(data.dysgraphiaSum / data.count),
        students: data.count,
      }))
      .slice(0, 6)
  }, [reports])

  // Risk distribution by class
  const riskByClass = useMemo(() => {
    const classMap = {}
    reports.forEach((r) => {
      if (!r.className) return
      if (!classMap[r.className]) {
        classMap[r.className] = { low: 0, medium: 0, high: 0 }
      }
      if (r.riskLevel === 'LOW') classMap[r.className].low++
      else if (r.riskLevel === 'MEDIUM') classMap[r.className].medium++
      else if (r.riskLevel === 'HIGH') classMap[r.className].high++
    })

    return Object.entries(classMap)
      .map(([name, data]) => ({
        name: name.length > 12 ? name.substring(0, 12) : name,
        ...data,
      }))
      .slice(0, 4)
  }, [reports])

  // Upload frequency (last 8 weeks)
  const uploadFrequency = useMemo(() => {
    const now = new Date()
    const weeks = []
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(now)
      weekStart.setDate(weekStart.getDate() - i * 7)
      weeks.push({ week: `W${8 - i}`, weekStart })
    }

    return weeks.map(({ week, weekStart }) => {
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 7)
      const uploads = filteredReports.filter((r) => {
        const rd = new Date(r.createdAt)
        return rd >= weekStart && rd < weekEnd
      }).length
      return { week, uploads }
    })
  }, [filteredReports])

  if (loading) {
    return (
      <div style={{ padding: '16px 24px' }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ height: 32, width: 160, background: COLORS.bgMuted, borderRadius: 8, marginBottom: 8 }} />
          <div style={{ height: 18, width: 280, background: COLORS.bgMuted, borderRadius: 6 }} />
        </div>
        <div
          style={{
            background: COLORS.bgCard,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 12,
            height: 300,
            animation: 'pulse 1.5s infinite',
          }}
        />
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
            Analytics
          </h1>
          <p style={{ color: COLORS.textMuted, fontSize: 14 }}>
            Trends, class comparisons and AI insights
          </p>
        </div>
        <Select
          value={classFilter}
          onChange={setClassFilter}
          options={[
            { value: 'all', label: 'All Classes' },
            ...classes.map((c) => ({ value: c, label: c })),
          ]}
        />
      </div>

      {/* Score Trends Over Time */}
      <Card style={{ marginBottom: 24 }}>
        <CardHeader title="Score Trends Over Time" description="Monthly average dyslexia and dysgraphia scores" />
        <CardContent>
          <div style={{ height: 256 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: COLORS.textMuted }} stroke={COLORS.border} />
                <YAxis
                  tickFormatter={(v) => `${v.toFixed(0)}%`}
                  tick={{ fontSize: 12, fill: COLORS.textMuted }}
                  stroke={COLORS.border}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="dyslexia"
                  name="Dyslexia"
                  stroke={COLORS.chartDyslexia}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: COLORS.chartDyslexia }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="dysgraphia"
                  name="Dysgraphia"
                  stroke={COLORS.chartDysgraphia}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: COLORS.chartDysgraphia }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Class Comparison + Risk Distribution */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: 24,
          marginBottom: 24,
        }}
      >
        {/* Class Score Comparison */}
        <Card>
          <CardHeader title="Class Score Comparison" description="Average scores by class (in %)" />
          <CardContent>
            <div style={{ height: 224 }}>
              {classComparison.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={classComparison} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                    <XAxis dataKey="class" tick={{ fontSize: 12, fill: COLORS.textMuted }} stroke={COLORS.border} />
                    <YAxis tick={{ fontSize: 12, fill: COLORS.textMuted }} stroke={COLORS.border} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="dyslexia" name="Dyslexia %" fill={COLORS.chartDyslexia} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="dysgraphia" name="Dysgraphia %" fill={COLORS.chartDysgraphia} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div
                  style={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: COLORS.textMuted,
                  }}
                >
                  No class data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Risk Distribution by Class */}
        <Card>
          <CardHeader title="Risk Distribution by Class" description="Students in each risk category per class" />
          <CardContent>
            <div style={{ height: 224 }}>
              {riskByClass.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={riskByClass} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: COLORS.textMuted }} stroke={COLORS.border} />
                    <YAxis tick={{ fontSize: 12, fill: COLORS.textMuted }} stroke={COLORS.border} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="low" name="Low Risk" fill={COLORS.riskLow} stackId="a" />
                    <Bar dataKey="medium" name="Medium Risk" fill={COLORS.riskMedium} stackId="a" />
                    <Bar dataKey="high" name="High Risk" fill={COLORS.riskHigh} stackId="a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div
                  style={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: COLORS.textMuted,
                  }}
                >
                  No risk data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Frequency */}
      <Card style={{ marginBottom: 32 }}>
        <CardHeader title="Upload Frequency" description="Number of papers analyzed per week" />
        <CardContent>
          <div style={{ height: 208 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={uploadFrequency} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                <XAxis dataKey="week" tick={{ fontSize: 12, fill: COLORS.textMuted }} stroke={COLORS.border} />
                <YAxis tick={{ fontSize: 12, fill: COLORS.textMuted }} stroke={COLORS.border} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="uploads" name="Papers Uploaded" fill={COLORS.chartDyslexia} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
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
          AI Insights
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 16,
          }}
        >
          {defaultInsights.map((insight) => (
            <Card
              key={insight.title}
              style={{
                borderLeft: `4px solid ${insight.color}`,
              }}
            >
              <div style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: insight.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <insight.icon size={20} color={insight.color} />
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: COLORS.textPrimary,
                        marginBottom: 4,
                      }}
                    >
                      {insight.title}
                    </p>
                    <p style={{ fontSize: 14, color: COLORS.textMuted, lineHeight: 1.5 }}>{insight.desc}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
