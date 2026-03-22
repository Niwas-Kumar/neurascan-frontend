import { useState } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Users, Upload, FileText, TrendingUp,
  LogOut, Brain, Bell, Settings, Menu, X, ChevronLeft,
  ChevronRight, Search, BookOpen, MoreHorizontal,
  AlertTriangle, Info, CheckCircle
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useIsMobile, useClickOutside } from '../../hooks'
import { Badge, Tooltip, Card, NavItem } from '../shared/UI'
import { NeuraScanLogo } from '../shared/Logo'
import toast from 'react-hot-toast'

const teacherNav = [
  { to: '/teacher/dashboard', icon: LayoutDashboard, label: 'Dashboard',    badge: null, mobileOrder: 1 },
  { to: '/teacher/students',  icon: Users,           label: 'Students',     badge: null, mobileOrder: 2 },
  { to: '/teacher/upload',    icon: Upload,          label: 'Upload Paper', badge: null, mobileOrder: 3 },
  { to: '/teacher/analytics', icon: TrendingUp,      label: 'Analytics',    badge: null, mobileOrder: 4 },
  { to: '/teacher/reports',   icon: FileText,        label: 'Reports',      badge: null, mobileOrder: 5 },
  { to: '/teacher/quizzes',   icon: FileText,        label: 'Quizzes',      badge: null, mobileOrder: 6 },
  { to: '/teacher/settings',  icon: Settings,        label: 'Settings',     badge: null, mobileOrder: 7 },
]

const parentNav = [
  { to: '/parent/dashboard', icon: LayoutDashboard, label: 'My Child',    badge: null, mobileOrder: 1 },
  { to: '/parent/progress',  icon: TrendingUp,      label: 'Progress',    badge: null, mobileOrder: 2 },
  { to: '/parent/quiz-progress', icon: BookOpen,   label: 'Quiz Progress', badge: null, mobileOrder: 3 },
  { to: '/parent/settings',  icon: Settings,        label: 'Settings',    badge: null, mobileOrder: 4 },
]

// Mobile bottom nav - shows first 4 items + more menu
function MobileBottomNav({ navItems, location, onMoreClick }) {
  const bottomItems = navItems.slice(0, 4)
  const hasMore = navItems.length > 4

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, #ffffff 100%)',
        borderTop: '1px solid #e8eaed',
        boxShadow: '0 -4px 16px rgba(0,0,0,0.06)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="flex justify-around items-center h-16 px-2">
        {bottomItems.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to || location.pathname.startsWith(to + '/')
          return (
            <NavLink
              key={to}
              to={to}
              className="flex flex-col items-center justify-center flex-1 py-2 min-h-[48px]"
              style={{ textDecoration: 'none' }}
            >
              <div
                className="flex items-center justify-center w-10 h-8 rounded-lg transition-all duration-200"
                style={{
                  background: active ? 'linear-gradient(135deg, #EEF2FF 0%, rgba(20, 184, 166, 0.08) 100%)' : 'transparent',
                }}
              >
                <Icon
                  size={22}
                  color={active ? '#312E81' : '#64748B'}
                  strokeWidth={active ? 2 : 1.75}
                />
              </div>
              <span
                className="text-[10px] mt-1 font-medium truncate max-w-[60px]"
                style={{ color: active ? '#312E81' : '#64748B' }}
              >
                {label}
              </span>
            </NavLink>
          )
        })}
        {hasMore && (
          <button
            onClick={onMoreClick}
            className="flex flex-col items-center justify-center flex-1 py-2 min-h-[48px]"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <div className="flex items-center justify-center w-10 h-8 rounded-lg">
              <MoreHorizontal size={22} color="#64748B" strokeWidth={1.75} />
            </div>
            <span className="text-[10px] mt-1 font-medium" style={{ color: '#64748B' }}>
              More
            </span>
          </button>
        )}
      </div>
    </nav>
  )
}

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
      className="absolute right-0 top-[calc(100%+10px)] z-[200] w-[calc(100vw-32px)] sm:w-[340px] max-w-[340px]"
      style={{
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
    <div className="flex min-h-screen" style={{ background: 'var(--bg-page)' }}>

      {/* Desktop Sidebar - hidden on mobile */}
      {!isMobile && (
        <motion.aside
          animate={{ width: sidebarWidth }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="hidden md:block flex-shrink-0 sticky top-0 h-screen overflow-hidden z-20"
          style={{
            background: 'linear-gradient(180deg, #f0f4ff 0%, #ffffff 100%)',
            borderRight: '1px solid var(--border)',
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

      {/* Mobile Drawer - off-canvas slide-out */}
      {isMobile && (
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 z-40"
                style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(2px)' }}
              />
              <motion.aside
                initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                className="fixed left-0 top-0 bottom-0 z-50 w-[280px] overflow-hidden"
                style={{
                  background: '#fff', borderRight: '1px solid #e8eaed',
                  maxWidth: '85vw',
                }}
              >
                {/* Close button for drawer */}
                <button
                  onClick={() => setMobileOpen(false)}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg z-10"
                  style={{ background: '#f1f5f9', border: '1px solid #e2e8f0' }}
                >
                  <X size={18} color="#64748B" />
                </button>
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar - responsive padding */}
        <header
          className="h-14 md:h-[60px] flex items-center px-3 md:px-5 sticky top-0 z-10 gap-2 md:gap-3"
          style={{
            borderBottom: '1px solid var(--border)',
            background: 'linear-gradient(135deg, #312E81 0%, #14B8A6 100%)',
            color: '#fff',
            boxShadow: '0 8px 18px rgba(49, 46, 129, 0.2)',
          }}
        >
          {/* Mobile hamburger menu */}
          {isMobile && (
            <button
              onClick={() => setMobileOpen(true)}
              className="w-10 h-10 flex items-center justify-center rounded-lg -ml-1"
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
            >
              <Menu size={22} />
            </button>
          )}

          {/* Breadcrumb - truncate on mobile */}
          <div className="flex-1 text-sm font-medium truncate" style={{ color: 'rgba(255,255,255,0.85)' }}>
            <span className="hidden sm:inline" style={{ color: 'rgba(255,255,255,0.9)' }}>NeuraScan</span>
            <span className="hidden sm:inline mx-1.5">/</span>
            <span style={{ color: '#ffffff', fontWeight: 600 }}>
              {currentNav?.label || 'Dashboard'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 md:gap-2">

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifs(v => !v)}
                className="w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center relative"
                style={{
                  border: '1px solid #e0e0e0',
                  background: '#fff', color: '#5f6368', cursor: 'pointer',
                }}
              >
                <Bell size={16} />
                {unreadCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                    style={{
                      background: '#d93025',
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
            <div
              className="cursor-pointer"
              onClick={() => navigate(isTeacher ? '/teacher/settings' : '/parent/settings')}
            >
              <UserAvatar name={user?.name} picture={user?.picture} size={isMobile ? 32 : 34} />
            </div>
          </div>
        </header>

        {/* Content - responsive padding and margin-bottom for mobile bottom nav */}
        <main
          className="flex-1 p-4 md:p-6 lg:p-7 pb-20 md:pb-6 overflow-x-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
              className="max-w-6xl mx-auto w-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <MobileBottomNav
          navItems={navItems}
          location={location}
          onMoreClick={() => setMobileOpen(true)}
        />
      )}
    </div>
  )
}
