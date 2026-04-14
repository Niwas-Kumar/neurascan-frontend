// ============================================================
// TEACHER QUIZ PAGE - NeuraScan Design System v3.0
// ============================================================
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PlusCircle, Send, BookOpen, CheckCircle, XCircle, Mail, Users, Loader2, BarChart3, X } from 'lucide-react'
import { quizAPI } from '../../services/api'
import { optimizedStudentAPI } from '../../services/optimizedApi'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

// ════════════════════════════════════════════════════════════════
// DESIGN SYSTEM - Matching reference exactly
// ════════════════════════════════════════════════════════════════
const COLORS = {
  sidebar: '#312E81',
  primary: '#14B8A6',
  primaryLight: '#0D9488',
  primaryBg: 'rgba(20, 184, 166, 0.1)',

  secondary: '#6366F1',
  secondaryDark: '#4F46E5',
  secondaryBg: 'rgba(99, 102, 241, 0.1)',

  bgBase: '#F8FAFC',
  bgSurface: '#FFFFFF',
  bgSubtle: '#F1F5F9',

  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#64748B',
  textLight: '#94A3B8',

  border: '#E2E8F0',
  borderLight: '#F1F5F9',

  // Risk colors
  riskHigh: '#ef4444',
  riskHighBg: 'rgba(239, 68, 68, 0.1)',
  riskMedium: '#f59e0b',
  riskMediumBg: 'rgba(245, 158, 11, 0.1)',
  riskLow: '#22c55e',
  riskLowBg: 'rgba(34, 197, 94, 0.1)',
}

// ════════════════════════════════════════════════════════════════
// REUSABLE COMPONENTS
// ════════════════════════════════════════════════════════════════

const PageHeader = ({ title, subtitle, action }) => (
  <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
    <div>
      <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 28, fontWeight: 800, marginBottom: 8, color: COLORS.textPrimary, letterSpacing: '-0.02em' }}>{title}</h1>
      {subtitle && <p style={{ fontSize: 15, color: COLORS.textSecondary, lineHeight: 1.6 }}>{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
)

const Badge = ({ children, icon: Icon, variant = 'primary' }) => {
  const colors = {
    primary: { bg: COLORS.primaryBg, text: COLORS.primary },
    secondary: { bg: COLORS.bgSubtle, text: COLORS.textSecondary },
    success: { bg: COLORS.riskLowBg, text: COLORS.riskLow },
    warning: { bg: COLORS.riskMediumBg, text: COLORS.riskMedium },
  }
  const c = colors[variant] || colors.primary
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '6px 12px',
      borderRadius: 100,
      fontSize: 12,
      fontWeight: 600,
      background: c.bg,
      color: c.text,
    }}>
      {Icon && <Icon size={14} />}
      {children}
    </span>
  )
}

const SkeletonCard = ({ rows = 4 }) => (
  <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: '20px 24px', background: COLORS.bgSurface }}>
    {Array(rows).fill(0).map((_, i) => (
      <div key={i} style={{
        height: i === 0 ? 24 : 14,
        background: `linear-gradient(90deg, ${COLORS.bgSubtle} 25%, ${COLORS.bgSurface} 50%, ${COLORS.bgSubtle} 75%)`,
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        borderRadius: 8,
        marginBottom: i < rows - 1 ? 12 : 0,
      }} />
    ))}
    <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
  </div>
)

const EmptyState = ({ icon: Icon, title, description }) => (
  <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: '56px 32px', textAlign: 'center', background: COLORS.bgSurface }}>
    {Icon && <Icon size={48} color={COLORS.textLight} strokeWidth={1.25} style={{ marginBottom: 20 }} />}
    <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 10, color: COLORS.textPrimary }}>{title}</h3>
    {description && <p style={{ color: COLORS.textSecondary, fontSize: 14, lineHeight: 1.75, maxWidth: 360, margin: '0 auto' }}>{description}</p>}
  </div>
)

// ════════════════════════════════════════════════════════════════
// DISTRIBUTE QUIZ MODAL
// ════════════════════════════════════════════════════════════════

const DistributeModal = ({ quiz, students, onClose, onDistribute }) => {
  const [selectedStudents, setSelectedStudents] = useState([])
  const [customEmails, setCustomEmails] = useState('')
  const [customMessage, setCustomMessage] = useState('')
  const [sending, setSending] = useState(false)

  const toggleStudent = (studentId) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    )
  }

  const selectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([])
    } else {
      setSelectedStudents(students.map(s => s.id))
    }
  }

  const handleDistribute = async () => {
    const emails = customEmails.split(',').map(e => e.trim()).filter(e => e.includes('@'))

    if (selectedStudents.length === 0 && emails.length === 0) {
      toast.error('Please select students or enter parent emails')
      return
    }

    setSending(true)
    try {
      await onDistribute({
        quizId: quiz.id,
        studentIds: selectedStudents,
        parentEmails: emails,
        customMessage
      })
      toast.success(`Quiz sent to ${selectedStudents.length + emails.length} recipient(s)`)
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to distribute quiz')
    } finally {
      setSending(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 20
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        style={{
          background: COLORS.bgSurface, borderRadius: 20, width: '100%', maxWidth: 560,
          maxHeight: '80vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
          border: `1px solid ${COLORS.border}`, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 4, color: COLORS.textPrimary }}>Distribute Quiz</h2>
            <p style={{ fontSize: 13, color: COLORS.textMuted }}>{quiz.topic}</p>
          </div>
          <button onClick={onClose} style={{ background: COLORS.bgSubtle, border: 'none', cursor: 'pointer', padding: 8, borderRadius: 8 }}>
            <X size={18} color={COLORS.textMuted} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px' }}>
          {/* Select Students */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <label style={{ fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, color: COLORS.textPrimary }}>
                <Users size={16} color={COLORS.primary} /> Select Students
              </label>
              <button onClick={selectAll} style={{
                fontSize: 12, color: COLORS.primary, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600
              }}>
                {selectedStudents.length === students.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div style={{
              border: `1px solid ${COLORS.border}`, borderRadius: 12, maxHeight: 180, overflow: 'auto',
              background: COLORS.bgSubtle
            }}>
              {students.length === 0 ? (
                <div style={{ padding: 20, textAlign: 'center', color: COLORS.textMuted, fontSize: 13 }}>
                  No students found. Add students first.
                </div>
              ) : students.map(student => (
                <label key={student.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                  cursor: 'pointer', borderBottom: `1px solid ${COLORS.border}`,
                  background: selectedStudents.includes(student.id) ? COLORS.primaryBg : 'transparent',
                  transition: 'background 0.15s ease'
                }}>
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student.id)}
                    onChange={() => toggleStudent(student.id)}
                    style={{ width: 16, height: 16, accentColor: COLORS.primary }}
                  />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: COLORS.textPrimary }}>{student.name}</div>
                    {student.parentEmail && (
                      <div style={{ fontSize: 12, color: COLORS.textMuted }}>
                        Parent: {student.parentEmail}
                      </div>
                    )}
                  </div>
                </label>
              ))}
            </div>
            <p style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 8 }}>
              Quiz links will be sent to parent emails registered for selected students.
            </p>
          </div>

          {/* Additional Emails */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, color: COLORS.textPrimary }}>
              <Mail size={16} color={COLORS.primary} /> Additional Parent Emails (optional)
            </label>
            <input
              type="text"
              value={customEmails}
              onChange={e => setCustomEmails(e.target.value)}
              placeholder="parent1@email.com, parent2@email.com"
              style={{
                width: '100%', padding: 12, border: `1px solid ${COLORS.border}`, borderRadius: 10,
                outline: 'none', background: COLORS.bgSubtle, fontSize: 14, color: COLORS.textPrimary,
                fontFamily: "'Inter', sans-serif", transition: 'border-color 0.2s ease'
              }}
              onFocus={e => e.target.style.borderColor = COLORS.primary}
              onBlur={e => e.target.style.borderColor = COLORS.border}
            />
            <p style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 6 }}>
              Separate multiple emails with commas
            </p>
          </div>

          {/* Custom Message */}
          <div>
            <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 10, display: 'block', color: COLORS.textPrimary }}>
              Custom Message (optional)
            </label>
            <textarea
              value={customMessage}
              onChange={e => setCustomMessage(e.target.value)}
              placeholder="Add a personal note to include in the email..."
              rows={3}
              style={{
                width: '100%', padding: 12, border: `1px solid ${COLORS.border}`, borderRadius: 10,
                outline: 'none', background: COLORS.bgSubtle, fontSize: 14, resize: 'vertical',
                color: COLORS.textPrimary, fontFamily: "'Inter', sans-serif"
              }}
              onFocus={e => e.target.style.borderColor = COLORS.primary}
              onBlur={e => e.target.style.borderColor = COLORS.border}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px', borderTop: `1px solid ${COLORS.border}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, background: COLORS.bgSubtle
        }}>
          <div style={{ fontSize: 13, color: COLORS.textMuted }}>
            {selectedStudents.length + customEmails.split(',').filter(e => e.includes('@')).length} recipient(s) selected
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onClose} style={{
              padding: '10px 18px', borderRadius: 10, border: `1px solid ${COLORS.border}`,
              background: COLORS.bgSurface, color: COLORS.textPrimary, fontWeight: 600, cursor: 'pointer',
              fontFamily: "'Inter', sans-serif", fontSize: 14
            }}>
              Cancel
            </button>
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDistribute}
              disabled={sending}
              style={{
                padding: '10px 18px', borderRadius: 10, border: 'none',
                background: COLORS.primary,
                color: 'white', fontWeight: 600,
                cursor: sending ? 'not-allowed' : 'pointer', opacity: sending ? 0.7 : 1,
                display: 'flex', alignItems: 'center', gap: 8,
                fontFamily: "'Inter', sans-serif", fontSize: 14,
                boxShadow: '0 4px 14px rgba(49, 46, 129, 0.25)'
              }}
            >
              {sending ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={16} />}
              {sending ? 'Sending...' : 'Send Quiz Links'}
            </motion.button>
          </div>
        </div>
      </motion.div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// QUIZ RESULTS MODAL
// ════════════════════════════════════════════════════════════════

const QuizResultsModal = ({ quiz, onClose }) => {
  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProgress()
  }, [quiz.id])

  const loadProgress = async () => {
    try {
      const res = await quizAPI.getQuizProgress(quiz.id)
      setProgress(res.data?.data)
    } catch (err) {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        const retryRes = await quizAPI.getQuizProgress(quiz.id)
        setProgress(retryRes.data?.data)
      } catch (retryErr) {
        toast.error('Could not load quiz results')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 20
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        style={{
          background: COLORS.bgSurface, borderRadius: 20, width: '100%', maxWidth: 640,
          maxHeight: '80vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
          border: `1px solid ${COLORS.border}`, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 4, color: COLORS.textPrimary }}>Quiz Results</h2>
            <p style={{ fontSize: 13, color: COLORS.textMuted }}>{quiz.topic}</p>
          </div>
          <button onClick={onClose} style={{ background: COLORS.bgSubtle, border: 'none', cursor: 'pointer', padding: 8, borderRadius: 8 }}>
            <X size={18} color={COLORS.textMuted} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <Loader2 size={32} color={COLORS.primary} style={{ animation: 'spin 1s linear infinite' }} />
              <p style={{ marginTop: 12, color: COLORS.textMuted }}>Loading results...</p>
            </div>
          ) : !progress || progress.totalAttempts === 0 ? (
            <EmptyState
              icon={BarChart3}
              title="No attempts yet"
              description="No students have completed this quiz yet. Distribute the quiz to get started."
            />
          ) : (
            <>
              {/* Summary Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
                <div style={{ background: COLORS.primaryBg, borderRadius: 12, padding: 16, textAlign: 'center', border: `1px solid ${COLORS.primary}20` }}>
                  <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 28, fontWeight: 800, color: COLORS.primary }}>{progress.totalAttempts}</div>
                  <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>Total Attempts</div>
                </div>
                <div style={{ background: COLORS.riskLowBg, borderRadius: 12, padding: 16, textAlign: 'center', border: `1px solid ${COLORS.riskLow}20` }}>
                  <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 28, fontWeight: 800, color: COLORS.riskLow }}>{progress.averageScore?.toFixed(1)}%</div>
                  <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>Average Score</div>
                </div>
                <div style={{ background: COLORS.secondaryBg, borderRadius: 12, padding: 16, textAlign: 'center', border: `1px solid ${COLORS.secondary}20` }}>
                  <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 28, fontWeight: 800, color: COLORS.secondary }}>{progress.participationRate}%</div>
                  <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>Participation</div>
                </div>
              </div>

              {/* Student Results */}
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 12, color: COLORS.textPrimary }}>Student Performance</h3>
              <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: 'hidden' }}>
                {progress.studentProgress?.map((sp, idx) => (
                  <div key={sp.studentId} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 16px', borderBottom: idx < progress.studentProgress.length - 1 ? `1px solid ${COLORS.border}` : 'none',
                    background: idx % 2 === 0 ? COLORS.bgSubtle : COLORS.bgSurface
                  }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.textPrimary }}>{sp.studentName}</div>
                      <div style={{ fontSize: 12, color: COLORS.textMuted }}>
                        {sp.attemptDate ? new Date(sp.attemptDate).toLocaleDateString() : 'Not attempted'}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      {sp.completed ? (
                        <>
                          <div style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, fontWeight: 700,
                            color: sp.score >= 70 ? COLORS.riskLow : sp.score >= 50 ? COLORS.riskMedium : COLORS.riskHigh
                          }}>
                            {sp.score?.toFixed(0)}%
                          </div>
                          <div style={{ fontSize: 11, color: COLORS.textMuted }}>
                            {Math.floor(sp.timeSpentMs / 60000)}m {Math.floor((sp.timeSpentMs % 60000) / 1000)}s
                          </div>
                        </>
                      ) : (
                        <Badge variant="secondary">Pending</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: `1px solid ${COLORS.border}`, textAlign: 'right', background: COLORS.bgSubtle }}>
          <button onClick={onClose} style={{
            padding: '10px 20px', borderRadius: 10, border: `1px solid ${COLORS.border}`,
            background: COLORS.bgSurface, color: COLORS.textPrimary, fontWeight: 600, cursor: 'pointer',
            fontFamily: "'Inter', sans-serif", fontSize: 14
          }}>
            Close
          </button>
        </div>
      </motion.div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// MAIN QUIZ PAGE
// ════════════════════════════════════════════════════════════════

export default function QuizPage() {
  const { user } = useAuth()
  const [quizzes, setQuizzes] = useState([])
  const [students, setStudents] = useState([])
  const [topic, setTopic] = useState('')
  const [text, setText] = useState('')
  const [questionCount, setQuestionCount] = useState(5)
  const [classId, setClassId] = useState('')
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [activeQuizId, setActiveQuizId] = useState(null)

  // Modal states
  const [distributeQuiz, setDistributeQuiz] = useState(null)
  const [viewResultsQuiz, setViewResultsQuiz] = useState(null)

  const load = async () => {
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

    setLoading(true)

    try {
      for (let attempt = 0; attempt < 2; attempt++) {
        const [quizResult, studentResult] = await Promise.allSettled([
          quizAPI.getMyQuizzes(),
          optimizedStudentAPI.getAllWithIndexRetry(4, 300)
        ])

        const quizzesData = quizResult.status === 'fulfilled' ? (quizResult.value.data.data || []) : []
        const studentsData = studentResult.status === 'fulfilled' ? (studentResult.value?.data?.data || []) : []

        setQuizzes(quizzesData)
        setStudents(studentsData)

        const hasFailure = quizResult.status !== 'fulfilled' || studentResult.status !== 'fulfilled'
        const likelyTransientEmpty = quizzesData.length === 0 && studentsData.length > 0

        if (!hasFailure && !likelyTransientEmpty) {
          break
        }

        if (attempt < 1) {
          await wait(1000)
          continue
        }

        if (quizResult.status !== 'fulfilled') {
          toast.error('Could not load quizzes')
        }

        if (studentResult.status !== 'fulfilled') {
          toast.error('Could not load students')
        }
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user?.token) return
    load()
  }, [user?.token])

  const handleCreateQuiz = async () => {
    if (!topic || !text) return toast.error('Topic and text required')
    setCreating(true)
    try {
      const payload = { topic, text, questionCount: Number(questionCount), classId }
      const res = await quizAPI.createQuiz(payload)
      toast.success('Quiz created successfully')
      setTopic(''); setText(''); setQuestionCount(5)
      load()
      if (res.data?.data?.id) setActiveQuizId(res.data.data.id)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create quiz')
    } finally {
      setCreating(false)
    }
  }

  const handleDistribute = async (data) => {
    await quizAPI.distributeQuiz(data.quizId, data)
  }

  const inputStyle = {
    width: '100%', padding: 12, border: `1px solid ${COLORS.border}`, borderRadius: 10,
    outline: 'none', background: COLORS.bgSubtle, fontSize: 14, color: COLORS.textPrimary,
    fontFamily: "'Inter', sans-serif", transition: 'border-color 0.2s ease'
  }

  return (
    <div>
      <PageHeader
        title="Quiz Builder"
        subtitle="Create and manage class quizzes with AI-suggested questions"
        action={
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreateQuiz}
            disabled={creating}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', fontWeight: 600,
              borderRadius: 10, border: 'none',
              background: COLORS.primary,
              color: 'white', cursor: creating ? 'not-allowed' : 'pointer', opacity: creating ? 0.7 : 1,
              fontFamily: "'Inter', sans-serif", fontSize: 14, boxShadow: '0 4px 14px rgba(49, 46, 129, 0.25)'
            }}
          >
            {creating ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <PlusCircle size={16} />}
            {creating ? 'Creating...' : 'Create Quiz'}
          </motion.button>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ background: COLORS.bgSurface, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 20 }}
        >
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: COLORS.textPrimary }}>Topic / Module</div>
          <input
            value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Grammar correction case"
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = COLORS.primary}
            onBlur={e => e.target.style.borderColor = COLORS.border}
          />

          <div style={{ fontSize: 13, fontWeight: 600, marginTop: 16, color: COLORS.textPrimary }}>Class ID (optional)</div>
          <input
            value={classId} onChange={e => setClassId(e.target.value)} placeholder="e.g. class-A"
            style={{ ...inputStyle, marginTop: 8 }}
            onFocus={e => e.target.style.borderColor = COLORS.primary}
            onBlur={e => e.target.style.borderColor = COLORS.border}
          />

          <div style={{ fontSize: 13, fontWeight: 600, marginTop: 16, color: COLORS.textPrimary }}>Question Count</div>
          <input
            type="number" min={1} max={12} value={questionCount} onChange={e => setQuestionCount(e.target.value)}
            style={{ ...inputStyle, marginTop: 8 }}
            onFocus={e => e.target.style.borderColor = COLORS.primary}
            onBlur={e => e.target.style.borderColor = COLORS.border}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          style={{ background: COLORS.bgSurface, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 20 }}
        >
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: COLORS.textPrimary }}>Source Text for Quiz Generation</div>
          <textarea
            value={text} onChange={e => setText(e.target.value)} rows={9}
            placeholder="Paste student paper text or topic summary here..."
            style={{ ...inputStyle, resize: 'vertical', minHeight: 180 }}
            onFocus={e => e.target.style.borderColor = COLORS.primary}
            onBlur={e => e.target.style.borderColor = COLORS.border}
          />
        </motion.div>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24 }}>
        <Badge icon={BookOpen} variant="secondary">Set topic and source text then click Create Quiz</Badge>
        <Badge icon={CheckCircle} variant="success">AI enriches questions from source</Badge>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gap: 12 }}>
          {[1, 2, 3].map(i => <SkeletonCard key={i} rows={3} />)}
        </div>
      ) : quizzes.length === 0 ? (
        <EmptyState icon={BookOpen} title="No quizzes created yet" description="Start by creating a new quiz above." />
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {quizzes.map((q, i) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{
                border: q.id === activeQuizId ? `2px solid ${COLORS.riskLow}` : `1px solid ${COLORS.border}`,
                background: COLORS.bgSurface, borderRadius: 16, padding: 20, overflow: 'hidden',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.primaryLight; e.currentTarget.style.boxShadow = '0 4px 16px rgba(49, 46, 129, 0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = q.id === activeQuizId ? COLORS.riskLow : COLORS.border; e.currentTarget.style.boxShadow = 'none' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 8 }}>
                <div>
                  <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, fontWeight: 700, color: COLORS.textPrimary }}>{q.topic}</div>
                  {q.classId && <span style={{ fontSize: 12, color: COLORS.textMuted }}>Class {q.classId}</span>}
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: COLORS.textMuted }}>{new Date(q.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Badge icon={Send} variant="primary">Questions: {q.questions?.length ?? 0}</Badge>
                <Badge icon={CheckCircle} variant="secondary">Quiz ID {q.id.slice(0, 6)}</Badge>
                {q.totalAttempts > 0 && <Badge icon={Users} variant="success">{q.totalAttempts} Attempts</Badge>}
              </div>

              <div style={{ marginTop: 16, display: 'grid', gap: 8 }}>
                {q.questions?.slice(0, 3).map((qq, idx) => (
                  <div key={qq.id} style={{ fontSize: 13, color: COLORS.textSecondary, padding: '8px 12px', background: COLORS.bgSubtle, borderRadius: 8 }}>
                    <strong style={{ color: COLORS.textPrimary }}>{idx + 1}.</strong> {qq.question}
                  </div>
                ))}
                {q.questions?.length > 3 && (
                  <div style={{ fontSize: 12, color: COLORS.textMuted, fontStyle: 'italic', paddingLeft: 12 }}>
                    +{q.questions.length - 3} more questions
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${COLORS.border}`, display: 'flex', gap: 10 }}>
                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDistributeQuiz(q)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px',
                    borderRadius: 10, border: 'none',
                    background: COLORS.primary,
                    color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    fontFamily: "'Inter', sans-serif", boxShadow: '0 4px 14px rgba(49, 46, 129, 0.2)'
                  }}
                >
                  <Mail size={14} /> Distribute Quiz
                </motion.button>
                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setViewResultsQuiz(q)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px',
                    borderRadius: 10, border: `1px solid ${COLORS.border}`, background: COLORS.bgSurface,
                    color: COLORS.textPrimary, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    fontFamily: "'Inter', sans-serif"
                  }}
                >
                  <BarChart3 size={14} /> View Results
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {distributeQuiz && (
          <DistributeModal
            quiz={distributeQuiz}
            students={students}
            onClose={() => setDistributeQuiz(null)}
            onDistribute={handleDistribute}
          />
        )}
        {viewResultsQuiz && (
          <QuizResultsModal
            quiz={viewResultsQuiz}
            onClose={() => setViewResultsQuiz(null)}
          />
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
