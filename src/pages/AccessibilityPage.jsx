import React from 'react'
import { Eye, Monitor, Keyboard, Type, CheckCircle } from 'lucide-react'
import PremiumNavbar from '../components/landing/PremiumNavbar.jsx'
import PremiumFooter from '../components/landing/PremiumFooter.jsx'

const S = {
  page: { minHeight: '100vh', background: '#F8FAFC' },
  hero: { background: 'linear-gradient(135deg, #312E81 0%, #4338CA 100%)', color: 'white', padding: '100px 24px 64px', textAlign: 'center' },
  heroTitle: { fontSize: 42, fontWeight: 800, marginBottom: 16 },
  heroSub: { fontSize: 18, opacity: 0.85, maxWidth: 640, margin: '0 auto' },
  container: { maxWidth: 800, margin: '0 auto', padding: '64px 24px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24, marginBottom: 48 },
  card: { background: '#fff', borderRadius: 14, padding: 24, border: '1px solid #E2E8F0' },
  iconBox: { width: 44, height: 44, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  cardTitle: { fontSize: 16, fontWeight: 600, color: '#0F172A', marginBottom: 8 },
  cardText: { fontSize: 14, color: '#64748B', lineHeight: 1.7 },
  section: { marginBottom: 40 },
  title: { fontSize: 22, fontWeight: 700, color: '#0F172A', marginBottom: 12 },
  text: { fontSize: 15, color: '#475569', lineHeight: 1.8, marginBottom: 16 },
  list: { listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 },
  listItem: { display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 15, color: '#334155', lineHeight: 1.7 },
}

const features = [
  { icon: Monitor, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', title: 'Responsive Design', text: 'Full functionality on desktop, tablet, and mobile devices with adaptive layouts.' },
  { icon: Type, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', title: 'Readable Typography', text: 'Minimum 14px body text, 1.6+ line height, and high contrast colour ratios (WCAG AA).' },
  { icon: Keyboard, color: '#14b8a6', bg: 'rgba(20,184,166,0.1)', title: 'Keyboard Navigation', text: 'All interactive elements are reachable via keyboard. Tab order follows visual layout.' },
  { icon: Eye, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', title: 'Screen Reader Support', text: 'Semantic HTML, ARIA labels, and alt text for images ensure compatibility with assistive technology.' },
]

export default function AccessibilityPage() {
  return (
    <div style={S.page}>
      <PremiumNavbar />
      <div style={S.hero}>
        <h1 style={S.heroTitle}>Accessibility</h1>
        <p style={S.heroSub}>NeuraScan is designed to be usable by everyone — including people with disabilities.</p>
      </div>
      <div style={S.container}>
        <div style={S.grid}>
          {features.map(f => (
            <div key={f.title} style={S.card}>
              <div style={{ ...S.iconBox, background: f.bg }}><f.icon size={20} color={f.color} /></div>
              <h3 style={S.cardTitle}>{f.title}</h3>
              <p style={S.cardText}>{f.text}</p>
            </div>
          ))}
        </div>

        <div style={S.section}>
          <h2 style={S.title}>WCAG 2.1 Conformance</h2>
          <p style={S.text}>We target Level AA conformance with the Web Content Accessibility Guidelines 2.1. Key measures include:</p>
          <ul style={S.list}>
            {[
              'Colour contrast ratios of at least 4.5:1 for normal text and 3:1 for large text',
              'Focus indicators visible on all interactive elements',
              'Form fields with associated labels and descriptive error messages',
              'No content that relies solely on colour to convey information',
              'Motion and animation reduced for users with prefers-reduced-motion enabled',
            ].map((item, i) => (
              <li key={i} style={S.listItem}><CheckCircle size={18} color="#22c55e" style={{ flexShrink: 0, marginTop: 3 }} />{item}</li>
            ))}
          </ul>
        </div>

        <div style={S.section}>
          <h2 style={S.title}>Feedback</h2>
          <p style={S.text}>If you encounter an accessibility barrier, please email <a href="mailto:hello.neurascan@gmail.com" style={{ color: '#14B8A6', fontWeight: 600, textDecoration: 'none' }}>hello.neurascan@gmail.com</a> and we will address it promptly.</p>
        </div>
      </div>
      <PremiumFooter />
    </div>
  )
}
