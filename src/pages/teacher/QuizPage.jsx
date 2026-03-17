import { useEffect, useState } from 'react'
import { PlusCircle, Send, BookOpen, CheckCircle, XCircle } from 'lucide-react'
import { quizAPI } from '../../services/api'
import { PageHeader, Button, Badge, EmptyState, SkeletonCard } from '../../components/shared/UI'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

export default function QuizPage() {
  const { user } = useAuth()
  const [quizzes, setQuizzes] = useState([])
  const [topic, setTopic] = useState('')
  const [text, setText] = useState('')
  const [questionCount, setQuestionCount] = useState(5)
  const [classId, setClassId] = useState('')
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  const [activeQuizId, setActiveQuizId] = useState(null)

  const load = () => {
    setLoading(true)
    quizAPI.getMyQuizzes()
      .then(r => setQuizzes(r.data.data || []))
      .catch(() => toast.error('Could not load quizzes'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [user?.userId])

  const handleCreateQuiz = async () => {
    if (!topic || !text) return toast.error('Topic and text required')
    setCreating(true)
    try {
      const payload = { topic, text, questionCount: Number(questionCount), classId }
      const res = await quizAPI.createQuiz(payload)
      toast.success('Quiz created successfully')
      setTopic(''); setText(''); setQuestionCount(5)
      load()
      if (res.data?.data?.id) setActiveQuizId(res.data.data.id)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create quiz')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Quiz Builder"
        subtitle="Create and manage class quizzes with AI-suggested questions"
        action={
          <button onClick={handleCreateQuiz} disabled={creating}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', fontWeight: 700, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', cursor: creating ? 'not-allowed' : 'pointer' }}>
            <PlusCircle size={15} /> Create Quiz
          </button>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Topic / Module</div>
          <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Grammar correction case" style={{ width: '100%', padding: 10, border: '1px solid var(--border)', borderRadius: 8, outline: 'none', background: 'var(--bg-default)' }} />

          <div style={{ fontSize: 13, fontWeight: 600, marginTop: 12 }}>Class ID (optional)</div>
          <input value={classId} onChange={e => setClassId(e.target.value)} placeholder="e.g. class-A" style={{ width: '100%', padding: 10, border: '1px solid var(--border)', borderRadius: 8, outline: 'none', background: 'var(--bg-default)' }} />

          <div style={{ fontSize: 13, fontWeight: 600, marginTop: 12 }}>Question Count</div>
          <input type="number" min={1} max={12} value={questionCount} onChange={e => setQuestionCount(e.target.value)} style={{ width: '100%', padding: 10, border: '1px solid var(--border)', borderRadius: 8, outline: 'none', background: 'var(--bg-default)' }} />
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Source Text for Quiz Generation</div>
          <textarea value={text} onChange={e => setText(e.target.value)} rows={9} placeholder="Paste student paper text or topic summary here..." style={{ width: '100%', padding: 10, border: '1px solid var(--border)', borderRadius: 8, outline: 'none', background: 'var(--bg-default)' }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 10 }}>
        <Badge icon={BookOpen} variant="secondary">Set topic and source text then click Create Quiz</Badge>
        <Badge icon={CheckCircle} variant="success">AI enriches questions from source</Badge>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gap: 12 }}>
          {[1,2,3].map(i => <SkeletonCard key={i} rows={3} />)}
        </div>
      ) : quizzes.length === 0 ? (
        <EmptyState icon={BookOpen} title="No quizzes created yet" description="Start by creating a new quiz above." />
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          {quizzes.map((q) => (
            <div key={q.id} style={{ border: q.id === activeQuizId ? '2px solid var(--success)' : '1px solid var(--border)', background: 'var(--bg-card)', borderRadius: 12, padding: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 8 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{q.topic}</div>
                  {q.classId && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Class {q.classId}</span>}
                </div>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(q.createdAt).toLocaleDateString()}</span>
              </div>
              <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Badge icon={Send}>Questions: {q.questions?.length ?? 0}</Badge>
                <Badge icon={CheckCircle}>Quiz ID {q.id.slice(0, 6)}</Badge>
              </div>
              <div style={{ marginTop: 12, display: 'grid', gap: 6 }}>
                {q.questions?.slice(0, 5).map((qq, idx) => (
                  <div key={qq.id} style={{ fontSize: 13, color: 'var(--text-secondary)' }}><strong>{idx + 1}.</strong> {qq.question}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
