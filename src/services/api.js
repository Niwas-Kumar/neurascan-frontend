import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

// ── Axios instance ────────────────────────────────────────────
// Increased timeout from 15s to 45s to handle slow first requests
// Some endpoints (dashboard, reports) may take 20-30s on cold start
export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 45000, // 45 seconds - allows for slow initial requests
})

const getJwtToken = () => {
  const localToken = localStorage.getItem('ns_token')
  if (localToken) return localToken
  // Legacy fallback for older sessions that wrote auth into sessionStorage.
  return sessionStorage.getItem('ns_token')
}

// Attach JWT on every request
api.interceptors.request.use((config) => {
  const token = getJwtToken()
  const hasAuthHeader = config.headers?.Authorization || config.headers?.authorization

  if (token && !hasAuthHeader) {
    if (typeof config.headers?.set === 'function') {
      config.headers.set('Authorization', `Bearer ${token}`)
    } else {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }
  }

  return config
})

// Track if we're already handling a 401 redirect to prevent loops
let isRedirecting = false

// Global response error handler
api.interceptors.response.use(
  (res) => {
    // Auto-refresh token if backend sends X-New-Token header
    const newToken = res.headers['x-new-token']
    if (newToken) {
      localStorage.setItem('ns_token', newToken)
      // Dispatch custom event so AuthContext can update React state
      window.dispatchEvent(new CustomEvent('ns-token-refreshed', { detail: { token: newToken } }))
    }
    return res
  },
  (err) => {
    // Only redirect on 401 for non-auth endpoints
    // Auth endpoints (login, register, forgot/reset password) should handle their own errors
    const url = err.config?.url || ''
    const isAuthEndpoint = url.includes('/auth/')
    const isPublicTokenEndpoint = url.includes('/quiz-attempt/') || url.includes('/quizzes/public/')
    const errorMessage = err.response?.data?.message || ''

    // ✅ IMPROVED: Don't logout if it's just a missing studentId configuration
    // This is a user config issue, not a session/auth issue
    const isStudentIdMissing = errorMessage.includes('STUDENT_ID_NOT_SET') ||
                               errorMessage.includes('Student ID not set in your profile')

    // ✅ FIX: Only logout on 401 (unauthorized), NOT on 403 (forbidden)
    // 403 means the user IS authenticated but doesn't have permission
    // 401 means the token is invalid/expired
    // Also: skip if no response (network error / CORS block — NOT a true 401)
    if (err.response?.status === 401 && !isAuthEndpoint && !isPublicTokenEndpoint && !isStudentIdMissing && !isRedirecting) {
      isRedirecting = true
      
      // ✅ FIX: Only clear authentication token, preserve other data (studentId, userId, etc)
      // This allows parents to re-login without losing their child's student ID
      localStorage.removeItem('ns_token')
      localStorage.removeItem('ns_role')
      localStorage.removeItem('ns_userName')
      localStorage.removeItem('ns_userEmail')
      localStorage.removeItem('ns_school')
      localStorage.removeItem('ns_picture')
      // Also clear any legacy sessionStorage auth remnants.
      sessionStorage.removeItem('ns_token')
      sessionStorage.removeItem('ns_role')
      sessionStorage.removeItem('ns_userName')
      sessionStorage.removeItem('ns_userEmail')
      sessionStorage.removeItem('ns_school')
      sessionStorage.removeItem('ns_picture')
      // ⚠️ NOTE: Intentionally NOT clearing ns_studentId or ns_userId

      // Small delay to let any other in-flight requests complete before redirect
      setTimeout(() => {
        window.location.href = '/login?session=expired'
      }, 100)
    }

    // Log 403 errors for debugging but don't logout
    return Promise.reject(err)
  }
)

// ── AUTH ─────────────────────────────────────────────────────
export const authAPI = {
  teacherRegister:  (data) => api.post('/auth/teacher/register', data),
  teacherLogin:     (data) => api.post('/auth/teacher/login', data),
  parentRegister:   (data) => api.post('/auth/parent/register', data),
  parentLogin:      (data) => api.post('/auth/parent/login', data),

  // Password Reset (NEW — requires backend endpoints)
  forgotPassword:   (data) => api.post('/auth/forgot-password', data),
  resetPassword:    (data) => api.post('/auth/reset-password', data),
  verifyResetToken: (token) => api.get(`/auth/verify-reset-token?token=${token}`),
  firebaseLogin:    (idToken, role, picture) => api.post('/auth/firebase-login', { idToken, role, picture }),
  
  // OTP Pre-Registration
  sendOtp:          (data) => api.post('/auth/send-otp', data),
  verifyOtp:        (data) => api.post('/auth/verify-otp', data),

  // Profile
  updateProfile:    (data) => api.put('/auth/profile', data),
  changePassword:   (data) => api.put('/auth/change-password', data),
}

// ── STUDENTS ─────────────────────────────────────────────────
export const studentAPI = {
  getAll:    ()         => api.get('/students'),
  getByClassId: (classId) => api.get('/students', { params: { classId } }),
  getById:   (id)       => api.get(`/students/${id}`),
  create:    (data)     => api.post('/students', data),
  update:    (id, data) => api.put(`/students/${id}`, data),
  remove:    (id)       => api.delete(`/students/${id}`),
}

// ── CLASSES ──────────────────────────────────────────────────
export const classAPI = {
  getAll: () => api.get('/classes'),
  create: (data) => api.post('/classes', data),
}

// ── ANALYSIS ─────────────────────────────────────────────────
export const analysisAPI = {
  upload: (studentId, file, onProgress) => {
    const fd = new FormData()
    fd.append('studentId', studentId)
    fd.append('file', file)
    return api.post('/analysis/upload', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress,
    })
  },
  getReports:       ()          => api.get('/analysis/reports'),
  getDashboard:     ()          => api.get('/analysis/dashboard'),
  getStudentReport: (studentId) => api.get(`/analysis/student-report/${studentId}`),
  getProgress:      (studentId) => api.get(`/analysis/progress/${studentId}`),
}

export const quizAPI = {
  createQuiz: (data) => api.post('/quizzes', data),
  getMyQuizzes: () => api.get('/quizzes'),
  getQuizById: (id) => api.get(`/quizzes/${id}`),
  submitQuiz: (quizId, data) => api.post(`/quizzes/${quizId}/submit`, data),
  getQuizResponses: (quizId) => api.get(`/quizzes/${quizId}/responses`),
  getStudentResponses: (studentId) => api.get(`/quizzes/student/${studentId}/responses`),

  // New endpoint for quiz attempts (parent dashboard)
  getStudentQuizAttempts: (studentId) => api.get(`/quizzes/student/${studentId}/all-attempts`),

  // Quiz Distribution (Teacher)
  distributeQuiz: (quizId, data) => api.post(`/quizzes/${quizId}/distribute`, data),
  getQuizProgress: (quizId) => api.get(`/quizzes/${quizId}/progress`),
}

// ── PUBLIC QUIZ ATTEMPT API (No Auth Required) ─────────────
// These endpoints are accessed via token-based links sent to parents
export const quizAttemptAPI = {
  // Security: token is transmitted only via Authorization header.
  authHeader: (token) => ({ headers: { Authorization: `Bearer ${token}` } }),

  // Validate quiz link token and get quiz questions
  validateLink: (quizId, token) =>
    api.get(`/quiz-attempt/validate?quizId=${quizId}`, quizAttemptAPI.authHeader(token)),

  // Start a new quiz attempt session
  startAttempt: (quizId, token) =>
    api.post('/quiz-attempt/start', { quizId }, quizAttemptAPI.authHeader(token)),

  // Submit answer for a single question
  submitAnswer: (attemptId, questionId, studentAnswer, responseTimeMs, token) =>
    api.post(
      `/quiz-attempt/${attemptId}/answer`,
      { questionId, studentAnswer, responseTimeMs },
      quizAttemptAPI.authHeader(token)
    ),

  // Complete the quiz and get results
  completeAttempt: (attemptId, token) =>
    api.post(`/quiz-attempt/${attemptId}/complete`, {}, quizAttemptAPI.authHeader(token)),

  // Get quiz attempt result
  getResult: (attemptId, token) =>
    api.get(`/quiz-attempt/${attemptId}/result`, quizAttemptAPI.authHeader(token)),
}

// ── PARENT-STUDENT CONNECTIONS ────────────────────────────────
// Persistent parent-student relationship management
export const parentStudentAPI = {
  // Validate a student ID before connecting
  validateStudent: (studentId) => api.get(`/parent/students/validate/${studentId}`),

  // Get all connected students
  getConnectedStudents: () => api.get('/parent/students'),

  // Get primary connected student
  getPrimaryStudent: () => api.get('/parent/students/primary'),

  // Initiate connection (sends OTP)
  connectStudent: (studentId) => api.post('/parent/students/connect', {
    studentId,
    verificationMethod: 'OTP'
  }),

  // Verify connection with OTP
  verifyConnection: (relationshipId, otp) => api.post('/parent/students/verify', {
    relationshipId,
    otp
  }),

  // Resend verification OTP
  resendOTP: (relationshipId) => api.post(`/parent/students/resend-otp/${relationshipId}`),

  // Disconnect from a student
  disconnectStudent: (studentId, reason) => api.delete(`/parent/students/${studentId}`, {
    data: { studentId, reason }
  }),

  // Set a student as primary
  setPrimaryStudent: (studentId) => api.put(`/parent/students/${studentId}/primary`),
}

export default api
