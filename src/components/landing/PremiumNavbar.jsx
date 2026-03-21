import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { NeuraScanLogo } from '../shared/Logo.jsx'

// ════════════════════════════════════════════════════════════════
// DESIGN SYSTEM COLORS
// ════════════════════════════════════════════════════════════════
const COLORS = {
  primary: '#312E81',
  primaryLight: '#4338CA',
  secondary: '#14B8A6',
  textPrimary: '#1E293B',
  textSecondary: '#475569',
  textMuted: '#64748B',
  bgSurface: '#FFFFFF',
  border: '#E2E8F0',
}

export default function PremiumNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Help', href: '/help' },
    { label: 'About', href: '/about' },
  ]

  const isActive = (href) => location.pathname === href

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: 'rgba(255, 255, 255, 0.92)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${COLORS.border}`,
      height: 76,
    }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '0 40px',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <NeuraScanLogo size={38} />
        </Link>

        {/* Desktop nav */}
        <div style={{
          display: 'flex',
          gap: 36,
          alignItems: 'center',
        }}
        className="hide-mobile"
        >
          {navLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              style={{
                color: isActive(href) ? COLORS.primary : COLORS.textSecondary,
                textDecoration: 'none',
                fontWeight: 500,
                fontSize: 14,
                transition: 'color 0.2s ease',
                fontFamily: "'Inter', sans-serif",
              }}
              onMouseEnter={(e) => {
                e.target.style.color = COLORS.primary
              }}
              onMouseLeave={(e) => {
                e.target.style.color = isActive(href) ? COLORS.primary : COLORS.textSecondary
              }}
            >
              {label}
            </a>
          ))}
        </div>

        {/* CTA buttons */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link to="/login" style={{ textDecoration: 'none' }} className="hide-mobile">
            <motion.button
              whileHover={{ background: '#F1F5F9' }}
              whileTap={{ scale: 0.98 }}
              style={{
                padding: '10px 20px',
                background: 'transparent',
                color: COLORS.textSecondary,
                border: 'none',
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Sign In
            </motion.button>
          </Link>
          <Link to="/register" style={{ textDecoration: 'none' }}>
            <motion.button
              whileHover={{ y: -1, boxShadow: '0 6px 20px rgba(49, 46, 129, 0.25)' }}
              whileTap={{ scale: 0.98 }}
              style={{
                padding: '10px 22px',
                background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
                color: 'white',
                border: 'none',
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(49, 46, 129, 0.2)',
                transition: 'all 0.2s ease',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Get Started
            </motion.button>
          </Link>

          {/* Mobile menu button */}
          <button
            className="show-mobile"
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 8,
              color: COLORS.textPrimary,
            }}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              top: 76,
              left: 0,
              right: 0,
              background: COLORS.bgSurface,
              borderBottom: `1px solid ${COLORS.border}`,
              padding: '20px 40px 28px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            }}
          >
            {navLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                style={{
                  color: COLORS.textSecondary,
                  textDecoration: 'none',
                  fontWeight: 500,
                  padding: '12px 0',
                  fontSize: 15,
                  borderBottom: `1px solid ${COLORS.border}`,
                }}
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </a>
            ))}
            <div style={{ paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <button
                  style={{
                    width: '100%',
                    padding: '14px 24px',
                    background: '#F1F5F9',
                    color: COLORS.textPrimary,
                    border: 'none',
                    borderRadius: 10,
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: 'pointer',
                  }}
                >
                  Sign In
                </button>
              </Link>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <button
                  style={{
                    width: '100%',
                    padding: '14px 24px',
                    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
                    color: 'white',
                    border: 'none',
                    borderRadius: 10,
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: 'pointer',
                  }}
                >
                  Get Started
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile responsive CSS */}
      <style>{`
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </nav>
  )
}
