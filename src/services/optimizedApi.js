import { api, studentAPI, analysisAPI, authAPI } from './api'
import { requestCache } from '../utils/requestCache'

// Exponential backoff retry logic
async function retryWithBackoff(fn, maxRetries = 3, initialDelayMs = 1000) {
  let lastError
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      // Only retry on network errors or 5xx errors, not 4xx
      if (error.response && error.response.status < 500) {
        throw error
      }
      if (i < maxRetries - 1) {
        const delay = initialDelayMs * Math.pow(2, i)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
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
        requestCache.set(cacheKey, res.data.data, 10 * 60 * 1000) // Cache for 10 mins
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
    const request = retryWithBackoff(() => studentAPI.create(data))
    // Clear list cache when creating new student
    request.then(() => requestCache.clear('students/all'))
    return request
  },

  update: (id, data) => {
    const request = retryWithBackoff(() => studentAPI.update(id, data))
    request.then(() => {
      requestCache.clear(`students/${id}`)
      requestCache.clear('students/all')
    })
    return request
  },

  remove: (id) => {
    const request = retryWithBackoff(() => studentAPI.remove(id))
    request.then(() => {
      requestCache.clear(`students/${id}`)
      requestCache.clear('students/all')
    })
    return request
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

    const request = retryWithBackoff(() => analysisAPI.getReports())
      .then(res => {
        requestCache.set(cacheKey, res.data.data, 8 * 60 * 1000) // Cache for 8 mins
        return res
      })
      .catch(err => {
        const staleCache = requestCache.cache.get(cacheKey)
        if (staleCache) return { data: { data: staleCache.data } }
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

    const request = retryWithBackoff(() => analysisAPI.getDashboard())
      .then(res => {
        requestCache.set(cacheKey, res.data.data, 6 * 60 * 1000) // Cache for 6 mins
        return res
      })
      .catch(err => {
        const staleCache = requestCache.cache.get(cacheKey)
        if (staleCache) return { data: { data: staleCache.data } }
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
