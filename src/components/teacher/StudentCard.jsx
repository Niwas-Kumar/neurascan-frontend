import { useState } from 'react'
import { motion } from 'framer-motion'
import { Pencil, Trash2, GraduationCap, FileText, Copy, Check } from 'lucide-react'
import toast from 'react-hot-toast'

export default function StudentCard({ student, onEdit, onDelete, index = 0 }) {
  const [copyFeedback, setCopyFeedback] = useState(false)

  const avatarBg = '#EDE9FE'
  const avatarColor = '#312E81'

  const handleCopyId = () => {
    navigator.clipboard.writeText(student.id)
    setCopyFeedback(true)
    toast.success('Student ID copied!')
    setTimeout(() => setCopyFeedback(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.03, duration: 0.3, ease: [0.2, 0, 0, 1] }}
      layout
      style={{
        background: '#FFFFFF',
        border: '1px solid #F1F5F9',
        borderRadius: 16,
        padding: 24,
        cursor: 'default',
        position: 'relative',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04), 0 1px 2px rgba(15, 23, 42, 0.02)',
        transition: 'all 0.25s cubic-bezier(0.2, 0, 0, 1)',
      }}
      whileHover={{
        y: -4,
        boxShadow: '0 12px 28px rgba(15, 23, 42, 0.08), 0 4px 10px rgba(15, 23, 42, 0.04)',
        borderColor: '#E2E8F0',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 16,
        }}
      >
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: 14,
            background: avatarBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
            fontWeight: 800,
            fontSize: 20,
            color: avatarColor,
            flexShrink: 0,
          }}
        >
          {student.name?.charAt(0).toUpperCase()}
        </div>

        {(onEdit || onDelete) && (
          <div style={{ display: 'flex', gap: 8 }}>
            {onEdit && (
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => onEdit(student)}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  border: '1px solid #E2E8F0',
                  background: '#F8FAFC',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}
              >
                <Pencil size={14} />
              </motion.button>
            )}
            {onDelete && (
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => onDelete(student)}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  border: '1px solid #FEE2E2',
                  background: '#FEF2F2',
                  color: '#F87171',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}
              >
                <Trash2 size={14} />
              </motion.button>
            )}
          </div>
        )}
      </div>

      <div
        style={{
          fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
          fontSize: 17,
          fontWeight: 700,
          color: '#1E293B',
          marginBottom: 14,
          letterSpacing: '-0.01em',
        }}
      >
        {student.name}
      </div>

      <div
        style={{
          display: 'flex',
          gap: 6,
          flexWrap: 'wrap',
          marginBottom: 16,
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 3,
            padding: '4px 10px',
            borderRadius: 20,
            background: '#F1F5F9',
            fontSize: 11,
            fontWeight: 700,
            color: '#64748B',
            letterSpacing: '0.02em',
            whiteSpace: 'nowrap',
          }}
        >
          ROLL #{student.rollNumber}
        </span>

        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '4px 10px',
            borderRadius: 20,
            background: '#EDE9FE',
            fontSize: 11,
            fontWeight: 700,
            color: '#7C3AED',
            whiteSpace: 'nowrap',
          }}
        >
          <GraduationCap size={12} />
          {student.className}
        </span>

        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '4px 10px',
            borderRadius: 20,
            background: '#F1F5F9',
            fontSize: 11,
            fontWeight: 700,
            color: '#64748B',
            whiteSpace: 'nowrap',
          }}
        >
          AGE {student.age}
        </span>

        {student.totalPapers > 0 && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 10px',
              borderRadius: 20,
              background: '#ECFDF5',
              fontSize: 11,
              fontWeight: 700,
              color: '#059669',
              whiteSpace: 'nowrap',
            }}
          >
            <FileText size={12} />
            {student.totalPapers} {student.totalPapers === 1 ? 'SAMPLE' : 'SAMPLES'}
          </span>
        )}
      </div>

      <div style={{ height: 1, background: '#F1F5F9', marginBottom: 16 }} />

      <div
        style={{
          background: '#F8FAFC',
          borderRadius: 12,
          padding: '14px 16px',
          border: '1px solid #F1F5F9',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: '#94A3B8',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Parent Connection ID
          </span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleCopyId}
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              border: 'none',
              background: copyFeedback ? '#D1FAE5' : '#ECFDF5',
              color: copyFeedback ? '#059669' : '#14B8A6',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
            title="Copy ID"
          >
            {copyFeedback ? <Check size={13} /> : <Copy size={13} />}
          </motion.button>
        </div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
            fontSize: 13,
            fontWeight: 600,
            color: '#1E293B',
            letterSpacing: '0.04em',
            wordBreak: 'break-all',
            lineHeight: 1.5,
          }}
        >
          {student.id}
        </div>
      </div>
    </motion.div>
  )
}
