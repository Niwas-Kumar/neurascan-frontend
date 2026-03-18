import React from 'react'
import { motion } from 'framer-motion'

/**
 * Premium Dashboard Card
 * Used for dashboard statistics and overview cards
 */
export function PremiumDashboardCard({ icon: Icon, label, value, unit = '', color = 'primary', trend, delay = 0 }) {
  const colorMap = {
    primary: { bg: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)', icon: '#1976d2', text: '#0d47a1' },
    accent:  { bg: 'linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%)', icon: '#00bcd4', text: '#00838f' },
    success: { bg: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)', icon: '#26a69a', text: '#1b5e20' },
    warning: { bg: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)', icon: '#f57c00', text: '#e65100' },
    danger:  { bg: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)', icon: '#d93025', text: '#b71c1c' },
  }

  const c = colorMap[color] || colorMap.primary

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.08, duration: 0.4 }}
      whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.12)' }}
      style={{
        background: c.bg,
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        cursor: 'pointer',
        transition: 'all var(--duration-fast) var(--easing-out)',
        border: '1px solid rgba(255,255,255,0.3)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      }}
    >
      <div>
        <div style={{
          fontSize: 'var(--text-sm)',
          fontWeight: 600,
          color: 'rgba(0,0,0,0.6)',
          marginBottom: 8,
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
        }}>
          {label}
        </div>
        <div style={{
          fontSize: 'var(--text-5xl)',
          fontWeight: 'var(--font-black)',
          color: c.text,
          letterSpacing: '-1px',
        }}>
          {value}
          {unit && <span style={{ fontSize: 'var(--text-xl)', opacity: 0.7 }}>{unit}</span>}
        </div>
        {trend !== undefined && (
          <div style={{
            fontSize: 'var(--text-sm)',
            marginTop: 8,
            color: trend >= 0 ? '#26a69a' : '#d93025',
            fontWeight: 600,
          }}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
          </div>
        )}
      </div>
      <div style={{
        width: 60,
        height: 60,
        borderRadius: 'var(--radius-lg)',
        background: 'rgba(255,255,255,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Icon size={32} color={c.icon} strokeWidth={1.5} />
      </div>
    </motion.div>
  )
}

/**
 * Premium Alert Box for Dashboard
 */
export function PremiumAlert({ type = 'info', title, message, icon: Icon, action, onAction }) {
  const colorMap = {
    info:    { bg: '#e3f2fd', border: '#64b5f6', icon: '#1976d2', text: '#0d47a1' },
    success: { bg: '#e8f5e9', border: '#81c784', icon: '#26a69a', text: '#1b5e20' },
    warning: { bg: '#fff3e0', border: '#ffb74d', icon: '#f57c00', text: '#e65100' },
    danger:  { bg: '#ffebee', border: '#ef5350', icon: '#d93025', text: '#b71c1c' },
  }

  const c = colorMap[type] || colorMap.info

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        background: c.bg,
        border: `2px solid ${c.border}`,
        borderRadius: 'var(--radius-lg)',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 16,
      }}
    >
      {Icon && (
        <div style={{ flexShrink: 0, marginTop: 2 }}>
          <Icon size={20} color={c.icon} strokeWidth={2} />
        </div>
      )}
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: 'var(--text-sm)',
          fontWeight: 700,
          color: c.text,
          marginBottom: 4,
        }}>
          {title}
        </div>
        <div style={{
          fontSize: 'var(--text-sm)',
          color: 'rgba(0,0,0,0.7)',
          lineHeight: 1.5,
        }}>
          {message}
        </div>
      </div>
      {action && (
        <button
          onClick={onAction}
          style={{
            padding: '6px 14px',
            background: c.border,
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all var(--duration-fast) var(--easing-out)',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
          onMouseEnter={e => e.target.style.opacity = '0.9'}
          onMouseLeave={e => e.target.style.opacity = '1'}
        >
          {action}
        </button>
      )}
    </motion.div>
  )
}

/**
 * Premium Dashboard Header
 */
export function PremiumDashboardHeader({ title, subtitle, icon: Icon, stats }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'linear-gradient(135deg, var(--primary-gradient))',
        borderRadius: 'var(--radius-2xl)',
        padding: '40px',
        color: 'white',
        marginBottom: 32,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Orbs */}
      <div style={{
        position: 'absolute',
        top: '-50px',
        right: '-50px',
        width: 200,
        height: 200,
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '50%',
        filter: 'blur(40px)',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          {Icon && (
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Icon size={28} />
            </div>
          )}
          <div>
            <h1 style={{
              fontSize: 'var(--text-4xl)',
              fontWeight: 'var(--font-black)',
              margin: 0,
              letterSpacing: '-0.5px',
            }}>
              {title}
            </h1>
            {subtitle && (
              <p style={{
                fontSize: 'var(--text-base)',
                opacity: 0.9,
                margin: '4px 0 0 0',
              }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {stats && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 16,
            marginTop: 24,
          }}>
            {stats.map((stat, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', padding: '12px 16px' }}>
                <div style={{ fontSize: 'var(--text-xs)', opacity: 0.85, marginBottom: 4 }}>{stat.label}</div>
                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' }}>{stat.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

/**
 * Premium Data Table Header
 */
export function PremiumTableHeader({ children, ...props }) {
  return (
    <thead style={{
      background: 'var(--color-surface-medium)',
      borderBottom: '2px solid var(--color-border)',
    }}>
      <tr {...props}>
        {children}
      </tr>
    </thead>
  )
}

/**
 * Premium Table Row
 */
export function PremiumTableRow({ children, hover = true, ...props }) {
  return (
    <motion.tr
      whileHover={hover ? { backgroundColor: 'var(--color-background)' } : {}}
      style={{
        borderBottom: '1px solid var(--color-border)',
        transition: 'background-color var(--duration-fast) var(--easing-out)',
      }}
      {...props}
    >
      {children}
    </motion.tr>
  )
}

/**
 * Premium Loading Skeleton for Cards
 */
export function PremiumCardSkeleton({ count = 4 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            background: 'var(--color-surface-medium)',
            borderRadius: 'var(--radius-lg)',
            height: 140,
          }}
        />
      ))}
    </div>
  )
}
