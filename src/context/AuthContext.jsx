import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { clearAllCaches } from '../services/optimizedApi'

const AuthContext = createContext(null)

const STORAGE_KEYS = {
  token:     'ns_token',
  role:      'ns_role',
  userId:    'ns_userId',
  userName:  'ns_userName',
  userEmail: 'ns_userEmail',
  studentId: 'ns_studentId',
  school:    'ns_school',
  picture:   'ns_picture',
  theme:     'ns_theme',
}

// Grace period (5 minutes) to tolerate minor client/server clock drift
const CLOCK_SKEW_MS = 5 * 60 * 1000

// Synchronous session restore — runs during initial useState so user is
// available from the very first render, eliminating any race condition
// where child components mount before the auth state is ready.
function restoreSession() {
  const token     = localStorage.getItem(STORAGE_KEYS.token)
  const role      = localStorage.getItem(STORAGE_KEYS.role)
  if (!token || !role) return null

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    if (payload.exp * 1000 < Date.now() - CLOCK_SKEW_MS) {
      localStorage.removeItem(STORAGE_KEYS.token)
      localStorage.removeItem(STORAGE_KEYS.role)
      localStorage.removeItem(STORAGE_KEYS.userName)
      localStorage.removeItem(STORAGE_KEYS.userEmail)
      localStorage.removeItem(STORAGE_KEYS.school)
      localStorage.removeItem(STORAGE_KEYS.picture)
      return null
    }
  } catch {
    localStorage.removeItem(STORAGE_KEYS.token)
    localStorage.removeItem(STORAGE_KEYS.role)
    return null
  }

  const userId    = localStorage.getItem(STORAGE_KEYS.userId)
  const name      = localStorage.getItem(STORAGE_KEYS.userName)
  const email     = localStorage.getItem(STORAGE_KEYS.userEmail)
  const studentId = localStorage.getItem(STORAGE_KEYS.studentId)
  const school    = localStorage.getItem(STORAGE_KEYS.school)
  const rawPicture = localStorage.getItem(STORAGE_KEYS.picture)
  const picture = (rawPicture === 'null' || rawPicture === 'undefined' || !rawPicture) ? null : rawPicture
  return { token, role, userId, name, email, studentId, school, picture }
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(restoreSession)
  const [loading, setLoading] = useState(false)
  const [theme, setThemeState]= useState(() => localStorage.getItem(STORAGE_KEYS.theme) || 'dark')

  // ── Listen for backend-initiated token refresh (X-New-Token header) ──
  useEffect(() => {
    const handleTokenRefresh = (e) => {
      const newToken = e.detail?.token
      if (newToken) {
        setUser(prev => prev ? { ...prev, token: newToken } : prev)
      }
    }
    window.addEventListener('ns-token-refreshed', handleTokenRefresh)
    return () => window.removeEventListener('ns-token-refreshed', handleTokenRefresh)
  }, [])

  // ── Proactive token check: verify token hasn't expired while tab was idle ──
  useEffect(() => {
    if (!user?.token) return

    const checkToken = () => {
      const token = localStorage.getItem(STORAGE_KEYS.token)
      if (!token) return
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        const timeLeft = payload.exp * 1000 - Date.now()
        if (timeLeft < 0) {
          // Token expired while tab was open — clear session
          Object.values(STORAGE_KEYS).forEach(k => {
            if (k !== STORAGE_KEYS.studentId && k !== STORAGE_KEYS.userId)
              localStorage.removeItem(k)
          })
          setUser(null)
        }
      } catch { /* malformed token — ignore, will fail on next API call */ }
    }

    // Check every 60 seconds AND when tab becomes visible again
    const interval = setInterval(checkToken, 60_000)
    const handleVisibility = () => { if (document.visibilityState === 'visible') checkToken() }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [user?.token])

  // Notifications state (in-app, non-persistent demo)
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'info',    title: 'Welcome to NeuraScan v2', body: 'Explore the new dashboard features.', read: false, time: new Date() },
    { id: 2, type: 'success', title: 'System ready',            body: 'All AI services are operational.',   read: false, time: new Date() },
  ])

  const login = useCallback((data) => {
    const { jwtToken, userRole, userId, userName, studentId, school, picture } = data
    const finalRole = userRole.startsWith('ROLE_') ? userRole : `ROLE_${userRole.toUpperCase()}`
    const finalEmail = data.userEmail || data.email || ''
    
    localStorage.setItem(STORAGE_KEYS.token,     jwtToken)
    localStorage.setItem(STORAGE_KEYS.role,      finalRole)
    localStorage.setItem(STORAGE_KEYS.userId,    String(userId))
    localStorage.setItem(STORAGE_KEYS.userName,  userName)
    localStorage.setItem(STORAGE_KEYS.userEmail, finalEmail)
    if (studentId) localStorage.setItem(STORAGE_KEYS.studentId, String(studentId))
    if (school)    localStorage.setItem(STORAGE_KEYS.school,    school)
    
    // Properly clear or set picture
    if (picture && picture !== 'null') {
      localStorage.setItem(STORAGE_KEYS.picture, picture)
    } else {
      localStorage.removeItem(STORAGE_KEYS.picture)
    }

    setUser({ 
      token: jwtToken, 
      role: finalRole, 
      userId, 
      name: userName, 
      email: finalEmail, 
      studentId: studentId || null, 
      school, 
      picture: (picture && picture !== 'null') ? picture : null 
    })

    // Welcome notification
    setNotifications(n => [{
      id: Date.now(), type: 'success',
      title: `Welcome back, ${userName.split(' ')[0]}!`,
      body: 'You have been signed in successfully.',
      read: false, time: new Date(),
    }, ...n])
  }, [])

  const handleOAuthLogin = useCallback((jwtToken) => {
    // Basic decode of JWT payload to extract user info
    try {
        const payloadBase64 = jwtToken.split('.')[1]
        const decodedJson = atob(payloadBase64)
        const payload = JSON.parse(decodedJson)
        
        const userRole = payload.role || 'ROLE_TEACHER'
        const userEmail = payload.sub || ''
        const userName = payload.name || 'Google User'
        const userId = payload.userId || ''
        const picture = payload.picture || null
        
        localStorage.setItem(STORAGE_KEYS.token, jwtToken)
        localStorage.setItem(STORAGE_KEYS.role, userRole)
        localStorage.setItem(STORAGE_KEYS.userEmail, userEmail)
        localStorage.setItem(STORAGE_KEYS.userName, userName)
        localStorage.setItem(STORAGE_KEYS.userId, String(userId))
        if(picture) localStorage.setItem(STORAGE_KEYS.picture, picture)
        
        setUser({ token: jwtToken, role: userRole, userId: userId, email: userEmail, name: userName, picture: picture })
    } catch(e) {
        throw e
    }
  }, [])

  const updateUser = useCallback((data) => {
    const { name, jwtToken, studentId, school, picture, token } = data
    const finalToken = jwtToken || token
    
    if (finalToken) localStorage.setItem(STORAGE_KEYS.token, finalToken)
    if (name)     localStorage.setItem(STORAGE_KEYS.userName, name)
    if (studentId)localStorage.setItem(STORAGE_KEYS.studentId, String(studentId))
    if (school)   localStorage.setItem(STORAGE_KEYS.school,    school)
    
    if (picture !== undefined) {
      if (picture && picture !== 'null') localStorage.setItem(STORAGE_KEYS.picture, picture)
      else localStorage.removeItem(STORAGE_KEYS.picture)
    }

    setUser(prev => ({
      ...prev,
      token: finalToken || prev.token,
      name: name || prev.name,
      studentId: studentId !== undefined ? (studentId || null) : prev.studentId,
      school: school || prev.school,
      picture: picture !== undefined ? (picture === 'null' ? null : picture) : prev.picture
    }))
  }, [])

  const logout = useCallback(() => {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k))
    clearAllCaches() // Clear all cached API responses
    setUser(null)
    setNotifications([])
  }, [])

  const markAllRead = useCallback(() => {
    setNotifications(n => n.map(x => ({ ...x, read: true })))
  }, [])

  const addNotification = useCallback((notif) => {
    setNotifications(n => [{ id: Date.now(), read: false, time: new Date(), ...notif }, ...n])
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState(t => {
      const next = t === 'dark' ? 'light' : 'dark'
      localStorage.setItem(STORAGE_KEYS.theme, next)
      return next
    })
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length
  const isTeacher   = user?.role === 'ROLE_TEACHER'
  const isParent    = user?.role === 'ROLE_PARENT'
  const isAdmin     = user?.role === 'ROLE_ADMIN'

  return (
    <AuthContext.Provider value={{
      user, login, logout, loading, handleOAuthLogin, updateUser,
      isTeacher, isParent, isAdmin,
      notifications, unreadCount, markAllRead, addNotification,
      theme, toggleTheme,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
