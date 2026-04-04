import { motion } from 'framer-motion'
import { GraduationCap, Users } from 'lucide-react'

const COLORS = {
  bgSurface: '#FFFFFF',
  border: '#F1F5F9',
  borderStrong: '#E2E8F0',
  textPrimary: '#1E293B',
  textMuted: '#64748B',
  classBg: '#EDE9FE',
  classText: '#7C3AED',
  primaryBg: '#ECFDF5',
  primaryText: '#059669',
}

export default function ClassCard({ classItem, onClick, index = 0 }) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.28, ease: [0.2, 0, 0, 1] }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        textAlign: 'left',
        width: '100%',
        background: COLORS.bgSurface,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 16,
        padding: 22,
        cursor: 'pointer',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04), 0 1px 2px rgba(15, 23, 42, 0.02)',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = COLORS.borderStrong
        e.currentTarget.style.boxShadow = '0 12px 28px rgba(15, 23, 42, 0.08), 0 4px 10px rgba(15, 23, 42, 0.04)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = COLORS.border
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(15, 23, 42, 0.04), 0 1px 2px rgba(15, 23, 42, 0.02)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          background: COLORS.classBg,
          color: COLORS.classText,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <GraduationCap size={20} />
        </div>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          borderRadius: 999,
          background: COLORS.primaryBg,
          color: COLORS.primaryText,
          fontSize: 11,
          fontWeight: 700,
          padding: '5px 10px',
        }}>
          <Users size={12} />
          {classItem.studentCount} students
        </span>
      </div>

      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 18,
        fontWeight: 700,
        color: COLORS.textPrimary,
        marginBottom: 6,
      }}>
        Class {classItem.className}
      </div>

      <div style={{
        fontSize: 13,
        color: COLORS.textMuted,
      }}>
        Tap to view student cards
      </div>
    </motion.button>
  )
}
