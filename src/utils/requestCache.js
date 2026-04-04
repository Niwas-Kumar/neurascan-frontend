// Simple in-memory request cache for frontend optimization
class RequestCache {
  constructor() {
    this.cache = new Map()
    this.timers = new Map()
    this.pendingRequests = new Map()
    this.CACHE_DURATION = 5 * 60 * 1000 // 5 minutes default
  }

  // Get cached value if available and not expired
  get(key) {
    if (this.cache.has(key)) {
      const { data, timestamp, ttl } = this.cache.get(key)
      const age = Date.now() - timestamp
      if (age < (ttl || this.CACHE_DURATION)) {
        return data
      } else {
        this.cache.delete(key)
      }
    }
    return null
  }

  // Set cache with auto-expiry
  set(key, data, duration = this.CACHE_DURATION) {
    this.cache.set(key, { data, timestamp: Date.now(), ttl: duration })
    
    // Clear old timer if exists
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key))
    }
    
    // Set new timer
    const timer = setTimeout(() => {
      this.cache.delete(key)
      this.timers.delete(key)
    }, duration)
    this.timers.set(key, timer)
  }

  // Clear specific cache key
  clear(key) {
    this.cache.delete(key)
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key))
      this.timers.delete(key)
    }
  }

  // Clear all cache
  clearAll() {
    this.cache.clear()
    this.timers.forEach(timer => clearTimeout(timer))
    this.timers.clear()
  }

  // Get or create pending request (deduplication)
  getPendingRequest(key) {
    return this.pendingRequests.get(key)
  }

  setPendingRequest(key, promise) {
    this.pendingRequests.set(key, promise)
    promise.finally(() => this.pendingRequests.delete(key))
    return promise
  }
}

export const requestCache = new RequestCache()
