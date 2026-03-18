import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, Calendar, Brain, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { optimizedAnalysisAPI } from '../../services/optimizedApi'
import { useAuth } from '../../context/AuthContext'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

// ── Inline PageHeader Component ────────────────────────────
const PageHeader = ({ title, subtitle, breadcrumb }) => (
  <div style={{ marginBottom: 32 }}>
    {breadcrumb && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>{breadcrumb}</div>}
    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, marginBottom: 6, color: 'var(--text-primary)' }}>{title}</h1>
    {subtitle && <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{subtitle}</p>}
  </div>
)

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

// ── Inline SkeletonCard Component ────────────────────────────
const SkeletonCard = ({ rows = 4 }) => (
  <div className="glass-panel" style={{ padding: '20px 24px' }}>
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
    <style>{`
      @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `}</style>
  </div>
)

// ── Inline StatCard Component ────────────────────────────
const StatCard = ({ icon: Icon, label, value, color = 'blue', delay = 0 }) => {
  const colors = { blue: '#1a73e8', violet: '#7c3aed', green: '#10b981', amber: '#f59e0b' }
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: delay * 0.06 }}
      className="glass-panel" style={{ padding: '20px 22px' }}>
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

// ── Inline Badge Component ────────────────────────────
const Badge = ({ children, color = 'blue', dot = false }) => {
  const colors = { blue: '#e8f0fe', violet: '#ede9fe', green: '#d1fae5' }
  const textColors = { blue: '#1a73e8', violet: '#7c3aed', green: '#059669' }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 10px',
      borderRadius: '12px',
      fontSize: 12,
      fontWeight: 600,
      background: colors[color],
      color: textColors[color],
    }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: textColors[color] }} />}
      {children}
    </span>
  )
}

export default function ProgressPage() {
  const { user }   = useAuth()
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [noData, setNoData]   = useState(false)

  useEffect(() => {
    const sid = user?.studentId || localStorage.getItem('ns_studentId')
    if (!sid) { setNoData(true); setLoading(false); return }

    optimizedAnalysisAPI.getProgress(sid)
      .then(res => setData(res.data.data))
      .catch(err => {
        if (err.response?.status === 404 || err.response?.status === 403) setNoData(true)
        else toast.error('Failed to load progress data')
      })
      .finally(() => setLoading(false))
  }, [user?.userId, user?.studentId])

  if (loading) return (
    <div>
      <PageHeader title="Progress Tracker" subtitle="Loading progress data…" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}>
        <SkeletonCard rows={8} /><SkeletonCard rows={6} />
      </div>
    </div>
  )

  const reports = data?.reports || []
  const chartData = [...reports].reverse().map(r => ({
    date:       format(new Date(r.createdAt || r.uploadDate), 'MMM d'),
    Dyslexia:   +r.dyslexiaScore?.toFixed(1),
    Dysgraphia: +r.dysgraphiaScore?.toFixed(1),
  }))

  const trend = data?.trend || 'INSUFFICIENT_DATA'
  const TrendIcon  = trend === 'IMPROVING' ? TrendingDown : trend === 'WORSENING' ? TrendingUp : Minus
  const trendColor = trend === 'IMPROVING' ? 'var(--success)' : trend === 'WORSENING' ? 'var(--danger)' : 'var(--text-secondary)'
  const trendLabel = { IMPROVING: 'Improving', WORSENING: 'Needs attention', STABLE: 'Stable', INSUFFICIENT_DATA: 'Not enough data' }[trend] || '—'

  const latest   = reports[0]
  const previous = reports[1]
  const dyslexiaDelta   = latest && previous ? (latest.dyslexiaScore   - previous.dyslexiaScore).toFixed(1)   : null
  const dysgraphiaDelta = latest && previous ? (latest.dysgraphiaScore - previous.dysgraphiaScore).toFixed(1) : null

  return (
    <div>
      <PageHeader
        title="Progress Tracker"
        subtitle={data?.studentName ? `Tracking ${data.studentName}'s learning journey over ${reports.length} analyses.` : 'Learning progress over time.'}
        breadcrumb="NeuraScan / Progress"
      />

      {noData || reports.length === 0 ? (
        <div className="glass-panel" style={{ maxWidth: 520 }}>
          <div style={{ padding: '48px 32px', textAlign: 'center' }}>
            <TrendingUp size={40} color="var(--text-muted)" strokeWidth={1.25} style={{ marginBottom: 16 }} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, marginBottom: 8 }}>No Progress Data Yet</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.75 }}>
              Multiple analyses are needed to track progress. Progress charts appear once at least 2 analyses have been completed.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 16, marginBottom: 24 }}>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}
              className="glass-panel"
              style={{ border: `1px solid ${trend === 'IMPROVING' ? 'rgba(16,185,129,0.25)' : trend === 'WORSENING' ? 'rgba(239,68,68,0.25)' : 'var(--border)'}`, padding: '20px 22px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 11, background: `${trendColor}18`, border: `1px solid ${trendColor}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendIcon size={20} color={trendColor} strokeWidth={2} />
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 3 }}>Overall Trend</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: trendColor }}>{trendLabel}</div>
              </div>
            </motion.div>

            <StatCard icon={Brain}    label="Total Analyses" value={reports.length} color="violet"  delay={1} />

            {latest && (
              <>
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}
                  className="glass-panel" style={{ padding: '20px 22px' }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Latest Dyslexia</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, color: latest.dyslexiaScore >= 70 ? 'var(--danger)' : latest.dyslexiaScore >= 45 ? 'var(--warning)' : 'var(--success)', lineHeight: 1 }}>
                    {latest.dyslexiaScore?.toFixed(1)}%
                  </div>
                  {dyslexiaDelta !== null && (
                    <div style={{ fontSize: 12, marginTop: 4, color: Number(dyslexiaDelta) < 0 ? 'var(--success)' : Number(dyslexiaDelta) > 0 ? 'var(--danger)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
                      {Number(dyslexiaDelta) < 0 ? <ArrowDownRight size={11} /> : Number(dyslexiaDelta) > 0 ? <ArrowUpRight size={11} /> : <Minus size={11} />}
                      {Math.abs(dyslexiaDelta)}% vs previous
                    </div>
                  )}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}
                  className="glass-panel" style={{ padding: '20px 22px' }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Latest Dysgraphia</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, color: latest.dysgraphiaScore >= 70 ? 'var(--danger)' : latest.dysgraphiaScore >= 45 ? 'var(--warning)' : 'var(--success)', lineHeight: 1 }}>
                    {latest.dysgraphiaScore?.toFixed(1)}%
                  </div>
                  {dysgraphiaDelta !== null && (
                    <div style={{ fontSize: 12, marginTop: 4, color: Number(dysgraphiaDelta) < 0 ? 'var(--success)' : Number(dysgraphiaDelta) > 0 ? 'var(--danger)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
                      {Number(dysgraphiaDelta) < 0 ? <ArrowDownRight size={11} /> : Number(dysgraphiaDelta) > 0 ? <ArrowUpRight size={11} /> : <Minus size={11} />}
                      {Math.abs(dysgraphiaDelta)}% vs previous
                    </div>
                  )}
                </motion.div>
              </>
            )}
          </div>

          {/* Line chart */}
          {chartData.length > 1 && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className="glass-panel" style={{ padding: '22px 24px', marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, marginBottom: 2 }}>Score History</h3>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Score trends over all {reports.length} analyses</p>
                </div>
                <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
                  {[['Dyslexia', 'var(--primary)'], ['Dysgraphia', 'var(--secondary)']].map(([n, c]) => (
                    <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
                      <span style={{ color: 'var(--text-muted)' }}>{n}</span>
                    </div>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={chartData}>
                  <defs>
                    <filter id="glow2"><feGaussianBlur stdDeviation="2.5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                  </defs>
                  <CartesianGrid stroke="rgba(139,92,246,0.06)" strokeDasharray="4 4" />
                  <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <ReferenceLine y={45} stroke="rgba(245,158,11,0.3)" strokeDasharray="6 3" label={{ value: 'Medium threshold', fill: '#475569', fontSize: 10, position: 'right' }} />
                  <ReferenceLine y={70} stroke="rgba(239,68,68,0.3)"  strokeDasharray="6 3" label={{ value: 'High threshold',   fill: '#475569', fontSize: 10, position: 'right' }} />
                  <Tooltip
                    contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                    formatter={v => [`${v}%`]}
                  />
                  <Line type="monotone" dataKey="Dyslexia"   stroke="#1a73e8" strokeWidth={2.5} dot={{ fill: '#1a73e8', r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} filter="url(#glow2)" />
                  <Line type="monotone" dataKey="Dysgraphia" stroke="#0891b2" strokeWidth={2.5} dot={{ fill: '#0891b2', r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} filter="url(#glow2)" />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Timeline */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="glass-panel" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700 }}>Report Timeline</h3>
            </div>
            <div style={{ padding: '24px' }}>
              {reports.map((r, i) => (
                <div key={r.reportId} style={{ display: 'flex', gap: 16, paddingBottom: i < reports.length - 1 ? 20 : 0 }}>
                  {/* Spine */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + i * 0.06, type: 'spring', damping: 15 }}
                      style={{
                        width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                        background: i === 0 ? 'var(--primary-dim)' : 'var(--bg-elevated)',
                        border: `2px solid ${i === 0 ? 'var(--primary)' : 'var(--border)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 12,
                        color: i === 0 ? 'var(--primary)' : 'var(--text-muted)',
                        boxShadow: i === 0 ? '0 0 12px var(--primary-glow)' : 'none',
                      }}
                    >
                      {reports.length - i}
                    </motion.div>
                    {i < reports.length - 1 && (
                      <div style={{ width: 2, flex: 1, minHeight: 20, background: 'var(--border)', margin: '6px 0' }} />
                    )}
                  </div>

                  <div style={{ flex: 1, paddingBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Calendar size={11} />
                        {r.createdAt ? format(new Date(r.createdAt), 'MMMM d, yyyy') : '—'}
                      </span>
                      <RiskBadge level={r.riskLevel} />
                      {i === 0 && <Badge color="blue" dot>Latest</Badge>}
                    </div>

                    <div style={{ display: 'flex', gap: 20, marginBottom: 8, fontSize: 13 }}>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        Dyslexia: <strong style={{ color: r.dyslexiaScore >= 70 ? 'var(--danger)' : r.dyslexiaScore >= 45 ? 'var(--warning)' : 'var(--success)' }}>
                          {r.dyslexiaScore?.toFixed(1)}%
                        </strong>
                      </span>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        Dysgraphia: <strong style={{ color: r.dysgraphiaScore >= 70 ? 'var(--danger)' : r.dysgraphiaScore >= 45 ? 'var(--warning)' : 'var(--success)' }}>
                          {r.dysgraphiaScore?.toFixed(1)}%
                        </strong>
                      </span>
                    </div>

                    {r.aiComment && (
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.65, background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '8px 12px' }}>
                        {r.aiComment.length > 140 ? r.aiComment.substring(0, 140) + '…' : r.aiComment}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </div>
  )
}
