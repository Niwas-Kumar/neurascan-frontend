import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Users, FileText, AlertTriangle, TrendingUp, Upload,
  Brain, Activity, Clock, ChevronRight, BarChart3, PieChart as PieChartIcon
} from 'lucide-react'
import { optimizedAnalysisAPI } from '../../services/optimizedApi'
import { useAuth } from '../../context/AuthContext'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip as ReTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'
import { format, formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'
import { Button, RiskBadge, Card } from '../../components/shared/UI'
import { NeuraScanLogo } from '../../components/shared/Logo'

// ════════════════════════════════════════════════════════════════
// DESIGN SYSTEM COLORS - Deep Indigo + Soft Teal
// ════════════════════════════════════════════════════════════════
const COLORS = {
  primary: '#312E81',
  primaryLight: '#4338CA',
  primaryLighter: '#6366F1',
  primaryBg: '#EEF2FF',

  secondary: '#14B8A6',
  secondaryDark: '#0D9488',
  secondaryLight: '#2DD4BF',
  secondaryBg: '#CCFBF1',

  success: '#059669',
  successBg: '#D1FAE5',
  warning: '#D97706',
  warningBg: '#FEF3C7',
  danger: '#B91C1C',
  dangerBg: '#FEE2E2',

  textPrimary: '#1E293B',
  textSecondary: '#334155',
  textMuted: '#64748B',
  textLight: '#94A3B8',

  bgBase: '#F8FAFC',
  bgSurface: '#FFFFFF',
  bgSubtle: '#F1F5F9',
  border: '#E2E8F0',
  borderStrong: '#CBD5E1',
}

// ════════════════════════════════════════════════════════════════
// CUSTOM TOOLTIP - Bespoke styled
// ════════════════════════════════════════════════════════════════
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: COLORS.bgSurface,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 10,
      padding: '12px 16px',
      fontSize: 13,
      boxShadow: '0 4px 16px rgba(15, 23, 42, 0.1)',
    }}>
      <p style={{
        color: COLORS.textMuted,
        marginBottom: 8,
        fontWeight: 500,
        fontSize: 12,
      }}>{label}</p>
      {payload.map(p => (
        <div key={p.name} style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 4,
        }}>
          <div style={{
            width: 10,
            height: 10,
            borderRadius: 3,
            background: p.color
          }} />
          <span style={{ color: COLORS.textSecondary, fontWeight: 500 }}>
            {p.name}:
          </span>
          <span style={{
            fontWeight: 700,
            color: COLORS.textPrimary,
            fontFamily: 'var(--font-display)'
          }}>
            {p.value?.toFixed(1)}%
          </span>
        </div>
      ))}
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// SKELETON LOADER - Shimmer effect
// ════════════════════════════════════════════════════════════════
const SkeletonBox = ({ height = 140, style = {} }) => (
  <div
    className="skeleton"
    style={{
      height,
      borderRadius: 12,
      ...style,
    }}
  />
)

const StatCardSkeleton = () => (
  <div style={{
    background: COLORS.bgSurface,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 12,
    padding: 24,
  }}>
    <div className="skeleton" style={{ width: 48, height: 48, borderRadius: 10, marginBottom: 16 }} />
    <div className="skeleton" style={{ width: '40%', height: 12, marginBottom: 12 }} />
    <div className="skeleton" style={{ width: '60%', height: 28 }} />
  </div>
)

// ════════════════════════════════════════════════════════════════
// STAT CARD COMPONENT - Bespoke Design (Mobile Responsive)
// ════════════════════════════════════════════════════════════════
const DashboardStatCard = ({ icon: Icon, label, value, color, delay = 0, subtitle }) => {
  const colorMap = {
    primary: { icon: COLORS.primary, bg: COLORS.primaryBg },
    secondary: { icon: COLORS.secondary, bg: COLORS.secondaryBg },
    warning: { icon: COLORS.warning, bg: COLORS.warningBg },
    danger: { icon: COLORS.danger, bg: COLORS.dangerBg },
    success: { icon: COLORS.success, bg: COLORS.successBg },
  }
  const c = colorMap[color] || colorMap.primary

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.08, duration: 0.4, ease: [0.2, 0, 0, 1] }}
      className="rounded-xl p-4 md:p-6 transition-all duration-200 cursor-default"
      style={{
        background: COLORS.bgSurface,
        border: `1px solid ${COLORS.border}`,
      }}
      whileHover={{
        y: -4,
        boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
        borderColor: COLORS.borderStrong,
      }}
    >
      <div className="flex justify-between items-start mb-3 md:mb-4">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center" style={{ background: c.bg }}>
          <Icon size={20} color={c.icon} strokeWidth={1.75} className="md:w-6 md:h-6" />
        </div>
      </div>
      <p className="text-[10px] md:text-xs uppercase tracking-wide font-semibold mb-1 md:mb-2" style={{
        color: COLORS.textMuted,
        letterSpacing: '0.05em',
      }}>
        {label}
      </p>
      <p className="text-xl md:text-[32px] font-bold leading-none" style={{
        color: COLORS.textPrimary,
        fontFamily: 'var(--font-display)',
      }}>
        {value}
      </p>
      {subtitle && (
        <p className="text-[10px] md:text-xs mt-1.5" style={{ color: COLORS.textLight }}>
          {subtitle}
        </p>
      )}
    </motion.div>
  )
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
  const [dashLoading, setDashLoading] = useState(true)
  const [reportsLoading, setReportsLoading] = useState(true)

  useEffect(() => {
    // Don't fetch if user is not available yet
    if (!user?.userId) {
      return
    }

    setLoading(true)
    setDashLoading(true)
    setReportsLoading(true)

    // Fetch dashboard data
    optimizedAnalysisAPI.getDashboard()
      .then(d => {
        setDash(d.data.data)
        if ((d.data.data?.studentsAtRisk || 0) > 0) {
          addNotification({
            type: 'warning',
            title: 'Attention Required',
            body: `${d.data.data.studentsAtRisk} student(s) flagged for follow-up assessment.`
          })
        }
      })
      .catch(err => {
        console.error('Dashboard error:', err)
        toast.error('Unable to load dashboard metrics')
      })
      .finally(() => {
        setDashLoading(false)
      })

    // Fetch reports data independently
    optimizedAnalysisAPI.getReports()
      .then(r => {
        setReports(r.data.data || [])
      })
      .catch(err => {
        console.error('Reports error:', err)
        toast.error('Unable to load recent reports')
      })
      .finally(() => {
        setReportsLoading(false)
        setLoading(false)
      })

  }, [user?.userId])

  const greeting = (() => {
    const h = new Date().getHours()
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
  })()

  // Chart data — last 8 reports reversed for chronological order
  const chartData = [...reports].reverse().slice(-8).map(r => ({
    date: format(new Date(r.uploadDate || r.createdAt), 'MMM d'),
    Dyslexia: +r.dyslexiaScore?.toFixed(1),
    Dysgraphia: +r.dysgraphiaScore?.toFixed(1),
  }))

  // Pie: risk distribution with realistic percentages
  const riskCounts = reports.reduce((acc, r) => {
    acc[r.riskLevel] = (acc[r.riskLevel] || 0) + 1
    return acc
  }, {})
  const totalReports = reports.length

  const pieData = [
    {
      name: 'Low Risk',
      value: riskCounts.LOW || 0,
      color: COLORS.success,
      percentage: totalReports ? ((riskCounts.LOW || 0) / totalReports * 100).toFixed(1) : 0
    },
    {
      name: 'Medium Risk',
      value: riskCounts.MEDIUM || 0,
      color: COLORS.warning,
      percentage: totalReports ? ((riskCounts.MEDIUM || 0) / totalReports * 100).toFixed(1) : 0
    },
    {
      name: 'High Risk',
      value: riskCounts.HIGH || 0,
      color: COLORS.danger,
      percentage: totalReports ? ((riskCounts.HIGH || 0) / totalReports * 100).toFixed(1) : 0
    },
  ].filter(d => d.value > 0)

  // ════════════════════════════════════════════════════════════════
  // FULL LOADING STATE
  // ════════════════════════════════════════════════════════════════
  if (!user?.userId || (loading && dashLoading && reportsLoading)) return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: COLORS.bgBase }}>
      {/* Header Skeleton */}
      <div className="mb-6 md:mb-10">
        <div className="skeleton w-48 md:w-72 h-7 md:h-8 mb-3" />
        <div className="skeleton w-64 md:w-80 h-4 md:h-5" />
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-6 md:mb-10">
        {[0, 1, 2, 3].map(i => <StatCardSkeleton key={i} />)}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <SkeletonBox height={320} />
        <SkeletonBox height={320} />
      </div>
    </div>
  )

  // ════════════════════════════════════════════════════════════════
  // MAIN RENDER
  // ════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: COLORS.bgBase }}>
      {/* ─── HEADER SECTION ─── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6 md:mb-10"
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-xl md:text-[28px] font-bold mb-2" style={{
              color: COLORS.textPrimary,
              letterSpacing: '-0.02em',
              fontFamily: 'var(--font-display)',
            }}>
              {greeting}, <span style={{ color: COLORS.primary }}>
                {user?.name?.split(' ')[0] || 'Teacher'}
              </span>
            </h1>
            <p className="text-sm md:text-[15px]" style={{
              color: COLORS.textMuted,
              lineHeight: 1.5,
            }}>
              Classroom risk overview for {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </p>
          </div>

          <Link to="/teacher/upload" className="self-start" style={{ textDecoration: 'none' }}>
            <Button
              variant="primary"
              size="lg"
              icon={<Upload size={18} />}
              className="w-full sm:w-auto min-h-[44px]"
              style={{
                background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
                boxShadow: '0 4px 16px rgba(49, 46, 129, 0.25)',
              }}
            >
              <span className="hidden sm:inline">Upload Handwriting Sample</span>
              <span className="sm:hidden">Upload Sample</span>
            </Button>
          </Link>
        </div>

        {/* ─── STATS CARDS ─── */}
        {dashLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
            {[0, 1, 2, 3].map(i => <StatCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
            <DashboardStatCard
              icon={Users}
              label="Total Students"
              value={dash?.totalStudents ?? 0}
              color="primary"
              delay={1}
              subtitle="Active in classroom"
            />
            <DashboardStatCard
              icon={FileText}
              label="Samples Analyzed"
              value={dash?.totalPapersUploaded ?? 0}
              color="secondary"
              delay={2}
              subtitle="Handwriting assessments"
            />
            <DashboardStatCard
              icon={AlertTriangle}
              label="Requires Attention"
              value={dash?.studentsAtRisk ?? 0}
              color="danger"
              delay={3}
              subtitle="Flagged for follow-up"
            />
            <DashboardStatCard
              icon={Brain}
              label="Avg. Dyslexia Score"
              value={`${dash?.averageDyslexiaScore?.toFixed(1) ?? 0}%`}
              color="primary"
              delay={4}
              subtitle="Classroom average"
            />
          </div>
        )}
      </motion.div>

      {/* ─── CHARTS SECTION ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-10"
      >
        {/* Trend Chart */}
        <div className="p-4 md:p-7 rounded-xl" style={{
          background: COLORS.bgSurface,
          border: `1px solid ${COLORS.border}`,
        }}>
          <div className="flex items-center gap-2.5 mb-4 md:mb-6">
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center" style={{
              background: COLORS.primaryBg,
            }}>
              <TrendingUp size={16} color={COLORS.primary} />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-semibold" style={{
                color: COLORS.textPrimary,
                fontFamily: 'var(--font-display)',
              }}>
                Analysis Trend
              </h3>
              <p className="text-xs" style={{ color: COLORS.textMuted }}>
                Recent assessment scores
              </p>
            </div>
          </div>

          {reportsLoading ? (
            <SkeletonBox height={220} />
          ) : chartData.length === 0 ? (
            <div className="h-48 md:h-[280px] flex flex-col items-center justify-center rounded-lg" style={{
              color: COLORS.textMuted,
              background: COLORS.bgSubtle,
            }}>
              <BarChart3 size={36} strokeWidth={1.5} style={{ marginBottom: 12, opacity: 0.5 }} />
              <p className="text-sm font-medium">No data yet</p>
              <p className="text-xs">Upload samples to see trends</p>
            </div>
          ) : (
            <>
              <div className="w-full overflow-x-auto">
                <div className="min-w-[300px]">
                  <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="dyslexiaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={COLORS.primary} stopOpacity={0.25} />
                          <stop offset="100%" stopColor={COLORS.primary} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="dysgraphiaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={COLORS.secondary} stopOpacity={0.25} />
                          <stop offset="100%" stopColor={COLORS.secondary} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} vertical={false} />
                      <XAxis
                        dataKey="date"
                        stroke={COLORS.textLight}
                        style={{ fontSize: 11 }}
                        tickLine={false}
                        axisLine={{ stroke: COLORS.border }}
                      />
                      <YAxis
                        stroke={COLORS.textLight}
                        style={{ fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => `${v}%`}
                      />
                      <ReTooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        name="Dyslexia"
                        dataKey="Dyslexia"
                        stroke={COLORS.primary}
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#dyslexiaGrad)"
                        dot={{ fill: COLORS.primary, strokeWidth: 0, r: 3 }}
                        activeDot={{ r: 5, stroke: COLORS.bgSurface, strokeWidth: 2 }}
                      />
                      <Area
                        type="monotone"
                        name="Dysgraphia"
                        dataKey="Dysgraphia"
                        stroke={COLORS.secondary}
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#dysgraphiaGrad)"
                        dot={{ fill: COLORS.secondary, strokeWidth: 0, r: 3 }}
                        activeDot={{ r: 5, stroke: COLORS.bgSurface, strokeWidth: 2 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Legend */}
              <div className="flex justify-center gap-4 md:gap-6 mt-3 md:mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ background: COLORS.primary }} />
                  <span className="text-xs font-medium" style={{ color: COLORS.textMuted }}>Dyslexia</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ background: COLORS.secondary }} />
                  <span className="text-xs font-medium" style={{ color: COLORS.textMuted }}>Dysgraphia</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Risk Distribution */}
        <div className="p-4 md:p-7 rounded-xl" style={{
          background: COLORS.bgSurface,
          border: `1px solid ${COLORS.border}`,
        }}>
          <div className="flex items-center gap-2.5 mb-4 md:mb-6">
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center" style={{
              background: COLORS.secondaryBg,
            }}>
              <PieChartIcon size={16} color={COLORS.secondary} />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-semibold" style={{
                color: COLORS.textPrimary,
                fontFamily: 'var(--font-display)',
              }}>
                Risk Distribution
              </h3>
              <p className="text-xs" style={{ color: COLORS.textMuted }}>
                Classroom breakdown
              </p>
            </div>
          </div>

          {dashLoading ? (
            <SkeletonBox height={220} />
          ) : pieData.length === 0 ? (
            <div className="h-48 md:h-[280px] flex flex-col items-center justify-center rounded-lg" style={{
              color: COLORS.textMuted,
              background: COLORS.bgSubtle,
            }}>
              <PieChartIcon size={36} strokeWidth={1.5} style={{ marginBottom: 12, opacity: 0.5 }} />
              <p className="text-sm font-medium">No assessments</p>
              <p className="text-xs">Data will appear here</p>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
              <div className="w-full md:w-1/2 overflow-x-auto">
                <div className="min-w-[180px]">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
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
              </div>

              {/* Custom Legend */}
              <div className="flex-1 w-full">
                {pieData.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2.5 md:py-3"
                    style={{
                      borderBottom: i < pieData.length - 1 ? `1px solid ${COLORS.border}` : 'none',
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded" style={{ background: item.color }} />
                      <span className="text-xs md:text-sm font-medium" style={{ color: COLORS.textSecondary }}>
                        {item.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm md:text-base font-bold" style={{
                        color: COLORS.textPrimary,
                        fontFamily: 'var(--font-display)',
                      }}>
                        {item.value}
                      </span>
                      <span className="text-xs ml-1.5" style={{ color: COLORS.textMuted }}>
                        ({item.percentage}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* ─── RECENT REPORTS SECTION ─── */}
      {reports.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 md:mb-5">
            <h3 className="text-base md:text-lg font-semibold" style={{
              color: COLORS.textPrimary,
              fontFamily: 'var(--font-display)',
            }}>
              Recent Assessments
            </h3>
            <Button
              variant="outline"
              size="sm"
              iconRight={<ChevronRight size={16} />}
              className="self-start min-h-[40px]"
              onClick={() => navigate('/teacher/reports')}
            >
              View All Reports
            </Button>
          </div>

          <div className="flex flex-col gap-2 md:gap-3">
            {reports.slice(0, 5).map((r, index) => (
              <motion.div
                key={r.reportId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                onClick={() => navigate(`/teacher/reports?id=${r.reportId}`)}
                className="rounded-lg p-3 md:p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 cursor-pointer transition-all duration-150"
                style={{
                  background: COLORS.bgSurface,
                  border: `1px solid ${COLORS.border}`,
                }}
                whileHover={{
                  y: -2,
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.06)',
                  borderColor: COLORS.primary,
                }}
              >
                <div>
                  <p className="font-semibold text-sm md:text-[15px] mb-1" style={{ color: COLORS.textPrimary }}>
                    {r.studentName}
                  </p>
                  <p className="text-xs flex items-center gap-1.5" style={{ color: COLORS.textMuted }}>
                    <Clock size={12} />
                    {formatDistanceToNow(new Date(r.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <div className="flex gap-2 md:gap-3 items-center">
                  <div className="flex flex-col gap-1">
                    <div className="px-2.5 py-1 rounded text-[11px] font-bold" style={{
                      background: COLORS.primaryBg,
                      color: COLORS.primary,
                      fontFamily: 'var(--font-display)',
                    }}>
                      D: {r.dyslexiaScore.toFixed(1)}%
                    </div>
                    <div className="px-2.5 py-1 rounded text-[11px] font-bold" style={{
                      background: COLORS.secondaryBg,
                      color: COLORS.secondaryDark,
                      fontFamily: 'var(--font-display)',
                    }}>
                      G: {r.dysgraphiaScore.toFixed(1)}%
                    </div>
                  </div>
                  <RiskBadge level={r.riskLevel} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
