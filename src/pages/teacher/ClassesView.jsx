import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Layers, Plus, Search, X } from 'lucide-react'
import toast from 'react-hot-toast'
import ClassCard from '../../components/teacher/ClassCard'
import { Button, Input, Modal } from '../../components/shared/UI'
import { optimizedClassAPI, optimizedStudentAPI } from '../../services/optimizedApi'
import { useAuth } from '../../context/AuthContext'

const COLORS = {
  bgBase: '#F8FAFC',
  bgSurface: '#FFFFFF',
  bgSubtle: '#F1F5F9',
  textPrimary: '#0F172A',
  textMuted: '#64748B',
  border: '#E2E8F0',
  textLight: '#94A3B8',
  primary: '#14B8A6',
}

function normalizeClassRows(rows) {
  return (rows || [])
    .map((c) => ({
      id: String(c.id || c.className || '').trim(),
      className: String(c.className || '').trim(),
      studentCount: Number(c.studentCount || c.studentIds?.length || 0),
    }))
    .filter((c) => c.id && c.className)
}

function deriveClassRowsFromStudents(students) {
  const groups = new Map()
  for (const student of students || []) {
    const className = String(student.className || '').trim()
    if (!className) continue
    groups.set(className, (groups.get(className) || 0) + 1)
  }

  return Array.from(groups.entries())
    .map(([className, count]) => ({ id: className, className, studentCount: count }))
    .sort((a, b) => a.className.localeCompare(b.className))
}

export default function ClassesView() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newClassName, setNewClassName] = useState('')
  const [createError, setCreateError] = useState('')
  const [creatingClass, setCreatingClass] = useState(false)

  const buildAcademicYear = () => {
    const year = new Date().getFullYear()
    return `${year}-${year + 1}`
  }

  const loadClassesFallback = useCallback(async (maxRetries = 5, delayMs = 300) => {
    const studentsResponse = await optimizedStudentAPI.getAllWithIndexRetry(maxRetries, delayMs)
    const derived = deriveClassRowsFromStudents(studentsResponse?.data?.data || [])
    setClasses(derived)
    return derived
  }, [])

  const loadClasses = useCallback(async () => {
    setLoading(true)
    try {
      const response = await optimizedClassAPI.getAllWithIndexRetry(5, 350)
      const classRows = normalizeClassRows(response.data?.data)

      if (classRows.length > 0) {
        setClasses(classRows)
        return
      }

      // Fallback: derive class cards from students list with stronger retries.
      const derived = await loadClassesFallback(5, 320)
      if (derived.length > 0) {
        return
      }

      // Final automatic re-attempt (without manual refresh) for cold backend wake-up.
      await new Promise(resolve => setTimeout(resolve, 1500))
      await loadClassesFallback(3, 400)
    } catch (error) {
      try {
        const derived = await loadClassesFallback(5, 320)
        if (derived.length === 0) {
          await new Promise(resolve => setTimeout(resolve, 1500))
          await loadClassesFallback(3, 400)
        }
        toast.error('Class endpoint is slow right now. Loaded from student data.')
      } catch (fallbackError) {
        toast.error('Unable to load classes')
        setClasses([])
      }
    } finally {
      setLoading(false)
    }
  }, [loadClassesFallback])

  useEffect(() => {
    loadClasses()
  }, [user?.userId, loadClasses])

  const handleCreateClass = async () => {
    const className = newClassName.trim()
    if (!className) {
      setCreateError('Class name is required')
      return
    }

    try {
      setCreatingClass(true)
      setCreateError('')

      await optimizedClassAPI.create({
        className,
        section: '-',
        academicYear: buildAcademicYear(),
        subject: 'General',
        schoolId: '',
      })

      toast.success(`Class ${className} created`)
      setShowCreateModal(false)
      setNewClassName('')
      setSearch('')
      await loadClasses()
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Failed to create class'
      setCreateError(message)
      toast.error(message)
    } finally {
      setCreatingClass(false)
    }
  }

  const filteredClasses = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return classes
    return classes.filter((c) => c.className.toLowerCase().includes(q))
  }, [classes, search])

  return (
    <div style={{ minHeight: '100vh', background: COLORS.bgBase, padding: '32px 40px' }}>
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 28, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}
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
            Classes Dashboard
          </h1>
          <p style={{ fontSize: 15, color: COLORS.textMuted }}>
            {loading ? 'Loading classes...' : `${classes.length} class${classes.length !== 1 ? 'es' : ''} found`}
          </p>
        </div>
        <Button
          type="button"
          icon={<Plus size={16} />}
          onClick={() => {
            setCreateError('')
            setNewClassName('')
            setShowCreateModal(true)
          }}
          style={{ minHeight: 40 }}
        >
          Add New Class
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        style={{ position: 'relative', maxWidth: 380, marginBottom: 26 }}
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
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search classes..."
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

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                height: 170,
                borderRadius: 16,
                border: `1px solid ${COLORS.border}`,
                background: COLORS.bgSurface,
              }}
              className="skeleton"
            />
          ))}
        </div>
      ) : filteredClasses.length === 0 ? (
        <div style={{
          background: COLORS.bgSurface,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 12,
          padding: '54px 32px',
          textAlign: 'center',
        }}>
          <div style={{
            width: 70,
            height: 70,
            borderRadius: 16,
            background: COLORS.bgSubtle,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <Layers size={28} color={COLORS.textLight} />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, color: COLORS.textPrimary, fontFamily: 'var(--font-display)' }}>
            {search ? 'No classes found' : 'No classes yet'}
          </h3>
          <p style={{ fontSize: 14, color: COLORS.textMuted, marginBottom: 18 }}>
            {search ? `No results for "${search}".` : 'Create your first class, then add students inside it.'}
          </p>
          {!search && (
            <Button
              type="button"
              icon={<Plus size={16} />}
              onClick={() => {
                setCreateError('')
                setNewClassName('')
                setShowCreateModal(true)
              }}
            >
              Add First Class
            </Button>
          )}
        </div>
      ) : (
        <motion.div
          layout
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}
        >
          <AnimatePresence mode="popLayout">
            {filteredClasses.map((classItem, index) => (
              <ClassCard
                key={classItem.id}
                classItem={classItem}
                index={index}
                onClick={() => navigate(`/teacher/classes/${encodeURIComponent(classItem.id)}/students`)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <Modal
        open={showCreateModal}
        onClose={() => {
          if (creatingClass) return
          setShowCreateModal(false)
        }}
        title="Add New Class"
      >
        <Input
          label="Class Name"
          placeholder="e.g., 6A"
          value={newClassName}
          onChange={(e) => {
            setNewClassName(e.target.value)
            if (createError) setCreateError('')
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleCreateClass()
            }
          }}
          error={createError || undefined}
          required
          autoFocus
        />
        <p style={{ margin: '0 0 16px', color: COLORS.textMuted, fontSize: 13 }}>
          You can add students to this class right after creating it.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setShowCreateModal(false)}
            disabled={creatingClass}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleCreateClass}
            loading={creatingClass}
          >
            Create Class
          </Button>
        </div>
      </Modal>
    </div>
  )
}
