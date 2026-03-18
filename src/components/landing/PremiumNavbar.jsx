import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { BrandLogo, PremiumButton } from '../shared/PremiumUI.jsx'

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
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--color-border)',
      height: 80,
    }}>
      <div style={{
        maxWidth: 1400,
        margin: '0 auto',
        padding: '0 40px',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <BrandLogo size={40} variant="full" />
        </Link>

        {/* Desktop nav */}
        <div style={{
          display: 'flex',
          gap: 40,
          alignItems: 'center',
        }}>
          {navLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              style={{
                color: isActive(href) ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                textDecoration: 'none',
                fontWeight: 500,
                transition: 'color var(--duration-fast) var(--easing-out)',
              }}
              onMouseEnter={(e) => {
                e.target.style.color = 'var(--color-primary)'
              }}
              onMouseLeave={(e) => {
                e.target.style.color = isActive(href) ? 'var(--color-primary)' : 'var(--color-text-secondary)'
              }}
            >
              {label}
            </a>
          ))}
        </div>

        {/* CTA buttons */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link to="/login">
            <PremiumButton variant="ghost">Sign In</PremiumButton>
          </Link>
          <Link to="/register">
            <PremiumButton>Get Started</PremiumButton>
          </Link>

          {/* Mobile menu button */}
          <button
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 8,
            }}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          position: 'absolute',
          top: 80,
          left: 0,
          right: 0,
          background: 'white',
          borderBottom: '1px solid var(--color-border)',
          padding: '20px 40px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}>
          {navLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              style={{
                color: 'var(--color-text-secondary)',
                textDecoration: 'none',
                fontWeight: 500,
                padding: '8px 0',
              }}
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </a>
          ))}
          <Link to="/register" style={{ marginTop: 12 }}>
            <PremiumButton fullWidth>Get Started</PremiumButton>
          </Link>
        </div>
      )}
    </nav>
  )
}
