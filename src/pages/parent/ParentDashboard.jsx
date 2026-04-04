import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingDown, TrendingUp, AlertTriangle, CheckCircle2, FileText, Brain, Calendar,
  Link as LinkIcon, UserPlus, X, RefreshCw, Unlink, Shield, Check, ChevronRight,
  AlertCircle, Loader2, Mail
} from 'lucide-react'
import { optimizedAnalysisAPI } from '../../services/optimizedApi'
import { parentStudentAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

// ════════════════════════════════════════════════════════════════
// DESIGN SYSTEM
// ════════════════════════════════════════════════════════════════
const COLORS = {
  sidebar: '#312E81',
  primary: '#14B8A6',
  primaryHover: '#0D9488',
  primaryBg: 'rgba(20, 184, 166, 0.1)',

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

// ════════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ════════════════════════════════════════════════════════════════
function RiskBadge({ risk }) {
  const styles = {
    LOW: { bg: COLORS.riskLowBg, color: COLORS.riskLow, border: 'rgba(34, 197, 94, 0.2)' },
    MEDIUM: { bg: COLORS.riskMediumBg, color: COLORS.riskMedium, border: 'rgba(245, 158, 11, 0.2)' },
    HIGH: { bg: COLORS.riskHighBg, color: COLORS.riskHigh, border: 'rgba(239, 68, 68, 0.2)' },
  }
  const labels = { LOW: 'Low Risk', MEDIUM: 'Medium Risk', HIGH: 'High Risk' }
  const s = styles[risk] || styles.LOW

  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: 9999,
      fontSize: 12,
      fontWeight: 500,
      background: s.bg,
      color: s.color,
      border: `1px solid ${s.border}`,
    }}>
      {labels[risk] || risk}
    </span>
  )
}

function ProgressBar({ value }) {
  const percentage = Math.min(Math.max(value || 0, 0), 100)
  return (
    <div style={{ height: 12, background: COLORS.bgMuted, borderRadius: 9999, overflow: 'hidden' }}>
      <div style={{
        height: '100%',
        width: `${percentage}%`,
        background: COLORS.primary,
        borderRadius: 9999,
        transition: 'width 0.5s ease',
      }} />
    </div>
  )
}

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function formatShort(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function scoreLabel(v) {
  if (v < 30) return 'Within normal range'
  if (v < 60) return 'Mild indicators present'
  return 'Significant indicators'
}

// ════════════════════════════════════════════════════════════════
// CONNECTION WIZARD MODAL
// ════════════════════════════════════════════════════════════════
function ConnectionWizard({ isOpen, onClose, onSuccess }) {
  const [step, setStep] = useState(1) // 1: Enter ID, 2: Verify, 3: Success
  const [studentId, setStudentId] = useState('')
  const [studentInfo, setStudentInfo] = useState(null)
  const [relationshipId, setRelationshipId] = useState(null)
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const resetWizard = () => {
    setStep(1)
    setStudentId('')
    setStudentInfo(null)
    setRelationshipId(null)
    setOtp('')
    setError(null)
  }

  const handleClose = () => {
    resetWizard()
    onClose()
  }

  // Step 1: Validate student ID
  const handleValidateStudent = async () => {
    if (!studentId.trim()) {
      setError('Please enter a student ID')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await parentStudentAPI.validateStudent(studentId.trim())
      const data = res.data.data

      if (!data.valid) {
        setError(data.message)
        return
      }

      setStudentInfo(data)

      // Initiate connection
      const connectRes = await parentStudentAPI.connectStudent(studentId.trim())
      const connectData = connectRes.data.data

      setRelationshipId(connectData.relationshipId)
      setStep(2)
      toast.success('Verification code sent to your email')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to validate student ID')
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Verify OTP
  const handleVerifyOTP = async () => {
    if (!otp.trim() || otp.length !== 6) {
      setError('Please enter the 6-digit verification code')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await parentStudentAPI.verifyConnection(relationshipId, otp.trim())
      const data = res.data.data

      if (!data.success) {
        setError(data.message)
        return
      }

      setStep(3)
      toast.success('Connected successfully!')
      setTimeout(() => {
        onSuccess()
        handleClose()
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  // Resend OTP
  const handleResendOTP = async () => {
    setLoading(true)
    setError(null)

    try {
      await parentStudentAPI.resendOTP(relationshipId)
      toast.success('New verification code sent')
    } catch (err) {
      setError('Failed to resend code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 20,
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        style={{
          background: COLORS.bgCard,
          borderRadius: 16,
          maxWidth: 480,
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
        }}
      >
        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryHover} 100%)`,
          padding: '24px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <h2 style={{
              color: 'white',
              fontSize: 20,
              fontWeight: 700,
              marginBottom: 4,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              {step === 3 ? 'Connection Successful!' : 'Connect to Your Child'}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
              {step === 1 && 'Step 1: Enter Student ID'}
              {step === 2 && 'Step 2: Verify with Code'}
              {step === 3 && 'Connection established'}
            </p>
          </div>
          <button onClick={handleClose} style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: 8,
            padding: 8,
            cursor: 'pointer',
            color: 'white',
          }}>
            <X size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        <div style={{ display: 'flex', padding: '16px 24px', gap: 8 }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              background: step >= s ? COLORS.primary : COLORS.bgMuted,
              transition: 'background 0.3s ease',
            }} />
          ))}
        </div>

        {/* Content */}
        <div style={{ padding: '0 28px 28px' }}>
          {/* Step 1: Enter Student ID */}
          {step === 1 && (
            <div>
              <div style={{
                background: COLORS.primaryBg,
                borderRadius: 12,
                padding: 16,
                marginBottom: 20,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
              }}>
                <Shield size={20} color={COLORS.primary} style={{ marginTop: 2 }} />
                <p style={{ fontSize: 13, color: COLORS.textSecondary, lineHeight: 1.6 }}>
                  Enter your child's Student ID to connect. You'll receive a verification code via email to confirm.
                </p>
              </div>

              <label style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 600,
                color: COLORS.textSecondary,
                marginBottom: 8,
              }}>
                Student ID
              </label>
              <input
                type="text"
                value={studentId}
                onChange={e => setStudentId(e.target.value)}
                placeholder="Enter student ID"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: `2px solid ${error ? COLORS.riskHigh : COLORS.border}`,
                  borderRadius: 10,
                  fontSize: 16,
                  fontFamily: 'monospace',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onKeyPress={e => e.key === 'Enter' && handleValidateStudent()}
              />

              {error && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginTop: 12,
                  color: COLORS.riskHigh,
                  fontSize: 13,
                }}>
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <button
                onClick={handleValidateStudent}
                disabled={loading}
                style={{
                  width: '100%',
                  marginTop: 20,
                  padding: '14px',
                  background: COLORS.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <ChevronRight size={18} />}
                {loading ? 'Validating...' : 'Continue'}
              </button>
            </div>
          )}

          {/* Step 2: Verify OTP */}
          {step === 2 && (
            <div>
              {/* Student Preview */}
              {studentInfo && (
                <div style={{
                  background: COLORS.bgMuted,
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 20,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: COLORS.primaryBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 20,
                    color: COLORS.primary,
                  }}>
                    {studentInfo.studentName?.charAt(0) || '?'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: COLORS.textPrimary, marginBottom: 2 }}>
                      {studentInfo.studentName}
                    </div>
                    <div style={{ fontSize: 13, color: COLORS.textMuted }}>
                      {studentInfo.className} • {studentInfo.teacherName}
                    </div>
                  </div>
                </div>
              )}

              <div style={{
                background: 'rgba(99, 102, 241, 0.1)',
                borderRadius: 12,
                padding: 16,
                marginBottom: 20,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
              }}>
                <Mail size={20} color="#6366F1" style={{ marginTop: 2 }} />
                <p style={{ fontSize: 13, color: COLORS.textSecondary, lineHeight: 1.6 }}>
                  We sent a 6-digit verification code to your email. Enter it below to complete the connection.
                </p>
              </div>

              <label style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 600,
                color: COLORS.textSecondary,
                marginBottom: 8,
              }}>
                Verification Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: `2px solid ${error ? COLORS.riskHigh : COLORS.border}`,
                  borderRadius: 10,
                  fontSize: 24,
                  fontFamily: 'monospace',
                  letterSpacing: '0.5em',
                  textAlign: 'center',
                  outline: 'none',
                }}
                onKeyPress={e => e.key === 'Enter' && handleVerifyOTP()}
              />

              {error && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginTop: 12,
                  color: COLORS.riskHigh,
                  fontSize: 13,
                }}>
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <button
                  onClick={handleResendOTP}
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: COLORS.bgMuted,
                    color: COLORS.textSecondary,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <RefreshCw size={16} />
                  Resend
                </button>
                <button
                  onClick={handleVerifyOTP}
                  disabled={loading || otp.length !== 6}
                  style={{
                    flex: 2,
                    padding: '12px',
                    background: otp.length === 6 ? COLORS.primary : COLORS.bgMuted,
                    color: otp.length === 6 ? 'white' : COLORS.textMuted,
                    border: 'none',
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: (loading || otp.length !== 6) ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                  Verify
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: COLORS.riskLowBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}>
                <CheckCircle2 size={40} color={COLORS.riskLow} />
              </div>
              <h3 style={{
                fontSize: 22,
                fontWeight: 700,
                color: COLORS.textPrimary,
                marginBottom: 8,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}>
                Connected!
              </h3>
              <p style={{ color: COLORS.textMuted, fontSize: 14 }}>
                You are now connected to {studentInfo?.studentName}.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// CONNECTED STUDENTS LIST
// ════════════════════════════════════════════════════════════════
function ConnectedStudentsList({ students, onSelectStudent, selectedId, onDisconnect, onSetPrimary }) {
  if (!students || students.length === 0) return null

  return (
    <div style={{
      background: COLORS.bgCard,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 12,
      padding: 20,
      marginBottom: 24,
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
      }}>
        <h3 style={{
          fontSize: 16,
          fontWeight: 600,
          color: COLORS.textPrimary,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>
          Connected Students
        </h3>
        <span style={{
          fontSize: 12,
          color: COLORS.textMuted,
          background: COLORS.bgMuted,
          padding: '4px 10px',
          borderRadius: 12,
        }}>
          {students.filter(s => s.verificationStatus === 'VERIFIED').length} active
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {students.map(student => (
          <div
            key={student.studentId}
            onClick={() => student.canAccessData && onSelectStudent(student.studentId)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: 12,
              borderRadius: 10,
              background: selectedId === student.studentId ? COLORS.primaryBg : COLORS.bgMuted,
              border: selectedId === student.studentId ? `2px solid ${COLORS.primary}` : '2px solid transparent',
              cursor: student.canAccessData ? 'pointer' : 'default',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: student.isPrimary ? COLORS.primary : COLORS.bgCard,
              border: `2px solid ${student.isPrimary ? COLORS.primary : COLORS.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 16,
              color: student.isPrimary ? 'white' : COLORS.primary,
            }}>
              {student.studentName?.charAt(0) || '?'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <span style={{ fontWeight: 600, color: COLORS.textPrimary, fontSize: 14 }}>
                  {student.studentName}
                </span>
                {student.isPrimary && (
                  <span style={{
                    background: COLORS.primary,
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: 4,
                    fontSize: 10,
                    fontWeight: 600,
                  }}>
                    PRIMARY
                  </span>
                )}
                {student.verificationStatus === 'PENDING' && (
                  <span style={{
                    background: COLORS.riskMediumBg,
                    color: COLORS.riskMedium,
                    padding: '2px 6px',
                    borderRadius: 4,
                    fontSize: 10,
                    fontWeight: 600,
                  }}>
                    PENDING
                  </span>
                )}
              </div>
              <span style={{ fontSize: 12, color: COLORS.textMuted }}>
                {student.studentClassName}
              </span>
            </div>
            {student.canAccessData && !student.isPrimary && (
              <button
                onClick={e => { e.stopPropagation(); onSetPrimary(student.studentId) }}
                style={{
                  background: 'transparent',
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 6,
                  padding: '4px 8px',
                  fontSize: 11,
                  color: COLORS.textMuted,
                  cursor: 'pointer',
                }}
              >
                Set Primary
              </button>
            )}
            <button
              onClick={e => { e.stopPropagation(); onDisconnect(student.studentId, student.studentName) }}
              style={{
                background: 'transparent',
                border: 'none',
                padding: 4,
                color: COLORS.textMuted,
                cursor: 'pointer',
              }}
              title="Disconnect"
            >
              <Unlink size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════
export default function ParentDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [report, setReport] = useState(null)
  const [previousReports, setPreviousReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [noData, setNoData] = useState(false)

  // Connection state
  const [connectedStudents, setConnectedStudents] = useState([])
  const [selectedStudentId, setSelectedStudentId] = useState(null)
  const [showConnectionWizard, setShowConnectionWizard] = useState(false)
  const [loadingConnections, setLoadingConnections] = useState(true)

  // Load connected students
  const loadConnectedStudents = useCallback(async () => {
    try {
      const res = await parentStudentAPI.getConnectedStudents()
      const data = res.data.data
      setConnectedStudents(data.students || [])

      // Auto-select primary or first verified student
      const primary = data.students?.find(s => s.isPrimary && s.canAccessData)
      const firstVerified = data.students?.find(s => s.canAccessData)
      const autoSelect = primary || firstVerified
      if (autoSelect) {
        setSelectedStudentId(autoSelect.studentId)
      }
    } catch (err) {
      console.error('Failed to load connected students:', err)
    } finally {
      setLoadingConnections(false)
    }
  }, [])

  // Load report for selected student
  const loadReport = useCallback(async (studentId) => {
    if (!studentId) {
      setNoData(true)
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const res = await optimizedAnalysisAPI.getStudentReport(studentId)
      const data = res.data.data
      if (Array.isArray(data) && data.length > 0) {
        const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setReport(sorted[0])
        setPreviousReports(sorted.slice(1, 4))
        setNoData(false)
      } else if (data && !Array.isArray(data)) {
        setReport(data)
        setNoData(false)
      } else {
        setNoData(true)
      }
    } catch (err) {
      console.error('Failed to load report:', err)
      setNoData(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadConnectedStudents()
  }, [loadConnectedStudents])

  useEffect(() => {
    if (selectedStudentId) {
      loadReport(selectedStudentId)
    } else if (!loadingConnections) {
      setLoading(false)
    }
  }, [selectedStudentId, loadReport, loadingConnections])

  const handleSelectStudent = (studentId) => {
    setSelectedStudentId(studentId)
  }

  const handleDisconnect = async (studentId, studentName) => {
    if (!confirm(`Are you sure you want to disconnect from ${studentName}?`)) return

    try {
      await parentStudentAPI.disconnectStudent(studentId, 'User requested')
      toast.success(`Disconnected from ${studentName}`)
      loadConnectedStudents()
    } catch (err) {
      toast.error('Failed to disconnect')
    }
  }

  const handleSetPrimary = async (studentId) => {
    try {
      await parentStudentAPI.setPrimaryStudent(studentId)
      toast.success('Primary student updated')
      loadConnectedStudents()
    } catch (err) {
      toast.error('Failed to update primary student')
    }
  }

  const handleConnectionSuccess = () => {
    loadConnectedStudents()
  }

  // Selected student info
  const selectedStudent = connectedStudents.find(s => s.studentId === selectedStudentId)
  const child = report ? {
    name: report.studentName || selectedStudent?.studentName || 'Your Child',
    rollNumber: report.rollNumber || selectedStudentId || 'N/A',
    className: report.className || selectedStudent?.studentClassName || 'N/A',
    teacherName: report.teacherName || 'Teacher',
    school: report.schoolName || 'School',
  } : null

  const isImproving = previousReports.length > 0 && report &&
    (report.dyslexiaScore < previousReports[0]?.dyslexiaScore)

  const hasNoConnections = !loadingConnections && connectedStudents.filter(s => s.canAccessData).length === 0

  // ════════════════════════════════════════════════════════════════
  // LOADING STATE
  // ════════════════════════════════════════════════════════════════
  if (loadingConnections || loading) {
    return (
      <div style={{ padding: '16px 24px' }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ height: 32, width: 240, background: COLORS.bgMuted, borderRadius: 8, marginBottom: 8 }} />
          <div style={{ height: 18, width: 200, background: COLORS.bgMuted, borderRadius: 6 }} />
        </div>
        <div style={{
          background: COLORS.bgCard,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 12,
          padding: 20,
          animation: 'pulse 1.5s infinite',
        }}>
          <div style={{ height: 64, background: COLORS.bgMuted, borderRadius: 8 }} />
        </div>
        <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
      </div>
    )
  }

  // ════════════════════════════════════════════════════════════════
  // NO CONNECTIONS STATE - SHOW CONNECTION WIZARD PROMPT
  // ════════════════════════════════════════════════════════════════
  if (hasNoConnections) {
    return (
      <div style={{ padding: '16px 24px' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 28,
            fontWeight: 700,
            color: COLORS.textPrimary,
            marginBottom: 4,
          }}>
            Welcome, {user?.name?.split(' ')[0] || 'Parent'}!
          </h1>
          <p style={{ color: COLORS.textMuted, fontSize: 14 }}>
            Connect to your child's account to view their progress
          </p>
        </div>

        <div style={{
          background: COLORS.bgCard,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 16,
          padding: 48,
          textAlign: 'center',
          maxWidth: 520,
        }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: COLORS.primaryBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <UserPlus size={36} color={COLORS.primary} />
          </div>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 22,
            fontWeight: 700,
            color: COLORS.textPrimary,
            marginBottom: 12,
          }}>
            Connect to Your Child
          </h2>
          <p style={{
            fontSize: 14,
            color: COLORS.textMuted,
            lineHeight: 1.7,
            marginBottom: 28,
            maxWidth: 380,
            margin: '0 auto 28px',
          }}>
            Link your child's student ID to view their assessment reports, track progress over time, and receive quiz notifications from teachers.
          </p>
          <button
            onClick={() => setShowConnectionWizard(true)}
            style={{
              padding: '14px 32px',
              background: COLORS.primary,
              color: 'white',
              border: 'none',
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <LinkIcon size={18} />
            Connect Student
          </button>

          <div style={{
            marginTop: 32,
            padding: 20,
            background: COLORS.bgMuted,
            borderRadius: 12,
            textAlign: 'left',
          }}>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: COLORS.textPrimary, marginBottom: 12 }}>
              How it works:
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { step: 1, text: "Enter your child's Student ID" },
                { step: 2, text: "Verify with a code sent to your email" },
                { step: 3, text: "View reports and track progress" },
              ].map(({ step, text }) => (
                <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: COLORS.primary,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 700,
                  }}>
                    {step}
                  </div>
                  <span style={{ fontSize: 13, color: COLORS.textSecondary }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showConnectionWizard && (
            <ConnectionWizard
              isOpen={showConnectionWizard}
              onClose={() => setShowConnectionWizard(false)}
              onSuccess={handleConnectionSuccess}
            />
          )}
        </AnimatePresence>
      </div>
    )
  }

  // ════════════════════════════════════════════════════════════════
  // NO DATA FOR SELECTED STUDENT
  // ════════════════════════════════════════════════════════════════
  if (noData || !report) {
    return (
      <div style={{ padding: '16px 24px' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 28,
            fontWeight: 700,
            color: COLORS.textPrimary,
            marginBottom: 4,
          }}>
            {selectedStudent?.studentName || 'Your Child'}'s Overview
          </h1>
          <p style={{ color: COLORS.textMuted, fontSize: 14 }}>
            No assessments available yet
          </p>
        </div>

        {/* Connected Students List */}
        <ConnectedStudentsList
          students={connectedStudents}
          selectedId={selectedStudentId}
          onSelectStudent={handleSelectStudent}
          onDisconnect={handleDisconnect}
          onSetPrimary={handleSetPrimary}
        />

        {/* Add Student Button */}
        <button
          onClick={() => setShowConnectionWizard(true)}
          style={{
            marginBottom: 24,
            padding: '10px 16px',
            background: COLORS.bgCard,
            color: COLORS.primary,
            border: `1px dashed ${COLORS.primary}`,
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <UserPlus size={16} />
          Add Another Student
        </button>

        <div style={{
          background: COLORS.bgCard,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 12,
          padding: 40,
          textAlign: 'center',
          maxWidth: 480,
        }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: COLORS.primaryBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <Brain size={28} color={COLORS.primary} />
          </div>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 20,
            fontWeight: 700,
            color: COLORS.textPrimary,
            marginBottom: 8,
          }}>
            No Assessments Yet
          </h2>
          <p style={{
            fontSize: 14,
            color: COLORS.textMuted,
            lineHeight: 1.6,
            marginBottom: 24,
          }}>
            Once the teacher uploads an assessment for {selectedStudent?.studentName || 'your child'}, results will appear here.
          </p>
          <button
            onClick={() => navigate('/parent/progress')}
            style={{
              padding: '12px 24px',
              background: COLORS.primary,
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            View Progress
          </button>
        </div>

        <AnimatePresence>
          {showConnectionWizard && (
            <ConnectionWizard
              isOpen={showConnectionWizard}
              onClose={() => setShowConnectionWizard(false)}
              onSuccess={handleConnectionSuccess}
            />
          )}
        </AnimatePresence>
      </div>
    )
  }

  // ════════════════════════════════════════════════════════════════
  // MAIN DASHBOARD WITH DATA
  // ════════════════════════════════════════════════════════════════
  return (
    <div style={{ padding: '16px 24px', maxWidth: 900 }}>
      {/* Page Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 28,
          fontWeight: 700,
          color: COLORS.textPrimary,
          marginBottom: 4,
        }}>
          {child.name}'s Overview
        </h1>
        <p style={{ color: COLORS.textMuted, fontSize: 14 }}>
          {child.className} • {child.school}
        </p>
      </div>

      {/* Connected Students List */}
      <ConnectedStudentsList
        students={connectedStudents}
        selectedId={selectedStudentId}
        onSelectStudent={handleSelectStudent}
        onDisconnect={handleDisconnect}
        onSetPrimary={handleSetPrimary}
      />

      {/* Add Student Button */}
      <button
        onClick={() => setShowConnectionWizard(true)}
        style={{
          marginBottom: 24,
          padding: '10px 16px',
          background: COLORS.bgCard,
          color: COLORS.primary,
          border: `1px dashed ${COLORS.primary}`,
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 500,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <UserPlus size={16} />
        Add Another Student
      </button>

      {/* Child Info Card */}
      <div style={{
        background: COLORS.bgCard,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 12,
        padding: 20,
        marginBottom: 32,
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 16,
          flexWrap: 'wrap',
        }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: COLORS.primaryBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 24,
            color: COLORS.primary,
            flexShrink: 0,
          }}>
            {child.name.charAt(0)}
          </div>
          <div style={{ display: 'flex', gap: 32, flex: 1, flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 2 }}>Roll Number</p>
              <p style={{ fontSize: 14, fontWeight: 500, fontFamily: 'monospace', color: COLORS.textPrimary }}>
                {child.rollNumber}
              </p>
            </div>
            <div>
              <p style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 2 }}>Class</p>
              <p style={{ fontSize: 14, fontWeight: 500, color: COLORS.textPrimary }}>{child.className}</p>
            </div>
            <div>
              <p style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 2 }}>Teacher</p>
              <p style={{ fontSize: 14, fontWeight: 500, color: COLORS.textPrimary }}>{child.teacherName}</p>
            </div>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            color: isImproving ? COLORS.riskLow : COLORS.textMuted,
          }}>
            {isImproving ? <TrendingDown size={20} /> : <TrendingUp size={20} />}
            <span style={{ fontSize: 14, fontWeight: 500 }}>{isImproving ? 'Improving' : 'Stable'}</span>
          </div>
        </div>
      </div>

      {/* Latest Analysis Section */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 20,
          fontWeight: 700,
          color: COLORS.textPrimary,
          marginBottom: 16,
        }}>
          Latest Analysis
        </h2>
        <div style={{
          background: COLORS.bgCard,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 12,
          overflow: 'hidden',
        }}>
          <div style={{ padding: '20px 24px', borderBottom: `1px solid ${COLORS.border}` }}>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
            }}>
              <div>
                <h3 style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 18,
                  fontWeight: 600,
                  color: COLORS.textPrimary,
                  marginBottom: 4,
                }}>
                  Handwriting Analysis Report
                </h3>
                <p style={{
                  fontSize: 13,
                  color: COLORS.textMuted,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}>
                  <Calendar size={14} />
                  {formatDate(report.createdAt)}
                </p>
              </div>
              <RiskBadge risk={report.riskLevel} />
            </div>
          </div>
          <div style={{ padding: 24 }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 24,
              marginBottom: 24,
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <p style={{ fontSize: 14, fontWeight: 500, color: COLORS.textMuted }}>Dyslexia Score</p>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 16 }}>
                    {(report.dyslexiaScore || 0).toFixed(0)}%
                  </span>
                </div>
                <ProgressBar value={report.dyslexiaScore} />
                <p style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 6 }}>
                  {scoreLabel(report.dyslexiaScore)}
                </p>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <p style={{ fontSize: 14, fontWeight: 500, color: COLORS.textMuted }}>Dysgraphia Score</p>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 16 }}>
                    {(report.dysgraphiaScore || 0).toFixed(0)}%
                  </span>
                </div>
                <ProgressBar value={report.dysgraphiaScore} />
                <p style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 6 }}>
                  {scoreLabel(report.dysgraphiaScore)}
                </p>
              </div>
            </div>

            {/* AI Analysis */}
            <div style={{
              background: COLORS.primaryBg,
              border: `1px solid rgba(20, 184, 166, 0.15)`,
              borderRadius: 12,
              padding: 16,
              marginBottom: 20,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Brain size={16} color={COLORS.primary} />
                <p style={{ fontSize: 14, fontWeight: 600, color: COLORS.primary }}>AI Analysis</p>
              </div>
              <p style={{ fontSize: 14, color: COLORS.textPrimary, lineHeight: 1.6 }}>
                {report.aiComment || 'No AI commentary available for this assessment.'}
              </p>
            </div>

            {/* Recommendation Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                background: COLORS.bgMuted,
                borderRadius: 8,
                padding: 12,
              }}>
                <AlertTriangle size={16} color={COLORS.riskMedium} style={{ marginTop: 2, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: COLORS.textPrimary, marginBottom: 2 }}>Watch for</p>
                  <p style={{ fontSize: 12, color: COLORS.textMuted }}>
                    Difficulty reading aloud or confusing similar letters
                  </p>
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                background: COLORS.bgMuted,
                borderRadius: 8,
                padding: 12,
              }}>
                <CheckCircle2 size={16} color={COLORS.riskLow} style={{ marginTop: 2, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: COLORS.textPrimary, marginBottom: 2 }}>What to do</p>
                  <p style={{ fontSize: 12, color: COLORS.textMuted }}>
                    Practice phonics with games and read together daily
                  </p>
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                background: COLORS.bgMuted,
                borderRadius: 8,
                padding: 12,
              }}>
                <FileText size={16} color={COLORS.primary} style={{ marginTop: 2, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: COLORS.textPrimary, marginBottom: 2 }}>Next step</p>
                  <p style={{ fontSize: 12, color: COLORS.textMuted }}>
                    Follow-up assessment recommended in 4-6 weeks
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Previous Reports */}
      {previousReports.length > 0 && (
        <div>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 20,
            fontWeight: 700,
            color: COLORS.textPrimary,
            marginBottom: 16,
          }}>
            Previous Reports
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {previousReports.map((r, i) => (
              <div key={r.reportId || i} style={{
                background: COLORS.bgCard,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 12,
                padding: 16,
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  flexWrap: 'wrap',
                }}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: COLORS.bgMuted,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <FileText size={16} color={COLORS.textMuted} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 500, color: COLORS.textPrimary }}>
                      {formatShort(r.createdAt)}
                    </p>
                    <p style={{ fontSize: 12, color: COLORS.textMuted }}>Analysis Report</p>
                  </div>
                  <div style={{ display: 'flex', gap: 24 }}>
                    <div>
                      <p style={{ fontSize: 12, color: COLORS.textMuted }}>Dyslexia</p>
                      <p style={{ fontSize: 14, fontWeight: 500, fontFamily: 'monospace' }}>
                        {(r.dyslexiaScore || 0).toFixed(0)}%
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: 12, color: COLORS.textMuted }}>Dysgraphia</p>
                      <p style={{ fontSize: 14, fontWeight: 500, fontFamily: 'monospace' }}>
                        {(r.dysgraphiaScore || 0).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                  <RiskBadge risk={r.riskLevel} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Connection Wizard Modal */}
      <AnimatePresence>
        {showConnectionWizard && (
          <ConnectionWizard
            isOpen={showConnectionWizard}
            onClose={() => setShowConnectionWizard(false)}
            onSuccess={handleConnectionSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
