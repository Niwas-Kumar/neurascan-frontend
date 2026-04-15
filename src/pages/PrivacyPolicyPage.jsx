import { Link } from 'react-router-dom'
import { NeuraScanLogo } from '../components/shared/Logo'

const COLORS = {
  bgBase: '#F8FAFC',
  bgSurface: '#FFFFFF',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#334155',
  border: '#E2E8F0',
  primary: '#14B8A6',
}

export default function PrivacyPolicyPage() {
  return (
    <div style={{ minHeight: '100vh', background: COLORS.bgBase }}>
      {/* Header */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 40px', background: COLORS.bgSurface,
        borderBottom: `1px solid ${COLORS.border}`,
      }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <NeuraScanLogo size={32} />
          <span style={{ fontWeight: 700, fontSize: 18, color: COLORS.textPrimary }}>NeuraScan</span>
        </Link>
        <Link to="/" style={{ color: COLORS.primary, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
          ← Back to Home
        </Link>
      </header>

      {/* Content */}
      <main style={{
        maxWidth: 780, margin: '40px auto', padding: '40px',
        background: COLORS.bgSurface, borderRadius: 16,
        border: `1px solid ${COLORS.border}`,
      }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: COLORS.textPrimary, marginBottom: 8 }}>
          Privacy Policy
        </h1>
        <p style={{ fontSize: 14, color: COLORS.textMuted, marginBottom: 32 }}>
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <Section title="1. Information We Collect">
          <p>We collect information you provide directly to us, including:</p>
          <ul>
            <li><strong>Account Information:</strong> Name, email address, and role (Teacher/Parent) when you create an account.</li>
            <li><strong>Student Data:</strong> Student names, class information, roll numbers, and ages entered by teachers.</li>
            <li><strong>Handwriting Samples:</strong> Images of handwriting uploaded for AI-based learning disability screening analysis.</li>
            <li><strong>Quiz Data:</strong> Quiz responses and performance scores submitted by students.</li>
          </ul>
        </Section>

        <Section title="2. How We Use Your Information">
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our AI-based learning disability screening services.</li>
            <li>Process handwriting samples through our machine learning models for analysis.</li>
            <li>Generate educational reports and progress tracking for teachers and parents.</li>
            <li>Send email notifications related to your account (OTP verification, quiz invitations).</li>
            <li>Ensure the security and integrity of our platform.</li>
          </ul>
        </Section>

        <Section title="3. Data Storage and Security">
          <p>
            Your data is stored securely using Google Firebase/Firestore with industry-standard encryption at rest and in transit.
            We implement appropriate technical and organizational measures to protect your personal information, including:
          </p>
          <ul>
            <li>End-to-end HTTPS encryption for all data transmission.</li>
            <li>JWT-based authentication with secure token management.</li>
            <li>Role-based access control (RBAC) to restrict data access.</li>
            <li>Rate limiting on sensitive endpoints to prevent abuse.</li>
          </ul>
        </Section>

        <Section title="4. Data Sharing">
          <p>
            We do not sell, trade, or otherwise transfer your personal information to outside parties. Student data is only accessible to:
          </p>
          <ul>
            <li>The teacher who created the student record.</li>
            <li>Parents who have verified their relationship with the student through our OTP-based verification system.</li>
          </ul>
        </Section>

        <Section title="5. Children's Privacy">
          <p>
            NeuraScan is designed for use by educators and parents. Student data is entered and managed exclusively by authorized adults (teachers and verified parents).
            We do not knowingly collect personal information directly from children under 13. All student interactions are mediated through their teacher or parent accounts.
          </p>
        </Section>

        <Section title="6. Data Retention">
          <p>
            We retain your personal information for as long as your account is active or as needed to provide our services.
            You may request deletion of your account and associated data by contacting us.
          </p>
        </Section>

        <Section title="7. Your Rights">
          <p>You have the right to:</p>
          <ul>
            <li>Access the personal information we hold about you.</li>
            <li>Request correction of inaccurate data.</li>
            <li>Request deletion of your data.</li>
            <li>Object to processing of your personal information.</li>
          </ul>
        </Section>

        <Section title="8. Contact Us">
          <p>
            If you have any questions about this Privacy Policy, please contact us at{' '}
            <a href="mailto:support@neurascan.com" style={{ color: COLORS.primary }}>support@neurascan.com</a>.
          </p>
        </Section>
      </main>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: COLORS.textPrimary, marginBottom: 12 }}>{title}</h2>
      <div style={{ fontSize: 14, color: COLORS.textSecondary, lineHeight: 1.8 }}>{children}</div>
    </section>
  )
}
