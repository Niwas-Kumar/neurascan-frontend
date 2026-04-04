import { useEffect, useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, FileImage, X, CheckCircle, AlertCircle, Brain,
  FileText, RefreshCw, ImageOff, ChevronRight, Sparkles
} from 'lucide-react'
import { optimizedStudentAPI, optimizedAnalysisAPI } from '../../services/optimizedApi'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import { Button, RiskBadge, Alert, ScoreBar } from '../../components/shared/UI'

// ════════════════════════════════════════════════════════════════
// DESIGN SYSTEM - Matching reference exactly
// ════════════════════════════════════════════════════════════════
const COLORS = {
  sidebar: '#312E81',
  primary: '#14B8A6',
  primaryHover: '#0D9488',
  primaryBg: 'rgba(20, 184, 166, 0.1)',

  secondary: '#6366F1',
  secondaryBg: 'rgba(99, 102, 241, 0.1)',

  bgBase: '#F8FAFC',
  bgSurface: '#FFFFFF',
  bgSubtle: '#F1F5F9',

  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#64748B',
  textLight: '#94A3B8',

  border: '#E2E8F0',
  borderStrong: '#CBD5E1',

  // Risk colors
  riskHigh: '#ef4444',
  riskHighBg: 'rgba(239, 68, 68, 0.1)',
  danger: '#ef4444',
  dangerBg: 'rgba(239, 68, 68, 0.1)',
  riskMedium: '#f59e0b',
  riskMediumBg: 'rgba(245, 158, 11, 0.1)',
  warning: '#f59e0b',
  warningBg: 'rgba(245, 158, 11, 0.1)',
  riskLow: '#22c55e',
  riskLowBg: 'rgba(34, 197, 94, 0.1)',
  success: '#22c55e',
  successBg: 'rgba(34, 197, 94, 0.1)',
}

const STEPS = ['Select Student', 'Upload Sample', 'AI Analysis', 'View Results']

// ════════════════════════════════════════════════════════════════
// PROGRESS STEPS COMPONENT
// ════════════════════════════════════════════════════════════════
function ProgressSteps({ steps, current }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      marginBottom: 32,
      background: COLORS.bgSurface,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 12,
      padding: '16px 24px',
    }}>
      {steps.map((step, i) => {
        const isCompleted = current > i
        const isActive = current === i
        const isLast = i === steps.length - 1

        return (
          <div
            key={step}
            style={{
              display: 'flex',
              alignItems: 'center',
              flex: isLast ? 0 : 1,
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}>
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isCompleted
                    ? COLORS.primary
                    : isActive
                    ? COLORS.primaryBg
                    : COLORS.bgSubtle,
                  borderColor: isCompleted || isActive
                    ? COLORS.primary
                    : COLORS.border,
                }}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  border: '2px solid',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-display)',
                  fontSize: 13,
                  fontWeight: 700,
                  color: isCompleted
                    ? '#FFFFFF'
                    : isActive
                    ? COLORS.primary
                    : COLORS.textLight,
                  transition: 'all 0.2s ease',
                }}
              >
                {isCompleted ? (
                  <CheckCircle size={16} />
                ) : (
                  i + 1
                )}
              </motion.div>
              <span style={{
                fontSize: 13,
                fontWeight: isActive ? 600 : 500,
                color: isActive
                  ? COLORS.primary
                  : isCompleted
                  ? COLORS.textSecondary
                  : COLORS.textMuted,
                whiteSpace: 'nowrap',
              }}>
                {step}
              </span>
            </div>
            {!isLast && (
              <div style={{
                flex: 1,
                height: 2,
                background: isCompleted ? COLORS.primary : COLORS.border,
                margin: '0 16px',
                borderRadius: 1,
                transition: 'background 0.3s ease',
              }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// MAIN UPLOAD PAGE
// ════════════════════════════════════════════════════════════════
export default function UploadPage() {
  const { user, addNotification } = useAuth()
  const [students, setStudents] = useState([])
  const [studentId, setStudentId] = useState('')
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [step, setStep] = useState(0)
  const [validationError, setValidationError] = useState(null)

  useEffect(() => {
    if (!user?.userId) return

    const loadStudents = async () => {
      try {
        const response = await optimizedStudentAPI.getAllWithIndexRetry(4, 300)
        setStudents(response?.data?.data || [])
      } catch (error) {
        console.error('UploadPage: initial student load failed:', error)
        try {
          await new Promise(resolve => setTimeout(resolve, 1200))
          const retryResponse = await optimizedStudentAPI.getAllWithIndexRetry(3, 350)
          setStudents(retryResponse?.data?.data || [])
          toast.error('Initial roster load was slow. Recovered automatically.')
        } catch (retryError) {
          console.error('UploadPage: retry student load failed:', retryError)
          toast.error('Unable to load student roster')
        }
      }
    }

    loadStudents()
  }, [user?.userId])

  const onDrop = useCallback((accepted, rejected) => {
    if (rejected.length > 0) {
      const err = rejected[0]?.errors?.[0]
      toast.error(
        err?.code === 'file-too-large'
          ? 'File exceeds 20 MB limit'
          : 'Invalid file format. Use JPG, PNG, or PDF.'
      )
      return
    }
    if (accepted[0]) {
      setFile(accepted[0])
      setResult(null)
      setValidationError(null)
      if (studentId) setStep(2)
    }
  }, [studentId])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.tiff'],
      'application/pdf': ['.pdf']
    },
    maxSize: 20 * 1024 * 1024,
    multiple: false,
  })

  const handleStudentChange = (e) => {
    setStudentId(e.target.value)
    if (e.target.value && file) setStep(2)
    else if (e.target.value) setStep(1)
    else setStep(0)
  }

  const handleSubmit = async () => {
    if (!studentId || !file) return
    setUploading(true)
    setProgress(0)
    setStep(2)

    try {
      const progressInterval = setInterval(() => {
        setProgress(p => {
          if (p >= 85) { clearInterval(progressInterval); return 85 }
          return p + 12
        })
      }, 180)

      const res = await optimizedAnalysisAPI.upload(studentId, file, (event) => {
        if (event.total) setProgress(Math.round((event.loaded / event.total) * 85))
      })

      clearInterval(progressInterval)
      setProgress(100)
      setUploading(false)
      setAnalyzing(true)

      await new Promise(r => setTimeout(r, 900))
      setAnalyzing(false)
      setResult(res.data.data)
      setStep(3)

      const isAtRisk = res.data.data.riskLevel !== 'LOW'
      toast.success('Analysis complete')
      addNotification({
        type: isAtRisk ? 'warning' : 'success',
        title: 'Analysis Complete',
        body: `${students.find(s => String(s.id) === String(studentId))?.name || 'Student'} — ${res.data.data.riskLevel} risk level`,
      })
    } catch (err) {
      setUploading(false)
      setAnalyzing(false)
      setStep(file ? 1 : 0)

      const errorData = err.response?.data
      if (errorData?.validation_error) {
        setValidationError({
          reason: errorData.reason || 'Invalid image',
          message: errorData.message || 'Upload a clear image of handwriting on paper.',
          confidence: errorData.confidence || 0
        })
        toast.error(errorData.reason || 'Invalid image detected')
      } else {
        setValidationError(null)
        toast.error(errorData?.message || 'Analysis failed. Please try again.')
      }
    }
  }

  const reset = () => {
    setFile(null)
    setResult(null)
    setProgress(0)
    setStudentId('')
    setStep(0)
    setValidationError(null)
  }

  const selectedStudent = students.find(s => String(s.id) === String(studentId))

  return (
    <div style={{
      minHeight: '100vh',
      background: COLORS.bgBase,
      padding: '32px 40px',
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 32 }}
      >
        <div style={{
          fontSize: 12,
          color: COLORS.textMuted,
          marginBottom: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          Dashboard <ChevronRight size={14} /> Upload Sample
        </div>
        <h1 style={{
          fontSize: 28,
          fontWeight: 700,
          color: COLORS.textPrimary,
          letterSpacing: '-0.02em',
          marginBottom: 8,
          fontFamily: 'var(--font-display)',
        }}>
          Upload Handwriting Sample
        </h1>
        <p style={{
          fontSize: 15,
          color: COLORS.textMuted,
          maxWidth: 560,
        }}>
          Upload a student's handwritten test paper or worksheet for AI-powered
          dyslexia and dysgraphia screening.
        </p>
      </motion.div>

      {/* Progress Steps */}
      <ProgressSteps steps={STEPS} current={step} />

      {/* Main Content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: result ? '1fr 1fr' : '1fr',
        gap: 28,
        maxWidth: result ? '100%' : 640,
      }}>
        {/* Upload Panel */}
        <motion.div
          layout
          style={{
            background: COLORS.bgSurface,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 16,
            padding: 28,
          }}
        >
          {/* Student Selector */}
          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: 'block',
              fontSize: 13,
              fontWeight: 600,
              color: COLORS.textSecondary,
              marginBottom: 8,
            }}>
              Select Student <span style={{ color: COLORS.danger }}>*</span>
            </label>
            <select
              value={studentId}
              onChange={handleStudentChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: COLORS.bgSurface,
                border: `1.5px solid ${studentId ? COLORS.primary : COLORS.border}`,
                borderRadius: 10,
                color: studentId ? COLORS.textPrimary : COLORS.textMuted,
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                cursor: 'pointer',
                outline: 'none',
                transition: 'all 0.15s ease',
                boxShadow: studentId ? '0 0 0 3px rgba(20, 184, 166, 0.1)' : 'none',
              }}
            >
              <option value="">Choose a student from your roster</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} — {s.className}
                </option>
              ))}
            </select>
          </div>

          {/* Dropzone */}
          <motion.div
            {...getRootProps()}
            animate={{
              borderColor: isDragActive
                ? COLORS.primary
                : file
                ? COLORS.secondary
                : COLORS.borderStrong,
              background: isDragActive
                ? COLORS.primaryBg
                : file
                ? 'rgba(20, 184, 166, 0.04)'
                : COLORS.bgSubtle,
            }}
            whileHover={{
              borderColor: file ? COLORS.secondary : COLORS.primary,
            }}
            style={{
              border: '2px dashed',
              borderRadius: 12,
              padding: '48px 24px',
              textAlign: 'center',
              cursor: uploading || analyzing ? 'not-allowed' : 'pointer',
              marginBottom: 24,
              transition: 'all 0.15s ease',
            }}
          >
            <input {...getInputProps()} disabled={uploading || analyzing} />

            {uploading || analyzing ? (
              <div>
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  background: COLORS.primaryBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}>
                  <Brain size={28} color={COLORS.primary} />
                </div>
                <div style={{
                  fontWeight: 600,
                  color: COLORS.textPrimary,
                  marginBottom: 12,
                  fontSize: 15,
                }}>
                  {uploading ? 'Uploading sample...' : 'Running AI analysis...'}
                </div>
                {uploading && (
                  <div>
                    <div style={{
                      height: 6,
                      background: COLORS.bgSubtle,
                      borderRadius: 3,
                      overflow: 'hidden',
                      maxWidth: 240,
                      margin: '0 auto 10px',
                    }}>
                      <motion.div
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.2 }}
                        style={{
                          height: '100%',
                          background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
                          borderRadius: 3,
                        }}
                      />
                    </div>
                    <span style={{
                      fontSize: 13,
                      color: COLORS.textMuted,
                      fontWeight: 500,
                    }}>
                      {progress}%
                    </span>
                  </div>
                )}
                {analyzing && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          background: COLORS.primary,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : file ? (
              <div>
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  background: COLORS.secondaryBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                }}>
                  <FileImage size={28} color={COLORS.secondary} />
                </div>
                <div style={{
                  fontWeight: 600,
                  color: COLORS.secondary,
                  marginBottom: 4,
                  fontSize: 15,
                }}>
                  {file.name}
                </div>
                <div style={{
                  fontSize: 13,
                  color: COLORS.textMuted,
                  marginBottom: 12,
                }}>
                  {(file.size / 1024).toFixed(0)} KB • {file.type.split('/')[1]?.toUpperCase()}
                </div>
                <button
                  onClick={e => {
                    e.stopPropagation()
                    setFile(null)
                    setStep(studentId ? 1 : 0)
                  }}
                  style={{
                    background: COLORS.bgSubtle,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 6,
                    padding: '6px 12px',
                    color: COLORS.textMuted,
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 500,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <X size={14} /> Change file
                </button>
              </div>
            ) : (
              <div>
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  background: isDragActive ? COLORS.primaryBg : COLORS.bgSurface,
                  border: `1px solid ${isDragActive ? COLORS.primary : COLORS.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  transition: 'all 0.15s ease',
                }}>
                  <Upload
                    size={24}
                    color={isDragActive ? COLORS.primary : COLORS.textMuted}
                  />
                </div>
                <p style={{
                  fontWeight: 600,
                  marginBottom: 6,
                  color: isDragActive ? COLORS.primary : COLORS.textPrimary,
                  fontSize: 15,
                }}>
                  {isDragActive ? 'Drop file here' : 'Drag & drop or click to browse'}
                </p>
                <p style={{ fontSize: 13, color: COLORS.textMuted }}>
                  Supports JPG, PNG, PDF up to 20 MB
                </p>
              </div>
            )}
          </motion.div>

          {/* Validation Error */}
          <AnimatePresence>
            {validationError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  background: COLORS.dangerBg,
                  border: `1px solid rgba(185, 28, 28, 0.2)`,
                  borderRadius: 12,
                  padding: 20,
                  marginBottom: 20,
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14,
                }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: 'rgba(185, 28, 28, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <ImageOff size={22} color={COLORS.danger} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontWeight: 700,
                      color: COLORS.danger,
                      marginBottom: 6,
                      fontSize: 14,
                    }}>
                      Image Validation Failed
                    </div>
                    <div style={{
                      fontSize: 13,
                      color: COLORS.textSecondary,
                      lineHeight: 1.6,
                      marginBottom: 12,
                    }}>
                      {validationError.reason}
                    </div>
                    <div style={{
                      fontSize: 12,
                      color: COLORS.textMuted,
                      background: COLORS.bgSurface,
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: `1px solid ${COLORS.border}`,
                    }}>
                      <strong style={{ color: COLORS.textSecondary }}>Tip:</strong>{' '}
                      {validationError.message}
                    </div>
                  </div>
                  <button
                    onClick={() => setValidationError(null)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: COLORS.textMuted,
                      cursor: 'pointer',
                      padding: 4,
                    }}
                  >
                    <X size={18} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Ready message */}
          {selectedStudent && file && !uploading && !analyzing && !result && !validationError && (
            <Alert type="info" style={{ marginBottom: 20 }}>
              Ready to analyze <strong>{selectedStudent.name}</strong>'s handwriting sample.
            </Alert>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 12 }}>
            {result && (
              <Button
                variant="outline"
                onClick={reset}
                icon={<RefreshCw size={16} />}
              >
                New Analysis
              </Button>
            )}
            <Button
              fullWidth
              onClick={handleSubmit}
              loading={uploading || analyzing}
              disabled={!studentId || !file}
              icon={<Sparkles size={18} />}
              style={{
                background: (!studentId || !file)
                  ? undefined
                  : COLORS.primary,
              }}
            >
              {uploading ? 'Uploading...' : analyzing ? 'Analyzing...' : 'Run AI Analysis'}
            </Button>
          </div>
        </motion.div>

        {/* Results Panel */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ type: 'spring', damping: 24, stiffness: 300 }}
              style={{
                background: COLORS.bgSurface,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 16,
                overflow: 'hidden',
              }}
            >
              {/* Result Header */}
              <div style={{
                padding: '20px 24px',
                background: result.riskLevel === 'LOW'
                  ? 'linear-gradient(135deg, rgba(5, 150, 105, 0.08) 0%, transparent 60%)'
                  : result.riskLevel === 'MEDIUM'
                  ? 'linear-gradient(135deg, rgba(217, 119, 6, 0.08) 0%, transparent 60%)'
                  : 'linear-gradient(135deg, rgba(185, 28, 28, 0.08) 0%, transparent 60%)',
                borderBottom: `1px solid ${COLORS.border}`,
                display: 'flex',
                alignItems: 'center',
                gap: 14,
              }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: result.riskLevel === 'LOW'
                    ? COLORS.successBg
                    : result.riskLevel === 'MEDIUM'
                    ? COLORS.warningBg
                    : COLORS.dangerBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {result.riskLevel === 'LOW' ? (
                    <CheckCircle size={24} color={COLORS.success} />
                  ) : (
                    <AlertCircle
                      size={24}
                      color={result.riskLevel === 'MEDIUM' ? COLORS.warning : COLORS.danger}
                    />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: 17,
                    color: COLORS.textPrimary,
                    marginBottom: 2,
                  }}>
                    Analysis Complete
                  </div>
                  <div style={{ fontSize: 13, color: COLORS.textMuted }}>
                    Report #{result.reportId} • {selectedStudent?.name}
                  </div>
                </div>
                <RiskBadge level={result.riskLevel} />
              </div>

              <div style={{ padding: '24px' }}>
                {/* Score Bars */}
                <ScoreBar label="Dyslexia Indicator" value={result.dyslexiaScore} />
                <ScoreBar label="Dysgraphia Indicator" value={result.dysgraphiaScore} />

                {/* Score Tiles */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 12,
                  margin: '24px 0',
                }}>
                  {[
                    {
                      label: 'Dyslexia',
                      value: result.dyslexiaScore,
                      color: result.dyslexiaScore >= 70
                        ? COLORS.danger
                        : result.dyslexiaScore >= 45
                        ? COLORS.warning
                        : COLORS.success,
                      bg: result.dyslexiaScore >= 70
                        ? COLORS.dangerBg
                        : result.dyslexiaScore >= 45
                        ? COLORS.warningBg
                        : COLORS.successBg,
                    },
                    {
                      label: 'Dysgraphia',
                      value: result.dysgraphiaScore,
                      color: result.dysgraphiaScore >= 70
                        ? COLORS.danger
                        : result.dysgraphiaScore >= 45
                        ? COLORS.warning
                        : COLORS.success,
                      bg: result.dysgraphiaScore >= 70
                        ? COLORS.dangerBg
                        : result.dysgraphiaScore >= 45
                        ? COLORS.warningBg
                        : COLORS.successBg,
                    },
                  ].map(({ label, value, color, bg }) => (
                    <div
                      key={label}
                      style={{
                        background: bg,
                        borderRadius: 10,
                        padding: '16px',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 28,
                        fontWeight: 800,
                        color,
                        marginBottom: 4,
                      }}>
                        {value?.toFixed(1)}%
                      </div>
                      <div style={{
                        fontSize: 11,
                        color: COLORS.textMuted,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        fontWeight: 600,
                      }}>
                        {label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Commentary */}
                <div style={{
                  background: COLORS.bgSubtle,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 10,
                  padding: '18px',
                }}>
                  <div style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: COLORS.textMuted,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}>
                    <Brain size={14} color={COLORS.primary} /> AI Assessment
                  </div>
                  <p style={{
                    fontSize: 14,
                    color: COLORS.textSecondary,
                    lineHeight: 1.7,
                  }}>
                    {result.aiComment}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
