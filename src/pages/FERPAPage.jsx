import React from 'react'
import { Shield, CheckCircle } from 'lucide-react'
import PremiumNavbar from '../components/landing/PremiumNavbar.jsx'
import PremiumFooter from '../components/landing/PremiumFooter.jsx'

const S = {
  page: { minHeight: '100vh', background: '#F8FAFC' },
  hero: { background: 'linear-gradient(135deg, #312E81 0%, #4338CA 100%)', color: 'white', padding: '100px 24px 64px', textAlign: 'center' },
  heroTitle: { fontSize: 42, fontWeight: 800, marginBottom: 16 },
  heroSub: { fontSize: 18, opacity: 0.85, maxWidth: 640, margin: '0 auto' },
  container: { maxWidth: 800, margin: '0 auto', padding: '64px 24px' },
  section: { marginBottom: 40 },
  title: { fontSize: 22, fontWeight: 700, color: '#0F172A', marginBottom: 12 },
  text: { fontSize: 15, color: '#475569', lineHeight: 1.8, marginBottom: 16 },
  list: { listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 },
  listItem: { display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 15, color: '#334155', lineHeight: 1.7 },
}

export default function FERPAPage() {
  return (
    <div style={S.page}>
      <PremiumNavbar />
      <div style={S.hero}>
        <h1 style={S.heroTitle}>FERPA Compliance</h1>
        <p style={S.heroSub}>How NeuraScan aligns with the Family Educational Rights and Privacy Act to protect student records.</p>
      </div>
      <div style={S.container}>
        <div style={S.section}>
          <h2 style={S.title}>What is FERPA?</h2>
          <p style={S.text}>The Family Educational Rights and Privacy Act (FERPA) is a US federal law that protects the privacy of student education records. It applies to all schools that receive funding from the US Department of Education. While NeuraScan operates primarily in India, we follow FERPA guidelines as a best-practice standard for student data protection globally.</p>
        </div>

        <div style={S.section}>
          <h2 style={S.title}>Our Commitments</h2>
          <ul style={S.list}>
            {[
              'Student data is accessible only to authorised teachers and linked parents — never shared with third parties.',
              'Analysis reports are stored securely in Google Cloud Firestore with collection-level security rules.',
              'Parents can view their child\'s assessment data at any time through the parent dashboard.',
              'No student personally identifiable information (PII) is used for advertising or marketing.',
              'Teachers can only access reports for students in their classes.',
              'All data transmission is encrypted via TLS 1.3.',
              'Account deletion requests are honoured — all associated student data is permanently removed.',
            ].map((item, i) => (
              <li key={i} style={S.listItem}><CheckCircle size={18} color="#22c55e" style={{ flexShrink: 0, marginTop: 3 }} />{item}</li>
            ))}
          </ul>
        </div>

        <div style={S.section}>
          <h2 style={S.title}>Data Retention</h2>
          <p style={S.text}>Assessment reports and student records are retained for the duration of the school year. Teachers and administrators can request bulk deletion at any time. Uploaded handwriting images are processed in-memory by the AI service and are not permanently stored after analysis.</p>
        </div>

        <div style={S.section}>
          <h2 style={S.title}>Questions?</h2>
          <p style={S.text}>If you have questions about data privacy, contact us at <a href="mailto:hello.neurascan@gmail.com" style={{ color: '#14B8A6', fontWeight: 600, textDecoration: 'none' }}>hello.neurascan@gmail.com</a>.</p>
        </div>
      </div>
      <PremiumFooter />
    </div>
  )
}
