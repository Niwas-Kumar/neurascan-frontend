import { Link } from 'react-router-dom'
import { NeuraScanLogo } from '../../components/shared/Logo.jsx'

const COLORS = {
  sidebar: '#312E81',
  primary: '#14B8A6',
  bg: '#F8FAFC',
}

export default function PendingApprovalPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${COLORS.sidebar} 0%, #1E1B4B 50%, ${COLORS.sidebar} 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '1.5rem',
        padding: '3rem 2.5rem',
        maxWidth: '480px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <NeuraScanLogo size="md" />
        </div>

        <div style={{
          fontSize: '3rem',
          marginBottom: '1rem',
        }}>⏳</div>

        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: COLORS.sidebar,
          marginBottom: '0.75rem',
        }}>Account Pending Approval</h2>

        <p style={{
          color: '#64748B',
          lineHeight: 1.6,
          marginBottom: '1.5rem',
        }}>
          Your teacher account has been created successfully. An administrator will review and approve your account shortly. You'll receive an email notification once approved.
        </p>

        <p style={{
          color: '#94A3B8',
          fontSize: '0.875rem',
          marginBottom: '2rem',
        }}>
          If you have a school code, you can register again with it for instant approval.
        </p>

        <Link to="/login" style={{
          display: 'inline-block',
          padding: '0.75rem 2rem',
          background: COLORS.primary,
          color: 'white',
          borderRadius: '0.75rem',
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: '0.95rem',
        }}>
          Back to Login
        </Link>
      </div>
    </div>
  )
}
