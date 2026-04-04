import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Search, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { optimizedStudentAPI } from '../../services/optimizedApi'
import { Button } from '../../components/shared/UI'
import { StudentCard } from './StudentsPage'

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

export default function ClassStudentsView() {
  const navigate = useNavigate()
  const { classId } = useParams()
  const decodedClassId = decodeURIComponent(classId || '')

  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const loadStudents = async () => {
      if (!decodedClassId) {
        setStudents([])
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const response = await optimizedStudentAPI.getByClassId(decodedClassId)
        setStudents(response.data?.data || [])
      } catch (error) {
        console.error('Failed to load class students:', error)
        toast.error('Unable to load students for this class')
        setStudents([])
      } finally {
        setLoading(false)
      }
    }

    loadStudents()
  }, [decodedClassId])

  const filteredStudents = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return students

    return students.filter((student) => {
      const name = String(student.name || '').toLowerCase()
      const roll = String(student.rollNumber || '').toLowerCase()
      const cls = String(student.className || '').toLowerCase()
      return name.includes(q) || roll.includes(q) || cls.includes(q)
    })
  }, [students, search])

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

        <Button variant="outline" onClick={() => navigate('/teacher/students/legacy')}>
          Open Legacy Manage View
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
            {search ? `No results for "${search}".` : 'Add students in the legacy manage view, then return here.'}
          </p>
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
                onEdit={() => navigate('/teacher/students/legacy')}
                onDelete={() => navigate('/teacher/students/legacy')}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
