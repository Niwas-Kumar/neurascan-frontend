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

// Attach JWT on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ns_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Global response error handler
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Only redirect on 401 for non-auth endpoints
    // Auth endpoints (login, register, forgot/reset password) should handle their own errors
    const url = err.config?.url || ''
    const isAuthEndpoint = url.includes('/auth/')
    if (err.response?.status === 401 && !isAuthEndpoint) {
      // ✅ FIX: Only clear authentication token, preserve other data (studentId, userId, etc)
      // This allows parents to re-login without losing their child's student ID
      localStorage.removeItem('ns_token')
      localStorage.removeItem('ns_role')
      localStorage.removeItem('ns_userName')
      localStorage.removeItem('ns_userEmail')
      localStorage.removeItem('ns_school')
      localStorage.removeItem('ns_picture')
      // ⚠️ NOTE: Intentionally NOT clearing ns_studentId or ns_userId
      window.location.href = '/login?session=expired'
    }
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
  getById:   (id)       => api.get(`/students/${id}`),
  create:    (data)     => api.post('/students', data),
  update:    (id, data) => api.put(`/students/${id}`, data),
  remove:    (id)       => api.delete(`/students/${id}`),
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
}

export default api
