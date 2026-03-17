import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Users, FileText, AlertTriangle, TrendingUp, Upload,
  ArrowRight, Brain, Activity, Clock, ChevronRight
} from 'lucide-react'
import { analysisAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { StatCard, PageHeader, Button, RiskBadge, SkeletonCard, Tooltip, Badge } from '../../components/shared/UI'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { format, formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', fontSize: 12, boxShadow: 'var(--shadow)' }}>
      <p style={{ color: 'var(--text-muted)', marginBottom: 6 }}>{label}</p>
      {payload.map(p => (
        <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
          <span style={{ color: 'var(--text-secondary)' }}>{p.name}:</span>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{p.value?.toFixed(1)}%</span>
        </div>
      ))}
    </div>
  )
}

export default function TeacherDashboard() {
  const { user, addNotification } = useAuth()
  const navigate = useNavigate()
  const [dash, setDash]       = useState(null)
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([analysisAPI.getDashboard(), analysisAPI.getReports()])
      .then(([d, r]) => {
        setDash(d.data.data)
        setReports(r.data.data || [])
        if ((d.data.data?.studentsAtRisk || 0) > 0) {
          addNotification({ type: 'warning', title: 'Students at risk', body: `${d.data.data.studentsAtRisk} student(s) need attention.` })
        }
      })
      .catch(() => toast.error('Failed to load dashboard data'))
      .finally(() => setLoading(false))
  }, [user?.userId])

  const greeting = (() => {
    const h = new Date().getHours()
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
  })()

  // Chart data — last 8 reports reversed for chronological order
  const chartData = [...reports].reverse().slice(-8).map(r => ({
    date: format(new Date(r.uploadDate || r.createdAt), 'MMM d'),
    Dyslexia:   +r.dyslexiaScore?.toFixed(1),
    Dysgraphia: +r.dysgraphiaScore?.toFixed(1),
  }))

  // Pie: risk distribution
  const riskCounts = reports.reduce((acc, r) => { acc[r.riskLevel] = (acc[r.riskLevel] || 0) + 1; return acc }, {})
  const pieData = [
    { name: 'Low',    value: riskCounts.LOW    || 0, color: 'var(--success)' },
    { name: 'Medium', value: riskCounts.MEDIUM || 0, color: 'var(--warning)' },
    { name: 'High',   value: riskCounts.HIGH   || 0, color: 'var(--danger)'  },
  ].filter(d => d.value > 0)

  if (loading) return (
    <div>
      <PageHeader title="Dashboard" subtitle="Loading your data…" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[0,1,2,3].map(i => <SkeletonCard key={i} rows={2} />)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        <SkeletonCard rows={8} /><SkeletonCard rows={6} />
      </div>
    </div>
  )

  return (
    <div>
      <PageHeader
        title={<>{greeting}, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋</>}
        subtitle={`Here's what's happening with your students today — ${format(new Date(), 'EEEE, MMMM d')}`}
        action={
          <Button icon={<Upload size={15} />} onClick={() => navigate('/teacher/upload')}>
            Upload Paper
          </Button>
        }
      />

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <StatCard icon={Users}         label="Total Students"     value={dash?.totalStudents ?? 0}          color="violet"  delay={0} trend={null} />
        <StatCard icon={FileText}      label="Papers Uploaded"    value={dash?.totalPapersUploaded ?? 0}     color="cyan"    delay={1} />
        <StatCard icon={AlertTriangle} label="Students at Risk"   value={dash?.studentsAtRisk ?? 0}          color="warning" delay={2} sub="Score ≥ 45%" />
        <StatCard icon={Brain}         label="Avg Dyslexia Score" value={`${(dash?.averageDyslexiaScore ?? 0).toFixed(1)}%`} color="danger" delay={3} />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(280px, 320px)', gap: 20, marginBottom: 24 }}>

        {/* Area chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-panel"
          style={{ padding: '22px 24px', minWidth: 0, overflow: 'hidden' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, marginBottom: 2 }}>Score Trends</h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Last {chartData.length} analyses</p>
            </div>
            <div style={{ display: 'flex', gap: 12, fontSize: 12 }}>
              {[['Dyslexia', '#7c3aed'], ['Dysgraphia', '#06b6d4']].map(([n, c]) => (
                <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
                  <span style={{ color: 'var(--text-muted)' }}>{n}</span>
                </div>
              ))}
            </div>
          </div>
          {chartData.length > 1 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="gD" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(139,92,246,0.06)" strokeDasharray="4 4" />
                <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                <ReTooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="Dyslexia"   stroke="#7c3aed" fill="url(#gD)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="Dysgraphia" stroke="#06b6d4" fill="url(#gG)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
              Upload more papers to see trends appear here.
            </div>
          )}
        </motion.div>

        {/* Risk distribution pie */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="glass-panel"
          style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column' }}
        >
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Risk Distribution</h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>{reports.length} total reports</p>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {pieData.map((d, i) => (
                    <Cell key={i} fill={d.color} stroke="transparent" />
                  ))}
                </Pie>
                <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{v}</span>} />
                <ReTooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, color: 'var(--text-muted)', fontSize: 13 }}>
              <Brain size={28} strokeWidth={1.25} />
              No risk data yet
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent activity */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="glass-panel"
        style={{ overflow: 'hidden' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, marginBottom: 2 }}>Recent Activity</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Latest analysis results</p>
          </div>
          <Button variant="ghost" size="sm" iconRight={<ChevronRight size={14} />} onClick={() => navigate('/teacher/reports')}>
            View all
          </Button>
        </div>

        {reports.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
            <Activity size={28} strokeWidth={1.25} style={{ marginBottom: 12, opacity: 0.4 }} />
            <p>No analyses yet. <button onClick={() => navigate('/teacher/upload')} style={{ background: 'none', border: 'none', color: 'var(--violet-soft)', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>Upload your first paper →</button></p>
          </div>
        ) : (
          <div>
            {reports.slice(0, 6).map((r, i) => (
              <motion.div
                key={r.reportId}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + i * 0.05 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: '14px 24px',
                  borderBottom: i < 5 ? '1px solid rgba(139,92,246,0.06)' : 'none',
                  transition: 'background var(--duration)',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Avatar */}
                <div style={{
                  width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                  background: 'var(--violet-dim)', border: '1px solid rgba(139,92,246,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14,
                  color: 'var(--violet-soft)',
                }}>
                  {r.studentName?.charAt(0).toUpperCase()}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.studentName}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', flexShrink: 0 }}>· {r.className}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={10} />
                    {r.createdAt ? formatDistanceToNow(new Date(r.createdAt), { addSuffix: true }) : '—'}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <Tooltip content="Dyslexia score">
                    <span style={{ fontSize: 13, fontWeight: 600, color: r.dyslexiaScore >= 70 ? 'var(--danger)' : r.dyslexiaScore >= 45 ? 'var(--warning)' : 'var(--success)' }}>
                      {r.dyslexiaScore?.toFixed(0)}%
                    </span>
                  </Tooltip>
                  <RiskBadge level={r.riskLevel} />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
