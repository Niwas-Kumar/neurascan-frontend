// ============================================================
// TEACHER REPORTS PAGE
// ============================================================
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Search, ChevronDown, ChevronUp, Filter, X, Download } from 'lucide-react'
import { optimizedAnalysisAPI } from '../../services/optimizedApi'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { useAuth } from '../../context/AuthContext'
import { useDebounce } from '../../hooks'

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

// ── Inline ScoreBar Component ────────────────────────────
const ScoreBar = ({ label, value }) => {
  const color = value >= 70 ? 'var(--danger)' : value >= 45 ? 'var(--warning)' : 'var(--success)'
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{label}</span>
        <span style={{ fontSize: 14, fontWeight: 700, color }}>{value?.toFixed(1)}%</span>
      </div>
      <div style={{ height: 6, background: 'var(--bg-elevated)', borderRadius: 3, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ height: '100%', background: color, borderRadius: 3 }}
        />
      </div>
    </div>
  )
}

// ── Inline EmptyState Component ────────────────────────────
const EmptyState = ({ icon: Icon, title, description }) => (
  <div style={{border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '48px 32px', textAlign: 'center' }}>
    {Icon && <Icon size={40} color="var(--text-muted)" strokeWidth={1.25} style={{ marginBottom: 16 }} />}
    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, marginBottom: 8 }}>{title}</h3>
    {description && <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.75 }}>{description}</p>}
  </div>
)

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

// ── Inline Tooltip Component ────────────────────────────
const Tooltip = ({ children, text, position = 'top' }) => {
  const [show, setShow] = useState(false)
  const positions = {
    top: { bottom: '120%', left: '50%', transform: 'translateX(-50%)' },
    right: { left: '120%', top: '50%', transform: 'translateY(-50%)' },
  }
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        style={{ cursor: 'help' }}
      >
        {children}
      </div>
      {show && (
        <div style={{
          position: 'absolute',
          background: 'var(--text-primary)',
          color: 'white',
          padding: '6px 10px',
          borderRadius: '6px',
          fontSize: '12px',
          whiteSpace: 'nowrap',
          ...positions[position],
          zIndex: 1000,
        }}>
          {text}
        </div>
      )}
    </div>
  )
}

function downloadCSV(data, filename) {
  const csvStr = data.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\\n')
  const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function ReportsPage() {
  const { user } = useAuth()
  const [reports, setReports]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [riskFilter, setRisk]   = useState('ALL')
  const [expandedId, setExpId]  = useState(null)
  const debouncedSearch = useDebounce(search)

  useEffect(() => {
    optimizedAnalysisAPI.getReports()
      .then(r => setReports(r.data.data || []))
      .catch(() => toast.error('Failed to load reports'))
      .finally(() => setLoading(false))
  }, [user?.userId])

  const filtered = reports.filter(r => {
    const matchSearch = !debouncedSearch || r.studentName?.toLowerCase().includes(debouncedSearch.toLowerCase())
    const matchRisk   = riskFilter === 'ALL' || r.riskLevel === riskFilter
    return matchSearch && matchRisk
  })

  const riskCounts = { ALL: reports.length, LOW: 0, MEDIUM: 0, HIGH: 0 }
  reports.forEach(r => { if (riskCounts[r.riskLevel] !== undefined) riskCounts[r.riskLevel]++ })

  const handleExport = () => {
    if (filtered.length === 0) return toast.error('No reports to export')
    const headers = ['Report ID', 'Student Name', 'Class Name', 'Dyslexia Score', 'Dysgraphia Score', 'Risk Level', 'Date', 'AI Comment']
    const data = filtered.map(r => [
      r.reportId,
      r.studentName,
      r.className,
      r.dyslexiaScore?.toFixed(1) + '%',
      r.dysgraphiaScore?.toFixed(1) + '%',
      r.riskLevel,
      r.createdAt ? format(new Date(r.createdAt), 'yyyy-MM-dd') : 'N/A',
      r.aiComment || ''
    ])
    downloadCSV([headers, ...data], `NeuraScan_Reports_${format(new Date(), 'yyyy-MM-dd')}.csv`)
    toast.success('Export started')
  }

  return (
    <div>
      <PageHeader
        title="Analysis Reports"
        subtitle={`${reports.length} total report${reports.length !== 1 ? 's' : ''}`}
        action={
          <button onClick={handleExport} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 'var(--radius)', background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-body)', fontWeight: 600, transition: 'all var(--duration)' }} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--violet)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
            <Download size={14} /> Export CSV
          </button>
        }
      />

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: 340 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by student name…"
            style={{ width: '100%', padding: '9px 36px 9px 34px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 13, outline: 'none' }}
            onFocus={e => e.target.style.borderColor = 'var(--border-focus)'}
            onBlur={e  => e.target.style.borderColor = 'var(--border)'}
          />
          {search && <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={13} /></button>}
        </div>

        <div style={{ display: 'flex', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 3, gap: 2 }}>
          {['ALL','LOW','MEDIUM','HIGH'].map(v => (
            <button key={v} onClick={() => setRisk(v)} style={{
              padding: '7px 14px', borderRadius: 7, border: 'none', cursor: 'pointer',
              background: riskFilter === v ? 'var(--bg-elevated)' : 'transparent',
              color: riskFilter === v ? 'var(--text-primary)' : 'var(--text-muted)',
              fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: riskFilter === v ? 600 : 400,
              transition: 'all var(--duration)', display: 'flex', alignItems: 'center', gap: 5,
              boxShadow: riskFilter === v ? '0 1px 4px rgba(0,0,0,0.3)' : 'none',
            }}>
              {v !== 'ALL' && <span style={{ width: 6, height: 6, borderRadius: '50%', background: v === 'LOW' ? 'var(--success)' : v === 'MEDIUM' ? 'var(--warning)' : 'var(--danger)' }} />}
              {v} <span style={{ fontSize: 10, opacity: 0.7 }}>({riskCounts[v]})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Column headers */}
      {filtered.length > 0 && !loading && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr 32px', padding: '6px 20px 6px', gap: 12, marginBottom: 4 }}>
          {['Student', 'Dyslexia', 'Dysgraphia', 'Risk Level', 'Date', ''].map(h => (
            <div key={h} style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</div>
          ))}
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[0,1,2,3].map(i => <SkeletonCard key={i} rows={1} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <EmptyState icon={FileText} title="No reports found" description="No analysis reports match your current filters." />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {filtered.map((r, i) => (
            <motion.div
              key={r.reportId}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="glass-panel"
              style={{ overflow: 'hidden', transition: 'border-color var(--duration)' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div
                onClick={() => setExpId(id => id === r.reportId ? null : r.reportId)}
                style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr 32px', alignItems: 'center', padding: '14px 20px', cursor: 'pointer', gap: 12 }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{r.studentName}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{r.className} · {r.originalFileName}</div>
                </div>
                <span style={{ fontWeight: 700, fontSize: 14, color: r.dyslexiaScore >= 70 ? 'var(--danger)' : r.dyslexiaScore >= 45 ? 'var(--warning)' : 'var(--success)' }}>
                  {r.dyslexiaScore?.toFixed(1)}%
                </span>
                <span style={{ fontWeight: 700, fontSize: 14, color: r.dysgraphiaScore >= 70 ? 'var(--danger)' : r.dysgraphiaScore >= 45 ? 'var(--warning)' : 'var(--success)' }}>
                  {r.dysgraphiaScore?.toFixed(1)}%
                </span>
                <RiskBadge level={r.riskLevel} />
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {r.createdAt ? format(new Date(r.createdAt), 'MMM d, yyyy') : '—'}
                </span>
                <span style={{ color: 'var(--text-muted)' }}>
                  {expandedId === r.reportId ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </span>
              </div>

              <AnimatePresence>
                {expandedId === r.reportId && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: [0.4,0,0.2,1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--border)', paddingTop: 20 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>Score breakdown</div>
                          <ScoreBar label="Dyslexia Score"   value={r.dyslexiaScore} />
                          <ScoreBar label="Dysgraphia Score" value={r.dysgraphiaScore} />
                        </div>
                        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>AI Analysis</div>
                          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.75 }}>{r.aiComment}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
