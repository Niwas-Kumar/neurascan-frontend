import { useEffect, useState, useMemo, useCallback } from 'react'
import { Search, Filter, FileText, Download, Eye, ChevronUp, ChevronDown, X } from 'lucide-react'
import { optimizedAnalysisAPI } from '../../services/optimizedApi'
import { exportAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useDebounce } from '../../hooks'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import AiCommentary from '../../components/shared/AiCommentary'

// ════════════════════════════════════════════════════════════════
// DESIGN SYSTEM - Matching reference exactly
// ════════════════════════════════════════════════════════════════
const COLORS = {
  sidebar: '#312E81',
  primary: '#14B8A6',
  primaryHover: '#0D9488',

  bgBase: '#F8FAFC',
  bgCard: '#FFFFFF',
  bgMuted: '#F1F5F9',

  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#64748B',

  border: '#E2E8F0',

  riskHigh: '#ef4444',
  riskHighBg: 'rgba(239, 68, 68, 0.1)',
  riskMedium: '#f59e0b',
  riskMediumBg: 'rgba(245, 158, 11, 0.1)',
  riskLow: '#22c55e',
  riskLowBg: 'rgba(34, 197, 94, 0.1)',
}

function RiskBadge({ risk }) {
  const styles = {
    LOW: { bg: COLORS.riskLowBg, color: COLORS.riskLow, border: 'rgba(34, 197, 94, 0.2)' },
    MEDIUM: { bg: COLORS.riskMediumBg, color: COLORS.riskMedium, border: 'rgba(245, 158, 11, 0.2)' },
    HIGH: { bg: COLORS.riskHighBg, color: COLORS.riskHigh, border: 'rgba(239, 68, 68, 0.2)' },
  }
  const labels = { LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High' }
  const s = styles[risk] || styles.LOW

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: 9999,
        fontSize: 12,
        fontWeight: 500,
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
      }}
    >
      {labels[risk] || risk}
    </span>
  )
}

function ScoreBar({ value, color }) {
  const percentage = Math.min(Math.max(value || 0, 0), 100)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 100 }}>
      <div
        style={{
          flex: 1,
          height: 6,
          background: COLORS.bgMuted,
          borderRadius: 9999,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${percentage}%`,
            background: color,
            borderRadius: 9999,
          }}
        />
      </div>
      <span style={{ fontSize: 12, fontFamily: 'monospace', color: COLORS.textMuted, width: 32, flexShrink: 0 }}>
        {percentage.toFixed(0)}%
      </span>
    </div>
  )
}

function ProgressBar({ value }) {
  const percentage = Math.min(Math.max(value || 0, 0), 100)
  return (
    <div
      style={{
        height: 8,
        background: COLORS.bgMuted,
        borderRadius: 9999,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${percentage}%`,
          background: COLORS.primary,
          borderRadius: 9999,
        }}
      />
    </div>
  )
}

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

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
// SELECT COMPONENT
// ════════════════════════════════════════════════════════════════
function Select({ value, onChange, options, placeholder, icon: Icon }) {
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          appearance: 'none',
          padding: '10px 36px 10px 12px',
          paddingLeft: Icon ? 36 : 12,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 8,
          background: COLORS.bgCard,
          color: COLORS.textPrimary,
          fontSize: 14,
          fontFamily: "'Inter', sans-serif",
          cursor: 'pointer',
          minWidth: 120,
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {Icon && (
        <Icon
          size={16}
          style={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            color: COLORS.textMuted,
            pointerEvents: 'none',
          }}
        />
      )}
      <ChevronDown
        size={16}
        style={{
          position: 'absolute',
          right: 12,
          top: '50%',
          transform: 'translateY(-50%)',
          color: COLORS.textMuted,
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// DIALOG COMPONENT
// ════════════════════════════════════════════════════════════════
function Dialog({ open, onClose, children }) {
  if (!open) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.5)',
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: COLORS.bgCard,
          borderRadius: 12,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          maxWidth: 480,
          width: '100%',
          maxHeight: '85vh',
          overflow: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// MAIN REPORTS PAGE
// ════════════════════════════════════════════════════════════════
export function ReportsPage() {
  const { user } = useAuth()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [riskFilter, setRiskFilter] = useState('all')
  const [classFilter, setClassFilter] = useState('all')
  const [sortKey, setSortKey] = useState('date')
  const [sortAsc, setSortAsc] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)
  const debouncedSearch = useDebounce(search)

  const loadReports = useCallback(() => {
    setLoading(true)

    optimizedAnalysisAPI.getReports()
      .then(res => {
        setReports(res?.data?.data || [])
      })
      .catch(() => {
        toast.error('Failed to load reports')
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    loadReports()
  }, [loadReports])

  const classes = useMemo(() => {
    return Array.from(new Set(reports.map((r) => r.className).filter(Boolean))).sort()
  }, [reports])

  const filtered = useMemo(() => {
    let result = reports.filter((r) => {
      const matchSearch =
        !debouncedSearch ||
        r.studentName?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        r.className?.toLowerCase().includes(debouncedSearch.toLowerCase())
      const matchRisk = riskFilter === 'all' || r.riskLevel === riskFilter
      const matchClass = classFilter === 'all' || r.className === classFilter
      return matchSearch && matchRisk && matchClass
    })

    result = [...result].sort((a, b) => {
      let diff = 0
      if (sortKey === 'date') diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      if (sortKey === 'dyslexia') diff = (a.dyslexiaScore || 0) - (b.dyslexiaScore || 0)
      if (sortKey === 'dysgraphia') diff = (a.dysgraphiaScore || 0) - (b.dysgraphiaScore || 0)
      return sortAsc ? diff : -diff
    })

    return result
  }, [reports, debouncedSearch, riskFilter, classFilter, sortKey, sortAsc])

  const toggleSort = (key) => {
    if (sortKey === key) setSortAsc(!sortAsc)
    else {
      setSortKey(key)
      setSortAsc(false)
    }
  }

  const SortIcon = ({ k }) =>
    sortKey === k ? (
      sortAsc ? (
        <ChevronUp size={14} style={{ marginLeft: 4 }} />
      ) : (
        <ChevronDown size={14} style={{ marginLeft: 4 }} />
      )
    ) : null

  const handleExport = async () => {
    const tid = toast.loading('Generating CSV...')
    try {
      const res = await exportAPI.reports()
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = `NeuraScan_Reports_${format(new Date(), 'yyyy-MM-dd')}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success('Export completed', { id: tid })
    } catch (e) {
      toast.error('Export failed', { id: tid })
    }
  }

  return (
    <div style={{ padding: '16px 24px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 32,
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 28,
              fontWeight: 700,
              color: COLORS.textPrimary,
              marginBottom: 4,
            }}
          >
            Reports
          </h1>
          <p style={{ color: COLORS.textMuted, fontSize: 14 }}>
            All AI-generated handwriting analysis reports
          </p>
        </div>
        <button
          onClick={handleExport}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 16px',
            border: `1px solid ${COLORS.border}`,
            borderRadius: 8,
            background: COLORS.bgCard,
            color: COLORS.textPrimary,
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div
        style={{
          background: COLORS.bgCard,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 12,
          padding: 16,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          {/* Search Input */}
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: COLORS.textMuted,
              }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student or class..."
              style={{
                width: '100%',
                padding: '10px 12px 10px 36px',
                border: `1px solid ${COLORS.border}`,
                borderRadius: 8,
                background: COLORS.bgCard,
                color: COLORS.textPrimary,
                fontSize: 14,
                fontFamily: "'Inter', sans-serif",
                outline: 'none',
              }}
            />
          </div>

          {/* Risk Filter */}
          <Select
            value={riskFilter}
            onChange={setRiskFilter}
            icon={Filter}
            options={[
              { value: 'all', label: 'All Risk' },
              { value: 'LOW', label: 'Low' },
              { value: 'MEDIUM', label: 'Medium' },
              { value: 'HIGH', label: 'High' },
            ]}
          />

          {/* Class Filter */}
          <Select
            value={classFilter}
            onChange={setClassFilter}
            options={[
              { value: 'all', label: 'All Classes' },
              ...classes.map((c) => ({ value: c, label: c })),
            ]}
          />
        </div>
      </div>

      {/* Desktop Table */}
      <div
        style={{
          background: COLORS.bgCard,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 12,
          overflow: 'hidden',
          display: window.innerWidth >= 768 ? 'block' : 'none',
        }}
        className="hidden-mobile"
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: COLORS.bgMuted }}>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: 12, fontWeight: 500, color: COLORS.textMuted }}>
                Student
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 500, color: COLORS.textMuted }}>
                Class
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 500, color: COLORS.textMuted }}>
                <button
                  onClick={() => toggleSort('dyslexia')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: COLORS.textMuted,
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                >
                  Dyslexia <SortIcon k="dyslexia" />
                </button>
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 500, color: COLORS.textMuted }}>
                <button
                  onClick={() => toggleSort('dysgraphia')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: COLORS.textMuted,
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                >
                  Dysgraphia <SortIcon k="dysgraphia" />
                </button>
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 500, color: COLORS.textMuted }}>
                Risk
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 500, color: COLORS.textMuted }}>
                <button
                  onClick={() => toggleSort('date')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: COLORS.textMuted,
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                >
                  Date <SortIcon k="date" />
                </button>
              </th>
              <th style={{ padding: '12px 24px', textAlign: 'right', fontSize: 12, fontWeight: 500, color: COLORS.textMuted }}>
                View
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ padding: 48, textAlign: 'center', color: COLORS.textMuted }}>
                  Loading reports...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: 48, textAlign: 'center' }}>
                  <FileText size={32} color={COLORS.textMuted} style={{ marginBottom: 12 }} />
                  <p style={{ color: COLORS.textMuted }}>No reports found</p>
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr
                  key={r.reportId}
                  style={{ borderTop: `1px solid ${COLORS.border}` }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.bgMuted)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          background: `rgba(20, 184, 166, 0.1)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 600,
                          fontSize: 14,
                          color: COLORS.primary,
                        }}
                      >
                        {r.studentName?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p style={{ fontWeight: 500, fontSize: 14, color: COLORS.textPrimary }}>{r.studentName}</p>
                        <p
                          style={{
                            fontSize: 12,
                            color: COLORS.textMuted,
                            maxWidth: 140,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {r.originalFileName}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px', fontSize: 14, color: COLORS.textPrimary }}>{r.className}</td>
                  <td style={{ padding: '16px' }}>
                    <ScoreBar value={r.dyslexiaScore} color={COLORS.primary} />
                  </td>
                  <td style={{ padding: '16px' }}>
                    <ScoreBar value={r.dysgraphiaScore} color={COLORS.sidebar} />
                  </td>
                  <td style={{ padding: '16px' }}>
                    <RiskBadge risk={r.riskLevel} />
                  </td>
                  <td style={{ padding: '16px', fontSize: 14, color: COLORS.textMuted }}>{formatDate(r.createdAt)}</td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <button
                      onClick={() => setSelectedReport(r)}
                      style={{
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'transparent',
                        border: 'none',
                        borderRadius: 6,
                        cursor: 'pointer',
                        color: COLORS.textMuted,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.primary)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.textMuted)}
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="mobile-only" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {loading ? (
          <div
            style={{
              background: COLORS.bgCard,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 12,
              padding: 48,
              textAlign: 'center',
              color: COLORS.textMuted,
            }}
          >
            Loading reports...
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              background: COLORS.bgCard,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 12,
              padding: 48,
              textAlign: 'center',
            }}
          >
            <FileText size={32} color={COLORS.textMuted} style={{ marginBottom: 12 }} />
            <p style={{ color: COLORS.textMuted }}>No reports found</p>
          </div>
        ) : (
          filtered.map((r) => (
            <div
              key={r.reportId}
              style={{
                background: COLORS.bgCard,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 12,
                padding: 16,
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: `rgba(20, 184, 166, 0.1)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 600,
                      fontSize: 16,
                      color: COLORS.primary,
                    }}
                  >
                    {r.studentName?.charAt(0) || '?'}
                  </div>
                  <div>
                    <p style={{ fontWeight: 500, fontSize: 14, color: COLORS.textPrimary }}>{r.studentName}</p>
                    <p style={{ fontSize: 12, color: COLORS.textMuted }}>{r.className}</p>
                  </div>
                </div>
                <RiskBadge risk={r.riskLevel} />
              </div>

              {/* Scores */}
              <div
                style={{
                  borderTop: `1px solid ${COLORS.border}`,
                  paddingTop: 12,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 16,
                    marginBottom: 8,
                  }}
                >
                  <span style={{ fontSize: 12, color: COLORS.textMuted, width: 80 }}>Dyslexia</span>
                  <ScoreBar value={r.dyslexiaScore} color={COLORS.primary} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                  <span style={{ fontSize: 12, color: COLORS.textMuted, width: 80 }}>Dysgraphia</span>
                  <ScoreBar value={r.dysgraphiaScore} color={COLORS.sidebar} />
                </div>
              </div>

              {/* Footer */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: `1px solid ${COLORS.border}`,
                  paddingTop: 12,
                }}
              >
                <span style={{ fontSize: 12, color: COLORS.textMuted }}>{formatDate(r.createdAt)}</span>
                <button
                  onClick={() => setSelectedReport(r)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 12px',
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 6,
                    background: COLORS.bgCard,
                    color: COLORS.textPrimary,
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: 'pointer',
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  <Eye size={14} />
                  View Report
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Report Count */}
      {filtered.length > 0 && (
        <p style={{ textAlign: 'center', fontSize: 14, color: COLORS.textMuted, marginTop: 24 }}>
          Showing {filtered.length} of {reports.length} reports
        </p>
      )}

      {/* Report Detail Dialog */}
      <Dialog open={!!selectedReport} onClose={() => setSelectedReport(null)}>
        {selectedReport && (
          <>
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${COLORS.border}` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <h2
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: 20,
                      fontWeight: 700,
                      color: COLORS.textPrimary,
                      marginBottom: 4,
                    }}
                  >
                    Report - {selectedReport.studentName}
                  </h2>
                  <p style={{ fontSize: 14, color: COLORS.textMuted }}>
                    {selectedReport.className} · {formatDate(selectedReport.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedReport(null)}
                  style={{
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: 6,
                    cursor: 'pointer',
                    color: COLORS.textMuted,
                  }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div style={{ padding: 24 }}>
              {/* Risk Level */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 20,
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 500, color: COLORS.textPrimary }}>Risk Level</span>
                <RiskBadge risk={selectedReport.riskLevel} />
              </div>

              {/* Scores */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 14, color: COLORS.textMuted }}>Dyslexia Score</span>
                    <span style={{ fontSize: 14, fontFamily: 'monospace', fontWeight: 500 }}>
                      {(selectedReport.dyslexiaScore || 0).toFixed(1)}%
                    </span>
                  </div>
                  <ProgressBar value={selectedReport.dyslexiaScore} />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 14, color: COLORS.textMuted }}>Dysgraphia Score</span>
                    <span style={{ fontSize: 14, fontFamily: 'monospace', fontWeight: 500 }}>
                      {(selectedReport.dysgraphiaScore || 0).toFixed(1)}%
                    </span>
                  </div>
                  <ProgressBar value={selectedReport.dysgraphiaScore} />
                </div>
              </div>

              {/* AI Analysis */}
              <div
                style={{
                  background: COLORS.bgMuted,
                  borderRadius: 8,
                  padding: 16,
                  marginBottom: 16,
                }}
              >
                <p style={{ fontSize: 12, fontWeight: 500, color: COLORS.textMuted, marginBottom: 6 }}>AI Analysis</p>
                <AiCommentary text={selectedReport.aiComment} fontSize={13} />
              </div>

              {/* File Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: COLORS.textMuted }}>
                <FileText size={14} />
                {selectedReport.originalFileName}
              </div>
            </div>
          </>
        )}
      </Dialog>

      {/* Mobile/Desktop Visibility Styles */}
      <style>{`
        @media (min-width: 768px) {
          .mobile-only { display: none !important; }
          .hidden-mobile { display: block !important; }
        }
        @media (max-width: 767px) {
          .mobile-only { display: flex !important; }
          .hidden-mobile { display: none !important; }
        }
      `}</style>
    </div>
  )
}
