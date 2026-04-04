import { api, studentAPI, classAPI, analysisAPI, authAPI } from './api'
import { requestCache } from '../utils/requestCache'

// Exponential backoff retry logic with longer delays for timeout resilience
// Heavy endpoints (dashboard, reports) may take 20-30s, so we retry aggressively
async function retryWithBackoff(fn, maxRetries = 5, initialDelayMs = 2000) {
  let lastError
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      // Retry on:
      // - Network timeouts (ECONNABORTED, timeout exceeded)
      // - Server errors (5xx)
      // Skip retries on client errors (4xx) except 408, 429, 504
      const isRetryableError = 
        !error.response || // Network error
        error.response.status >= 500 || // 5xx
        error.response.status === 408 || // Request Timeout
        error.response.status === 429 || // Too Many Requests
        error.response.status === 504 || // Gateway Timeout
        error.code === 'ECONNABORTED' // Timeout
      
      if (!isRetryableError) {
        throw error
      }
      
      if (i < maxRetries - 1) {
        // Exponential backoff: 2s, 4s, 8s, 16s, 32s
        const delay = initialDelayMs * Math.pow(2, i)
        console.warn(`Retry attempt ${i + 1}/${maxRetries} after ${delay}ms for:`, error.message)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  console.error('Max retries exceeded for:', lastError.message)
  throw lastError
}

// Optimized student API with caching
export const optimizedStudentAPI = {
  getAll: async () => {
    const cacheKey = 'students/all'
    
    // Return cached value if available
    const cached = requestCache.get(cacheKey)
    if (cached) return { data: { data: cached } }

    // Return pending request if one is already in flight
    const pending = requestCache.getPendingRequest(cacheKey)
    if (pending) return pending

    // Make new request with retry logic
    const request = retryWithBackoff(() => studentAPI.getAll())
      .then(res => {
        const students = res.data?.data || []
        // Do not cache empty lists; they are often transient during cold-start/index propagation.
        if (Array.isArray(students) && students.length > 0) {
          requestCache.set(cacheKey, students, 10 * 60 * 1000) // Cache for 10 mins
        } else {
          requestCache.clear(cacheKey)
        }
        return res
      })
      .catch(err => {
        // On error, try to return stale cache
        const staleCache = requestCache.cache.get(cacheKey)
        if (staleCache) return { data: { data: staleCache.data } }
        throw err
      })

    return requestCache.setPendingRequest(cacheKey, request)
  },

  getAllWithIndexRetry: async (maxRetries = 5, delayMs = 300) => {
    // Special method that retries on empty results (Firestore index delay)
    console.log('📚 [LOAD_RETRY] Starting student load with Firestore index retry...')
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        // Skip cache for retry attempts - always hit server
        const res = await retryWithBackoff(() => studentAPI.getAll())
        const students = res.data.data || []
        
        console.log(`📚 [LOAD_ATTEMPT ${i + 1}/${maxRetries}] Got ${students.length} students`)
        
        // If we got students OR this is the last retry, return
        if (students.length > 0 || i === maxRetries - 1) {
          // Cache successful result
          if (students.length > 0) {
            requestCache.set('students/all', students, 10 * 60 * 1000)
            console.log(`✅ [LOAD_SUCCESS] Student list cached`)
          }
          return { success: students.length > 0, data: { data: students }, attempts: i + 1 }
        }
        
        // Wait before retry (exponential backoff: 300ms, 600ms, 1.2s, 2.4s, 4.8s)
        const wait = delayMs * Math.pow(2, i)
        console.warn(`⏳ [LOAD_WAIT] Waiting ${wait}ms before retry ${i + 2}/${maxRetries} (Firestore index update in progress)`)
        await new Promise(r => setTimeout(r, wait))
        
      } catch (error) {
        console.error(`❌ [LOAD_ERROR_${i + 1}] Error on attempt ${i + 1}: ${error.message}`)
        if (i === maxRetries - 1) throw error
        const wait = delayMs * Math.pow(2, i)
        await new Promise(r => setTimeout(r, wait))
      }
    }
    
    return { success: false, data: { data: [] }, attempts: maxRetries }
  },

  getByClassId: async (classId) => {
    return retryWithBackoff(() => studentAPI.getByClassId(classId))
  },

  getByClassIdWithIndexRetry: async (classId, maxRetries = 5, delayMs = 350) => {
    const classKey = String(classId || '').trim().toLowerCase()
    const cacheKey = `students/class/${classKey}`

    // Cache only non-empty class rosters to avoid sticky empty states.
    const cached = requestCache.get(cacheKey)
    if (cached && Array.isArray(cached) && cached.length > 0) {
      return { success: true, data: { data: cached }, attempts: 0 }
    }

    for (let i = 0; i < maxRetries; i++) {
      try {
        const res = await retryWithBackoff(() => studentAPI.getByClassId(classId))
        const students = res.data?.data || []

        if (students.length > 0 || i === maxRetries - 1) {
          if (students.length > 0) {
            requestCache.set(cacheKey, students, 10 * 60 * 1000)
          } else {
            requestCache.clear(cacheKey)
          }
          return { success: students.length > 0, data: { data: students }, attempts: i + 1 }
        }

        const wait = delayMs * Math.pow(2, i)
        await new Promise(resolve => setTimeout(resolve, wait))
      } catch (error) {
        if (i === maxRetries - 1) throw error
        const wait = delayMs * Math.pow(2, i)
        await new Promise(resolve => setTimeout(resolve, wait))
      }
    }

    return { success: false, data: { data: [] }, attempts: maxRetries }
  },

  getById: (id) => {
    const cacheKey = `students/${id}`
    const cached = requestCache.get(cacheKey)
    if (cached) return Promise.resolve({ data: { data: cached } })
    
    return retryWithBackoff(() => studentAPI.getById(id))
      .then(res => {
        requestCache.set(cacheKey, res.data.data)
        return res
      })
  },

  create: (data) => {
    // Returns a promise that clears cache BEFORE resolving
    return retryWithBackoff(() => studentAPI.create(data))
      .then((res) => {
        // Clear cache BEFORE returning so subsequent getAll() calls get fresh data
        requestCache.clear('students/all')
        return res
      })
  },

  update: (id, data) => {
    // Returns a promise that clears cache BEFORE resolving
    return retryWithBackoff(() => studentAPI.update(id, data))
      .then((res) => {
        // Clear caches BEFORE returning so subsequent getAll() and getById() calls get fresh data
        requestCache.clear(`students/${id}`)
        requestCache.clear('students/all')
        return res
      })
  },

  remove: (id) => {
    // Returns a promise that clears cache BEFORE resolving
    return retryWithBackoff(() => studentAPI.remove(id))
      .then((res) => {
        // Clear caches BEFORE returning so subsequent getAll() and getById() calls get fresh data
        requestCache.clear(`students/${id}`)
        requestCache.clear('students/all')
        return res
      })
  },
}

// Optimized class API with retry + cache for first-load reliability
export const optimizedClassAPI = {
  getAll: async () => {
    const cacheKey = 'classes/all'

    const cached = requestCache.get(cacheKey)
    if (cached) return { data: { data: cached } }

    const pending = requestCache.getPendingRequest(cacheKey)
    if (pending) return pending

    const request = retryWithBackoff(() => classAPI.getAll(), 5)
      .then((res) => {
        const classes = res.data?.data || []
        // Do not cache empty lists; they can be temporary during backend warm-up.
        if (Array.isArray(classes) && classes.length > 0) {
          requestCache.set(cacheKey, classes, 10 * 60 * 1000)
        } else {
          requestCache.clear(cacheKey)
        }
        return res
      })

    return requestCache.setPendingRequest(cacheKey, request)
  },

  getAllWithIndexRetry: async (maxRetries = 5, delayMs = 350) => {
    const cacheKey = 'classes/all'

    const cached = requestCache.get(cacheKey)
    if (cached && Array.isArray(cached) && cached.length > 0) {
      return { success: true, data: { data: cached }, attempts: 0 }
    }

    for (let i = 0; i < maxRetries; i++) {
      try {
        const res = await retryWithBackoff(() => classAPI.getAll(), 5)
        const classes = res.data?.data || []

        if (classes.length > 0 || i === maxRetries - 1) {
          if (classes.length > 0) {
            requestCache.set(cacheKey, classes, 10 * 60 * 1000)
          } else {
            requestCache.clear(cacheKey)
          }
          return { success: classes.length > 0, data: { data: classes }, attempts: i + 1 }
        }

        const wait = delayMs * Math.pow(2, i)
        await new Promise(resolve => setTimeout(resolve, wait))
      } catch (error) {
        if (i === maxRetries - 1) throw error
        const wait = delayMs * Math.pow(2, i)
        await new Promise(resolve => setTimeout(resolve, wait))
      }
    }

    return { success: false, data: { data: [] }, attempts: maxRetries }
  },
}

// Optimized analysis API with caching
export const optimizedAnalysisAPI = {
  getReports: async () => {
    const cacheKey = 'analysis/reports'
    
    const cached = requestCache.get(cacheKey)
    if (cached) return { data: { data: cached } }

    const pending = requestCache.getPendingRequest(cacheKey)
    if (pending) return pending

    // Reports is heavy operation - longer timeout, aggressive retry
    const request = retryWithBackoff(() => analysisAPI.getReports(), 5)
      .then(res => {
        requestCache.set(cacheKey, res.data.data, 10 * 60 * 1000) // Cache for 10 mins (increased from 8)
        return res
      })
      .catch(err => {
        const staleCache = requestCache.cache.get(cacheKey)
        if (staleCache && staleCache.data) {
          console.warn('Falling back to stale reports cache due to:', err.message)
          return { data: { data: staleCache.data, isStale: true } }
        }
        throw err
      })

    return requestCache.setPendingRequest(cacheKey, request)
  },

  getDashboard: async () => {
    const cacheKey = 'analysis/dashboard'
    
    const cached = requestCache.get(cacheKey)
    if (cached) return { data: { data: cached } }

    const pending = requestCache.getPendingRequest(cacheKey)
    if (pending) return pending

    // Dashboard is heavy operation - longer timeout, aggressive retry
    const request = retryWithBackoff(() => analysisAPI.getDashboard(), 5)
      .then(res => {
        requestCache.set(cacheKey, res.data.data, 10 * 60 * 1000) // Cache for 10 mins (increased from 6)
        return res
      })
      .catch(err => {
        // On timeout/error, try to return stale cache with warning
        const staleCache = requestCache.cache.get(cacheKey)
        if (staleCache && staleCache.data) {
          console.warn('Falling back to stale dashboard cache due to:', err.message)
          return { data: { data: staleCache.data, isStale: true } }
        }
        throw err
      })

    return requestCache.setPendingRequest(cacheKey, request)
  },

  getStudentReport: async (studentId) => {
    const cacheKey = `analysis/student-report/${studentId}`
    
    const cached = requestCache.get(cacheKey)
    if (cached) return { data: { data: cached } }

    const pending = requestCache.getPendingRequest(cacheKey)
    if (pending) return pending

    const request = retryWithBackoff(() => analysisAPI.getStudentReport(studentId))
      .then(res => {
        requestCache.set(cacheKey, res.data.data, 10 * 60 * 1000) // Cache for 10 mins
        return res
      })

    return requestCache.setPendingRequest(cacheKey, request)
  },

  getProgress: async (studentId) => {
    const cacheKey = `analysis/progress/${studentId}`
    
    const cached = requestCache.get(cacheKey)
    if (cached) return { data: { data: cached } }

    const pending = requestCache.getPendingRequest(cacheKey)
    if (pending) return pending

    const request = retryWithBackoff(() => analysisAPI.getProgress(studentId))
      .then(res => {
        requestCache.set(cacheKey, res.data.data, 12 * 60 * 1000) // Cache for 12 mins
        return res
      })

    return requestCache.setPendingRequest(cacheKey, request)
  },

  upload: (studentId, file, onProgress) => {
    const request = analysisAPI.upload(studentId, file, onProgress)
    // Clear caches after upload
    request.then(() => {
      requestCache.clear('analysis/reports')
      requestCache.clear('analysis/dashboard')
      requestCache.clear(`analysis/student-report/${studentId}`)
      requestCache.clear(`analysis/progress/${studentId}`)
      requestCache.clear('students/all')
    })
    return request
  },
}

// Clear cache on logout
export const clearAllCaches = () => requestCache.clearAll()
