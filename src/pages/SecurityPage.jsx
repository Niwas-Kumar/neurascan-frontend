import React from 'react'
import { Shield, Lock, Eye, Server, CheckCircle } from 'lucide-react'
import PremiumNavbar from '../components/landing/PremiumNavbar.jsx'
import PremiumFooter from '../components/landing/PremiumFooter.jsx'

const S = {
  page: { minHeight: '100vh', background: '#F8FAFC' },
  hero: { background: 'linear-gradient(135deg, #312E81 0%, #4338CA 100%)', color: 'white', padding: '100px 24px 64px', textAlign: 'center' },
  heroTitle: { fontSize: 42, fontWeight: 800, marginBottom: 16 },
  heroSub: { fontSize: 18, opacity: 0.85, maxWidth: 600, margin: '0 auto' },
  container: { maxWidth: 960, margin: '0 auto', padding: '64px 24px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 28, marginBottom: 48 },
  card: { background: '#fff', borderRadius: 16, padding: 28, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
  iconBox: { width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 18, fontWeight: 700, color: '#0F172A', marginBottom: 8 },
  cardText: { fontSize: 14, color: '#64748B', lineHeight: 1.7 },
  section: { marginBottom: 48 },
  sectionTitle: { fontSize: 28, fontWeight: 700, color: '#0F172A', marginBottom: 16 },
  list: { listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 },
  listItem: { display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 15, color: '#334155', lineHeight: 1.7 },
}

const features = [
  { icon: Lock, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', title: 'End-to-End Encryption', text: 'All data is encrypted in transit (TLS 1.3) and at rest using AES-256. Student records are never exposed in plaintext.' },
  { icon: Shield, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', title: 'FERPA Compliant', text: 'We follow the Family Educational Rights and Privacy Act guidelines ensuring student data is protected and access-controlled.' },
  { icon: Eye, color: '#14b8a6', bg: 'rgba(20,184,166,0.1)', title: 'Role-Based Access', text: 'Teachers and parents see only the data they are authorised to access. JWT-based authentication with scoped permissions.' },
  { icon: Server, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', title: 'Secure Infrastructure', text: 'Hosted on Google Cloud with Firebase security rules, automated backups, and 24/7 monitoring for threat detection.' },
]

const practices = [
  'All API endpoints require authenticated JWT tokens with role verification',
  'Passwords are hashed with BCrypt (cost factor 12) — never stored in plaintext',
  'Google OAuth 2.0 integration with Firebase Authentication for secure sign-in',
  'Firestore security rules restrict read/write access per collection and user role',
  'Rate limiting and input validation on all public-facing endpoints',
  'Regular dependency audits and vulnerability scanning',
  'No student PII is shared with third-party analytics or advertising services',
]

export default function SecurityPage() {
  return (
    <div style={S.page}>
      <PremiumNavbar />
      <div style={S.hero}>
        <h1 style={S.heroTitle}>Security & Privacy</h1>
        <p style={S.heroSub}>Protecting student data is our top priority. Here's how we keep your information safe.</p>
      </div>
      <div style={S.container}>
        <div style={S.grid}>
          {features.map(f => (
            <div key={f.title} style={S.card}>
              <div style={{ ...S.iconBox, background: f.bg }}><f.icon size={22} color={f.color} /></div>
              <h3 style={S.cardTitle}>{f.title}</h3>
              <p style={S.cardText}>{f.text}</p>
            </div>
          ))}
        </div>
        <div style={S.section}>
          <h2 style={S.sectionTitle}>Our Security Practices</h2>
          <ul style={S.list}>
            {practices.map((p, i) => (
              <li key={i} style={S.listItem}><CheckCircle size={18} color="#22c55e" style={{ flexShrink: 0, marginTop: 2 }} />{p}</li>
            ))}
          </ul>
        </div>
      </div>
      <PremiumFooter />
    </div>
  )
}
