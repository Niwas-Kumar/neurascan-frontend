import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brain, AlertCircle, CheckCircle, ArrowRight, Calendar, Zap } from 'lucide-react'
import { optimizedAnalysisAPI } from '../../services/optimizedApi'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { format, formatDistanceToNow } from 'date-fns'

// ════════════════════════════════════════════════════════════════
// DESIGN SYSTEM COLORS
// ════════════════════════════════════════════════════════════════
const COLORS = {
  primary: '#312E81',
  primaryLight: '#4338CA',
  primaryBg: '#EEF2FF',
  secondary: '#14B8A6',
  secondaryBg: '#CCFBF1',
  riskHigh: '#B91C1C',
  riskHighBg: '#FEF2F2',
  riskMedium: '#B45309',
  riskMediumBg: '#FFFBEB',
  riskLow: '#047857',
  riskLowBg: '#ECFDF5',
  textPrimary: '#1E293B',
  textSecondary: '#475569',
  textMuted: '#64748B',
  bgSurface: '#FFFFFF',
  bgSubtle: '#F1F5F9',
  border: '#E2E8F0',
}

const StatCard = ({ icon: Icon, label, value, color = 'primary', delay = 0, sub }) => {
  const colorMap = {
    primary: { bg: COLORS.primaryBg, icon: COLORS.primary, border: `${COLORS.primary}30` },
    secondary: { bg: COLORS.secondaryBg, icon: COLORS.secondary, border: `${COLORS.secondary}30` },
    success: { bg: COLORS.riskLowBg, icon: COLORS.riskLow, border: `${COLORS.riskLow}30` },
    warning: { bg: COLORS.riskMediumBg, icon: COLORS.riskMedium, border: `${COLORS.riskMedium}30` },
    danger: { bg: COLORS.riskHighBg, icon: COLORS.riskHigh, border: `${COLORS.riskHigh}30` },
  }
  const c = colorMap[color] || colorMap.primary

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      style={{
        background: COLORS.bgSurface,
        border: `1px solid ${c.border}`,
        borderRadius: 16,
        padding: '20px 22px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12, background: c.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon size={22} color={c.icon} strokeWidth={2} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: COLORS.textMuted, fontWeight: 500, marginBottom: 4 }}>{label}</div>
          <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 24, fontWeight: 800, color: COLORS.textPrimary }}>{value}</div>
          {sub && <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>{sub}</div>}
        </div>
      </div>
    </motion.div>
  )
}

const ScoreBar = ({ label, value }) => {
  const percentage = Math.min(Math.max(value || 0, 0), 100)
  const getColor = (v) => v >= 70 ? COLORS.riskHigh : v >= 45 ? COLORS.riskMedium : COLORS.riskLow
  const barColor = getColor(percentage)

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 14, color: COLORS.textSecondary, fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 16, fontWeight: 700, color: barColor }}>{percentage.toFixed(1)}%</span>
      </div>
      <div style={{ height: 10, background: COLORS.bgSubtle, borderRadius: 5, overflow: 'hidden', border: `1px solid ${COLORS.border}` }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ height: '100%', background: barColor, borderRadius: 5 }}
        />
      </div>
    </div>
  )
}

const RiskBadge = ({ level }) => {
  const styles = {
    LOW: { bg: COLORS.riskLow }, MEDIUM: { bg: COLORS.riskMedium }, HIGH: { bg: COLORS.riskHigh },
  }
  const s = styles[level] || styles.LOW
  return (
    <span style={{ background: s.bg, color: 'white', padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>{level}</span>
  )
}

const SkeletonCard = ({ delay = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    style={{ background: COLORS.bgSurface, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 20 }}>
    <div style={{ background: COLORS.bgSubtle, height: 14, borderRadius: 6, marginBottom: 12, animation: 'shimmer 1.5s infinite' }} />
    <div style={{ background: COLORS.bgSubtle, height: 28, borderRadius: 6, width: '60%', animation: 'shimmer 1.5s infinite' }} />
    <style>{`@keyframes shimmer { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }`}</style>
  </motion.div>
)

export default function ParentDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [noData, setNoData] = useState(false)
  const [noStudentId, setNoStudentId] = useState(false)

  useEffect(() => {
    const sid = user?.studentId || localStorage.getItem('ns_studentId')
    if (!sid) { setNoStudentId(true); setNoData(true); setLoading(false); return }
    setNoStudentId(false)
    optimizedAnalysisAPI.getStudentReport(sid)
      .then(res => setReport(res.data.data))
      .catch(err => {
        const errorMsg = err.response?.data?.message || err.message || 'Failed to load report'
        if (errorMsg.includes('Student ID not set')) { setNoStudentId(true); setNoData(true) }
        else if (err.response?.status === 404 || err.response?.status === 403) setNoData(true)
        else if (err.response?.status === 401) toast.error('Session expired. Please log in again.')
        else toast.error(errorMsg)
      })
      .finally(() => setLoading(false))
  }, [user?.userId, user?.studentId])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  if (loading) return (
    <div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 32, fontWeight: 800, color: COLORS.textPrimary, marginBottom: 8 }}>{greeting}</h1>
        <p style={{ fontSize: 15, color: COLORS.textMuted }}>Loading your child's assessment data...</p>
      </motion.div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        {[0, 1, 2, 3].map(i => <SkeletonCard key={i} delay={i * 0.1} />)}
      </div>
    </div>
  )

  const isAtRisk = report?.riskLevel === 'HIGH' || report?.riskLevel === 'MEDIUM'
  const riskColorMap = { HIGH: COLORS.riskHigh, MEDIUM: COLORS.riskMedium, LOW: COLORS.riskLow }
  const riskColor = riskColorMap[report?.riskLevel] || COLORS.riskLow

  return (
    <div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 32, fontWeight: 800, color: COLORS.textPrimary, marginBottom: 8 }}>
          {greeting},{' '}
          <span style={{ background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`, backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user?.name?.split(' ')[0]}</span>
        </h1>
        {report && <p style={{ fontSize: 15, color: COLORS.textSecondary }}>Latest assessment for <strong>{report.studentName}</strong> in {report.className}</p>}
      </motion.div>

      {(noData || !report) ? (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: 560 }}>
          <div style={{ background: COLORS.bgSurface, border: `1px solid ${COLORS.border}`, borderRadius: 20, overflow: 'hidden' }}>
            <div style={{ height: 4, background: `linear-gradient(90deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)` }} />
            <div style={{ padding: '56px 40px', textAlign: 'center' }}>
              <div style={{ width: 80, height: 80, borderRadius: 20, background: COLORS.primaryBg, border: `1px solid ${COLORS.primary}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <Brain size={36} color={COLORS.primary} strokeWidth={1.5} />
              </div>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 24, fontWeight: 700, marginBottom: 12, color: COLORS.textPrimary }}>{noStudentId ? "Set Up Your Child's Account" : 'No Assessments Yet'}</h3>
              <p style={{ color: COLORS.textSecondary, fontSize: 15, lineHeight: 1.75, marginBottom: 32 }}>
                {noStudentId ? "To view your child's progress and AI analysis reports, you need to link their student ID in your profile settings." : "Your child's teacher hasn't uploaded an assessment yet. Once they do, the AI analysis results will appear here automatically."}
              </p>
              {noStudentId && (
                <div style={{ background: COLORS.primaryBg, border: `1px solid ${COLORS.primary}20`, borderRadius: 14, padding: '18px 20px', marginBottom: 28, fontSize: 14, color: COLORS.textSecondary, textAlign: 'left' }}>
                  <div style={{ marginBottom: 10, fontWeight: 600, color: COLORS.primary }}>How to get your child's Student ID:</div>
                  <ul style={{ margin: 0, paddingLeft: 20, color: COLORS.textMuted, lineHeight: 1.8 }}>
                    <li>Ask your child's teacher directly</li>
                    <li>Check the welcome email from school</li>
                    <li>Look in your child's assignment notebook</li>
                  </ul>
                </div>
              )}
              <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} onClick={() => navigate(noStudentId ? '/settings?tab=profile' : '/parent/progress')}
                style={{ background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`, color: 'white', border: 'none', padding: '14px 28px', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 14px rgba(49, 46, 129, 0.25)', display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: "'Inter', sans-serif" }}>
                {noStudentId ? 'Go to Settings' : 'View Progress History'}<ArrowRight size={18} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      ) : (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
            <StatCard icon={isAtRisk ? AlertCircle : CheckCircle} label={isAtRisk ? 'Risk Level' : 'Status'} value={report.riskLevel} color={report.riskLevel === 'HIGH' ? 'danger' : report.riskLevel === 'MEDIUM' ? 'warning' : 'success'} delay={0} />
            <StatCard icon={Brain} label="Dyslexia Indicator" value={`${report.dyslexiaScore?.toFixed(1)}%`} color={report.dyslexiaScore >= 70 ? 'danger' : report.dyslexiaScore >= 45 ? 'warning' : 'success'} delay={0.08} />
            <StatCard icon={Zap} label="Dysgraphia Indicator" value={`${report.dysgraphiaScore?.toFixed(1)}%`} color={report.dysgraphiaScore >= 70 ? 'danger' : report.dysgraphiaScore >= 45 ? 'warning' : 'success'} delay={0.16} />
            <StatCard icon={Calendar} label="Last Assessment" value={report.createdAt ? format(new Date(report.createdAt), 'MMM d') : '—'} color="primary" delay={0.24} sub={report.createdAt ? formatDistanceToNow(new Date(report.createdAt), { addSuffix: true }) : ''} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }} style={{ background: COLORS.bgSurface, border: `1px solid ${isAtRisk ? `${riskColor}40` : COLORS.border}`, borderRadius: 20, overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: `1px solid ${COLORS.border}`, background: isAtRisk ? `linear-gradient(135deg, ${riskColor}08 0%, transparent 60%)` : COLORS.bgSubtle, display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: isAtRisk ? `${riskColor}15` : COLORS.riskLowBg, border: `1px solid ${isAtRisk ? `${riskColor}30` : `${COLORS.riskLow}30`}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {isAtRisk ? <AlertCircle size={22} color={riskColor} /> : <CheckCircle size={22} color={COLORS.riskLow} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 16, color: COLORS.textPrimary }}>{report.studentName}</div>
                  <div style={{ fontSize: 13, color: COLORS.textMuted }}>{report.className}</div>
                </div>
                <RiskBadge level={report.riskLevel} />
              </div>
              <div style={{ padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: COLORS.textMuted, marginBottom: 24 }}><Calendar size={14} />Analyzed {report.createdAt ? format(new Date(report.createdAt), "MMMM d, yyyy 'at' h:mm a") : '—'}</div>
                <ScoreBar label="Dyslexia Indicator" value={report.dyslexiaScore} />
                <ScoreBar label="Dysgraphia Indicator" value={report.dysgraphiaScore} />
                {isAtRisk && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={{ marginTop: 20, padding: '16px 18px', background: COLORS.riskMediumBg, border: `1px solid ${COLORS.riskMedium}30`, borderRadius: 12, fontSize: 14, color: COLORS.textSecondary, lineHeight: 1.7 }}>
                    <strong style={{ color: COLORS.riskMedium }}>Recommended action:</strong> Schedule a consultation with a learning specialist. Early intervention significantly improves outcomes.
                  </motion.div>
                )}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ background: COLORS.bgSurface, border: `1px solid ${COLORS.border}`, borderRadius: 20, overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: COLORS.primaryBg, border: `1px solid ${COLORS.primary}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Brain size={20} color={COLORS.primary} strokeWidth={2} /></div>
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 16, color: COLORS.textPrimary }}>AI Assessment Summary</div>
              </div>
              <div style={{ padding: 24 }}>
                <p style={{ fontSize: 14, color: COLORS.textSecondary, lineHeight: 1.85, marginBottom: 24 }}>{report.aiComment}</p>
                <div style={{ padding: '16px 18px', background: COLORS.bgSubtle, border: `1px solid ${COLORS.border}`, borderRadius: 12, fontSize: 13, color: COLORS.textSecondary, lineHeight: 1.7 }}><strong style={{ color: COLORS.textPrimary }}>Note:</strong> This AI assessment is a screening tool, not a clinical diagnosis. Always consult a qualified educational psychologist for a comprehensive evaluation.</div>
                <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} onClick={() => navigate('/parent/progress')} style={{ width: '100%', marginTop: 20, padding: '14px 16px', background: COLORS.bgSurface, border: `1px solid ${COLORS.border}`, color: COLORS.primary, borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s ease', fontFamily: "'Inter', sans-serif" }}>View Full Progress History<ArrowRight size={16} /></motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  )
}
