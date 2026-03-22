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
// STAT CARD COMPONENT - Bespoke Design
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
      style={{
        background: COLORS.bgSurface,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 12,
        padding: 24,
        transition: 'all 0.2s ease',
        cursor: 'default',
      }}
      whileHover={{
        y: -4,
        boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
        borderColor: COLORS.borderStrong,
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
      }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 10,
          background: c.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Icon size={24} color={c.icon} strokeWidth={1.75} />
        </div>
      </div>
      <p style={{
        fontSize: 12,
        color: COLORS.textMuted,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: 8,
      }}>
        {label}
      </p>
      <p style={{
        fontSize: 32,
        fontWeight: 700,
        color: COLORS.textPrimary,
        fontFamily: 'var(--font-display)',
        lineHeight: 1,
      }}>
        {value}
      </p>
      {subtitle && (
        <p style={{
          fontSize: 12,
          color: COLORS.textLight,
          marginTop: 6,
        }}>
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
    <div style={{
      minHeight: '100vh',
      background: COLORS.bgBase,
      padding: '32px 40px',
    }}>
      {/* Header Skeleton */}
      <div style={{ marginBottom: 40 }}>
        <div className="skeleton" style={{ width: 280, height: 32, marginBottom: 12 }} />
        <div className="skeleton" style={{ width: 360, height: 18 }} />
      </div>

      {/* Stats Skeleton */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 20,
        marginBottom: 40,
      }}>
        {[0, 1, 2, 3].map(i => <StatCardSkeleton key={i} />)}
      </div>

      {/* Charts Skeleton */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))',
        gap: 24,
      }}>
        <SkeletonBox height={380} />
        <SkeletonBox height={380} />
      </div>
    </div>
  )

  // ════════════════════════════════════════════════════════════════
  // MAIN RENDER
  // ════════════════════════════════════════════════════════════════
  return (
    <div style={{
      minHeight: '100vh',
      background: COLORS.bgBase,
      padding: '32px 40px',
    }}>
      {/* ─── HEADER SECTION ─── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ marginBottom: 40 }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 32,
          flexWrap: 'wrap',
          gap: 20,
        }}>
          <div>
            <h1 style={{
              fontSize: 28,
              fontWeight: 700,
              color: COLORS.textPrimary,
              letterSpacing: '-0.02em',
              marginBottom: 8,
              fontFamily: 'var(--font-display)',
            }}>
              {greeting}, <span style={{ color: COLORS.primary }}>
                {user?.name?.split(' ')[0] || 'Teacher'}
              </span>
            </h1>
            <p style={{
              fontSize: 15,
              color: COLORS.textMuted,
              lineHeight: 1.5,
            }}>
              Classroom risk overview for {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </p>
          </div>

          <Link to="/teacher/upload" style={{ textDecoration: 'none' }}>
            <Button
              variant="primary"
              size="lg"
              icon={<Upload size={18} />}
              style={{
                background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
                boxShadow: '0 4px 16px rgba(49, 46, 129, 0.25)',
              }}
            >
              Upload Handwriting Sample
            </Button>
          </Link>
        </div>

        {/* ─── STATS CARDS ─── */}
        {dashLoading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 20,
          }}>
            {[0, 1, 2, 3].map(i => <StatCardSkeleton key={i} />)}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 20,
          }}>
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
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))',
          gap: 24,
          marginBottom: 40,
        }}
      >
        {/* Trend Chart */}
        <div style={{
          background: COLORS.bgSurface,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 12,
          padding: 28,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 24,
          }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: COLORS.primaryBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <TrendingUp size={18} color={COLORS.primary} />
            </div>
            <div>
              <h3 style={{
                fontSize: 16,
                fontWeight: 600,
                color: COLORS.textPrimary,
                fontFamily: 'var(--font-display)',
              }}>
                Analysis Trend
              </h3>
              <p style={{ fontSize: 12, color: COLORS.textMuted }}>
                Recent assessment scores
              </p>
            </div>
          </div>

          {reportsLoading ? (
            <SkeletonBox height={280} />
          ) : chartData.length === 0 ? (
            <div style={{
              height: 280,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: COLORS.textMuted,
              background: COLORS.bgSubtle,
              borderRadius: 8,
            }}>
              <BarChart3 size={40} strokeWidth={1.5} style={{ marginBottom: 12, opacity: 0.5 }} />
              <p style={{ fontSize: 14, fontWeight: 500 }}>No data yet</p>
              <p style={{ fontSize: 13 }}>Upload samples to see trends</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
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
                  style={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: COLORS.border }}
                />
                <YAxis
                  stroke={COLORS.textLight}
                  style={{ fontSize: 12 }}
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
                  dot={{ fill: COLORS.primary, strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, stroke: COLORS.bgSurface, strokeWidth: 2 }}
                />
                <Area
                  type="monotone"
                  name="Dysgraphia"
                  dataKey="Dysgraphia"
                  stroke={COLORS.secondary}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#dysgraphiaGrad)"
                  dot={{ fill: COLORS.secondary, strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, stroke: COLORS.bgSurface, strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {/* Legend */}
          {chartData.length > 0 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 24,
              marginTop: 16,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: COLORS.primary }} />
                <span style={{ fontSize: 13, color: COLORS.textMuted, fontWeight: 500 }}>Dyslexia</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: COLORS.secondary }} />
                <span style={{ fontSize: 13, color: COLORS.textMuted, fontWeight: 500 }}>Dysgraphia</span>
              </div>
            </div>
          )}
        </div>

        {/* Risk Distribution */}
        <div style={{
          background: COLORS.bgSurface,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 12,
          padding: 28,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 24,
          }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: COLORS.secondaryBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <PieChartIcon size={18} color={COLORS.secondary} />
            </div>
            <div>
              <h3 style={{
                fontSize: 16,
                fontWeight: 600,
                color: COLORS.textPrimary,
                fontFamily: 'var(--font-display)',
              }}>
                Risk Distribution
              </h3>
              <p style={{ fontSize: 12, color: COLORS.textMuted }}>
                Classroom breakdown
              </p>
            </div>
          </div>

          {dashLoading ? (
            <SkeletonBox height={280} />
          ) : pieData.length === 0 ? (
            <div style={{
              height: 280,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: COLORS.textMuted,
              background: COLORS.bgSubtle,
              borderRadius: 8,
            }}>
              <PieChartIcon size={40} strokeWidth={1.5} style={{ marginBottom: 12, opacity: 0.5 }} />
              <p style={{ fontSize: 14, fontWeight: 500 }}>No assessments</p>
              <p style={{ fontSize: 13 }}>Data will appear here</p>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
              <ResponsiveContainer width="50%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

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
                      <div style={{
                        width: 12,
                        height: 12,
                        borderRadius: 3,
                        background: item.color,
                      }} />
                      <span style={{
                        fontSize: 14,
                        color: COLORS.textSecondary,
                        fontWeight: 500,
                      }}>
                        {item.name}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: COLORS.textPrimary,
                        fontFamily: 'var(--font-display)',
                      }}>
                        {item.value}
                      </span>
                      <span style={{
                        fontSize: 12,
                        color: COLORS.textMuted,
                        marginLeft: 6,
                      }}>
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
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}>
            <h3 style={{
              fontSize: 18,
              fontWeight: 600,
              color: COLORS.textPrimary,
              fontFamily: 'var(--font-display)',
            }}>
              Recent Assessments
            </h3>
            <Button
              variant="outline"
              size="sm"
              iconRight={<ChevronRight size={16} />}
              onClick={() => navigate('/teacher/reports')}
            >
              View All Reports
            </Button>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}>
            {reports.slice(0, 5).map((r, index) => (
              <motion.div
                key={r.reportId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                onClick={() => navigate(`/teacher/reports?id=${r.reportId}`)}
                style={{
                  background: COLORS.bgSurface,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 10,
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                whileHover={{
                  y: -2,
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.06)',
                  borderColor: COLORS.primary,
                }}
              >
                <div>
                  <p style={{
                    fontWeight: 600,
                    fontSize: 15,
                    color: COLORS.textPrimary,
                    marginBottom: 4,
                  }}>
                    {r.studentName}
                  </p>
                  <p style={{
                    fontSize: 13,
                    color: COLORS.textMuted,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}>
                    <Clock size={14} />
                    {formatDistanceToNow(new Date(r.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <div style={{
                  display: 'flex',
                  gap: 12,
                  alignItems: 'center',
                }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: 4,
                  }}>
                    <div style={{
                      background: COLORS.primaryBg,
                      color: COLORS.primary,
                      padding: '4px 10px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 700,
                      fontFamily: 'var(--font-display)',
                    }}>
                      D: {r.dyslexiaScore.toFixed(1)}%
                    </div>
                    <div style={{
                      background: COLORS.secondaryBg,
                      color: COLORS.secondaryDark,
                      padding: '4px 10px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 700,
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
