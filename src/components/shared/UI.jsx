import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Eye, EyeOff, X, Check, AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react'

// ================================================================
// BUTTON
// ================================================================
export function Button({
  children, variant = 'primary', size = 'md',
  loading = false, icon, iconRight, fullWidth,
  className = '', ...props
}) {
  const sizes = {
    xs: { padding: '5px 10px',  fontSize: 12, gap: 5 },
    sm: { padding: '7px 14px',  fontSize: 13, gap: 6 },
    md: { padding: '10px 20px', fontSize: 14, gap: 8 },
    lg: { padding: '13px 28px', fontSize: 15, gap: 9 },
    xl: { padding: '16px 36px', fontSize: 16, gap: 10 },
  }

  const variants = {
    primary: {
      background: '#1a73e8',
      color: '#fff',
      border: 'none',
      boxShadow: '0 1px 3px rgba(26,115,232,0.3)',
    },
    secondary: {
      background: '#f1f3f4',
      color: '#202124',
      border: '1px solid #dadce0',
    },
    ghost: {
      background: 'transparent',
      color: '#5f6368',
      border: '1px solid #dadce0',
    },
    danger: {
      background: 'rgba(217,48,37,0.06)',
      color: '#d93025',
      border: '1px solid rgba(217,48,37,0.2)',
    },
    success: {
      background: 'rgba(30,142,62,0.06)',
      color: '#1e8e3e',
      border: '1px solid rgba(30,142,62,0.2)',
    },
    outline: {
      background: 'transparent',
      color: '#1a73e8',
      border: '1px solid #dadce0',
    },
    cyan: {
      background: 'rgba(30,142,62,0.06)',
      color: '#1e8e3e',
      border: '1px solid rgba(30,142,62,0.2)',
    },
    white: {
      background: '#ffffff',
      color: '#3c4043',
      border: '1px solid #dadce0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    }
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
        borderRadius: 8,
        cursor: loading || props.disabled ? 'not-allowed' : 'pointer',
        opacity: props.disabled && !loading ? 0.45 : 1,
        transition: 'all 0.2s ease',
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
    <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
  )
}

// ================================================================
// SPINNER / LOADER
// ================================================================
export function Spinner({ size = 24, color = '#1a73e8', thickness = 2.5 }) {
  return (
    <div style={{
      width: size, height: size, flexShrink: 0,
      border: `${thickness}px solid rgba(26,115,232,0.2)`,
      borderTopColor: color,
      borderRadius: '50%',
      animation: 'spin 0.65s linear infinite',
    }} />
  )
}

export function FullPageLoader({ message = 'Loading…' }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#fff',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 20, zIndex: 9999,
    }}>
      <Spinner size={40} thickness={3} />
      <p style={{ fontFamily: 'var(--font-display)', color: '#5f6368', fontSize: 14 }}>
        {message}
      </p>
    </div>
  )
}

export function SkeletonCard({ rows = 3 }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 16, padding: 24 }}>
      <div className="skeleton" style={{ height: 20, width: '60%', marginBottom: 16 }} />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height: 14, width: `${90 - i * 15}%`, marginBottom: 10 }} />
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
  const inputType  = isPassword ? (showPw ? 'text' : 'password') : type
  const [focused, setFocused] = useState(false)

  return (
    <div style={{ marginBottom: 18 }}>
      {label && (
        <label style={{
          display: 'flex', alignItems: 'center', gap: 4,
          fontSize: 13, fontWeight: 500,
          color: error ? '#d93025' : focused ? '#1a73e8' : '#5f6368',
          marginBottom: 7, transition: 'color 0.15s',
        }}>
          {label}
          {required && <span style={{ color: '#d93025', fontSize: 11 }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {prefix && (
          <div style={{
            position: 'absolute', left: 12,
            color: '#80868b', display: 'flex', alignItems: 'center',
          }}>
            {prefix}
          </div>
        )}
        <input
          {...props}
          type={inputType}
          onFocus={(e) => { setFocused(true); props.onFocus?.(e) }}
          onBlur={(e)  => { setFocused(false); props.onBlur?.(e)  }}
          style={{
            width: '100%',
            padding: `11px ${isPassword || suffix ? 42 : 14}px 11px ${prefix ? 40 : 14}px`,
            background: '#fff',
            border: `1.5px solid ${error ? '#d93025' : focused ? '#1a73e8' : '#dadce0'}`,
            borderRadius: 8,
            color: '#202124',
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            outline: 'none',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            boxShadow: focused ? `0 0 0 3px ${error ? 'rgba(217,48,37,0.1)' : 'rgba(26,115,232,0.1)'}` : 'none',
            ...props.style,
          }}
        />
        {isPassword && (
          <button type="button" onClick={() => setShowPw(v => !v)} style={{
            position: 'absolute', right: 12,
            background: 'none', border: 'none',
            color: '#80868b', cursor: 'pointer',
            display: 'flex', alignItems: 'center', padding: 2,
          }}>
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
        {suffix && !isPassword && (
          <div style={{ position: 'absolute', right: 12, color: '#80868b', display: 'flex', alignItems: 'center' }}>
            {suffix}
          </div>
        )}
      </div>
      {error && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
          style={{ color: '#d93025', fontSize: 12, marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
          <AlertCircle size={11} /> {error}
        </motion.p>
      )}
      {hint && !error && (
        <p style={{ color: '#80868b', fontSize: 12, marginTop: 5 }}>{hint}</p>
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
        <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#5f6368', marginBottom: 7 }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        <select
          {...props}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%', padding: '11px 36px 11px 14px',
            background: '#fff',
            border: `1.5px solid ${error ? '#d93025' : focused ? '#1a73e8' : '#dadce0'}`,
            borderRadius: 8,
            color: props.value ? '#202124' : '#bdc1c6',
            fontFamily: 'var(--font-body)', fontSize: 14,
            outline: 'none', cursor: 'pointer', appearance: 'none',
            boxShadow: focused ? '0 0 0 3px rgba(26,115,232,0.1)' : 'none',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            ...props.style,
          }}
        >
          {children}
        </select>
        <ChevronDown size={15} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#80868b', pointerEvents: 'none' }} />
      </div>
      {error && <p style={{ color: '#d93025', fontSize: 12, marginTop: 5 }}>{error}</p>}
    </div>
  )
}

// ================================================================
// BADGE
// ================================================================
export function Badge({ children, color = 'default', size = 'sm', dot = false }) {
  const colors = {
    default: { bg: '#f1f3f4',   text: '#5f6368', border: '#e0e0e0' },
    violet:  { bg: '#e8f0fe',   text: '#1a73e8', border: 'rgba(26,115,232,0.2)' },
    cyan:    { bg: '#e6f4ea',   text: '#1e8e3e', border: 'rgba(30,142,62,0.2)' },
    success: { bg: '#e6f4ea',   text: '#1e8e3e', border: 'rgba(30,142,62,0.2)' },
    warning: { bg: '#fef7e0',   text: '#e37400', border: 'rgba(249,171,0,0.3)' },
    danger:  { bg: '#fce8e6',   text: '#d93025', border: 'rgba(217,48,37,0.2)' },
    new:     { bg: '#e8f0fe',   text: '#1a73e8', border: 'rgba(26,115,232,0.2)' },
  }
  const sizes = {
    xs: { padding: '2px 7px',  fontSize: 10 },
    sm: { padding: '3px 9px',  fontSize: 11 },
    md: { padding: '5px 11px', fontSize: 12 },
  }
  const c = colors[color] || colors.default
  const s = sizes[size] || sizes.sm
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      ...s,
      borderRadius: 100,
      fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase',
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
    }}>
      {dot && <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', flexShrink: 0 }} />}
      {children}
    </span>
  )
}

export function RiskBadge({ level }) {
  const map = {
    HIGH:   { color: 'danger',  label: 'High Risk',   dot: true },
    MEDIUM: { color: 'warning', label: 'Medium Risk',  dot: true },
    LOW:    { color: 'success', label: 'Low Risk',     dot: true },
  }
  const cfg = map[level] || map.LOW
  return <Badge color={cfg.color} dot>{cfg.label}</Badge>
}

// ================================================================
// STAT CARD
// ================================================================
export function StatCard({ icon: Icon, label, value, sub, color = 'violet', trend, delay = 0 }) {
  const colors = {
    violet:  { icon: '#1a73e8', bg: '#e8f0fe' },
    cyan:    { icon: '#1e8e3e', bg: '#e6f4ea' },
    success: { icon: '#1e8e3e', bg: '#e6f4ea' },
    warning: { icon: '#e37400', bg: '#fef7e0' },
    danger:  { icon: '#d93025', bg: '#fce8e6' },
  }
  const c = colors[color] || colors.violet

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.08, duration: 0.35, ease: [0.2,0,0,1] }}
      className="glass-panel card-lift"
      style={{
        padding: '22px 24px',
        cursor: 'default',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 12,
          background: c.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={20} color={c.icon} strokeWidth={1.75} />
        </div>
        {trend !== undefined && (
          <span style={{
            fontSize: 12, fontWeight: 600,
            color: trend >= 0 ? '#1e8e3e' : '#d93025',
            background: trend >= 0 ? '#e6f4ea' : '#fce8e6',
            padding: '3px 8px', borderRadius: 100,
          }}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 700, color: '#202124', lineHeight: 1, marginBottom: 6 }}>
        {value}
      </div>
      <div style={{ fontSize: 13, color: '#5f6368', fontWeight: 500 }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: '#80868b', marginTop: 3 }}>{sub}</div>}
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
        <div style={{ fontSize: 12, color: '#80868b', marginBottom: 8 }}>
          {breadcrumb}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: subtitle ? 6 : 0, color: '#202124' }}>
            {title}
          </h1>
          {subtitle && <p style={{ color: '#5f6368', fontSize: 14, fontWeight: 400 }}>{subtitle}</p>}
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
        width: 72, height: 72, borderRadius: 20,
        background: '#f1f3f4', border: '1px solid #e0e0e0',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px',
      }}>
        <Icon size={30} color="#80868b" strokeWidth={1.5} />
      </div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, marginBottom: 8, color: '#202124' }}>{title}</h3>
      <p style={{ color: '#5f6368', fontSize: 14, maxWidth: 320, margin: '0 auto 24px', lineHeight: 1.7 }}>{description}</p>
      {action}
    </motion.div>
  )
}

// ================================================================
// SCORE BAR
// ================================================================
export function ScoreBar({ label, value, showLabel = true }) {
  const color = value >= 70 ? '#d93025' : value >= 45 ? '#e37400' : '#1e8e3e'
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{ marginBottom: 14 }}>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7, fontSize: 13 }}>
          <span style={{ color: '#5f6368', fontWeight: 500 }}>{label}</span>
          <span style={{ fontWeight: 700, color, fontFamily: 'var(--font-display)' }}>
            {value?.toFixed(1)}%
          </span>
        </div>
      )}
      <div style={{ height: 6, background: '#f1f3f4', borderRadius: 4, overflow: 'hidden' }}>
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
    if (open) { document.addEventListener('keydown', handler); document.body.style.overflow = 'hidden' }
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = '' }
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
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
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
              background: '#fff',
              borderRadius: 16,
              border: '1px solid #e0e0e0',
              boxShadow: '0 8px 28px rgba(0,0,0,0.15)',
            }}
          >
            {title && (
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '20px 24px',
                borderBottom: '1px solid #e8eaed',
              }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: '#202124' }}>{title}</h2>
                <button onClick={onClose} style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: '#f1f3f4', border: '1px solid #e0e0e0',
                  color: '#5f6368', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
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
    info:    { icon: Info,          color: '#1a73e8', bg: '#e8f0fe', border: 'rgba(26,115,232,0.2)' },
    success: { icon: CheckCircle,   color: '#1e8e3e', bg: '#e6f4ea', border: 'rgba(30,142,62,0.2)' },
    warning: { icon: AlertTriangle, color: '#e37400', bg: '#fef7e0', border: 'rgba(249,171,0,0.25)' },
    danger:  { icon: AlertCircle,   color: '#d93025', bg: '#fce8e6', border: 'rgba(217,48,37,0.2)' },
  }
  const t = types[type] || types.info
  const Icon = t.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 12,
        padding: '14px 16px',
        background: t.bg, border: `1px solid ${t.border}`, borderRadius: 10,
        marginBottom: 16,
      }}
    >
      <Icon size={16} color={t.color} style={{ marginTop: 1, flexShrink: 0 }} />
      <div style={{ flex: 1, fontSize: 13 }}>
        {title && <div style={{ fontWeight: 600, color: t.color, marginBottom: 2 }}>{title}</div>}
        <div style={{ color: '#5f6368', lineHeight: 1.6 }}>{children}</div>
      </div>
      {onClose && (
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#80868b', cursor: 'pointer' }}>
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
      <div style={{ flex: 1, height: 1, background: '#e8eaed' }} />
      {label && <span style={{ fontSize: 12, color: '#80868b', whiteSpace: 'nowrap', fontWeight: 500 }}>{label}</span>}
      <div style={{ flex: 1, height: 1, background: '#e8eaed' }} />
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
        const done   = i < current
        const active = i === current
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: done ? '#1a73e8' : active ? '#e8f0fe' : '#f1f3f4',
                border: `2px solid ${done || active ? '#1a73e8' : '#dadce0'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}>
                {done
                  ? <Check size={14} color="#fff" strokeWidth={2.5} />
                  : <span style={{ fontSize: 12, fontWeight: 700, color: active ? '#1a73e8' : '#80868b' }}>{i + 1}</span>
                }
              </div>
              <span style={{ fontSize: 11, fontWeight: 500, color: active ? '#1a73e8' : done ? '#5f6368' : '#80868b', whiteSpace: 'nowrap' }}>
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 2, background: done ? '#1a73e8' : '#e8eaed', transition: 'background 0.2s', marginBottom: 18, margin: '0 8px 18px' }} />
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
      background: '#f1f3f4',
      borderRadius: 8,
      padding: 3,
      gap: 2,
    }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            flex: 1, padding: '8px 16px',
            borderRadius: 6, border: 'none',
            background: active === tab.id ? '#fff' : 'transparent',
            color: active === tab.id ? '#202124' : '#80868b',
            fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: active === tab.id ? 600 : 400,
            cursor: 'pointer', transition: 'all 0.2s ease',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            boxShadow: active === tab.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {tab.icon && <tab.icon size={14} strokeWidth={1.75} />}
          {tab.label}
          {tab.count !== undefined && (
            <span style={{
              padding: '1px 6px', borderRadius: 100, fontSize: 10, fontWeight: 700,
              background: active === tab.id ? '#e8f0fe' : '#e8eaed',
              color: active === tab.id ? '#1a73e8' : '#80868b',
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
    top:    { bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)' },
    bottom: { top:    'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)' },
    left:   { right:  'calc(100% + 8px)', top: '50%',  transform: 'translateY(-50%)' },
    right:  { left:   'calc(100% + 8px)', top: '50%',  transform: 'translateY(-50%)' },
  }
  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}
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
              position: 'absolute', zIndex: 200, pointerEvents: 'none',
              ...placements[placement],
              background: '#3c4043',
              borderRadius: 6,
              padding: '6px 10px',
              fontSize: 12, fontFamily: 'var(--font-body)',
              color: '#fff',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
