import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Layers, Search, X } from 'lucide-react'
import toast from 'react-hot-toast'
import ClassCard from '../../components/teacher/ClassCard'
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

  const loadClassesFallback = async (maxRetries = 5, delayMs = 300) => {
    const studentsResponse = await optimizedStudentAPI.getAllWithIndexRetry(maxRetries, delayMs)
    const derived = deriveClassRowsFromStudents(studentsResponse?.data?.data || [])
    setClasses(derived)
    return derived
  }

  useEffect(() => {
    if (!user?.token) return

    const loadClasses = async () => {
      setLoading(true)
      try {
        const response = await optimizedClassAPI.getAllWithIndexRetry(5, 350)
        console.log('[ClassesView] Raw API response:', JSON.stringify(response.data, null, 2))
        const classRows = normalizeClassRows(response.data?.data)
        console.log('[ClassesView] Normalized classRows:', classRows)

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
        console.error('Failed to load classes:', error)
        try {
          const derived = await loadClassesFallback(5, 320)
          if (derived.length === 0) {
            await new Promise(resolve => setTimeout(resolve, 1500))
            await loadClassesFallback(3, 400)
          }
          toast.error('Class endpoint is slow right now. Loaded from student data.')
        } catch (fallbackError) {
          console.error('Fallback class load failed:', fallbackError)
          toast.error('Unable to load classes')
          setClasses([])
        }
      } finally {
        setLoading(false)
      }
    }

    loadClasses()
  }, [user?.token])

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
        style={{ marginBottom: 28 }}
      >
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
          <p style={{ fontSize: 14, color: COLORS.textMuted }}>
            {search ? `No results for "${search}".` : 'Create students first to auto-populate classes.'}
          </p>
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
    </div>
  )
}
