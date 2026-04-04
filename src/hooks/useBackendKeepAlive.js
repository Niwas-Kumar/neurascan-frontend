import { useEffect } from 'react'

/**
 * Hook to keep the Render backend awake by pinging it periodically
 * Prevents the free Render tier from spinning down due to inactivity
 *
 * @param {number} intervalMs - Interval between pings in milliseconds (default: 14 minutes)
 */
export const useBackendKeepAlive = (intervalMs = 14 * 60 * 1000) => {
  useEffect(() => {
    const pingBackend = async () => {
      try {
        // /ping is a root-level endpoint, so strip /api suffix from VITE_API_URL
        const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '')
        const token = localStorage.getItem('ns_token')
        const headers = token ? { Authorization: `Bearer ${token}` } : {}

        await fetch(`${baseUrl}/ping`, {
          method: 'GET',
          headers,
        }).catch(() => {
          // Silently fail - this is just a keep-alive ping
        })
      } catch (error) {
        // Silently fail
      }
    }

    // Initial ping
    pingBackend()

    // Set up periodic pings
    const interval = setInterval(pingBackend, intervalMs)

    return () => clearInterval(interval)
  }, [intervalMs])
}
