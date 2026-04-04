import { useState } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Users, Upload, FileText, TrendingUp,
  LogOut, Bell, Settings, Menu, X, ChevronLeft,
  ChevronRight, BookOpen, AlertTriangle, Info, CheckCircle
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useIsMobile, useClickOutside } from '../../hooks'
import { Tooltip, Card, NavItem } from '../shared/UI'
import { NeuraScanLogo } from '../shared/Logo'
import toast from 'react-hot-toast'
import { CLASS_DRILLDOWN_ENABLED } from '../../config/featureFlags'

const teacherStudentsPath = CLASS_DRILLDOWN_ENABLED ? '/teacher/classes' : '/teacher/students'

const teacherNav = [
  { to: '/teacher/dashboard', icon: LayoutDashboard, label: 'Dashboard',    badge: null },
  { to: teacherStudentsPath,  icon: Users,           label: 'Students',     badge: null },
  { to: '/teacher/upload',    icon: Upload,          label: 'Upload Paper', badge: null },
  { to: '/teacher/analytics', icon: TrendingUp,      label: 'Analytics',    badge: null },
  { to: '/teacher/reports',   icon: FileText,        label: 'Reports',      badge: null },
  { to: '/teacher/quizzes',   icon: FileText,        label: 'Quizzes',      badge: null },
  { to: '/teacher/settings',  icon: Settings,        label: 'Settings',     badge: null },
]

const parentNav = [
  { to: '/parent/dashboard', icon: LayoutDashboard, label: 'My Child',    badge: null },
  { to: '/parent/progress',  icon: TrendingUp,      label: 'Progress',    badge: null },
  { to: '/parent/quiz-progress', icon: BookOpen,   label: 'Quiz Progress', badge: null },
  { to: '/parent/settings',  icon: Settings,        label: 'Settings',    badge: null },
]

function NotificationPanel({ notifications, markAllRead, onClose }) {
  const ref = useClickOutside(onClose)
  const icons = { info: Info, success: CheckCircle, warning: AlertTriangle, danger: AlertTriangle }
  const colors = { info: '#1a73e8', success: '#1e8e3e', warning: '#e37400', danger: '#d93025' }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
      style={{
        position: 'absolute', right: 0, top: 'calc(100% + 10px)',
        width: 340, zIndex: 200,
        background: '#fff', border: '1px solid #e0e0e0',
        borderRadius: 16, overflow: 'hidden',
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid #e8eaed' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: '#202124' }}>Notifications</span>
        <button onClick={markAllRead} style={{ fontSize: 12, color: '#1a73e8', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
          Mark all read
        </button>
      </div>
      <div style={{ maxHeight: 340, overflowY: 'auto' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '32px 18px', textAlign: 'center', color: '#80868b', fontSize: 13 }}>
            All caught up! No notifications.
          </div>
        ) : notifications.map(n => {
          const Icon = icons[n.type] || Info
          return (
            <div key={n.id} style={{
              padding: '12px 18px', borderBottom: '1px solid #f1f3f4',
              background: n.read ? 'transparent' : '#e8f0fe',
              display: 'flex', gap: 12, alignItems: 'flex-start',
            }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: '#f1f3f4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={14} color={colors[n.type]} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2, color: '#202124' }}>{n.title}</div>
                <div style={{ fontSize: 12, color: '#5f6368', lineHeight: 1.5 }}>{n.body}</div>
              </div>
              {!n.read && (
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#1a73e8', flexShrink: 0, marginTop: 4 }} />
              )}
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

function UserAvatar({ name, picture, size = 36 }) {
  const initials = name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?'
  const hue = (name?.charCodeAt(0) || 0) * 137 % 360
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: picture ? 'transparent' : `hsl(${hue}, 55%, 92%)`,
      border: `1.5px solid hsl(${hue}, 55%, 82%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: size * 0.36,
      color: `hsl(${hue}, 60%, 40%)`,
      flexShrink: 0,
      overflow: 'hidden'
    }}>
      {picture ? (
        <img src={picture} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        initials
      )}
    </div>
  )
}

function Sidebar({ collapsed, isTeacher, navItems, location, setCollapsed, setMobileOpen, user, navigate, handleLogout, isMobile }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div style={{
        height: 60, display: 'flex', alignItems: 'center',
        padding: collapsed ? '0 16px' : '0 18px',
        borderBottom: '1px solid #e8eaed',
        gap: 10, overflow: 'hidden',
      }}>
        <NeuraScanLogo size={34} showText={!collapsed} variant="default" />
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto', overflowX: 'hidden' }}>
        {!collapsed && (
          <div style={{ fontSize: 10, fontWeight: 700, color: '#80868b', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '8px 10px 10px' }}>
            {isTeacher ? 'Teacher' : 'Parent'} Portal
          </div>
        )}
        {navItems.map(({ to, icon: Icon, label, badge }) => {
          const active = location.pathname === to || location.pathname.startsWith(to + '/')
          return (
            <Tooltip key={to} content={collapsed ? label : null} placement="right">
              <NavLink to={to} onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none' }}>
                <NavItem
                  icon={Icon}
                  label={label}
                  active={active}
                  collapsed={collapsed}
                  badge={badge}
                  onClick={() => setMobileOpen(false)}
                />
              </NavLink>
            </Tooltip>
          )
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '8px', borderTop: '1px solid var(--color-border)' }}>
        {!collapsed && (
          <Card style={{ padding: 12, cursor: 'pointer', transition: 'all 0.2s ease' }} onClick={() => navigate(isTeacher ? '/teacher/settings' : '/parent/settings')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <UserAvatar name={user?.name} picture={user?.picture} size={30} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--color-text)' }}>{user?.name}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{isTeacher ? 'Teacher' : 'Parent'}</div>
              </div>
              <Settings size={13} color="var(--color-text-muted)" />
            </div>
          </Card>
        )}

        <div style={{ display: 'flex', gap: 4 }}>
          <Tooltip content="Sign out" placement="top">
            <button onClick={handleLogout} style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              padding: '8px', borderRadius: 8, border: '1px solid transparent',
              background: 'transparent', color: '#5f6368', cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontSize: 13, transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#d93025'; e.currentTarget.style.background = '#fce8e6' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#5f6368'; e.currentTarget.style.background = 'transparent' }}
            >
              <LogOut size={16} />
              {!collapsed && 'Sign out'}
            </button>
          </Tooltip>
          {!isMobile && (
            <Tooltip content={collapsed ? 'Expand' : 'Collapse'} placement="top">
              <button onClick={() => setCollapsed(c => !c)} style={{
                width: 34, height: 34, borderRadius: 8, border: '1px solid #e0e0e0',
                background: '#fff', color: '#5f6368', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
              </button>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  )
}
export default function AppLayout() {
  const { user, logout, isTeacher, notifications, unreadCount, markAllRead } = useAuth()
  const navigate   = useNavigate()
  const location   = useLocation()
  const isMobile   = useIsMobile()
  const [collapsed, setCollapsed]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showNotifs, setShowNotifs] = useState(false)
  const navItems = isTeacher ? teacherNav : parentNav

  const sidebarWidth = collapsed ? 72 : 260

  const handleLogout = () => {
    logout()
    toast.success('Signed out successfully')
    navigate('/login')
  }

  // Breadcrumb
  const currentNav = navItems.find(n => location.pathname.startsWith(n.to))
  
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-page)' }}>

      {/* Desktop Sidebar */}
      {!isMobile && (
        <motion.aside
          animate={{ width: sidebarWidth }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          style={{
            background: 'linear-gradient(180deg, #f0f4ff 0%, #ffffff 100%)',
            borderRight: '1px solid var(--border)',
            height: '100vh',
            position: 'sticky', top: 0,
            overflow: 'hidden',
            flexShrink: 0,
            zIndex: 20,
          }}
        >
          <Sidebar
            collapsed={collapsed}
            isTeacher={isTeacher}
            navItems={navItems}
            location={location}
            setCollapsed={setCollapsed}
            setMobileOpen={setMobileOpen}
            user={user}
            navigate={navigate}
            handleLogout={handleLogout}
            isMobile={false}
          />
        </motion.aside>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(2px)', zIndex: 40 }}
              />
              <motion.aside
                initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                style={{
                  position: 'fixed', left: 0, top: 0, bottom: 0, width: 260,
                  background: '#fff', borderRight: '1px solid #e8eaed',
                  zIndex: 50, overflow: 'hidden',
                }}
              >
                <Sidebar
                  collapsed={false}
                  isTeacher={isTeacher}
                  navItems={navItems}
                  location={location}
                  setCollapsed={setCollapsed}
                  setMobileOpen={setMobileOpen}
                  user={user}
                  navigate={navigate}
                  handleLogout={handleLogout}
                  isMobile={true}
                />
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      )}

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Topbar */}
        <header style={{
          height: 60, display: 'flex', alignItems: 'center',
          padding: '0 20px 0 24px',
          borderBottom: '1px solid var(--border)',
          background: 'linear-gradient(135deg, #312E81 0%, #14B8A6 100%)',
          position: 'sticky', top: 0, zIndex: 10,
          gap: 12,
          color: '#fff',
          boxShadow: '0 8px 18px rgba(49, 46, 129, 0.2)',
        }}>
          {isMobile && (
            <button onClick={() => setMobileOpen(true)} style={{ background: 'none', border: 'none', color: '#5f6368', cursor: 'pointer' }}>
              <Menu size={22} />
            </button>
          )}

          {/* Breadcrumb */}
          <div style={{ flex: 1, fontSize: 14, color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
            <span style={{ color: 'rgba(255,255,255,0.9)' }}>NeuraScan</span>
            <span style={{ margin: '0 6px' }}>/</span>
            <span style={{ color: '#ffffff', fontWeight: 600 }}>
              {currentNav?.label || 'Dashboard'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>

            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifs(v => !v)}
                style={{
                  width: 36, height: 36, borderRadius: 8, border: '1px solid #e0e0e0',
                  background: '#fff', color: '#5f6368', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
                }}
              >
                <Bell size={16} />
                {unreadCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    style={{
                      position: 'absolute', top: 6, right: 6, width: 8, height: 8,
                      borderRadius: '50%', background: '#d93025',
                      border: '1.5px solid #fff',
                    }}
                  />
                )}
              </button>
              <AnimatePresence>
                {showNotifs && (
                  <NotificationPanel
                    notifications={notifications}
                    markAllRead={() => { markAllRead(); setShowNotifs(false) }}
                    onClose={() => setShowNotifs(false)}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Avatar */}
            <div style={{ cursor: 'pointer' }} onClick={() => navigate(isTeacher ? '/teacher/settings' : '/parent/settings')}>
              <UserAvatar name={user?.name} picture={user?.picture} size={34} />
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: isMobile ? '20px 16px' : '24px 28px', overflowX: 'hidden' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
              style={{ maxWidth: 1200, margin: '0 auto' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
