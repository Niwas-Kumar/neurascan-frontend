import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Users, FileText, AlertTriangle, TrendingUp, Upload,
  ArrowRight, Brain, Activity, Clock, ChevronRight
} from 'lucide-react'
import { optimizedAnalysisAPI } from '../../services/optimizedApi'
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
  const [dash, setDash]         = useState(null)
  const [reports, setReports]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [dashLoading, setDashLoading] = useState(true)
  const [reportsLoading, setReportsLoading] = useState(true)

  useEffect(() => {
    // OPTIMIZATION: Fetch dashboard and reports in parallel instead of waiting for both
    // Show data as soon as each request completes
    setLoading(true)
    
    // Fetch dashboard data
    optimizedAnalysisAPI.getDashboard()
      .then(d => {
        setDash(d.data.data)
        if ((d.data.data?.studentsAtRisk || 0) > 0) {
          addNotification({ 
            type: 'warning', 
            title: 'Students at risk', 
            body: `${d.data.data.studentsAtRisk} student(s) need attention.` 
          })
        }
        setDashLoading(false)
      })
      .catch(err => {
        console.error('Dashboard error:', err)
        toast.error('Failed to load dashboard data')
        setDashLoading(false)
      })

    // Fetch reports data independently
    optimizedAnalysisAPI.getReports()
      .then(r => {
        setReports(r.data.data || [])
        setReportsLoading(false)
      })
      .catch(err => {
        console.error('Reports error:', err)
        toast.error('Failed to load reports')
        setReportsLoading(false)
      })
      .finally(() => {
        // Overall loading complete when both finish
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

  // Show loading only if both are still loading
  if (loading && dashLoading && reportsLoading) return (
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
          <Link to="/teacher/upload" style={{ textDecoration: 'none' }}>
            <Button icon={<Upload size={15} />}>
              Upload Paper
            </Button>
          </Link>
        }
      />

      {/* Stats cards - show while dashboard is loading or loaded */}
      {dashLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
          {[0,1,2,3].map(i => <SkeletonCard key={i} rows={2} />)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
          <StatCard label="Total Students" value={dash?.totalStudents ?? 0} icon={Users} />
          <StatCard label="Papers Uploaded" value={dash?.totalPapersUploaded ?? 0} icon={FileText} />
          <StatCard label="At Risk" value={dash?.studentsAtRisk ?? 0} icon={AlertTriangle} iconColor="#ff6b6b" />
          <StatCard label="Avg. Dyslexia" value={`${dash?.averageDyslexiaScore?.toFixed(1) ?? 0}%`} icon={Brain} />
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        {/* Chart */}
        {reportsLoading ? (
          <SkeletonCard rows={8} />
        ) : (
          <motion.div className="glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Recent Analysis Trend</h3>
            {chartData.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 20px' }}>No data yet — upload a paper to see trends</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="dyslexiaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--violet)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="var(--violet)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="dysgraphiaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--cyan)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="var(--cyan)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="date" stroke="var(--text-muted)" />
                  <YAxis stroke="var(--text-muted)" />
                  <ReTooltip content={<CustomTooltip />} />
                  <Area type="monotone" name="Dyslexia" dataKey="Dyslexia" stroke="var(--violet)" strokeWidth={2} fillOpacity={1} fill="url(#dyslexiaGrad)" />
                  <Area type="monotone" name="Dysgraphia" dataKey="Dysgraphia" stroke="var(--cyan)" strokeWidth={2} fillOpacity={1} fill="url(#dysgraphiaGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </motion.div>
        )}

        {/* Risk pie chart */}
        {dashLoading ? (
          <SkeletonCard rows={6} />
        ) : (
          <motion.div className="glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Risk Distribution</h3>
            {pieData.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 20px', fontSize: 13 }}>No reports yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" labelLine={false} label={e => `${e.name} (${e.value})`} outerRadius={80} fill="#8884d8" dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}
          </motion.div>
        )}
      </div>

      {/* Recent reports */}
      {reportsLoading ? (
        <div style={{ marginTop: 40 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Recent Reports</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[0,1,2].map(i => <SkeletonCard key={i} rows={1} />)}
          </div>
        </div>
      ) : reports.length > 0 ? (
        <motion.div style={{ marginTop: 40 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Recent Reports</h3>
            <Button variant="ghost" size="sm" icon={<ArrowRight size={14} />} onClick={() => navigate('/teacher/reports')} iconRight>View All</Button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {reports.slice(0, 3).map(r => (
              <div key={r.reportId} className="glass-panel" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'all var(--duration)' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'} onMouseLeave={e => e.currentTarget.style.background = ''}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14 }}>{r.studentName}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{format(new Date(r.createdAt), 'MMM d, HH:mm')}</p>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div>
                    <Badge label={`D: ${r.dyslexiaScore.toFixed(1)}%`} />
                    <Badge label={`G: ${r.dysgraphiaScore.toFixed(1)}%`} style={{ marginLeft: 8 }} />
                  </div>
                  <RiskBadge riskLevel={r.riskLevel} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ) : null}
    </div>
  )
}
