import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, Calendar, Brain, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { optimizedAnalysisAPI } from '../../services/optimizedApi'
import { useAuth } from '../../context/AuthContext'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

// ════════════════════════════════════════════════════════════════
// DESIGN SYSTEM COLORS
// ════════════════════════════════════════════════════════════════
const COLORS = {
  primary: '#312E81',
  primaryLight: '#4338CA',
  primaryBg: '#EEF2FF',
  secondary: '#14B8A6',
  secondaryBg: '#CCFBF1',

  // Chart colors (per design system)
  chartDyslexia: '#14B8A6',    // Soft Teal for Dyslexia
  chartDysgraphia: '#6366F1',  // Indigo for Dysgraphia

  riskHigh: '#B91C1C',
  riskHighBg: '#FEF2F2',
  riskMedium: '#B45309',
  riskMediumBg: '#FFFBEB',
  riskLow: '#047857',
  riskLowBg: '#ECFDF5',
  textPrimary: '#1E293B',
  textSecondary: '#475569',
  textMuted: '#64748B',
  textLight: '#94A3B8',
  bgSurface: '#FFFFFF',
  bgSubtle: '#F1F5F9',
  border: '#E2E8F0',
}

const PageHeader = ({ title, subtitle }) => (
  <div style={{ marginBottom: 32 }}>
    <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 28, fontWeight: 800, marginBottom: 8, color: COLORS.textPrimary, letterSpacing: '-0.02em' }}>{title}</h1>
    {subtitle && <p style={{ fontSize: 15, color: COLORS.textSecondary, lineHeight: 1.6 }}>{subtitle}</p>}
  </div>
)

const RiskBadge = ({ level }) => {
  const styles = { LOW: { bg: COLORS.riskLowBg, text: COLORS.riskLow }, MEDIUM: { bg: COLORS.riskMediumBg, text: COLORS.riskMedium }, HIGH: { bg: COLORS.riskHighBg, text: COLORS.riskHigh } }
  const s = styles[level] || styles.LOW
  return <span style={{ display: 'inline-block', padding: '5px 12px', borderRadius: 100, fontSize: 12, fontWeight: 600, background: s.bg, color: s.text }}>{level}</span>
}

const SkeletonCard = ({ rows = 4 }) => (
  <div style={{ background: COLORS.bgSurface, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: '22px 24px' }}>
    {Array(rows).fill(0).map((_, i) => (
      <div key={i} style={{ height: i === 0 ? 24 : 14, background: `linear-gradient(90deg, ${COLORS.bgSubtle} 25%, ${COLORS.bgSurface} 50%, ${COLORS.bgSubtle} 75%)`, backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', borderRadius: 8, marginBottom: i < rows - 1 ? 12 : 0 }} />
    ))}
    <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
  </div>
)

const StatCard = ({ icon: Icon, label, value, color = 'primary', delay = 0 }) => {
  const colorMap = { primary: { bg: COLORS.primaryBg, icon: COLORS.primary }, secondary: { bg: COLORS.secondaryBg, icon: COLORS.secondary }, success: { bg: COLORS.riskLowBg, icon: COLORS.riskLow }, warning: { bg: COLORS.riskMediumBg, icon: COLORS.riskMedium }, danger: { bg: COLORS.riskHighBg, icon: COLORS.riskHigh } }
  const c = colorMap[color] || colorMap.primary
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: delay * 0.08 }} style={{ background: COLORS.bgSurface, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: '22px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={22} color={c.icon} strokeWidth={2} /></div>
        <div style={{ flex: 1 }}><div style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 4 }}>{label}</div><div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 26, fontWeight: 800, color: COLORS.textPrimary }}>{value}</div></div>
      </div>
    </motion.div>
  )
}

const Badge = ({ children, color = 'primary' }) => {
  const colors = { primary: { bg: COLORS.primaryBg, text: COLORS.primary }, secondary: { bg: COLORS.secondaryBg, text: COLORS.secondary } }
  const c = colors[color] || colors.primary
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 100, fontSize: 12, fontWeight: 600, background: c.bg, color: c.text }}>{children}</span>
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: COLORS.bgSurface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: '12px 16px', fontSize: 13, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
      {payload.map(p => (
        <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <div style={{ width: 10, height: 10, borderRadius: 3, background: p.color }} />
          <span style={{ color: COLORS.textSecondary }}>{p.name}:</span>
          <span style={{ fontWeight: 700, color: COLORS.textPrimary }}>{p.value?.toFixed(1)}%</span>
        </div>
      ))}
    </div>
  )
}

export default function ProgressPage() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [noData, setNoData] = useState(false)

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
    <div><PageHeader title="Progress Tracker" subtitle="Loading progress data..." />
      <div style={{ display: 'grid', gap: 20 }}><SkeletonCard rows={8} /><SkeletonCard rows={6} /></div>
    </div>
  )

  const reports = data?.reports || []
  const chartData = [...reports].reverse().map(r => ({ date: format(new Date(r.createdAt || r.uploadDate), 'MMM d'), Dyslexia: +r.dyslexiaScore?.toFixed(1), Dysgraphia: +r.dysgraphiaScore?.toFixed(1) }))
  const trend = data?.trend || 'INSUFFICIENT_DATA'
  const TrendIcon = trend === 'IMPROVING' ? TrendingDown : trend === 'WORSENING' ? TrendingUp : Minus
  const trendColor = trend === 'IMPROVING' ? COLORS.riskLow : trend === 'WORSENING' ? COLORS.riskHigh : COLORS.textMuted
  const trendLabel = { IMPROVING: 'Improving', WORSENING: 'Needs attention', STABLE: 'Stable', INSUFFICIENT_DATA: 'Not enough data' }[trend] || '—'
  const latest = reports[0], previous = reports[1]
  const dyslexiaDelta = latest && previous ? (latest.dyslexiaScore - previous.dyslexiaScore).toFixed(1) : null
  const dysgraphiaDelta = latest && previous ? (latest.dysgraphiaScore - previous.dysgraphiaScore).toFixed(1) : null

  return (
    <div>
      <PageHeader title="Progress Tracker" subtitle={data?.studentName ? `Tracking ${data.studentName}'s learning journey over ${reports.length} assessments.` : 'Learning progress over time.'} />

      {noData || reports.length === 0 ? (
        <div style={{ background: COLORS.bgSurface, border: `1px solid ${COLORS.border}`, borderRadius: 16, maxWidth: 520 }}>
          <div style={{ padding: '56px 32px', textAlign: 'center' }}>
            <TrendingUp size={48} color={COLORS.textLight} strokeWidth={1.25} style={{ marginBottom: 20 }} />
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 10, color: COLORS.textPrimary }}>No Progress Data Yet</h3>
            <p style={{ color: COLORS.textSecondary, fontSize: 14, lineHeight: 1.75 }}>Multiple assessments are needed to track progress. Charts appear once at least 2 assessments have been completed.</p>
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ background: COLORS.bgSurface, border: `1px solid ${trend === 'IMPROVING' ? `${COLORS.riskLow}40` : trend === 'WORSENING' ? `${COLORS.riskHigh}40` : COLORS.border}`, borderRadius: 16, padding: '22px 24px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: `${trendColor}18`, border: `1px solid ${trendColor}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><TrendIcon size={22} color={trendColor} strokeWidth={2} /></div>
              <div><div style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 4 }}>Overall Trend</div><div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 18, color: trendColor }}>{trendLabel}</div></div>
            </motion.div>
            <StatCard icon={Brain} label="Total Assessments" value={reports.length} color="secondary" delay={1} />
            {latest && (
              <>
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} style={{ background: COLORS.bgSurface, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: '22px 24px' }}>
                  <div style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 6 }}>Latest Dyslexia</div>
                  <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 28, fontWeight: 800, color: latest.dyslexiaScore >= 70 ? COLORS.riskHigh : latest.dyslexiaScore >= 45 ? COLORS.riskMedium : COLORS.riskLow, lineHeight: 1 }}>{latest.dyslexiaScore?.toFixed(1)}%</div>
                  {dyslexiaDelta !== null && <div style={{ fontSize: 12, marginTop: 6, color: Number(dyslexiaDelta) < 0 ? COLORS.riskLow : Number(dyslexiaDelta) > 0 ? COLORS.riskHigh : COLORS.textMuted, display: 'flex', alignItems: 'center', gap: 3 }}>{Number(dyslexiaDelta) < 0 ? <ArrowDownRight size={12} /> : Number(dyslexiaDelta) > 0 ? <ArrowUpRight size={12} /> : <Minus size={12} />}{Math.abs(dyslexiaDelta)}% vs previous</div>}
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }} style={{ background: COLORS.bgSurface, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: '22px 24px' }}>
                  <div style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 6 }}>Latest Dysgraphia</div>
                  <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 28, fontWeight: 800, color: latest.dysgraphiaScore >= 70 ? COLORS.riskHigh : latest.dysgraphiaScore >= 45 ? COLORS.riskMedium : COLORS.riskLow, lineHeight: 1 }}>{latest.dysgraphiaScore?.toFixed(1)}%</div>
                  {dysgraphiaDelta !== null && <div style={{ fontSize: 12, marginTop: 6, color: Number(dysgraphiaDelta) < 0 ? COLORS.riskLow : Number(dysgraphiaDelta) > 0 ? COLORS.riskHigh : COLORS.textMuted, display: 'flex', alignItems: 'center', gap: 3 }}>{Number(dysgraphiaDelta) < 0 ? <ArrowDownRight size={12} /> : Number(dysgraphiaDelta) > 0 ? <ArrowUpRight size={12} /> : <Minus size={12} />}{Math.abs(dysgraphiaDelta)}% vs previous</div>}
                </motion.div>
              </>
            )}
          </div>

          {chartData.length > 1 && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} style={{ background: COLORS.bgSurface, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: '24px', marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div><h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 4, color: COLORS.textPrimary }}>Score History</h3><p style={{ fontSize: 13, color: COLORS.textMuted }}>Trends over all {reports.length} assessments</p></div>
                <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>{[['Dyslexia', COLORS.chartDyslexia], ['Dysgraphia', COLORS.chartDysgraphia]].map(([n, c]) => (<div key={n} style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 10, height: 10, borderRadius: 3, background: c }} /><span style={{ color: COLORS.textMuted }}>{n}</span></div>))}</div>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={chartData}>
                  <CartesianGrid stroke={`${COLORS.chartDyslexia}10`} strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: COLORS.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: COLORS.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <ReferenceLine y={45} stroke={`${COLORS.riskMedium}40`} strokeDasharray="6 3" />
                  <ReferenceLine y={70} stroke={`${COLORS.riskHigh}40`} strokeDasharray="6 3" />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="Dyslexia" stroke={COLORS.chartDyslexia} strokeWidth={2.5} dot={{ fill: COLORS.chartDyslexia, r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: COLORS.chartDyslexia }} />
                  <Line type="monotone" dataKey="Dysgraphia" stroke={COLORS.chartDysgraphia} strokeWidth={2.5} dot={{ fill: COLORS.chartDysgraphia, r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: COLORS.chartDysgraphia }} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={{ background: COLORS.bgSurface, border: `1px solid ${COLORS.border}`, borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${COLORS.border}` }}><h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, fontWeight: 700, color: COLORS.textPrimary }}>Assessment Timeline</h3></div>
            <div style={{ padding: 24 }}>
              {reports.map((r, i) => (
                <div key={r.reportId} style={{ display: 'flex', gap: 16, paddingBottom: i < reports.length - 1 ? 24 : 0 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + i * 0.06, type: 'spring', damping: 15 }} style={{ width: 38, height: 38, borderRadius: '50%', flexShrink: 0, background: i === 0 ? COLORS.primaryBg : COLORS.bgSubtle, border: `2px solid ${i === 0 ? COLORS.primary : COLORS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 13, color: i === 0 ? COLORS.primary : COLORS.textMuted, boxShadow: i === 0 ? '0 4px 14px rgba(49, 46, 129, 0.2)' : 'none' }}>{reports.length - i}</motion.div>
                    {i < reports.length - 1 && <div style={{ width: 2, flex: 1, minHeight: 24, background: COLORS.border, margin: '8px 0' }} />}
                  </div>
                  <div style={{ flex: 1, paddingBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 13, color: COLORS.textMuted, display: 'flex', alignItems: 'center', gap: 5 }}><Calendar size={12} />{r.createdAt ? format(new Date(r.createdAt), 'MMMM d, yyyy') : '—'}</span>
                      <RiskBadge level={r.riskLevel} />
                      {i === 0 && <Badge color="primary">Latest</Badge>}
                    </div>
                    <div style={{ display: 'flex', gap: 24, marginBottom: 10, fontSize: 14 }}>
                      <span style={{ color: COLORS.textSecondary }}>Dyslexia: <strong style={{ color: r.dyslexiaScore >= 70 ? COLORS.riskHigh : r.dyslexiaScore >= 45 ? COLORS.riskMedium : COLORS.riskLow }}>{r.dyslexiaScore?.toFixed(1)}%</strong></span>
                      <span style={{ color: COLORS.textSecondary }}>Dysgraphia: <strong style={{ color: r.dysgraphiaScore >= 70 ? COLORS.riskHigh : r.dysgraphiaScore >= 45 ? COLORS.riskMedium : COLORS.riskLow }}>{r.dysgraphiaScore?.toFixed(1)}%</strong></span>
                    </div>
                    {r.aiComment && <p style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.7, background: COLORS.bgSubtle, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: '10px 14px' }}>{r.aiComment.length > 160 ? r.aiComment.substring(0, 160) + '...' : r.aiComment}</p>}
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
