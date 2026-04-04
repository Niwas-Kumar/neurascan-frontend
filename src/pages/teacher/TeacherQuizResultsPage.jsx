import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Send, Users, Clock, CheckCircle, XCircle, Brain, X, Loader2 } from 'lucide-react'
import { quizAPI } from '../../services/api'
import { optimizedStudentAPI } from '../../services/optimizedApi'
import toast from 'react-hot-toast'

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
  bgCard: '#FFFFFF',
  bgMuted: '#F1F5F9',

  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#64748B',

  border: '#E2E8F0',

  // Risk colors
  riskHigh: '#ef4444',
  riskHighBg: 'rgba(239, 68, 68, 0.1)',
  riskMedium: '#f59e0b',
  riskMediumBg: 'rgba(245, 158, 11, 0.1)',
  riskLow: '#22c55e',
  riskLowBg: 'rgba(34, 197, 94, 0.1)',
}

function Card({ children, style = {} }) {
  return (
    <div
      style={{
        background: COLORS.bgCard,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 12,
        overflow: 'hidden',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color = 'primary' }) {
  const colors = {
    primary: { bg: COLORS.primaryBg, icon: COLORS.primary },
    success: { bg: COLORS.riskLowBg, icon: COLORS.riskLow },
    secondary: { bg: COLORS.secondaryBg, icon: COLORS.secondary },
  }
  const c = colors[color] || colors.primary

  return (
    <div
      style={{
        background: COLORS.bgCard,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 12,
        padding: 20,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: c.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 12px',
        }}
      >
        <Icon size={24} color={c.icon} />
      </div>
      <div
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 28,
          fontWeight: 700,
          color: COLORS.textPrimary,
          marginBottom: 4,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 12, color: COLORS.textMuted }}>{label}</div>
    </div>
  )
}

function formatTime(ms) {
  if (!ms) return '0m 0s'
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  return `${minutes}m ${seconds % 60}s`
}

export default function TeacherQuizResultsPage() {
  const { quizId } = useParams()
  const navigate = useNavigate()

  const [quiz, setQuiz] = useState(null)
  const [progress, setProgress] = useState(null)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [studentAttempt, setStudentAttempt] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showDistributionModal, setShowDistributionModal] = useState(false)
  const [students, setStudents] = useState([])

  useEffect(() => {
    loadQuizResults()
    loadStudentsList()
  }, [quizId])

  const loadQuizResults = async () => {
    try {
      setLoading(true)
      const quizResponse = await quizAPI.getQuiz(quizId)
      setQuiz(quizResponse.data?.data || quizResponse.data)
      const progressResponse = await quizAPI.getQuizProgress(quizId)
      setProgress(progressResponse.data?.data || progressResponse.data)
      setError(null)
    } catch (err) {
      setError(err.message || 'Failed to load quiz results')
    } finally {
      setLoading(false)
    }
  }

  const loadStudentsList = async () => {
    try {
      const response = await optimizedStudentAPI.getAllWithIndexRetry(4, 300)
      setStudents(response?.data?.data || [])
    } catch (err) {
      console.error('Error loading students:', err)
      toast.error('Unable to load students for distribution')
    }
  }

  const viewStudentAttempt = async (studentId) => {
    try {
      const response = await quizAPI.getStudentAttempts(studentId, quizId)
      const attempts = response.data?.data || response.data || []
      if (attempts.length > 0) {
        setStudentAttempt(attempts[0])
        setSelectedStudent(studentId)
      }
    } catch (err) {
      toast.error('Could not load student attempt')
    }
  }

  const handleDistributeQuiz = async (selectedStudents) => {
    try {
      await quizAPI.distributeQuiz(quizId, {
        studentIds: selectedStudents,
        customMessage: 'Please complete this quiz at your earliest convenience.',
      })
      setShowDistributionModal(false)
      await loadQuizResults()
      toast.success('Quiz distributed successfully!')
    } catch (err) {
      toast.error('Failed to distribute quiz')
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '16px 24px', textAlign: 'center', paddingTop: 80 }}>
        <Loader2 size={32} color={COLORS.primary} style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ color: COLORS.textMuted, marginTop: 12 }}>Loading quiz results...</p>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '16px 24px' }}>
        <Card style={{ padding: 40, textAlign: 'center' }}>
          <XCircle size={48} color={COLORS.riskHigh} style={{ marginBottom: 16 }} />
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
            Error
          </h2>
          <p style={{ color: COLORS.textMuted, marginBottom: 24 }}>{error}</p>
          <button
            onClick={() => navigate('/teacher/quizzes')}
            style={{
              padding: '10px 20px',
              background: COLORS.primary,
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Back to Quizzes
          </button>
        </Card>
      </div>
    )
  }

  // Student Attempt Detail View
  if (selectedStudent && studentAttempt) {
    return (
      <div style={{ padding: '16px 24px' }}>
        <button
          onClick={() => setSelectedStudent(null)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 16px',
            background: COLORS.bgCard,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 8,
            color: COLORS.textPrimary,
            fontSize: 14,
            cursor: 'pointer',
            marginBottom: 24,
          }}
        >
          <ArrowLeft size={16} />
          Back to Results
        </button>

        <h1
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 24,
            fontWeight: 700,
            color: COLORS.textPrimary,
            marginBottom: 24,
          }}
        >
          Attempt Details
        </h1>

        {/* Metrics */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 16,
            marginBottom: 32,
          }}
        >
          <StatCard
            icon={CheckCircle}
            label="Score"
            value={`${(studentAttempt.score || 0).toFixed(1)}%`}
            color={studentAttempt.score >= 70 ? 'success' : 'primary'}
          />
          <StatCard
            icon={Brain}
            label="Correct"
            value={`${studentAttempt.correctAnswers || 0}/${studentAttempt.totalQuestions || 0}`}
            color="secondary"
          />
          <StatCard icon={Clock} label="Time Taken" value={formatTime(studentAttempt.totalTimeSpentMs)} color="primary" />
        </div>

        {/* Question Analysis */}
        {studentAttempt.questionResponses?.length > 0 && (
          <Card style={{ marginBottom: 24 }}>
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${COLORS.border}` }}>
              <h2
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 18,
                  fontWeight: 600,
                  color: COLORS.textPrimary,
                }}
              >
                Question-by-Question Analysis
              </h2>
            </div>
            <div style={{ padding: 24 }}>
              {studentAttempt.questionResponses.map((qr, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: 16,
                    background: qr.isCorrect ? COLORS.riskLowBg : COLORS.riskHighBg,
                    borderRadius: 8,
                    marginBottom: idx < studentAttempt.questionResponses.length - 1 ? 12 : 0,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontWeight: 600, color: COLORS.textPrimary }}>Q{idx + 1}</span>
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: 13,
                        color: qr.isCorrect ? COLORS.riskLow : COLORS.riskHigh,
                        fontWeight: 500,
                      }}
                    >
                      {qr.isCorrect ? <CheckCircle size={14} /> : <XCircle size={14} />}
                      {qr.isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                  <p style={{ fontSize: 14, color: COLORS.textPrimary, marginBottom: 12 }}>{qr.questionText}</p>
                  <div style={{ display: 'grid', gap: 8 }}>
                    <div
                      style={{
                        padding: '8px 12px',
                        background: COLORS.bgCard,
                        borderRadius: 6,
                        border: `1px solid ${COLORS.riskLow}30`,
                      }}
                    >
                      <span style={{ fontSize: 12, color: COLORS.textMuted }}>Correct: </span>
                      <span style={{ fontSize: 14, color: COLORS.riskLow, fontWeight: 500 }}>{qr.correctAnswer}</span>
                    </div>
                    {!qr.isCorrect && (
                      <div
                        style={{
                          padding: '8px 12px',
                          background: COLORS.bgCard,
                          borderRadius: 6,
                          border: `1px solid ${COLORS.riskHigh}30`,
                        }}
                      >
                        <span style={{ fontSize: 12, color: COLORS.textMuted }}>Student's: </span>
                        <span style={{ fontSize: 14, color: COLORS.riskHigh, fontWeight: 500 }}>
                          {qr.studentAnswer || 'Not answered'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* AI Analysis */}
        {studentAttempt.learningGapSummary && (
          <Card>
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${COLORS.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Brain size={18} color={COLORS.primary} />
                <h2
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 18,
                    fontWeight: 600,
                    color: COLORS.textPrimary,
                  }}
                >
                  AI Learning Analysis
                </h2>
              </div>
            </div>
            <div style={{ padding: 24 }}>
              <p style={{ fontSize: 14, color: COLORS.textSecondary, lineHeight: 1.6, marginBottom: 16 }}>
                {studentAttempt.learningGapSummary}
              </p>
              {studentAttempt.strongAreas?.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 600, color: COLORS.riskLow, marginBottom: 8 }}>Strong Areas</h4>
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {studentAttempt.strongAreas.map((area, i) => (
                      <li key={i} style={{ fontSize: 14, color: COLORS.textSecondary, marginBottom: 4 }}>
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {studentAttempt.weakAreas?.length > 0 && (
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 600, color: COLORS.riskMedium, marginBottom: 8 }}>
                    Areas for Improvement
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {studentAttempt.weakAreas.map((area, i) => (
                      <li key={i} style={{ fontSize: 14, color: COLORS.textSecondary, marginBottom: 4 }}>
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    )
  }

  // Main Results View
  return (
    <div style={{ padding: '16px 24px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 32,
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <button
            onClick={() => navigate('/teacher/quizzes')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              background: 'transparent',
              border: 'none',
              color: COLORS.textMuted,
              fontSize: 13,
              cursor: 'pointer',
              marginBottom: 8,
            }}
          >
            <ArrowLeft size={14} />
            Back to Quizzes
          </button>
          <h1
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 28,
              fontWeight: 700,
              color: COLORS.textPrimary,
              marginBottom: 4,
            }}
          >
            {quiz?.topic || 'Quiz Results'}
          </h1>
          <p style={{ color: COLORS.textMuted, fontSize: 14 }}>
            {quiz?.questions?.length || 0} questions · Created{' '}
            {quiz?.createdAt ? new Date(quiz.createdAt).toLocaleDateString() : ''}
          </p>
        </div>
        <button
          onClick={() => setShowDistributionModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 18px',
            background: COLORS.primary,
            color: 'white',
            border: 'none',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          <Send size={16} />
          Distribute Quiz
        </button>
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 16,
          marginBottom: 32,
        }}
      >
        <StatCard icon={Users} label="Total Attempts" value={progress?.totalAttempts || 0} color="primary" />
        <StatCard
          icon={CheckCircle}
          label="Participation Rate"
          value={`${progress?.participationRate || 0}%`}
          color="secondary"
        />
        <StatCard
          icon={Brain}
          label="Average Score"
          value={`${(progress?.averageScore || 0).toFixed(1)}%`}
          color="success"
        />
      </div>

      {/* Student Results Table */}
      <Card>
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${COLORS.border}` }}>
          <h2
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 18,
              fontWeight: 600,
              color: COLORS.textPrimary,
            }}
          >
            Student Results
          </h2>
        </div>

        {!progress?.studentProgress?.length ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <Users size={48} color={COLORS.textMuted} style={{ marginBottom: 16 }} />
            <p style={{ color: COLORS.textMuted, marginBottom: 16 }}>No students have attempted this quiz yet.</p>
            <button
              onClick={() => setShowDistributionModal(true)}
              style={{
                padding: '10px 20px',
                background: COLORS.primary,
                color: 'white',
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Distribute to Students
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: COLORS.bgMuted }}>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: 12, fontWeight: 500, color: COLORS.textMuted }}>
                    Student
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 500, color: COLORS.textMuted }}>
                    Score
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 500, color: COLORS.textMuted }}>
                    Time
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 500, color: COLORS.textMuted }}>
                    Date
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 500, color: COLORS.textMuted }}>
                    Status
                  </th>
                  <th style={{ padding: '12px 24px', textAlign: 'right', fontSize: 12, fontWeight: 500, color: COLORS.textMuted }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {progress.studentProgress.map((student, idx) => (
                  <tr key={idx} style={{ borderTop: `1px solid ${COLORS.border}` }}>
                    <td style={{ padding: '16px 24px', fontSize: 14, fontWeight: 500, color: COLORS.textPrimary }}>
                      {student.studentName}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span
                        style={{
                          padding: '4px 12px',
                          borderRadius: 9999,
                          fontSize: 13,
                          fontWeight: 500,
                          background: student.score >= 70 ? COLORS.riskLowBg : COLORS.riskHighBg,
                          color: student.score >= 70 ? COLORS.riskLow : COLORS.riskHigh,
                        }}
                      >
                        {(student.score || 0).toFixed(1)}%
                      </span>
                    </td>
                    <td style={{ padding: '16px', fontSize: 14, color: COLORS.textMuted }}>
                      {formatTime(student.timeSpentMs)}
                    </td>
                    <td style={{ padding: '16px', fontSize: 14, color: COLORS.textMuted }}>
                      {student.attemptDate ? new Date(student.attemptDate).toLocaleDateString() : '-'}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span
                        style={{
                          padding: '4px 12px',
                          borderRadius: 9999,
                          fontSize: 12,
                          fontWeight: 500,
                          background: student.completed ? COLORS.riskLowBg : COLORS.riskMediumBg,
                          color: student.completed ? COLORS.riskLow : COLORS.riskMedium,
                        }}
                      >
                        {student.completed ? 'Completed' : 'Pending'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      {student.completed && (
                        <button
                          onClick={() => viewStudentAttempt(student.studentId)}
                          style={{
                            padding: '6px 14px',
                            background: COLORS.bgCard,
                            border: `1px solid ${COLORS.border}`,
                            borderRadius: 6,
                            fontSize: 13,
                            fontWeight: 500,
                            color: COLORS.textPrimary,
                            cursor: 'pointer',
                          }}
                        >
                          View Details
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Distribution Modal */}
      {showDistributionModal && (
        <DistributionModal
          quiz={quiz}
          students={students}
          onClose={() => setShowDistributionModal(false)}
          onDistribute={handleDistributeQuiz}
        />
      )}
    </div>
  )
}

function DistributionModal({ quiz, students, onClose, onDistribute }) {
  const [selectedStudents, setSelectedStudents] = useState([])
  const [sending, setSending] = useState(false)

  const toggleStudent = (id) => {
    setSelectedStudents((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]))
  }

  const handleDistribute = async () => {
    if (selectedStudents.length === 0) {
      toast.error('Please select at least one student')
      return
    }
    setSending(true)
    try {
      await onDistribute(selectedStudents)
    } finally {
      setSending(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: COLORS.bgCard,
          borderRadius: 12,
          width: '100%',
          maxWidth: 480,
          maxHeight: '80vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${COLORS.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 18,
                  fontWeight: 700,
                  color: COLORS.textPrimary,
                  marginBottom: 4,
                }}
              >
                Distribute Quiz
              </h2>
              <p style={{ fontSize: 13, color: COLORS.textMuted }}>{quiz?.topic}</p>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: COLORS.bgMuted,
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                color: COLORS.textMuted,
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
          <p style={{ fontSize: 14, color: COLORS.textMuted, marginBottom: 16 }}>Select students to distribute this quiz to:</p>
          <div
            style={{
              border: `1px solid ${COLORS.border}`,
              borderRadius: 8,
              maxHeight: 300,
              overflow: 'auto',
            }}
          >
            {students.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: COLORS.textMuted }}>No students found</div>
            ) : (
              students.map((student) => (
                <label
                  key={student.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 16px',
                    borderBottom: `1px solid ${COLORS.border}`,
                    cursor: 'pointer',
                    background: selectedStudents.includes(student.id) ? COLORS.primaryBg : 'transparent',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student.id)}
                    onChange={() => toggleStudent(student.id)}
                    style={{ width: 16, height: 16, accentColor: COLORS.primary }}
                  />
                  <span style={{ fontSize: 14, color: COLORS.textPrimary }}>{student.name}</span>
                </label>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: `1px solid ${COLORS.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: COLORS.bgMuted,
          }}
        >
          <span style={{ fontSize: 13, color: COLORS.textMuted }}>{selectedStudents.length} selected</span>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={onClose}
              style={{
                padding: '10px 18px',
                background: COLORS.bgCard,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                color: COLORS.textPrimary,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleDistribute}
              disabled={sending || selectedStudents.length === 0}
              style={{
                padding: '10px 18px',
                background: COLORS.primary,
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                color: 'white',
                cursor: sending || selectedStudents.length === 0 ? 'not-allowed' : 'pointer',
                opacity: sending || selectedStudents.length === 0 ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {sending ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={16} />}
              {sending ? 'Sending...' : 'Send Quiz'}
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
