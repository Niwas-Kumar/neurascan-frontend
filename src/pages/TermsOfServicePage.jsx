import { Link } from 'react-router-dom'
import { NeuraScanLogo } from '../components/shared/Logo'

const COLORS = {
  bgBase: '#F8FAFC',
  bgSurface: '#FFFFFF',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#64748B',
  border: '#E2E8F0',
  primary: '#14B8A6',
}

export default function TermsOfServicePage() {
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
          Terms of Service
        </h1>
        <p style={{ fontSize: 14, color: COLORS.textMuted, marginBottom: 32 }}>
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <Section title="1. Acceptance of Terms">
          <p>
            By accessing or using NeuraScan ("the Service"), you agree to be bound by these Terms of Service.
            If you do not agree to these terms, you may not use the Service.
          </p>
        </Section>

        <Section title="2. Description of Service">
          <p>
            NeuraScan is an AI-powered educational platform that provides learning disability screening through
            handwriting analysis and behavioral assessments. The Service includes:
          </p>
          <ul>
            <li>AI-based handwriting analysis for early detection of potential learning disabilities.</li>
            <li>Quiz-based behavioral screening tools for educators.</li>
            <li>Student progress tracking and reporting for teachers and parents.</li>
            <li>Parent-teacher communication and student data sharing.</li>
          </ul>
        </Section>

        <Section title="3. User Accounts">
          <p>To use the Service, you must create an account. You are responsible for:</p>
          <ul>
            <li>Maintaining the confidentiality of your account credentials.</li>
            <li>All activities that occur under your account.</li>
            <li>Providing accurate and current information.</li>
            <li>Notifying us immediately of any unauthorized use of your account.</li>
          </ul>
        </Section>

        <Section title="4. Acceptable Use">
          <p>You agree not to:</p>
          <ul>
            <li>Use the Service for any unlawful purpose.</li>
            <li>Upload malicious content, viruses, or harmful code.</li>
            <li>Attempt to gain unauthorized access to other users' accounts or data.</li>
            <li>Use the Service to discriminate against or harm students in any way.</li>
            <li>Share student data with unauthorized third parties.</li>
            <li>Use automated tools to scrape or collect data from the Service.</li>
          </ul>
        </Section>

        <Section title="5. AI Analysis Disclaimer">
          <p>
            <strong>NeuraScan's AI analysis is intended for screening purposes only and does not constitute a medical
            or clinical diagnosis.</strong> The results should be used as one of many tools in identifying students
            who may benefit from further professional evaluation. We recommend consulting with qualified
            educational psychologists or medical professionals for definitive assessments.
          </p>
        </Section>

        <Section title="6. Intellectual Property">
          <p>
            The Service, including all content, features, and functionality, is owned by NeuraScan and is protected
            by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or
            create derivative works without our express permission.
          </p>
        </Section>

        <Section title="7. Data and Privacy">
          <p>
            Your use of the Service is also governed by our{' '}
            <Link to="/privacy-policy" style={{ color: COLORS.primary, fontWeight: 600 }}>Privacy Policy</Link>,
            which is incorporated into these Terms by reference.
          </p>
        </Section>

        <Section title="8. Limitation of Liability">
          <p>
            To the maximum extent permitted by law, NeuraScan shall not be liable for any indirect, incidental,
            special, consequential, or punitive damages arising from your use of the Service. Our total liability
            shall not exceed the amount you paid for the Service in the 12 months preceding the claim.
          </p>
        </Section>

        <Section title="9. Termination">
          <p>
            We reserve the right to suspend or terminate your account if you violate these Terms.
            Upon termination, your right to use the Service will cease immediately.
            You may request export of your data before account deletion.
          </p>
        </Section>

        <Section title="10. Changes to Terms">
          <p>
            We may update these Terms from time to time. We will notify you of material changes by posting
            the new Terms on this page and updating the "Last updated" date. Your continued use of the Service
            after changes constitutes acceptance of the new Terms.
          </p>
        </Section>

        <Section title="11. Contact Us">
          <p>
            If you have any questions about these Terms, please contact us at{' '}
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
