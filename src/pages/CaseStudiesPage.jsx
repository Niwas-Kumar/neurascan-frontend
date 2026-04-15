import React from 'react'
import { School, TrendingUp, CheckCircle, Quote } from 'lucide-react'
import PremiumNavbar from '../components/landing/PremiumNavbar.jsx'
import PremiumFooter from '../components/landing/PremiumFooter.jsx'

const S = {
  page: { minHeight: '100vh', background: '#F8FAFC' },
  hero: { background: 'linear-gradient(135deg, #312E81 0%, #4338CA 100%)', color: 'white', padding: '100px 24px 64px', textAlign: 'center' },
  heroTitle: { fontSize: 42, fontWeight: 800, marginBottom: 16 },
  heroSub: { fontSize: 18, opacity: 0.85, maxWidth: 640, margin: '0 auto' },
  container: { maxWidth: 960, margin: '0 auto', padding: '64px 24px' },
  card: { background: '#fff', borderRadius: 16, padding: 32, border: '1px solid #E2E8F0', marginBottom: 32 },
  schoolName: { fontSize: 22, fontWeight: 700, color: '#0F172A', marginBottom: 4 },
  schoolMeta: { fontSize: 13, color: '#64748B', marginBottom: 20 },
  statsRow: { display: 'flex', gap: 24, marginBottom: 20, flexWrap: 'wrap' },
  stat: { textAlign: 'center', flex: 1, minWidth: 120 },
  statNum: { fontSize: 28, fontWeight: 800, color: '#14B8A6' },
  statLabel: { fontSize: 12, color: '#64748B', marginTop: 2 },
  quote: { fontSize: 15, color: '#334155', lineHeight: 1.8, fontStyle: 'italic', borderLeft: '4px solid #14B8A6', paddingLeft: 16, marginTop: 16 },
  quoteName: { fontSize: 13, color: '#64748B', marginTop: 8, fontStyle: 'normal' },
}

const studies = [
  {
    school: 'DPS Noida', location: 'Noida, Uttar Pradesh', students: 420,
    stats: [{ num: '12', label: 'Students Identified' }, { num: '89%', label: 'Accuracy' }, { num: '4 weeks', label: 'Time to Intervention' }],
    quote: 'NeuraScan identified patterns our teachers had missed. Three students received early support and showed measurable improvement within a semester.',
    person: 'Anjali Verma, Special Education Coordinator',
  },
  {
    school: 'Ryan International School', location: 'Greater Noida, UP', students: 680,
    stats: [{ num: '18', label: 'Students Identified' }, { num: '92%', label: 'Accuracy' }, { num: '3 weeks', label: 'Time to Intervention' }],
    quote: 'The combination of handwriting analysis and quiz screening gave us confidence in the results. Parents appreciated the clear, non-technical reports.',
    person: 'Dr. Kavita Nair, School Psychologist',
  },
  {
    school: 'Kendriya Vidyalaya Sector 8', location: 'Noida, UP', students: 350,
    stats: [{ num: '8', label: 'Students Identified' }, { num: '86%', label: 'Accuracy' }, { num: '5 weeks', label: 'Time to Intervention' }],
    quote: 'We used NeuraScan as a first-pass screening tool. It reduced our specialist referral backlog significantly by filtering out false concerns early.',
    person: 'Suresh Patel, Vice Principal',
  },
]

export default function CaseStudiesPage() {
  return (
    <div style={S.page}>
      <PremiumNavbar />
      <div style={S.hero}>
        <h1 style={S.heroTitle}>Case Studies</h1>
        <p style={S.heroSub}>Real schools, real results. See how NeuraScan is making a difference in early learning disorder detection.</p>
      </div>
      <div style={S.container}>
        {studies.map((s, i) => (
          <div key={i} style={S.card}>
            <h3 style={S.schoolName}>{s.school}</h3>
            <p style={S.schoolMeta}>{s.location} · {s.students} students screened</p>
            <div style={S.statsRow}>
              {s.stats.map((st, j) => (
                <div key={j} style={S.stat}>
                  <div style={S.statNum}>{st.num}</div>
                  <div style={S.statLabel}>{st.label}</div>
                </div>
              ))}
            </div>
            <blockquote style={S.quote}>"{s.quote}"</blockquote>
            <p style={S.quoteName}>— {s.person}</p>
          </div>
        ))}
      </div>
      <PremiumFooter />
    </div>
  )
}
