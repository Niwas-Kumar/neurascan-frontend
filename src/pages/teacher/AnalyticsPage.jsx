import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Brain, Users, BarChart3, AlertTriangle, FileText } from 'lucide-react'
import { optimizedAnalysisAPI, optimizedStudentAPI } from '../../services/optimizedApi'
import { useAuth } from '../../context/AuthContext'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ScatterChart, Scatter, ZAxis, Cell, Legend
} from 'recharts'
import toast from 'react-hot-toast'

// ── Inline PageHeader Component ────────────────────────────
const PageHeader = ({ title, subtitle, breadcrumb }) => (
  <div style={{ marginBottom: 32 }}>
    {breadcrumb && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>{breadcrumb}</div>}
    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, marginBottom: 6, color: 'var(--text-primary)' }}>{title}</h1>
    {subtitle && <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{subtitle}</p>}
  </div>
)

// ── Inline StatCard Component ────────────────────────────
const StatCard = ({ icon: Icon, label, value, color = 'blue', delay = 0 }) => {
  const colors = { blue: '#1a73e8', violet: '#7c3aed', green: '#10b981', amber: '#f59e0b' }
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: delay * 0.06 }}
      style={{ borderRadius: 'var(--radius)', padding: '20px 22px', border: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: `${colors[color]}20`,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Icon size={20} color={colors[color]} strokeWidth={2} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>{value}</div>
        </div>
      </div>
    </motion.div>
  )
}

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

// ── Inline RiskBadge Component ────────────────────────────
const RiskBadge = ({ level }) => {
  const colors = { LOW: { bg: '#d1fae5', text: '#065f46' }, MEDIUM: { bg: '#fef3c7', text: '#92400e' }, HIGH: { bg: '#fee2e2', text: '#7f1d1d' } }
  const color = colors[level] || colors.LOW
  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 10px',
      borderRadius: '12px',
      fontSize: 12,
      fontWeight: 600,
      background: color.bg,
      color: color.text,
    }}>
      {level}
    </span>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', fontSize: 12, boxShadow: 'var(--shadow)' }}>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 600 }}>{label}</p>
      {payload.map(p => (
        <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
          <span style={{ color: 'var(--text-secondary)' }}>{p.name}:</span>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
            {typeof p.value === 'number' ? p.value.toFixed(1) + '%' : p.value}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function AnalyticsPage() {
  const { user } = useAuth()
  const [reports, setReports]   = useState([])
  const [students, setStudents] = useState([])
  const [dash, setDash]         = useState(null)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([optimizedAnalysisAPI.getReports(), optimizedAnalysisAPI.getDashboard(), optimizedStudentAPI.getAll()])
      .then(([r, d, s]) => {
        setReports(r.data.data || [])
        setDash(d.data.data)
        setStudents(s.data.data || [])
      })
      .catch(() => toast.error('Failed to load analytics'))
      .finally(() => setLoading(false))
  }, [user?.userId])

  if (loading) return (
    <div>
      <PageHeader title="Analytics" subtitle="Loading analytics data…" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[0,1,2,3].map(i => <SkeletonCard key={i} rows={2} />)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <SkeletonCard rows={8} /><SkeletonCard rows={8} />
      </div>
    </div>
  )

  // Per-student bar data
  const perStudentData = [...reports]
    .reduce((acc, r) => {
      const existing = acc.find(x => x.name === r.studentName)
      if (existing) {
        existing.dyslexia   = Math.max(existing.dyslexia, r.dyslexiaScore)
        existing.dysgraphia = Math.max(existing.dysgraphia, r.dysgraphiaScore)
        existing.count++
      } else {
        acc.push({ name: r.studentName.split(' ')[0], dyslexia: r.dyslexiaScore, dysgraphia: r.dysgraphiaScore, count: 1 })
      }
      return acc
    }, [])
    .slice(0, 10)

  // Risk distribution for radar
  const riskCounts = { LOW: 0, MEDIUM: 0, HIGH: 0 }
  reports.forEach(r => { if (riskCounts[r.riskLevel] !== undefined) riskCounts[r.riskLevel]++ })

  const radarData = [
    { subject: 'Low Risk',    A: riskCounts.LOW },
    { subject: 'Medium Risk', A: riskCounts.MEDIUM },
    { subject: 'High Risk',   A: riskCounts.HIGH },
    { subject: 'Avg Dyslexia',   A: Math.round(dash?.averageDyslexiaScore ?? 0) },
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
  const riskColors = { LOW: 'var(--success)', MEDIUM: 'var(--warning)', HIGH: 'var(--danger)' }

  // Top at-risk students
  const atRiskStudents = reports
    .filter(r => r.riskLevel !== 'LOW')
    .reduce((acc, r) => {
      const ex = acc.find(x => x.studentId === r.studentId)
      if (!ex) acc.push({ studentId: r.studentId, studentName: r.studentName, className: r.className, riskLevel: r.riskLevel, dyslexiaScore: r.dyslexiaScore, dysgraphiaScore: r.dysgraphiaScore })
      return acc
    }, [])
    .sort((a, b) => Math.max(b.dyslexiaScore, b.dysgraphiaScore) - Math.max(a.dyslexiaScore, a.dysgraphiaScore))
    .slice(0, 5)

  return (
    <div>
      <PageHeader
        title="Analytics"
        subtitle="Deep insights into your classroom's learning health."
        breadcrumb="NeuraScan / Analytics"
      />

      {/* Top stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard icon={Users}         label="Total Students"    value={students.length}                              color="violet"  delay={0} />
        <StatCard icon={FileText}      label="Analyses Run"      value={reports.length}                               color="cyan"    delay={1} />
        <StatCard icon={AlertTriangle} label="At-Risk Students"  value={dash?.studentsAtRisk ?? 0}                    color="warning" delay={2} />
        <StatCard icon={Brain}         label="Avg Dyslexia"      value={`${(dash?.averageDyslexiaScore??0).toFixed(1)}%`} color="danger"  delay={3} />
      </div>

      {/* Charts row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(280px, 380px)', gap: 20, marginBottom: 20 }}>

        {/* Bar: per-student scores */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="glass-panel"
          style={{ padding: '22px 24px', minWidth: 0, overflow: 'hidden' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Student Score Comparison</h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>Highest scores per student across all analyses</p>
          {perStudentData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={perStudentData} barCategoryGap="30%">
                <CartesianGrid stroke="rgba(139,92,246,0.06)" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0,100]} tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="dyslexia"   name="Dyslexia"   fill="#7c3aed" radius={[4,4,0,0]} />
                <Bar dataKey="dysgraphia" name="Dysgraphia" fill="#06b6d4" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
              No data yet — upload student papers to see comparisons.
            </div>
          )}
        </motion.div>

        {/* Radar */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="glass-panel"
          style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Classroom Overview</h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Risk distribution & averages</p>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(139,92,246,0.12)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 10 }} />
              <PolarRadiusAxis tick={{ fill: '#475569', fontSize: 9 }} />
              <Radar name="Classroom" dataKey="A" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.25} />
              <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Charts row 2 */}
      <div className="grid-2" style={{ gap: 20 }}>

        {/* Scatter: dyslexia vs dysgraphia */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
          className="glass-panel"
          style={{ padding: '22px 24px', minWidth: 0 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Dyslexia vs Dysgraphia</h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Score correlation per analysis — colored by risk</p>
          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            {[['Low', 'var(--success)'], ['Medium', 'var(--warning)'], ['High', 'var(--danger)']].map(([l, c]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
                <span style={{ color: 'var(--text-muted)' }}>{l}</span>
              </div>
            ))}
          </div>
          {scatterData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <ScatterChart>
                <CartesianGrid stroke="rgba(139,92,246,0.06)" strokeDasharray="4 4" />
                <XAxis type="number" dataKey="x" name="Dyslexia"   domain={[0,100]} tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} label={{ value: 'Dyslexia %', position: 'insideBottom', offset: -4, fill: '#475569', fontSize: 10 }} />
                <YAxis type="number" dataKey="y" name="Dysgraphia" domain={[0,100]} tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} label={{ value: 'Dysgraphia %', angle: -90, position: 'insideLeft', fill: '#475569', fontSize: 10 }} />
                <ZAxis dataKey="z" range={[40, 40]} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                  formatter={(v, n) => [typeof v === 'number' ? v.toFixed(1) + '%' : v, n]}
                />
                <Scatter data={scatterData} shape={(props) => {
                  const { cx, cy, payload } = props
                  const fill = riskColors[payload.risk] || 'var(--violet)'
                  return <circle cx={cx} cy={cy} r={5} fill={fill} fillOpacity={0.8} stroke={fill} strokeWidth={1} />
                }} />
              </ScatterChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
              No correlation data yet.
            </div>
          )}
        </motion.div>

        {/* At-risk students table */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
          className="glass-panel"
          style={{ overflow: 'hidden' }}>
          <div style={{ padding: '22px 24px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, marginBottom: 2 }}>Students Needing Attention</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Ranked by highest risk score</p>
          </div>
          {atRiskStudents.length === 0 ? (
            <div style={{ padding: '40px 24px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>🎉 No high-risk students detected.</p>
            </div>
          ) : (
            atRiskStudents.map((s, i) => (
              <div key={s.studentId} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 24px', borderBottom: i < atRiskStudents.length - 1 ? '1px solid rgba(139,92,246,0.06)' : 'none' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--violet-dim)', border: '1px solid rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13, color: 'var(--violet-soft)', flexShrink: 0 }}>
                  {s.studentName?.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.studentName}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.className}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: s.dyslexiaScore >= 70 ? 'var(--danger)' : 'var(--warning)', marginBottom: 3 }}>
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
