import { motion } from 'framer-motion'

/**
 * NeuraScan Logo Component
 * A minimalist brain with digital neural network/scan elements
 * Represents AI-powered learning disorder detection
 */
export function NeuraScanLogo({
  size = 40,
  showText = true,
  variant = 'default', // 'default', 'light', 'dark', 'icon-only'
  animated = false,
  className = ''
}) {
  const colors = {
    default: {
      primary: '#312E81',    // Deep Indigo
      secondary: '#14B8A6',  // Soft Teal
      accent: '#6366F1',     // Indigo Light
      text: '#1E293B',       // Slate 800
    },
    light: {
      primary: '#FFFFFF',
      secondary: '#14B8A6',
      accent: '#A5B4FC',
      text: '#FFFFFF',
    },
    dark: {
      primary: '#312E81',
      secondary: '#14B8A6',
      accent: '#6366F1',
      text: '#F8FAFC',
    }
  }

  const c = colors[variant] || colors.default

  const logoVariants = animated ? {
    initial: { scale: 0.9, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }
    }
  } : {}

  const nodeVariants = animated ? {
    initial: { scale: 0 },
    animate: (i) => ({
      scale: 1,
      transition: { delay: 0.2 + i * 0.1, duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }
    })
  } : {}

  const pulseVariants = animated ? {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.6, 0.3, 0.6],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    }
  } : {}

  const LogoWrapper = animated ? motion.div : 'div'
  const NodeWrapper = animated ? motion.circle : 'circle'

  return (
    <LogoWrapper
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: showText ? 10 : 0,
        cursor: 'pointer'
      }}
      {...(animated && logoVariants)}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        {/* Background glow effect */}
        <defs>
          <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={c.primary} />
            <stop offset="100%" stopColor={c.accent} />
          </linearGradient>
          <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={c.secondary} />
            <stop offset="100%" stopColor="#2DD4BF" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Outer circle - scan ring */}
        <circle
          cx="24"
          cy="24"
          r="22"
          stroke={c.primary}
          strokeWidth="1.5"
          strokeOpacity="0.2"
          fill="none"
        />

        {/* Animated pulse ring */}
        {animated && (
          <motion.circle
            cx="24"
            cy="24"
            r="20"
            stroke={c.secondary}
            strokeWidth="2"
            fill="none"
            {...pulseVariants}
          />
        )}

        {/* Brain outline - left hemisphere */}
        <path
          d="M24 8C18 8 13 12 12 18C11 22 12 26 14 29C15 31 15 33 15 35C15 37 16 39 18 39C19 39 20 38 20 37L20 35C20 33 21 31 23 30"
          stroke="url(#brainGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Brain outline - right hemisphere */}
        <path
          d="M24 8C30 8 35 12 36 18C37 22 36 26 34 29C33 31 33 33 33 35C33 37 32 39 30 39C29 39 28 38 28 37L28 35C28 33 27 31 25 30"
          stroke="url(#brainGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Brain stem */}
        <path
          d="M24 30V40"
          stroke="url(#brainGradient)"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Neural connection lines */}
        <path
          d="M17 17L22 20M22 20L17 24M22 20L24 16"
          stroke={c.secondary}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeOpacity="0.7"
        />
        <path
          d="M31 17L26 20M26 20L31 24M26 20L24 16"
          stroke={c.secondary}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeOpacity="0.7"
        />

        {/* Neural nodes - digital scan points */}
        <NodeWrapper
          cx="17"
          cy="17"
          r="2.5"
          fill="url(#nodeGradient)"
          filter="url(#glow)"
          {...(animated && { custom: 0, ...nodeVariants })}
        />
        <NodeWrapper
          cx="31"
          cy="17"
          r="2.5"
          fill="url(#nodeGradient)"
          filter="url(#glow)"
          {...(animated && { custom: 1, ...nodeVariants })}
        />
        <NodeWrapper
          cx="22"
          cy="20"
          r="2"
          fill={c.secondary}
          {...(animated && { custom: 2, ...nodeVariants })}
        />
        <NodeWrapper
          cx="26"
          cy="20"
          r="2"
          fill={c.secondary}
          {...(animated && { custom: 3, ...nodeVariants })}
        />
        <NodeWrapper
          cx="24"
          cy="16"
          r="2.5"
          fill="url(#nodeGradient)"
          filter="url(#glow)"
          {...(animated && { custom: 4, ...nodeVariants })}
        />
        <NodeWrapper
          cx="17"
          cy="24"
          r="2"
          fill={c.secondary}
          {...(animated && { custom: 5, ...nodeVariants })}
        />
        <NodeWrapper
          cx="31"
          cy="24"
          r="2"
          fill={c.secondary}
          {...(animated && { custom: 6, ...nodeVariants })}
        />
      </svg>

      {showText && variant !== 'icon-only' && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{
            fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
            fontSize: size * 0.5,
            fontWeight: 800,
            color: c.text,
            letterSpacing: '-0.03em',
          }}>
            Neura<span style={{ color: c.secondary }}>Scan</span>
          </span>
          {size >= 36 && (
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: size * 0.22,
              fontWeight: 500,
              color: variant === 'light' ? 'rgba(255,255,255,0.7)' : '#64748B',
              letterSpacing: '0.02em',
              marginTop: 2,
            }}>
              AI Learning Assessment
            </span>
          )}
        </div>
      )}
    </LogoWrapper>
  )
}

/**
 * Compact logo for sidebar/header
 */
export function NeuraScanIcon({ size = 32, variant = 'default' }) {
  return <NeuraScanLogo size={size} showText={false} variant={variant} />
}

/**
 * Full logo with animated entrance
 */
export function NeuraScanLogoAnimated({ size = 48 }) {
  return <NeuraScanLogo size={size} animated={true} />
}

export default NeuraScanLogo
