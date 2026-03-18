import { useEffect, useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileImage, X, CheckCircle, AlertCircle, Zap, FileText, RefreshCw } from 'lucide-react'
import { optimizedStudentAPI, optimizedAnalysisAPI } from '../../services/optimizedApi'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

// ── Inline PageHeader Component ────────────────────────────
const PageHeader = ({ title, subtitle, breadcrumb }) => (
  <div style={{ marginBottom: 32 }}>
    {breadcrumb && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>{breadcrumb}</div>}
    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, marginBottom: 6, color: 'var(--text-primary)' }}>{title}</h1>
    {subtitle && <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{subtitle}</p>}
  </div>
)

// ── Inline Button Component ────────────────────────────
const Button = ({ children, type = 'button', fullWidth = false, size = 'md', loading = false, disabled = false, variant = 'primary', onClick, icon, style = {}, ...props }) => {
  const heights = { sm: 36, md: 40, lg: 44 }
  const paddings = { sm: '8px 16px', md: '12px 20px', lg: '14px 24px' }
  const [isHovering, setIsHovering] = useState(false)

  const bgColor = variant === 'ghost' ? 'transparent' : isHovering && !disabled ? 'var(--primary-hover)' : 'var(--primary)'
  const textColor = variant === 'ghost' ? 'var(--primary)' : 'white'
  const borderStyle = variant === 'ghost' ? { border: '1px solid var(--border)' } : {}

  return (
    <button
      type={type}
      disabled={loading || disabled}
      onClick={onClick}
      style={{
        width: fullWidth ? '100%' : 'auto',
        height: heights[size],
        padding: paddings[size],
        background: bgColor,
        color: textColor,
        border: variant === 'ghost' ? '1px solid var(--border)' : 'none',
        borderRadius: 'var(--radius-lg)',
        fontSize: size === 'sm' ? 13 : size === 'lg' ? 15 : 14,
        fontWeight: 600,
        cursor: loading || disabled ? 'not-allowed' : 'pointer',
        opacity: loading || disabled ? 0.6 : 1,
        transition: 'all 0.3s cubic-bezier(0.2, 0, 0, 1)',
        boxShadow: isHovering && variant !== 'ghost' && !disabled ? '0 4px 16px rgba(26, 115, 232, 0.3)' : 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: icon ? 8 : 0,
        ...style,
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {loading ? '...' : children}
    </button>
  )
}

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

// ── Inline Alert Component ────────────────────────────
const Alert = ({ type = 'info', children, onClose, style = {} }) => {
  const colors = {
    danger: { bg: 'var(--danger-dim)', border: 'var(--danger-glow)', text: 'var(--danger)' },
    warning: { bg: 'var(--warning-dim)', border: 'var(--warning-glow)', text: 'var(--warning)' },
    success: { bg: 'var(--success-dim)', border: 'var(--success-glow)', text: 'var(--success)' },
    info: { bg: 'var(--primary-dim)', border: 'var(--primary-glow)', text: 'var(--primary)' },
  }
  const color = colors[type] || colors.info

  return (
    <div style={{
      background: color.bg,
      border: `1px solid ${color.border}`,
      borderRadius: 'var(--radius)',
      padding: '12px 14px',
      fontSize: 13,
      color: color.text,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      ...style,
    }}>
      <span>{children}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: color.text, cursor: 'pointer', fontSize: 18, padding: 0, marginLeft: 12 }}
        >
          ×
        </button>
      )}
    </div>
  )
}

const STEPS = ['Select Student', 'Upload Paper', 'AI Analysis', 'Results']

export default function UploadPage() {
  const { addNotification } = useAuth()
  const [students, setStudents] = useState([])
  const [studentId, setStudentId] = useState('')
  const [file, setFile]           = useState(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress]   = useState(0)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult]       = useState(null)
  const [step, setStep]           = useState(0)

  useEffect(() => {
    optimizedStudentAPI.getAll()
      .then(r => setStudents(r.data.data || []))
      .catch(() => toast.error('Failed to load students. Please refresh or try again.'))
  }, [])

  const onDrop = useCallback((accepted, rejected) => {
    if (rejected.length > 0) {
      const err = rejected[0]?.errors?.[0]
      toast.error(err?.code === 'file-too-large' ? 'File too large (max 20 MB)' : 'Invalid file type — use JPG, PNG, or PDF')
      return
    }
    if (accepted[0]) {
      setFile(accepted[0])
      setResult(null)
      if (studentId) setStep(2)
    }
  }, [studentId])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg','.jpeg','.png','.gif','.tiff'], 'application/pdf': ['.pdf'] },
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
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress(p => { if (p >= 85) { clearInterval(progressInterval); return 85 } return p + 15 })
      }, 200)

      const res = await optimizedAnalysisAPI.upload(studentId, file, (event) => {
        if (event.total) setProgress(Math.round((event.loaded / event.total) * 85))
      })

      clearInterval(progressInterval)
      setProgress(100)
      setUploading(false)
      setAnalyzing(true)

      // Brief analyzing animation
      await new Promise(r => setTimeout(r, 800))
      setAnalyzing(false)
      setResult(res.data.data)
      setStep(3)

      const isAtRisk = res.data.data.riskLevel !== 'LOW'
      toast.success('Analysis complete!')
      addNotification({
        type: isAtRisk ? 'warning' : 'success',
        title: 'Analysis complete',
        body: `${students.find(s => String(s.id) === String(studentId))?.name || 'Student'} — ${res.data.data.riskLevel} risk`,
      })
    } catch (err) {
      setUploading(false)
      setAnalyzing(false)
      setStep(file ? 1 : 0)
      toast.error(err.response?.data?.message || 'Upload failed. Ensure the AI service is running.')
    }
  }

  const reset = () => { setFile(null); setResult(null); setProgress(0); setStudentId(''); setStep(0) }
  const selectedStudent = students.find(s => String(s.id) === String(studentId))

  return (
    <div>
      <PageHeader
        title="Upload Test Paper"
        subtitle="Upload a student's handwritten test paper for AI-powered learning disorder analysis."
        breadcrumb="NeuraScan / Upload"
      />

      <div className={result ? "grid-2" : ""} style={{ gap: 24, maxWidth: result ? '100%' : 680 }}>

        {/* Upload panel */}
        <div>
          {/* Progress steps */}
          <div style={{ display: 'flex', gap: 0, marginBottom: 24 }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flex: 1 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', fontSize: 12, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: step > i ? 'var(--primary)' : step === i ? 'var(--primary-dim)' : 'var(--bg-elevated)',
                    border: `2px solid ${step >= i ? 'var(--primary)' : 'var(--border)'}`,
                    color: step > i ? '#fff' : step === i ? 'var(--primary)' : 'var(--text-muted)',
                    transition: 'all var(--duration)',
                    boxShadow: step === i ? '0 0 12px var(--primary-glow)' : 'none',
                  }}>
                    {step > i ? '✓' : i + 1}
                  </div>
                  <span style={{ fontSize: 10, color: step >= i ? 'var(--text-secondary)' : 'var(--text-muted)', whiteSpace: 'nowrap', fontWeight: step === i ? 600 : 400, letterSpacing: '0.03em' }}>{s}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ flex: 1, height: 2, background: step > i ? 'var(--primary)' : 'var(--border)', transition: 'background var(--duration-slow)', margin: '0 4px', marginBottom: 16 }} />
                )}
              </div>
            ))}
          </div>

          <div className="glass-panel" style={{ padding: '28px' }}>
            {/* Student selector */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, letterSpacing: '0.02em' }}>
                Select Student <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <select
                value={studentId}
                onChange={handleStudentChange}
                style={{
                  width: '100%', padding: '11px 14px',
                  background: 'var(--bg-input)', border: `1px solid ${studentId ? 'var(--primary)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius)', color: studentId ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontFamily: 'var(--font-body)', fontSize: 14, cursor: 'pointer',
                  outline: 'none', transition: 'border-color var(--duration)',
                  boxShadow: studentId ? '0 0 0 3px rgba(26,115,232,0.12)' : 'none',
                }}
              >
                <option value="">— Choose a student —</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name} · {s.className}</option>
                ))}
              </select>
            </div>

            {/* Dropzone */}
            <motion.div
              {...getRootProps()}
              animate={{
                borderColor: isDragActive ? 'var(--primary)' : file ? 'var(--secondary)' : 'var(--border-strong)',
                background:  isDragActive ? 'rgba(26,115,232,0.08)' : file ? 'rgba(8,145,178,0.06)' : 'var(--bg-elevated)',
              }}
              transition={{ duration: 0.15 }}
              style={{
                border: '2px dashed',
                borderRadius: 'var(--radius-lg)',
                padding: '40px 24px',
                textAlign: 'center',
                cursor: uploading || analyzing ? 'not-allowed' : 'pointer',
                marginBottom: 20,
              }}
            >
              <input {...getInputProps()} disabled={uploading || analyzing} />

              {uploading || analyzing ? (
                <div>
                  <div style={{ width: 52, height: 52, borderRadius: 13, background: 'var(--primary-dim)', border: '1px solid rgba(26,115,232,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <Zap size={24} color="var(--primary)" />
                  </div>
                  <div style={{ fontWeight: 600, marginBottom: 8 }}>
                    {uploading ? 'Uploading…' : 'AI analyzing…'}
                  </div>
                  {uploading && (
                    <div>
                      <div style={{ height: 4, background: 'var(--bg-card)', borderRadius: 2, overflow: 'hidden', maxWidth: 200, margin: '0 auto 8px' }}>
                        <motion.div
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.3 }}
                          style={{ height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', borderRadius: 2 }}
                        />
                      </div>
                      <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{progress}%</span>
                    </div>
                  )}
                  {analyzing && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
                      {[0,1,2].map(i => (
                        <motion.div key={i}
                          animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                          style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)' }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : file ? (
                <div>
                  <div style={{ width: 52, height: 52, borderRadius: 13, background: 'var(--secondary-dim)', border: '1px solid rgba(8,145,178,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                    <FileImage size={24} color="var(--secondary)" />
                  </div>
                  <div style={{ fontWeight: 600, color: 'var(--secondary)', marginBottom: 4 }}>{file.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>
                    {(file.size / 1024).toFixed(0)} KB · {file.type.split('/')[1]?.toUpperCase()}
                  </div>
                  <button onClick={e => { e.stopPropagation(); setFile(null); setStep(studentId ? 1 : 0) }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <X size={12} /> Change file
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{ width: 52, height: 52, borderRadius: 13, background: isDragActive ? 'var(--primary-dim)' : 'var(--bg-card)', border: `1px solid ${isDragActive ? 'rgba(26,115,232,0.3)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', transition: 'all 0.15s' }}>
                    <Upload size={22} color={isDragActive ? 'var(--primary)' : 'var(--text-muted)'} />
                  </div>
                  <p style={{ fontWeight: 600, marginBottom: 6, color: isDragActive ? 'var(--primary)' : 'var(--text-primary)' }}>
                    {isDragActive ? 'Drop the file here' : 'Drag & drop or click to browse'}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>JPG, PNG, PDF, TIFF — up to 20 MB</p>
                </div>
              )}
            </motion.div>

            {selectedStudent && file && !uploading && !analyzing && !result && (
              <Alert type="info" style={{ marginBottom: 16 }}>
                Ready to analyze <strong>{selectedStudent.name}</strong>'s paper ({selectedStudent.className}).
              </Alert>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              {result && <Button variant="ghost" onClick={reset} icon={<RefreshCw size={14} />}>New Analysis</Button>}
              <Button
                fullWidth
                onClick={handleSubmit}
                loading={uploading || analyzing}
                disabled={!studentId || !file}
                icon={<Zap size={15} />}
              >
                {uploading ? 'Uploading…' : analyzing ? 'Analyzing…' : 'Run AI Analysis'}
              </Button>
            </div>
          </div>
        </div>

        {/* Results panel */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            >
              <div className="glass-panel" style={{ overflow: 'hidden' }}>
                {/* Result header */}
                <div style={{
                  padding: '20px 24px',
                  background: result.riskLevel === 'LOW' ? 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, transparent 60%)' : result.riskLevel === 'MEDIUM' ? 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, transparent 60%)' : 'linear-gradient(135deg, rgba(239,68,68,0.08) 0%, transparent 60%)',
                  borderBottom: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', gap: 14,
                }}>
                  <div style={{ width: 42, height: 42, borderRadius: 11, background: result.riskLevel === 'LOW' ? 'var(--success-dim)' : result.riskLevel === 'MEDIUM' ? 'var(--warning-dim)' : 'var(--danger-dim)', border: `1px solid ${result.riskLevel === 'LOW' ? 'rgba(16,185,129,0.3)' : result.riskLevel === 'MEDIUM' ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {result.riskLevel === 'LOW'
                      ? <CheckCircle size={20} color="var(--success)" />
                      : <AlertCircle size={20} color={result.riskLevel === 'MEDIUM' ? 'var(--warning)' : 'var(--danger)'} />
                    }
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginBottom: 2 }}>
                      Analysis Complete
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Report #{result.reportId} · {selectedStudent?.name}</div>
                  </div>
                  <RiskBadge level={result.riskLevel} />
                </div>

                <div style={{ padding: '22px 24px' }}>
                  <ScoreBar label="Dyslexia Score"   value={result.dyslexiaScore} />
                  <ScoreBar label="Dysgraphia Score" value={result.dysgraphiaScore} />

                  {/* Score pills */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, margin: '20px 0' }}>
                    {[
                      { label: 'Dyslexia',   value: result.dyslexiaScore,   color: result.dyslexiaScore >= 70 ? 'var(--danger)' : result.dyslexiaScore >= 45 ? 'var(--warning)' : 'var(--success)' },
                      { label: 'Dysgraphia', value: result.dysgraphiaScore, color: result.dysgraphiaScore >= 70 ? 'var(--danger)' : result.dysgraphiaScore >= 45 ? 'var(--warning)' : 'var(--success)' },
                    ].map(({ label, value, color }) => (
                      <div key={label} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '12px', textAlign: 'center' }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color, marginBottom: 2 }}>{value?.toFixed(1)}%</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Zap size={11} /> AI Commentary
                    </div>
                    <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                      {result.aiComment}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
