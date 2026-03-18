import React from 'react'
import { motion } from 'framer-motion'
import { BrandLogo } from '../shared/PremiumUI.jsx'

/**
 * Premium Authentication Layout
 * Used for Login, Register, Password Reset pages
 */
export default function PremiumAuthLayout({ children, title, subtitle, side = 'left' }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
    }}>
      {/* Left: Branding & Features */}
      {side === 'left' && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            background: 'var(--primary-gradient)',
            padding: '60px 40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 40,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background Gradient Orbs */}
          <div style={{
            position: 'absolute',
            top: '20%',
            right: '-100px',
            width: 300,
            height: 300,
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute',
            bottom: '10%',
            left: '-100px',
            width: 250,
            height: 250,
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '50%',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }} />

          {/* Logo */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <BrandLogo size={48} variant="full" />
          </div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{ position: 'relative', zIndex: 1, color: 'white' }}
          >
            <h1 style={{
              fontSize: 'var(--text-5xl)',
              fontWeight: 'var(--font-black)',
              marginBottom: 16,
              letterSpacing: 'var(--letter-spacing-tighter)',
            }}>
              Welcome to NeuraScan
            </h1>
            <p style={{
              fontSize: 'var(--text-lg)',
              lineHeight: 1.75,
              opacity: 0.95,
              marginBottom: 32,
            }}>
              AI-powered learning disorder detection for teachers and parents.
            </p>

            {/* Features List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { icon: '🎯', text: 'Instant AI Analysis' },
                { icon: '🔒', text: 'FERPA Compliant & Secure' },
                { icon: '📊', text: 'Real-time Progress Tracking' },
              ].map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  style={{
                    display: 'flex',
                    gap: 12,
                    alignItems: 'center',
                    fontSize: 'var(--text-base)',
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>{f.icon}</span>
                  <span>{f.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Right: Form */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          padding: '60px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          maxWidth: 440,
          margin: '0 auto',
          width: '100%',
        }}
      >
        {title && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ marginBottom: 32 }}
          >
            <h2 style={{
              fontSize: 'var(--text-4xl)',
              fontWeight: 'var(--font-black)',
              marginBottom: 8,
              color: 'var(--color-text-primary)',
            }}>
              {title}
            </h2>
            {subtitle && (
              <p style={{
                fontSize: 'var(--text-base)',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.6,
              }}>
                {subtitle}
              </p>
            )}
          </motion.div>
        )}

        {/* Form Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {children}
        </motion.div>
      </motion.div>

      {/* Mobile responsive */}
      <style>{`
        @media (max-width: 1024px) {
          div[style*="gridTemplateColumns: '1fr 1fr'"] {
            grid-template-columns: 1fr;
          }
          div[style*="background: var(--primary-gradient)"] {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}
