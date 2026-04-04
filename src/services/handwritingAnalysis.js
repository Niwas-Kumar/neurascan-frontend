import axios from 'axios'

/**
 * Service for communicating with Python AI backend for real handwriting analysis
 * Real ML-based dyslexia/dysgraphia detection (NO fake random scores)
 * 
 * Production: https://neurascan-python-ai.onrender.com
 * Local Dev: http://localhost:5000
 */

// Connect to Python Flask AI backend (Production Render URL)
const AI_API_URL = import.meta.env.VITE_AI_API_URL || 'https://neurascan-python-ai.onrender.com'

const aiClient = axios.create({
  baseURL: AI_API_URL,
  timeout: 60000, // 60 seconds for ML processing
})

const getJwtToken = () => {
  const localToken = localStorage.getItem('ns_token')
  if (localToken) return localToken
  return sessionStorage.getItem('ns_token')
}

// Attach JWT automatically for protected AI endpoints
aiClient.interceptors.request.use((config) => {
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

// Response interceptor for error handling
aiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('AI API Error:', err.message)
    throw err
  }
)

/**
 * Analyze handwriting image for dyslexia/dysgraphia risk
 * @param {File} file - Image file to analyze
 * @param {string} extractedText - Optional OCR text from image
 * @returns {Promise<Object>} Analysis results with scores and details
 */
export const analyzeHandwriting = async (file, extractedText = '') => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    if (extractedText) {
      formData.append('text', extractedText)
    }

    const response = await aiClient.post('/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    console.error('Handwriting analysis failed:', error)
    return {
      success: false,
      error: error.response?.data?.error || error.message,
    }
  }
}

/**
 * Analyze with external enrichment
 * @param {File} file - Image file to analyze
 * @param {string} extractedText - Optional OCR text from image
 * @returns {Promise<Object>} Analysis results
 */
export const analyzeHandwritingExternal = async (file, extractedText = '') => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    if (extractedText) {
      formData.append('text', extractedText)
    }

    const response = await aiClient.post('/analyze/external', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    console.error('External handwriting analysis failed:', error)
    return {
      success: false,
      error: error.response?.data?.error || error.message,
    }
  }
}

/**
 * Generate quiz from handwritten text
 * @param {string} topic - Quiz topic
 * @param {string} text - Extracted text from handwriting
 * @param {number} questionCount - Number of questions to generate
 * @returns {Promise<Object>} Generated quiz
 */
export const generateQuizFromText = async (topic, text, questionCount = 5) => {
  try {
    const response = await aiClient.post('/quiz/generate', {
      topic,
      text,
      question_count: questionCount,
    })

    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    console.error('Quiz generation failed:', error)
    return {
      success: false,
      error: error.response?.data?.error || error.message,
    }
  }
}

/**
 * Check AI backend health
 * @returns {Promise<boolean>} True if backend is healthy
 */
export const checkAIBackendHealth = async () => {
  try {
    const response = await aiClient.get('/health', { timeout: 5000 })
    return response.data?.status === 'healthy'
  } catch (error) {
    console.warn('AI backend health check failed:', error.message)
    return false
  }
}

/**
 * Parse analysis results for display
 * @param {Object} analysisData - Raw analysis response from backend
 * @returns {Object} Formatted analysis for UI
 */
export const formatAnalysisResults = (analysisData) => {
  if (!analysisData) return null

  const dyslexiaScore = analysisData.dyslexia_score || 0
  const dysgraphiaScore = analysisData.dysgraphia_score || 0
  const dyslexiaDetails = analysisData.dyslexia_details || {}
  const dysgraphiaDetails = analysisData.dysgraphia_details || {}

  return {
    dyslexia: {
      score: Math.round(dyslexiaScore),
      confidence: dyslexiaDetails.confidence || 'UNKNOWN',
      recommendation: dyslexiaDetails.recommendation || 'Unable to determine',
      primaryIndicator: dyslexiaDetails.primary_indicator || 'No indicators',
      riskLevel: getRiskLevel(dyslexiaScore),
    },
    dysgraphia: {
      score: Math.round(dysgraphiaScore),
      confidence: dysgraphiaDetails.confidence || 'UNKNOWN',
      recommendation: dysgraphiaDetails.recommendation || 'Unable to determine',
      indicators: dysgraphiaDetails.indicators || [],
      primaryConcern: dysgraphiaDetails.primary_concern || 'No concerns',
      riskLevel: getRiskLevel(dysgraphiaScore),
    },
    analysisType: analysisData.analysis_type || 'Real ML Analysis',
    timestamp: new Date().toISOString(),
  }
}

/**
 * Determine risk level from score
 * @param {number} score - Score from 0-100
 * @returns {string} Risk level: LOW, MODERATE, HIGH
 */
const getRiskLevel = (score) => {
  if (score > 70) return 'HIGH'
  if (score > 40) return 'MODERATE'
  return 'LOW'
}

export default {
  analyzeHandwriting,
  analyzeHandwritingExternal,
  generateQuizFromText,
  checkAIBackendHealth,
  formatAnalysisResults,
}
