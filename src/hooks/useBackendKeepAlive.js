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
        const token = localStorage.getItem('token')
        const headers = token ? { Authorization: `Bearer ${token}` } : {}

        await fetch(`${import.meta.env.VITE_API_URL}/ping`, {
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
