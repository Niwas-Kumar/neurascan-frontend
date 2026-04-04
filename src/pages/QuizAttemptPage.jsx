// ============================================================
// QUIZ ATTEMPT PAGE - NeuraScan Design System v3.0
// Public-facing page for students/parents to take quizzes
// ============================================================
import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, CheckCircle, XCircle, Clock, ArrowRight,
  AlertCircle, Trophy, Target, Loader2, RefreshCw
} from 'lucide-react'
import { quizAttemptAPI } from '../services/api'
import toast from 'react-hot-toast'

// ════════════════════════════════════════════════════════════════
// DESIGN SYSTEM COLORS
// ════════════════════════════════════════════════════════════════
const COLORS = {
  primary: '#312E81',
  primaryLight: '#4338CA',
  primaryLighter: '#6366F1',
  primaryBg: '#EEF2FF',
  secondary: '#14B8A6',
  secondaryDark: '#0D9488',
  secondaryBg: '#CCFBF1',
  riskHigh: '#B91C1C',
  riskHighBg: '#FEF2F2',
  riskMedium: '#B45309',
  riskMediumBg: '#FFFBEB',
  riskLow: '#047857',
  riskLowBg: '#ECFDF5',
  textPrimary: '#1E293B',
  textSecondary: '#475569',
  textMuted: '#64748B',
  textLight: '#94A3B8',
  bgBase: '#F8FAFC',
  bgSurface: '#FFFFFF',
  bgSubtle: '#F1F5F9',
  border: '#E2E8F0',
}

// ════════════════════════════════════════════════════════════════
// STYLES
// ════════════════════════════════════════════════════════════════
const styles = {
  container: {
    minHeight: '100vh',
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, #1E1B4B 50%, ${COLORS.primary} 100%)`,
    padding: '40px 20px',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  card: {
    maxWidth: 800,
    margin: '0 auto',
    background: 'rgba(255, 255, 255, 0.04)',
    backdropFilter: 'blur(24px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
    overflow: 'hidden',
  },
  header: {
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
    padding: '36px 24px',
    textAlign: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 16,
  },
  logoText: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 28,
    fontWeight: 800,
    color: 'white',
    letterSpacing: '-0.02em',
  },
  title: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 20,
    fontWeight: 700,
    color: 'rgba(255, 255, 255, 0.95)',
    margin: 0,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 8,
  },
  content: {
    padding: '32px 24px',
  },
  progressBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
    padding: '16px 20px',
    background: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 14,
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  progressTrack: {
    flex: 1,
    height: 8,
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
    borderRadius: 4,
    transition: 'width 0.3s ease',
  },
  progressText: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 14,
    fontWeight: 700,
    color: 'rgba(255, 255, 255, 0.9)',
    minWidth: 80,
    textAlign: 'right',
  },
  questionCard: {
    background: 'rgba(255, 255, 255, 0.06)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: 18,
    padding: 28,
    marginBottom: 24,
  },
  questionNumber: {
    fontSize: 12,
    fontWeight: 700,
    color: COLORS.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 14,
  },
  questionText: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 18,
    fontWeight: 600,
    color: 'white',
    lineHeight: 1.6,
    marginBottom: 28,
  },
  optionsGrid: {
    display: 'grid',
    gap: 14,
  },
  option: (selected, correct, showResult) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '18px 20px',
    background: showResult
      ? correct
        ? 'rgba(4, 120, 87, 0.2)'
        : selected
          ? 'rgba(185, 28, 28, 0.2)'
          : 'rgba(255, 255, 255, 0.04)'
      : selected
        ? 'rgba(20, 184, 166, 0.15)'
        : 'rgba(255, 255, 255, 0.04)',
    border: showResult
      ? correct
        ? `2px solid ${COLORS.riskLow}`
        : selected
          ? `2px solid ${COLORS.riskHigh}`
          : '1px solid rgba(255, 255, 255, 0.1)'
      : selected
        ? `2px solid ${COLORS.secondary}`
        : '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 14,
    cursor: showResult ? 'default' : 'pointer',
    transition: 'all 0.2s ease',
  }),
  optionLetter: (selected, correct, showResult) => ({
    width: 36,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 700,
    background: showResult
      ? correct
        ? 'rgba(4, 120, 87, 0.3)'
        : selected
          ? 'rgba(185, 28, 28, 0.3)'
          : 'rgba(255, 255, 255, 0.1)'
      : selected
        ? 'rgba(20, 184, 166, 0.3)'
        : 'rgba(255, 255, 255, 0.1)',
    color: showResult
      ? correct
        ? COLORS.riskLow
        : selected
          ? '#FCA5A5'
          : 'rgba(255, 255, 255, 0.6)'
      : selected
        ? COLORS.secondary
        : 'rgba(255, 255, 255, 0.6)',
  }),
  optionText: {
    flex: 1,
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 1.5,
  },
  timer: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 14,
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.8)',
    padding: '8px 14px',
    background: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 10,
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
  },
  button: (primary, disabled) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '14px 28px',
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 600,
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    background: primary
      ? `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`
      : 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    transition: 'transform 0.2s ease, opacity 0.2s ease',
    fontFamily: "'Inter', sans-serif",
    boxShadow: primary ? '0 8px 24px rgba(49, 46, 129, 0.4)' : 'none',
  }),
  resultCard: {
    textAlign: 'center',
    padding: '48px 24px',
  },
  scoreCircle: {
    width: 160,
    height: 160,
    margin: '0 auto 28px',
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, 0.06)',
    border: '4px solid',
  },
  scoreValue: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 48,
    fontWeight: 800,
    color: 'white',
  },
  scoreLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 4,
  },
  statGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 16,
    marginTop: 36,
  },
  statCard: {
    background: 'rgba(255, 255, 255, 0.06)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    padding: 20,
    textAlign: 'center',
  },
  statValue: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 24,
    fontWeight: 700,
    color: 'white',
    marginBottom: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 24px',
    textAlign: 'center',
  },
  errorContainer: {
    padding: '64px 24px',
    textAlign: 'center',
  },
  errorIcon: {
    width: 80,
    height: 80,
    margin: '0 auto 24px',
    borderRadius: '50%',
    background: 'rgba(185, 28, 28, 0.15)',
    border: `1px solid ${COLORS.riskHigh}40`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}

// ════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ════════════════════════════════════════════════════════════════
const formatTime = (ms) => {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

// ════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════
export default function QuizAttemptPage() {
  const [searchParams] = useSearchParams()

  // URL params
  const quizId = searchParams.get('quizId')
  const token = searchParams.get('token')

  // State
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quiz, setQuiz] = useState(null)
  const [attemptId, setAttemptId] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [answers, setAnswers] = useState({})
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())
  const [totalTime, setTotalTime] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [finalResult, setFinalResult] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  // Timer ref
  const timerRef = useRef(null)

  // Validate link and load quiz on mount
  useEffect(() => {
    if (!quizId || !token) {
      setError('Invalid quiz link. Please check your email for the correct link.')
      setLoading(false)
      return
    }

    validateAndLoadQuiz()
  }, [quizId, token])

  // Timer effect
  useEffect(() => {
    if (quiz && !showResult && !finalResult) {
      timerRef.current = setInterval(() => {
        setTotalTime(Date.now() - questionStartTime)
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [quiz, showResult, finalResult, questionStartTime])

  const validateAndLoadQuiz = async () => {
    try {
      setLoading(true)

      // Step 1: Validate the link
      const validateRes = await quizAttemptAPI.validateLink(quizId, token)
      const quizData = validateRes.data?.data

      if (!quizData?.valid) {
        setError(quizData?.message || 'Invalid or expired quiz link.')
        return
      }

      // Step 2: Start the attempt
      const startRes = await quizAttemptAPI.startAttempt(quizId, token)
      const attemptData = startRes.data?.data

      setQuiz(quizData)
      setAttemptId(attemptData.id)
      setQuestionStartTime(Date.now())

    } catch (err) {
      console.error('Quiz load error:', err)
      setError(err.response?.data?.message || 'Could not load quiz. The link may be invalid or expired.')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAnswer = (answer) => {
    if (showResult) return
    setSelectedAnswer(answer)
  }

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || submitting) return

    const currentQuestion = quiz.questions[currentQuestionIndex]
    const responseTime = Date.now() - questionStartTime

    setSubmitting(true)

    try {
      const res = await quizAttemptAPI.submitAnswer(
        attemptId,
        currentQuestion.id,
        selectedAnswer,
        responseTime,
        token
      )

      const responseData = res.data?.data

      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: {
          answer: selectedAnswer,
          timeMs: responseTime,
          correct: responseData?.isCorrect,
          correctAnswer: responseData?.correctAnswer,
        }
      }))

      setShowResult(true)

      setTimeout(() => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1)
          setSelectedAnswer(null)
          setShowResult(false)
          setQuestionStartTime(Date.now())
        } else {
          completeQuiz()
        }
      }, 1500)

    } catch (err) {
      toast.error('Could not submit answer. Please try again.')
      console.error('Submit answer error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const completeQuiz = async () => {
    try {
      setSubmitting(true)
      const res = await quizAttemptAPI.completeAttempt(attemptId, token)
      setFinalResult(res.data?.data)
      clearInterval(timerRef.current)
    } catch (err) {
      console.error('Complete quiz error:', err)
      toast.error('Could not complete quiz. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 80) return COLORS.riskLow
    if (score >= 60) return COLORS.riskMedium
    return COLORS.riskHigh
  }

  const getPerformanceLevel = (score) => {
    if (score >= 90) return 'Excellent!'
    if (score >= 80) return 'Great Job!'
    if (score >= 60) return 'Good Effort!'
    if (score >= 40) return 'Keep Practicing!'
    return 'Needs Improvement'
  }

  // ── Render Loading ──────────────────────────────────────────
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <div style={styles.logo}>
              <Brain size={32} color="white" />
              <span style={styles.logoText}>NeuraScan</span>
            </div>
          </div>
          <div style={styles.loadingContainer}>
            <Loader2 size={48} color={COLORS.secondary} style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginTop: 20, fontSize: 15 }}>Loading quiz...</p>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </div>
        </div>
      </div>
    )
  }

  // ── Render Error ────────────────────────────────────────────
  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <div style={styles.logo}>
              <Brain size={32} color="white" />
              <span style={styles.logoText}>NeuraScan</span>
            </div>
          </div>
          <div style={styles.errorContainer}>
            <div style={styles.errorIcon}>
              <AlertCircle size={40} color={COLORS.riskHigh} />
            </div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: 'white', marginBottom: 12, fontSize: 22, fontWeight: 700 }}>Quiz Link Error</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: 28, fontSize: 15, lineHeight: 1.6 }}>{error}</p>
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={validateAndLoadQuiz}
              style={styles.button(true, false)}
            >
              <RefreshCw size={18} /> Try Again
            </motion.button>
          </div>
        </div>
      </div>
    )
  }

  // ── Render Final Results ────────────────────────────────────
  if (finalResult) {
    const score = finalResult.score || 0
    const scoreColor = getScoreColor(score)

    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <div style={styles.logo}>
              <Brain size={32} color="white" />
              <span style={styles.logoText}>NeuraScan</span>
            </div>
            <h1 style={styles.title}>Quiz Complete!</h1>
          </div>
          <div style={styles.resultCard}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              style={{ ...styles.scoreCircle, borderColor: scoreColor }}
            >
              <span style={styles.scoreValue}>{Math.round(score)}%</span>
              <span style={styles.scoreLabel}>Score</span>
            </motion.div>

            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: scoreColor, fontSize: 26, fontWeight: 800, marginBottom: 8 }}>
              {getPerformanceLevel(score)}
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', marginBottom: 8, fontSize: 15 }}>
              You answered {finalResult.correctAnswers} out of {finalResult.totalQuestions} questions correctly.
            </p>

            <div style={styles.statGrid}>
              <div style={styles.statCard}>
                <div style={{ ...styles.statValue, color: COLORS.riskLow }}>
                  <CheckCircle size={20} />
                  {finalResult.correctAnswers}
                </div>
                <div style={styles.statLabel}>Correct</div>
              </div>
              <div style={styles.statCard}>
                <div style={{ ...styles.statValue, color: '#FCA5A5' }}>
                  <XCircle size={20} />
                  {finalResult.totalQuestions - finalResult.correctAnswers}
                </div>
                <div style={styles.statLabel}>Incorrect</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statValue}>
                  <Clock size={20} />
                  {formatTime(finalResult.totalTimeSpentMs || 0)}
                </div>
                <div style={styles.statLabel}>Time Spent</div>
              </div>
            </div>

            {finalResult.learningGapSummary && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                  marginTop: 28,
                  padding: 24,
                  background: `${COLORS.secondary}15`,
                  border: `1px solid ${COLORS.secondary}30`,
                  borderRadius: 16,
                  textAlign: 'left'
                }}
              >
                <h4 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: COLORS.secondary, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700 }}>
                  <Target size={18} /> Learning Insights
                </h4>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 14, lineHeight: 1.7 }}>
                  {finalResult.learningGapSummary}
                </p>
              </motion.div>
            )}

            <div style={{ marginTop: 36 }}>
              <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 13 }}>
                Your results have been saved. Your teacher and parent can view your progress.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Render Quiz ─────────────────────────────────────────────
  const currentQuestion = quiz?.questions?.[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100
  const currentAnswer = answers[currentQuestion?.id]

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>
            <Brain size={32} color="white" />
            <span style={styles.logoText}>NeuraScan</span>
          </div>
          <h1 style={styles.title}>{quiz.topic}</h1>
          <p style={styles.subtitle}>Answer each question carefully</p>
        </div>

        <div style={styles.content}>
          {/* Progress Bar */}
          <div style={styles.progressBar}>
            <div style={styles.progressTrack}>
              <motion.div
                style={styles.progressFill}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
            <span style={styles.progressText}>
              {currentQuestionIndex + 1} / {quiz.questions.length}
            </span>
            <div style={styles.timer}>
              <Clock size={16} />
              {formatTime(totalTime)}
            </div>
          </div>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              style={styles.questionCard}
            >
              <div style={styles.questionNumber}>Question {currentQuestionIndex + 1}</div>
              <div style={styles.questionText}>{currentQuestion?.question}</div>

              <div style={styles.optionsGrid}>
                {currentQuestion?.options?.map((option, idx) => {
                  const letter = String.fromCharCode(65 + idx)
                  const isSelected = selectedAnswer === option
                  const isCorrect = showResult && currentAnswer?.correctAnswer === option

                  return (
                    <motion.div
                      key={idx}
                      whileHover={!showResult ? { scale: 1.01, background: 'rgba(255, 255, 255, 0.08)' } : {}}
                      whileTap={!showResult ? { scale: 0.99 } : {}}
                      style={styles.option(isSelected, isCorrect, showResult)}
                      onClick={() => handleSelectAnswer(option)}
                    >
                      <div style={styles.optionLetter(isSelected, isCorrect, showResult)}>
                        {showResult && isCorrect ? <CheckCircle size={16} /> :
                         showResult && isSelected && !isCorrect ? <XCircle size={16} /> : letter}
                      </div>
                      <span style={styles.optionText}>{option}</span>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div style={styles.buttonRow}>
            <motion.button
              whileHover={!(!selectedAnswer || submitting || showResult) ? { y: -2 } : {}}
              whileTap={!(!selectedAnswer || submitting || showResult) ? { scale: 0.98 } : {}}
              disabled={!selectedAnswer || submitting || showResult}
              style={styles.button(true, !selectedAnswer || submitting || showResult)}
              onClick={handleSubmitAnswer}
            >
              {submitting ? (
                <>
                  <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  Submitting...
                </>
              ) : currentQuestionIndex === quiz.questions.length - 1 ? (
                <>
                  <Trophy size={18} /> Finish Quiz
                </>
              ) : (
                <>
                  Submit & Next <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
