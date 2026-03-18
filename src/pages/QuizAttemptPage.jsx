import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, CheckCircle, XCircle, Clock, ArrowRight,
  AlertCircle, Trophy, Target, Loader2, RefreshCw
} from 'lucide-react'
import { quizAttemptAPI } from '../services/api'
import toast from 'react-hot-toast'

// ── Styles ────────────────────────────────────────────────────
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
    padding: '40px 20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  card: {
    maxWidth: 800,
    margin: '0 auto',
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    overflow: 'hidden',
  },
  header: {
    background: 'linear-gradient(135deg, #1a73e8 0%, #8b5cf6 100%)',
    padding: '32px 24px',
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
    fontSize: 28,
    fontWeight: 800,
    color: 'white',
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 20,
    fontWeight: 600,
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
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
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
    background: 'linear-gradient(90deg, #1a73e8, #8b5cf6)',
    borderRadius: 4,
    transition: 'width 0.3s ease',
  },
  progressText: {
    fontSize: 14,
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.8)',
    minWidth: 80,
    textAlign: 'right',
  },
  questionCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
  },
  questionNumber: {
    fontSize: 12,
    fontWeight: 700,
    color: '#8b5cf6',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 600,
    color: 'white',
    lineHeight: 1.5,
    marginBottom: 24,
  },
  optionsGrid: {
    display: 'grid',
    gap: 12,
  },
  option: (selected, correct, showResult) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '16px 18px',
    background: showResult
      ? correct
        ? 'rgba(16, 185, 129, 0.15)'
        : selected
          ? 'rgba(239, 68, 68, 0.15)'
          : 'rgba(255, 255, 255, 0.03)'
      : selected
        ? 'rgba(139, 92, 246, 0.2)'
        : 'rgba(255, 255, 255, 0.03)',
    border: showResult
      ? correct
        ? '2px solid rgba(16, 185, 129, 0.5)'
        : selected
          ? '2px solid rgba(239, 68, 68, 0.5)'
          : '1px solid rgba(255, 255, 255, 0.1)'
      : selected
        ? '2px solid rgba(139, 92, 246, 0.5)'
        : '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    cursor: showResult ? 'default' : 'pointer',
    transition: 'all 0.2s ease',
  }),
  optionLetter: (selected, correct, showResult) => ({
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 700,
    background: showResult
      ? correct
        ? 'rgba(16, 185, 129, 0.3)'
        : selected
          ? 'rgba(239, 68, 68, 0.3)'
          : 'rgba(255, 255, 255, 0.1)'
      : selected
        ? 'rgba(139, 92, 246, 0.3)'
        : 'rgba(255, 255, 255, 0.1)',
    color: showResult
      ? correct
        ? '#10b981'
        : selected
          ? '#ef4444'
          : 'rgba(255, 255, 255, 0.6)'
      : selected
        ? '#8b5cf6'
        : 'rgba(255, 255, 255, 0.6)',
  }),
  optionText: {
    flex: 1,
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  timer: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    padding: '8px 14px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 24,
  },
  button: (primary, disabled) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '14px 24px',
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 600,
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    background: primary
      ? 'linear-gradient(135deg, #1a73e8 0%, #8b5cf6 100%)'
      : 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    transition: 'transform 0.2s ease, opacity 0.2s ease',
  }),
  resultCard: {
    textAlign: 'center',
    padding: '40px 24px',
  },
  scoreCircle: {
    width: 160,
    height: 160,
    margin: '0 auto 24px',
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '4px solid',
  },
  scoreValue: {
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
    marginTop: 32,
  },
  statCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 20,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 700,
    color: 'white',
    marginBottom: 4,
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
    padding: '60px 24px',
    textAlign: 'center',
  },
  errorIcon: {
    width: 80,
    height: 80,
    margin: '0 auto 24px',
    borderRadius: '50%',
    background: 'rgba(239, 68, 68, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}

// ── Helper to format time ─────────────────────────────────────
const formatTime = (ms) => {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

// ── Main Component ────────────────────────────────────────────
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
  const [answers, setAnswers] = useState({}) // { questionId: { answer, timeMs, correct } }
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
      // Submit the answer to backend
      const res = await quizAttemptAPI.submitAnswer(
        attemptId,
        currentQuestion.id,
        selectedAnswer,
        responseTime
      )

      const responseData = res.data?.data

      // Store answer locally
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: {
          answer: selectedAnswer,
          timeMs: responseTime,
          correct: responseData?.isCorrect,
          correctAnswer: responseData?.correctAnswer,
        }
      }))

      // Show result briefly
      setShowResult(true)

      // Move to next question after delay
      setTimeout(() => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1)
          setSelectedAnswer(null)
          setShowResult(false)
          setQuestionStartTime(Date.now())
        } else {
          // Quiz complete - get final results
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
      const res = await quizAttemptAPI.completeAttempt(attemptId)
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
    if (score >= 80) return '#10b981'
    if (score >= 60) return '#f59e0b'
    return '#ef4444'
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
            <Loader2 size={48} color="#8b5cf6" style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginTop: 20 }}>Loading quiz...</p>
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
              <AlertCircle size={40} color="#ef4444" />
            </div>
            <h2 style={{ color: 'white', marginBottom: 12 }}>Quiz Link Error</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: 24 }}>{error}</p>
            <button
              onClick={() => window.location.reload()}
              style={styles.button(true, false)}
            >
              <RefreshCw size={18} /> Try Again
            </button>
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

            <h2 style={{ color: scoreColor, fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
              {getPerformanceLevel(score)}
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', marginBottom: 8 }}>
              You answered {finalResult.correctAnswers} out of {finalResult.totalQuestions} questions correctly.
            </p>

            <div style={styles.statGrid}>
              <div style={styles.statCard}>
                <div style={{ ...styles.statValue, color: '#10b981' }}>
                  <CheckCircle size={20} style={{ display: 'inline', marginRight: 6 }} />
                  {finalResult.correctAnswers}
                </div>
                <div style={styles.statLabel}>Correct</div>
              </div>
              <div style={styles.statCard}>
                <div style={{ ...styles.statValue, color: '#ef4444' }}>
                  <XCircle size={20} style={{ display: 'inline', marginRight: 6 }} />
                  {finalResult.totalQuestions - finalResult.correctAnswers}
                </div>
                <div style={styles.statLabel}>Incorrect</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statValue}>
                  <Clock size={20} style={{ display: 'inline', marginRight: 6 }} />
                  {formatTime(finalResult.totalTimeSpentMs || 0)}
                </div>
                <div style={styles.statLabel}>Time Spent</div>
              </div>
            </div>

            {finalResult.learningGapSummary && (
              <div style={{
                marginTop: 24,
                padding: 20,
                background: 'rgba(139, 92, 246, 0.1)',
                borderRadius: 12,
                textAlign: 'left'
              }}>
                <h4 style={{ color: '#8b5cf6', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Target size={18} /> Learning Insights
                </h4>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 14, lineHeight: 1.6 }}>
                  {finalResult.learningGapSummary}
                </p>
              </div>
            )}

            <div style={{ marginTop: 32 }}>
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
                      whileHover={!showResult ? { scale: 1.01 } : {}}
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
            <button
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
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
