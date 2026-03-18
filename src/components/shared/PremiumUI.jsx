import React from 'react'
import { Brain } from 'lucide-react'

/**
 * Premium Brand Logo Component
 * Features: Animated gradient, scalable, multiple variants
 */
export function BrandLogo({ size = 44, variant = 'full', animated = false }) {
  const logoVariants = {
    icon: (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: `calc(${size}px * 0.27)`,
          background: 'var(--primary-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: animated ? 'var(--shadow-glow)' : 'var(--shadow-md)',
          animation: animated ? 'glow 2s ease-in-out infinite' : 'none',
          flexShrink: 0,
          transition: 'all var(--duration-fast) var(--easing-out)',
        }}
      >
        <Brain size={size * 0.55} color="#fff" strokeWidth={1.5} />
      </div>
    ),
    
    full: (
      <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.27 }}>
        <div
          style={{
            width: size,
            height: size,
            borderRadius: `calc(${size}px * 0.27)`,
            background: 'var(--primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: animated ? 'var(--shadow-glow)' : 'var(--shadow-md)',
            animation: animated ? 'glow 2s ease-in-out infinite' : 'none',
            transition: 'all var(--duration-fast) var(--easing-out)',
          }}
        >
          <Brain size={size * 0.55} color="#fff" strokeWidth={1.5} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 'var(--font-bold)',
              fontSize: `calc(${size}px * 0.5)`,
              color: 'var(--color-primary)',
              letterSpacing: 'var(--letter-spacing-tight)',
              lineHeight: 1,
            }}
          >
            NeuroScan
          </div>
          <div
            style={{
              fontSize: `calc(${size}px * 0.2)`,
              color: 'var(--color-text-tertiary)',
              letterSpacing: 'var(--letter-spacing-widest)',
              textTransform: 'uppercase',
              fontWeight: 600,
              lineHeight: 1,
            }}
          >
            AI Learning
          </div>
        </div>
      </div>
    ),

    text: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 'var(--font-bold)',
            fontSize: `calc(${size}px * 0.6)`,
            color: 'var(--color-primary)',
            letterSpacing: 'var(--letter-spacing-tight)',
          }}
        >
          NeuroScan
        </div>
        <div
          style={{
            fontSize: `calc(${size}px * 0.25)`,
            color: 'var(--color-text-tertiary)',
            letterSpacing: 'var(--letter-spacing-widest)',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}
        >
          AI Detection
        </div>
      </div>
    ),
  }

  return logoVariants[variant] || logoVariants.full
}

/**
 * Premium Button Component
 * Features: Multiple variants, sizes, loading states, animations
 */
export function PremiumButton({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon: Icon,
  ...props
}) {
  const variants = {
    primary: {
      background: 'var(--primary-gradient)',
      color: 'white',
      border: 'none',
      hoverStyle: {
        boxShadow: 'var(--shadow-xl)',
        transform: 'translateY(-2px)',
      },
    },
    secondary: {
      background: 'var(--color-surface)',
      color: 'var(--color-primary)',
      border: '2px solid var(--color-primary)',
      hoverStyle: {
        background: 'var(--color-primary-background)',
      },
    },
    ghost: {
      background: 'transparent',
      color: 'var(--color-primary)',
      border: '1px solid var(--color-border)',
      hoverStyle: {
        background: 'var(--color-surface-medium)',
        borderColor: 'var(--color-primary)',
      },
    },
    danger: {
      background: 'var(--color-danger)',
      color: 'white',
      border: 'none',
      hoverStyle: {
        opacity: 0.9,
      },
    },
    success: {
      background: 'var(--color-success)',
      color: 'white',
      border: 'none',
      hoverStyle: {
        opacity: 0.9,
      },
    },
  }

  const sizes = {
    xs: { padding: '6px 12px', fontSize: 'var(--text-xs)', borderRadius: 'var(--radius-md)' },
    sm: { padding: '8px 16px', fontSize: 'var(--text-sm)', borderRadius: 'var(--radius-lg)' },
    md: { padding: '12px 24px', fontSize: 'var(--text-base)', borderRadius: 'var(--radius-lg)' },
    lg: { padding: '16px 32px', fontSize: 'var(--text-lg)', borderRadius: 'var(--radius-xl)' },
    xl: { padding: '18px 40px', fontSize: 'var(--text-lg)', borderRadius: 'var(--radius-xl)' },
  }

  const current = variants[variant] || variants.primary
  const sizeStyle = sizes[size] || sizes.md

  return (
    <button
      disabled={disabled || loading}
      style={{
        ...sizeStyle,
        background: current.background,
        color: current.color,
        border: current.border,
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.6 : 1,
        transition: 'all var(--duration-fast) var(--easing-out)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        width: fullWidth ? '100%' : 'auto',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          Object.assign(e.target.style, current.hoverStyle)
        }
      }}
      onMouseLeave={(e) => {
        Object.assign(e.target.style, {
          boxShadow: 'none',
          transform: 'none',
          background: current.background,
        })
      }}
      {...props}
    >
      {loading ? (
        <>
          <div style={{
            width: 16,
            height: 16,
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite',
          }} />
          Loading...
        </>
      ) : (
        <>
          {Icon && <Icon size={18} />}
          {children}
        </>
      )}
    </button>
  )
}

/**
 * Premium Card Component
 * Features: Hover effects, gradient borders, background options
 */
export function PremiumCard({
  children,
  gradient = false,
  interactive = false,
  hoverable = false,
  padding = 'var(--space-6)',
  ...props
}) {
  return (
    <div
      style={{
        background: gradient ? 'var(--primary-gradient-soft)' : 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding,
        transition: 'all var(--duration-normal) var(--easing-out)',
        cursor: hoverable ? 'pointer' : 'default',
        ...props.style,
      }}
      onMouseEnter={(e) => {
        if (hoverable) {
          e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
          e.currentTarget.style.transform = 'translateY(-4px)'
        }
      }}
      onMouseLeave={(e) => {
        if (hoverable) {
          e.currentTarget.style.boxShadow = 'none'
          e.currentTarget.style.transform = 'none'
        }
      }}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * Badge Component
 */
export function Badge({ children, variant = 'primary', size = 'md' }) {
  const variants = {
    primary: { bg: 'var(--color-primary-background)', color: 'var(--color-primary)' },
    success: { bg: 'var(--color-success)', color: 'white' },
    warning: { bg: 'var(--color-warning)', color: 'white' },
    danger: { bg: 'var(--color-danger)', color: 'white' },
    secondary: { bg: 'var(--color-surface-medium)', color: 'var(--color-text-primary)' },
  }

  const sizes = {
    sm: { padding: '4px 8px', fontSize: 'var(--text-xs)' },
    md: { padding: '6px 12px', fontSize: 'var(--text-sm)' },
    lg: { padding: '8px 16px', fontSize: 'var(--text-base)' },
  }

  const current = variants[variant]
  const sizeStyle = sizes[size]

  return (
    <span
      style={{
        ...sizeStyle,
        background: current.bg,
        color: current.color,
        borderRadius: 'var(--radius-full)',
        fontWeight: 600,
        display: 'inline-block',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  )
}

/**
 * Icon Box Component
 */
export function IconBox({ icon: Icon, size = 'md', color = 'primary' }) {
  const sizes = {
    sm: { box: 32, icon: 16 },
    md: { box: 44, icon: 20 },
    lg: { box: 56, icon: 28 },
  }

  const colorMap = {
    primary: { bg: 'var(--color-primary-background)', color: 'var(--color-primary)' },
    accent: { bg: '#c8e6c9', color: 'var(--color-accent)' },
    success: { bg: '#c8e6c9', color: 'var(--color-success)' },
    warning: { bg: '#ffe0b2', color: 'var(--color-warning)' },
    danger: { bg: '#ffcdd2', color: 'var(--color-danger)' },
  }

  const s = sizes[size]
  const c = colorMap[color]

  return (
    <div
      style={{
        width: s.box,
        height: s.box,
        borderRadius: 'var(--radius-xl)',
        background: c.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Icon size={s.icon} color={c.color} strokeWidth={1.5} />
    </div>
  )
}

/*
 * Section Divider
 */
export function SectionDivider() {
  return (
    <div
      style={{
        height: 1,
        background: 'linear-gradient(90deg, transparent, var(--color-border), transparent)',
        margin: 'var(--space-12) 0',
      }}
    />
  )
}

/*
 * Loading Spinner
 */
export function LoadingSpinner({ size = 40, color = 'var(--color-primary)' }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: `3px solid ${color}20`,
        borderTopColor: color,
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }}
    />
  )
}

/* Spin animation */
const style = document.createElement('style')
style.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`
if (typeof document !== 'undefined') {
  document.head.appendChild(style)
}
