import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { NeuraScanLogo } from '../../components/shared/Logo.jsx'

const COLORS = { sidebar: '#312E81', primary: '#14B8A6' }

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/admin/schools', label: 'Schools', icon: '🏫' },
  { to: '/admin/teachers', label: 'Teachers', icon: '👨‍🏫' },
]

export default function AdminLayout() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: '240px', background: COLORS.sidebar, color: 'white',
        display: 'flex', flexDirection: 'column', flexShrink: 0,
      }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <NeuraScanLogo size="sm" />
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.25rem' }}>Admin Panel</div>
        </div>

        <nav style={{ flex: 1, padding: '1rem 0.75rem' }}>
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.75rem 1rem', borderRadius: '0.5rem', marginBottom: '0.25rem',
              textDecoration: 'none', color: 'white', fontSize: '0.9rem',
              background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
              fontWeight: isActive ? 600 : 400,
            })}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem' }}>
            {user?.name || 'Admin'}
          </div>
          <button onClick={handleLogout} style={{
            width: '100%', padding: '0.5rem', background: 'rgba(255,255,255,0.1)',
            border: 'none', borderRadius: '0.4rem', color: 'white', cursor: 'pointer',
            fontSize: '0.85rem',
          }}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, background: '#F8FAFC', padding: '2rem', overflow: 'auto' }}>
        <Outlet />
      </main>
    </div>
  )
}
