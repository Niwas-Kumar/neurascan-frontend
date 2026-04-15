import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, ArrowLeft, Search, UserPlus, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { optimizedStudentAPI } from '../../services/optimizedApi'
import { useAuth } from '../../context/AuthContext'
import { Button, Input, Modal } from '../../components/shared/UI'
import StudentCard from '../../components/teacher/StudentCard'
import { useDebounce } from '../../hooks'

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

function buildForm(className, student = null) {
  return {
    name: student?.name || '',
    rollNumber: student?.rollNumber || '',
    age: student?.age != null ? String(student.age) : '',
    className,
  }
}

function normalizeRollKey(value) {
  return String(value || '')
    .trim()
    .replace(/^#+/, '')
    .replace(/\s+/g, '')
    .toLowerCase()
}

export default function ClassStudentsView() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { classId } = useParams()
  const decodedClassId = decodeURIComponent(classId || '')

  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const [modalMode, setModalMode] = useState(null)
  const [activeStudent, setActiveStudent] = useState(null)
  const [form, setForm] = useState(buildForm(decodedClassId))
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const normalizeClass = (value) => String(value || '').trim().toLowerCase()

  const filterStudentsForClass = (rows, className) => {
    const classKey = normalizeClass(className)
    return (rows || []).filter((student) => normalizeClass(student.className) === classKey)
  }

  const loadStudents = useCallback(async () => {
    if (!decodedClassId) {
      setStudents([])
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const response = await optimizedStudentAPI.getByClassIdWithIndexRetry(decodedClassId, 5, 350)
      const classStudents = response?.data?.data || []

      if (classStudents.length > 0) {
        setStudents(classStudents)
        return
      }

      // Fallback: load all students and filter client-side if class endpoint is temporarily empty.
      const allResponse = await optimizedStudentAPI.getAllWithIndexRetry(5, 320)
      const filtered = filterStudentsForClass(allResponse?.data?.data || [], decodedClassId)

      if (filtered.length > 0) {
        setStudents(filtered)
        return
      }

      // Final automatic retry to handle cold-start propagation delays.
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const finalResponse = await optimizedStudentAPI.getByClassIdWithIndexRetry(decodedClassId, 3, 400)
      setStudents(finalResponse?.data?.data || [])
    } catch (error) {

      try {
        // Retry once after brief delay to recover from backend cold-start.
        await new Promise((resolve) => setTimeout(resolve, 1200))
        const retryResponse = await optimizedStudentAPI.getByClassIdWithIndexRetry(decodedClassId, 3, 400)
        const retryStudents = retryResponse?.data?.data || []
        if (retryStudents.length > 0) {
          setStudents(retryStudents)
        } else {
          const allResponse = await optimizedStudentAPI.getAllWithIndexRetry(3, 350)
          setStudents(filterStudentsForClass(allResponse?.data?.data || [], decodedClassId))
        }
        toast.error('Initial load was slow. Student list recovered automatically.')
      } catch (retryError) {

        toast.error('Unable to load students for this class')
        setStudents([])
      }
    } finally {
      setLoading(false)
    }
  }, [decodedClassId])

  useEffect(() => {
    loadStudents()
  }, [loadStudents])

  useEffect(() => {
    setForm(buildForm(decodedClassId))
    setErrors({})
  }, [decodedClassId])

  const openAddModal = () => {
    setActiveStudent(null)
    setForm(buildForm(decodedClassId))
    setErrors({})
    setModalMode('add')
  }

  const openEditModal = (student) => {
    setActiveStudent(student)
    setForm(buildForm(decodedClassId, student))
    setErrors({})
    setModalMode('edit')
  }

  const openDeleteModal = (student) => {
    setActiveStudent(student)
    setModalMode('delete')
  }

  const closeModal = () => {
    setModalMode(null)
    setActiveStudent(null)
    setErrors({})
    setSaving(false)
  }

  const validateForm = () => {
    const nextErrors = {}

    if (!form.name.trim()) {
      nextErrors.name = 'Student name is required'
    }

    if (!form.rollNumber.trim()) {
      nextErrors.rollNumber = 'Roll number is required'
    } else {
      const formRollKey = normalizeRollKey(form.rollNumber)
      const duplicate = students.find((student) => {
        if (modalMode === 'edit' && activeStudent?.id && student.id === activeStudent.id) {
          return false
        }
        return normalizeRollKey(student.rollNumber) === formRollKey
      })

      if (duplicate) {
        nextErrors.rollNumber = `Roll No already exists for ${decodedClassId}`
      }
    }

    const age = Number(form.age)
    if (!form.age || Number.isNaN(age) || age < 1 || age > 25) {
      nextErrors.age = 'Enter a valid age (1-25)'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setSaving(true)
    try {
      const payload = {
        name: form.name.trim(),
        rollNumber: form.rollNumber.trim(),
        className: decodedClassId,
        age: Number(form.age),
      }

      if (modalMode === 'edit' && activeStudent?.id) {
        await optimizedStudentAPI.update(activeStudent.id, payload)
        toast.success('Student updated successfully')
      } else {
        await optimizedStudentAPI.create(payload)
        toast.success('Student added successfully')
      }

      closeModal()
      await loadStudents()
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to save student')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!activeStudent?.id) return

    setSaving(true)
    try {
      await optimizedStudentAPI.remove(activeStudent.id)
      toast.success('Student deleted successfully')
      closeModal()
      await loadStudents()
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to delete student')
      setSaving(false)
    }
  }

  const filteredStudents = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase()
    if (!q) return students

    return students.filter((student) => {
      const name = String(student.name || '').toLowerCase()
      const roll = String(student.rollNumber || '').toLowerCase()
      const cls = String(student.className || '').toLowerCase()
      return name.includes(q) || roll.includes(q) || cls.includes(q)
    })
  }, [students, debouncedSearch])

  return (
    <div style={{ minHeight: '100vh', background: COLORS.bgBase, padding: '32px 40px' }}>
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap', marginBottom: 26 }}
      >
        <div>
          <Button
            variant="ghost"
            icon={<ArrowLeft size={16} />}
            onClick={() => navigate('/teacher/classes')}
            style={{ marginBottom: 12 }}
          >
            Back to Classes
          </Button>

          <h1 style={{
            fontSize: 28,
            fontWeight: 700,
            color: COLORS.textPrimary,
            letterSpacing: '-0.02em',
            marginBottom: 6,
            fontFamily: 'var(--font-display)',
          }}>
            Class {decodedClassId} Students
          </h1>

          <p style={{ fontSize: 15, color: COLORS.textMuted }}>
            {loading ? 'Loading student cards...' : `${students.length} student${students.length !== 1 ? 's' : ''} in this class`}
          </p>
        </div>

        <Button icon={<UserPlus size={16} />} onClick={openAddModal}>
          Add Student
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        style={{ position: 'relative', maxWidth: 420, marginBottom: 26 }}
      >
        <Search
          size={18}
          aria-hidden="true"
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
          placeholder="Search by name, class, or roll number..."
          aria-label="Search students"
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
            aria-label="Clear search"
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="skeleton"
              style={{ height: 300, borderRadius: 16, border: `1px solid ${COLORS.border}`, background: COLORS.bgSurface }}
            />
          ))}
        </div>
      ) : filteredStudents.length === 0 ? (
        <div style={{
          background: COLORS.bgSurface,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 12,
          padding: '54px 32px',
          textAlign: 'center',
        }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, color: COLORS.textPrimary, fontFamily: 'var(--font-display)' }}>
            {search ? 'No students found' : 'No students in this class'}
          </h3>
          <p style={{ fontSize: 14, color: COLORS.textMuted }}>
            {search ? `No results for "${search}".` : 'Add students from your class/student management flow, then return here.'}
          </p>
          {!search && (
            <div style={{ marginTop: 16 }}>
              <Button icon={<UserPlus size={16} />} onClick={openAddModal}>
                Add First Student
              </Button>
            </div>
          )}
        </div>
      ) : (
        <motion.div
          layout
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}
        >
          <AnimatePresence mode="popLayout">
            {filteredStudents.map((student, index) => (
              <StudentCard
                key={student.id}
                student={student}
                index={index}
                onEdit={openEditModal}
                onDelete={openDeleteModal}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <Modal
        open={modalMode === 'add' || modalMode === 'edit'}
        onClose={closeModal}
        title={modalMode === 'edit' ? 'Edit Student' : 'Add Student'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Full Name"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Enter student's full name"
            required
            error={errors.name}
          />
          <Input
            label="Roll Number"
            value={form.rollNumber}
            onChange={(e) => setForm((prev) => ({ ...prev, rollNumber: e.target.value }))}
            placeholder="e.g., A001"
            required
            error={errors.rollNumber}
          />
          <Input
            label="Class"
            value={decodedClassId}
            disabled
            hint="Class is fixed for this page"
          />
          <Input
            label="Age"
            type="number"
            min="1"
            max="25"
            value={form.age}
            onChange={(e) => setForm((prev) => ({ ...prev, age: e.target.value }))}
            placeholder="e.g., 10"
            required
            error={errors.age}
          />

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <Button variant="ghost" type="button" fullWidth onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" fullWidth loading={saving}>
              {modalMode === 'edit' ? 'Save Changes' : 'Add Student'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={modalMode === 'delete'}
        onClose={closeModal}
        title="Delete Student"
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: 'rgba(239, 68, 68, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <AlertCircle size={32} color="#ef4444" />
          </div>

          <p style={{ fontSize: 14, color: COLORS.textMuted, marginBottom: 24, lineHeight: 1.6 }}>
            This will permanently delete <strong style={{ color: COLORS.textPrimary }}>{activeStudent?.name}</strong> and related reports.
            This action cannot be undone.
          </p>

          <div style={{ display: 'flex', gap: 12 }}>
            <Button variant="ghost" fullWidth onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="danger" fullWidth loading={saving} onClick={handleDelete}>
              Delete Student
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
