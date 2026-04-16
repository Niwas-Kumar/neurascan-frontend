import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Send, Trash2, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { notesAPI } from '../../services/api'

const COLORS = {
  bgBase: '#F8FAFC',
  textPrimary: '#1E293B',
  textMuted: '#64748B',
  border: '#E2E8F0',
  primary: '#1a73e8',
}

export default function StudentNotesPanel({ studentId, role }) {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [newNote, setNewNote] = useState('')
  const [visibleToParent, setVisibleToParent] = useState(true)
  const [sending, setSending] = useState(false)

  const isTeacher = role === 'ROLE_TEACHER'

  useEffect(() => {
    if (studentId) loadNotes()
  }, [studentId])

  const loadNotes = async () => {
    try {
      const res = isTeacher
        ? await notesAPI.getForTeacher(studentId)
        : await notesAPI.getForParent(studentId)
      setNotes(res.data?.data || [])
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async () => {
    if (!newNote.trim()) return
    setSending(true)
    try {
      await notesAPI.create(studentId, newNote.trim(), visibleToParent)
      setNewNote('')
      await loadNotes()
      toast.success('Note added')
    } catch {
      toast.error('Failed to add note')
    } finally {
      setSending(false)
    }
  }

  const handleDelete = async (noteId) => {
    try {
      await notesAPI.remove(noteId)
      setNotes(prev => prev.filter(n => n.id !== noteId))
      toast.success('Note deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  const toggleVisibility = async (note) => {
    try {
      await notesAPI.update(note.id, { visibleToParent: !note.visibleToParent })
      setNotes(prev => prev.map(n => n.id === note.id ? { ...n, visibleToParent: !n.visibleToParent } : n))
    } catch {
      toast.error('Failed to update')
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <MessageSquare size={16} color={COLORS.primary} />
        <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.textPrimary }}>
          Notes {notes.length > 0 && `(${notes.length})`}
        </span>
      </div>

      {isTeacher && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <textarea
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
              placeholder="Write a note..."
              rows={2}
              style={{
                flex: 1, padding: '8px 12px', borderRadius: 8,
                border: `1px solid ${COLORS.border}`, fontSize: 13,
                resize: 'vertical', fontFamily: 'inherit', outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = COLORS.primary}
              onBlur={e => e.target.style.borderColor = COLORS.border}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              disabled={sending || !newNote.trim()}
              style={{
                width: 38, height: 38, borderRadius: 10, border: 'none',
                background: COLORS.primary, color: '#fff', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: sending || !newNote.trim() ? 0.5 : 1,
                alignSelf: 'flex-end',
              }}
            >
              <Send size={16} />
            </motion.button>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, fontSize: 12, color: COLORS.textMuted, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={visibleToParent}
              onChange={e => setVisibleToParent(e.target.checked)}
              style={{ accentColor: COLORS.primary }}
            />
            Visible to parent
          </label>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 20, color: COLORS.textMuted, fontSize: 13 }}>Loading...</div>
      ) : notes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 20, color: COLORS.textMuted, fontSize: 13 }}>No notes yet</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 300, overflowY: 'auto' }}>
          <AnimatePresence>
            {notes.map(note => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                style={{
                  padding: '10px 14px', borderRadius: 10,
                  border: `1px solid ${COLORS.border}`, background: '#fff',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.textPrimary }}>{note.authorName}</span>
                  <span style={{ fontSize: 11, color: COLORS.textMuted }}>
                    {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : ''}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: COLORS.textPrimary, margin: 0, lineHeight: 1.5 }}>{note.content}</p>
                {isTeacher && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button
                      onClick={() => toggleVisibility(note)}
                      title={note.visibleToParent ? 'Visible to parent' : 'Hidden from parent'}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer', padding: 2,
                        color: note.visibleToParent ? '#059669' : COLORS.textMuted,
                      }}
                    >
                      {note.visibleToParent ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <button
                      onClick={() => handleDelete(note.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: '#DC2626' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
