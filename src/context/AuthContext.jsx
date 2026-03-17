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

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [theme, setThemeState]= useState('dark')

  // Notifications state (in-app, non-persistent demo)
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'info',    title: 'Welcome to NeuraScan v2', body: 'Explore the new dashboard features.', read: false, time: new Date() },
    { id: 2, type: 'success', title: 'System ready',            body: 'All AI services are operational.',   read: false, time: new Date() },
  ])

  useEffect(() => {
    const token     = localStorage.getItem(STORAGE_KEYS.token)
    const role      = localStorage.getItem(STORAGE_KEYS.role)
    const userId    = localStorage.getItem(STORAGE_KEYS.userId)
    const name      = localStorage.getItem(STORAGE_KEYS.userName)
    const email     = localStorage.getItem(STORAGE_KEYS.userEmail)
    const studentId = localStorage.getItem(STORAGE_KEYS.studentId)
    const school    = localStorage.getItem(STORAGE_KEYS.school)
    const rawPicture = localStorage.getItem(STORAGE_KEYS.picture)
    const picture = (rawPicture === 'null' || rawPicture === 'undefined' || !rawPicture) ? null : rawPicture;
    const savedTheme= localStorage.getItem(STORAGE_KEYS.theme) || 'dark'

    if (token && role) {
      setUser({ token, role, userId, name, email, studentId, school, picture })
    }
    setThemeState(savedTheme)
    setLoading(false)
  }, [])

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
        console.error("Failed to parse OAuth JWT", e)
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

  return (
    <AuthContext.Provider value={{
      user, login, logout, loading, handleOAuthLogin, updateUser,
      isTeacher, isParent,
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
