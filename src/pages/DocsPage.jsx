import React from 'react'
import { BookOpen, Code, Upload, FileText, Shield, BarChart3, Users, Brain } from 'lucide-react'
import PremiumNavbar from '../components/landing/PremiumNavbar.jsx'
import PremiumFooter from '../components/landing/PremiumFooter.jsx'

const S = {
  page: { minHeight: '100vh', background: '#F8FAFC' },
  hero: { background: 'linear-gradient(135deg, #312E81 0%, #4338CA 100%)', color: 'white', padding: '100px 24px 64px', textAlign: 'center' },
  heroTitle: { fontSize: 42, fontWeight: 800, marginBottom: 16 },
  heroSub: { fontSize: 18, maxWidth: 640, margin: '0 auto' },
  container: { maxWidth: 960, margin: '0 auto', padding: '64px 24px' },
  section: { marginBottom: 48 },
  sectionTitle: { fontSize: 24, fontWeight: 700, color: '#0F172A', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 },
  card: { background: '#fff', borderRadius: 14, padding: '20px 24px', border: '1px solid #E2E8F0', marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: 600, color: '#0F172A', marginBottom: 6 },
  cardText: { fontSize: 14, color: '#334155', lineHeight: 1.7 },
  code: { fontFamily: 'monospace', background: '#F1F5F9', padding: '2px 8px', borderRadius: 6, fontSize: 13, color: '#312E81' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 14 },
  th: { textAlign: 'left', padding: '10px 14px', background: '#F1F5F9', fontWeight: 600, color: '#0F172A', borderBottom: '2px solid #E2E8F0' },
  td: { padding: '10px 14px', borderBottom: '1px solid #E2E8F0', color: '#334155' },
}

const endpoints = [
  { method: 'POST', path: '/api/auth/firebase-login', desc: 'Google OAuth sign-in/registration' },
  { method: 'POST', path: '/api/auth/teacher/login', desc: 'Teacher email/password login' },
  { method: 'POST', path: '/api/analysis/upload/{studentId}', desc: 'Upload handwriting sample for AI analysis' },
  { method: 'GET', path: '/api/analysis/reports/{teacherId}', desc: 'Get all reports for a teacher' },
  { method: 'GET', path: '/api/analysis/comprehensive/{studentId}', desc: 'Fused report (handwriting + quiz)' },
  { method: 'POST', path: '/api/quiz/send', desc: 'Send quiz invitation to parent' },
]

export default function DocsPage() {
  return (
    <div style={S.page}>
      <PremiumNavbar />
      <div style={S.hero}>
        <h1 style={S.heroTitle}>Documentation</h1>
        <p style={S.heroSub}>Technical guide for understanding NeuraScan's architecture, API, and how the AI detection pipeline works.</p>
      </div>
      <div style={S.container}>
        <div style={S.section}>
          <h2 style={S.sectionTitle}><Code size={22} color="#3b82f6" />Architecture Overview</h2>
          <div style={S.card}>
            <p style={S.cardText}>
              NeuraScan uses a <strong>three-tier architecture</strong>: a React frontend (Vite), a Java Spring Boot backend, and a Python ML service deployed on HuggingFace Spaces.
              Data is stored in Google Cloud Firestore. Authentication uses Firebase Auth with JWT tokens for session management.
            </p>
          </div>
        </div>

        <div style={S.section}>
          <h2 style={S.sectionTitle}><Upload size={22} color="#8b5cf6" />How Analysis Works</h2>
          <div style={S.card}>
            <h4 style={S.cardTitle}>1. Image Upload</h4>
            <p style={S.cardText}>Teacher uploads a handwriting sample image (JPG/PNG). The backend validates and forwards it to the Python AI service.</p>
          </div>
          <div style={S.card}>
            <h4 style={S.cardTitle}>2. AI Processing</h4>
            <p style={S.cardText}>The Python service runs CNN analysis on individual letters and OCR text-pattern analysis. Results are fused (CNN 60%, OCR 40%) into a final dyslexia score. Dysgraphia is assessed via spatial feature extraction (height variation, baseline deviation, spacing, fragmentation).</p>
          </div>
          <div style={S.card}>
            <h4 style={S.cardTitle}>3. Report Generation</h4>
            <p style={S.cardText}>Scores, risk level, and a human-readable AI commentary are stored as an AnalysisReport in Firestore and returned to the frontend.</p>
          </div>
        </div>

        <div style={S.section}>
          <h2 style={S.sectionTitle}><FileText size={22} color="#14b8a6" />API Endpoints</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={S.table}>
              <thead>
                <tr><th style={S.th}>Method</th><th style={S.th}>Endpoint</th><th style={S.th}>Description</th></tr>
              </thead>
              <tbody>
                {endpoints.map((e, i) => (
                  <tr key={i}>
                    <td style={S.td}><span style={{ ...S.code, color: e.method === 'POST' ? '#8b5cf6' : '#14b8a6' }}>{e.method}</span></td>
                    <td style={S.td}><span style={S.code}>{e.path}</span></td>
                    <td style={S.td}>{e.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={S.section}>
          <h2 style={S.sectionTitle}><Shield size={22} color="#f59e0b" />Authentication</h2>
          <div style={S.card}>
            <p style={S.cardText}>
              Users authenticate via Google OAuth (Firebase) or email/password. The backend issues a JWT token containing <span style={S.code}>role</span>, <span style={S.code}>userId</span>, and <span style={S.code}>email</span>.
              All protected endpoints validate this token via the <span style={S.code}>JwtAuthenticationFilter</span>.
            </p>
          </div>
        </div>
      </div>
      <PremiumFooter />
    </div>
  )
}
