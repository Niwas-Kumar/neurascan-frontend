import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API } from '../services/api';
import '../styles/QuizResults.css';

/**
 * TeacherQuizResultsPage
 * Shows comprehensive quiz analytics and results for teachers.
 * Features:
 * - Quiz distribution statistics
 * - Student performance metrics
 * - Per-student attempt tracking
 * - AI analysis results
 */
const TeacherQuizResultsPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [progress, setProgress] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentAttempt, setStudentAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDistributionModal, setShowDistributionModal] = useState(false);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    loadQuizResults();
    loadStudentsList();
  }, [quizId]);

  /**
   * Load quiz details and progress
   */
  const loadQuizResults = async () => {
    try {
      setLoading(true);

      // Fetch quiz details
      const quizResponse = await API.get(`/api/quizzes/${quizId}`);
      setQuiz(quizResponse.data);

      // Fetch quiz progress
      const progressResponse = await API.get(`/api/quizzes/${quizId}/progress`);
      setProgress(progressResponse.data);

      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load quiz results');
      console.error('Error loading quiz results:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load list of students for distribution
   */
  const loadStudentsList = async () => {
    try {
      const response = await API.get('/api/students');
      setStudents(response.data);
    } catch (err) {
      console.error('Error loading students:', err);
    }
  };

  /**
   * Load detailed attempt for a student
   */
  const viewStudentAttempt = async (studentId) => {
    try {
      const response = await API.get(`/api/quizzes/student/${studentId}/attempts?quizId=${quizId}`);
      if (response.data && response.data.length > 0) {
        setStudentAttempt(response.data[0]); // Get latest attempt
        setSelectedStudent(studentId);
      }
    } catch (err) {
      console.error('Error loading student attempt:', err);
    }
  };

  /**
   * Distribute quiz to selected students
   */
  const handleDistributeQuiz = async (selectedStudents) => {
    try {
      await API.post(`/api/quizzes/${quizId}/distribute`, {
        studentIds: selectedStudents,
        customMessage: 'Check your progress on your QuizProgress page after attempting.',
      });

      setShowDistributionModal(false);
      await loadQuizResults();
      alert('✅ Quiz distributed successfully!');
    } catch (err) {
      alert('❌ Failed to distribute quiz: ' + err.message);
    }
  };

  /**
   * Format time
   */
  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  };

  /**
   * Render loading state
   */
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading quiz results...</p>
      </div>
    );
  }

  /**
   * Render error state
   */
  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/teacher/dashboard')}>Back to Dashboard</button>
      </div>
    );
  }

  /**
   * Render detailed student attempt view
   */
  if (selectedStudent && studentAttempt) {
    return (
      <div className="student-attempt-details">
        <button className="btn-back" onClick={() => setSelectedStudent(null)}>
          ← Back to Results
        </button>

        <div className="attempt-header">
          <h2>Attempt Details</h2>
          <p className="student-name">Student: {studentAttempt.studentId}</p>
        </div>

        <div className="attempt-metrics">
          <div className="metric-card">
            <span className="label">Score</span>
            <span className="value">{studentAttempt.score.toFixed(1)}%</span>
          </div>
          <div className="metric-card">
            <span className="label">Correct Answers</span>
            <span className="value">{studentAttempt.correctAnswers}/{studentAttempt.totalQuestions}</span>
          </div>
          <div className="metric-card">
            <span className="label">Time Taken</span>
            <span className="value">{formatTime(studentAttempt.totalTimeSpentMs)}</span>
          </div>
          <div className="metric-card">
            <span className="label">Attempt Date</span>
            <span className="value">{new Date(studentAttempt.completedAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Question-by-Question Analysis */}
        {studentAttempt.questionResponses && studentAttempt.questionResponses.length > 0 && (
          <div className="question-analysis">
            <h3>Question-by-Question Analysis</h3>
            {studentAttempt.questionResponses.map((qr, idx) => (
              <div key={idx} className={`question-detail ${qr.isCorrect ? 'correct' : 'incorrect'}`}>
                <div className="q-header">
                  <span className="q-number">Q{idx + 1}</span>
                  <span className={`q-status ${qr.isCorrect ? 'correct' : 'incorrect'}`}>
                    {qr.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                  </span>
                  <span className="q-time">{formatTime(qr.responseTimeMs)}</span>
                </div>

                <div className="q-content">
                  <p className="question-text">{qr.questionText}</p>
                  <div className="answer-comparison">
                    <div className="answer-item correct-answer">
                      <span className="label">Correct Answer:</span>
                      <span className="answer">{qr.correctAnswer}</span>
                    </div>
                    <div className={`answer-item ${qr.isCorrect ? 'correct-answer' : 'wrong-answer'}`}>
                      <span className="label">Student's Answer:</span>
                      <span className="answer">{qr.studentAnswer || 'Not answered'}</span>
                    </div>
                  </div>

                  {qr.explanationNote && (
                    <div className="explanation">
                      <strong>Explanation:</strong> {qr.explanationNote}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AI Analysis */}
        {studentAttempt.learningGapSummary && (
          <div className="ai-insights">
            <h3>🤖 AI Learning Analysis</h3>
            <p>{studentAttempt.learningGapSummary}</p>

            {studentAttempt.strongAreas && studentAttempt.strongAreas.length > 0 && (
              <div className="insights-group">
                <h4>✅ Strong Areas</h4>
                <ul>
                  {studentAttempt.strongAreas.map((area, idx) => (
                    <li key={idx}>{area}</li>
                  ))}
                </ul>
              </div>
            )}

            {studentAttempt.weakAreas && studentAttempt.weakAreas.length > 0 && (
              <div className="insights-group">
                <h4>📈 Areas for Improvement</h4>
                <ul>
                  {studentAttempt.weakAreas.map((area, idx) => (
                    <li key={idx}>{area}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  /**
   * Render main quiz results view
   */
  return (
    <div className="quiz-results-page">
      <header className="page-header">
        <button className="btn-back" onClick={() => navigate('/teacher/dashboard')}>
          ← Back to Dashboard
        </button>
        <h1>{quiz?.topic}</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowDistributionModal(true)}
        >
          📧 Distribute Quiz
        </button>
      </header>

      {/* Quiz Overview */}
      <section className="quiz-overview">
        <h2>Quiz Overview</h2>
        <div className="overview-grid">
          <div className="overview-card">
            <span className="icon">📊</span>
            <span className="label">Total Distributed</span>
            <span className="stat">{progress?.totalAttempts || 0}</span>
          </div>
          <div className="overview-card">
            <span className="icon">👥</span>
            <span className="label">Participation Rate</span>
            <span className="stat">{progress?.participationRate || 0}%</span>
          </div>
          <div className="overview-card">
            <span className="icon">⭐</span>
            <span className="label">Average Score</span>
            <span className="stat">{progress?.averageScore?.toFixed(1) || 0}%</span>
          </div>
          <div className="overview-card">
            <span className="icon">❓</span>
            <span className="label">Total Questions</span>
            <span className="stat">{quiz?.questions?.length || 0}</span>
          </div>
        </div>
      </section>

      {/* Student Results */}
      {progress?.studentProgress && progress.studentProgress.length > 0 ? (
        <section className="student-results">
          <h2>Student Results</h2>
          <div className="results-table">
            <div className="table-header">
              <div className="col name">Student Name</div>
              <div className="col score">Score</div>
              <div className="col time">Time Taken</div>
              <div className="col date">Attempt Date</div>
              <div className="col status">Status</div>
              <div className="col action">Action</div>
            </div>

            {progress.studentProgress.map((student, idx) => (
              <div key={idx} className="table-row">
                <div className="col name">{student.studentName}</div>
                <div className="col score">
                  <span className={`score-badge ${student.score >= 70 ? 'pass' : 'fail'}`}>
                    {student.score.toFixed(1)}%
                  </span>
                </div>
                <div className="col time">{formatTime(student.timeSpentMs)}</div>
                <div className="col date">
                  {student.attemptDate ? new Date(student.attemptDate).toLocaleDateString() : '-'}
                </div>
                <div className="col status">
                  <span className={`status-badge ${student.completed ? 'completed' : 'pending'}`}>
                    {student.completed ? '✓ Completed' : '⏳ Pending'}
                  </span>
                </div>
                <div className="col action">
                  {student.completed && (
                    <button
                      className="btn-view"
                      onClick={() => viewStudentAttempt(student.studentId)}
                    >
                      View Details
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="no-results">
          <p>No students have attempted this quiz yet.</p>
          <button
            className="btn btn-primary"
            onClick={() => setShowDistributionModal(true)}
          >
            Distribute Quiz to Students
          </button>
        </section>
      )}

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
  );
};

/**
 * Distribution Modal Component
 */
const DistributionModal = ({ quiz, students, onClose, onDistribute }) => {
  const [selectedStudents, setSelectedStudents] = useState([]);

  const handleToggleStudent = (studentId) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter((id) => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Distribute Quiz</h2>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <p>Select students to distribute "{quiz.topic}" to:</p>

          <div className="students-list">
            {students.map((student) => (
              <label key={student.id} className="student-checkbox">
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(student.id)}
                  onChange={() => handleToggleStudent(student.id)}
                />
                <span>{student.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={() => onDistribute(selectedStudents)}
            disabled={selectedStudents.length === 0}
          >
            Distribute to {selectedStudents.length} Student{selectedStudents.length !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherQuizResultsPage;
