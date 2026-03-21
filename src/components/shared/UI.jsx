import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Eye, EyeOff, X, Check, AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react'

// ================================================================
// COLOR CONSTANTS (Deep Indigo + Soft Teal)
// ================================================================
const COLORS = {
  // Primary - Deep Indigo
  primary: '#312E81',
  primaryDark: '#1E1B4B',
  primaryLight: '#4338CA',
  primaryLighter: '#6366F1',
  primaryBg: '#EEF2FF',

  // Secondary - Soft Teal
  secondary: '#14B8A6',
  secondaryDark: '#0D9488',
  secondaryLight: '#2DD4BF',
  secondaryBg: '#CCFBF1',

  // Semantic
  success: '#059669',
  successBg: '#D1FAE5',
  warning: '#D97706',
  warningBg: '#FEF3C7',
  danger: '#DC2626',
  dangerBg: '#FEE2E2',

  // Risk levels (muted, clinical)
  riskHigh: '#B91C1C',
  riskHighBg: '#FEE2E2',
  riskMedium: '#B45309',
  riskMediumBg: '#FEF3C7',
  riskLow: '#047857',
  riskLowBg: '#D1FAE5',

  // Neutrals - Slate
  textPrimary: '#1E293B',
  textSecondary: '#334155',
  textMuted: '#64748B',
  textLight: '#94A3B8',

  // Backgrounds
  bgBase: '#F8FAFC',
  bgSurface: '#FFFFFF',
  bgSubtle: '#F1F5F9',
  bgHover: '#F1F5F9',

  // Borders
  border: '#E2E8F0',
  borderStrong: '#CBD5E1',
  borderFocus: '#312E81',
}

// ================================================================
// BUTTON
// ================================================================
export function Button({
  children, variant = 'primary', size = 'md',
  loading = false, icon, iconRight, fullWidth,
  className = '', ...props
}) {
  const sizes = {
    xs: { padding: '6px 12px',  fontSize: 12, gap: 5, radius: 6 },
    sm: { padding: '8px 16px',  fontSize: 13, gap: 6, radius: 6 },
    md: { padding: '10px 20px', fontSize: 14, gap: 8, radius: 8 },
    lg: { padding: '12px 24px', fontSize: 15, gap: 9, radius: 8 },
    xl: { padding: '14px 32px', fontSize: 16, gap: 10, radius: 10 },
  }

  const variants = {
    primary: {
      background: COLORS.primary,
      color: '#FFFFFF',
      border: 'none',
      boxShadow: '0 1px 3px rgba(49, 46, 129, 0.3)',
    },
    secondary: {
      background: COLORS.secondary,
      color: '#FFFFFF',
      border: 'none',
      boxShadow: '0 1px 3px rgba(20, 184, 166, 0.3)',
    },
    outline: {
      background: 'transparent',
      color: COLORS.primary,
      border: `1.5px solid ${COLORS.border}`,
    },
    ghost: {
      background: 'transparent',
      color: COLORS.textSecondary,
      border: `1px solid ${COLORS.border}`,
    },
    danger: {
      background: COLORS.dangerBg,
      color: COLORS.danger,
      border: `1px solid rgba(220, 38, 38, 0.2)`,
    },
    success: {
      background: COLORS.successBg,
      color: COLORS.success,
      border: `1px solid rgba(5, 150, 105, 0.2)`,
    },
    warning: {
      background: COLORS.warningBg,
      color: COLORS.warning,
      border: `1px solid rgba(217, 119, 6, 0.2)`,
    },
    white: {
      background: '#FFFFFF',
      color: COLORS.textSecondary,
      border: `1px solid ${COLORS.border}`,
      boxShadow: '0 1px 2px rgba(15, 23, 42, 0.05)',
    },
    // Legacy aliases
    cyan: {
      background: COLORS.secondaryBg,
      color: COLORS.secondaryDark,
      border: `1px solid rgba(20, 184, 166, 0.2)`,
    },
  }

  const s = sizes[size] || sizes.md
  const v = variants[variant] || variants.primary

  return (
    <motion.button
      whileHover={{ scale: loading || props.disabled ? 1 : 1.01 }}
      whileTap={{ scale: loading || props.disabled ? 1 : 0.98 }}
      {...props}
      disabled={loading || props.disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: s.gap,
        padding: s.padding,
        fontSize: s.fontSize,
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        borderRadius: s.radius,
        cursor: loading || props.disabled ? 'not-allowed' : 'pointer',
        opacity: props.disabled && !loading ? 0.5 : 1,
        transition: 'all 0.15s ease',
        whiteSpace: 'nowrap',
        width: fullWidth ? '100%' : undefined,
        letterSpacing: '0.01em',
        ...v,
        ...props.style,
      }}
    >
      {loading ? <ButtonSpinner /> : icon}
      {children}
      {!loading && iconRight}
    </motion.button>
  )
}

function ButtonSpinner() {
  return (
    <div style={{
      width: 14,
      height: 14,
      border: '2px solid rgba(255,255,255,0.3)',
      borderTopColor: '#fff',
      borderRadius: '50%',
      animation: 'spin 0.6s linear infinite'
    }} />
  )
}

// ================================================================
// CARD
// ================================================================
export function Card({ children, title, subtitle, style, className, padding = true, ...props }) {
  return (
    <div
      {...props}
      className={className}
      style={{
        background: COLORS.bgSurface,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 12,
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
        padding: padding ? 24 : 0,
        ...style,
      }}
    >
      {title && (
        <div style={{ marginBottom: 12 }}>
          <h3 style={{
            margin: 0,
            fontFamily: 'var(--font-display)',
            fontSize: 17,
            fontWeight: 700,
            color: COLORS.textPrimary
          }}>
            {title}
          </h3>
          {subtitle && (
            <p style={{
              margin: '4px 0 0',
              color: COLORS.textMuted,
              fontSize: 13
            }}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  )
}

// ================================================================
// NAV ITEM
// ================================================================
export function NavItem({ to, icon: Icon, label, active, onClick, collapsed, badge }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: collapsed ? 0 : 12,
        width: '100%',
        padding: collapsed ? '10px 12px' : '10px 14px',
        borderRadius: 8,
        border: 'none',
        background: active
          ? `linear-gradient(135deg, ${COLORS.primaryBg} 0%, rgba(20, 184, 166, 0.08) 100%)`
          : 'transparent',
        color: active ? COLORS.primary : COLORS.textSecondary,
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        fontWeight: active ? 600 : 500,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        textAlign: 'left',
        justifyContent: collapsed ? 'center' : 'flex-start',
      }}
    >
      {Icon && (
        <Icon
          size={18}
          color={active ? COLORS.primary : COLORS.textMuted}
          strokeWidth={active ? 2 : 1.75}
        />
      )}
      {!collapsed && <span style={{ flex: 1 }}>{label}</span>}
      {!collapsed && badge === 'new' && (
        <span style={{
          fontSize: 9,
          fontWeight: 700,
          background: COLORS.secondary,
          color: '#fff',
          padding: '2px 6px',
          borderRadius: 100,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}>
          NEW
        </span>
      )}
    </button>
  )
}

// ================================================================
// SPINNER / LOADER
// ================================================================
export function Spinner({ size = 24, color = COLORS.primary, thickness = 2.5 }) {
  return (
    <div style={{
      width: size,
      height: size,
      flexShrink: 0,
      border: `${thickness}px solid rgba(49, 46, 129, 0.15)`,
      borderTopColor: color,
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
    }} />
  )
}

export function FullPageLoader({ message = 'Loading...' }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: COLORS.bgBase,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 20,
      zIndex: 9999,
    }}>
      <Spinner size={40} thickness={3} />
      <p style={{
        fontFamily: 'var(--font-display)',
        color: COLORS.textMuted,
        fontSize: 14,
        fontWeight: 500,
      }}>
        {message}
      </p>
    </div>
  )
}

export function SkeletonCard({ rows = 3 }) {
  return (
    <div style={{
      background: COLORS.bgSurface,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 12,
      padding: 24
    }}>
      <div className="skeleton" style={{ height: 20, width: '60%', marginBottom: 16 }} />
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="skeleton"
          style={{ height: 14, width: `${90 - i * 15}%`, marginBottom: 10 }}
        />
      ))}
    </div>
  )
}

// ================================================================
// INPUT
// ================================================================
export function Input({
  label, error, hint, prefix, suffix, type = 'text',
  required, className, ...props
}) {
  const [showPw, setShowPw] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPw ? 'text' : 'password') : type
  const [focused, setFocused] = useState(false)

  return (
    <div style={{ marginBottom: 18 }}>
      {label && (
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          fontSize: 13,
          fontWeight: 500,
          color: error ? COLORS.danger : focused ? COLORS.primary : COLORS.textMuted,
          marginBottom: 7,
          transition: 'color 0.15s',
        }}>
          {label}
          {required && <span style={{ color: COLORS.danger, fontSize: 11 }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {prefix && (
          <div style={{
            position: 'absolute',
            left: 12,
            color: COLORS.textLight,
            display: 'flex',
            alignItems: 'center',
          }}>
            {prefix}
          </div>
        )}
        <input
          {...props}
          type={inputType}
          onFocus={(e) => { setFocused(true); props.onFocus?.(e) }}
          onBlur={(e) => { setFocused(false); props.onBlur?.(e) }}
          style={{
            width: '100%',
            padding: `11px ${isPassword || suffix ? 42 : 14}px 11px ${prefix ? 40 : 14}px`,
            background: COLORS.bgSurface,
            border: `1.5px solid ${error ? COLORS.danger : focused ? COLORS.primary : COLORS.border}`,
            borderRadius: 8,
            color: COLORS.textPrimary,
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            outline: 'none',
            transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
            boxShadow: focused
              ? `0 0 0 3px ${error ? 'rgba(220, 38, 38, 0.1)' : 'rgba(49, 46, 129, 0.1)'}`
              : 'none',
            ...props.style,
          }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPw(v => !v)}
            style={{
              position: 'absolute',
              right: 12,
              background: 'none',
              border: 'none',
              color: COLORS.textLight,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: 2,
            }}
          >
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
        {suffix && !isPassword && (
          <div style={{
            position: 'absolute',
            right: 12,
            color: COLORS.textLight,
            display: 'flex',
            alignItems: 'center'
          }}>
            {suffix}
          </div>
        )}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            color: COLORS.danger,
            fontSize: 12,
            marginTop: 5,
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}
        >
          <AlertCircle size={11} /> {error}
        </motion.p>
      )}
      {hint && !error && (
        <p style={{ color: COLORS.textLight, fontSize: 12, marginTop: 5 }}>{hint}</p>
      )}
    </div>
  )
}

// ================================================================
// SELECT
// ================================================================
export function Select({ label, children, error, ...props }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ marginBottom: 18 }}>
      {label && (
        <label style={{
          display: 'block',
          fontSize: 13,
          fontWeight: 500,
          color: COLORS.textMuted,
          marginBottom: 7
        }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        <select
          {...props}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            padding: '11px 36px 11px 14px',
            background: COLORS.bgSurface,
            border: `1.5px solid ${error ? COLORS.danger : focused ? COLORS.primary : COLORS.border}`,
            borderRadius: 8,
            color: props.value ? COLORS.textPrimary : COLORS.textLight,
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            outline: 'none',
            cursor: 'pointer',
            appearance: 'none',
            boxShadow: focused ? '0 0 0 3px rgba(49, 46, 129, 0.1)' : 'none',
            transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
            ...props.style,
          }}
        >
          {children}
        </select>
        <ChevronDown
          size={15}
          style={{
            position: 'absolute',
            right: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            color: COLORS.textLight,
            pointerEvents: 'none'
          }}
        />
      </div>
      {error && (
        <p style={{ color: COLORS.danger, fontSize: 12, marginTop: 5 }}>{error}</p>
      )}
    </div>
  )
}

// ================================================================
// BADGE
// ================================================================
export function Badge({ children, color = 'default', size = 'sm', dot = false }) {
  const colors = {
    default: { bg: COLORS.bgSubtle, text: COLORS.textMuted, border: COLORS.border },
    primary: { bg: COLORS.primaryBg, text: COLORS.primary, border: 'rgba(49, 46, 129, 0.2)' },
    secondary: { bg: COLORS.secondaryBg, text: COLORS.secondaryDark, border: 'rgba(20, 184, 166, 0.2)' },
    success: { bg: COLORS.successBg, text: COLORS.success, border: 'rgba(5, 150, 105, 0.2)' },
    warning: { bg: COLORS.warningBg, text: COLORS.warning, border: 'rgba(217, 119, 6, 0.25)' },
    danger: { bg: COLORS.dangerBg, text: COLORS.danger, border: 'rgba(220, 38, 38, 0.2)' },
    // Legacy aliases
    violet: { bg: COLORS.primaryBg, text: COLORS.primary, border: 'rgba(49, 46, 129, 0.2)' },
    cyan: { bg: COLORS.secondaryBg, text: COLORS.secondaryDark, border: 'rgba(20, 184, 166, 0.2)' },
    new: { bg: COLORS.secondaryBg, text: COLORS.secondaryDark, border: 'rgba(20, 184, 166, 0.2)' },
  }

  const sizes = {
    xs: { padding: '2px 7px', fontSize: 10 },
    sm: { padding: '3px 9px', fontSize: 11 },
    md: { padding: '5px 11px', fontSize: 12 },
  }

  const c = colors[color] || colors.default
  const s = sizes[size] || sizes.sm

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      ...s,
      borderRadius: 100,
      fontWeight: 600,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      background: c.bg,
      color: c.text,
      border: `1px solid ${c.border}`,
    }}>
      {dot && (
        <span style={{
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: 'currentColor',
          flexShrink: 0
        }} />
      )}
      {children}
    </span>
  )
}

export function RiskBadge({ level }) {
  const map = {
    HIGH: {
      bg: COLORS.riskHighBg,
      text: COLORS.riskHigh,
      border: 'rgba(185, 28, 28, 0.25)',
      label: 'High Risk'
    },
    MEDIUM: {
      bg: COLORS.riskMediumBg,
      text: COLORS.riskMedium,
      border: 'rgba(180, 83, 9, 0.25)',
      label: 'Medium Risk'
    },
    LOW: {
      bg: COLORS.riskLowBg,
      text: COLORS.riskLow,
      border: 'rgba(4, 120, 87, 0.25)',
      label: 'Low Risk'
    },
  }
  const cfg = map[level] || map.LOW

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: '3px 9px',
      borderRadius: 100,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      background: cfg.bg,
      color: cfg.text,
      border: `1px solid ${cfg.border}`,
    }}>
      <span style={{
        width: 5,
        height: 5,
        borderRadius: '50%',
        background: 'currentColor',
        flexShrink: 0
      }} />
      {cfg.label}
    </span>
  )
}

// ================================================================
// STAT CARD
// ================================================================
export function StatCard({ icon: Icon, label, value, sub, color = 'primary', trend, delay = 0 }) {
  const colors = {
    primary: { icon: COLORS.primary, bg: COLORS.primaryBg },
    secondary: { icon: COLORS.secondary, bg: COLORS.secondaryBg },
    success: { icon: COLORS.success, bg: COLORS.successBg },
    warning: { icon: COLORS.warning, bg: COLORS.warningBg },
    danger: { icon: COLORS.danger, bg: COLORS.dangerBg },
    // Legacy aliases
    violet: { icon: COLORS.primary, bg: COLORS.primaryBg },
    cyan: { icon: COLORS.secondary, bg: COLORS.secondaryBg },
  }
  const c = colors[color] || colors.primary

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.08, duration: 0.35, ease: [0.2, 0, 0, 1] }}
      className="glass-panel card-lift"
      style={{ padding: '22px 24px', cursor: 'default' }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16
      }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          background: c.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Icon size={22} color={c.icon} strokeWidth={1.75} />
        </div>
        {trend !== undefined && (
          <span style={{
            fontSize: 12,
            fontWeight: 600,
            color: trend >= 0 ? COLORS.success : COLORS.danger,
            background: trend >= 0 ? COLORS.successBg : COLORS.dangerBg,
            padding: '3px 8px',
            borderRadius: 100,
          }}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 32,
        fontWeight: 700,
        color: COLORS.textPrimary,
        lineHeight: 1,
        marginBottom: 6
      }}>
        {value}
      </div>
      <div style={{ fontSize: 13, color: COLORS.textMuted, fontWeight: 500 }}>
        {label}
      </div>
      {sub && (
        <div style={{ fontSize: 12, color: COLORS.textLight, marginTop: 3 }}>
          {sub}
        </div>
      )}
    </motion.div>
  )
}

// ================================================================
// PAGE HEADER
// ================================================================
export function PageHeader({ title, subtitle, action, breadcrumb }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      style={{ marginBottom: 28 }}
    >
      {breadcrumb && (
        <div style={{ fontSize: 12, color: COLORS.textLight, marginBottom: 8 }}>
          {breadcrumb}
        </div>
      )}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 16,
        flexWrap: 'wrap'
      }}>
        <div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            marginBottom: subtitle ? 6 : 0,
            color: COLORS.textPrimary
          }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ color: COLORS.textMuted, fontSize: 14, fontWeight: 400 }}>
              {subtitle}
            </p>
          )}
        </div>
        {action && <div style={{ flexShrink: 0 }}>{action}</div>}
      </div>
    </motion.div>
  )
}

// ================================================================
// EMPTY STATE
// ================================================================
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{ textAlign: 'center', padding: '56px 24px' }}
    >
      <div style={{
        width: 72,
        height: 72,
        borderRadius: 16,
        background: COLORS.bgSubtle,
        border: `1px solid ${COLORS.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px',
      }}>
        <Icon size={30} color={COLORS.textLight} strokeWidth={1.5} />
      </div>
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 17,
        fontWeight: 700,
        marginBottom: 8,
        color: COLORS.textPrimary
      }}>
        {title}
      </h3>
      <p style={{
        color: COLORS.textMuted,
        fontSize: 14,
        maxWidth: 320,
        margin: '0 auto 24px',
        lineHeight: 1.7
      }}>
        {description}
      </p>
      {action}
    </motion.div>
  )
}

// ================================================================
// SCORE BAR
// ================================================================
export function ScoreBar({ label, value, showLabel = true }) {
  const color = value >= 70 ? COLORS.riskHigh : value >= 45 ? COLORS.riskMedium : COLORS.riskLow
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{ marginBottom: 14 }}>
      {showLabel && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 7,
          fontSize: 13
        }}>
          <span style={{ color: COLORS.textMuted, fontWeight: 500 }}>{label}</span>
          <span style={{
            fontWeight: 700,
            color,
            fontFamily: 'var(--font-display)'
          }}>
            {value?.toFixed(1)}%
          </span>
        </div>
      )}
      <div style={{
        height: 6,
        background: COLORS.bgSubtle,
        borderRadius: 4,
        overflow: 'hidden'
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: animated ? `${Math.min(value || 0, 100)}%` : 0 }}
          transition={{ duration: 1, ease: [0.2, 0, 0, 1], delay: 0.1 }}
          style={{ height: '100%', background: color, borderRadius: 4 }}
        />
      </div>
    </div>
  )
}

// ================================================================
// MODAL
// ================================================================
export function Modal({ open, onClose, title, children, size = 'md', noPadding = false }) {
  const sizes = { sm: 400, md: 520, lg: 720, xl: 900 }

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose?.() }
    if (open) {
      document.addEventListener('keydown', handler)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: 'spring', damping: 28, stiffness: 400 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: sizes[size],
              maxHeight: '90vh',
              overflow: 'auto',
              background: COLORS.bgSurface,
              borderRadius: 16,
              border: `1px solid ${COLORS.border}`,
              boxShadow: '0 20px 40px rgba(15, 23, 42, 0.15)',
            }}
          >
            {title && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px 24px',
                borderBottom: `1px solid ${COLORS.border}`,
              }}>
                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 18,
                  fontWeight: 700,
                  color: COLORS.textPrimary
                }}>
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: COLORS.bgSubtle,
                    border: `1px solid ${COLORS.border}`,
                    color: COLORS.textMuted,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            )}
            <div style={{ padding: noPadding ? 0 : '24px' }}>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ================================================================
// ALERT
// ================================================================
export function Alert({ type = 'info', title, children, onClose }) {
  const types = {
    info: {
      icon: Info,
      color: COLORS.primary,
      bg: COLORS.primaryBg,
      border: 'rgba(49, 46, 129, 0.2)'
    },
    success: {
      icon: CheckCircle,
      color: COLORS.success,
      bg: COLORS.successBg,
      border: 'rgba(5, 150, 105, 0.2)'
    },
    warning: {
      icon: AlertTriangle,
      color: COLORS.warning,
      bg: COLORS.warningBg,
      border: 'rgba(217, 119, 6, 0.25)'
    },
    danger: {
      icon: AlertCircle,
      color: COLORS.danger,
      bg: COLORS.dangerBg,
      border: 'rgba(220, 38, 38, 0.2)'
    },
  }
  const t = types[type] || types.info
  const Icon = t.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '14px 16px',
        background: t.bg,
        border: `1px solid ${t.border}`,
        borderRadius: 10,
        marginBottom: 16,
      }}
    >
      <Icon size={16} color={t.color} style={{ marginTop: 1, flexShrink: 0 }} />
      <div style={{ flex: 1, fontSize: 13 }}>
        {title && (
          <div style={{ fontWeight: 600, color: t.color, marginBottom: 2 }}>
            {title}
          </div>
        )}
        <div style={{ color: COLORS.textMuted, lineHeight: 1.6 }}>
          {children}
        </div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: COLORS.textLight,
            cursor: 'pointer'
          }}
        >
          <X size={14} />
        </button>
      )}
    </motion.div>
  )
}

// ================================================================
// DIVIDER
// ================================================================
export function Divider({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '8px 0' }}>
      <div style={{ flex: 1, height: 1, background: COLORS.border }} />
      {label && (
        <span style={{
          fontSize: 12,
          color: COLORS.textLight,
          whiteSpace: 'nowrap',
          fontWeight: 500
        }}>
          {label}
        </span>
      )}
      <div style={{ flex: 1, height: 1, background: COLORS.border }} />
    </div>
  )
}

// ================================================================
// PROGRESS STEPS
// ================================================================
export function ProgressSteps({ steps, current }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 28 }}>
      {steps.map((step, i) => {
        const done = i < current
        const active = i === current
        return (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              flex: i < steps.length - 1 ? 1 : 0
            }}
          >
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6
            }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: done ? COLORS.primary : active ? COLORS.primaryBg : COLORS.bgSubtle,
                border: `2px solid ${done || active ? COLORS.primary : COLORS.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}>
                {done
                  ? <Check size={14} color="#fff" strokeWidth={2.5} />
                  : <span style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: active ? COLORS.primary : COLORS.textLight
                    }}>
                      {i + 1}
                    </span>
                }
              </div>
              <span style={{
                fontSize: 11,
                fontWeight: 500,
                color: active ? COLORS.primary : done ? COLORS.textMuted : COLORS.textLight,
                whiteSpace: 'nowrap'
              }}>
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                flex: 1,
                height: 2,
                background: done ? COLORS.primary : COLORS.border,
                transition: 'background 0.2s',
                marginBottom: 18,
                margin: '0 8px 18px'
              }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ================================================================
// TABS
// ================================================================
export function Tabs({ tabs, active, onChange }) {
  return (
    <div style={{
      display: 'flex',
      background: COLORS.bgSubtle,
      borderRadius: 8,
      padding: 3,
      gap: 2,
    }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            flex: 1,
            padding: '8px 16px',
            borderRadius: 6,
            border: 'none',
            background: active === tab.id ? COLORS.bgSurface : 'transparent',
            color: active === tab.id ? COLORS.textPrimary : COLORS.textLight,
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            fontWeight: active === tab.id ? 600 : 400,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 7,
            boxShadow: active === tab.id ? '0 1px 3px rgba(15, 23, 42, 0.08)' : 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {tab.icon && <tab.icon size={14} strokeWidth={1.75} />}
          {tab.label}
          {tab.count !== undefined && (
            <span style={{
              padding: '1px 6px',
              borderRadius: 100,
              fontSize: 10,
              fontWeight: 700,
              background: active === tab.id ? COLORS.primaryBg : COLORS.bgSubtle,
              color: active === tab.id ? COLORS.primary : COLORS.textLight,
            }}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

// ================================================================
// TOOLTIP
// ================================================================
export function Tooltip({ children, content, placement = 'top' }) {
  const [visible, setVisible] = useState(false)
  const placements = {
    top: { bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)' },
    bottom: { top: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)' },
    left: { right: 'calc(100% + 8px)', top: '50%', transform: 'translateY(-50%)' },
    right: { left: 'calc(100% + 8px)', top: '50%', transform: 'translateY(-50%)' },
  }

  return (
    <div
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      <AnimatePresence>
        {visible && content && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.12 }}
            style={{
              position: 'absolute',
              zIndex: 200,
              pointerEvents: 'none',
              ...placements[placement],
              background: COLORS.textPrimary,
              borderRadius: 6,
              padding: '6px 10px',
              fontSize: 12,
              fontFamily: 'var(--font-body)',
              color: '#fff',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
            }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
