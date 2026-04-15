import React from 'react'
import { Database, Cloud, BookOpen, BarChart3 } from 'lucide-react'
import PremiumNavbar from '../components/landing/PremiumNavbar.jsx'
import PremiumFooter from '../components/landing/PremiumFooter.jsx'

const S = {
  page: { minHeight: '100vh', background: '#F8FAFC' },
  hero: { background: 'linear-gradient(135deg, #312E81 0%, #4338CA 100%)', color: 'white', padding: '100px 24px 64px', textAlign: 'center' },
  heroTitle: { fontSize: 42, fontWeight: 800, marginBottom: 16 },
  heroSub: { fontSize: 18, opacity: 0.85, maxWidth: 600, margin: '0 auto' },
  container: { maxWidth: 960, margin: '0 auto', padding: '64px 24px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 28 },
  card: { background: '#fff', borderRadius: 16, padding: 28, border: '1px solid #E2E8F0' },
  iconBox: { width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 18, fontWeight: 700, color: '#0F172A', marginBottom: 8 },
  cardText: { fontSize: 14, color: '#64748B', lineHeight: 1.7 },
  tag: { display: 'inline-block', fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20, marginTop: 12 },
}

const integrations = [
  { icon: Database, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', title: 'Google Firebase', text: 'Cloud Firestore for real-time data storage, Firebase Auth for secure authentication, and Firebase Hosting for fast global delivery.', tag: 'Core', tagColor: '#f59e0b', tagBg: 'rgba(245,158,11,0.12)' },
  { icon: Cloud, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', title: 'HuggingFace Spaces', text: 'Our ML models are deployed on HuggingFace Spaces — providing scalable, GPU-accelerated inference for handwriting analysis.', tag: 'AI/ML', tagColor: '#3b82f6', tagBg: 'rgba(59,130,246,0.12)' },
  { icon: BookOpen, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', title: 'SendGrid Email', text: 'Transactional emails for OTP verification, quiz invitations, and parent notifications powered by Twilio SendGrid.', tag: 'Communication', tagColor: '#8b5cf6', tagBg: 'rgba(139,92,246,0.12)' },
  { icon: BarChart3, color: '#14b8a6', bg: 'rgba(20,184,166,0.1)', title: 'Render Cloud', text: 'Backend Spring Boot API hosted on Render with auto-scaling, health monitoring, and zero-downtime deployments.', tag: 'Hosting', tagColor: '#14b8a6', tagBg: 'rgba(20,184,166,0.12)' },
]

export default function IntegrationsPage() {
  return (
    <div style={S.page}>
      <PremiumNavbar />
      <div style={S.hero}>
        <h1 style={S.heroTitle}>Integrations</h1>
        <p style={S.heroSub}>NeuraScan works seamlessly with industry-leading platforms to deliver a reliable experience.</p>
      </div>
      <div style={S.container}>
        <div style={S.grid}>
          {integrations.map(f => (
            <div key={f.title} style={S.card}>
              <div style={{ ...S.iconBox, background: f.bg }}><f.icon size={22} color={f.color} /></div>
              <h3 style={S.cardTitle}>{f.title}</h3>
              <p style={S.cardText}>{f.text}</p>
              <span style={{ ...S.tag, color: f.tagColor, background: f.tagBg }}>{f.tag}</span>
            </div>
          ))}
        </div>
      </div>
      <PremiumFooter />
    </div>
  )
}
