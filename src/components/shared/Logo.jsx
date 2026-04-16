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
          d="M24 9 C20 9 15 9.5 12 14 C9 19 10 24 13 28 C15.5 31.5 19 34 22 35 Q23 35.5 24 35"
          stroke="url(#brainGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Brain outline - right hemisphere */}
        <path
          d="M24 9 C28 9 33 9.5 36 14 C39 19 38 24 35 28 C32.5 31.5 29 34 26 35 Q25 35.5 24 35"
          stroke="url(#brainGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Central fissure */}
        <line
          x1="24" y1="9" x2="24" y2="35"
          stroke="url(#brainGradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.4"
        />

        {/* Brain stem */}
        <path
          d="M22 35 Q23 38 24 41 M26 35 Q25 38 24 41"
          stroke="url(#brainGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Left brain folds (sulci) */}
        <path d="M14 16 Q18 18.5 22 16" stroke="url(#brainGradient)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.45" />
        <path d="M12 22 Q17 25 23 22" stroke="url(#brainGradient)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.45" />
        <path d="M15 28 Q19 30.5 23 28" stroke="url(#brainGradient)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.45" />

        {/* Right brain folds (sulci) */}
        <path d="M34 16 Q30 18.5 26 16" stroke="url(#brainGradient)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.45" />
        <path d="M36 22 Q31 25 25 22" stroke="url(#brainGradient)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.45" />
        <path d="M33 28 Q29 30.5 25 28" stroke="url(#brainGradient)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.45" />

        {/* Neural network connections */}
        <path
          d="M16 16L20 20M20 20L24 12M20 20L13 23"
          stroke={c.secondary}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeOpacity="0.6"
        />
        <path
          d="M32 16L28 20M28 20L24 12M28 20L35 23"
          stroke={c.secondary}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeOpacity="0.6"
        />

        {/* Neural nodes - digital scan points */}
        <NodeWrapper
          cx="24" cy="12" r="2.5"
          fill="url(#nodeGradient)"
          filter="url(#glow)"
          {...(animated && { custom: 0, ...nodeVariants })}
        />
        <NodeWrapper
          cx="16" cy="16" r="2"
          fill="url(#nodeGradient)"
          filter="url(#glow)"
          {...(animated && { custom: 1, ...nodeVariants })}
        />
        <NodeWrapper
          cx="32" cy="16" r="2"
          fill="url(#nodeGradient)"
          filter="url(#glow)"
          {...(animated && { custom: 2, ...nodeVariants })}
        />
        <NodeWrapper
          cx="20" cy="20" r="2"
          fill={c.secondary}
          {...(animated && { custom: 3, ...nodeVariants })}
        />
        <NodeWrapper
          cx="28" cy="20" r="2"
          fill={c.secondary}
          {...(animated && { custom: 4, ...nodeVariants })}
        />
        <NodeWrapper
          cx="13" cy="23" r="1.8"
          fill={c.secondary}
          {...(animated && { custom: 5, ...nodeVariants })}
        />
        <NodeWrapper
          cx="35" cy="23" r="1.8"
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
