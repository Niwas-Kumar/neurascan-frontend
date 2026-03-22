import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Brain, Users, BarChart3, AlertTriangle, FileText, Activity } from 'lucide-react'
import { optimizedAnalysisAPI, optimizedStudentAPI } from '../../services/optimizedApi'
import { useAuth } from '../../context/AuthContext'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ScatterChart, Scatter, ZAxis, AreaChart, Area
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
  <div className="mb-6 md:mb-8">
    {breadcrumb && (
      <div className="text-xs mb-2.5 font-medium" style={{ color: COLORS.textMuted }}>
        {breadcrumb}
      </div>
    )}
    <h1 className="text-xl md:text-[28px] font-extrabold mb-2" style={{
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      color: COLORS.textPrimary,
      letterSpacing: '-0.02em',
    }}>
      {title}
    </h1>
    {subtitle && (
      <p className="text-sm md:text-[15px] leading-relaxed" style={{ color: COLORS.textSecondary }}>
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
      className="rounded-xl p-4 md:p-[22px]"
      style={{
        background: COLORS.bgSurface,
        border: `1px solid ${COLORS.border}`,
      }}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: c.bg }}>
          <Icon size={20} color={c.icon} strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium mb-1" style={{ color: COLORS.textMuted }}>
            {label}
          </div>
          <div className="text-xl md:text-[26px] font-extrabold truncate" style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
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
  <div className="rounded-xl p-[22px]" style={{
    border: `1px solid ${COLORS.border}`,
    background: COLORS.bgSurface,
  }}>
    {Array(rows).fill(0).map((_, i) => (
      <div key={i} className="rounded-lg mb-3 last:mb-0" style={{
        height: i === 0 ? 24 : 14,
        background: `linear-gradient(90deg, ${COLORS.bgSubtle} 25%, ${COLORS.bgSurface} 50%, ${COLORS.bgSubtle} 75%)`,
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
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
    className="rounded-xl p-4 md:p-6 h-full"
    style={{
      background: COLORS.bgSurface,
      border: `1px solid ${COLORS.border}`,
    }}
  >
    <div className="mb-4 md:mb-5">
      <h3 className="text-sm md:text-base font-bold mb-1" style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        color: COLORS.textPrimary,
      }}>
        {title}
      </h3>
      {subtitle && (
        <p className="text-xs" style={{ color: COLORS.textMuted }}>
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
          {[0, 1, 2, 3].map(i => <SkeletonCard key={i} rows={2} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-5 md:mb-7">
        <StatCard icon={Users} label="Total Students" value={students.length} color="primary" delay={0} />
        <StatCard icon={FileText} label="Analyses Completed" value={reports.length} color="secondary" delay={1} />
        <StatCard icon={AlertTriangle} label="Students at Risk" value={dash?.studentsAtRisk ?? 0} color="warning" delay={2} />
        <StatCard icon={Brain} label="Avg Dyslexia Score" value={`${(dash?.averageDyslexiaScore ?? 0).toFixed(1)}%`} color="danger" delay={3} />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(240px,340px)] gap-4 md:gap-5 mb-4 md:mb-5">
        {/* Bar: per-student scores */}
        <ChartCard
          title="Student Score Comparison"
          subtitle="Highest scores per student across all analyses"
          delay={0.3}
        >
          {perStudentData.length > 0 ? (
            <div className="w-full overflow-x-auto">
              <div className="min-w-[280px]">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={perStudentData} barCategoryGap="30%">
                    <CartesianGrid stroke={COLORS.border} strokeDasharray="4 4" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: COLORS.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fill: COLORS.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="dyslexia" name="Dyslexia" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="dysgraphia" name="Dysgraphia" fill={COLORS.secondary} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="h-48 md:h-60 flex items-center justify-center text-sm" style={{ color: COLORS.textMuted }}>
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
          <div className="w-full overflow-x-auto">
            <div className="min-w-[200px]">
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke={`${COLORS.primary}15`} />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: COLORS.textMuted, fontSize: 9 }} />
                  <PolarRadiusAxis tick={{ fill: COLORS.textMuted, fontSize: 8 }} />
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
                      fontSize: 11,
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
        {/* Scatter: dyslexia vs dysgraphia */}
        <ChartCard
          title="Score Correlation Analysis"
          subtitle="Dyslexia vs Dysgraphia scores, colored by risk level"
          delay={0.5}
        >
          <div className="flex gap-3 md:gap-4 mb-3 md:mb-4 flex-wrap">
            {[['Low', COLORS.riskLow], ['Medium', COLORS.riskMedium], ['High', COLORS.riskHigh]].map(([label, color]) => (
              <div key={label} className="flex items-center gap-1.5 text-[11px]">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                <span style={{ color: COLORS.textMuted }}>{label}</span>
              </div>
            ))}
          </div>
          {scatterData.length > 0 ? (
            <div className="w-full overflow-x-auto">
              <div className="min-w-[280px]">
                <ResponsiveContainer width="100%" height={180}>
                  <ScatterChart>
                    <CartesianGrid stroke={COLORS.border} strokeDasharray="4 4" />
                    <XAxis
                      type="number"
                      dataKey="x"
                      name="Dyslexia"
                      domain={[0, 100]}
                      tick={{ fill: COLORS.textMuted, fontSize: 9 }}
                      axisLine={false}
                      tickLine={false}
                      label={{ value: 'Dyslexia %', position: 'insideBottom', offset: -4, fill: COLORS.textMuted, fontSize: 9 }}
                    />
                    <YAxis
                      type="number"
                      dataKey="y"
                      name="Dysgraphia"
                      domain={[0, 100]}
                      tick={{ fill: COLORS.textMuted, fontSize: 9 }}
                      axisLine={false}
                      tickLine={false}
                      label={{ value: 'Dysgraphia %', angle: -90, position: 'insideLeft', fill: COLORS.textMuted, fontSize: 9 }}
                    />
                    <ZAxis dataKey="z" range={[40, 40]} />
                    <Tooltip
                      cursor={{ strokeDasharray: '3 3' }}
                      contentStyle={{
                        background: COLORS.bgSurface,
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: 10,
                        fontSize: 11,
                      }}
                      formatter={(v, n) => [typeof v === 'number' ? v.toFixed(1) + '%' : v, n]}
                    />
                    <Scatter
                      data={scatterData}
                      shape={(props) => {
                        const { cx, cy, payload } = props
                        const fill = riskColors[payload.risk] || COLORS.primary
                        return <circle cx={cx} cy={cy} r={5} fill={fill} fillOpacity={0.7} stroke={fill} strokeWidth={2} />
                      }}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="h-44 flex items-center justify-center text-sm" style={{ color: COLORS.textMuted }}>
              No correlation data available yet.
            </div>
          )}
        </ChartCard>

        {/* At-risk students table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-xl overflow-hidden"
          style={{
            background: COLORS.bgSurface,
            border: `1px solid ${COLORS.border}`,
          }}
        >
          <div className="p-4 md:p-5 border-b" style={{ borderColor: COLORS.border }}>
            <h3 className="text-sm md:text-base font-bold mb-1" style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              color: COLORS.textPrimary,
            }}>
              Students Requiring Attention
            </h3>
            <p className="text-xs" style={{ color: COLORS.textMuted }}>
              Ranked by highest risk indicators
            </p>
          </div>

          {atRiskStudents.length === 0 ? (
            <div className="py-10 px-6 text-center">
              <Activity size={36} color={COLORS.textLight} strokeWidth={1.5} style={{ marginBottom: 14 }} />
              <p className="text-sm" style={{ color: COLORS.textMuted }}>
                No high-risk students identified.
              </p>
            </div>
          ) : (
            <div className="max-h-[300px] overflow-y-auto">
              {atRiskStudents.map((s, i) => (
                <div
                  key={s.studentId}
                  className="flex items-center gap-3 p-3 md:p-4"
                  style={{
                    borderBottom: i < atRiskStudents.length - 1 ? `1px solid ${COLORS.borderLight}` : 'none',
                  }}
                >
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-xs md:text-sm font-bold" style={{
                    background: COLORS.primaryBg,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    color: COLORS.primary,
                  }}>
                    {s.studentName?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-xs md:text-sm truncate" style={{ color: COLORS.textPrimary }}>
                      {s.studentName}
                    </div>
                    <div className="text-[10px] md:text-xs mt-0.5" style={{ color: COLORS.textMuted }}>
                      {s.className}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm md:text-[15px] font-bold mb-1" style={{
                      color: s.dyslexiaScore >= 70 ? COLORS.riskHigh : COLORS.riskMedium,
                    }}>
                      {Math.max(s.dyslexiaScore, s.dysgraphiaScore).toFixed(1)}%
                    </div>
                    <RiskBadge level={s.riskLevel} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
