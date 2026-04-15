import React from 'react'
import { Calendar, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import PremiumNavbar from '../components/landing/PremiumNavbar.jsx'
import PremiumFooter from '../components/landing/PremiumFooter.jsx'

const S = {
  page: { minHeight: '100vh', background: '#F8FAFC' },
  hero: { background: 'linear-gradient(135deg, #312E81 0%, #4338CA 100%)', color: 'white', padding: '100px 24px 64px', textAlign: 'center' },
  heroTitle: { fontSize: 42, fontWeight: 800, marginBottom: 16, color: '#fff' },
  heroSub: { fontSize: 18, maxWidth: 600, margin: '0 auto', color: 'rgba(255,255,255,0.9)' },
  container: { maxWidth: 960, margin: '0 auto', padding: '64px 24px' },
  card: { background: '#fff', borderRadius: 16, padding: 28, border: '1px solid #E2E8F0', marginBottom: 24, transition: 'box-shadow 0.2s' },
  tag: { display: 'inline-block', fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 20, marginRight: 8 },
  title: { fontSize: 22, fontWeight: 700, color: '#0F172A', marginBottom: 8, marginTop: 12 },
  text: { fontSize: 14, color: '#334155', lineHeight: 1.8 },
  date: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#475569' },
  readMore: { display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 14, fontWeight: 600, color: '#14B8A6', marginTop: 12, textDecoration: 'none' },
}

const posts = [
  { date: 'April 10, 2026', tag: 'Product Update', tagColor: '#3b82f6', tagBg: 'rgba(59,130,246,0.1)', title: 'Introducing Evidence-Based AI Assessment Commentary', excerpt: 'Our latest update transforms AI analysis results into clear, parent-friendly language. Teachers and parents can now understand assessment findings without any technical knowledge.' },
  { date: 'March 22, 2026', tag: 'Research', tagColor: '#8b5cf6', tagBg: 'rgba(139,92,246,0.1)', title: 'How CNN + OCR Fusion Improves Dyslexia Detection', excerpt: 'We combine convolutional neural networks for individual letter analysis with OCR-based text pattern recognition. This multi-signal approach achieves higher accuracy than either method alone.' },
  { date: 'March 5, 2026', tag: 'Education', tagColor: '#14b8a6', tagBg: 'rgba(20,184,166,0.1)', title: 'Early Intervention: Why Screening Before Age 8 Matters', excerpt: 'Research shows that children identified with learning differences before age 8 respond significantly better to intervention. NeuraScan makes early screening accessible to every classroom.' },
  { date: 'February 18, 2026', tag: 'Feature', tagColor: '#f59e0b', tagBg: 'rgba(245,158,11,0.1)', title: 'Quiz Screening System: 120 Questions Across 4 Domains', excerpt: 'Our new quiz module covers reading, writing, attention, and comprehension with age-appropriate questions. Combined with handwriting analysis, it provides a comprehensive learning profile.' },
]

export default function BlogPage() {
  return (
    <div style={S.page}>
      <PremiumNavbar />
      <div style={S.hero}>
        <h1 style={S.heroTitle}>Blog</h1>
        <p style={S.heroSub}>Insights on learning disorders, AI in education, and product updates from the NeuraScan team.</p>
      </div>
      <div style={S.container}>
        {posts.map((p, i) => (
          <div key={i} style={S.card} onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)'} onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
              <span style={S.date}><Calendar size={14} />{p.date}</span>
              <span style={{ ...S.tag, color: p.tagColor, background: p.tagBg }}>{p.tag}</span>
            </div>
            <h2 style={S.title}>{p.title}</h2>
            <p style={S.text}>{p.excerpt}</p>
            <Link to="#" style={S.readMore}>Read more <ArrowRight size={14} /></Link>
          </div>
        ))}
      </div>
      <PremiumFooter />
    </div>
  )
}
