// ============================================================
// TEACHER REPORTS PAGE - NeuraScan Design System v3.0
// ============================================================
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Search, ChevronDown, ChevronUp, X, Download } from 'lucide-react'
import { optimizedAnalysisAPI } from '../../services/optimizedApi'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { useAuth } from '../../context/AuthContext'
import { useDebounce } from '../../hooks'

// ════════════════════════════════════════════════════════════════
// DESIGN SYSTEM COLORS
// ════════════════════════════════════════════════════════════════
const COLORS = {
  // Primary: Deep Indigo
  primary: '#312E81',
  primaryLight: '#4338CA',
  primaryLighter: '#6366F1',
  primaryBg: '#EEF2FF',

  // Secondary: Soft Teal
  secondary: '#14B8A6',
  secondaryDark: '#0D9488',
  secondaryBg: '#CCFBF1',

  // Risk levels (muted clinical)
  riskHigh: '#B91C1C',
  riskHighBg: '#FEF2F2',
  riskMedium: '#B45309',
  riskMediumBg: '#FFFBEB',
  riskLow: '#047857',
  riskLowBg: '#ECFDF5',

  // Neutrals
  textPrimary: '#1E293B',
  textSecondary: '#475569',
  textMuted: '#64748B',
  textLight: '#94A3B8',

  // Backgrounds
  bgBase: '#F8FAFC',
  bgSurface: '#FFFFFF',
  bgSubtle: '#F1F5F9',

  // Borders
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
}

// ════════════════════════════════════════════════════════════════
// REUSABLE COMPONENTS
// ════════════════════════════════════════════════════════════════

const PageHeader = ({ title, subtitle, action }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  }}>
    <div>
      <h1 style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: 28,
        fontWeight: 800,
        marginBottom: 8,
        color: COLORS.textPrimary,
        letterSpacing: '-0.02em',
      }}>
        {title}
      </h1>
      {subtitle && (
        <p style={{
          fontSize: 15,
          color: COLORS.textSecondary,
          lineHeight: 1.6,
        }}>
          {subtitle}
        </p>
      )}
    </div>
    {action}
  </div>
)

const RiskBadge = ({ level }) => {
  const styles = {
    LOW: { bg: COLORS.riskLowBg, text: COLORS.riskLow },
    MEDIUM: { bg: COLORS.riskMediumBg, text: COLORS.riskMedium },
    HIGH: { bg: COLORS.riskHighBg, text: COLORS.riskHigh },
  }
  const s = styles[level] || styles.LOW

  return (
    <span style={{
      display: 'inline-block',
      padding: '5px 12px',
      borderRadius: 100,
      fontSize: 12,
      fontWeight: 600,
      background: s.bg,
      color: s.text,
    }}>
      {level}
    </span>
  )
}

const ScoreBar = ({ label, value }) => {
  const getColor = (v) => {
    if (v >= 70) return COLORS.riskHigh
    if (v >= 45) return COLORS.riskMedium
    return COLORS.riskLow
  }
  const color = getColor(value)

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
      }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.textPrimary }}>
          {label}
        </span>
        <span style={{ fontSize: 14, fontWeight: 700, color }}>
          {value?.toFixed(1)}%
        </span>
      </div>
      <div style={{
        height: 8,
        background: COLORS.bgSubtle,
        borderRadius: 4,
        overflow: 'hidden',
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            height: '100%',
            background: color,
            borderRadius: 4,
          }}
        />
      </div>
    </div>
  )
}

const EmptyState = ({ icon: Icon, title, description }) => (
  <div style={{
    padding: '64px 32px',
    textAlign: 'center',
    background: COLORS.bgSurface,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 16,
  }}>
    {Icon && <Icon size={48} color={COLORS.textLight} strokeWidth={1.25} style={{ marginBottom: 20 }} />}
    <h3 style={{
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: 18,
      fontWeight: 700,
      marginBottom: 10,
      color: COLORS.textPrimary,
    }}>
      {title}
    </h3>
    {description && (
      <p style={{ color: COLORS.textSecondary, fontSize: 14, lineHeight: 1.75, maxWidth: 320, margin: '0 auto' }}>
        {description}
      </p>
    )}
  </div>
)

const SkeletonCard = () => (
  <div style={{
    border: `1px solid ${COLORS.border}`,
    borderRadius: 14,
    padding: '18px 24px',
    background: COLORS.bgSurface,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{
        width: 160,
        height: 16,
        background: `linear-gradient(90deg, ${COLORS.bgSubtle} 25%, ${COLORS.bgSurface} 50%, ${COLORS.bgSubtle} 75%)`,
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        borderRadius: 6,
      }} />
      <div style={{ flex: 1 }} />
      <div style={{
        width: 80,
        height: 16,
        background: `linear-gradient(90deg, ${COLORS.bgSubtle} 25%, ${COLORS.bgSurface} 50%, ${COLORS.bgSubtle} 75%)`,
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        borderRadius: 6,
      }} />
    </div>
    <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
  </div>
)

function downloadCSV(data, filename) {
  const csvStr = data.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// ════════════════════════════════════════════════════════════════
// MAIN REPORTS PAGE
// ════════════════════════════════════════════════════════════════

export function ReportsPage() {
  const { user } = useAuth()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [riskFilter, setRisk] = useState('ALL')
  const [expandedId, setExpId] = useState(null)
  const debouncedSearch = useDebounce(search)

  useEffect(() => {
    optimizedAnalysisAPI.getReports()
      .then(r => setReports(r.data.data || []))
      .catch(() => toast.error('Failed to load reports'))
      .finally(() => setLoading(false))
  }, [user?.userId])

  const filtered = reports.filter(r => {
    const matchSearch = !debouncedSearch || r.studentName?.toLowerCase().includes(debouncedSearch.toLowerCase())
    const matchRisk = riskFilter === 'ALL' || r.riskLevel === riskFilter
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
    toast.success('Export completed')
  }

  const riskFilterColors = {
    ALL: COLORS.textMuted,
    LOW: COLORS.riskLow,
    MEDIUM: COLORS.riskMedium,
    HIGH: COLORS.riskHigh,
  }

  return (
    <div>
      <PageHeader
        title="Analysis Reports"
        subtitle={`${reports.length} assessment${reports.length !== 1 ? 's' : ''} completed`}
        action={
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExport}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              borderRadius: 10,
              background: COLORS.bgSurface,
              border: `1px solid ${COLORS.border}`,
              color: COLORS.textPrimary,
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              transition: 'all 0.2s ease',
            }}
          >
            <Download size={16} /> Export CSV
          </motion.button>
        }
      />

      {/* Filter bar */}
      <div style={{
        display: 'flex',
        gap: 12,
        marginBottom: 24,
        flexWrap: 'wrap',
      }}>
        {/* Search input */}
        <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: 360 }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              color: COLORS.textMuted,
              pointerEvents: 'none',
            }}
          />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by student name..."
            style={{
              width: '100%',
              padding: '11px 40px 11px 42px',
              background: COLORS.bgSurface,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 10,
              color: COLORS.textPrimary,
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              outline: 'none',
              transition: 'border-color 0.2s ease',
            }}
            onFocus={e => e.target.style.borderColor = COLORS.primary}
            onBlur={e => e.target.style.borderColor = COLORS.border}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: COLORS.textMuted,
                cursor: 'pointer',
                padding: 4,
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Risk filter pills */}
        <div style={{
          display: 'flex',
          background: COLORS.bgSubtle,
          borderRadius: 10,
          padding: 4,
          gap: 4,
        }}>
          {['ALL', 'LOW', 'MEDIUM', 'HIGH'].map(v => (
            <button
              key={v}
              onClick={() => setRisk(v)}
              style={{
                padding: '8px 14px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                background: riskFilter === v ? COLORS.bgSurface : 'transparent',
                color: riskFilter === v ? COLORS.textPrimary : COLORS.textMuted,
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                fontWeight: riskFilter === v ? 600 : 500,
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: riskFilter === v ? '0 1px 3px rgba(0, 0, 0, 0.08)' : 'none',
              }}
            >
              {v !== 'ALL' && (
                <span style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: riskFilterColors[v],
                }} />
              )}
              {v}
              <span style={{
                fontSize: 11,
                opacity: 0.6,
                marginLeft: 2,
              }}>
                ({riskCounts[v]})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Column headers */}
      {filtered.length > 0 && !loading && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr 40px',
          padding: '8px 24px',
          gap: 12,
          marginBottom: 8,
        }}>
          {['Student', 'Dyslexia', 'Dysgraphia', 'Risk Level', 'Date', ''].map(h => (
            <div key={h} style={{
              fontSize: 11,
              fontWeight: 600,
              color: COLORS.textMuted,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}>
              {h}
            </div>
          ))}
        </div>
      )}

      {/* Reports list */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[0, 1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No reports found"
          description="No analysis reports match your current filters. Try adjusting your search criteria."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map((r, i) => (
            <motion.div
              key={r.reportId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              style={{
                background: COLORS.bgSurface,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 14,
                overflow: 'hidden',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = COLORS.primaryLight
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(49, 46, 129, 0.08)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = COLORS.border
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div
                onClick={() => setExpId(id => id === r.reportId ? null : r.reportId)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr 40px',
                  alignItems: 'center',
                  padding: '16px 24px',
                  cursor: 'pointer',
                  gap: 12,
                }}
              >
                <div>
                  <div style={{
                    fontWeight: 600,
                    fontSize: 14,
                    color: COLORS.textPrimary,
                  }}>
                    {r.studentName}
                  </div>
                  <div style={{
                    fontSize: 12,
                    color: COLORS.textMuted,
                    marginTop: 2,
                  }}>
                    {r.className} · {r.originalFileName}
                  </div>
                </div>
                <span style={{
                  fontWeight: 700,
                  fontSize: 14,
                  color: r.dyslexiaScore >= 70 ? COLORS.riskHigh : r.dyslexiaScore >= 45 ? COLORS.riskMedium : COLORS.riskLow,
                }}>
                  {r.dyslexiaScore?.toFixed(1)}%
                </span>
                <span style={{
                  fontWeight: 700,
                  fontSize: 14,
                  color: r.dysgraphiaScore >= 70 ? COLORS.riskHigh : r.dysgraphiaScore >= 45 ? COLORS.riskMedium : COLORS.riskLow,
                }}>
                  {r.dysgraphiaScore?.toFixed(1)}%
                </span>
                <RiskBadge level={r.riskLevel} />
                <span style={{ fontSize: 13, color: COLORS.textMuted }}>
                  {r.createdAt ? format(new Date(r.createdAt), 'MMM d, yyyy') : '—'}
                </span>
                <span style={{ color: COLORS.textMuted }}>
                  {expandedId === r.reportId ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </span>
              </div>

              <AnimatePresence>
                {expandedId === r.reportId && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{
                      padding: '0 24px 24px',
                      borderTop: `1px solid ${COLORS.border}`,
                      paddingTop: 24,
                    }}>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 24,
                      }}>
                        <div>
                          <div style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: COLORS.textMuted,
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            marginBottom: 16,
                          }}>
                            Score Breakdown
                          </div>
                          <ScoreBar label="Dyslexia Score" value={r.dyslexiaScore} />
                          <ScoreBar label="Dysgraphia Score" value={r.dysgraphiaScore} />
                        </div>
                        <div style={{
                          background: COLORS.bgSubtle,
                          borderRadius: 12,
                          padding: 20,
                        }}>
                          <div style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: COLORS.textMuted,
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            marginBottom: 12,
                          }}>
                            AI Analysis Summary
                          </div>
                          <p style={{
                            fontSize: 14,
                            color: COLORS.textSecondary,
                            lineHeight: 1.75,
                          }}>
                            {r.aiComment || 'No AI commentary available for this assessment.'}
                          </p>
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
