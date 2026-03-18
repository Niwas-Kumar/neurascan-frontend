import { useEffect, useState } from 'react'
import { PlusCircle, Send, BookOpen, CheckCircle, XCircle, Mail, Users, Loader2, BarChart3, X } from 'lucide-react'
import { quizAPI, studentAPI } from '../../services/api'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

// ── Inline PageHeader Component ────────────────────────────
const PageHeader = ({ title, subtitle, action }) => (
  <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, marginBottom: 6, color: 'var(--text-primary)' }}>{title}</h1>
      {subtitle && <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
)

// ── Inline Badge Component ────────────────────────────
const Badge = ({ children, icon: Icon, variant = 'primary' }) => {
  const colors = { primary: '#e8f0fe', secondary: '#f3f4f6', success: '#d1fae5', warning: '#fef3c7' }
  const textColors = { primary: '#1a73e8', secondary: '#374151', success: '#10b981', warning: '#d97706' }
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

// ── Inline EmptyState Component ────────────────────────────
const EmptyState = ({ icon: Icon, title, description }) => (
  <div style={{border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '48px 32px', textAlign: 'center' }}>
    {Icon && <Icon size={40} color="var(--text-muted)" strokeWidth={1.25} style={{ marginBottom: 16 }} />}
    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, marginBottom: 8 }}>{title}</h3>
    {description && <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.75 }}>{description}</p>}
  </div>
)

// ── Distribute Quiz Modal ────────────────────────────
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
      background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 20
    }}>
      <div style={{
        background: 'var(--bg-card)', borderRadius: 16, width: '100%', maxWidth: 560,
        maxHeight: '80vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
        border: '1px solid var(--border)', boxShadow: 'var(--shadow-xl)'
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Distribute Quiz</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{quiz.topic}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}>
            <X size={20} color="var(--text-muted)" />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px' }}>
          {/* Select Students */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <label style={{ fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Users size={16} /> Select Students
              </label>
              <button onClick={selectAll} style={{
                fontSize: 12, color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600
              }}>
                {selectedStudents.length === students.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div style={{
              border: '1px solid var(--border)', borderRadius: 10, maxHeight: 180, overflow: 'auto',
              background: 'var(--bg-default)'
            }}>
              {students.length === 0 ? (
                <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                  No students found. Add students first.
                </div>
              ) : students.map(student => (
                <label key={student.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                  cursor: 'pointer', borderBottom: '1px solid var(--border)',
                  background: selectedStudents.includes(student.id) ? 'var(--bg-hover)' : 'transparent'
                }}>
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student.id)}
                    onChange={() => toggleStudent(student.id)}
                    style={{ width: 16, height: 16, accentColor: 'var(--primary)' }}
                  />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{student.name}</div>
                    {student.parentEmail && (
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        Parent: {student.parentEmail}
                      </div>
                    )}
                  </div>
                </label>
              ))}
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
              Quiz links will be sent to parent emails registered for selected students.
            </p>
          </div>

          {/* Additional Emails */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Mail size={16} /> Additional Parent Emails (optional)
            </label>
            <input
              type="text"
              value={customEmails}
              onChange={e => setCustomEmails(e.target.value)}
              placeholder="parent1@email.com, parent2@email.com"
              style={{
                width: '100%', padding: 12, border: '1px solid var(--border)', borderRadius: 8,
                outline: 'none', background: 'var(--bg-default)', fontSize: 14
              }}
            />
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
              Separate multiple emails with commas
            </p>
          </div>

          {/* Custom Message */}
          <div>
            <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 10, display: 'block' }}>
              Custom Message (optional)
            </label>
            <textarea
              value={customMessage}
              onChange={e => setCustomMessage(e.target.value)}
              placeholder="Add a personal note to include in the email..."
              rows={3}
              style={{
                width: '100%', padding: 12, border: '1px solid var(--border)', borderRadius: 8,
                outline: 'none', background: 'var(--bg-default)', fontSize: 14, resize: 'vertical'
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px', borderTop: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12
        }}>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {selectedStudents.length + customEmails.split(',').filter(e => e.includes('@')).length} recipient(s) selected
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onClose} style={{
              padding: '10px 18px', borderRadius: 8, border: '1px solid var(--border)',
              background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer'
            }}>
              Cancel
            </button>
            <button onClick={handleDistribute} disabled={sending} style={{
              padding: '10px 18px', borderRadius: 8, border: 'none',
              background: 'var(--primary)', color: 'white', fontWeight: 600,
              cursor: sending ? 'not-allowed' : 'pointer', opacity: sending ? 0.7 : 1,
              display: 'flex', alignItems: 'center', gap: 8
            }}>
              {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              {sending ? 'Sending...' : 'Send Quiz Links'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Quiz Results Modal ────────────────────────────
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
      toast.error('Could not load quiz results')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 20
    }}>
      <div style={{
        background: 'var(--bg-card)', borderRadius: 16, width: '100%', maxWidth: 640,
        maxHeight: '80vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
        border: '1px solid var(--border)', boxShadow: 'var(--shadow-xl)'
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Quiz Results</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{quiz.topic}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}>
            <X size={20} color="var(--text-muted)" />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <Loader2 size={32} color="var(--primary)" style={{ animation: 'spin 1s linear infinite' }} />
              <p style={{ marginTop: 12, color: 'var(--text-muted)' }}>Loading results...</p>
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
                <div style={{ background: 'var(--bg-default)', borderRadius: 10, padding: 16, textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--primary)' }}>{progress.totalAttempts}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Total Attempts</div>
                </div>
                <div style={{ background: 'var(--bg-default)', borderRadius: 10, padding: 16, textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--success)' }}>{progress.averageScore?.toFixed(1)}%</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Average Score</div>
                </div>
                <div style={{ background: 'var(--bg-default)', borderRadius: 10, padding: 16, textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--warning)' }}>{progress.participationRate}%</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Participation</div>
                </div>
              </div>

              {/* Student Results */}
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Student Performance</h3>
              <div style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
                {progress.studentProgress?.map((sp, idx) => (
                  <div key={sp.studentId} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 16px', borderBottom: idx < progress.studentProgress.length - 1 ? '1px solid var(--border)' : 'none',
                    background: idx % 2 === 0 ? 'var(--bg-default)' : 'transparent'
                  }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{sp.studentName}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {sp.attemptDate ? new Date(sp.attemptDate).toLocaleDateString() : 'Not attempted'}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      {sp.completed ? (
                        <>
                          <div style={{
                            fontSize: 16, fontWeight: 700,
                            color: sp.score >= 70 ? 'var(--success)' : sp.score >= 50 ? 'var(--warning)' : 'var(--danger)'
                          }}>
                            {sp.score?.toFixed(0)}%
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
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
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', textAlign: 'right' }}>
          <button onClick={onClose} style={{
            padding: '10px 20px', borderRadius: 8, border: '1px solid var(--border)',
            background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer'
          }}>
            Close
          </button>
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

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

  const load = () => {
    setLoading(true)
    Promise.all([
      quizAPI.getMyQuizzes(),
      studentAPI.getAll()
    ])
      .then(([quizRes, studentRes]) => {
        setQuizzes(quizRes.data.data || [])
        setStudents(studentRes.data.data || [])
      })
      .catch(() => toast.error('Could not load data'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [user?.userId])

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

  return (
    <div>
      <PageHeader
        title="Quiz Builder"
        subtitle="Create and manage class quizzes with AI-suggested questions"
        action={
          <button onClick={handleCreateQuiz} disabled={creating}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', fontWeight: 700, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', cursor: creating ? 'not-allowed' : 'pointer' }}>
            <PlusCircle size={15} /> Create Quiz
          </button>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Topic / Module</div>
          <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Grammar correction case" style={{ width: '100%', padding: 10, border: '1px solid var(--border)', borderRadius: 8, outline: 'none', background: 'var(--bg-default)' }} />

          <div style={{ fontSize: 13, fontWeight: 600, marginTop: 12 }}>Class ID (optional)</div>
          <input value={classId} onChange={e => setClassId(e.target.value)} placeholder="e.g. class-A" style={{ width: '100%', padding: 10, border: '1px solid var(--border)', borderRadius: 8, outline: 'none', background: 'var(--bg-default)' }} />

          <div style={{ fontSize: 13, fontWeight: 600, marginTop: 12 }}>Question Count</div>
          <input type="number" min={1} max={12} value={questionCount} onChange={e => setQuestionCount(e.target.value)} style={{ width: '100%', padding: 10, border: '1px solid var(--border)', borderRadius: 8, outline: 'none', background: 'var(--bg-default)' }} />
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Source Text for Quiz Generation</div>
          <textarea value={text} onChange={e => setText(e.target.value)} rows={9} placeholder="Paste student paper text or topic summary here..." style={{ width: '100%', padding: 10, border: '1px solid var(--border)', borderRadius: 8, outline: 'none', background: 'var(--bg-default)' }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 10 }}>
        <Badge icon={BookOpen} variant="secondary">Set topic and source text then click Create Quiz</Badge>
        <Badge icon={CheckCircle} variant="success">AI enriches questions from source</Badge>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gap: 12 }}>
          {[1,2,3].map(i => <SkeletonCard key={i} rows={3} />)}
        </div>
      ) : quizzes.length === 0 ? (
        <EmptyState icon={BookOpen} title="No quizzes created yet" description="Start by creating a new quiz above." />
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          {quizzes.map((q) => (
            <div key={q.id} style={{ border: q.id === activeQuizId ? '2px solid var(--success)' : '1px solid var(--border)', background: 'var(--bg-card)', borderRadius: 12, padding: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 8 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{q.topic}</div>
                  {q.classId && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Class {q.classId}</span>}
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(q.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Badge icon={Send}>Questions: {q.questions?.length ?? 0}</Badge>
                <Badge icon={CheckCircle}>Quiz ID {q.id.slice(0, 6)}</Badge>
                {q.totalAttempts > 0 && <Badge icon={Users} variant="success">{q.totalAttempts} Attempts</Badge>}
              </div>
              <div style={{ marginTop: 12, display: 'grid', gap: 6 }}>
                {q.questions?.slice(0, 3).map((qq, idx) => (
                  <div key={qq.id} style={{ fontSize: 13, color: 'var(--text-secondary)' }}><strong>{idx + 1}.</strong> {qq.question}</div>
                ))}
                {q.questions?.length > 3 && (
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>+{q.questions.length - 3} more questions</div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
                <button
                  onClick={() => setDistributeQuiz(q)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
                    borderRadius: 8, border: 'none', background: 'var(--primary)', color: 'white',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer'
                  }}
                >
                  <Mail size={14} /> Distribute Quiz
                </button>
                <button
                  onClick={() => setViewResultsQuiz(q)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
                    borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-elevated)',
                    color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer'
                  }}
                >
                  <BarChart3 size={14} /> View Results
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
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
    </div>
  )
}
