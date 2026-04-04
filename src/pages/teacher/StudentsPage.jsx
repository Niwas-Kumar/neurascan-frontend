import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Pencil, Trash2, Search, GraduationCap,
  FileText, X, Check, UserPlus, AlertCircle, Copy, Share2, Users2
} from 'lucide-react'
import { optimizedStudentAPI } from '../../services/optimizedApi'
import toast from 'react-hot-toast'
import { useDebounce } from '../../hooks'
import { Button, Input, Modal, Badge } from '../../components/shared/UI'

// ════════════════════════════════════════════════════════════════
// DESIGN SYSTEM - Matching reference exactly
// ════════════════════════════════════════════════════════════════
const COLORS = {
  sidebar: '#312E81',
  primary: '#14B8A6',
  primaryLight: '#0D9488',
  primaryBg: 'rgba(20, 184, 166, 0.1)',

  secondary: '#6366F1',
  secondaryDark: '#4F46E5',
  secondaryBg: 'rgba(99, 102, 241, 0.1)',

  bgBase: '#F8FAFC',
  bgSurface: '#FFFFFF',
  bgSubtle: '#F1F5F9',

  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#64748B',
  textLight: '#94A3B8',

  border: '#E2E8F0',
  borderStrong: '#CBD5E1',

  // Risk/Status colors
  success: '#22c55e',
  successBg: 'rgba(34, 197, 94, 0.1)',
  warning: '#f59e0b',
  warningBg: 'rgba(245, 158, 11, 0.1)',
  danger: '#ef4444',
  dangerBg: 'rgba(239, 68, 68, 0.1)',
}

// ════════════════════════════════════════════════════════════════
// SKELETON CARD
// ════════════════════════════════════════════════════════════════
const StudentCardSkeleton = () => (
  <div style={{
    background: COLORS.bgSurface,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 12,
    padding: 22,
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
      <div className="skeleton" style={{ width: 48, height: 48, borderRadius: 12 }} />
      <div style={{ display: 'flex', gap: 6 }}>
        <div className="skeleton" style={{ width: 32, height: 32, borderRadius: 8 }} />
        <div className="skeleton" style={{ width: 32, height: 32, borderRadius: 8 }} />
      </div>
    </div>
    <div className="skeleton" style={{ width: '70%', height: 18, marginBottom: 12 }} />
    <div style={{ display: 'flex', gap: 8 }}>
      <div className="skeleton" style={{ width: 70, height: 24, borderRadius: 12 }} />
      <div className="skeleton" style={{ width: 50, height: 24, borderRadius: 12 }} />
    </div>
  </div>
)

// ════════════════════════════════════════════════════════════════
// STUDENT FORM
// ════════════════════════════════════════════════════════════════
function StudentForm({ student, onClose, onSave }) {
  const [form, setForm] = useState(student || { name: '', className: '', rollNumber: '', age: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const isEdit = !!student?.id

  const validate = () => {
    const e = {}
    if (!form.name?.trim()) e.name = 'Student name is required'
    if (!form.rollNumber?.trim()) e.rollNumber = 'Roll number is required'
    if (!form.className?.trim()) e.className = 'Class/Grade is required'

    const age = parseInt(form.age, 10)
    if (!form.age || isNaN(age) || age < 1 || age > 25) {
      e.age = 'Enter a valid age (1-25)'
    }

    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const age = parseInt(form.age, 10)
      const payload = {
        name: form.name.trim(),
        rollNumber: form.rollNumber.trim(),
        className: form.className.trim(),
        age
      }
      if (isEdit) await optimizedStudentAPI.update(student.id, payload)
      else await optimizedStudentAPI.create(payload)
      toast.success(`Student ${isEdit ? 'updated' : 'added'} successfully`)
      onSave()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to save student')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Full Name"
        value={form.name}
        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        placeholder="Enter student's full name"
        required
        error={errors.name}
      />
      <Input
        label="Roll Number"
        value={form.rollNumber}
        onChange={e => setForm(f => ({ ...f, rollNumber: e.target.value }))}
        placeholder="e.g., A001"
        required
        error={errors.rollNumber}
      />
      <Input
        label="Class / Grade"
        value={form.className}
        onChange={e => setForm(f => ({ ...f, className: e.target.value }))}
        placeholder="e.g., Grade 4-B"
        required
        error={errors.className}
      />
      <Input
        label="Age"
        type="number"
        value={form.age}
        onChange={e => setForm(f => ({ ...f, age: e.target.value }))}
        placeholder="e.g., 9"
        required
        error={errors.age}
      />

      <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
        <Button
          variant="ghost"
          type="button"
          fullWidth
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          fullWidth
          loading={loading}
          icon={<Check size={16} />}
        >
          {isEdit ? 'Save Changes' : 'Add Student'}
        </Button>
      </div>
    </form>
  )
}

// ════════════════════════════════════════════════════════════════
// DELETE CONFIRMATION MODAL
// ════════════════════════════════════════════════════════════════
function DeleteConfirmModal({ student, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      await onConfirm()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: 64,
        height: 64,
        borderRadius: 16,
        background: COLORS.dangerBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px',
      }}>
        <AlertCircle size={32} color={COLORS.danger} />
      </div>

      <h3 style={{
        fontSize: 18,
        fontWeight: 700,
        color: COLORS.textPrimary,
        marginBottom: 8,
        fontFamily: 'var(--font-display)',
      }}>
        Remove Student?
      </h3>

      <p style={{
        fontSize: 14,
        color: COLORS.textMuted,
        marginBottom: 24,
        lineHeight: 1.6,
      }}>
        This will permanently delete <strong style={{ color: COLORS.textPrimary }}>{student?.name}</strong> and all their associated papers and reports. This action cannot be undone.
      </p>

      <div style={{ display: 'flex', gap: 12 }}>
        <Button
          variant="ghost"
          fullWidth
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          fullWidth
          loading={loading}
          icon={<Trash2 size={16} />}
          onClick={handleDelete}
        >
          Delete Student
        </Button>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// SHARE WITH PARENTS MODAL
// ════════════════════════════════════════════════════════════════
function ShareWithParentsModal({ students, onClose }) {
  const [copied, setCopied] = useState(null)

  const copyAllIds = () => {
    const idList = students
      .map(s => `${s.name}: ${s.id}`)
      .join('\n')
    navigator.clipboard.writeText(idList)
    toast.success('All Student IDs copied!')
  }

  const copyStudentId = (student) => {
    navigator.clipboard.writeText(student.id)
    setCopied(student.id)
    toast.success(`${student.name}'s ID copied!`)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div>
      {/* Instructions */}
      <div style={{
        background: COLORS.primaryBg,
        border: `1px solid rgba(20, 184, 166, 0.2)`,
        borderRadius: 12,
        padding: 20,
        marginBottom: 24,
      }}>
        <h3 style={{
          fontSize: 15,
          fontWeight: 700,
          color: COLORS.primary,
          marginBottom: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <Users2 size={18} />
          How Parents Connect
        </h3>
        <ol style={{
          margin: 0,
          paddingLeft: 20,
          color: COLORS.textSecondary,
          fontSize: 13,
          lineHeight: 1.8,
        }}>
          <li>Share the <strong>Student ID</strong> with each parent</li>
          <li>Parent logs into NeuraScan with their account</li>
          <li>Parent enters the Student ID on their dashboard</li>
          <li>Parent receives a verification code via email</li>
          <li>Once verified, parent can view their child's reports</li>
        </ol>
      </div>

      {/* Copy All Button */}
      <div style={{ marginBottom: 20 }}>
        <Button
          icon={<Copy size={16} />}
          onClick={copyAllIds}
          fullWidth
          style={{
            background: COLORS.primary,
          }}
        >
          Copy All Student IDs
        </Button>
      </div>

      {/* Student List */}
      <div style={{
        maxHeight: 300,
        overflowY: 'auto',
        border: `1px solid ${COLORS.border}`,
        borderRadius: 10,
      }}>
        {students.map((student, i) => (
          <div
            key={student.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderBottom: i < students.length - 1 ? `1px solid ${COLORS.border}` : 'none',
              background: copied === student.id ? COLORS.successBg : 'transparent',
              transition: 'background 0.2s ease',
            }}
          >
            <div>
              <div style={{
                fontSize: 14,
                fontWeight: 600,
                color: COLORS.textPrimary,
                marginBottom: 2,
              }}>
                {student.name}
              </div>
              <div style={{
                fontSize: 11,
                fontFamily: 'monospace',
                color: COLORS.textMuted,
              }}>
                {student.id}
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => copyStudentId(student)}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                border: 'none',
                background: copied === student.id ? COLORS.success : COLORS.primaryBg,
                color: copied === student.id ? 'white' : COLORS.primary,
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              {copied === student.id ? <Check size={14} /> : <Copy size={14} />}
              {copied === student.id ? 'Copied!' : 'Copy'}
            </motion.button>
          </div>
        ))}
      </div>

      {/* Close Button */}
      <div style={{ marginTop: 20 }}>
        <Button
          variant="outline"
          fullWidth
          onClick={onClose}
        >
          Done
        </Button>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
// STUDENT CARD
// ════════════════════════════════════════════════════════════════
function StudentCard({ student, onEdit, onDelete, index }) {
  // Generate consistent color from student name
  const hue = (student.name?.charCodeAt(0) || 0) * 137 % 360
  const avatarBg = `hsl(${hue}, 45%, 92%)`
  const avatarColor = `hsl(${hue}, 55%, 35%)`

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.03, duration: 0.3, ease: [0.2, 0, 0, 1] }}
      layout
      style={{
        background: COLORS.bgSurface,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 12,
        padding: 22,
        cursor: 'default',
        transition: 'all 0.15s ease',
        position: 'relative',
      }}
      whileHover={{
        y: -3,
        boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
        borderColor: COLORS.borderStrong,
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
      }}>
        {/* Avatar */}
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: avatarBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 18,
          color: avatarColor,
        }}>
          {student.name?.charAt(0).toUpperCase()}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 6 }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit(student)}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: `1px solid ${COLORS.border}`,
              background: COLORS.bgSurface,
              color: COLORS.textMuted,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = COLORS.primary
              e.currentTarget.style.color = COLORS.primary
              e.currentTarget.style.background = COLORS.primaryBg
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = COLORS.border
              e.currentTarget.style.color = COLORS.textMuted
              e.currentTarget.style.background = COLORS.bgSurface
            }}
          >
            <Pencil size={14} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete(student)}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: `1px solid rgba(185, 28, 28, 0.2)`,
              background: COLORS.dangerBg,
              color: COLORS.danger,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(185, 28, 28, 0.15)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = COLORS.dangerBg
            }}
          >
            <Trash2 size={14} />
          </motion.button>
        </div>
      </div>

      {/* Name */}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 16,
        fontWeight: 700,
        color: COLORS.textPrimary,
        marginBottom: 12,
      }}>
        {student.name}
      </div>

      {/* Badges */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        <Badge color="primary" size="sm">
          <GraduationCap size={12} style={{ marginRight: 4 }} />
          {student.className}
        </Badge>
        <Badge color="default" size="sm">
          Age {student.age}
        </Badge>
        {student.totalPapers > 0 && (
          <Badge color="secondary" size="sm">
            <FileText size={12} style={{ marginRight: 4 }} />
            {student.totalPapers} {student.totalPapers === 1 ? 'sample' : 'samples'}
          </Badge>
        )}
      </div>

      {/* Roll Number */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        paddingTop: 12,
        borderTop: `1px solid ${COLORS.border}`,
        marginBottom: 10,
      }}>
        <span style={{
          fontSize: 11,
          fontWeight: 600,
          color: COLORS.textLight,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          Roll
        </span>
        <span style={{
          fontSize: 12,
          fontWeight: 700,
          color: COLORS.textSecondary,
          fontFamily: 'var(--font-display)',
          background: COLORS.bgSubtle,
          padding: '2px 8px',
          borderRadius: 4,
        }}>
          #{student.rollNumber}
        </span>
      </div>

      {/* Student ID for Parent Connection - Prominent display */}
      <div style={{
        background: COLORS.primaryBg,
        border: `1px solid rgba(20, 184, 166, 0.2)`,
        borderRadius: 8,
        padding: '10px 12px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 6,
        }}>
          <span style={{
            fontSize: 10,
            fontWeight: 700,
            color: COLORS.primary,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>
            Parent Connection ID
          </span>
          <div style={{ display: 'flex', gap: 4 }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                navigator.clipboard.writeText(student.id)
                toast.success('Student ID copied!')
              }}
              style={{
                width: 24,
                height: 24,
                borderRadius: 4,
                border: 'none',
                background: 'rgba(20, 184, 166, 0.15)',
                color: COLORS.primary,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Copy ID"
            >
              <Copy size={12} />
            </motion.button>
          </div>
        </div>
        <div style={{
          fontFamily: 'monospace',
          fontSize: 11,
          fontWeight: 600,
          color: COLORS.textPrimary,
          letterSpacing: '0.03em',
          wordBreak: 'break-all',
        }}>
          {student.id}
        </div>
      </div>
    </motion.div>
  )
}

// ════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════
export default function StudentsPage() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const debouncedSearch = useDebounce(search, 250)

  const load = async () => {
    setLoading(true)
    try {
      const result = await optimizedStudentAPI.getAllWithIndexRetry()
      setStudents(result.data.data || [])
    } catch (error) {
      console.error('Failed to load students:', error)
      toast.error('Unable to load student roster')
      setStudents([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await optimizedStudentAPI.remove(deleteTarget.id)
      toast.success(`${deleteTarget.name} removed from roster`)
      setDeleteTarget(null)
      load()
    } catch {
      toast.error('Failed to remove student')
    }
  }

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    s.className.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    s.rollNumber?.toLowerCase().includes(debouncedSearch.toLowerCase())
  )

  return (
    <div style={{ minHeight: '100vh', background: COLORS.bgBase, padding: '32px 40px' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 32,
          flexWrap: 'wrap',
          gap: 20,
        }}
      >
        <div>
          <h1 style={{
            fontSize: 28,
            fontWeight: 700,
            color: COLORS.textPrimary,
            letterSpacing: '-0.02em',
            marginBottom: 6,
            fontFamily: 'var(--font-display)',
          }}>
            Student Roster
          </h1>
          <p style={{
            fontSize: 15,
            color: COLORS.textMuted,
          }}>
            {loading
              ? 'Loading student data...'
              : `${students.length} student${students.length !== 1 ? 's' : ''} enrolled in your classroom`
            }
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <Button
            icon={<Share2 size={18} />}
            onClick={() => setModal('share')}
            variant="outline"
            style={{
              borderColor: COLORS.primary,
              color: COLORS.primary,
            }}
          >
            Share with Parents
          </Button>
          <Button
            icon={<UserPlus size={18} />}
            onClick={() => setModal('add')}
            style={{
              background: COLORS.primary,
            }}
          >
            Add Student
          </Button>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          position: 'relative',
          maxWidth: 400,
          marginBottom: 28,
        }}
      >
        <Search
          size={18}
          style={{
            position: 'absolute',
            left: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            color: COLORS.textLight,
            pointerEvents: 'none',
          }}
        />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, class, or ID..."
          style={{
            width: '100%',
            padding: '12px 40px 12px 44px',
            background: COLORS.bgSurface,
            border: `1.5px solid ${COLORS.border}`,
            borderRadius: 10,
            color: COLORS.textPrimary,
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            outline: 'none',
            transition: 'all 0.15s ease',
          }}
          onFocus={e => {
            e.target.style.borderColor = COLORS.primary
            e.target.style.boxShadow = '0 0 0 3px rgba(49, 46, 129, 0.1)'
          }}
          onBlur={e => {
            e.target.style.borderColor = COLORS.border
            e.target.style.boxShadow = 'none'
          }}
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            style={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              background: COLORS.bgSubtle,
              border: 'none',
              borderRadius: 6,
              width: 24,
              height: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: COLORS.textMuted,
              cursor: 'pointer',
            }}
          >
            <X size={14} />
          </button>
        )}
      </motion.div>

      {/* Content */}
      {loading ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}>
          {[0, 1, 2, 3, 4, 5].map(i => <StudentCardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            background: COLORS.bgSurface,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 12,
            padding: '60px 40px',
            textAlign: 'center',
          }}
        >
          <div style={{
            width: 72,
            height: 72,
            borderRadius: 16,
            background: COLORS.bgSubtle,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <Users size={32} color={COLORS.textLight} strokeWidth={1.5} />
          </div>
          <h3 style={{
            fontSize: 18,
            fontWeight: 700,
            color: COLORS.textPrimary,
            marginBottom: 8,
            fontFamily: 'var(--font-display)',
          }}>
            {search ? 'No students found' : 'No students yet'}
          </h3>
          <p style={{
            fontSize: 14,
            color: COLORS.textMuted,
            maxWidth: 320,
            margin: '0 auto 24px',
            lineHeight: 1.6,
          }}>
            {search
              ? `No results for "${search}". Try a different search term.`
              : 'Add students to your classroom to start uploading handwriting samples for analysis.'
            }
          </p>
          {!search && (
            <Button
              icon={<UserPlus size={16} />}
              onClick={() => setModal('add')}
            >
              Add Your First Student
            </Button>
          )}
        </motion.div>
      ) : (
        <motion.div
          layout
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16,
          }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((s, i) => (
              <StudentCard
                key={s.id}
                student={s}
                index={i}
                onEdit={(student) => setModal(student)}
                onDelete={(student) => setDeleteTarget(student)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        open={!!modal && modal !== 'share' && !deleteTarget}
        onClose={() => setModal(null)}
        title={modal === 'add' ? 'Add New Student' : 'Edit Student'}
      >
        {modal && modal !== 'share' && (
          <StudentForm
            student={modal === 'add' ? null : modal}
            onClose={() => setModal(null)}
            onSave={load}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title=""
        size="sm"
      >
        <DeleteConfirmModal
          student={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      </Modal>

      {/* Share with Parents Modal */}
      <Modal
        open={modal === 'share'}
        onClose={() => setModal(null)}
        title="Share Student IDs with Parents"
        size="md"
      >
        <ShareWithParentsModal
          students={students}
          onClose={() => setModal(null)}
        />
      </Modal>
    </div>
  )
}
