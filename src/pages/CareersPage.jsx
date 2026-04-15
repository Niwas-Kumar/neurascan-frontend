import React from 'react'
import { Users, Code, Brain, Lightbulb } from 'lucide-react'
import PremiumNavbar from '../components/landing/PremiumNavbar.jsx'
import PremiumFooter from '../components/landing/PremiumFooter.jsx'

const S = {
  page: { minHeight: '100vh', background: '#F8FAFC' },
  hero: { background: 'linear-gradient(135deg, #312E81 0%, #4338CA 100%)', color: 'white', padding: '100px 24px 64px', textAlign: 'center' },
  heroTitle: { fontSize: 42, fontWeight: 800, marginBottom: 16, color: '#fff' },
  heroSub: { fontSize: 18, maxWidth: 600, margin: '0 auto', color: 'rgba(255,255,255,0.9)' },
  container: { maxWidth: 960, margin: '0 auto', padding: '64px 24px' },
  section: { marginBottom: 48 },
  sectionTitle: { fontSize: 24, fontWeight: 700, color: '#0F172A', marginBottom: 16 },
  text: { fontSize: 15, color: '#334155', lineHeight: 1.8, marginBottom: 16 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, marginBottom: 48 },
  card: { background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #E2E8F0', textAlign: 'center' },
  iconBox: { width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' },
  cardTitle: { fontSize: 16, fontWeight: 600, color: '#0F172A', marginBottom: 6 },
  cardText: { fontSize: 14, color: '#334155', lineHeight: 1.7 },
  comingSoon: { textAlign: 'center', padding: '48px 24px', background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0' },
  comingTitle: { fontSize: 22, fontWeight: 700, color: '#0F172A', marginBottom: 8 },
  comingText: { fontSize: 15, color: '#334155', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 },
  badge: { display: 'inline-block', padding: '6px 16px', borderRadius: 20, background: 'rgba(20,184,166,0.1)', color: '#14B8A6', fontWeight: 600, fontSize: 13, marginBottom: 16 },
}

const techStack = [
  { icon: Code, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', title: 'React + Vite', text: 'Modern frontend with component-based UI' },
  { icon: Brain, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', title: 'Python ML', text: 'CNN & OCR models for handwriting analysis' },
  { icon: Lightbulb, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', title: 'Spring Boot', text: 'Java backend with REST APIs & JWT auth' },
  { icon: Users, color: '#14b8a6', bg: 'rgba(20,184,166,0.1)', title: 'Firebase', text: 'Cloud Firestore, Auth & secure hosting' },
]

export default function CareersPage() {
  return (
    <div style={S.page}>
      <PremiumNavbar />
      <div style={S.hero}>
        <h1 style={S.heroTitle}>Careers</h1>
        <p style={S.heroSub}>NeuraScan is an academic project built by a team of 3 passionate developers.</p>
      </div>
      <div style={S.container}>
        <div style={S.section}>
          <h2 style={S.sectionTitle}>About the Project</h2>
          <p style={S.text}>
            NeuraScan is a final-year academic project focused on AI-powered learning disorder detection. Built as a full-stack application, it demonstrates the practical use of machine learning, cloud computing, and modern web development in the education domain.
          </p>
          <p style={S.text}>
            The project was developed by a team of 3 members — Niwas Kumar, Ratish Raj, and Lavit Tyagi — combining expertise in frontend development, backend engineering, and AI/ML research.
          </p>
        </div>

        <h2 style={S.sectionTitle}>Technology Stack</h2>
        <div style={S.grid}>
          {techStack.map(t => (
            <div key={t.title} style={S.card}>
              <div style={{ ...S.iconBox, background: t.bg }}><t.icon size={22} color={t.color} /></div>
              <h3 style={S.cardTitle}>{t.title}</h3>
              <p style={S.cardText}>{t.text}</p>
            </div>
          ))}
        </div>

        <div style={S.comingSoon}>
          <span style={S.badge}>Coming Soon</span>
          <h3 style={S.comingTitle}>Open Positions</h3>
          <p style={S.comingText}>
            We're currently an academic project team. If NeuraScan grows into a full product, career opportunities will be listed here. Stay tuned!
          </p>
        </div>
      </div>
      <PremiumFooter />
    </div>
  )
}
