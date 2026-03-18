import React, { useState, useEffect } from 'react';
import { API } from '../../services/api';
import '../../styles/ParentQuizProgress.css';

/**
 * ParentQuizProgress Component
 * Displays quiz progress and results for parent's child.
 * Shows:
 * - Quiz completion status
 * - Performance metrics
 * - AI Learning insights
 */
const ParentQuizProgress = ({ studentId }) => {
  const [attempts, setAttempts] = useState([]);
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadQuizAttempts();
  }, [studentId]);

  /**
   * Load all quiz attempts for the student
   */
  const loadQuizAttempts = async () => {
    try {
      setLoading(true);

      // Fetch quiz attempts - you may need to create this endpoint
      // For now, we'll assume this endpoint exists
      // const response = await API.get(`/api/student/${studentId}/quiz-attempts`);
      // setAttempts(response.data);

      // Placeholder data for development
      setAttempts([]);
      setError(null);
    } catch (err) {
      setError('Failed to load quiz progress');
      console.error('Error loading quiz attempts:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Format time in mm:ss
   */
  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  };

  /**
   * Get score color
   */
  const getScoreColor = (score) => {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'fair';
    return 'poor';
  };

  /**
   * Render loading state
   */
  if (loading) {
    return <div className="loading">Loading quiz progress...</div>;
  }

  /**
   * Render detailed attempt view
   */
  if (selectedAttempt) {
    return (
      <div className="attempt-detail-view">
        <button className="btn-back" onClick={() => setSelectedAttempt(null)}>
          ← Back to Progress
        </button>

        <div className="detail-header">
          <h2>Quiz: {selectedAttempt.quizTopic}</h2>
          <p className="attempt-date">
            Attempted on {new Date(selectedAttempt.completedAt).toLocaleDateString()}
          </p>
        </div>

        {/* Score Breakdown */}
        <div className="score-breakdown">
          <div className="score-circle">
            <div className="score-value">{selectedAttempt.score.toFixed(0)}%</div>
            <div className="score-label">Your Score</div>
          </div>

          <div className="breakdown-details">
            <div className="detail-row">
              <span>Correct Answers:</span>
              <span className="value">
                {selectedAttempt.correctAnswers}/{selectedAttempt.totalQuestions}
              </span>
            </div>
            <div className="detail-row">
              <span>Time Spent:</span>
              <span className="value">{formatTime(selectedAttempt.totalTimeSpentMs)}</span>
            </div>
            <div className="detail-row">
              <span>Accuracy:</span>
              <span className="value">
                {((selectedAttempt.correctAnswers / selectedAttempt.totalQuestions) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        {selectedAttempt.learningGapSummary && (
          <div className="ai-insights">
            <h3>🤖 Learning Analysis</h3>
            <p>{selectedAttempt.learningGapSummary}</p>

            {selectedAttempt.strongAreas && selectedAttempt.strongAreas.length > 0 && (
              <div className="insights-section">
                <h4>✅ What You Did Well</h4>
                <ul>
                  {selectedAttempt.strongAreas.map((area, idx) => (
                    <li key={idx}>{area}</li>
                  ))}
                </ul>
              </div>
            )}

            {selectedAttempt.weakAreas && selectedAttempt.weakAreas.length > 0 && (
              <div className="insights-section">
                <h4>📚 Areas to Practice</h4>
                <ul>
                  {selectedAttempt.weakAreas.map((area, idx) => (
                    <li key={idx}>{area}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Question Review */}
        {selectedAttempt.questionResponses && selectedAttempt.questionResponses.length > 0 && (
          <div className="question-review">
            <h3>Question Review</h3>
            {selectedAttempt.questionResponses.map((qr, idx) => (
              <div key={idx} className={`review-item ${qr.isCorrect ? 'correct' : 'incorrect'}`}>
                <div className="review-header">
                  <span className="q-num">Q{idx + 1}</span>
                  <span className={`status ${qr.isCorrect ? 'correct' : 'wrong'}`}>
                    {qr.isCorrect ? '✓' : '✗'}
                  </span>
                  <span className="time">{formatTime(qr.responseTimeMs)}</span>
                </div>
                <div className="review-content">
                  <p className="question">{qr.questionText}</p>
                  <div className="answer-review">
                    <div className="correct">
                      <strong>Correct:</strong> {qr.correctAnswer}
                    </div>
                    {!qr.isCorrect && (
                      <div className="wrong">
                        <strong>Your answer:</strong> {qr.studentAnswer || 'Not answered'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  /**
   * Render quiz progress list
   */
  return (
    <div className="parent-quiz-progress">
      <h2>📚 Quiz Progress</h2>

      {error && <div className="error-message">{error}</div>}

      {attempts.length > 0 ? (
        <div className="progress-list">
          {attempts.map((attempt, idx) => (
            <div
              key={idx}
              className={`progress-card ${getScoreColor(attempt.score)}`}
              onClick={() => setSelectedAttempt(attempt)}
            >
              <div className="card-left">
                <h3>{attempt.quizTopic}</h3>
                <p className="date">
                  {new Date(attempt.completedAt).toLocaleDateString()}
                </p>
              </div>

              <div className="card-right">
                <div className="score-display">
                  <span className="score">{attempt.score.toFixed(0)}%</span>
                  <span className="status">
                    {attempt.score >= 80 ? '🌟 Excellent' : ''}
                    {attempt.score >= 60 && attempt.score < 80 ? '👍 Good' : ''}
                    {attempt.score >= 40 && attempt.score < 60 ? '📈 Fair' : ''}
                    {attempt.score < 40 ? '💪 Keep Trying' : ''}
                  </span>
                </div>
                <p className="answers">
                  {attempt.correctAnswers}/{attempt.totalQuestions} correct
                </p>
              </div>

              <div className="card-arrow">→</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-quizzes">
          <p>📝 No quizzes attempted yet.</p>
          <p>Once your teacher sends you a quiz, you'll be able to attempt it here.</p>
        </div>
      )}
    </div>
  );
};

export default ParentQuizProgress;
