import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Users, FileText, AlertTriangle, TrendingUp, Upload,
  ArrowRight, Brain, Activity, Clock, ChevronRight
} from 'lucide-react'
import { optimizedAnalysisAPI } from '../../services/optimizedApi'
import { useAuth } from '../../context/AuthContext'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { format, formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'

// Add CSS for pulse animation
const pulseStyle = `
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`

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
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafb 0%, #f3f7fc 100%)',
      padding: '32px 40px',
    }}>
      <div style={{
        marginBottom: 48,
      }}>
        <h1 style={{
          fontSize: 40,
          fontWeight: 800,
          color: '#202124',
          letterSpacing: '-1px',
          marginBottom: 8,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}>
          Loading Dashboard
        </h1>
        <p style={{
          fontSize: 16,
          color: '#5f6368',
          lineHeight: 1.5,
        }}>
          Fetching your data...
        </p>
      </div>

      <style>{pulseStyle}</style>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 20,
        marginBottom: 48,
      }}>
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            style={{
              height: 140,
              background: 'white',
              borderRadius: 12,
              border: '1px solid #dadce0',
              animation: 'pulse 2s infinite',
            }}
          />
        ))}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
        gap: 24,
      }}>
        <div
          style={{
            height: 400,
            background: 'white',
            border: '1px solid #dadce0',
            borderRadius: 12,
            animation: 'pulse 2s infinite',
          }}
        />
        <div
          style={{
            height: 400,
            background: 'white',
            border: '1px solid #dadce0',
            borderRadius: 12,
            animation: 'pulse 2s infinite',
          }}
        />
      </div>
    </div>
  )

  return (
    <>
      <style>{pulseStyle}</style>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafb 0%, #f3f7fc 100%)',
        padding: '32px 40px',
      }}>
      {/* ─── HEADER SECTION ─── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          marginBottom: 48,
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 24,
        }}>
          <div>
            <h1 style={{
              fontSize: 40,
              fontWeight: 800,
              color: '#202124',
              letterSpacing: '-1px',
              marginBottom: 8,
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}>
              {greeting}, <span style={{ color: '#1a73e8' }}>
                {user?.name?.split(' ')[0]}
              </span> 👋
            </h1>
            <p style={{
              fontSize: 16,
              color: '#5f6368',
              lineHeight: 1.5,
            }}>
              Here's what's happening with your students — {format(new Date(), 'EEEE, MMMM d')}
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link to="/teacher/upload" style={{ textDecoration: 'none' }}>
              <button
                style={{
                  background: 'linear-gradient(135deg, #1a73e8 0%, #1557b0 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 10,
                  padding: '14px 28px',
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  transition: 'all 0.3s cubic-bezier(0.2, 0, 0, 1)',
                  boxShadow: '0 4px 16px rgba(26, 115, 232, 0.3)',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(26, 115, 232, 0.4)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(26, 115, 232, 0.3)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <Upload size={18} />
                Upload Paper
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Stats Cards Grid */}
        {dashLoading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 20,
          }}>
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                style={{
                  height: 140,
                  background: 'white',
                  borderRadius: 12,
                  border: '1px solid #dadce0',
                  animation: 'pulse 2s infinite',
                }}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 20,
            }}
          >
            {/* Students Card */}
            <div
              style={{
                background: 'white',
                border: '1px solid #dadce0',
                borderRadius: 12,
                padding: 24,
                transition: 'all 0.3s ease-out',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.08)'
                e.currentTarget.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                marginBottom: 16,
              }}>
                <div style={{
                  width: 50,
                  height: 50,
                  background: '#e8f0fe',
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Users size={24} color="#1a73e8" strokeWidth={2} />
                </div>
              </div>
              <p style={{
                fontSize: 12,
                color: '#80868b',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: 8,
              }}>Total Students</p>
              <p style={{
                fontSize: 36,
                fontWeight: 800,
                color: '#202124',
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}>{dash?.totalStudents ?? 0}</p>
            </div>

            {/* Papers Card */}
            <div
              style={{
                background: 'white',
                border: '1px solid #dadce0',
                borderRadius: 12,
                padding: 24,
                transition: 'all 0.3s ease-out',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.08)'
                e.currentTarget.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                marginBottom: 16,
              }}>
                <div style={{
                  width: 50,
                  height: 50,
                  background: '#fef3c7',
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <FileText size={24} color="#f59e0b" strokeWidth={2} />
                </div>
              </div>
              <p style={{
                fontSize: 12,
                color: '#80868b',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: 8,
              }}>Papers Uploaded</p>
              <p style={{
                fontSize: 36,
                fontWeight: 800,
                color: '#202124',
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}>{dash?.totalPapersUploaded ?? 0}</p>
            </div>

            {/* At Risk Card */}
            <div
              style={{
                background: 'white',
                border: '1px solid #dadce0',
                borderRadius: 12,
                padding: 24,
                transition: 'all 0.3s ease-out',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.08)'
                e.currentTarget.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                marginBottom: 16,
              }}>
                <div style={{
                  width: 50,
                  height: 50,
                  background: '#fee2e2',
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <AlertTriangle size={24} color="#ef4444" strokeWidth={2} />
                </div>
              </div>
              <p style={{
                fontSize: 12,
                color: '#80868b',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: 8,
              }}>Students at Risk</p>
              <p style={{
                fontSize: 36,
                fontWeight: 800,
                color: '#202124',
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}>{dash?.studentsAtRisk ?? 0}</p>
            </div>

            {/* Avg Dyslexia Card */}
            <div
              style={{
                background: 'white',
                border: '1px solid #dadce0',
                borderRadius: 12,
                padding: 24,
                transition: 'all 0.3s ease-out',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.08)'
                e.currentTarget.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                marginBottom: 16,
              }}>
                <div style={{
                  width: 50,
                  height: 50,
                  background: '#ede9fe',
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Brain size={24} color="#a855f7" strokeWidth={2} />
                </div>
              </div>
              <p style={{
                fontSize: 12,
                color: '#80868b',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: 8,
              }}>Avg. Dyslexia Score</p>
              <p style={{
                fontSize: 36,
                fontWeight: 800,
                color: '#202124',
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}>{dash?.averageDyslexiaScore?.toFixed(1) ?? 0}%</p>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* ─── CHARTS SECTION ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
          gap: 24,
          marginBottom: 40,
        }}
      >
        {/* Trend Chart */}
        <div
          style={{
            background: 'white',
            border: '1px solid #dadce0',
            borderRadius: 12,
            padding: 28,
          }}
        >
          <h3 style={{
            fontSize: 18,
            fontWeight: 700,
            color: '#202124',
            marginBottom: 24,
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}>Recent Analysis Trend</h3>
          {reportsLoading ? (
            <div style={{ height: 300, background: '#f8f9fa', borderRadius: 8, animation: 'pulse 2s infinite' }} />
          ) : chartData.length === 0 ? (
            <p style={{
              color: '#5f6368',
              textAlign: 'center',
              padding: '60px 20px',
              fontSize: 14,
            }}>Upload a paper to see trends</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="dyslexiaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="dysgraphiaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#dadce0" />
                <XAxis dataKey="date" stroke="#80868b" style={{ fontSize: 12 }} />
                <YAxis stroke="#80868b" style={{ fontSize: 12 }} />
                <ReTooltip content={<CustomTooltip />} />
                <Area type="monotone" name="Dyslexia" dataKey="Dyslexia" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#dyslexiaGrad)" />
                <Area type="monotone" name="Dysgraphia" dataKey="Dysgraphia" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#dysgraphiaGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Risk Distribution */}
        <div
          style={{
            background: 'white',
            border: '1px solid #dadce0',
            borderRadius: 12,
            padding: 28,
          }}
        >
          <h3 style={{
            fontSize: 18,
            fontWeight: 700,
            color: '#202124',
            marginBottom: 24,
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}>Risk Distribution</h3>
          {dashLoading ? (
            <div style={{ height: 300, background: '#f8f9fa', borderRadius: 8, animation: 'pulse 2s infinite' }} />
          ) : pieData.length === 0 ? (
            <p style={{
              color: '#5f6368',
              textAlign: 'center',
              padding: '60px 20px',
              fontSize: 14,
            }}>No reports yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" labelLine={false} label={e => `${e.name} (${e.value})`} outerRadius={80} fill="#8884d8" dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </motion.div>

      {/* ─── RECENT REPORTS SECTION ─── */}
      {reports.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}>
            <h3 style={{
              fontSize: 20,
              fontWeight: 700,
              color: '#202124',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}>Recent Reports</h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/teacher/reports')}
              style={{
                background: 'transparent',
                border: '1px solid #dadce0',
                borderRadius: 8,
                padding: '10px 16px',
                fontSize: 14,
                fontWeight: 600,
                color: '#1a73e8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.3s ease-out',
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#e8f0fe'
                e.currentTarget.style.borderColor = '#1a73e8'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderColor = '#dadce0'
              }}
            >
              View All
              <ChevronRight size={16} />
            </motion.button>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}>
            {reports.slice(0, 5).map(r => (
              <motion.div
                key={r.reportId}
                whileHover={{ y: -2 }}
                onClick={() => navigate(`/teacher/reports?id=${r.reportId}`)}
                style={{
                  background: 'white',
                  border: '1px solid #dadce0',
                  borderRadius: 10,
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-out',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)'
                  e.currentTarget.style.borderColor = '#1a73e8'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.borderColor = '#dadce0'
                }}
              >
                <div>
                  <p style={{
                    fontWeight: 700,
                    fontSize: 15,
                    color: '#202124',
                    marginBottom: 4,
                  }}>{r.studentName}</p>
                  <p style={{
                    fontSize: 13,
                    color: '#5f6368',
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
                  gap: 16,
                  alignItems: 'center',
                }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: 4,
                  }}>
                    <div style={{
                      background: '#ede9fe',
                      color: '#a855f7',
                      padding: '4px 12px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 700,
                    }}>D: {r.dyslexiaScore.toFixed(1)}%</div>
                    <div style={{
                      background: '#cffafe',
                      color: '#0891b2',
                      padding: '4px 12px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 700,
                    }}>G: {r.dysgraphiaScore.toFixed(1)}%</div>
                  </div>
                  <div style={{
                    padding: '6px 12px',
                    borderRadius: 6,
                    fontWeight: 700,
                    fontSize: 12,
                    background:
                      r.riskLevel === 'HIGH' ? '#fee2e2' :
                      r.riskLevel === 'MEDIUM' ? '#fef3c7' :
                      '#dcfce7',
                    color:
                      r.riskLevel === 'HIGH' ? '#991b1b' :
                      r.riskLevel === 'MEDIUM' ? '#9a3412' :
                      '#166534',
                  }}>
                    {r.riskLevel}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
    </>
  )
}
