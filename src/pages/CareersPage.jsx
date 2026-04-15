import React from 'react'
import { Briefcase, MapPin, Clock } from 'lucide-react'
import PremiumNavbar from '../components/landing/PremiumNavbar.jsx'
import PremiumFooter from '../components/landing/PremiumFooter.jsx'

const S = {
  page: { minHeight: '100vh', background: '#F8FAFC' },
  hero: { background: 'linear-gradient(135deg, #312E81 0%, #4338CA 100%)', color: 'white', padding: '100px 24px 64px', textAlign: 'center' },
  heroTitle: { fontSize: 42, fontWeight: 800, marginBottom: 16 },
  heroSub: { fontSize: 18, opacity: 0.85, maxWidth: 600, margin: '0 auto' },
  container: { maxWidth: 960, margin: '0 auto', padding: '64px 24px' },
  card: { background: '#fff', borderRadius: 16, padding: 28, border: '1px solid #E2E8F0', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 700, color: '#0F172A', marginBottom: 6 },
  meta: { display: 'flex', gap: 20, fontSize: 13, color: '#64748B', marginBottom: 12, flexWrap: 'wrap' },
  metaItem: { display: 'flex', alignItems: 'center', gap: 5 },
  text: { fontSize: 14, color: '#475569', lineHeight: 1.7 },
  applyBtn: { display: 'inline-block', marginTop: 16, padding: '10px 24px', borderRadius: 10, background: '#14B8A6', color: 'white', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer' },
  emptySection: { textAlign: 'center', padding: '48px 24px' },
  emptyTitle: { fontSize: 22, fontWeight: 700, color: '#0F172A', marginBottom: 8 },
  emptyText: { fontSize: 15, color: '#64748B', maxWidth: 480, margin: '0 auto' },
}

const openings = [
  { title: 'ML Engineer — Learning Disorder Detection', dept: 'AI & Research', location: 'Noida, UP (Hybrid)', type: 'Full-time', desc: 'Build and improve CNN and NLP models for handwriting analysis and dyslexia detection. Experience with PyTorch/TensorFlow and computer vision required.' },
  { title: 'Full-Stack Developer (React + Spring Boot)', dept: 'Engineering', location: 'Noida, UP (Remote)', type: 'Full-time', desc: 'Work on our React frontend and Java Spring Boot backend. You\'ll ship features used by teachers and parents across India.' },
  { title: 'UX Designer — EdTech', dept: 'Design', location: 'Remote', type: 'Contract', desc: 'Design intuitive interfaces for educators and parents. Experience in education technology or accessibility-focused design is a plus.' },
]

export default function CareersPage() {
  return (
    <div style={S.page}>
      <PremiumNavbar />
      <div style={S.hero}>
        <h1 style={S.heroTitle}>Careers</h1>
        <p style={S.heroSub}>Join us in making learning disorder detection accessible to every school. We're building something meaningful.</p>
      </div>
      <div style={S.container}>
        {openings.map((job, i) => (
          <div key={i} style={S.card}>
            <h3 style={S.title}>{job.title}</h3>
            <div style={S.meta}>
              <span style={S.metaItem}><Briefcase size={14} />{job.dept}</span>
              <span style={S.metaItem}><MapPin size={14} />{job.location}</span>
              <span style={S.metaItem}><Clock size={14} />{job.type}</span>
            </div>
            <p style={S.text}>{job.desc}</p>
            <a href="mailto:hello.neurascan@gmail.com" style={{ ...S.applyBtn, textDecoration: 'none' }}>Apply Now</a>
          </div>
        ))}
      </div>
      <PremiumFooter />
    </div>
  )
}
