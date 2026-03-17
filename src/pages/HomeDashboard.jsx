import { useNavigate } from 'react-router-dom'
import { Button } from '../components/shared/UI'

export default function HomeDashboard() {
  const navigate = useNavigate()

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
      <section style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{ fontSize: 40, marginBottom: 16 }}>Welcome to NeuraScan</h1>
        <p style={{ fontSize: 16, color: 'var(--text-muted)', marginBottom: 24, maxWidth: 760, marginLeft: 'auto', marginRight: 'auto' }}>
          Intelligent handwriting analysis for educators and parents. Track student progress, detect learning risks, and improve outcomes with AI-powered insights.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Button variant="primary" onClick={() => navigate('/login')}>
            Login
          </Button>
          <Button variant="outline" onClick={() => navigate('/register')}>
            Register
          </Button>
        </div>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        <div className="glass-panel" style={{ padding: 20 }}>
          <h3>Secure Role-based Access</h3>
          <p>Separate experiences for teachers and parents with protected routes and detailed permissions.</p>
        </div>
        <div className="glass-panel" style={{ padding: 20 }}>
          <h3>AI Handwriting Evaluation</h3>
          <p>Analyze uploaded papers with OCR and ML, including risk scores, reading level, and improvement recommendations.</p>
        </div>
        <div className="glass-panel" style={{ padding: 20 }}>
          <h3>Quiz & Progress Tracking</h3>
          <p>Create quizzes from analysis results, review student performance, and share progress with parents.</p>
        </div>
        <div className="glass-panel" style={{ padding: 20 }}>
          <h3>Instant Reporting</h3>
          <p>Generate and download teachers' reports, analytics, and class-level insights for informed interventions.</p>
        </div>
      </section>
    </div>
  )
}
