import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Plus, Pencil, Trash2, Search, GraduationCap, FileText, X, Check, UserPlus } from 'lucide-react'
import { optimizedStudentAPI } from '../../services/optimizedApi'
import toast from 'react-hot-toast'
import { useDebounce } from '../../hooks'

// ── Inline PageHeader Component ────────────────────────────
const PageHeader = ({ title, subtitle, breadcrumb, action }) => (
  <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, marginBottom: 6, color: 'var(--text-primary)' }}>{title}</h1>
      {subtitle && <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
)

// ── Inline Button Component ────────────────────────────
const Button = ({ children, type = 'button', fullWidth = false, size = 'md', loading = false, disabled = false, variant = 'primary', onClick, icon, style = {}, ...props }) => {
  const heights = { sm: 36, md: 40, lg: 44 }
  const paddings = { sm: '8px 16px', md: '12px 20px', lg: '14px 24px' }
  const [isHovering, setIsHovering] = useState(false)

  const bgColor = variant === 'ghost' ? 'transparent' : isHovering && !disabled ? 'var(--primary-hover)' : 'var(--primary)'
  const textColor = variant === 'ghost' ? 'var(--primary)' : 'white'

  return (
    <button
      type={type}
      disabled={loading || disabled}
      onClick={onClick}
      style={{
        width: fullWidth ? '100%' : 'auto',
        height: heights[size],
        padding: paddings[size],
        background: bgColor,
        color: textColor,
        border: variant === 'ghost' ? '1px solid var(--border)' : 'none',
        borderRadius: 'var(--radius-lg)',
        fontSize: size === 'sm' ? 13 : size === 'lg' ? 15 : 14,
        fontWeight: 600,
        cursor: loading || disabled ? 'not-allowed' : 'pointer',
        opacity: loading || disabled ? 0.6 : 1,
        transition: 'all 0.3s cubic-bezier(0.2, 0, 0, 1)',
        boxShadow: isHovering && variant !== 'ghost' && !disabled ? '0 4px 16px rgba(26, 115, 232, 0.3)' : 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: icon ? 8 : 0,
        ...style,
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {loading ? '...' : children}
    </button>
  )
}

// ── Inline Input Component ────────────────────────────
const Input = ({ label, type = 'text', placeholder, value, onChange, required = false, error, style = {} }) => {
  const [isFocused, setIsFocused] = useState(false)
  
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label style={{
          display: 'block',
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--text-primary)',
          marginBottom: 8,
        }}>
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        style={{
          width: '100%',
          padding: '12px 14px',
          fontSize: 14,
          border: error ? '1.5px solid var(--danger)' : isFocused ? '2px solid var(--primary)' : '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          background: 'white',
          color: 'var(--text-primary)',
          transition: 'all 0.2s ease',
          boxSizing: 'border-box',
          fontFamily: 'inherit',
          ...style,
        }}
        onFocus={() => setIFocused(true)}
        onBlur={() => setIFocused(false)}
      />
      {error && <div style={{ color: 'var(--danger)', fontSize: 12, marginTop: 6 }}>{error}</div>}
    </div>
  )
}

// ── Inline EmptyState Component ────────────────────────────
const EmptyState = ({ icon: Icon, title, description }) => (
  <div style={{border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '48px 32px', textAlign: 'center' }}>
    {Icon && <Icon size={40} color="var(--text-muted)" strokeWidth={1.25} style={{ marginBottom: 16 }} />}
    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, marginBottom: 8 }}>{title}</h3>
    {description && <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.75 }}>{description}</p>}
  </div>
)

// ── Inline SkeletonCard Component ────────────────────────────
const SkeletonCard = ({ rows = 4 }) => (
  <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px 24px' }}>
    {Array(rows).fill(0).map((_, i) => (
      <div key={i} style={{
        height: i === 0 ? 24 : 14,
        background: 'linear-gradient(90deg, var(--bg-hover) 25%, var(--bg-elevated) 50%, var(--bg-hover) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        borderRadius: 6,
        marginBottom: i < rows - 1 ? 12 : 0,
      }} />
    ))}
    <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
  </div>
)

// ── Inline Badge Component ────────────────────────────
const Badge = ({ children, icon: Icon, variant = 'primary' }) => {
  const colors = { primary: '#e8f0fe', secondary: '#f3f4f6', success: '#d1fae5' }
  const textColors = { primary: '#1a73e8', secondary: '#374151', success: '#10b981' }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '6px 12px',
      borderRadius: '12px',
      fontSize: 12,
      fontWeight: 600,
      background: colors[variant],
      color: textColors[variant],
    }}>
      {Icon && <Icon size={14} />}
      {children}
    </span>
  )
}

// ── Inline Modal Component ────────────────────────────
const Modal = ({ open, title, children, onClose, fullWidth = false }) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 999,
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'white',
              borderRadius: 'var(--radius-lg)',
              padding: '28px',
              maxWidth: fullWidth ? '90vw' : '500px',
              width: fullWidth ? '90vw' : '500px',
              maxHeight: '85vh',
              overflow: 'auto',
              zIndex: 1000,
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800 }}>{title}</h2>
              <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 24 }}>×</button>
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function StudentForm({ student, onClose, onSave }) {
  const [form, setForm]     = useState(student || { name: '', className: '', rollNo: '', age: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const isEdit = !!student?.id

  const validate = () => {
    const e = {}
    if (!form.name)      e.name      = 'Name is required'
    if (!form.rollNo)    e.rollNo    = 'Roll No is required'
    if (!form.className) e.className = 'Class is required'
    if (!form.age || form.age < 1) e.age = 'Valid age required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const payload = { name: form.name, rollNo: form.rollNo, className: form.className, age: Number(form.age) }
      if (isEdit) await optimizedStudentAPI.update(student.id, payload)
      else        await optimizedStudentAPI.create(payload)
      toast.success(`Student ${isEdit ? 'updated' : 'added'} successfully`)
      onSave()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save')
    } finally { setLoading(false) }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input label="Full name"     value={form.name}      onChange={e => setForm(f => ({...f, name: e.target.value}))}      placeholder="John Doe"      required error={errors.name} />
      <Input label="Roll No"       value={form.rollNo}    onChange={e => setForm(f => ({...f, rollNo: e.target.value}))}    placeholder="A001"         required error={errors.rollNo} />
      <Input label="Class / Grade" value={form.className} onChange={e => setForm(f => ({...f, className: e.target.value}))} placeholder="Grade 4-B"     required error={errors.className} />
      <Input label="Age" type="number" min="1" max="25" value={form.age} onChange={e => setForm(f => ({...f, age: e.target.value}))} placeholder="9" required error={errors.age} />
      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <Button variant="ghost" type="button" fullWidth onClick={onClose}>Cancel</Button>
        <Button type="submit" fullWidth loading={loading} icon={<Check size={14} />}>
          {isEdit ? 'Save changes' : 'Add student'}
        </Button>
      </div>
    </form>
  )
}

function StudentCard({ student, onEdit, onDelete, index }) {
  const hue = (student.name?.charCodeAt(0) || 0) * 137 % 360
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      layout
      className="glass-panel"
      style={{
        padding: '22px', cursor: 'default',
        transition: 'all var(--duration) var(--ease)',
        position: 'relative', overflow: 'hidden',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
    >
      {/* Subtle bg accent */}
      <div style={{
        position: 'absolute', top: 0, right: 0, width: 80, height: 80,
        background: `radial-gradient(circle at top right, hsla(${hue}, 60%, 50%, 0.06) 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 13,
          background: `hsl(${hue}, 40%, 15%)`,
          border: `1px solid hsl(${hue}, 50%, 30%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 18,
          color: `hsl(${hue}, 70%, 75%)`,
        }}>
          {student.name?.charAt(0).toUpperCase()}
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => onEdit(student)} style={{
            width: 30, height: 30, borderRadius: 8, border: '1px solid var(--border)',
            background: 'var(--bg-elevated)', color: 'var(--text-secondary)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all var(--duration-fast)',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--violet)'; e.currentTarget.style.color = 'var(--violet-soft)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
          >
            <Pencil size={13} />
          </button>
          <button onClick={() => onDelete(student)} style={{
            width: 30, height: 30, borderRadius: 8, border: '1px solid rgba(239,68,68,0.2)',
            background: 'var(--danger-dim)', color: 'var(--danger)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all var(--duration-fast)',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--danger-dim)'}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 10 }}>{student.name}</div>

      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
        <Badge color="violet" dot><GraduationCap size={10} style={{ marginRight: 2 }} />{student.className}</Badge>
        <Badge>Age {student.age}</Badge>
        {student.totalPapers > 0 && (
          <Badge color="cyan"><FileText size={10} style={{ marginRight: 2 }} />{student.totalPapers} {student.totalPapers === 1 ? 'paper' : 'papers'}</Badge>
        )}
      </div>

      {/* Student ID */}
      <div style={{ marginTop: 12, fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}>
        ID #{String(student.id).padStart(4, '0')}
      </div>
    </motion.div>
  )
}

export default function StudentsPage() {
  const [students, setStudents] = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [modal, setModal]       = useState(null)
  const debouncedSearch = useDebounce(search, 250)

  const load = () => {
    setLoading(true)
    optimizedStudentAPI.getAll()
      .then(r => setStudents(r.data.data || []))
      .catch(() => toast.error('Failed to load students'))
      .finally(() => setLoading(false))
  }
  
  useEffect(() => { load() }, [])

  const handleDelete = async (student) => {
    if (!confirm(`Delete "${student.name}"? All their papers and reports will also be removed.`)) return
    try {
      await optimizedStudentAPI.remove(student.id)
      toast.success(`${student.name} removed`)
      load()
    } catch { toast.error('Delete failed') }
  }

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    s.className.toLowerCase().includes(debouncedSearch.toLowerCase())
  )

  return (
    <div>
      <PageHeader
        title="Students"
        subtitle={loading ? 'Loading…' : `${students.length} enrolled student${students.length !== 1 ? 's' : ''}`}
        action={
          <Button icon={<UserPlus size={15} />} onClick={() => setModal('add')}>
            Add Student
          </Button>
        }
      />

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: 380, marginBottom: 24 }}>
        <Search size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or class…"
          style={{
            width: '100%', padding: '10px 14px 10px 38px',
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', color: 'var(--text-primary)',
            fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none',
            transition: 'border-color var(--duration)',
          }}
          onFocus={e  => e.target.style.borderColor = 'var(--border-focus)'}
          onBlur={e   => e.target.style.borderColor = 'var(--border)'}
        />
        {search && (
          <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={14} />
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {[0,1,2,3,4,5].map(i => <SkeletonCard key={i} rows={3} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <EmptyState
            icon={Users}
            title={search ? 'No students found' : 'No students yet'}
            description={search ? `No results for "${search}". Try a different search.` : 'Add your first student to start uploading papers and running AI analysis.'}
            action={!search && <Button icon={<UserPlus size={15} />} onClick={() => setModal('add')}>Add your first student</Button>}
          />
        </div>
      ) : (
        <motion.div layout style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          <AnimatePresence>
            {filtered.map((s, i) => (
              <StudentCard key={s.id} student={s} index={i} onEdit={(s) => setModal(s)} onDelete={handleDelete} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal === 'add' ? 'Add New Student' : 'Edit Student'}>
        {modal && (
          <StudentForm
            student={modal === 'add' ? null : modal}
            onClose={() => setModal(null)}
            onSave={load}
          />
        )}
      </Modal>
    </div>
  )
}
