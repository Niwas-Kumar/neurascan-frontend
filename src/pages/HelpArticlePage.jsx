import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import PremiumNavbar from '../components/landing/PremiumNavbar.jsx'
import PremiumFooter from '../components/landing/PremiumFooter.jsx'

const S = {
  page: { minHeight: '100vh', background: '#F8FAFC' },
  hero: { background: 'linear-gradient(135deg, #312E81 0%, #4338CA 100%)', color: 'white', padding: '100px 24px 48px', textAlign: 'center' },
  heroTitle: { fontSize: 36, fontWeight: 800, marginBottom: 12, maxWidth: 700, margin: '0 auto 12px', color: '#fff' },
  heroSub: { fontSize: 16, maxWidth: 600, margin: '0 auto', color: 'rgba(255,255,255,0.9)' },
  container: { maxWidth: 760, margin: '0 auto', padding: '48px 24px' },
  backLink: { display: 'inline-flex', alignItems: 'center', gap: 6, color: '#4338CA', fontWeight: 600, fontSize: 14, textDecoration: 'none', marginBottom: 32 },
  section: { marginBottom: 36 },
  title: { fontSize: 22, fontWeight: 700, color: '#0F172A', marginBottom: 12 },
  text: { fontSize: 15, color: '#334155', lineHeight: 1.8, marginBottom: 14 },
  list: { listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 },
  listItem: { display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 15, color: '#334155', lineHeight: 1.7 },
  tip: { background: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.2)', borderRadius: 12, padding: 20, marginBottom: 20 },
  tipTitle: { fontSize: 14, fontWeight: 700, color: '#14B8A6', marginBottom: 6 },
  tipText: { fontSize: 14, color: '#334155', lineHeight: 1.7 },
  step: { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #E2E8F0', marginBottom: 14 },
  stepNum: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 8, background: '#312E81', color: '#fff', fontSize: 13, fontWeight: 700, marginRight: 10 },
  stepTitle: { fontSize: 16, fontWeight: 600, color: '#0F172A', marginBottom: 6 },
  stepText: { fontSize: 14, color: '#334155', lineHeight: 1.7, marginLeft: 38 },
}

const ARTICLES = {
  'getting-started': {
    icon: '🚀',
    title: 'Getting Started with NeuroScan',
    subtitle: 'Set up your account and start analyzing handwriting in minutes.',
    sections: [
      { title: 'Create Your Account', content: 'Visit the NeuraScan registration page and sign up using your email address or Google account. Teachers need to provide their school name and select "Teacher" as their role during registration.' },
      { title: 'steps', items: [
        { num: 1, title: 'Register & verify email', text: 'Create your account and verify your email address via the OTP sent to your inbox.' },
        { num: 2, title: 'Set up your class', text: 'Navigate to the Classes section and create your first class. Add students by entering their name, roll number, and parent email.' },
        { num: 3, title: 'Upload a handwriting sample', text: 'Go to Upload, select a student, and upload a clear photo of their handwritten work (JPG or PNG).' },
        { num: 4, title: 'View AI analysis', text: 'The AI processes the image in seconds and generates a detailed report with risk assessment and recommendations.' },
      ]},
      { title: 'tip', tipTitle: 'Quick Tip', tipText: 'For best results, ensure the handwriting image is well-lit, in focus, and shot from directly above the paper. Avoid shadows and angled shots.' },
    ],
  },
  'uploading-and-scanning': {
    icon: '📱',
    title: 'How Uploading and Scanning Works',
    subtitle: 'Step-by-step guide to uploading student handwriting samples for AI analysis.',
    sections: [
      { title: 'Supported Formats', content: 'NeuraScan accepts JPG and PNG image formats. The maximum file size is 10MB. For best accuracy, use images with a resolution of at least 300 DPI.' },
      { title: 'steps', items: [
        { num: 1, title: 'Navigate to Upload', text: 'From your teacher dashboard, click the "Upload" tab in the sidebar navigation.' },
        { num: 2, title: 'Select a student', text: 'Choose the student whose handwriting you want to analyze from the dropdown list.' },
        { num: 3, title: 'Upload the image', text: 'Click "Choose File" or drag and drop the handwriting image. A preview will appear before submission.' },
        { num: 4, title: 'Submit for analysis', text: 'Click "Analyze" to send the image to the AI. Results typically appear within 5–10 seconds.' },
      ]},
      { title: 'What the AI Analyzes', content: 'The system runs two parallel analyses: CNN-based individual letter shape detection (checking for reversals, sizing issues, stroke patterns) and OCR-based text pattern recognition (checking for word-level errors, substitutions, and phonological patterns). Results from both are fused into a single assessment.' },
      { title: 'tip', tipTitle: 'Image Quality Matters', tipText: 'Blurry or low-contrast images may reduce detection accuracy. Use a scanner or a phone camera in good lighting for best results. Lined paper works well — blank paper is also fine.' },
    ],
  },
  'understanding-ai-results': {
    icon: '🧠',
    title: 'Understanding AI Analysis Results',
    subtitle: 'Learn how to read and interpret the AI-generated assessment reports.',
    sections: [
      { title: 'Report Overview', content: 'Each analysis report contains three main sections: Reading & Letter Recognition, Handwriting & Motor Skills, and a summary with actionable recommendations. The AI provides a risk level (Low, Moderate, or High) for both dyslexia and dysgraphia.' },
      { title: 'Reading & Letter Recognition', content: 'This section shows how well the student forms individual letters and whether patterns like letter reversals (b/d, p/q), inconsistent sizing, or unusual stroke order are detected. A higher score indicates stronger recognition patterns.' },
      { title: 'Handwriting & Motor Skills', content: 'The motor skills assessment measures five spatial features: letter height variation, baseline consistency, spacing uniformity, stroke fragmentation, and line alignment. These map to clinical indicators used in dysgraphia screening.' },
      { title: 'Risk Levels', list: [
        'Low Risk — The handwriting shows typical patterns. No immediate concern, but periodic screening is recommended.',
        'Moderate Risk — Some indicators detected. Consider a follow-up assessment and share the report with a specialist.',
        'High Risk — Multiple indicators suggest potential learning differences. Professional evaluation is strongly recommended.',
      ]},
      { title: 'tip', tipTitle: 'Important', tipText: 'NeuraScan is a screening tool, not a clinical diagnosis. A "High Risk" result means the student should be evaluated by a qualified educational psychologist — it does not confirm a learning disorder.' },
    ],
  },
  'creating-reports': {
    icon: '📊',
    title: 'Creating Custom Reports',
    subtitle: 'Generate and share detailed assessment reports with parents and specialists.',
    sections: [
      { title: 'Accessing Reports', content: 'Navigate to the Reports tab in your teacher dashboard. All completed analyses are listed here with the student name, date, and overall risk level. Click any report to view the full breakdown.' },
      { title: 'Comprehensive Reports', content: 'When both a handwriting analysis and quiz screening have been completed for a student, NeuraScan automatically generates a comprehensive (fused) report. This combines handwriting AI scores (37.5% weight) with quiz results (62.5% weight) for a more accurate overall assessment.' },
      { title: 'Sharing with Parents', content: 'Parents with linked accounts can view their child\'s reports directly through the Parent Dashboard. The AI commentary is written in plain, non-technical language so parents can understand the findings without any medical or technical background.' },
      { title: 'tip', tipTitle: 'Pro Tip', tipText: 'Encourage parents to complete the quiz screening for their child. The combined handwriting + quiz assessment provides significantly more reliable results than handwriting analysis alone.' },
    ],
  },
  'data-privacy': {
    icon: '🔒',
    title: 'Data Privacy and FERPA Compliance',
    subtitle: 'How NeuraScan protects student data and follows privacy regulations.',
    sections: [
      { title: 'Our Privacy Commitments', list: [
        'All data is encrypted in transit (TLS 1.3) and at rest using AES-256 encryption.',
        'Student records are accessible only to authorized teachers and linked parents.',
        'No student personally identifiable information (PII) is shared with third parties.',
        'Uploaded handwriting images are processed in-memory and not permanently stored after analysis.',
        'Teachers can only access reports for students in their own classes.',
      ]},
      { title: 'FERPA Alignment', content: 'While NeuraScan is primarily an academic project, it follows the Family Educational Rights and Privacy Act (FERPA) guidelines as a best-practice standard. Parents can view their child\'s assessment data at any time. Account deletion requests are honored — all associated data is permanently removed.' },
      { title: 'Authentication & Access Control', content: 'NeuraScan uses Firebase Authentication with JWT tokens. All API endpoints require authenticated tokens with role verification. Passwords are hashed with BCrypt (cost factor 12). Google OAuth 2.0 is supported for secure sign-in.' },
      { title: 'tip', tipTitle: 'Questions?', tipText: 'If you have concerns about data privacy, contact us at hello.neurascan@gmail.com. We take privacy seriously and will respond within 24 hours.' },
    ],
  },
  'two-factor-auth': {
    icon: '🔐',
    title: 'Two-Factor Authentication Setup',
    subtitle: 'Add an extra layer of security to your NeuraScan account.',
    sections: [
      { title: 'About Two-Factor Authentication', content: 'Two-factor authentication (2FA) adds a second verification step when you sign in, making it much harder for unauthorized users to access your account even if they know your password.' },
      { title: 'Current Security Features', list: [
        'Email-based OTP verification during registration',
        'Google OAuth sign-in with Google\'s built-in 2FA support',
        'JWT token-based session management with automatic expiry',
        'BCrypt password hashing for email/password accounts',
      ]},
      { title: 'Coming Soon', content: 'App-based 2FA (Google Authenticator, Authy) is planned for a future release. Currently, the strongest security option is to sign in with Google, which supports Google\'s own 2FA system including security keys and phone prompts.' },
      { title: 'tip', tipTitle: 'Recommendation', tipText: 'For maximum security, use "Sign in with Google" and enable 2FA on your Google account. This provides industry-standard two-factor protection for your NeuraScan access.' },
    ],
  },
  'managing-team': {
    icon: '👥',
    title: 'Managing Team Members',
    subtitle: 'Invite parents and collaborate with staff on student assessments.',
    sections: [
      { title: 'Adding Students', content: 'From your teacher dashboard, navigate to the Classes section. Select a class and click "Add Student." Enter the student\'s name, roll number, and their parent\'s email address. The parent will receive an invitation to create their account.' },
      { title: 'Parent Invitations', content: 'When you add a student with a parent email, NeuraScan sends an email invitation via SendGrid. The parent can then register, link to their child, and view assessment reports through their own dashboard.' },
      { title: 'Quiz Invitations', content: 'Teachers can send quiz screening invitations to parents. The parent receives an email with a link to complete a 120-question screening quiz about their child, covering reading, writing, attention, and comprehension domains.' },
      { title: 'Role-Based Access', list: [
        'Teachers can create classes, add students, upload papers, view reports, and send quiz invitations.',
        'Parents can view their linked child\'s reports, complete quizzes, and track progress over time.',
        'Each role sees only the data they are authorized to access — no cross-role data leaks.',
      ]},
    ],
  },
  'upgrading-plan': {
    icon: '⬆️',
    title: 'Upgrading Your Plan',
    subtitle: 'How to access premium features and manage your subscription.',
    sections: [
      { title: 'Available Plans', content: 'NeuraScan offers three tiers: Starter (₹9/month), Professional (₹49/month), and Enterprise (custom pricing). Each tier unlocks additional features like unlimited analysis, multi-user accounts, and advanced reporting.' },
      { title: 'Current Project Status', content: 'NeuraScan is currently an academic project and all features are available for free during the development and testing phase. The pricing page shows planned pricing for when the project launches as a full product.' },
      { title: 'What You Get Now (Free)', list: [
        'Unlimited handwriting analysis uploads',
        'AI-powered dyslexia and dysgraphia screening',
        'Parent dashboard with report access',
        'Quiz screening system (120 questions across 4 domains)',
        'Comprehensive fused reports (handwriting + quiz)',
        'Email notifications and quiz invitations',
      ]},
      { title: 'tip', tipTitle: 'Note', tipText: 'Since NeuraScan is currently a free academic project, no payment is required. All features shown on the Pricing page represent planned future tiers.' },
    ],
  },
}

export default function HelpArticlePage() {
  const { slug } = useParams()
  const article = ARTICLES[slug]

  if (!article) {
    return (
      <div style={S.page}>
        <PremiumNavbar />
        <div style={S.hero}>
          <h1 style={S.heroTitle}>Article Not Found</h1>
          <p style={S.heroSub}>The help article you're looking for doesn't exist.</p>
        </div>
        <div style={S.container}>
          <Link to="/help" style={S.backLink}><ArrowLeft size={16} /> Back to Help Center</Link>
        </div>
        <PremiumFooter />
      </div>
    )
  }

  return (
    <div style={S.page}>
      <PremiumNavbar />
      <div style={S.hero}>
        <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>{article.icon}</div>
        <h1 style={S.heroTitle}>{article.title}</h1>
        <p style={S.heroSub}>{article.subtitle}</p>
      </div>
      <div style={S.container}>
        <Link to="/help" style={S.backLink}><ArrowLeft size={16} /> Back to Help Center</Link>

        {article.sections.map((sec, i) => {
          if (sec.title === 'steps') {
            return (
              <div key={i} style={S.section}>
                {sec.items.map((step) => (
                  <div key={step.num} style={S.step}>
                    <div><span style={S.stepNum}>{step.num}</span><span style={{ fontWeight: 600, color: '#0F172A' }}>{step.title}</span></div>
                    <p style={S.stepText}>{step.text}</p>
                  </div>
                ))}
              </div>
            )
          }
          if (sec.title === 'tip') {
            return (
              <div key={i} style={S.tip}>
                <div style={S.tipTitle}>{sec.tipTitle}</div>
                <div style={S.tipText}>{sec.tipText}</div>
              </div>
            )
          }
          return (
            <div key={i} style={S.section}>
              <h2 style={S.title}>{sec.title}</h2>
              {sec.content && <p style={S.text}>{sec.content}</p>}
              {sec.list && (
                <ul style={S.list}>
                  {sec.list.map((item, j) => (
                    <li key={j} style={S.listItem}>
                      <CheckCircle size={18} color="#22c55e" style={{ flexShrink: 0, marginTop: 3 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        })}
      </div>
      <PremiumFooter />
    </div>
  )
}
