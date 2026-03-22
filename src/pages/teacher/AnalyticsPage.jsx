import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, Users, AlertTriangle, FileText, Activity } from 'lucide-react'
import { optimizedAnalysisAPI, optimizedStudentAPI } from '../../services/optimizedApi'
import { useAuth } from '../../context/AuthContext'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ScatterChart, Scatter, ZAxis
} from 'recharts'
import toast from 'react-hot-toast'

// ════════════════════════════════════════════════════════════════
// DESIGN SYSTEM COLORS
// ════════════════════════════════════════════════════════════════
const COLORS = {
  // Primary: Deep Indigo
  primary: '#312E81',
  primaryLight: '#4338CA',
  primaryLighter: '#6366F1',
  primaryBg: '#EEF2FF',

  // Secondary: Soft Teal
  secondary: '#14B8A6',
  secondaryDark: '#0D9488',
  secondaryBg: '#CCFBF1',

  // Risk levels (muted clinical)
  riskHigh: '#B91C1C',
  riskHighBg: '#FEF2F2',
  riskMedium: '#B45309',
  riskMediumBg: '#FFFBEB',
  riskLow: '#047857',
  riskLowBg: '#ECFDF5',

  // Neutrals
  textPrimary: '#1E293B',
  textSecondary: '#475569',
  textMuted: '#64748B',
  textLight: '#94A3B8',

  // Backgrounds
  bgBase: '#F8FAFC',
  bgSurface: '#FFFFFF',
  bgSubtle: '#F1F5F9',

  // Borders
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
}

// ════════════════════════════════════════════════════════════════
// REUSABLE COMPONENTS
// ════════════════════════════════════════════════════════════════

const PageHeader = ({ title, subtitle, breadcrumb }) => (
  <div style={{ marginBottom: 32 }}>
    {breadcrumb && (
      <div style={{
        fontSize: 12,
        color: COLORS.textMuted,
        marginBottom: 10,
        fontWeight: 500,
      }}>
        {breadcrumb}
      </div>
    )}
    <h1 style={{
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: 28,
      fontWeight: 800,
      marginBottom: 8,
      color: COLORS.textPrimary,
      letterSpacing: '-0.02em',
    }}>
      {title}
    </h1>
    {subtitle && (
      <p style={{
        fontSize: 15,
        color: COLORS.textSecondary,
        lineHeight: 1.6,
      }}>
        {subtitle}
      </p>
    )}
  </div>
)

const StatCard = ({ icon: Icon, label, value, color = 'primary', delay = 0 }) => {
  const colorMap = {
    primary: { bg: COLORS.primaryBg, icon: COLORS.primary },
    secondary: { bg: COLORS.secondaryBg, icon: COLORS.secondary },
    warning: { bg: COLORS.riskMediumBg, icon: COLORS.riskMedium },
    danger: { bg: COLORS.riskHighBg, icon: COLORS.riskHigh },
  }
  const c = colorMap[color] || colorMap.primary

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.08 }}
      style={{
        background: COLORS.bgSurface,
        borderRadius: 16,
        padding: '22px 24px',
        border: `1px solid ${COLORS.border}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: c.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Icon size={22} color={c.icon} strokeWidth={2} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: 13,
            color: COLORS.textMuted,
            marginBottom: 4,
            fontWeight: 500,
          }}>
            {label}
          </div>
          <div style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 26,
            fontWeight: 800,
            color: COLORS.textPrimary,
          }}>
            {value}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const SkeletonCard = ({ rows = 4 }) => (
  <div style={{
    border: `1px solid ${COLORS.border}`,
    borderRadius: 16,
    padding: '22px 24px',
    background: COLORS.bgSurface,
  }}>
    {Array(rows).fill(0).map((_, i) => (
      <div key={i} style={{
        height: i === 0 ? 24 : 14,
        background: `linear-gradient(90deg, ${COLORS.bgSubtle} 25%, ${COLORS.bgSurface} 50%, ${COLORS.bgSubtle} 75%)`,
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        borderRadius: 8,
        marginBottom: i < rows - 1 ? 12 : 0,
      }} />
    ))}
    <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
  </div>
)

const RiskBadge = ({ level }) => {
  const styles = {
    LOW: { bg: COLORS.riskLowBg, text: COLORS.riskLow },
    MEDIUM: { bg: COLORS.riskMediumBg, text: COLORS.riskMedium },
    HIGH: { bg: COLORS.riskHighBg, text: COLORS.riskHigh },
  }
  const s = styles[level] || styles.LOW

  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: 100,
      fontSize: 12,
      fontWeight: 600,
      background: s.bg,
      color: s.text,
    }}>
      {level}
    </span>
  )
}

const ChartCard = ({ title, subtitle, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    style={{
      background: COLORS.bgSurface,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 16,
      padding: '24px',
      height: '100%',
    }}
  >
    <div style={{ marginBottom: 20 }}>
      <h3 style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: 16,
        fontWeight: 700,
        color: COLORS.textPrimary,
        marginBottom: 4,
      }}>
        {title}
      </h3>
      {subtitle && (
        <p style={{ fontSize: 13, color: COLORS.textMuted }}>
          {subtitle}
        </p>
      )}
    </div>
    {children}
  </motion.div>
)

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: COLORS.bgSurface,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 12,
      padding: '12px 16px',
      fontSize: 13,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    }}>
      <p style={{ color: COLORS.textMuted, marginBottom: 8, fontWeight: 600 }}>{label}</p>
      {payload.map(p => (
        <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <div style={{ width: 10, height: 10, borderRadius: 3, background: p.color }} />
          <span style={{ color: COLORS.textSecondary }}>{p.name}:</span>
          <span style={{ fontWeight: 700, color: COLORS.textPrimary }}>
            {typeof p.value === 'number' ? p.value.toFixed(1) + '%' : p.value}
          </span>
        </div>
      ))}
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// MAIN ANALYTICS PAGE
// ════════════════════════════════════════════════════════════════

export default function AnalyticsPage() {
  const { user } = useAuth()
  const [reports, setReports] = useState([])
  const [students, setStudents] = useState([])
  const [dash, setDash] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      optimizedAnalysisAPI.getReports(),
      optimizedAnalysisAPI.getDashboard(),
      optimizedStudentAPI.getAll()
    ])
      .then(([r, d, s]) => {
        setReports(r.data.data || [])
        setDash(d.data.data)
        setStudents(s.data.data || [])
      })
      .catch(() => toast.error('Failed to load analytics'))
      .finally(() => setLoading(false))
  }, [user?.userId])

  if (loading) {
    return (
      <div>
        <PageHeader title="Analytics" subtitle="Loading analytics data..." />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
          {[0, 1, 2, 3].map(i => <SkeletonCard key={i} rows={2} />)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <SkeletonCard rows={8} />
          <SkeletonCard rows={8} />
        </div>
      </div>
    )
  }

  // Per-student bar data
  const perStudentData = [...reports]
    .reduce((acc, r) => {
      const existing = acc.find(x => x.name === r.studentName)
      if (existing) {
        existing.dyslexia = Math.max(existing.dyslexia, r.dyslexiaScore)
        existing.dysgraphia = Math.max(existing.dysgraphia, r.dysgraphiaScore)
      } else {
        acc.push({
          name: r.studentName.split(' ')[0],
          dyslexia: r.dyslexiaScore,
          dysgraphia: r.dysgraphiaScore,
        })
      }
      return acc
    }, [])
    .slice(0, 10)

  // Risk distribution for radar
  const riskCounts = { LOW: 0, MEDIUM: 0, HIGH: 0 }
  reports.forEach(r => { if (riskCounts[r.riskLevel] !== undefined) riskCounts[r.riskLevel]++ })

  const radarData = [
    { subject: 'Low Risk', A: riskCounts.LOW },
    { subject: 'Medium Risk', A: riskCounts.MEDIUM },
    { subject: 'High Risk', A: riskCounts.HIGH },
    { subject: 'Avg Dyslexia', A: Math.round(dash?.averageDyslexiaScore ?? 0) },
    { subject: 'Avg Dysgraphia', A: Math.round(dash?.averageDysgraphiaScore ?? 0) },
  ]

  // Scatter: dyslexia vs dysgraphia per report
  const scatterData = reports.map(r => ({
    x: r.dyslexiaScore,
    y: r.dysgraphiaScore,
    z: 1,
    name: r.studentName,
    risk: r.riskLevel,
  }))

  const riskColors = {
    LOW: COLORS.riskLow,
    MEDIUM: COLORS.riskMedium,
    HIGH: COLORS.riskHigh,
  }

  // Top at-risk students
  const atRiskStudents = reports
    .filter(r => r.riskLevel !== 'LOW')
    .reduce((acc, r) => {
      const ex = acc.find(x => x.studentId === r.studentId)
      if (!ex) acc.push({
        studentId: r.studentId,
        studentName: r.studentName,
        className: r.className,
        riskLevel: r.riskLevel,
        dyslexiaScore: r.dyslexiaScore,
        dysgraphiaScore: r.dysgraphiaScore,
      })
      return acc
    }, [])
    .sort((a, b) => Math.max(b.dyslexiaScore, b.dysgraphiaScore) - Math.max(a.dyslexiaScore, a.dysgraphiaScore))
    .slice(0, 5)

  return (
    <div>
      <PageHeader
        title="Analytics"
        subtitle="Comprehensive insights into classroom learning health and risk patterns."
        breadcrumb="NeuraScan / Analytics"
      />

      {/* Top stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16,
        marginBottom: 28,
      }}>
        <StatCard icon={Users} label="Total Students" value={students.length} color="primary" delay={0} />
        <StatCard icon={FileText} label="Analyses Completed" value={reports.length} color="secondary" delay={1} />
        <StatCard icon={AlertTriangle} label="Students at Risk" value={dash?.studentsAtRisk ?? 0} color="warning" delay={2} />
        <StatCard icon={Brain} label="Avg Dyslexia Score" value={`${(dash?.averageDyslexiaScore ?? 0).toFixed(1)}%`} color="danger" delay={3} />
      </div>

      {/* Charts row 1 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(300px, 400px)',
        gap: 20,
        marginBottom: 20,
      }}>
        {/* Bar: per-student scores */}
        <ChartCard
          title="Student Score Comparison"
          subtitle="Highest scores per student across all analyses"
          delay={0.3}
        >
          {perStudentData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={perStudentData} barCategoryGap="30%">
                <CartesianGrid stroke={COLORS.border} strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: COLORS.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: COLORS.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="dyslexia" name="Dyslexia" fill={COLORS.primary} radius={[6, 6, 0, 0]} />
                <Bar dataKey="dysgraphia" name="Dysgraphia" fill={COLORS.secondary} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{
              height: 240,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: COLORS.textMuted,
              fontSize: 14,
            }}>
              No data yet. Upload student samples to see comparisons.
            </div>
          )}
        </ChartCard>

        {/* Radar */}
        <ChartCard
          title="Classroom Overview"
          subtitle="Risk distribution and score averages"
          delay={0.4}
        >
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData}>
              <PolarGrid stroke={`${COLORS.primary}15`} />
              <PolarAngleAxis dataKey="subject" tick={{ fill: COLORS.textMuted, fontSize: 10 }} />
              <PolarRadiusAxis tick={{ fill: COLORS.textMuted, fontSize: 9 }} />
              <Radar
                name="Classroom"
                dataKey="A"
                stroke={COLORS.primary}
                fill={COLORS.primary}
                fillOpacity={0.2}
              />
              <Tooltip
                contentStyle={{
                  background: COLORS.bgSurface,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 10,
                  fontSize: 12,
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 20,
      }}>
        {/* Scatter: dyslexia vs dysgraphia */}
        <ChartCard
          title="Score Correlation Analysis"
          subtitle="Dyslexia vs Dysgraphia scores, colored by risk level"
          delay={0.5}
        >
          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            {[['Low', COLORS.riskLow], ['Medium', COLORS.riskMedium], ['High', COLORS.riskHigh]].map(([label, color]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
                <span style={{ color: COLORS.textMuted }}>{label}</span>
              </div>
            ))}
          </div>
          {scatterData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <ScatterChart>
                <CartesianGrid stroke={COLORS.border} strokeDasharray="4 4" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Dyslexia"
                  domain={[0, 100]}
                  tick={{ fill: COLORS.textMuted, fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  label={{ value: 'Dyslexia %', position: 'insideBottom', offset: -4, fill: COLORS.textMuted, fontSize: 10 }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Dysgraphia"
                  domain={[0, 100]}
                  tick={{ fill: COLORS.textMuted, fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  label={{ value: 'Dysgraphia %', angle: -90, position: 'insideLeft', fill: COLORS.textMuted, fontSize: 10 }}
                />
                <ZAxis dataKey="z" range={[50, 50]} />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{
                    background: COLORS.bgSurface,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 10,
                    fontSize: 12,
                  }}
                  formatter={(v, n) => [typeof v === 'number' ? v.toFixed(1) + '%' : v, n]}
                />
                <Scatter
                  data={scatterData}
                  shape={(props) => {
                    const { cx, cy, payload } = props
                    const fill = riskColors[payload.risk] || COLORS.primary
                    return <circle cx={cx} cy={cy} r={6} fill={fill} fillOpacity={0.7} stroke={fill} strokeWidth={2} />
                  }}
                />
              </ScatterChart>
            </ResponsiveContainer>
          ) : (
            <div style={{
              height: 220,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: COLORS.textMuted,
              fontSize: 14,
            }}>
              No correlation data available yet.
            </div>
          )}
        </ChartCard>

        {/* At-risk students table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{
            background: COLORS.bgSurface,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 16,
            overflow: 'hidden',
          }}
        >
          <div style={{
            padding: '20px 24px',
            borderBottom: `1px solid ${COLORS.border}`,
          }}>
            <h3 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 16,
              fontWeight: 700,
              marginBottom: 4,
              color: COLORS.textPrimary,
            }}>
              Students Requiring Attention
            </h3>
            <p style={{ fontSize: 13, color: COLORS.textMuted }}>
              Ranked by highest risk indicators
            </p>
          </div>

          {atRiskStudents.length === 0 ? (
            <div style={{ padding: '48px 24px', textAlign: 'center' }}>
              <Activity size={40} color={COLORS.textLight} strokeWidth={1.5} style={{ marginBottom: 16 }} />
              <p style={{ color: COLORS.textMuted, fontSize: 14 }}>
                No high-risk students identified.
              </p>
            </div>
          ) : (
            atRiskStudents.map((s, i) => (
              <div
                key={s.studentId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '16px 24px',
                  borderBottom: i < atRiskStudents.length - 1 ? `1px solid ${COLORS.borderLight}` : 'none',
                }}
              >
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: COLORS.primaryBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  color: COLORS.primary,
                  flexShrink: 0,
                }}>
                  {s.studentName?.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontWeight: 600,
                    fontSize: 14,
                    color: COLORS.textPrimary,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {s.studentName}
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>
                    {s.className}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: s.dyslexiaScore >= 70 ? COLORS.riskHigh : COLORS.riskMedium,
                    marginBottom: 4,
                  }}>
                    {Math.max(s.dyslexiaScore, s.dysgraphiaScore).toFixed(1)}%
                  </div>
                  <RiskBadge level={s.riskLevel} />
                </div>
              </div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  )
}
