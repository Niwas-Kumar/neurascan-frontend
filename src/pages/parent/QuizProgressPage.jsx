import { useEffect, useState } from 'react'
import { BarChart, Calendar, CheckCircle, XCircle } from 'lucide-react'
import { quizAPI } from '../../services/api'
import { PageHeader, EmptyState, SkeletonCard, Badge, ScoreBar } from '../../components/shared/UI'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'

export default function QuizProgressPage() {
  const { user } = useAuth()
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    if (!user?.studentId) {
      toast.error('No linked student assigned yet')
      setLoading(false)
      return
    }

    quizAPI.getStudentResponses(user.studentId)
      .then(r => setResponses(r.data.data || []))
      .catch(() => toast.error('Could not load quiz progress'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [user?.studentId])

  const average = responses.length > 0 ? (responses.reduce((sum, x) => sum + (x.score || 0), 0) / responses.length).toFixed(1) : 0

  return (
    <div>
      <PageHeader
        title="Student Quiz Progress"
        subtitle={responses.length > 0 ? `Latest ${responses.length} submissions` : 'No submissions yet'}
      />

      <div style={{ display: 'flex', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
        <Badge icon={Calendar}>Records: {responses.length}</Badge>
        <Badge icon={BarChart}>Average: {average}%</Badge>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gap: 10 }}>
          {[1,2].map(i => <SkeletonCard key={i} rows={2} />)}
        </div>
      ) : (responses.length === 0 ? (
        <EmptyState icon={BarChart} title="No quiz data available" description="Ask teacher to assign or submit a quiz first." />
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          {responses.map(r => (
            <div key={r.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontWeight: 700 }}>{r.quizId}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: r.score >= 70 ? 'var(--success)' : r.score >= 45 ? 'var(--warning)' : 'var(--danger)' }}>
                  {r.score >= 70 ? <CheckCircle size={14} /> : <XCircle size={14} />}
                  {r.score}%
                </div>
              </div>
              <ScoreBar value={r.score} />
              <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}>Submitted: {new Date(r.submittedAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
